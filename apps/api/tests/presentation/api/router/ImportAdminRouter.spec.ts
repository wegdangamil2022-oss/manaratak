import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { ImportAdminRouter } from '../../../../src/presentation/api/router/ImportAdminRouter';
import { ImportTargetDomain } from '@manaratak/domain';

describe('ImportAdminRouter', () => {
  const createMockUseCases = () => ({
    importData: vi.fn(),
    getQueueJobStatus: vi.fn(),
    pauseQueueJob: vi.fn(),
    resumeQueueJob: vi.fn(),
    cancelQueueJob: vi.fn(),
    replayQueueJob: vi.fn(),
    listBatches: vi.fn(),
    listRecords: vi.fn()
  });
  
  const createMockRepository = () => ({
    getRecordById: vi.fn()
  });

  const createMockPromotionUseCase = () => ({
    promote: vi.fn()
  });

  const createApp = (useCases: any, repository?: any, promotionUseCase?: any) => {
    const app = express();
    app.use(express.json());
    app.use('/admin/imports', ImportAdminRouter.create({
      importAdminUseCases: useCases,
      importRepository: repository,
      internationalTestImportPromotionUseCase: promotionUseCase
    }));
    return app;
  };

  describe('POST /admin/imports/records/:id/promote', () => {
    it('returns 422 for unsupported domains safely', async () => {
      const useCases = createMockUseCases();
      const repo = createMockRepository();
      repo.getRecordById.mockResolvedValue({ id: 'rec-1', targetDomain: ImportTargetDomain.Universities });
      
      const app = createApp(useCases, repo);
      const res = await request(app).post('/admin/imports/records/rec-1/promote');
      
      expect(res.status).toBe(422);
      expect(res.body.error).toContain('Domain promotion is disabled in Phase 06');
    });

    it('routes TESTS target to InternationalTestImportPromotionUseCase safely', async () => {
      const useCases = createMockUseCases();
      const repo = createMockRepository();
      const promoteUseCase = createMockPromotionUseCase();
      
      repo.getRecordById.mockResolvedValue({ id: 'rec-1', targetDomain: ImportTargetDomain.Tests });
      promoteUseCase.promote.mockResolvedValue({ type: 'CREATED', testId: 'new-test-id' });
      
      const app = createApp(useCases, repo, promoteUseCase);
      const res = await request(app).post('/admin/imports/records/rec-1/promote');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ type: 'CREATED', testId: 'new-test-id' });
      expect(promoteUseCase.promote).toHaveBeenCalledWith({ id: 'rec-1', targetDomain: ImportTargetDomain.Tests });
    });

    it('returns safe 422 response if use case returns REJECTED', async () => {
      const useCases = createMockUseCases();
      const repo = createMockRepository();
      const promoteUseCase = createMockPromotionUseCase();
      
      repo.getRecordById.mockResolvedValue({ id: 'rec-1', targetDomain: ImportTargetDomain.Tests });
      promoteUseCase.promote.mockResolvedValue({ type: 'REJECTED', reason: 'Invalid payload' });
      
      const app = createApp(useCases, repo, promoteUseCase);
      const res = await request(app).post('/admin/imports/records/rec-1/promote');
      
      expect(res.status).toBe(422);
      expect(res.body).toEqual({ type: 'REJECTED', reason: 'Invalid payload' });
    });
  });
});
