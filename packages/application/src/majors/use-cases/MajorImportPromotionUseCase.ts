import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import {
  IMajorRepository,
  ImportRecordDto,
  ImportRecordStatus,
  MajorContentSectionDto,
  MajorCompletenessClassifier,
  MajorDeduplicationService,
  MajorImportCompletenessState,
  MajorLevel,
  MajorLevelProfileDto,
  MajorImportPayload,
  MajorImportPayloadSchema,
  MajorNamingService,
  MajorStatus
} from '@manaratak/domain';

export type MajorPromotionResult =
  | { type: 'CREATED'; majorId: string }
  | { type: 'DUPLICATE'; existingId: string }
  | { type: 'VERSION_CREATED'; existingId: string; versionNumber: number }
  | { type: 'REJECTED'; reason: string }
  | { type: 'FAILED'; error: string };

export class MajorImportPromotionUseCase {
  constructor(private readonly repository: IMajorRepository) {}

  public async promote(record: ImportRecordDto): Promise<MajorPromotionResult> {
    try {
      if (
        record.status !== ImportRecordStatus.VALID && 
        record.status !== ImportRecordStatus.COMPLETE && 
        record.status !== ImportRecordStatus.NEEDS_REVIEW
      ) {
        return { type: 'REJECTED', reason: `ImportRecord status is ${record.status}, not VALID or NEEDS_REVIEW` };
      }

      const rawPayload = record.normalizedPayload || record.rawPayload;
      const validationResult = MajorImportPayloadSchema.safeParse(rawPayload);

      if (!validationResult.success) {
        return { type: 'REJECTED', reason: 'Payload fails schema validation' };
      }

      const payload = validationResult.data;
      const classification = MajorCompletenessClassifier.classify(payload);

      if (classification.state === MajorImportCompletenessState.INCOMPLETE) {
        return { type: 'REJECTED', reason: 'Record classified as INCOMPLETE' };
      }

      const canonicalName = MajorNamingService.normalize(payload.canonicalMajorName);
      const dedupKey = MajorDeduplicationService.generateKey(payload);
      const existing = await this.repository.findByDedupKey(dedupKey);

      if (existing) {
        const versionNumber = await this.attachImportSnapshot(existing.id, record, rawPayload, payload);
        return { type: 'VERSION_CREATED', existingId: existing.id, versionNumber };
      }

      const publicId = `maj-${uuidv4().substring(0, 8)}`;
      const slugBase = canonicalName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const slug = `${slugBase || 'major'}-${publicId.substring(0, 4)}`;

      let status = MajorStatus.READY_TO_REVIEW;
      if (classification.state === MajorImportCompletenessState.COMPLETE) {
        status = MajorStatus.IMPORTED;
      }

      const created = await this.repository.create({
        publicId,
        slug,
        canonicalName,
        canonicalDedupKey: dedupKey,
        displayName: payload.canonicalMajorName,
        degreeLevel: payload.degreeLevel,
        sourceClassificationSystem: payload.sourceClassificationSystem,
        status,
        completenessStatus: classification.state,
        academicFieldOrDiscipline: payload.academicFieldOrDiscipline,
        collegeOrFaculty: payload.collegeOrFaculty,
        classificationCode: payload.classificationCode,
        sourceUrl: payload.sourceUrl === '' ? undefined : payload.sourceUrl,
        officialSourceUrl: payload.officialSourceUrl === '' ? undefined : payload.officialSourceUrl,
        sourceImportRecordId: record.id,
        optionalFields: {
          localizedNames: payload.localizedNames,
          aliases: payload.aliases,
          synonyms: payload.synonyms,
          equivalencyMappings: payload.equivalencyMappings,
          degreeLevelMappings: payload.degreeLevelMappings,
          relatedMajors: payload.relatedMajors,
          description: payload.description,
          studentFriendlySummary: payload.studentFriendlySummary,
          acquiredSkills: payload.acquiredSkills,
          careerOutcomes: payload.careerOutcomes,
          typicalCourses: payload.typicalCourses,
          metadata: payload.metadata,
        }
      });

      await this.attachImportSnapshot(created.id, record, rawPayload, payload, 1, 'CREATED');

      return { type: 'CREATED', majorId: created.id };
    } catch (error) {
      return {
        type: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private pickString(record: ImportRecordDto, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    return undefined;
  }

  private hashPayload(payload: unknown): string {
    return createHash('sha256').update(JSON.stringify(payload ?? {})).digest('hex');
  }

  private asRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return { value };
  }

  private async attachImportSnapshot(
    majorId: string,
    record: ImportRecordDto,
    rawPayload: unknown,
    payload: MajorImportPayload,
    explicitVersionNumber?: number,
    promotionResult: 'CREATED' | 'VERSION_CREATED' = 'VERSION_CREATED'
  ): Promise<number> {
    const sourceName = this.pickString(record, ['sourceFileName', 'fileName', 'sourceSystem']) ?? 'Major import record';
    const sourceUri = this.pickString(record, ['sourceUri', 'sourceUrl']);
    const sourceHash = this.hashPayload(rawPayload);
    const profile = await this.ensureLevelProfile(majorId, payload);
    const existingVersions = explicitVersionNumber === undefined && this.repository.listVersions
      ? await this.repository.listVersions(majorId)
      : [];
    const versionNumber = explicitVersionNumber ?? ((existingVersions[0]?.versionNumber ?? 0) + 1);

    if (this.repository.createSource) {
      await this.repository.createSource({
        majorId,
        profileId: profile?.id,
        sourceType: payload.sourceImportMode === 'DETAIL_DOSSIER' ? 'DETAIL_DOSSIER' : 'CATALOG_FILE',
        sourceName,
        sourceUri,
        sourceHash,
        importedAt: new Date(),
        metadata: {
          importRecordId: record.id,
          importStatus: record.status,
          crossListingContext: MajorDeduplicationService.generateCrossListingContext(payload),
          sourceImportMode: payload.sourceImportMode ?? 'CATALOG_IDENTITY_ONLY',
        },
      });
    }

    if (this.repository.createVersion) {
      const version = await this.repository.createVersion({
        majorId,
        profileId: profile?.id,
        versionNumber,
        status: 'NEEDS_REVIEW',
        sourceImportRecordId: record.id,
        sourceFileName: sourceName,
        sourceUri,
        sourceHash,
        importedAt: new Date(),
        changeSummary: {
          addedFields: Object.keys(payload),
          changedFields: promotionResult === 'VERSION_CREATED' ? Object.keys(payload) : [],
          removedFields: [],
        },
        rawContentBlocks: this.asRecord(rawPayload),
        metadata: {
          importStatus: record.status,
          promotionResult,
          profileKey: MajorDeduplicationService.generateProfileKey(payload),
          sourceImportMode: payload.sourceImportMode ?? 'CATALOG_IDENTITY_ONLY',
          contentBlockCount: Array.isArray(payload.contentBlocks) ? payload.contentBlocks.length : 0,
        },
      });

      await this.attachContentSections(profile?.id, version.id, payload);
    }

    return versionNumber;
  }

  private normalizeLevel(value: string | undefined): MajorLevel | undefined {
    const level = value?.trim().toUpperCase();
    if (level === 'BACHELOR') return 'BACHELOR';
    if (level === 'MASTER') return 'MASTER';
    if (level === 'DOCTORATE') return 'DOCTORATE';
    return undefined;
  }

  private pickLocalizedName(payload: MajorImportPayload, locale: 'ar' | 'en'): string | undefined {
    const names = payload.localizedNames;
    if (!names || typeof names !== 'object') {
      return undefined;
    }

    const value = names[locale];
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }

  private async ensureLevelProfile(majorId: string, payload: MajorImportPayload): Promise<MajorLevelProfileDto | undefined> {
    const level = this.normalizeLevel(payload.degreeLevel);
    if (!level || !this.repository.createLevelProfile) {
      return undefined;
    }

    const code = payload.classificationCode;
    if (this.repository.findLevelProfile) {
      const existing = await this.repository.findLevelProfile(majorId, level, code);
      if (existing) {
        return existing;
      }
    }

    const classification = MajorCompletenessClassifier.classify(payload);
    return this.repository.createLevelProfile({
      majorId,
      level,
      code,
      displayName: payload.canonicalMajorName,
      localizedNameAr: this.pickLocalizedName(payload, 'ar'),
      localizedNameEn: this.pickLocalizedName(payload, 'en'),
      collegeContext: payload.collegeOrFaculty || payload.facultyName,
      academicFieldId: payload.academicFieldId,
      disciplineId: payload.disciplineId,
      status: MajorStatus.READY_TO_REVIEW,
      completenessStatus: classification.state,
      metadata: {
        profileKey: MajorDeduplicationService.generateProfileKey(payload),
        sourceClassificationSystem: payload.sourceClassificationSystem,
        academicFieldOrDiscipline: payload.academicFieldOrDiscipline,
        sourceImportMode: payload.sourceImportMode ?? 'CATALOG_IDENTITY_ONLY',
      },
    });
  }

  private async attachContentSections(profileId: string | undefined, versionId: string | undefined, payload: MajorImportPayload): Promise<void> {
    if (!this.repository.createContentSections || !versionId || !Array.isArray(payload.contentBlocks)) {
      return;
    }

    const sections = payload.contentBlocks
      .map((block, index) => this.toContentSection(block, index, profileId, versionId))
      .filter((section): section is Omit<MajorContentSectionDto, 'id'> => Boolean(section));

    await this.repository.createContentSections(sections);
  }

  private toContentSection(
    block: Record<string, unknown>,
    index: number,
    profileId: string | undefined,
    versionId: string
  ): Omit<MajorContentSectionDto, 'id'> | undefined {
    const content = typeof block.content === 'string' ? block.content.trim() : '';
    if (!content) {
      return undefined;
    }

    return {
      profileId,
      versionId,
      sectionKey: typeof block.blockKey === 'string' && block.blockKey.trim()
        ? block.blockKey.trim()
        : `section-${String(index + 1).padStart(2, '0')}`,
      title: typeof block.title === 'string' ? block.title : undefined,
      locale: 'ar',
      content,
      sourceSectionPath: typeof block.sourceSectionPath === 'string' ? block.sourceSectionPath : undefined,
      reviewStatus: 'NEEDS_REVIEW',
      metadata: {
        sourceLevel: block.level,
        sourceReviewStatus: block.reviewStatus,
      },
    };
  }
}
