import { 
  ImportRecordStatus,
  ImportTargetDomain
} from '@manaratak/domain';
import { v4 as uuidv4 } from 'uuid';
import { IImportQueueGateway } from '../gateways/IImportQueueGateway';
import { LEGACY_DATATYPE_MAP } from '../utils/LegacyDataTypeMap';
import { InlineDataParser } from '../parsers/InlineDataParser';

export class ImportAdminUseCases {
  constructor(
    private readonly importRepository: any,
    private readonly importQueueGateway?: IImportQueueGateway
  ) {}

  async importData(input: {
    dataText: string;
    sourceSystem?: string;
    dataType?: string;
  }) {
    let rawRows: any[] = [];
    const text = input.dataText.trim();
    let dataType = input.dataType || ImportTargetDomain.Generic;
    if (LEGACY_DATATYPE_MAP[dataType]) {
      dataType = LEGACY_DATATYPE_MAP[dataType];
    }

    if (!(Object.values(ImportTargetDomain) as string[]).includes(dataType)) {
      throw new Error(`Unsupported import target domain dataType: ${dataType}`);
    }
    
    const INLINE_IMPORT_MAX_LENGTH = 90 * 1024;
    if (text.length > INLINE_IMPORT_MAX_LENGTH) {
      throw new Error('Import payload is too large. Large imports must use the future artifact/EAP import flow. Inline dataText is only for small/manual imports.');
    }

    rawRows = await InlineDataParser.parse(text);

    const batch = await this.importRepository.createBatch({
      sourceSystem: input.sourceSystem || 'ADMIN_CONSOLE',
      dataType: dataType,
      batchStatus: 'PROCESSING',
      totalRecords: rawRows.length,
      processedRecords: 0,
      failedRecords: 0,
    });

    let processedCount = 0;
    let failedCount = 0;
    let stagedRecordsCount = 0;
    let skippedDuplicatesCount = 0;
    const recordsToReturn: any[] = [];
    const seenDedupKeys = new Set<string>();
    const CHUNK_SIZE = 500;

    try {
      for (let i = 0; i < rawRows.length; i += CHUNK_SIZE) {
        const chunk = rawRows.slice(i, i + CHUNK_SIZE);
        const recordsToCreate = [];

        for (let j = 0; j < chunk.length; j++) {
          const rawPayload = chunk[j];
          const sourceRowNumber = rawPayload._sourceRowNumber || (i + j + 1);

          let normalizedPayload: any;
          let status: string;
          let validationErrors: any = null;
          let sourceDedupKey = '';

          // Generic normalization for all domains
          const name = (rawPayload.name || rawPayload.displayName || rawPayload.title || rawPayload.itemName || rawPayload.testName || 'Unnamed Record').trim();
          normalizedPayload = {
            ...rawPayload,
            displayName: name,
            _sourceRowNumber: sourceRowNumber,
          };

          sourceDedupKey = `${dataType}|${name}`.toLowerCase();

          if (name && name !== 'Unnamed Record') {
            if (seenDedupKeys.has(sourceDedupKey)) {
              skippedDuplicatesCount++;
              processedCount++;
              // If it's a duplicate in the same batch, we count it as skipped but also as processed
              // so that totalRecords = processedRecords + failedRecords
              continue;
            }
            seenDedupKeys.add(sourceDedupKey);
          }

          // Simple generic validation: check if it has a name
          if (!name || name === 'Unnamed Record') {
            status = ImportRecordStatus.INCOMPLETE;
            validationErrors = ['name'];
            failedCount++;
          } else {
            status = ImportRecordStatus.COMPLETE;
            processedCount++;
          }

          const recId = `rec-${uuidv4().substring(0, 8)}`;
          recordsToCreate.push({
            id: recId,
            batchId: batch.id,
            status,
            rawPayload: normalizedPayload,
            validationErrors,
            processingNotes: `Source row ${sourceRowNumber}`,
            sourceDedupKey,
            chunkIndex: Math.floor((sourceRowNumber - 1) / CHUNK_SIZE),
            sourceRowNumber,
          });
        }

        if (recordsToCreate.length > 0) {
          if (typeof this.importRepository.bulkCreateRecords === 'function') {
            const res = await this.importRepository.bulkCreateRecords(recordsToCreate);
            stagedRecordsCount += res.count;
          } else {
            for (const record of recordsToCreate) {
              await this.importRepository.createRecord(record);
              stagedRecordsCount++;
            }
          }

          if (recordsToReturn.length < 100) {
            recordsToReturn.push(...recordsToCreate.map(r => ({ ...r })).slice(0, 100 - recordsToReturn.length));
          }
        }
      }

      const updatedBatch = await this.importRepository.updateBatchStats(batch.id, {
        totalRecords: rawRows.length,
        processedRecords: processedCount,
        failedRecords: failedCount,
        batchStatus: 'COMPLETED',
      });
      
      const finalBatch = updatedBatch || {
        ...batch,
        totalRecords: rawRows.length,
        processedRecords: processedCount,
        failedRecords: failedCount,
        batchStatus: 'COMPLETED',
      };
      
      return { 
        batch: finalBatch, 
        summary: {
          totalRecords: rawRows.length,
          processedRecords: processedCount,
          failedRecords: failedCount,
          stagedRecords: stagedRecordsCount,
          skippedDuplicates: skippedDuplicatesCount,
        },
        records: recordsToReturn 
      };
    } catch (err: any) {
      await this.importRepository.updateBatchStats(batch.id, {
        totalRecords: rawRows.length,
        processedRecords: processedCount,
        failedRecords: failedCount,
        batchStatus: 'FAILED',
      });
      throw err;
    }
  }

