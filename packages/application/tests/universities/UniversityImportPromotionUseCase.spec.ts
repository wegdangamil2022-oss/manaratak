import { describe, expect, it, vi } from 'vitest';
import { UniversityImportPromotionUseCase } from '../../src/universities/use-cases/UniversityImportPromotionUseCase';
import {
  ImportRecordDto,
  ImportRecordStatus,
  IUniversityRepository,
  UniversityImportCompletenessState,
  UniversityStatus
} from '@manaratak/domain';

describe('UniversityImportPromotionUseCase', () => {
  const createMockRepo = (): IUniversityRepository => ({
    create: vi.fn().mockImplementation(async (data) => ({ id: 'uni-1', createdAt: new Date(), updatedAt: new Date(), ...data })),
    findByDedupKey: vi.fn().mockResolvedValue(null),
    findById: vi.fn(),
    findByPublicId: vi.fn(),
    findBySlug: vi.fn(),
    updateStatus: vi.fn(),
    updateImportLink: vi.fn(),
    listByStatus: vi.fn(),
  });

  const createRecord = (status: ImportRecordStatus, payload: Record<string, unknown>): ImportRecordDto => ({
    id: 'rec-1',
    batchId: 'batch-1',
    status,
    rawPayload: payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('rejects records that are not VALID or NEEDS_REVIEW', async () => {
    const repo = createMockRepo();
    const useCase = new UniversityImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.STAGED, {}));

    expect(result.type).toBe('REJECTED');
    if (result.type === 'REJECTED') {
      expect(result.reason).toContain('not VALID or NEEDS_REVIEW');
    }
  });

  it('creates an imported university from a trusted VALID import record', async () => {
    const repo = createMockRepo();
    const useCase = new UniversityImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.VALID, {
      universityName: 'Qatar University',
      officialWebsite: 'https://www.qu.edu.qa',
      country: 'Qatar', city: 'Doha',
      institutionType: 'Public University',
      officialSourceUrl: 'https://www.qu.edu.qa/about',
      foundedYear: 1973,
      campuses: [{ name: 'Main Campus' }]
    }));

    console.log(result); expect(result.type).toBe('CREATED');
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      displayName: 'Qatar University',
      canonicalName: 'Qatar University',
      canonicalDedupKey: 'qatar university|qatar|qu.edu.qa',
      status: UniversityStatus.IMPORTED,
      completenessStatus: UniversityImportCompletenessState.COMPLETE,
      sourceImportRecordId: 'rec-1',
      optionalFields: expect.objectContaining({
        campuses: [{ name: 'Main Campus' }]
      })
    }));
  });

  it('creates a review-ready university from NEEDS_REVIEW import records', async () => {
    const repo = createMockRepo();
    const useCase = new UniversityImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.NEEDS_REVIEW, {
      universityName: 'Qatar University',
      officialWebsite: 'https://www.qu.edu.qa',
      country: 'Qatar', city: 'Doha',
      institutionType: 'Public University'
    }));

    console.log(result); expect(result.type).toBe('CREATED');
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      status: UniversityStatus.READY_TO_REVIEW,
      completenessStatus: UniversityImportCompletenessState.NEEDS_REVIEW
    }));
  });

  it('returns DUPLICATE when a canonical university already exists', async () => {
    const repo = createMockRepo();
    repo.findByDedupKey = vi.fn().mockResolvedValue({ id: 'existing-1' });
    const useCase = new UniversityImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.VALID, {
      universityName: 'Qatar University',
      officialWebsite: 'https://www.qu.edu.qa',
      country: 'Qatar', city: 'Doha',
      institutionType: 'Public University',
      sourceUrl: 'https://www.qu.edu.qa/about'
    }));

    expect(result.type).toBe('DUPLICATE');
    if (result.type === 'DUPLICATE') {
      expect(result.existingId).toBe('existing-1');
    }
  });
});
