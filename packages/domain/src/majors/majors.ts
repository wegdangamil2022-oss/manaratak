import { z } from 'zod';
import { MajorImportCompletenessState, MajorStatus } from '../generated/dummy';

export type MajorLifecycleStatus = MajorStatus;

export type MajorLevel = 'BACHELOR' | 'MASTER' | 'DOCTORATE';

export type MajorLevelInput = 'Bachelor' | 'Master' | 'Doctorate' | 'Fellowship' | MajorLevel | string;

export type MajorProfileType =
  | 'ACADEMIC'
  | 'TAUGHT'
  | 'RESEARCH'
  | 'PROFESSIONAL'
  | 'EXECUTIVE'
  | 'PRACTICE_BASED'
  | 'MIXED'
  | 'PROJECT_BASED';

export type MajorRelationshipType =
  | 'SIMILAR'
  | 'PARENT'
  | 'CHILD'
  | 'CROSS_LISTED'
  | 'BACHELOR_TO_MASTER'
  | 'MASTER_TO_DOCTORATE'
  | 'MAJOR_TO_FELLOWSHIP';

export type MajorContentSectionStatus = 'DRAFT' | 'NEEDS_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED';

export interface MajorContentSectionDto {
  id?: string;
  profileId?: string;
  versionId?: string;
  sectionKey: string;
  title?: string;
  locale?: string;
  content: string;
  sourceSectionPath?: string;
  reviewStatus?: MajorContentSectionStatus;
  metadata?: Record<string, unknown>;
}

export interface MajorAliasDto {
  id?: string;
  majorId?: string;
  locale?: string;
  alias: string;
  normalizedAlias?: string;
  aliasType?: 'ALIAS' | 'SYNONYM' | 'HISTORICAL_NAME' | 'TRANSLATION';
  sourceId?: string;
}

