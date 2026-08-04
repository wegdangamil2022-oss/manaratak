import { 
  InternationalTestStatus, 
  InternationalTestCategory, 
  InternationalTestCompletenessStatus,
  InternationalTestDeliveryMode,
  InternationalTestSourceTrustLevel
} from './enums';
import { 
  InternationalTestCompletenessReport,
  InternationalTestValidationIssue
} from './validation';

export type { InternationalTestCompletenessReport, InternationalTestValidationIssue };

export interface InternationalTestDto {
  id: string;
  canonicalName: string;
  localizedNameAr?: string;
  localizedNameEn?: string;
  abbreviation?: string;
  testCategory: InternationalTestCategory;
  providerName: string;
  status: InternationalTestStatus;
  isPubliclyVisible: boolean;
  isSourceVerified: boolean;
  completenessStatus?: InternationalTestCompletenessStatus;
  
  variants?: InternationalTestVariantDto[];
  scoreScale?: InternationalTestScoreScaleDto;
  sections?: InternationalTestSectionDto[];
  fees?: InternationalTestFeeMetadataDto[];
  registrationRequirements?: string;
  identificationRequirements?: string;
  retakePolicy?: string;
  cancellationReschedulingNotes?: string;
  accessibilityNotes?: string;
  availability?: InternationalTestAvailabilityDto;
  officialLinks?: InternationalTestOfficialLinkDto[];
  preparationMaterials?: InternationalTestPreparationMaterialDto[];
  
  crossPhaseReferences?: {
    universityIds?: string[];
    scholarshipIds?: string[];
    preparationCourseIds?: string[];
    cmsGuideIds?: string[];
    studentToolIds?: string[];
    paidServiceIds?: string[];
  };
  
  importEvidence?: InternationalTestEvidenceDto;
  completenessReport?: InternationalTestCompletenessReport;
  
  [key: string]: unknown;
}

export interface UpsertInternationalTestDto {
  canonicalName: string;
  localizedNameAr?: string;
  localizedNameEn?: string;
  abbreviation?: string;
  testCategory: InternationalTestCategory;
  providerName: string;
  status?: InternationalTestStatus;
  
  variants?: UpsertInternationalTestVariantDto[];
  scoreScale?: UpsertInternationalTestScoreScaleDto;
  sections?: UpsertInternationalTestSectionDto[];
  fees?: UpsertInternationalTestFeeMetadataDto[];
  registrationRequirements?: string;
  identificationRequirements?: string;
  retakePolicy?: string;
  cancellationReschedulingNotes?: string;
  accessibilityNotes?: string;
  availability?: UpsertInternationalTestAvailabilityDto;
  officialLinks?: UpsertInternationalTestOfficialLinkDto[];
  preparationMaterials?: UpsertInternationalTestPreparationMaterialDto[];
  
  crossPhaseReferences?: {
    universityIds?: string[];
    scholarshipIds?: string[];
    preparationCourseIds?: string[];
    cmsGuideIds?: string[];
    studentToolIds?: string[];
    paidServiceIds?: string[];
  };

  [key: string]: unknown;
}

export interface InternationalTestVariantDto {
  id: string;
  variantName: string;
  deliveryMode: InternationalTestDeliveryMode;
  isActive: boolean;
  specificOfficialUrl?: string;
  administrativeNotes?: string;
}

export interface UpsertInternationalTestVariantDto {
  variantName: string;
  deliveryMode: InternationalTestDeliveryMode;
  isActive: boolean;
  specificOfficialUrl?: string;
  administrativeNotes?: string;
}

export interface InternationalTestSectionDto {
  id: string;
  sectionName: string;
  sectionType: string;
  durationMinutes?: number;
  order: number;
  questionTypes?: string[];
  scoreMinimum?: number;
  scoreMaximum?: number;
}

export interface UpsertInternationalTestSectionDto {
  sectionName: string;
  sectionType: string;
  durationMinutes?: number;
  order: number;
  questionTypes?: string[];
  scoreMinimum?: number;
  scoreMaximum?: number;
}

