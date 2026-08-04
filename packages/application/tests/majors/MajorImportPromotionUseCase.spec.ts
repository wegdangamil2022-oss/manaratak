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
    createSource: vi.fn().mockResolvedValue({ id: 'source-1' }),
    createVersion: vi.fn().mockResolvedValue({ id: 'version-1', versionNumber: 1 }),
    createLevelProfile: vi.fn().mockResolvedValue({ id: 'profile-1', level: 'BACHELOR' }),
    findLevelProfile: vi.fn().mockResolvedValue(null),
    listLevelProfiles: vi.fn().mockResolvedValue([]),
    createContentSections: vi.fn().mockResolvedValue({ count: 0 }),
    listContentSections: vi.fn().mockResolvedValue([]),
    listSources: vi.fn().mockResolvedValue([]),
    listVersions: vi.fn().mockResolvedValue([]),
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
      canonicalDedupKey: 'computer-science|computing|cip|unknown',
      status: MajorStatus.IMPORTED,
      completenessStatus: MajorImportCompletenessState.COMPLETE,
      sourceImportRecordId: 'rec-1',
      optionalFields: expect.objectContaining({
        acquiredSkills: ['Programming', 'Algorithms']
      })
    }));
    expect(repo.createSource).toHaveBeenCalledWith(expect.objectContaining({
      majorId: 'major-1',
      sourceType: 'CATALOG_FILE',
      sourceHash: expect.any(String)
    }));
    expect(repo.createVersion).toHaveBeenCalledWith(expect.objectContaining({
      majorId: 'major-1',
      versionNumber: 1,
      status: 'NEEDS_REVIEW',
      sourceImportRecordId: 'rec-1',
      changeSummary: expect.objectContaining({
        addedFields: expect.arrayContaining(['canonicalMajorName'])
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

  it('creates a review version instead of duplicating an existing major', async () => {
    const repo = createMockRepo();
    repo.findByDedupKey = vi.fn().mockResolvedValue({ id: 'existing-1' });
    repo.listVersions = vi.fn().mockResolvedValue([{ id: 'version-1', versionNumber: 3 }]);
    const useCase = new MajorImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.VALID, {
      canonicalMajorName: 'Computer Science',
      degreeLevel: 'Bachelor',
      sourceClassificationSystem: 'CIP',
      academicFieldOrDiscipline: 'Computing',
      collegeOrFaculty: 'College of Engineering',
      sourceUrl: 'https://nces.ed.gov/ipeds/cipcode'
    }));

    expect(result.type).toBe('VERSION_CREATED');
    if (result.type === 'VERSION_CREATED') {
      expect(result.existingId).toBe('existing-1');
      expect(result.versionNumber).toBe(4);
    }
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.createSource).toHaveBeenCalledWith(expect.objectContaining({
      majorId: 'existing-1',
      metadata: expect.objectContaining({
        crossListingContext: 'college-of-engineering'
      })
    }));
    expect(repo.createVersion).toHaveBeenCalledWith(expect.objectContaining({
      majorId: 'existing-1',
      versionNumber: 4,
      status: 'NEEDS_REVIEW',
      metadata: expect.objectContaining({
        promotionResult: 'VERSION_CREATED'
      })
    }));
  });

  it('creates a level profile and content sections for detail dossier records', async () => {
    const repo = createMockRepo();
    const useCase = new MajorImportPromotionUseCase(repo);

    const result = await useCase.promote(createRecord(ImportRecordStatus.NEEDS_REVIEW, {
      canonicalMajorName: 'Medicine and Surgery',
      degreeLevel: 'Bachelor',
      sourceClassificationSystem: 'MANARATAK_PHASE_10_DETAIL_DOSSIER',
      classificationCode: 'MJR-0001',
      localizedNames: { ar: 'الطب والجراحة', en: 'Medicine and Surgery' },
      sourceImportMode: 'DETAIL_DOSSIER',
      contentBlocks: [
        {
          blockKey: '01-overview',
          title: 'النبذة',
          content: 'تفاصيل التخصص.',
          sourceSectionPath: 'النبذة',
          reviewStatus: 'NEEDS_REVIEW',
        },
      ],
    }));

    expect(result.type).toBe('CREATED');
    expect(repo.createLevelProfile).toHaveBeenCalledWith(expect.objectContaining({
      majorId: 'major-1',
      level: 'BACHELOR',
      code: 'MJR-0001',
      localizedNameAr: 'الطب والجراحة',
      localizedNameEn: 'Medicine and Surgery',
    }));
    expect(repo.createSource).toHaveBeenCalledWith(expect.objectContaining({
      profileId: 'profile-1',
      sourceType: 'DETAIL_DOSSIER',
    }));
    expect(repo.createVersion).toHaveBeenCalledWith(expect.objectContaining({
      profileId: 'profile-1',
      metadata: expect.objectContaining({
        contentBlockCount: 1,
        sourceImportMode: 'DETAIL_DOSSIER',
      }),
    }));
    expect(repo.createContentSections).toHaveBeenCalledWith([
      expect.objectContaining({
        profileId: 'profile-1',
        versionId: 'version-1',
        sectionKey: '01-overview',
        title: 'النبذة',
        content: 'تفاصيل التخصص.',
        reviewStatus: 'NEEDS_REVIEW',
      }),
    ]);
  });
});
