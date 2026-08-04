import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { MajorStatus } from '@manaratak/domain';
import { MajorAdminRouter } from '../../../../src/presentation/api/router/MajorAdminRouter';

describe('MajorAdminRouter', () => {
  const createMockUseCases = () => ({
    listMajors: vi.fn(),
    getMajor: vi.fn(),
    updateMajor: vi.fn(),
    markReadyToReview: vi.fn(),
    markReadyToPublish: vi.fn(),
    publish: vi.fn(),
    unpublish: vi.fn(),
    reject: vi.fn(),
    archive: vi.fn(),
  });

  const createApp = (useCases: ReturnType<typeof createMockUseCases>) => {
    const app = express();
    app.use(express.json());
    app.use('/admin/majors', MajorAdminRouter.create({ adminMajorUseCases: useCases as any }));
    return app;
  };

  it('GET /admin/majors calls listMajors with parsed filters', async () => {
    const useCases = createMockUseCases();
    useCases.listMajors.mockResolvedValue({ data: [], total: 0, page: 2, pageSize: 20, totalPages: 0 });
    const app = createApp(useCases);

    const res = await request(app).get('/admin/majors?status=READY_TO_REVIEW&degreeLevel=Bachelor&page=2');

    expect(res.status).toBe(200);
    expect(useCases.listMajors).toHaveBeenCalledWith({
      status: MajorStatus.READY_TO_REVIEW,
      degreeLevel: 'Bachelor',
      page: 2,
      pageSize: 20
    });
  });

  it('PATCH /admin/majors/:id validates body and strips readonly fields', async () => {
    const useCases = createMockUseCases();
    useCases.updateMajor.mockResolvedValue({ id: 'major-1' });
    const app = createApp(useCases);

    const res = await request(app)
      .patch('/admin/majors/major-1')
      .send({
        id: 'injected',
        publicId: 'injected-public',
        displayName: 'Updated Computer Science',
        degreeLevel: 'Bachelor'
      });

    expect(res.status).toBe(200);
    expect(useCases.updateMajor).toHaveBeenCalledWith('major-1', expect.objectContaining({
      displayName: 'Updated Computer Science',
      degreeLevel: 'Bachelor'
    }));
    expect(useCases.updateMajor).toHaveBeenCalledWith('major-1', expect.not.objectContaining({
      id: 'injected',
      publicId: 'injected-public'
    }));
  });

  it('POST /admin/majors/:id/publish calls publish', async () => {
    const useCases = createMockUseCases();
    useCases.publish.mockResolvedValue(undefined);
    const app = createApp(useCases);

    const res = await request(app).post('/admin/majors/major-1/publish');

    expect(res.status).toBe(200);
    expect(useCases.publish).toHaveBeenCalledWith('major-1');
  });

  it('returns 400 on use case errors', async () => {
    const useCases = createMockUseCases();
    useCases.publish.mockRejectedValue(new Error('Only READY_TO_PUBLISH majors can be PUBLISHED'));
    const app = createApp(useCases);

    const res = await request(app).post('/admin/majors/major-1/publish');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Only READY_TO_PUBLISH majors can be PUBLISHED' });
  });
});