export interface InternationalTestScoreScaleDto {
  id: string;
  overallMinimum: number;
  overallMaximum: number;
  scoreIncrement?: number;
  bandsOrLevels?: string[];
  passFailRules?: string;
  cefrEquivalency?: string;
  crossTestEquivalency?: string;
  resultValidityDurationMonths?: number;
  resultDeliveryTimeDays?: number;
  scoreReportingUrl?: string;
}

export interface UpsertInternationalTestScoreScaleDto {
  overallMinimum: number;
  overallMaximum: number;
  scoreIncrement?: number;
  bandsOrLevels?: string[];
  passFailRules?: string;
  cefrEquivalency?: string;
  crossTestEquivalency?: string;
  resultValidityDurationMonths?: number;
  resultDeliveryTimeDays?: number;
  scoreReportingUrl?: string;
}

export interface InternationalTestFeeMetadataDto {
  id: string;
  feeType: 'REGISTRATION' | 'LATE_REGISTRATION' | 'RESCHEDULING' | 'CANCELLATION' | 'OTHER';
  amount: number;
  currencyCode: string; // Reference Data code
  hasRegionalVariation: boolean;
  validityWindowNotes?: string;
}

export interface UpsertInternationalTestFeeMetadataDto {
  feeType: 'REGISTRATION' | 'LATE_REGISTRATION' | 'RESCHEDULING' | 'CANCELLATION' | 'OTHER';
  amount: number;
  currencyCode: string;
  hasRegionalVariation: boolean;
  validityWindowNotes?: string;
}

export interface InternationalTestOfficialLinkDto {
  id: string;
  linkType: 'REGISTRATION' | 'INFORMATION' | 'PREPARATION' | 'SCORE_REPORTING' | 'OTHER';
  url: string;
  description?: string;
}

export interface UpsertInternationalTestOfficialLinkDto {
  linkType: 'REGISTRATION' | 'INFORMATION' | 'PREPARATION' | 'SCORE_REPORTING' | 'OTHER';
  url: string;
  description?: string;
}

export interface InternationalTestAvailabilityDto {
  id: string;
  availableCountryIds: string[]; // Phase 07 references
  availableCityIds?: string[]; // Phase 07 references
  onlineAvailabilityRegions?: string[];
  testingWindowsNotes?: string;
}

export interface UpsertInternationalTestAvailabilityDto {
  availableCountryIds: string[];
  availableCityIds?: string[];
  onlineAvailabilityRegions?: string[];
  testingWindowsNotes?: string;
}

export interface InternationalTestPreparationMaterialDto {
  id: string;
  materialType: 'SAMPLE_QUESTIONS' | 'PRACTICE_TEST' | 'BROCHURE' | 'AUDIO_SAMPLE' | 'GUIDE';
  url?: string;
  assetId?: string; // Phase 05 reference
  title: string;
  description?: string;
}

export interface UpsertInternationalTestPreparationMaterialDto {
  materialType: 'SAMPLE_QUESTIONS' | 'PRACTICE_TEST' | 'BROCHURE' | 'AUDIO_SAMPLE' | 'GUIDE';
  url?: string;
  assetId?: string;
  title: string;
  description?: string;
}

export interface InternationalTestEvidenceDto {
  originalImportedName?: string;
  normalizedCanonicalName?: string;
  deterministicKey?: string;
  sourceId?: string;
  sourceUrl?: string;
  contentHash?: string;
  retrievedAt?: Date;
  evidenceSnippet?: string;
  duplicateStatus?: 'NEW' | 'DUPLICATE_SKIPPED' | 'EXISTING_ENRICHED';
  conflictingFields?: string[];
  mergeSuggestions?: Record<string, unknown> | null;
  sourceTrustLevel?: InternationalTestSourceTrustLevel;
}


export interface InternationalTestFilters {
  searchQuery?: string;
  status?: InternationalTestStatus | InternationalTestStatus[];
  category?: InternationalTestCategory | InternationalTestCategory[];
  providerName?: string;
  completenessStatus?: InternationalTestCompletenessStatus | InternationalTestCompletenessStatus[];
  isPubliclyVisible?: boolean;
  page?: number;
  limit?: number;
  pageSize?: number;
  [key: string]: unknown;
}

export interface PaginatedInternationalTestResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

