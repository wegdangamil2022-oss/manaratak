import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ImportAdminUseCases } from '@manaratak/application';
import { ImportTargetDomain } from '@manaratak/domain';

export class ImportAdminRouter {
  public static create(cradle: { 
    importAdminUseCases: ImportAdminUseCases;
    importRepository?: any;
    internationalTestImportPromotionUseCase?: any;
  }): Router {
    const router = Router();
    const { importAdminUseCases, importRepository, internationalTestImportPromotionUseCase } = cradle;

    const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };

    const INLINE_IMPORT_MAX_LENGTH = 90 * 1024; // 90KB max string length
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 50;
    const MAX_PAGE_SIZE = 100;
    
    const importBodySchema = z.object({
      dataText: z.string()
        .min(1, 'Import text or CSV content is required')
        .max(INLINE_IMPORT_MAX_LENGTH, 'Import payload is too large. Large imports must use the future artifact/EAP import flow. Inline dataText is only for small/manual imports.'),
      sourceSystem: z.string().optional(),
      dataType: z.nativeEnum(ImportTargetDomain)
        .or(z.literal('INTERNATIONAL_TESTS'))
        .optional()
        .transform(val => val === 'INTERNATIONAL_TESTS' ? ImportTargetDomain.Tests : val),
    });

    // POST /admin/imports
    router.post('/', asyncHandler(async (req: Request, res: Response) => {
       const payload = importBodySchema.parse(req.body);
       const result = await importAdminUseCases.importData(payload);
       res.status(201).json(result);
     }));

    // GET /admin/imports/queue/jobs/:batchId
    router.get('/queue/jobs/:batchId', asyncHandler(async (req: Request, res: Response) => {
      const batchId = req.params.batchId;
      const status = await importAdminUseCases.getQueueJobStatus(batchId);
      if (!status) {
        return res.status(404).json({ error: `Queue job status not found for batchId: ${batchId}` });
      }
      res.json(status);
    }));

    // POST /admin/imports/queue/jobs/:batchId/pause
    router.post('/queue/jobs/:batchId/pause', asyncHandler(async (req: Request, res: Response) => {
      const batchId = req.params.batchId;
      const { reason } = req.body || {};
      const success = await importAdminUseCases.pauseQueueJob(batchId, reason);
      if (!success) {
        return res.status(409).json({ error: 'Queue job action is not valid for current state or job does not exist.' });
      }
      res.json({ status: 'ok', action: 'pause', batchId });
    }));

    // POST /admin/imports/queue/jobs/:batchId/resume
    router.post('/queue/jobs/:batchId/resume', asyncHandler(async (req: Request, res: Response) => {
      const batchId = req.params.batchId;
      const success = await importAdminUseCases.resumeQueueJob(batchId);
      if (!success) {
        return res.status(409).json({ error: 'Queue job action is not valid for current state or job does not exist.' });
      }
      res.json({ status: 'ok', action: 'resume', batchId });
    }));

    // POST /admin/imports/queue/jobs/:batchId/cancel
    router.post('/queue/jobs/:batchId/cancel', asyncHandler(async (req: Request, res: Response) => {
      const batchId = req.params.batchId;
      const { reason } = req.body || {};
      const success = await importAdminUseCases.cancelQueueJob(batchId, reason);
      if (!success) {
        return res.status(409).json({ error: 'Queue job action is not valid for current state or job does not exist.' });
      }
      res.json({ status: 'ok', action: 'cancel', batchId });
    }));

    // POST /admin/imports/queue/jobs/:batchId/replay
    router.post('/queue/jobs/:batchId/replay', asyncHandler(async (req: Request, res: Response) => {
      const batchId = req.params.batchId;
      const { fromCheckpoint } = req.body || {};
      const success = await importAdminUseCases.replayQueueJob(batchId, typeof fromCheckpoint === 'boolean' ? fromCheckpoint : undefined);
      if (!success) {
        return res.status(409).json({ error: 'Queue job action is not valid for current state or job does not exist.' });
      }
      res.json({ status: 'ok', action: 'replay', batchId });
    }));

