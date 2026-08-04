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
    getRecordById: vi.fn(),
    getBatchById: vi.fn(),
    listRecords: vi.fn(),
    updateRecord: vi.fn()
  });

  const createMockPromotionUseCase = () => ({
    promote: vi.fn()
  });

  const createApp = (useCases: any, repository?: any, promotionUseCase?: any, majorPromotionUseCase?: any, fellowshipPromotionUseCase?: any) => {
    const app = express();
    app.use(express.json());
    app.use('/admin/imports', ImportAdminRouter.create({
      importAdminUseCases: useCases,
      importRepository: repository,
      internationalTestImportPromotionUseCase: promotionUseCase,
      majorImportPromotionUseCase: majorPromotionUseCase,
      fellowshipImportPromotionUseCase: fellowshipPromotionUseCase
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

    it('routes MAJORS target to MajorImportPromotionUseCase and marks record promoted', async () => {
      const useCases = createMockUseCases();
      const repo = createMockRepository();
      const majorPromotionUseCase = createMockPromotionUseCase();

      repo.getRecordById.mockResolvedValue({ id: 'rec-major-1', targetDomain: ImportTargetDomain.Majors });
      majorPromotionUseCase.promote.mockResolvedValue({ type: 'CREATED', majorId: 'major-1' });

      const app = createApp(useCases, repo, undefined, majorPromotionUseCase);
      const res = await request(app).post('/admin/imports/records/rec-major-1/promote');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ type: 'CREATED', majorId: 'major-1' });
      expect(majorPromotionUseCase.promote).toHaveBeenCalledWith({ id: 'rec-major-1', targetDomain: ImportTargetDomain.Majors });
      expect(repo.updateRecord).toHaveBeenCalledWith('rec-major-1', expect.objectContaining({
        status: 'PROMOTED',
        promotedEntityId: 'major-1'
      }));
    });
  });

  describe('POST /admin/imports/batches/:id/promote', () => {
    it('promotes MAJORS batch records and returns a summary', async () => {
      const useCases = createMockUseCases();
      const repo = createMockRepository();
      const majorPromotionUseCase = createMockPromotionUseCase();

      repo.getBatchById.mockResolvedValue({ id: 'batch-major-1', dataType: ImportTargetDomain.Majors });
      repo.listRecords.mockResolvedValue({ data: [{ id: 'rec-1', batchId: 'batch-major-1', status: 'NEEDS_REVIEW' }], total: 1, page: 1, pageSize: 100 });
      majorPromotionUseCase.promote.mockResolvedValue({ type: 'VERSION_CREATED', existingId: 'major-1', versionNumber: 2 });

      const app = createApp(useCases, repo, undefined, majorPromotionUseCase);
      const res = await request(app).post('/admin/imports/batches/batch-major-1/promote');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        batchId: 'batch-major-1',
        dataType: ImportTargetDomain.Majors,
        promoted: 1,
        failed: 0
      });
      expect(repo.updateRecord).toHaveBeenCalledWith('rec-1', expect.objectContaining({
        status: 'PROMOTED',
        promotedEntityId: 'major-1'
      }));
    });

    it('promotes FELLOWSHIPS batch records through the dedicated fellowship path', async () => {
      const useCases = createMockUseCases();
      const repo = createMockRepository();
      const fellowshipPromotionUseCase = createMockPromotionUseCase();

      repo.getBatchById.mockResolvedValue({ id: 'batch-fellowship-1', dataType: ImportTargetDomain.Fellowships });
      repo.listRecords.mockResolvedValue({ data: [{ id: 'rec-fel-1', batchId: 'batch-fellowship-1', status: 'NEEDS_REVIEW' }], total: 1, page: 1, pageSize: 100 });
      fellowshipPromotionUseCase.promote.mockResolvedValue({ type: 'CREATED', fellowshipId: 'fellowship-1' });

      const app = createApp(useCases, repo, undefined, createMockPromotionUseCase(), fellowshipPromotionUseCase);
      const res = await request(app).post('/admin/imports/batches/batch-fellowship-1/promote');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        batchId: 'batch-fellowship-1',
        dataType: ImportTargetDomain.Fellowships,
        promoted: 1,
        failed: 0
      });
      expect(fellowshipPromotionUseCase.promote).toHaveBeenCalledWith(expect.objectContaining({
        id: 'rec-fel-1',
        batch: { id: 'batch-fellowship-1', dataType: ImportTargetDomain.Fellowships }
      }));
      expect(repo.updateRecord).toHaveBeenCalledWith('rec-fel-1', expect.objectContaining({
        status: 'PROMOTED',
        promotedEntityId: 'fellowship-1'
      }));
    });
  });
});
