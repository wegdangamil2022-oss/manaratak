import { v4 as uuidv4 } from 'uuid';
import {
  ImportRecordDto,
  ImportRecordStatus,
  IUniversityRepository,
  UniversityCompletenessClassifier,
  UniversityDeduplicationService,
  UniversityImportCompletenessState,
  UniversityImportPayloadSchema,
  UniversityNamingService,
  UniversityStatus
} from '@manaratak/domain';

export type UniversityPromotionResult =
  | { type: 'CREATED'; universityId: string }
  | { type: 'DUPLICATE'; existingId: string }
  | { type: 'REJECTED'; reason: string }
  | { type: 'FAILED'; error: string };

export class UniversityImportPromotionUseCase {
  constructor(private readonly repository: IUniversityRepository) {}

  public async promote(record: ImportRecordDto): Promise<UniversityPromotionResult> {
    try {
      if (
        record.status !== ImportRecordStatus.VALID && 
        record.status !== ImportRecordStatus.COMPLETE && 
        record.status !== ImportRecordStatus.NEEDS_REVIEW
      ) {
        return { type: 'REJECTED', reason: `ImportRecord status is ${record.status}, not VALID or NEEDS_REVIEW` };
      }

      const rawPayload = record.normalizedPayload || record.rawPayload;
      const validationResult = UniversityImportPayloadSchema.safeParse(rawPayload);

      if (!validationResult.success) {
        return { type: 'REJECTED', reason: 'Payload fails schema validation' };
      }

      const payload = validationResult.data;
      const classification = UniversityCompletenessClassifier.classify(payload);

      if (classification.state === UniversityImportCompletenessState.INCOMPLETE) {
        return { type: 'REJECTED', reason: 'Record classified as INCOMPLETE' };
      }

      const canonicalName = UniversityNamingService.normalize(payload.universityName);
      const dedupKey = UniversityDeduplicationService.generateKey(payload);
      const existing = await this.repository.findByDedupKey(dedupKey);

      if (existing) {
        return { type: 'DUPLICATE', existingId: existing.id };
      }

      const publicId = `uni-${uuidv4().substring(0, 8)}`;
      const slug = `${canonicalName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}-${publicId.substring(0, 4)}`;

      let status = UniversityStatus.READY_TO_REVIEW;
      if (classification.state === UniversityImportCompletenessState.COMPLETE) {
        status = UniversityStatus.IMPORTED;
      }

      const created = await this.repository.create({
        publicId,
        slug,
        canonicalName,
        canonicalDedupKey: dedupKey,
        displayName: payload.universityName,
        officialWebsite: payload.officialWebsite,
        country: payload.country,
        institutionType: payload.institutionType,
        status,
        completenessStatus: classification.state,
        sourceUrl: payload.sourceUrl === '' ? undefined : payload.sourceUrl,
        officialSourceUrl: payload.officialSourceUrl === '' ? undefined : payload.officialSourceUrl,
        city: payload.city,
        logoAssetId: payload.logoAssetId,
        foundedYear: payload.foundedYear,
        sourceImportRecordId: record.id,
        optionalFields: {
          localizedNames: payload.localizedNames,
          campuses: payload.campuses,
          accreditations: payload.accreditations,
          rankings: payload.rankings,
          description: payload.description,
          languagesOfInstruction: payload.languagesOfInstruction,
          tuitionReferences: payload.tuitionReferences,
          admissionRequirements: payload.admissionRequirements,
          academicPrograms: payload.academicPrograms,
          contactEmail: payload.contactEmail,
          contactPhone: payload.contactPhone,
          socialLinks: payload.socialLinks,
          metadata: payload.metadata,
        }
      });

      return { type: 'CREATED', universityId: created.id };
    } catch (error) {
      return {
        type: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