    async listBatches(filters?: any) {
    if (filters?.dataType === 'INTERNATIONAL_TESTS') {
      filters.dataType = 'TESTS';
    }
    return this.importRepository.listBatches(filters);
  }

  async listRecords(filters?: any) {
    const f = { ...(filters || {}) };
    if (f.dataType === 'INTERNATIONAL_TESTS') {
      f.dataType = 'TESTS';
    }

    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 50;
    const MAX_PAGE_SIZE = 100;

    let page = parseInt(f.page, 10);
    if (isNaN(page) || page < 1) {
      page = DEFAULT_PAGE;
    }

    let pageSize = parseInt(f.pageSize, 10);
    if (isNaN(pageSize) || pageSize < 1) {
      pageSize = DEFAULT_PAGE_SIZE;
    } else if (pageSize > MAX_PAGE_SIZE) {
      pageSize = MAX_PAGE_SIZE;
    }

    f.page = page;
    f.pageSize = pageSize;

    return this.importRepository.listRecords(f);
  }

  async getQueueJobStatus(batchId: string) {
    if (!this.importQueueGateway) {
      return null;
    }
    return this.importQueueGateway.getJobStatus(batchId);
  }

  async pauseQueueJob(batchId: string, reason?: string): Promise<boolean> {
    if (!this.importQueueGateway) {
      return false;
    }
    return this.importQueueGateway.pauseJob({ batchId, reason });
  }

  async resumeQueueJob(batchId: string): Promise<boolean> {
    if (!this.importQueueGateway) {
      return false;
    }
    return this.importQueueGateway.resumeJob({ batchId });
  }

  async cancelQueueJob(batchId: string, reason?: string): Promise<boolean> {
    if (!this.importQueueGateway) {
      return false;
    }
    return this.importQueueGateway.cancelJob({ batchId, reason });
  }

  async replayQueueJob(batchId: string, fromCheckpoint?: boolean): Promise<boolean> {
    if (!this.importQueueGateway) {
      return false;
    }
    return this.importQueueGateway.replayJob({ batchId, fromCheckpoint });
  }
}