export interface MajorClassificationMappingDto {
  id?: string;
  majorId?: string;
  profileId?: string;
  taxonomyNodeId: string;
  relationshipType: 'PRIMARY' | 'SECONDARY' | 'RELATED' | 'LEGACY';
  standardType?: string;
  standardCode?: string;
  confidence?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface MajorRelationshipDto {
  id?: string;
  sourceMajorId?: string;
  targetMajorId?: string;
  sourceProfileId?: string;
  targetProfileId?: string;
  relationshipType: MajorRelationshipType;
  confidence?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface MajorSourceDto {
  id?: string;
  majorId?: string;
  profileId?: string;
  sourceType: 'CATALOG_FILE' | 'DETAIL_DOSSIER' | 'OFFICIAL_SOURCE' | 'ADMIN_ENTRY';
  sourceName: string;
  sourceUri?: string;
  sourceHash?: string;
  importedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface MajorLevelProfileDto {
  id?: string;
  majorId?: string;
  level: MajorLevel;
  code?: string;
  profileType?: MajorProfileType;
  displayName?: string;
  localizedNameAr?: string;
  localizedNameEn?: string;
  collegeContext?: string;
  academicFieldId?: string;
  disciplineId?: string;
  currentPublishedVersionId?: string;
  status?: MajorLifecycleStatus;
  completenessStatus?: MajorImportCompletenessState;
  metadata?: Record<string, unknown>;
  contentSections?: MajorContentSectionDto[];
}

export interface MajorVersionDto {
  id?: string;
  majorId?: string;
  profileId?: string;
  versionNumber: number;
  status: MajorContentSectionStatus;
  sourceImportRecordId?: string;
  sourceFileName?: string;
  sourceUri?: string;
  sourceHash?: string;
  importedAt?: Date;
  publishedAt?: Date;
  approvedBy?: string;
  supersededAt?: Date;
  changeSummary?: Record<string, unknown>;
  rawContentBlocks?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface MajorDto {
  id: string;
  publicId: string;
  slug: string;
  canonicalName: string;
  canonicalDedupKey: string;
  displayName: string;
  status: MajorLifecycleStatus;
  completenessStatus: MajorImportCompletenessState;
  facultyName?: string | null;
  degreeLevel?: MajorLevelInput;
  sourceClassificationSystem?: string;
  academicFieldOrDiscipline?: string;
  collegeOrFaculty?: string;
  classificationCode?: string;
  sourceUrl?: string | null;
  officialSourceUrl?: string | null;
  sourceImportRecordId?: string;
  academicFieldId?: string | null;
  disciplineId?: string | null;
  currentPublishedVersionId?: string | null;
  optionalFields?: Record<string, unknown> | null;
  profiles?: MajorLevelProfileDto[];
  versions?: MajorVersionDto[];
  aliases?: MajorAliasDto[];
  relationships?: MajorRelationshipDto[];
  classificationMappings?: MajorClassificationMappingDto[];
  sources?: MajorSourceDto[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FellowshipDefinitionDto {
  id: string;
  publicId: string;
  slug: string;
  canonicalName: string;
  canonicalDedupKey: string;
  displayName: string;
  fellowshipType: string;
  professionalDomain?: string | null;
  status: MajorLifecycleStatus;
  completenessStatus: MajorImportCompletenessState;
  linkedMajorId?: string | null;
  linkedProfileId?: string | null;
  optionalFields?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicMajorDto = Omit<
  MajorDto,
  'id' | 'canonicalDedupKey' | 'sourceImportRecordId' | 'status' | 'completenessStatus' | 'optionalFields' | 'createdAt'
>;

export interface MajorFilters {
  status?: MajorLifecycleStatus;
  completenessStatus?: MajorImportCompletenessState;
  degreeLevel?: string;
  academicFieldOrDiscipline?: string;
  collegeOrFaculty?: string;
  academicFieldId?: string;
  disciplineId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export type PublicMajorFilters = Omit<MajorFilters, 'status' | 'completenessStatus'>;

export interface PaginatedMajorResult<T = MajorDto> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UpdateMajorDto {
  displayName?: string;
  status?: MajorLifecycleStatus;
  completenessStatus?: MajorImportCompletenessState;
  degreeLevel?: MajorLevelInput;
  sourceClassificationSystem?: string;
  academicFieldOrDiscipline?: string | null;
  collegeOrFaculty?: string | null;
  classificationCode?: string | null;
  sourceUrl?: string | null;
  officialSourceUrl?: string | null;
  academicFieldId?: string | null;
  disciplineId?: string | null;
  currentPublishedVersionId?: string | null;
  optionalFields?: Record<string, unknown>;
}

export interface IMajorRepository {
  create(data: Omit<MajorDto, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<MajorDto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MajorDto>;
  update(id: string, updates: UpdateMajorDto): Promise<MajorDto>;
  findById(id: string): Promise<MajorDto | null>;
  findByPublicId?(publicId: string): Promise<MajorDto | null>;
  findBySlug(slug: string): Promise<MajorDto | null>;
  findByDedupKey(key: string): Promise<MajorDto | null>;
  updateStatus(id: string, status: MajorLifecycleStatus): Promise<void>;
  updateImportLink?(id: string, sourceImportRecordId: string): Promise<void>;
  listByStatus?(status: MajorLifecycleStatus): Promise<MajorDto[]>;
  list(filters: MajorFilters): Promise<PaginatedMajorResult<MajorDto>>;
  listPublished(filters: PublicMajorFilters): Promise<PaginatedMajorResult<MajorDto>>;
  createVersion?(data: Omit<MajorVersionDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<MajorVersionDto>;
  listVersions?(majorId: string): Promise<MajorVersionDto[]>;
  createLevelProfile?(data: Omit<MajorLevelProfileDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<MajorLevelProfileDto>;
  findLevelProfile?(majorId: string, level: MajorLevel, code?: string): Promise<MajorLevelProfileDto | null>;
  listLevelProfiles?(majorId: string): Promise<MajorLevelProfileDto[]>;
  createContentSections?(data: Array<Omit<MajorContentSectionDto, 'id'>>): Promise<{ count: number }>;
  listContentSections?(majorId: string): Promise<MajorContentSectionDto[]>;
  createSource?(data: Omit<MajorSourceDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<MajorSourceDto>;
  listSources?(majorId: string): Promise<MajorSourceDto[]>;
}

export interface IFellowshipDefinitionRepository {
  create(data: Omit<FellowshipDefinitionDto, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<FellowshipDefinitionDto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FellowshipDefinitionDto>;
  update(id: string, updates: Partial<Pick<FellowshipDefinitionDto, 'displayName' | 'status' | 'completenessStatus' | 'professionalDomain' | 'linkedMajorId' | 'linkedProfileId' | 'optionalFields'>>): Promise<FellowshipDefinitionDto>;
  findByDedupKey(key: string): Promise<FellowshipDefinitionDto | null>;
}

export const MajorImportPayloadSchema = z.object({
  canonicalMajorName: z.string(),
  degreeLevel: z.string().optional(),
  sourceClassificationSystem: z.string().optional(),
  academicFieldOrDiscipline: z.string().optional(),
  collegeOrFaculty: z.string().optional(),
  classificationCode: z.string().optional(),
  sourceUrl: z.union([z.string().url(), z.literal('')]).optional(),
  officialSourceUrl: z.union([z.string().url(), z.literal('')]).optional(),
  facultyName: z.string().optional(),
  description: z.string().optional(),
  localizedNames: z.record(z.string(), z.string()).optional(),
  aliases: z.union([z.string(), z.array(z.string())]).optional(),
  synonyms: z.union([z.string(), z.array(z.string())]).optional(),
  equivalencyMappings: z.array(z.record(z.string(), z.unknown())).optional(),
  degreeLevelMappings: z.array(z.record(z.string(), z.unknown())).optional(),
  relatedMajors: z.union([z.string(), z.array(z.string())]).optional(),
  studentFriendlySummary: z.string().optional(),
  acquiredSkills: z.array(z.string()).optional(),
  careerOutcomes: z.array(z.string()).optional(),
  typicalCourses: z.array(z.string()).optional(),
  academicFieldId: z.string().optional(),
  disciplineId: z.string().optional(),
  contentBlocks: z.array(z.record(z.string(), z.unknown())).optional(),
  sourceImportMode: z.enum(['CATALOG_IDENTITY_ONLY', 'DETAIL_DOSSIER']).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export type MajorImportPayload = z.infer<typeof MajorImportPayloadSchema>;

export class MajorCompletenessClassifier {
  static classify(payload: MajorImportPayload): { state: MajorImportCompletenessState, missingFields?: string[] } {
    const missing: string[] = [];
    if (!payload.canonicalMajorName) missing.push('canonicalMajorName');
    if (missing.length > 0) return { state: MajorImportCompletenessState.INCOMPLETE, missingFields: missing };

    const reviewFields: string[] = [];
    if (!payload.academicFieldOrDiscipline && !payload.collegeOrFaculty) reviewFields.push('academicFieldOrDiscipline');
    if (!payload.officialSourceUrl) reviewFields.push('officialSourceUrl');

    if (reviewFields.length > 0) {
      return { state: MajorImportCompletenessState.NEEDS_REVIEW, missingFields: reviewFields };
    }

    return { state: MajorImportCompletenessState.COMPLETE };
  }
}
export class MajorNamingService {
  static normalize(name: string): string { return name.trim(); }

  static normalizeArabic(value: string): string {
    return value
      .trim()
      .normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/\u0640/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static normalizeEnglish(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static normalizeSearchText(value: string | undefined): string {
    const raw = value?.trim();
    if (!raw) {
      return 'unknown';
    }

    const normalized = /[\u0600-\u06FF]/.test(raw)
      ? this.normalizeArabic(raw)
      : this.normalizeEnglish(raw);

    return normalized || 'unknown';
  }

  static normalizeForKey(value: string | undefined): string {
    return this.normalizeSearchText(value)
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'unknown';
  }
}
export class MajorDeduplicationService {
  static generateKey(payload: MajorImportPayload): string {
    const concept = MajorNamingService.normalizeForKey(
      payload.canonicalMajorName
        || payload.localizedNames?.en
        || payload.localizedNames?.ar
    );
    const primaryDiscipline = MajorNamingService.normalizeForKey(
      payload.disciplineId
        || payload.academicFieldId
        || payload.academicFieldOrDiscipline
    );
    const classificationContext = MajorNamingService.normalizeForKey(
      typeof payload.metadata?.classificationContext === 'string'
        ? payload.metadata.classificationContext
        : undefined
    );

    return [concept, primaryDiscipline, classificationContext].join('|');
  }

  static generateProfileKey(payload: MajorImportPayload): string {
    const majorKey = this.generateKey(payload);
    const degree = MajorNamingService.normalizeForKey(payload.degreeLevel);
    const profileType = MajorNamingService.normalizeForKey(
      typeof payload.metadata?.profileType === 'string'
        ? payload.metadata.profileType
        : undefined
    );
    return `${majorKey}|${degree}|${profileType}`;
  }

  static generateCrossListingContext(payload: MajorImportPayload): string | undefined {
    const college = MajorNamingService.normalizeForKey(payload.collegeOrFaculty || payload.facultyName);
    return college === 'unknown' ? undefined : college;
  }
}

export class FellowshipDeduplicationService {
  static generateKey(payload: MajorImportPayload): string {
    const name = MajorNamingService.normalizeForKey(
      payload.canonicalMajorName
        || payload.localizedNames?.en
        || payload.localizedNames?.ar
    );
    const fellowshipType = MajorNamingService.normalizeForKey(
      typeof payload.fellowshipType === 'string' ? payload.fellowshipType : undefined
    );
    const professionalDomain = MajorNamingService.normalizeForKey(
      typeof payload.professionalDomain === 'string'
        ? payload.professionalDomain
        : payload.academicFieldOrDiscipline
    );

    return [name, fellowshipType, professionalDomain].join('|');
  }
}
