import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { MajorStatus } from '@manaratak/domain';
import { AdminMajorUseCases } from '@manaratak/application';
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
    listVersions: vi.fn(),
    listLevelProfiles: vi.fn(),
    listContentSections: vi.fn(),
    listSources: vi.fn(),
  });

  const createApp = (useCases: ReturnType<typeof createMockUseCases>) => {
    const app = express();
    app.use(express.json());
    app.use('/admin/majors', MajorAdminRouter.create({ adminMajorUseCases: useCases as unknown as AdminMajorUseCases }));
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

  it('GET /admin/majors/:id/versions returns import versions', async () => {
    const useCases = createMockUseCases();
    useCases.listVersions.mockResolvedValue([{ id: 'version-1', versionNumber: 1 }]);
    const app = createApp(useCases);

    const res = await request(app).get('/admin/majors/major-1/versions');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [{ id: 'version-1', versionNumber: 1 }] });
    expect(useCases.listVersions).toHaveBeenCalledWith('major-1');
  });

  it('GET /admin/majors/:id/profiles returns level profiles', async () => {
    const useCases = createMockUseCases();
    useCases.listLevelProfiles.mockResolvedValue([{ id: 'profile-1', level: 'BACHELOR', code: 'MJR-0001' }]);
    const app = createApp(useCases);

    const res = await request(app).get('/admin/majors/major-1/profiles');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [{ id: 'profile-1', level: 'BACHELOR', code: 'MJR-0001' }] });
    expect(useCases.listLevelProfiles).toHaveBeenCalledWith('major-1');
  });

  it('GET /admin/majors/:id/content-sections returns detail dossier sections', async () => {
    const useCases = createMockUseCases();
    useCases.listContentSections.mockResolvedValue([{ id: 'section-1', sectionKey: '01-overview', title: 'النبذة' }]);
    const app = createApp(useCases);

    const res = await request(app).get('/admin/majors/major-1/content-sections');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [{ id: 'section-1', sectionKey: '01-overview', title: 'النبذة' }] });
    expect(useCases.listContentSections).toHaveBeenCalledWith('major-1');
  });

  it('GET /admin/majors/:id/sources returns import sources', async () => {
    const useCases = createMockUseCases();
    useCases.listSources.mockResolvedValue([{ id: 'source-1', sourceType: 'CATALOG_FILE' }]);
    const app = createApp(useCases);

    const res = await request(app).get('/admin/majors/major-1/sources');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [{ id: 'source-1', sourceType: 'CATALOG_FILE' }] });
    expect(useCases.listSources).toHaveBeenCalledWith('major-1');
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