    // GET /admin/imports/batches
    router.get('/batches', asyncHandler(async (req: Request, res: Response) => {
      let dataTypeFilter = req.query.dataType === 'ALL' || !req.query.dataType ? undefined : req.query.dataType as string;
      if (dataTypeFilter === 'INTERNATIONAL_TESTS') {
        dataTypeFilter = ImportTargetDomain.Tests;
      }
      
      if (dataTypeFilter && !(Object.values(ImportTargetDomain) as string[]).includes(dataTypeFilter)) {
         return res.status(400).json({ error: 'Validation Error', details: [{ message: 'Invalid dataType filter' }] });
      }

      const batches = await importAdminUseCases.listBatches(dataTypeFilter ? { dataType: dataTypeFilter } : {});
      res.json(batches);
    }));

    // GET /admin/imports/records
    router.get('/records', asyncHandler(async (req: Request, res: Response) => {
      const batchId = req.query.batchId as string;
      const status = req.query.status as string;
      
      let dataTypeFilter = req.query.dataType === 'ALL' || !req.query.dataType ? undefined : req.query.dataType as string;
      if (dataTypeFilter === 'INTERNATIONAL_TESTS') {
        dataTypeFilter = ImportTargetDomain.Tests;
      }
      
      if (dataTypeFilter && !(Object.values(ImportTargetDomain) as string[]).includes(dataTypeFilter)) {
         return res.status(400).json({ error: 'Validation Error', details: [{ message: 'Invalid dataType filter' }] });
      }

      let page = parseInt(req.query.page as string, 10);
      if (isNaN(page) || page < 1) {
        page = DEFAULT_PAGE;
      }

      let pageSize = parseInt(req.query.pageSize as string, 10);
      if (isNaN(pageSize) || pageSize < 1) {
        pageSize = DEFAULT_PAGE_SIZE;
      } else if (pageSize > MAX_PAGE_SIZE) {
        pageSize = MAX_PAGE_SIZE;
      }

      const records = await importAdminUseCases.listRecords({
        batchId,
        status,
        dataType: dataTypeFilter,
        page,
        pageSize,
      });
      res.json(records);
    }));

    // POST /admin/imports/records/:id/promote
    router.post('/records/:id/promote', asyncHandler(async (req: Request, res: Response) => {
      const recordId = req.params.id;
      if (!importRepository) {
        return res.status(500).json({ error: 'Import repository not available' });
      }
      const record = await importRepository.getRecordById(recordId);
      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      }

      const batch = record.batch || await importRepository.getBatchById?.(record.batchId);
      const targetDomain = record.targetDomain || batch?.dataType;

      if (targetDomain === ImportTargetDomain.Tests || targetDomain === 'INTERNATIONAL_TESTS' || targetDomain === 'TESTS') {
        if (!internationalTestImportPromotionUseCase) {
           return res.status(500).json({ error: 'International Test promotion use case not available' });
        }
        
        const result = await internationalTestImportPromotionUseCase.promote(record);
        if (result.type === 'REJECTED' || result.type === 'FAILED') {
           return res.status(422).json(result);
        }
        return res.status(200).json(result);
      }
      
      res.status(422).json({ error: 'Domain promotion is disabled in Phase 06 and must be implemented by the owning domain phase.' });
    }));

    // POST /admin/imports/records/:id/transfer
    router.post('/records/:id/transfer', asyncHandler(async (req: Request, res: Response) => {
      res.status(422).json({ error: 'Domain promotion is disabled in Phase 06 and must be implemented by the owning domain phase.' });
    }));

    // POST /admin/imports/batches/:id/transfer
    router.post('/batches/:id/transfer', asyncHandler(async (req: Request, res: Response) => {
      res.status(422).json({ error: 'Domain promotion is disabled in Phase 06 and must be implemented by the owning domain phase.' });
    }));

    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: err.issues });
      }
      res.status(400).json({ error: err.message || 'An error occurred' });
    });

    return router;
  }
}
