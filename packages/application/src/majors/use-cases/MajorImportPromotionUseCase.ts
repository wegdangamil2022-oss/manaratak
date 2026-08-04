import { v4 as uuidv4 } from 'uuid';
import {
  IMajorRepository,
  ImportRecordDto,
  ImportRecordStatus,
  MajorCompletenessClassifier,
  MajorDeduplicationService,
  MajorImportCompletenessState,
  MajorImportPayloadSchema,
  MajorNamingService,
  MajorStatus
} from '@manaratak/domain';

export type MajorPromotionResult =
  | { type: 'CREATED'; majorId: string }
  | { type: 'DUPLICATE'; existingId: string }
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
        return { type: 'DUPLICATE', existingId: existing.id };
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

      return { type: 'CREATED', majorId: created.id };
    } catch (error) {
      return {
        type: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
