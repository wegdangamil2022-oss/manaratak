import { describe, expect, it, vi } from 'vitest';
import {
  IMajorRepository,
  ImportRecordDto,
  ImportRecordStatus,
  MajorImportCompletenessState,
  MajorStatus
} from '@manaratak/domain';
import { MajorImportPromotionUseCase } from '../../src/majors/use-cases/MajorImportPromotionUseCase';

describe('MajorImportPromotionUseCase', () => {
  const createMockRepo = (): IMajorRepository => ({
    create: vi.fn().mockImplementation(async (data) => ({ id: 'major-1', createdAt: new Date(), updatedAt: new Date(), ...data })),
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
    const useCase = new MajorImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.STAGED, {}));

    expect(result.type).toBe('REJECTED');
    if (result.type === 'REJECTED') {
      expect(result.reason).toContain('not VALID or NEEDS_REVIEW');
    }
  });

  it('creates an imported major from a trusted VALID import record', async () => {
    const repo = createMockRepo();
    const useCase = new MajorImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.VALID, {
      canonicalMajorName: 'Computer Science',
      degreeLevel: 'Bachelor',
      sourceClassificationSystem: 'CIP',
      academicFieldOrDiscipline: 'Computing',
      officialSourceUrl: 'https://nces.ed.gov/ipeds/cipcode',
      acquiredSkills: ['Programming', 'Algorithms']
    }));

    expect(result.type).toBe('CREATED');
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      displayName: 'Computer Science',
      canonicalName: 'Computer Science',
      canonicalDedupKey: 'computer science|computing|bachelor|cip',
      status: MajorStatus.IMPORTED,
      completenessStatus: MajorImportCompletenessState.COMPLETE,
      sourceImportRecordId: 'rec-1',
      optionalFields: expect.objectContaining({
        acquiredSkills: ['Programming', 'Algorithms']
      })
    }));
  });

  it('creates a review-ready major when trusted source fields are missing', async () => {
    const repo = createMockRepo();
    const useCase = new MajorImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.NEEDS_REVIEW, {
      canonicalMajorName: 'Business Administration',
      degreeLevel: 'Master',
      sourceClassificationSystem: 'ISCED',
      collegeOrFaculty: 'Business'
    }));

    expect(result.type).toBe('CREATED');
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      status: MajorStatus.READY_TO_REVIEW,
      completenessStatus: MajorImportCompletenessState.NEEDS_REVIEW
    }));
  });

  it('returns DUPLICATE when a canonical major already exists', async () => {
    const repo = createMockRepo();
    repo.findByDedupKey = vi.fn().mockResolvedValue({ id: 'existing-1' });
    const useCase = new MajorImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.VALID, {
      canonicalMajorName: 'Computer Science',
      degreeLevel: 'Bachelor',
      sourceClassificationSystem: 'CIP',
      academicFieldOrDiscipline: 'Computing',
      sourceUrl: 'https://nces.ed.gov/ipeds/cipcode'
    }));

    expect(result.type).toBe('DUPLICATE');
    if (result.type === 'DUPLICATE') {
      expect(result.existingId).toBe('existing-1');
    }
  });
});
