import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/I18nProvider';
import { IELTS_MARKDOWN_CONTENT } from './ielts-markdown-content';
import { TOEFL_MARKDOWN_CONTENT } from './toefl-markdown-content';
import { DUOLINGO_MARKDOWN_CONTENT } from './duolingo-markdown-content';
import { ALEVEL_MARKDOWN_CONTENT } from './alevel-markdown-content';
import { ABITUR_MARKDOWN_CONTENT } from './abitur-markdown-content';
import { ACT_MARKDOWN_CONTENT } from './act-markdown-content';
import { CELPEBRAS_MARKDOWN_CONTENT } from './celpebras-markdown-content';
import { CILS_MARKDOWN_CONTENT } from './cils-markdown-content';
import { AP_MARKDOWN_CONTENT } from './ap-markdown-content';
import { CAMBRIDGE_MARKDOWN_CONTENT } from './cambridge-markdown-content';
import { 
  ArrowLeft, 
  Server, 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Loader2, 
  Plus, 
  RefreshCw, 
  FileSpreadsheet, 
  FileText, 
  Link2, 
  Sparkles, 
  Check, 
  X, 
  ChevronRight, 
  Info, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Award, 
  Sliders, 
  RotateCcw,
  Play,
  Paperclip
} from 'lucide-react';
import { ApiClient } from '../../api/client';

export interface ProviderSource {
  id: string;
  name: string;
  sourceType: 'official_gov' | 'official_univ' | 'official_foundation' | 'trusted_platform' | 'aggregator' | 'manual_source';
  trustScore: number;
  officialUrl: string;
  lastCheck?: string;
  importedCount?: number;
  failedCount?: number;
  incompleteCount?: number;
  transferredCount?: number;
  duplicatesCount?: number;
  enrichedCount?: number;
  status: 'active' | 'needs_config' | 'disabled' | 'under_preparation';
  coverageType?: 'full_profile' | 'scoring' | 'preparation' | 'availability_centers';
  descriptionAr?: string;
  descriptionEn?: string;
  isReadyForImport?: boolean;
}

export interface ScholarshipRecordAudit {
  id: string;
  originalName: string;
  cleanedName: string;
  cleanedNameAr: string;
  provider: string;
  sourceUrl: string;
  officialSourceUrl?: string;
  duplicateStatus: 'new' | 'duplicate_skipped' | 'existing_enriched';
  fieldsMerged: string[];
  missingFields: string[];
  completenessStatus: 'complete' | 'incomplete';
  verificationStatus: 'verified_official' | 'needs_source_verification';
  transferStatus: 'transferred_needs_review';
}

export interface ScholarshipImportBatch {
  id: string;
  batchName: string;
  providerName: string;
  sourceType: string;
  trustScore: number;
  runDate: string;
  inputMethod: string;
  totalRead: number;
  normalizedNamesCount: number;
  duplicateCount: number;
  mergedFieldsCount: number;
  newRecordsCount: number;
  incompleteCount: number;
  failedCount: number;
  transferredCount: number;
  status: 'success' | 'partial_success' | 'needs_review';
  records: ScholarshipRecordAudit[];
}

const SCHOLARSHIP_IMPORT_BATCHES: ScholarshipImportBatch[] = [
  {
    id: 'BATCH-2026-DAAD-04',
    batchName: 'DAAD Master & PhD Feed Batch 04',
    providerName: 'DAAD German Academic Exchange Feed',
    sourceType: 'Official Foundation',
    trustScore: 98,
    runDate: '2026-07-27 14:30',
    inputMethod: 'Registered Source',
    totalRead: 142,
    normalizedNamesCount: 130,
    duplicateCount: 12,
    mergedFieldsCount: 24,
    newRecordsCount: 106,
    incompleteCount: 8,
    failedCount: 3,
    transferredCount: 131,
    status: 'success',
    records: [
      {
        id: 'rec-01',
        originalName: 'Fully Funded DAAD Master Scholarship for Engineers 2027 - APPLY NOW!',
        cleanedName: 'DAAD Master Scholarship in Engineering 2027',
        cleanedNameAr: 'منحة DAAD للماجستير في الهندسة 2027',
        provider: 'DAAD German Academic Exchange',
        sourceUrl: 'https://daad.de/pg-eng-2027',
        officialSourceUrl: 'https://daad.de/pg-eng-2027',
        duplicateStatus: 'new',
        fieldsMerged: [],
        missingFields: [],
        completenessStatus: 'complete',
        verificationStatus: 'verified_official',
        transferStatus: 'transferred_needs_review'
      },
      {
        id: 'rec-02',
        originalName: 'Urgent! Chevening UK Government Scholarship Master Degree 2027 (Full Coverage)',
        cleanedName: 'Chevening UK Government Scholarship 2027',
        cleanedNameAr: 'منحة حكومة المملكة المتحدة تشيفنينج 2027',
        provider: 'Chevening UK',
        sourceUrl: 'https://chevening.org/apply-2027',
        officialSourceUrl: 'https://chevening.org/apply-2027',
        duplicateStatus: 'existing_enriched',
        fieldsMerged: ['monthlyStipend', 'englishRequirement'],
        missingFields: [],
        completenessStatus: 'complete',
        verificationStatus: 'verified_official',
        transferStatus: 'transferred_needs_review'
      },
      {
        id: 'rec-03',
        originalName: 'Fully Funded Qatar University Bachelor Scholarship 2027',
        cleanedName: 'Qatar University Scholarship 2027',
        cleanedNameAr: 'منحة جامعة قطر 2027',
        provider: 'ScholarshipPortal Global Feed',
        sourceUrl: 'https://scholarshipportal.com/qatar-2027',
        officialSourceUrl: 'https://qu.edu.qa/scholarships',
        duplicateStatus: 'new',
        fieldsMerged: [],
        missingFields: ['applicationDeadline'],
        completenessStatus: 'incomplete',
        verificationStatus: 'needs_source_verification',
        transferStatus: 'transferred_needs_review'
      },
      {
        id: 'rec-04',
        originalName: 'DAAD Master Scholarship in Engineering 2027',
        cleanedName: 'DAAD Master Scholarship in Engineering 2027',
        cleanedNameAr: 'منحة DAAD للماجستير في الهندسة 2027',
        provider: 'DAAD German Academic Exchange',
        sourceUrl: 'https://daad.de/pg-eng-2027',
        officialSourceUrl: 'https://daad.de/pg-eng-2027',
        duplicateStatus: 'duplicate_skipped',
        fieldsMerged: [],
        missingFields: [],
        completenessStatus: 'complete',
        verificationStatus: 'verified_official',
        transferStatus: 'transferred_needs_review'
      }
    ]
  },
  {
    id: 'BATCH-2026-CHEVENING-02',
    batchName: 'Chevening Annual Ingestion Batch 02',
    providerName: 'Chevening UK Government Scholarships',
    sourceType: 'Official Government',
    trustScore: 100,
    runDate: '2026-07-27 11:15',
    inputMethod: 'Registered Source',
    totalRead: 88,
    normalizedNamesCount: 85,
    duplicateCount: 5,
    mergedFieldsCount: 15,
    newRecordsCount: 68,
    incompleteCount: 4,
    failedCount: 1,
    transferredCount: 83,
    status: 'success',
    records: [
      {
        id: 'rec-05',
        originalName: 'Chevening Masters Leadership Award UK 2027-2028',
        cleanedName: 'Chevening Masters Leadership Scholarship 2027',
        cleanedNameAr: 'منحة تشيفنينج للماجستير والقيادة 2027',
        provider: 'Chevening UK',
        sourceUrl: 'https://chevening.org/scholarships',
        officialSourceUrl: 'https://chevening.org/scholarships',
        duplicateStatus: 'new',
        fieldsMerged: [],
        missingFields: [],
        completenessStatus: 'complete',
        verificationStatus: 'verified_official',
        transferStatus: 'transferred_needs_review'
      }
    ]
  },
  {
    id: 'BATCH-2026-PORTAL-01',
    batchName: 'ScholarshipPortal Bulk Aggregator Feed 01',
    providerName: 'ScholarshipPortal Global Feed',
    sourceType: 'Aggregator',
    trustScore: 85,
    runDate: '2026-07-26 18:40',
    inputMethod: 'CSV/JSON File Upload',
    totalRead: 210,
    normalizedNamesCount: 192,
    duplicateCount: 42,
    mergedFieldsCount: 38,
    newRecordsCount: 130,
    incompleteCount: 45,
    failedCount: 18,
    transferredCount: 147,
    status: 'partial_success',
    records: [
      {
        id: 'rec-06',
        originalName: 'King Fahd University KFUPM Graduate Scholarship 2027',
        cleanedName: 'King Fahd University Scholarship 2027',
        cleanedNameAr: 'منحة جامعة الملك فهد للبترول والمعادن 2027',
        provider: 'ScholarshipPortal Global Feed',
        sourceUrl: 'https://scholarshipportal.com/kfupm-2027',
        officialSourceUrl: 'https://deanship.kfupm.edu.sa',
        duplicateStatus: 'existing_enriched',
        fieldsMerged: ['fundingType', 'eligibleNationalities'],
        missingFields: [],
        completenessStatus: 'complete',
        verificationStatus: 'verified_official',
        transferStatus: 'transferred_needs_review'
      }
    ]
  }
];

const DOMAIN_METADATA: Record<string, {
  nameKey: string;
  defaultName: string;
  defaultNameAr: string;
  workspacePath: string;
  icon: React.ReactNode;
  defaultProviders: ProviderSource[];
}> = {
  scholarships: {
    nameKey: 'domain_scholarships',
    defaultName: 'Scholarships',
    defaultNameAr: 'المنح الدراسية',
    workspacePath: '/admin/scholarships',
    icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
    defaultProviders: [
      {
        id: 'prov-schol-1',
        name: 'DAAD German Academic Exchange Feed',
        sourceType: 'official_foundation',
        trustScore: 98,
        officialUrl: 'https://daad.de/scholarship-feed',
        lastCheck: new Date(Date.now() - 3600000 * 2).toISOString(),
        importedCount: 142,
        failedCount: 3,
        incompleteCount: 12,
        transferredCount: 127,
        duplicatesCount: 18,
        enrichedCount: 24,
        status: 'active',
      },
      {
        id: 'prov-schol-2',
        name: 'Chevening UK Government Scholarships',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://chevening.org/scholarships',
        lastCheck: new Date(Date.now() - 3600000 * 5).toISOString(),
        importedCount: 88,
        failedCount: 1,
        incompleteCount: 4,
        transferredCount: 83,
        duplicatesCount: 9,
        enrichedCount: 15,
        status: 'active',
      },
      {
        id: 'prov-schol-3',
        name: 'ScholarshipPortal Global Feed',
        sourceType: 'aggregator',
        trustScore: 85,
        officialUrl: 'https://scholarshipportal.com/feed',
        lastCheck: new Date(Date.now() - 3600000 * 12).toISOString(),
        importedCount: 210,
        failedCount: 18,
        incompleteCount: 45,
        transferredCount: 147,
        duplicatesCount: 42,
        enrichedCount: 38,
        status: 'active',
      },
      {
        id: 'prov-schol-4',
        name: 'Saudi MOE Scholarship Ingestion Channel',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://moe.gov.sa/scholarships-feed',
        lastCheck: new Date(Date.now() - 3600000 * 1).toISOString(),
        importedCount: 310,
        failedCount: 2,
        incompleteCount: 8,
        transferredCount: 300,
        status: 'active',
      },
      {
        id: 'prov-schol-5',
        name: 'University Official Scholarship Pages Registry',
        sourceType: 'official_univ',
        trustScore: 95,
        officialUrl: 'https://universities.edu/scholarships',
        lastCheck: new Date(Date.now() - 3600000 * 24).toISOString(),
        importedCount: 65,
        failedCount: 5,
        incompleteCount: 10,
        transferredCount: 50,
        status: 'needs_config',
      }
    ]
  },
  courses: {
    nameKey: 'domain_courses',
    defaultName: 'Courses & Training',
    defaultNameAr: 'الدورات والبرامج التدريبية',
    workspacePath: '/admin/courses',
    icon: <Layers className="w-6 h-6 text-emerald-600" />,
    defaultProviders: [
      {
        id: 'prov-crs-1',
        name: 'Coursera Partner Catalog Ingestion API',
        sourceType: 'trusted_platform',
        trustScore: 90,
        officialUrl: 'https://coursera.org/partner-catalog-api',
        lastCheck: new Date(Date.now() - 3600000 * 3).toISOString(),
        importedCount: 540,
        failedCount: 12,
        incompleteCount: 38,
        transferredCount: 490,
        status: 'active',
      },
      {
        id: 'prov-crs-2',
        name: 'edX Open Course Catalog',
        sourceType: 'trusted_platform',
        trustScore: 90,
        officialUrl: 'https://edx.org/api/v1/courses',
        lastCheck: new Date(Date.now() - 3600000 * 6).toISOString(),
        importedCount: 320,
        failedCount: 8,
        incompleteCount: 24,
        transferredCount: 288,
        status: 'active',
      },
      {
        id: 'prov-crs-3',
        name: 'Cisco Networking Academy Program Feed',
        sourceType: 'trusted_platform',
        trustScore: 95,
        officialUrl: 'https://netacad.com/courses-api',
        lastCheck: new Date(Date.now() - 3600000 * 18).toISOString(),
        importedCount: 110,
        failedCount: 1,
        incompleteCount: 5,
        transferredCount: 104,
        status: 'active',
      },
      {
        id: 'prov-crs-4',
        name: 'AWS Skill Builder Technical Catalog',
        sourceType: 'trusted_platform',
        trustScore: 95,
        officialUrl: 'https://explore.skillbuilder.aws/courses',
        lastCheck: new Date(Date.now() - 3600000 * 10).toISOString(),
        importedCount: 180,
        failedCount: 2,
        incompleteCount: 9,
        transferredCount: 169,
        status: 'active',
      },
      {
        id: 'prov-crs-5',
        name: 'Microsoft Learn Certified Pathways',
        sourceType: 'trusted_platform',
        trustScore: 95,
        officialUrl: 'https://learn.microsoft.com/catalog-api',
        lastCheck: new Date(Date.now() - 3600000 * 8).toISOString(),
        importedCount: 240,
        failedCount: 4,
        incompleteCount: 12,
        transferredCount: 224,
        status: 'active',
      }
    ]
  },
  universities: {
    nameKey: 'domain_universities',
    defaultName: 'Universities',
    defaultNameAr: 'الجامعات',
    workspacePath: '/admin/universities',
    icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    defaultProviders: [
      {
        id: 'prov-univ-1',
        name: 'Official Ministry University Registry Feed',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://mohe.gov.sa/universities-registry',
        lastCheck: new Date(Date.now() - 3600000 * 4).toISOString(),
        importedCount: 185,
        failedCount: 0,
        incompleteCount: 5,
        transferredCount: 180,
        status: 'active',
      },
      {
        id: 'prov-univ-2',
        name: 'QS World Ranking Data Portal (Enrichment Only)',
        sourceType: 'aggregator',
        trustScore: 92,
        officialUrl: 'https://topuniversities.com/data-feed',
        lastCheck: new Date(Date.now() - 3600000 * 12).toISOString(),
        importedCount: 420,
        failedCount: 15,
        incompleteCount: 30,
        transferredCount: 375,
        status: 'active',
      },
      {
        id: 'prov-univ-3',
        name: 'Global Higher Education Directory (WHED)',
        sourceType: 'official_foundation',
        trustScore: 95,
        officialUrl: 'https://whed.net/directory-api',
        lastCheck: new Date(Date.now() - 3600000 * 30).toISOString(),
        importedCount: 610,
        failedCount: 22,
        incompleteCount: 48,
        transferredCount: 540,
        status: 'active',
      }
    ]
  },
  'international-tests': {
    nameKey: 'domain_tests',
    defaultName: 'International Tests',
    defaultNameAr: 'الاختبارات الدولية',
    workspacePath: '/admin/international-tests',
    icon: <Award className="w-6 h-6 text-purple-600" />,
    defaultProviders: [
      {
        id: 'prov-test-1',
        name: 'IELTS Academic Official Test Specification & Profile Feed',
        sourceType: 'official_foundation',
        trustScore: 100,
        officialUrl: 'https://ielts.org/take-a-test/test-types/ielts-academic',
        status: 'active',
        coverageType: 'full_profile',
        descriptionAr: 'مصدر مواصفات وهيكل وملف اختبار آيلتس الأكاديمي الكامل.',
        descriptionEn: 'Full IELTS Academic test specification and profile source.',
        isReadyForImport: true,
      },
      {
        id: 'prov-test-2',
        name: 'TOEFL iBT Official Test Specification & Scoring Feed',
        sourceType: 'official_foundation',
        trustScore: 100,
        officialUrl: 'https://ets.org/toefl/ibt/about',
        status: 'under_preparation',
        coverageType: 'scoring',
        descriptionAr: 'مصدر مواصفات ونتائج اختبار توفل الرقمي - قيد الإعداد والربط.',
        descriptionEn: 'TOEFL iBT test specification and scoring feed - under preparation.',
        isReadyForImport: false,
      },
      {
        id: 'prov-test-3',
        name: 'IELTS Official Test Center & Availability Registry',
        sourceType: 'official_foundation',
        trustScore: 98,
        officialUrl: 'https://ielts.org/official-test-centers',
        status: 'needs_config',
        coverageType: 'availability_centers',
        descriptionAr: 'مصدر مراكز الاختبار والتوفر فقط، لا ينشئ ملف اختبار كامل.',
        descriptionEn: 'Availability and test centers registry only; does not create a full test profile.',
        isReadyForImport: false,
      },
      {
        id: 'prov-test-4',
        name: 'Cambridge Assessment English Standard Exam Registry',
        sourceType: 'official_foundation',
        trustScore: 95,
        officialUrl: 'https://cambridgeenglish.org/exams-and-tests',
        status: 'under_preparation',
        coverageType: 'full_profile',
        descriptionAr: 'سجل اختبارات كامبردج المعيارية - قيد الإعداد والربط.',
        descriptionEn: 'Cambridge English standardized exam registry - under preparation.',
        isReadyForImport: false,
      },
      {
        id: 'prov-test-5',
        name: 'GRE / SAT International Standardized Exam Feed',
        sourceType: 'official_foundation',
        trustScore: 98,
        officialUrl: 'https://ets.org/gre',
        status: 'under_preparation',
        coverageType: 'full_profile',
        descriptionAr: 'مصدر اختبارات GRE و SAT الدولية - قيد الإعداد والربط.',
        descriptionEn: 'GRE / SAT standardized exam feed - under preparation.',
        isReadyForImport: false,
      }
    ]
  },
  majors: {
    nameKey: 'domain_majors',
    defaultName: 'Majors & Disciplines',
    defaultNameAr: 'التخصصات الأكاديمية',
    workspacePath: '/admin/majors',
    icon: <BookOpen className="w-6 h-6 text-teal-600" />,
    defaultProviders: [
      {
        id: 'prov-maj-1',
        name: 'UNESCO ISCED Academic Classification Directory',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://unesco.org/isced-f-2013-feed',
        lastCheck: new Date(Date.now() - 3600000 * 24).toISOString(),
        importedCount: 240,
        failedCount: 0,
        incompleteCount: 2,
        transferredCount: 238,
        status: 'active',
      },
      {
        id: 'prov-maj-2',
        name: 'CIP Classification Registry (NCES)',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://nces.ed.gov/ipeds/cipcode',
        lastCheck: new Date(Date.now() - 3600000 * 48).toISOString(),
        importedCount: 310,
        failedCount: 1,
        incompleteCount: 5,
        transferredCount: 304,
        status: 'active',
      },
      {
        id: 'prov-maj-3',
        name: 'Official University Academic Program Catalogs',
        sourceType: 'official_univ',
        trustScore: 95,
        officialUrl: 'https://academic-programs.edu.sa/feed',
        lastCheck: new Date(Date.now() - 3600000 * 10).toISOString(),
        importedCount: 175,
        failedCount: 4,
        incompleteCount: 11,
        transferredCount: 160,
        status: 'active',
      }
    ]
  },
  services: {
    nameKey: 'domain_services',
    defaultName: 'Educational Services',
    defaultNameAr: 'الخدمات التعليمية',
    workspacePath: '/admin/services',
    icon: <Sparkles className="w-6 h-6 text-amber-600" />,
    defaultProviders: [
      {
        id: 'prov-srv-1',
        name: 'Ministry Student Services Catalog',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://moe.gov.sa/student-services-feed',
        lastCheck: new Date(Date.now() - 3600000 * 8).toISOString(),
        importedCount: 75,
        failedCount: 0,
        incompleteCount: 2,
        transferredCount: 73,
        status: 'active',
      },
      {
        id: 'prov-srv-2',
        name: 'Academic Guidance & Advisory Registry',
        sourceType: 'official_foundation',
        trustScore: 90,
        officialUrl: 'https://advising-portal.org/feed',
        lastCheck: new Date(Date.now() - 3600000 * 16).toISOString(),
        importedCount: 42,
        failedCount: 1,
        incompleteCount: 3,
        transferredCount: 38,
        status: 'active',
      }
    ]
  },
  cms: {
    nameKey: 'domain_cms',
    defaultName: 'CMS Articles & Content',
    defaultNameAr: 'المقالات والمحتوى CMS',
    workspacePath: '/admin/cms',
    icon: <FileText className="w-6 h-6 text-rose-600" />,
    defaultProviders: [
      {
        id: 'prov-cms-1',
        name: 'Official Education Ministry News Feed',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://moe.gov.sa/news-feed',
        lastCheck: new Date(Date.now() - 3600000 * 2).toISOString(),
        importedCount: 150,
        failedCount: 0,
        incompleteCount: 4,
        transferredCount: 146,
        status: 'active',
      },
      {
        id: 'prov-cms-2',
        name: 'Ministry Press Release Portal',
        sourceType: 'official_gov',
        trustScore: 100,
        officialUrl: 'https://press.gov.sa/education-feed',
        lastCheck: new Date(Date.now() - 3600000 * 5).toISOString(),
        importedCount: 95,
        failedCount: 1,
        incompleteCount: 2,
        transferredCount: 92,
        status: 'active',
      }
    ]
  }
};

const getDomainRules = (domainKey: string, isRTL: boolean) => {
  if (domainKey === 'international-tests') {
    return [
      { 
        key: 'extractTestStructure', 
        label: isRTL ? 'استخراج هيكل الاختبار وأقسامه ومدة كل قسم' : 'Extract test structure, sections, and section durations', 
        desc: isRTL ? 'يحلل أقسام الاختبار المهارية (الاستماع، القراءة، الكتابة، المحادثة) مع التوقيت المخصص لكل قسم' : 'Parses skill sections (Listening, Reading, Writing, Speaking) and time limits per section' 
      },
      { 
        key: 'extractScoringScale', 
        label: isRTL ? 'استخراج سلم الدرجات ومكافأة CEFR والأشرطة والمعايير' : 'Extract scoring scale, band definitions, and CEFR mapping', 
        desc: isRTL ? 'يربط مقاييس النطاق (1.0 - 9.0) أو درجات النقاط مع مستويات الإطار الأوروبي المشترك CEFR' : 'Maps band scores (1.0 - 9.0) or point scales with CEFR framework equivalencies' 
      },
      { 
        key: 'requireOfficialUrl', 
        label: isRTL ? 'اشتراط رابط مرجعي رسمي لمواصفات الاختبار' : 'Require official test specification source URL', 
        desc: isRTL ? 'يرفض السجلات التي تفتقر إلى رابط موثق لمواصفات الاختبار الرسمية' : 'Rejects records lacking verified test specification reference' 
      },
      { 
        key: 'flagUnverifiedVariants', 
        label: isRTL ? 'وضع علامة "تحت المراجعة" للنسخ أو المقاييس غير الموثقة' : 'Flag unverified test variants or non-standard scoring rules as Needs Review', 
        desc: isRTL ? 'يمنع الترقية التلقائية إذا اختلف سلم الدرجات أو نمط الاختبار عن المعيار الرسمي' : 'Prevents automatic transfer if score scale or format differs from official standard' 
      },
      { 
        key: 'importBilingual', 
        label: isRTL ? 'استيراد عنوان ووصف ودليل تحضير الاختبار باللغتين' : 'Import bilingual test title, description & preparation guidelines', 
        desc: isRTL ? 'يحافظ على العناوين والأوصاف وأدلة التحضير المترجمة باللغتين العربية والإنجليزية' : 'Preserves localized Arabic and English test overview and preparation guidelines' 
      },
    ];
  }

  if (domainKey === 'universities') {
    return [
      { key: 'extractRankings', label: isRTL ? 'استخراج التصنيف الأكاديمي والاعتمادات الرسمية' : 'Extract institutional rankings & official accreditations', desc: isRTL ? 'يستورد تصنيفات QS و THE والاعتمادات الوطنية' : 'Imports QS/THE global rankings and national accreditations' },
      { key: 'requireOfficialUrl', label: isRTL ? 'اشتراط رابط البوابة الرسمية للجامعة' : 'Require official university portal website URL', desc: isRTL ? 'يرفض المؤسسات بدون نطاق رسمي موثق' : 'Rejects institutions lacking verified official domain' },
      { key: 'verifyLocationData', label: isRTL ? 'التحقق من بيانات الموقع والحرم الجامعي والدولة' : 'Verify location, country, and campus metadata', desc: isRTL ? 'يتحقق من الدولة والمدينة وفروع الكليات' : 'Validates country, city, and campus branch data' },
      { key: 'flagNameConflicts', label: isRTL ? 'وضع علامة للجامعات المدمجة أو المعاد تسميتها' : 'Flag merged or renamed institutions as Needs Review', desc: isRTL ? 'يمنع الازدواجية عند تغير الاسم الرسمي' : 'Prevents duplicate creation when official names evolve' },
      { key: 'importBilingual', label: isRTL ? 'استيراد اسم الجامعة ونبذتها باللغتين' : 'Import bilingual university name and overview text', desc: isRTL ? 'يحافظ على الاسم العربي والإنكليزي الرسمي' : 'Preserves official Arabic and English names' },
    ];
  }

  if (domainKey === 'courses') {
    return [
      { key: 'extractDurationAndCert', label: isRTL ? 'استخراج مدة الدورة ونوع الشهادة المكتسبة' : 'Extract course duration, level, and certificate type', desc: isRTL ? 'يحلل الساعات التدريبية ومستوى الصعوبة ونوع الشهادة' : 'Parses training hours, difficulty level, and certificate credential' },
      { key: 'requireOfficialUrl', label: isRTL ? 'اشتراط رابط كتالوج الدورة المعتمد' : 'Require verified course catalog or platform URL', desc: isRTL ? 'يرفض البرامج بدون رابط منصة موثوقة' : 'Rejects courses lacking verified provider portal link' },
      { key: 'extractPrerequisites', label: isRTL ? 'استخراج المتطلبات السابقة والجمهور المستهدف' : 'Extract prerequisites and target audience', desc: isRTL ? 'يحدد المؤهلات المطلوبة للتسجيل' : 'Identifies required background skills and target learners' },
      { key: 'flagExpiredRuns', label: isRTL ? 'وضع علامة "تحت المراجعة" للدورات المنتهية' : 'Flag expired or inactive course runs as Needs Review', desc: isRTL ? 'يمنع عرض جولات التدريب المنتهية' : 'Prevents transferring inactive course schedules' },
      { key: 'importBilingual', label: isRTL ? 'استيراد عنوان الدورة والمنهج ثنائي اللغة' : 'Import bilingual course title and syllabus summary', desc: isRTL ? 'يحافظ على تفاصيل المنهج باللغتين' : 'Preserves localized course title and syllabus' },
    ];
  }

  if (domainKey === 'majors') {
    return [
      { key: 'mapIscedClassification', label: isRTL ? 'الربط المباشر مع تصنيف يونيسكو ISCED-F 2013' : 'Map to UNESCO ISCED-F 2013 academic classification codes', desc: isRTL ? 'يصنف التخصص تحت الكود المعياري الدولي' : 'Categorizes discipline under international standard codes' },
      { key: 'requireFacultyContext', label: isRTL ? 'اشتراط تحديد الكلية والدرجة العلمية' : 'Require official faculty and degree level context', desc: isRTL ? 'يربط التخصص بالكلية المانحة' : 'Associates major with granting college/faculty' },
      { key: 'extractCareerOutcomes', label: isRTL ? 'استخراج المسارات المهنية ومجالات العمل' : 'Extract career paths and discipline scope', desc: isRTL ? 'يحدد الوظائف المستهدفة للخريجين' : 'Identifies target career roles for graduates' },
      { key: 'flagCustomMajors', label: isRTL ? 'وضع علامة للتخصصات غير المصنفة رسمياً' : 'Flag unclassified custom majors as Needs Review', desc: isRTL ? 'يتطلب موافقة المسؤول للتخصصات الجديدة' : 'Requires admin review for non-standard discipline names' },
      { key: 'importBilingual', label: isRTL ? 'استيراد اسم التخصص ووصفه باللغتين' : 'Import bilingual major name and description', desc: isRTL ? 'يحافظ على المسمى العربي والإنكليزي الأكاديمي' : 'Preserves official academic names in AR and EN' },
    ];
  }

  // Default Scholarships rules
  return [
    { key: 'focusPostgrad', label: isRTL ? 'التركيز على فرص الماجستير والدراسات العليا' : 'Focus on Master / Postgraduate opportunities', desc: isRTL ? 'يعطي الأولوية لبرامج الدراسات العليا في مصنف التحقق' : 'Prioritizes postgrad programs in validation classifier' },
    { key: 'ignoreExpired', label: isRTL ? 'تجاهل الفرص المنتهية / السابقة' : 'Ignore expired / past opportunities', desc: isRTL ? 'يضع علامة فاشلة تلقائياً على السجلات المنتهية' : 'Automatically flags expired records as Failed' },
    { key: 'requireOfficialUrl', label: isRTL ? 'اشتراط رابط مصدر رسمي لجميع السجلات' : 'Require official source URL on all records', desc: isRTL ? 'يرفض السجلات التي تفتقر إلى رابط موثق' : 'Rejects records lacking verified link' },
    { key: 'missingDeadlineReview', label: isRTL ? 'وضع علامة "تحت المراجعة" للمواعيد المفقودة' : 'Mark missing application deadline as Needs Review', desc: isRTL ? 'يمنع النقل التلقائي إذا كان الموعد النهائي فارغاً' : 'Prevents automatic transfer if deadline is null' },
    { key: 'importBilingual', label: isRTL ? 'استيراد النصوص ثنائية اللغة (عربي / إنجليزي)' : 'Import bilingual Arabic / English text if available', desc: isRTL ? 'يحافظ على الحقول المترجمة' : 'Preserves localized fields' },
  ];
};

export function AdminDomainImportCenterPage() {
  const { domainKey } = useParams<{ domainKey: string }>();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();

  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';
  const currentDomain = DOMAIN_METADATA[domainKey || 'scholarships'] || DOMAIN_METADATA.scholarships;

  const [providers, setProviders] = useState<ProviderSource[]>(currentDomain.defaultProviders);

  // Wizard State
  const [activeWizard, setActiveWizard] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedProvider, setSelectedProvider] = useState<ProviderSource | null>(null);
  const [inputMethod, setInputMethod] = useState<'file' | 'paste' | 'url' | 'connector' | 'demo'>('demo');
  const [officialUrlInput, setOfficialUrlInput] = useState<string>('');
  const [pastedPayload, setPastedPayload] = useState<string>('');
  const [testImportFile, setTestImportFile] = useState<File | null>(null);
  const [testImportText, setTestImportText] = useState<string>('');
  const [recordLimit, setRecordLimit] = useState<'10' | '50' | '100' | 'custom'>('50');
  const [customRecordLimit, setCustomRecordLimit] = useState<number>(25);
  
  // Admin instructions
  const [instructions, setInstructions] = useState<Record<string, any>>({
    extractTestStructure: true,
    extractScoringScale: true,
    requireOfficialUrl: true,
    flagUnverifiedVariants: true,
    importBilingual: true,
    focusPostgrad: true,
    ignoreExpired: true,
    missingDeadlineReview: true,
    extractRankings: true,
    verifyLocationData: true,
    flagNameConflicts: true,
    extractDurationAndCert: true,
    extractPrerequisites: true,
    flagExpiredRuns: true,
    mapIscedClassification: true,
    requireFacultyContext: true,
    extractCareerOutcomes: true,
    flagCustomMajors: true,
    customNote: ''
  });

  // International Test Import Cards State
  const [testImportCards, setTestImportCards] = useState<Array<any>>(() => {
    try {
      const saved = localStorage.getItem('manaratak_test_import_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const uniqueCardsMap = new Map<string, any>();
          for (const card of parsed) {
            const testId = card.testId || card.id || '';
            const titleLower = ((card.title || '') + ' ' + (card.titleAr || '') + ' ' + testId).toLowerCase();
            if ((testId.includes('sat') && !testId.includes('csat')) || testId.includes('gre')) continue;
            
            let key = testId;
            if (titleLower.includes('toefl') || titleLower.includes('توفل')) key = 'test-toefl-ibt';
            if (titleLower.includes('ielts') || titleLower.includes('آيلتس')) key = 'test-ielts-academic';
            if (titleLower.includes('duolingo') || titleLower.includes('دولينجو') || titleLower.includes('det')) key = 'test-duolingo-det';
            if (titleLower.includes('alevel') || titleLower.includes('a-level') || titleLower.includes('المستوى المتقدم')) key = 'test-alevel-uk';
            if (titleLower.includes('abitur') || titleLower.includes('ألمانية') || titleLower.includes('allgemeine hochschulreife')) key = 'test-abitur-de';
            if (titleLower.includes('act') || titleLower.includes('american college testing')) key = 'test-act-us';
            if (titleLower.includes('celpe') || titleLower.includes('برتغالية') || titleLower.includes('portuguese')) key = 'test-celpebras-br';
            if (titleLower.includes('cils') || titleLower.includes('إيطالية') || titleLower.includes('italian')) key = 'test-cils-it';
            if (titleLower.includes('ap') || titleLower.includes('advanced placement') || titleLower.includes('متقدم')) key = 'test-ap-us';
            if (titleLower.includes('cambridge') || titleLower.includes('كامبريدج') || titleLower.includes('c1 advanced')) key = 'test-cambridge-uk';

            if (!uniqueCardsMap.has(key)) {
              uniqueCardsMap.set(key, { ...card, testId: key });
            }
          }
          const filtered = Array.from(uniqueCardsMap.values());
          if (filtered.length > 0) {
            return filtered.map((card: any) => {
              const baseCard = {
                ...card,
                notes: (!card.notes || card.notes.length > 120 || card.notes.includes('#') || card.notes.includes('**'))
                  ? 'تم استيراد ومعالجة ملف البيانات الشامل واستخراج الأقسام وسلالم الدرجات بنجاح والترحيل التلقائي لصفحة تفاصيل الاختبار.'
                  : card.notes
              };
              if (card.testId === 'test-ielts-academic' && !card.markdownContent) {
                baseCard.markdownContent = IELTS_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-toefl-ibt' && !card.markdownContent) {
                baseCard.markdownContent = TOEFL_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-duolingo-det' && !card.markdownContent) {
                baseCard.markdownContent = DUOLINGO_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-alevel-uk' && !card.markdownContent) {
                baseCard.markdownContent = ALEVEL_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-abitur-de' && !card.markdownContent) {
                baseCard.markdownContent = ABITUR_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-act-us' && !card.markdownContent) {
                baseCard.markdownContent = ACT_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-celpebras-br' && !card.markdownContent) {
                baseCard.markdownContent = CELPEBRAS_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-cils-it' && !card.markdownContent) {
                baseCard.markdownContent = CILS_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-ap-us' && !card.markdownContent) {
                baseCard.markdownContent = AP_MARKDOWN_CONTENT;
              }
              if (card.testId === 'test-cambridge-uk' && !card.markdownContent) {
                baseCard.markdownContent = CAMBRIDGE_MARKDOWN_CONTENT;
              }
              return baseCard;
            });
          }
        }
      }
    } catch (e) {}
    return [
      {
        id: 'card-ielts-master-2026',
        testId: 'test-ielts-academic',
        title: 'IELTS Academic — اختبار الآيلتس الأكاديمي الدولي',
        titleAr: 'اختبار الآيلتس (IELTS) — ملف البيانات المعتمد الشامل 2026',
        fileName: 'TS_2026_Complete_Data_AR_Final.md',
        fileSize: '55.7 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'British Council / IDP / Cambridge',
        scoreRange: '0.0 – 9.0 Band Scale',
        validity: 'سنتان (24 شهراً)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 14:10',
        sectionsList: ['الاستماع (Listening)', 'القراءة (Reading)', 'الكتابة (Writing)', 'المحادثة (Speaking)'],
        notes: 'تمت معالجة ملف البيانات الشامل واستخراج الأقسام وسلالم الدرجات ومراكز الاختبار بنجاح والترحيل التلقائي لإدارة الاختبارات.',
        markdownContent: IELTS_MARKDOWN_CONTENT
      },
      {
        id: 'card-toefl-master-2026',
        testId: 'test-toefl-ibt',
        title: 'TOEFL iBT — اختبار التوفل عبر الإنترنت الدولي 2026',
        titleAr: 'اختبار التوفل (TOEFL iBT) — ملف بيانات الاختبار الكامل 2026',
        fileName: 'TOEFL_iBT_2026_Complete_Data_AR.md',
        fileSize: '48.2 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'Educational Testing Service (ETS)',
        scoreRange: '1.0 – 6.0 Band Scale (0 – 120 Score)',
        validity: 'سنتان (24 شهراً)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 15:30',
        sectionsList: ['القراءة (Reading)', 'الاستماع (Listening)', 'الكتابة (Writing)', 'المحادثة (Speaking)'],
        notes: 'تمت معالجة ملف بيانات التوفل المحدّث لعام 2026 واستخراج الأقسام وسلالم الدرجات والربط مع ETS بنجاح.',
        markdownContent: TOEFL_MARKDOWN_CONTENT
      },
      {
        id: 'card-duolingo-master-2026',
        testId: 'test-duolingo-det',
        title: 'Duolingo English Test — اختبار دولينجو للغة الإنجليزية 2026',
        titleAr: 'اختبار دولينجو (DET) — ملف البيانات الكامل للطلاب 2026',
        fileName: 'Duolingo_English_Test_2026_Data_AR.md',
        fileSize: '42.5 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'Duolingo, Inc.',
        scoreRange: '10 – 160 Score Scale',
        validity: 'سنتان (24 شهراً)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 15:40',
        sectionsList: ['القراءة (Reading)', 'الاستماع (Listening)', 'الكتابة (Writing)', 'المحادثة (Speaking)'],
        notes: 'تمت معالجة ملف بيانات اختبار دولينجو التكيّفي الكامل واستخراج الأقسام وسلالم الدرجات والروابط الرسمية بنجاح.',
        markdownContent: DUOLINGO_MARKDOWN_CONTENT
      },
      {
        id: 'card-alevel-master-2026',
        testId: 'test-alevel-uk',
        title: 'A-Level / UK & International — مؤهلات المستوى المتقدم البريطاني والدولي 2026',
        titleAr: 'المستوى المتقدم البريطاني والدولي (A-Level) — ملف البيانات المعتمد الشامل 2026',
        fileName: 'A_Level_UK_International_2026_Data_AR.md',
        fileSize: '68.4 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'Cambridge / Pearson Edexcel / OxfordAQA',
        scoreRange: 'A* – E (Pass), U (Unclassified)',
        validity: 'دائم (Permanent Qualification)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 15:50',
        sectionsList: ['AS Level (السنة الأولى)', 'A2 Level (السنة الثانية)', 'Coursework & Practical Endorsement'],
        notes: 'تمت معالجة ملف بيانات عائلة مؤهلات A-Level الشاملة واستخراج التخصصات والمجالس والاعتراف الجامعي بنجاح.',
        markdownContent: ALEVEL_MARKDOWN_CONTENT
      },
      {
        id: 'card-abitur-master-2026',
        testId: 'test-abitur-de',
        title: 'Abitur / Germany — الثانوية العامة الألمانية المؤهلة للجامعة 2026',
        titleAr: 'الثانوية العامة الألمانية (Abitur) — ملف البيانات المعتمد الشامل 2026',
        fileName: 'German_Abitur_2026_Data_AR.md',
        fileSize: '72.1 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'وزارات التعليم الألمانية (KMK / IQB)',
        scoreRange: '300 – 900 Punkte (المعدل 1.0 – 4.0)',
        validity: 'دائم (Permanent Qualification)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 16:00',
        sectionsList: ['Qualifikationsphase (Block I)', 'Abiturprüfung (Block II)', 'الامتحانات الشفهية والكتابية'],
        notes: 'تمت معالجة ملف بيانات Abitur الشامل واستخراج نظام النقاط وحساب المعدل والاعتراف الأوروبي بنجاح.',
        markdownContent: ABITUR_MARKDOWN_CONTENT
      },
      {
        id: 'card-act-master-2026',
        testId: 'test-act-us',
        title: 'ACT / USA & International — اختبار القبول الجامعي الأمريكي 2026',
        titleAr: 'اختبار القبول الجامعي الأمريكي (Enhanced ACT) — ملف البيانات المعتمد الشامل 2026',
        fileName: 'Enhanced_ACT_2026_Data_AR.md',
        fileSize: '65.8 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'ACT Education Corp.',
        scoreRange: '1 – 36 Composite Score Scale',
        validity: '5 سنوات (معتمد للقبول والمنح)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 16:05',
        sectionsList: ['English (35 دقيقة)', 'Math (50 دقيقة)', 'Reading (40 دقيقة)', 'Science (اختياري)', 'Writing (اختياري)'],
        notes: 'تمت معالجة ملف بيانات Enhanced ACT الشامل وتحديث بنية الدرجة المركبة وصيغ الاختيار بجميع التفاصيل بنجاح.',
        markdownContent: ACT_MARKDOWN_CONTENT
      },
      {
        id: 'card-celpebras-master-2026',
        testId: 'test-celpebras-br',
        title: 'Celpe-Bras / Brazil — الشهادة البرازيلية الرسمية للكفاءة في البرتغالية 2026',
        titleAr: 'اختبار الكفاءة في اللغة البرتغالية للطلاب والأجانب (Celpe-Bras) — ملف البيانات الكامل 2026',
        fileName: 'Celpe_Bras_Portuguese_2026_Data_AR.md',
        fileSize: '58.9 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'Inep / Ministério da Educação (البرازيل)',
        scoreRange: 'Intermediário – Avançado Superior (4 مستويات)',
        validity: 'محدد حسب الجهة والمؤسسة',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 16:10',
        sectionsList: ['Parte Escrita (الجزء الكتابي - 3 ساعات)', 'Parte Oral (المقابلة الشفهية - 20 دقيقة)'],
        notes: 'تمت معالجة ملف بيانات Celpe-Bras الرسمي واستخراج بنية المهمات التكاملية ومستويات التقييم الأربعة بنجاح.',
        markdownContent: CELPEBRAS_MARKDOWN_CONTENT
      },
      {
        id: 'card-cils-master-2026',
        testId: 'test-cils-it',
        title: 'CILS / Italy — شهادة الكفاءة في اللغة الإيطالية (Università per Stranieri di Siena) 2026',
        titleAr: 'شهادة الكفاءة في اللغة الإيطالية (CILS) — ملف البيانات المعتمد الشامل 2026',
        fileName: 'CILS_Italian_2026_Data_AR.md',
        fileSize: '78.3 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'Università per Stranieri di Siena (Centro CILS)',
        scoreRange: 'A1 – C2 (55 - 100 نقطة للمستويات العلياء)',
        validity: 'دائم (بدون تاريخ انتهاء)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 16:15',
        sectionsList: ['Ascolto (الاستماع)', 'Lettura (القراءة)', 'Strutture (البنى)', 'Scritta (الكتابة)', 'Orale (الشفهي)'],
        notes: 'تمت معالجة ملف بيانات CILS الشامل واستخراج المستويات العامة ووحدات المواطنة والإقامة وقواعد تجميع المهارات بنجاح.',
        markdownContent: CILS_MARKDOWN_CONTENT
      },
      {
        id: 'card-ap-master-2026',
        testId: 'test-ap-us',
        title: 'AP Exams / USA & International — برنامج اختبارات التقدم المتقدم (Advanced Placement) 2026',
        titleAr: 'برنامج اختبارات التقدم المتقدم (AP Exams) — ملف البيانات الشامل 2026',
        fileName: 'AP_Exams_College_Board_2026_Data_AR.md',
        fileSize: '82.4 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'College Board',
        scoreRange: '1 – 5 Score Scale (لكل مادة)',
        validity: 'دائم (معتمد للساعات والائتمان الجامعي)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 16:20',
        sectionsList: ['Multiple Choice Section (اختيار من متعدد)', 'Free Response / Digital Portfolio (مشاريع ومقالات)'],
        notes: 'تمت معالجة ملف بيانات AP Exams لجميع المواد وصيغ تقديم Bluebook الرقمية والائتمان الجامعي بنجاح.',
        markdownContent: AP_MARKDOWN_CONTENT
      },
      {
        id: 'card-cambridge-master-2026',
        testId: 'test-cambridge-uk',
        title: 'Cambridge English Qualifications — مؤهلات كامبريدج للغة الإنجليزية (A2 - C2) 2026',
        titleAr: 'مؤهلات كامبريدج للغة الإنجليزية (Cambridge English Qualifications) — ملف البيانات الشامل 2026',
        fileName: 'Cambridge_English_Qualifications_2026_Data_AR.md',
        fileSize: '71.5 KB',
        sourceType: 'إرفاق ملف + بيانات نصية',
        providerName: 'Cambridge University Press & Assessment',
        scoreRange: '100 – 230 Cambridge English Scale',
        validity: 'دائم (Lifetime Qualification)',
        status: 'PUBLISHED',
        importedAt: '2026-08-02 16:25',
        sectionsList: ['Reading & Use of English', 'Writing (الكتابة)', 'Listening (الاستماع)', 'Speaking (المحادثة)'],
        notes: 'تمت معالجة ملف بيانات مؤهلات كامبريدج الشامل وتوثيق المستويات من A2 Key إلى C2 Proficiency بنجاح.',
        markdownContent: CAMBRIDGE_MARKDOWN_CONTENT
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('manaratak_test_import_cards', JSON.stringify(testImportCards));
    } catch (e) {}
  }, [testImportCards]);

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);

  const [selectedBatchId, setSelectedBatchId] = useState<string>('BATCH-2026-DAAD-04');
  const activeBatch = SCHOLARSHIP_IMPORT_BATCHES.find(b => b.id === selectedBatchId) || SCHOLARSHIP_IMPORT_BATCHES[0];

  useEffect(() => {
    if (domainKey && DOMAIN_METADATA[domainKey]) {
      setProviders(DOMAIN_METADATA[domainKey].defaultProviders);
    }
  }, [domainKey]);

  if (!demoUnlocked) {
    return <Navigate to="/login" replace />;
  }

  // Handle launch wizard for provider
  const handleLaunchWizard = (prov?: ProviderSource) => {
    const chosen = prov || providers[0] || {
      id: 'custom-source',
      name: `Custom ${currentDomain.defaultName} Ingestion Channel`,
      sourceType: 'manual_source',
      trustScore: 90,
      officialUrl: 'https://official-source.gov.sa/feed',
      lastCheck: new Date().toISOString(),
      importedCount: 0,
      failedCount: 0,
      incompleteCount: 0,
      transferredCount: 0,
      status: 'active'
    };

    setSelectedProvider(chosen);
    setOfficialUrlInput(chosen.officialUrl || '');
    setWizardStep(1);
    setExecutionResult(null);
    setActiveWizard(true);
  };

  // Handle Test Source
  const handleTestSource = (id: string) => {
    setProviders(providers.map(p => p.id === id ? { ...p, lastCheck: new Date().toISOString() } : p));
  };

  // Handle Toggle Source
  const handleToggleSource = (id: string) => {
    setProviders(providers.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'disabled' : 'active' } : p));
  };

  // Run Batch Execution (Step 6)
  const handleRunBatchExecution = async () => {
    setIsExecuting(true);
    try {
      const limitNum = recordLimit === 'custom' ? customRecordLimit : parseInt(recordLimit, 10);
      
      let targetDataType = 'SCHOLARSHIPS';
      const keyLower = (domainKey || '').toLowerCase();
      if (keyLower === 'international-tests' || keyLower === 'tests') {
        targetDataType = 'TESTS';
      } else if (keyLower === 'scholarships') {
        targetDataType = 'SCHOLARSHIPS';
      } else if (keyLower === 'universities') {
        targetDataType = 'UNIVERSITIES';
      } else if (keyLower === 'majors') {
        targetDataType = 'MAJORS';
      } else if (keyLower === 'courses') {
        targetDataType = 'COURSES';
      } else if (keyLower === 'services') {
        targetDataType = 'SERVICES';
      } else if (domainKey) {
        targetDataType = domainKey.toUpperCase();
      }

      let dataTextContent = '';
      let testPayloadObj: any = null;

      if (keyLower === 'international-tests' || keyLower === 'tests' || targetDataType === 'TESTS') {
        const combinedStr = ((testImportFile?.name || '') + ' ' + (testImportText || '') + ' ' + (pastedPayload || '')).toLowerCase();
        
        let tName = 'IELTS Academic';
        let dispName = 'IELTS Academic — اختبار الآيلتس الأكاديمي الدولي';
        let nameAr = 'اختبار الآيلتس (IELTS) — ملف البيانات المعتمد الشامل 2026';
        let nameEn = 'IELTS Official Master Data Reference 2026';
        let provName = selectedProvider?.name || 'British Council / IDP / Cambridge Assessment';
        let abbrev = 'IELTS';
        let cat = 'Language / Academic Proficiency';
        let scoreR = '0.0 – 9.0 Band Scale';
        let feeVal = 'USD $265 - $215';

        if (combinedStr.includes('toefl')) {
          tName = 'TOEFL iBT';
          dispName = 'TOEFL iBT — اختبار التوفل الدولي الرقمي الشامل';
          nameAr = 'اختبار التوفل (TOEFL iBT) — ملف البيانات الرقمية المعتمد 2026';
          nameEn = 'TOEFL iBT Official Master Data Reference 2026';
          provName = 'ETS (Educational Testing Service)';
          abbrev = 'TOEFL';
          cat = 'Language / Academic Proficiency';
          scoreR = '0 – 120 Score';
          feeVal = 'USD $245 - $190';
        } else if (combinedStr.includes('sat')) {
          tName = 'SAT (Scholastic Assessment Test)';
          dispName = 'SAT — اختبار القبول الجامعي';
          nameAr = 'اختبار القبول الجامعي (SAT)';
          nameEn = 'Scholastic Assessment Test';
          provName = 'College Board';
          abbrev = 'SAT';
          cat = 'Admission / Undergraduate';
          scoreR = '400 - 1600';
          feeVal = 'USD $111+';
        } else if (combinedStr.includes('gre')) {
          tName = 'GRE General Test';
          dispName = 'GRE General Test — اختبار الجي آر إي المتقدم للدراسات العليا';
          nameAr = 'اختبار الجي آر إي (GRE) — ملف بيانات الدراسات العليا المعتمد 2026';
          nameEn = 'GRE General Test Official Master Data Reference 2026';
          provName = 'ETS (Educational Testing Service)';
          abbrev = 'GRE';
          cat = 'Graduate Admission / Professional';
          scoreR = '260 – 340 Score';
          feeVal = 'USD $220';
        } else if (combinedStr.includes('duolingo') || combinedStr.includes('det')) {
          tName = 'Duolingo English Test';
          dispName = 'Duolingo English Test — اختبار دوولينجو الدولي من المنزل';
          nameAr = 'اختبار دوولينجو (DET) — ملف البيانات الرقمية المعتمد 2026';
          nameEn = 'Duolingo English Test Official Master Data Reference 2026';
          provName = 'Duolingo Inc.';
          abbrev = 'DET';
          cat = 'Language / Adaptive Test';
          scoreR = '10 – 160 Score Scale';
          feeVal = 'USD $59';
        }

        testPayloadObj = {
          testName: tName,
          displayName: dispName,
          canonicalName: tName,
          localizedNameAr: nameAr,
          localizedNameEn: nameEn,
          abbreviation: abbrev,
          providerName: provName,
          testCategory: cat,
          officialSourceUrl: officialUrlInput || 'https://www.ielts.org',
          description: testImportText || 'ملف بيانات ومواصفات الاختبار المرفق المعتمد.',
          sections: [
            { sectionName: 'Listening', durationMinutes: 30, questionCount: 40, scoreMinimum: 0, scoreMaximum: 9, order: 1 },
            { sectionName: 'Reading', durationMinutes: 60, questionCount: 40, scoreMinimum: 0, scoreMaximum: 9, order: 2 },
            { sectionName: 'Writing', durationMinutes: 60, questionCount: 2, scoreMinimum: 0, scoreMaximum: 9, order: 3 },
            { sectionName: 'Speaking', durationMinutes: 14, questionCount: 3, scoreMinimum: 0, scoreMaximum: 9, order: 4 }
          ],
          scoreScale: {
            overallMinimum: 0,
            overallMaximum: 9,
            scoreIncrement: 0.5,
            resultValidityDurationMonths: 24,
            bandsOrLevels: scoreR
          },
          optionalFields: {
            attachedFileName: testImportFile?.name || 'TS_2026_Complete_Data_AR_Final.md',
            fileSize: testImportFile ? `${(testImportFile.size / 1024).toFixed(1)} KB` : '55.7 KB',
            importNotes: testImportText || 'تم استيراد مواصفات تفاصيل الاختبار بنجاح.',
            fee: feeVal
          }
        };

        dataTextContent = JSON.stringify(testPayloadObj, null, 2);
      } else if (inputMethod === 'paste' && pastedPayload && pastedPayload.trim().length > 0) {
        dataTextContent = pastedPayload;
      } else {
        dataTextContent = JSON.stringify({
          provider: selectedProvider?.name || 'Manual Import Channel',
          officialUrl: officialUrlInput || selectedProvider?.officialUrl || '',
          limit: limitNum,
          method: inputMethod,
          instructions
        }, null, 2);
      }

      const payload = {
        dataType: targetDataType,
        sourceSystem: selectedProvider?.name || 'Manual Import Channel',
        dataText: dataTextContent
      };

      let batchRes: any = null;
      try {
        batchRes = await ApiClient.createImportBatch(payload);
      } catch (err) {
        console.warn('API createImportBatch fallback:', err);
      }
      const createdRecords = batchRes?.records || [];
      const batchId = batchRes?.batch?.id || `batch-${Date.now().toString().substring(6)}`;

      const promotedList: Array<{ recordId: string; testId: string; testName: string }> = [];

      // Auto promote valid records if domain is TESTS / international-tests
      if (targetDataType === 'TESTS' || keyLower === 'international-tests' || keyLower === 'tests') {
        for (const rec of createdRecords) {
          if (rec.id && (rec.status === 'COMPLETE' || rec.status === 'VALID' || rec.status === 'NEEDS_REVIEW')) {
            try {
              const prom = await ApiClient.promoteImportRecord(rec.id);
              if (prom && (prom.type === 'CREATED' || prom.type === 'DUPLICATE') && (prom.testId || prom.existingId)) {
                promotedList.push({
                  recordId: rec.id,
                  testId: prom.testId || prom.existingId,
                  testName: rec.rawPayload?.displayName || rec.rawPayload?.testName || 'IELTS Academic'
                });
              }
            } catch (pErr) {
              console.warn('Auto-promotion warning for record', rec.id, pErr);
            }
          }
        }

        // Add to International Test Import Cards
        if (testPayloadObj) {
          const finalTestId = promotedList[0]?.testId || `test-${testPayloadObj.abbreviation.toLowerCase()}-${Date.now().toString().slice(-4)}`;
          const newCardObj = {
            id: `card-${Date.now()}`,
            testId: finalTestId,
            title: testPayloadObj.displayName,
            titleAr: testPayloadObj.localizedNameAr,
            fileName: testImportFile?.name || 'TS_2026_Complete_Data_AR_Final.md',
            fileSize: testImportFile ? `${(testImportFile.size / 1024).toFixed(1)} KB` : '55.7 KB',
            sourceType: testImportFile ? 'إرفاق ملف + بيانات نصية' : 'إدخال بيانات نصية',
            providerName: testPayloadObj.providerName,
            scoreRange: testPayloadObj.scoreScale.bandsOrLevels,
            validity: 'سنتان (24 شهراً)',
            status: 'PROMOTED',
            importedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            sectionsList: ['الاستماع (Listening)', 'القراءة (Reading)', 'الكتابة (Writing)', 'المحادثة (Speaking)'],
            notes: (testImportText && testImportText.length > 0 && testImportText.length < 100)
              ? testImportText
              : 'تمت معالجة بيانات وتفاصيل المستند المستورد بنجاح وترحيلها تلقائياً إلى مساحة إدارة الاختبارات الدولية.',
            markdownContent: testImportText || pastedPayload
          };
          setTestImportCards(prev => [newCardObj, ...prev.filter(c => c.id !== newCardObj.id)]);
        }
      }

      setExecutionResult({
        batchId,
        total: batchRes?.batch?.totalRecords || limitNum,
        staged: batchRes?.batch?.processedRecords || limitNum,
        records: createdRecords,
        promotedCount: promotedList.length,
        promotedTests: promotedList
      });

      setWizardStep(6);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePromoteRecord = async (recordId?: string) => {
    let targetId = recordId;
    if (!targetId && executionResult?.records?.[0]?.id) {
      targetId = executionResult.records[0].id;
    }
    if (!targetId && executionResult?.batchId) {
      try {
        const batchRecords = await ApiClient.getImportedRecords({ batchId: executionResult.batchId });
        if (batchRecords?.data?.[0]?.id) {
          targetId = batchRecords.data[0].id;
        }
      } catch (e) {
        // ignore
      }
    }
    if (!targetId) return;

    try {
      const res = await ApiClient.promoteImportRecord(targetId);
      if (res && (res.type === 'CREATED' || res.type === 'DUPLICATE') && (res.testId || res.existingId)) {
        const testId = res.testId || res.existingId;
        setExecutionResult((prev: any) => {
          if (!prev) return prev;
          const exists = prev.promotedTests?.some((p: any) => p.recordId === targetId);
          if (exists) return prev;
          const newPromoted = [
            ...(prev.promotedTests || []),
            { recordId: targetId, testId, testName: 'IELTS Academic' }
          ];
          return {
            ...prev,
            promotedCount: newPromoted.length,
            promotedTests: newPromoted
          };
        });
      }
    } catch (err) {
      console.error('Failed to promote record:', err);
    }
  };

  const isRTL = dir === 'rtl';
  const domainTitle = isRTL ? (currentDomain as any).defaultNameAr || currentDomain.defaultName : currentDomain.defaultName;

  const getTrustBadge = (score: number) => {
    if (isRTL) {
      if (score >= 90) return { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'فئة مصدر مسجل' };
      if (score >= 80) return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'تتطلب مراجعة المجال' };
      if (score >= 50) return { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'غير متصل بمحرك التحقق' };
      return { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'معاينة فقط' };
    }
    if (score >= 90) return { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Registered source category' };
    if (score >= 80) return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Requires domain review' };
    if (score >= 50) return { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Not connected to verification engine' };
    return { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Preview only' };
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6" dir={dir}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link 
          to="/admin/imports" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t('back_to_import_management') || (isRTL ? 'العودة لإدارة الاستيراد' : 'Back to Import Management')}</span>
        </Link>

        <Link
          to={currentDomain.workspacePath}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('open_domain_workspace') || (isRTL ? 'فتح لوحة المجال' : 'Open Domain Workspace')}</span>
        </Link>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl">
            {currentDomain.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-1.5">
              <ShieldCheck className="w-3 h-3" />
              <span>{isRTL ? 'مركز التحكم بالمجال المخصص' : 'Dedicated Domain Control Center'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {t(`${domainKey}_import_center` as any) || (isRTL ? `مركز استيراد ${domainTitle}` : `${currentDomain.defaultName} Import Center`)}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isRTL 
                ? 'خط معالجة بيانات معزول للمجال، مع خلاصات المزودين المسجلين، ودرجات موثوقية المصادر، وتشغيل معالج الاستيراد.' 
                : 'Domain-isolated ingestion pipeline, registered provider feeds, source trust scores, and wizard execution.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleLaunchWizard()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t('start_import') || (isRTL ? 'بدء معالج الاستيراد' : 'Start Import Wizard')}</span>
        </button>
      </div>

      {/* SCHOLARSHIP DOMAIN INTELLIGENCE OVERVIEW */}
      {domainKey === 'scholarships' && (
        <>
          {/* 1. Visual Ingestion Pipeline Flow Banner */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>{t('import_pipeline_flow') || (isRTL ? 'خط ومراحل معالجة البيانات الفورية للمنح الدراسية' : 'Scholarships Ingestion Pipeline Flow')}</span>
            </div>
            <div className="flex items-center justify-between overflow-x-auto py-2 gap-3 text-xs font-medium border-t border-slate-800/80 pt-4">
              {[
                { en: 'Source', ar: 'المصدر' },
                { en: 'Import', ar: 'الاستيراد' },
                { en: 'Normalize', ar: 'تنظيف الاسم' },
                { en: 'Deduplicate', ar: 'منع التكرار' },
                { en: 'Merge Missing Fields', ar: 'دمج الحقول' },
                { en: 'Transfer to Workspace', ar: 'الترحيل للمنح' },
                { en: 'Human Review', ar: 'مراجعة الخبير' },
                { en: 'Publish', ar: 'النشر العام' },
              ].map((step, idx, arr) => (
                <React.Fragment key={step.en}>
                  <div className="flex flex-col items-center text-center shrink-0 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800/80 min-w-[110px]">
                    <span className="text-[9px] text-slate-500 font-mono">0{idx + 1}</span>
                    <span className="font-bold text-slate-200 text-xs mt-0.5">{dir === 'rtl' ? step.ar : step.en}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <ChevronRight className={`w-4 h-4 text-slate-600 shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 2. 10 Metric Summary Intelligence Cards Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>{t('scholarship_import_intelligence') || 'Scholarship Import Intelligence & Quality Controls'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time metrics for name cleaning, deduplication, missing-field enrichment, and domain workspace transfer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { key: 'total_records_read', label: t('total_records_read') || 'إجمالي السجلات المقروءة', value: '815', color: 'bg-slate-50 border-slate-200 text-slate-900', icon: <FileText className="w-4 h-4 text-slate-600" /> },
                { key: 'names_normalized', label: t('names_normalized') || 'أسماء المنح التي تم تنظيفها', value: '742', color: 'bg-blue-50 border-blue-200 text-blue-900', icon: <CheckCircle2 className="w-4 h-4 text-blue-600" /> },
                { key: 'duplicates_skipped', label: t('duplicates_skipped') || 'مكررة وتم تجاهلها', value: '98', color: 'bg-purple-50 border-purple-200 text-purple-900', icon: <Layers className="w-4 h-4 text-purple-600" /> },
                { key: 'existing_enriched', label: t('existing_enriched') || 'منح موجودة تم إكمال حقول ناقصة لها', value: '154', color: 'bg-indigo-50 border-indigo-200 text-indigo-900', icon: <Plus className="w-4 h-4 text-indigo-600" /> },
                { key: 'new_scholarships_created', label: t('new_scholarships_created') || 'منح جديدة تم إنشاؤها', value: '520', color: 'bg-emerald-50 border-emerald-200 text-emerald-900', icon: <GraduationCap className="w-4 h-4 text-emerald-600" /> },
                { key: 'incomplete_records', label: t('incomplete_records') || 'سجلات ناقصة', value: '28', color: 'bg-amber-50 border-amber-200 text-amber-900', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
                { key: 'failed_records', label: t('failed_records') || 'سجلات فاشلة', value: '15', color: 'bg-rose-50 border-rose-200 text-rose-900', icon: <X className="w-4 h-4 text-rose-600" /> },
                { key: 'transferred_to_workspace', label: t('transferred_to_workspace') || 'تم ترحيلها إلى لوحة المنح', value: '674', color: 'bg-teal-50 border-teal-200 text-teal-900', icon: <ExternalLink className="w-4 h-4 text-teal-600" /> },
                { key: 'requires_source_verification', label: t('requires_source_verification') || 'تحتاج تحقق من المصدر', value: '32', color: 'bg-orange-50 border-orange-200 text-orange-900', icon: <ShieldCheck className="w-4 h-4 text-orange-600" /> },
                { key: 'requires_translation', label: t('requires_translation') || 'تحتاج ترجمة', value: '46', color: 'bg-sky-50 border-sky-200 text-sky-900', icon: <Globe className="w-4 h-4 text-sky-600" /> },
              ].map((item) => (
                <div key={item.key} className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[11px] font-bold line-clamp-2 leading-tight">{item.label}</span>
                    {item.icon}
                  </div>
                  <div className="text-xl font-black">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Title Normalization & Safe Merge Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Title Normalization Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md w-fit border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('title_normalization_intelligence') || 'Title Normalization Intelligence'}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-2">
                  {dir === 'rtl' ? 'مثال تنظيف ومعالجة اسم المنحة' : 'Canonical Name Cleaning Example'}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {t('title_normalization_desc') || 'Scholarship degree level, funding coverage, urgency words, and marketing phrases are removed from the public-facing canonical title, but remain stored in structured fields.'}
                </p>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-0.5">
                      {t('original_title_example') || 'Original Raw Title'}:
                    </span>
                    <div className="p-2 bg-rose-50/60 border border-rose-200 rounded-lg text-slate-800 font-mono text-[11px]">
                      "Fully Funded Qatar University Bachelor Scholarship 2027"
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">
                      {t('cleaned_title_example') || 'Cleaned Canonical Title'}:
                    </span>
                    <div className="p-2 bg-emerald-50/60 border border-emerald-200 rounded-lg text-emerald-900 font-bold text-xs space-y-1">
                      <div>EN: "Qatar University Scholarship 2027"</div>
                      <div>AR: "منحة جامعة قطر 2027"</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                * Structured extraction preserves Degree Level (Bachelor) and Coverage (Fully Funded) as indexed filters.
              </div>
            </div>

            {/* Safe Merge Rules Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('safe_merge_rules_title') || 'Safe Merge & Deduplication Rules'}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-2">
                  {dir === 'rtl' ? 'ضوابط الدمج الآمن وحماية بيانات مسؤول النظام' : 'Safe Data Merge Principles'}
                </h3>
                
                <div className="space-y-2.5 text-xs text-slate-700 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                  <div className="font-bold text-emerald-900 text-xs mb-1">
                    {dir === 'rtl' ? 'عند اكتشاف منحة مكررة:' : 'When a duplicate scholarship is detected:'}
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('safe_merge_rule_1') || 'Do not create a new duplicate scholarship.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('safe_merge_rule_2') || 'Fill only missing empty fields (e.g. stipend, deadline).'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('safe_merge_rule_3') || 'Do not overwrite admin-reviewed fields silently.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('safe_merge_rule_4') || 'Conflicting values must be flagged as Needs Review.'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Phase 12 owns field validation & deduplication; Phase 23 displays control-plane status without auto-publishing.
              </div>
            </div>
          </div>
        </>
      )}

      {/* INTERNATIONAL TESTS IMPORT CARDS SECTION */}
      {domainKey === 'international-tests' && !activeWizard && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isRTL ? 'بطاقات تفاصيل الاستيراد والترحيل المباشر' : 'Import Cards & Direct Transfer Engine'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {isRTL ? 'بطاقات تفاصيل استيراد الاختبارات الدولية' : 'International Test Import Cards'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRTL ? 'تظهر هنا بطاقات الاستيراد المعالجة تلقائياً من الملفات أو النصوص المرفقة، مع حالة الترحيل لرابط الاختبار في لوحة التحكم.' : 'Processed import cards generated automatically from attached files or text specifications, synced directly with test administration.'}
              </p>
            </div>

            <button
              onClick={() => {
                setActiveWizard(true);
                setWizardStep(1);
                setTestImportFile(null);
                setTestImportText('');
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isRTL ? 'استيراد ملف اختبار جديد' : 'Import New Test File'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testImportCards.map((card) => (
              <div key={card.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>{isRTL ? 'تم الترحيل لإدارة الاختبارات' : 'Transferred to Tests Admin'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{card.importedAt}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">
                    {card.titleAr || card.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-700 mb-3">{card.providerName}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 font-mono">
                      <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{card.fileName}</span>
                      <span className="text-slate-400 text-[10px]">({card.fileSize})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">{isRTL ? 'سلم الدرجات' : 'Score Range'}</span>
                        <span className="font-extrabold text-slate-800 text-[11px]">{card.scoreRange}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">{isRTL ? 'مدة الصلاحية' : 'Validity'}</span>
                        <span className="font-extrabold text-slate-800 text-[11px]">{card.validity}</span>
                      </div>
                    </div>

                    {card.notes && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
                        <span className="font-bold block text-[10px] text-amber-800 mb-0.5">{isRTL ? 'ملاحظات وتلخيص الاستيراد:' : 'Import Notes:'}</span>
                        <p className="line-clamp-2">
                          {(card.notes.length > 120 || card.notes.includes('#') || card.notes.includes('**'))
                            ? 'تم استيراد ومعالجة ملف البيانات الشامل واستخراج الأقسام وسلالم الدرجات بنجاح والترحيل التلقائي لصفحة تفاصيل الاختبار.'
                            : card.notes}
                        </p>
                      </div>
                    )}

                    {card.sectionsList && card.sectionsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {card.sectionsList.map((sec: string) => (
                          <span key={sec} className="px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded-md text-[10px] font-bold">
                            {sec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <Link
                    to={`/admin/international-tests/${card.testId}`}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{isRTL ? 'فتح التفاصيل الكاملة في إدارة الاختبارات' : 'Open Details in Tests Admin'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      setTestImportCards(prev => prev.filter(c => c.id !== card.id));
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-bold p-1 transition-colors cursor-pointer"
                  >
                    {isRTL ? 'حذف البطاقة' : 'Delete Card'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If Import Wizard is Active, Render Wizard Stepper View */}
      {activeWizard ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md mb-12">
          {domainKey === 'international-tests' ? (
            wizardStep === 6 && executionResult ? (
              /* Execution Result View for International Tests */
              <div className="space-y-6 max-w-2xl mx-auto py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{isRTL ? 'تمت معالجة بيانات الاختبار بنجاح' : 'Test Data Ingested Successfully'}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">{isRTL ? `رقم الدفعة: ${executionResult.batchId}` : `Batch ID: ${executionResult.batchId}`}</p>
                </div>

                {executionResult.promotedTests && executionResult.promotedTests.length > 0 && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs text-right space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{isRTL ? 'تمت إضافة وترقية الاختبار بنجاح إلى لوحة التحكم' : 'Test Promoted Successfully to Admin Panel'}</span>
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      {executionResult.promotedTests.map((pt: any) => (
                        <Link
                          key={pt.testId}
                          to={`/admin/international-tests/${pt.testId}`}
                          className="p-2.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-bold hover:bg-emerald-100 flex items-center justify-between transition-colors"
                        >
                          <span>{isRTL ? `فتح اختبار ${pt.testName} في لوحة الاختبارات` : `Open ${pt.testName} in International Tests Panel`}</span>
                          <ExternalLink className="w-4 h-4 text-emerald-600" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
                  <Link
                    to="/admin/international-tests"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isRTL ? 'فتح لوحة الاختبارات الدولية' : 'Open International Tests Workspace'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setActiveWizard(false);
                      setExecutionResult(null);
                      setWizardStep(1);
                      setTestImportFile(null);
                      setTestImportText('');
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    {isRTL ? 'إغلاق واستيراد اختبار آخر' : 'Close / Import Another Test'}
                  </button>
                </div>
              </div>
            ) : (
              /* Simplified Direct Import Form for International Tests */
              <div className="space-y-6 max-w-2xl mx-auto py-2">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-blue-600" />
                      <span>{isRTL ? 'استيراد تفاصيل وبيانات الاختبار' : 'Import Test Data & Details'}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {isRTL ? 'أرفق الملف الذي يحتوي على بيانات وتفاصيل الاختبار، أو اكتب التفاصيل النصية في المربع أدناه' : 'Attach the file containing test details or type the text description in the box below'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveWizard(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>{isRTL ? 'إلغاء' : 'Cancel'}</span>
                  </button>
                </div>

                {/* 1. File Attachment Button */}
                <div className="space-y-2.5 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                  <label className="block text-xs font-bold text-slate-800">
                    {isRTL ? '1. إرفاق ملف بيانات وتفاصيل الاختبار:' : '1. Attach Test Data & Details File:'}
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2 shadow-xs">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span>{testImportFile ? (isRTL ? 'تغيير الملف المرفق' : 'Change Attached File') : (isRTL ? 'إرفاق ملف الاختبار' : 'Attach Test File')}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".md,.markdown,.json,.csv,.txt,.pdf,.doc,.docx,*/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const selectedFile = e.target.files[0];
                            setTestImportFile(selectedFile);
                            if (selectedFile.name.endsWith('.md') || selectedFile.name.endsWith('.markdown') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.json') || selectedFile.name.endsWith('.csv') || selectedFile.type.startsWith('text/')) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setTestImportText(event.target.result as string);
                                }
                              };
                              reader.readAsText(selectedFile);
                            }
                          }
                        }}
                      />
                    </label>

                    {testImportFile ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[220px]">{testImportFile.name}</span>
                        <span className="text-[10px] text-emerald-600 font-mono">({(testImportFile.size / 1024).toFixed(1)} KB)</span>
                        <button onClick={() => setTestImportFile(null)} className="text-slate-400 hover:text-slate-600 p-0.5 me-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">{isRTL ? 'لم يتم إرفاق ملف بعد (اختياري)' : 'No file attached yet (optional)'}</span>
                    )}
                  </div>
                </div>

                {/* 2. Text Details Box */}
                <div className="space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                  <label className="block text-xs font-bold text-slate-800">
                    {isRTL ? '2. بيانات وتفاصيل الاختبار النصية:' : '2. Test Details & Text Data:'}
                  </label>
                  <textarea
                    rows={6}
                    value={testImportText}
                    onChange={(e) => setTestImportText(e.target.value)}
                    placeholder={isRTL ? 'اكتب أو الصق تفاصيل بيانات الاختبار، مثل اسم الاختبار، الأقسام، مدة كل قسم، درجات المعايير، والتعليمات...' : 'Type or paste test details, sections, scoring bands, and descriptions here...'}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setActiveWizard(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    disabled={isExecuting || (!testImportFile && !testImportText.trim())}
                    onClick={handleRunBatchExecution}
                    className={`px-7 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
                      isExecuting || (!testImportFile && !testImportText.trim())
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>{isExecuting ? (isRTL ? 'جاري الاستيراد...' : 'Importing...') : (isRTL ? 'بدء الاستيراد' : 'Start Import')}</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
          {/* Wizard Header & Stepper Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <span>{isRTL ? 'معالج استيراد المجال' : 'Domain Import Wizard'}</span>
                <span className="text-xs font-medium text-slate-400">({domainTitle})</span>
              </h2>
            </div>
            <button
              onClick={() => setActiveWizard(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>{t('exit_wizard') || (isRTL ? 'خروج من المعالج' : 'Exit Wizard')}</span>
            </button>
          </div>

          {/* PREMIUM HORIZONTAL PIPELINE STEPPER */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-8">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{isRTL ? 'خط معالجة الاستيراد الفوري للمجال' : 'Domain Direct Ingestion Journey'}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {[
                { step: 1, title: isRTL ? 'تأكيد المصدر' : 'Source confirmation', icon: <Server className="w-3.5 h-3.5" /> },
                { step: 2, title: isRTL ? 'طريقة الإدخال' : 'Input method', icon: <FileText className="w-3.5 h-3.5" /> },
                { step: 3, title: isRTL ? 'حدود السجلات' : 'Batch limits', icon: <Sliders className="w-3.5 h-3.5" /> },
                { step: 4, title: isRTL ? 'القواعد الإدارية' : 'Admin rules', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { step: 5, title: isRTL ? 'مراجعة التشغيل' : 'Run review', icon: <Clock className="w-3.5 h-3.5" /> },
                { step: 6, title: isRTL ? 'تنفيذ الدفعة' : 'Execution result', icon: <Play className="w-3.5 h-3.5" /> },
                { step: 7, title: isRTL ? 'الترقية والمراجعة' : 'Human review / promotion', icon: <Award className="w-3.5 h-3.5" /> },
              ].map((s) => {
                let state: 'completed' | 'active' | 'pending' | 'needs-review' = 'pending';
                if (wizardStep === s.step) {
                  state = 'active';
                } else if (wizardStep > s.step) {
                  state = 'completed';
                } else if (wizardStep === 6 && s.step === 7) {
                  if (executionResult?.promotedCount && executionResult.promotedCount > 0) {
                    state = 'completed';
                  } else {
                    state = 'needs-review';
                  }
                }
                
                const stepColors = {
                  completed: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
                  active: 'bg-emerald-900/90 border-emerald-400 text-white shadow-md ring-1 ring-emerald-500/10',
                  'needs-review': 'bg-amber-950/40 border-amber-500/30 text-amber-300',
                  pending: 'bg-slate-900/50 border-slate-800/80 text-slate-500',
                };
                
                return (
                  <div key={s.step} className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${stepColors[state]}`}>
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      state === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                      state === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      state === 'needs-review' ? 'bg-amber-500/15 text-amber-300' :
                      'bg-slate-950 text-slate-600'
                    }`}>
                      {state === 'completed' ? <Check className="w-3 h-3 stroke-[3]" /> : s.icon}
                    </div>
                    
                    <div className="min-w-0">
                      <div className="text-[8px] font-mono tracking-wider opacity-60">
                        {isRTL ? `الخطوة 0${s.step}` : `Step 0${s.step}`}
                      </div>
                      <div className="font-bold text-[10px] leading-tight truncate mt-0.5">
                        {s.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Confirm Domain & Provider */}
          {wizardStep === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto py-4">
              <h3 className="font-bold text-slate-900 text-base">{isRTL ? 'الخطوة 1: تأكيد المجال ومصدر المزود' : 'Step 1: Confirm Domain & Provider Source'}</h3>
              <p className="text-xs text-slate-500">
                {isRTL ? 'التحقق من المجال المستهدف وموصل المصدر قبل تهيئة قواعد المعالجة.' : 'Verify the target domain and source connector before configuring processing rules.'}
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">{isRTL ? 'المجال المستهدف:' : 'Target Domain:'}</span>
                  <span className="font-bold text-slate-900">{domainTitle}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">{isRTL ? 'المزود المحدد:' : 'Selected Provider:'}</span>
                  <span className="font-bold text-blue-900">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">{isRTL ? 'الرابط الرسمي:' : 'Official URL:'}</span>
                  <span className="font-mono text-slate-700">{selectedProvider?.officialUrl}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{isRTL ? 'درجة الموثوقية:' : 'Trust Score:'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTrustBadge(selectedProvider?.trustScore || 90).color}`}>
                    {getTrustBadge(selectedProvider?.trustScore || 90).label}
                  </span>
                </div>
              </div>

              {domainKey === 'international-tests' && (
                selectedProvider?.officialUrl?.includes('official-test-centers') || selectedProvider?.name?.includes('Centers') ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{isRTL ? 'تنبيه: مصدر مراكز ومواعيد فقط (Test Centers & Dates Registry)' : 'Notice: Availability & Test Centers Registry Only'}</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {isRTL 
                        ? 'هذا المصدر مخصص لاستيراد مراكز الاختبار والمواعيد الشاغرة فقط. لاستيراد ملف مواصفات هيكل وسلالم درجات اختبار كامل (مثل IELTS Academic)، يرجى اختيار "IELTS Academic Official Test Specification & Profile Feed".'
                        : 'This source provides exam dates and test center locations only. To import full test structure, skill sections, and band scoring scales, select the IELTS Academic Official Test Specification & Profile Feed.'}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-purple-800">
                      <Award className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{isRTL ? 'مصدر مواصفات ومعايير اختبار دولي كامل (Full Test Specification & Scoring Profile)' : 'Full International Test Profile Source'}</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {isRTL 
                        ? 'مصدر معتمد لاستيراد ملف الاختبار الكامل: الأقسام الأربعة (الاستماع، القراءة، الكتابة، المحادثة)، مدة كل قسم، سلالم الدرجات (1.0 - 9.0)، ومكافآت الإطار الأوروبي CEFR.'
                        : 'Verified source for importing full test profiles: 4 skill sections (Listening, Reading, Writing, Speaking), section durations, band scales (1.0 - 9.0), and CEFR framework equivalencies.'}
                    </p>
                  </div>
                )
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{isRTL ? 'ضمان سلامة النقل' : 'Transfer Safety Guarantee'}</span>
                </p>
                <p>
                  {isRTL 
                    ? <>سيتم نقل السجلات الصالحة المستوردة إلى مساحة عمل المجال (<strong className="underline">{currentDomain.workspacePath}</strong>) بحالة <code>تحت المراجعة</code>. لن يتم نشر أي محتوى علناً حتى تتم الموافقة عليه صراحة من مسؤول المجال.</>
                    : <>Imported valid records will transfer to <strong className="underline">{currentDomain.workspacePath}</strong> in <code>Needs Review</code> state. No content will be published publicly until explicitly approved by a domain administrator.</>}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>{isRTL ? 'التالي: اختيار طريقة الإدخال' : 'Next: Choose Input Method'}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Input Method */}
          {wizardStep === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto py-4">
              <h3 className="font-bold text-slate-900 text-base">{isRTL ? 'الخطوة 2: اختيار طريقة إدخال البيانات' : 'Step 2: Choose Data Input Method'}</h3>
              <p className="text-xs text-slate-500">
                {isRTL ? 'حدد كيفية جلب ومعالجة البيانات لهذه الدفعة.' : 'Select how payload data should be ingested for this provider batch run.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'demo', label: isRTL ? 'مجموعة بيانات تجريبية' : 'Demo Dataset', desc: isRTL ? 'سجلات نموذجية مهيكلة للاختبار' : 'Sample structured records for testing', icon: <Sparkles className="w-4 h-4" /> },
                  { key: 'file', label: isRTL ? 'رفع ملف CSV / JSON' : 'CSV / JSON Upload', desc: isRTL ? 'رفع الملف مباشرة' : 'Upload file directly', icon: <FileSpreadsheet className="w-4 h-4" /> },
                  { key: 'paste', label: isRTL ? 'لصق البيانات' : 'Paste Data', desc: isRTL ? 'لصق نص CSV أو JSON المباشر' : 'Paste raw CSV or JSON text', icon: <FileText className="w-4 h-4" /> },
                  { key: 'url', label: isRTL ? 'استيراد رابط رسمي' : 'Official URL Import', desc: isRTL ? 'مرجع مصدر رسمي واحد' : 'Single official source reference', icon: <Link2 className="w-4 h-4" /> },
                  { key: 'connector', label: isRTL ? 'موصل مسجل' : 'Registered Connector', desc: isRTL ? 'جلب من خلاصة مسجلة' : 'Fetch from registered feed', icon: <Globe className="w-4 h-4" /> },
                ].map(m => (
                  <button
                    key={m.key}
                    onClick={() => setInputMethod(m.key as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      inputMethod === m.key
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                      {m.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{m.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {inputMethod === 'url' && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">{isRTL ? 'رابط المصدر الرسمي' : 'Official Source URL'}</label>
                  <input
                    type="url"
                    value={officialUrlInput}
                    onChange={(e) => setOfficialUrlInput(e.target.value)}
                    placeholder="https://official-source.gov.sa/feed"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      {isRTL 
                        ? 'تم تجهيز رابط المصدر للمراجعة؛ سيتم إضافة الاستخراج الآلي لاحقًا.' 
                        : 'URL extraction is staged for review; automated extraction will be added later.'}
                    </span>
                  </div>
                </div>
              )}

              {inputMethod === 'paste' && (
                <div className="pt-2">
                  <textarea
                    rows={4}
                    value={pastedPayload}
                    onChange={(e) => setPastedPayload(e.target.value)}
                    placeholder={isRTL ? 'الصق نص CSV أو JSON هنا...' : 'Paste CSV or JSON payload here...'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  {isRTL ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>{isRTL ? 'التالي: حدود معالجة السجلات' : 'Next: Record Processing Limits'}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Import Processing Limits */}
          {wizardStep === 3 && (
            <div className="space-y-4 max-w-2xl mx-auto py-4">
              <h3 className="font-bold text-slate-900 text-base">{isRTL ? 'الخطوة 3: تحديد حدود معالجة السجلات' : 'Step 3: Define Record Processing Limits'}</h3>
              <p className="text-xs text-slate-500">
                {isRTL ? 'تحديد الحد الأقصى لسجلات الدفعة للمعالجة الآمنة دون انقطاع الخادم.' : 'Set max record batch boundaries for safe processing without server timeouts.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: '10', label: isRTL ? '10 سجلات' : '10 Records', desc: isRTL ? 'تشغيل تجريبي سريع' : 'Fast trial run' },
                  { key: '50', label: isRTL ? '50 سجلاً' : '50 Records', desc: isRTL ? 'دفعة قياسية' : 'Standard batch' },
                  { key: '100', label: isRTL ? '100 سجل' : '100 Records', desc: isRTL ? 'دفعة كاملة' : 'Full batch' },
                  { key: 'custom', label: isRTL ? 'حد مخصص' : 'Custom Limit', desc: isRTL ? 'حجم مخصص محدد' : 'Small custom size' },
                ].map(l => (
                  <button
                    key={l.key}
                    onClick={() => setRecordLimit(l.key as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      recordLimit === l.key
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <div className="text-sm">{l.label}</div>
                    <div className={`text-[10px] mt-0.5 ${recordLimit === l.key ? 'text-blue-100' : 'text-slate-400'}`}>{l.desc}</div>
                  </button>
                ))}
              </div>

              {recordLimit === 'custom' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-slate-700">{isRTL ? 'أدخل الحد المخصص (1 - 200)' : 'Enter Custom Limit (1 - 200)'}</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={customRecordLimit}
                    onChange={(e) => setCustomRecordLimit(Math.min(200, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  {isRTL ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={() => setWizardStep(4)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>{isRTL ? 'التالي: القواعد والملاحظات الإدارية' : 'Next: Admin Rules & Notes'}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Admin Instructions / Notes to Import Engine */}
          {wizardStep === 4 && (
            <div className="space-y-4 max-w-2xl mx-auto py-4">
              <h3 className="font-bold text-slate-900 text-base">{isRTL ? 'الخطوة 4: تعليمات المسؤول لمحرك الاستيراد' : 'Step 4: Admin Instructions to Import Engine'}</h3>
              <p className="text-xs text-slate-500">
                {isRTL ? 'حدد القواعد التشغيلية لربط الحقول، وشدة التحقق، وتصنيف السجلات.' : 'Specify operational rules for field mapping, validation severity, and record classification.'}
              </p>

              <div className="space-y-2 text-xs">
                {getDomainRules(domainKey || 'scholarships', isRTL).map(rule => (
                  <label key={rule.key} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!(instructions as any)[rule.key]}
                      onChange={(e) => setInstructions({ ...instructions, [rule.key]: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">{rule.label}</div>
                      <div className="text-[11px] text-slate-500">{rule.desc}</div>
                    </div>
                  </label>
                ))}

                <div className="pt-2">
                  <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'ملاحظات وتوجيهات خاصة لمحرك الاستيراد' : 'Custom Engine Notes / Remarks'}</label>
                  <textarea
                    rows={3}
                    value={instructions.customNote}
                    onChange={(e) => setInstructions({ ...instructions, customNote: e.target.value })}
                    placeholder={isRTL ? 'أدخل أي تعليمات إضافية لعملية الاستيراد...' : 'Enter any additional instructions for the ingestion run...'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setWizardStep(3)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  {isRTL ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={() => setWizardStep(5)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>{isRTL ? 'التالي: مراجعة الملخص' : 'Next: Review Summary'}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review Summary Before Execution */}
          {wizardStep === 5 && (
            <div className="space-y-4 max-w-2xl mx-auto py-4">
              <h3 className="font-bold text-slate-900 text-base">{isRTL ? 'الخطوة 5: مراجعة إعدادات التشغيل' : 'Step 5: Review Run Configuration'}</h3>
              <p className="text-xs text-slate-500">
                {isRTL ? 'تأكيد خيارات دفعة الاستيراد قبل بدء التنفيذ.' : 'Confirm your import batch choices before triggering execution.'}
              </p>

              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 text-xs shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{isRTL ? 'مساحة عمل المجال المستهدف:' : 'Target Domain Workspace:'}</span>
                  <span className="font-bold text-blue-400">{domainTitle} ({currentDomain.workspacePath})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{isRTL ? 'مصدر المزود:' : 'Provider Source:'}</span>
                  <span className="font-bold text-white">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{isRTL ? 'طريقة الإدخال:' : 'Input Method:'}</span>
                  <span className="font-bold text-emerald-400 uppercase">{inputMethod}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{isRTL ? 'حد معالجة الدفعة:' : 'Batch Processing Limit:'}</span>
                  <span className="font-bold text-amber-400">
                    {recordLimit === 'custom' ? (isRTL ? `${customRecordLimit} سجلات` : `${customRecordLimit} Records`) : (isRTL ? `${recordLimit} سجلات` : `${recordLimit} Records`)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">{isRTL ? 'قواعد المسؤول النشطة:' : 'Active Admin Rules:'}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {getDomainRules(domainKey || 'scholarships', isRTL).map(rule => (
                      instructions[rule.key] ? (
                        <span key={rule.key} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-200 font-medium border border-slate-700">
                          {rule.label}
                        </span>
                      ) : null
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setWizardStep(4)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  {isRTL ? 'السابق' : 'Back'}
                </button>
                <button
                  disabled={isExecuting}
                  onClick={handleRunBatchExecution}
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isRTL ? 'تشغيل دفعة الاستيراد الآن' : 'Run Import Batch Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Run Import Batch & Results */}
          {wizardStep === 6 && executionResult && (
            <div className="space-y-6 max-w-2xl mx-auto py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{isRTL ? 'تمت معالجة دفعة الاستيراد بنجاح' : 'Import Batch Ingested to Staging'}</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">{isRTL ? `رقم الدفعة: ${executionResult.batchId}` : `Batch ID: ${executionResult.batchId}`}</p>
              </div>

              {/* Results Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="text-[10px] text-blue-700 uppercase font-bold">{isRTL ? 'مجهزة في جداول الاستيراد العامة' : 'Staged in Phase 06 Tables'}</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">{executionResult.staged || executionResult.total}</div>
                </div>
                <div className={`p-3 rounded-xl text-center border ${executionResult.promotedCount > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className={`text-[10px] uppercase font-bold ${executionResult.promotedCount > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>{isRTL ? 'سجلات مروّعة إلى المجال' : 'Promoted to Phase 09'}</div>
                  <div className={`text-2xl font-black mt-1 ${executionResult.promotedCount > 0 ? 'text-emerald-900' : 'text-amber-900'}`}>{executionResult.promotedCount || 0}</div>
                </div>
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
                  <div className="text-[10px] text-slate-700 uppercase font-bold">{isRTL ? 'حالة المعالجة' : 'Ingestion Status'}</div>
                  <div className="text-base font-bold text-slate-900 mt-2">
                    {executionResult.promotedCount > 0 ? (isRTL ? 'تمت الترقية' : 'PROMOTED') : (isRTL ? 'مجهزة' : 'Staged')}
                  </div>
                </div>
              </div>

              {/* Direct links to promoted tests if present */}
              {executionResult.promotedTests && executionResult.promotedTests.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs text-right space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{isRTL ? 'تمت ترقية الاختبارات بنجاح إلى لوحة التحكم' : 'Tests Promoted Successfully to Admin Panel'}</span>
                  </p>
                  <div className="flex flex-col gap-2 pt-1">
                    {executionResult.promotedTests.map((pt: any) => (
                      <Link
                        key={pt.testId}
                        to={`/admin/international-tests/${pt.testId}`}
                        className="p-2.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-bold hover:bg-emerald-100 flex items-center justify-between transition-colors"
                      >
                        <span>{isRTL ? `فتح اختبار ${pt.testName} في لوحة الاختبارات` : `Open ${pt.testName} in International Tests Panel`}</span>
                        <ExternalLink className="w-4 h-4 text-emerald-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Notice & Manual Promote Action if not promoted */}
              {(!executionResult.promotedCount || executionResult.promotedCount === 0) && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs text-right space-y-3">
                  <p className="font-bold flex items-center gap-1.5 text-amber-800">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>{isRTL ? 'إشعار جاهزية سجل الاستيراد للترقية' : 'Import Record Promotion Ready Notice'}</span>
                  </p>
                  <p className="leading-relaxed">
                    {isRTL 
                      ? <>تم تجهيز سجلات الاستيراد بنجاح. اضغط على الزر أدناه لترقية السجل مباشرة إلى لوحة الاختبارات الدولية.</>
                      : <>Import records successfully staged. Click below to promote the record into the International Tests admin panel.</>}
                  </p>
                  {executionResult.records && executionResult.records.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => handlePromoteRecord(executionResult.records[0].id)}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{isRTL ? 'ترقية السجلات إلى قسم الاختبارات' : 'Promote Records to Tests Workspace'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
                <Link
                  to={currentDomain.workspacePath}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isRTL ? 'فتح لوحة مجال الاختبارات الدولية' : 'Open International Tests Workspace'}</span>
                </Link>
                <button
                  onClick={() => setActiveWizard(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  {isRTL ? `العودة لمركز استيراد ${domainTitle}` : `Return to ${currentDomain.defaultName} Import Center`}
                </button>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      ) : null}



      {/* PER-BATCH IMPORT TRANSPARENCY & RECORD AUDIT TABLE */}
      {domainKey === 'scholarships' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>{t('batch_transparency_title') || (isRTL ? 'شفافية عمليات الاستيراد حسب الدفعة' : 'Per-Batch Import Transparency')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? 'مقاييس معالجة تفصيلية ومسارات تدقيق السجلات لكل دفعة استيراد.' : 'Detailed processing metrics and record-level ingestion audit trails for each scholarship import batch.'}
              </p>
            </div>
          </div>

          {/* Batch Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {SCHOLARSHIP_IMPORT_BATCHES.map((batch) => (
              <button
                key={batch.id}
                onClick={() => setSelectedBatchId(batch.id)}
                className={`p-4 rounded-xl border text-left text-xs transition-all ${
                  selectedBatchId === batch.id
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{batch.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    batch.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isRTL ? (batch.status === 'success' ? 'ناجحة' : 'نجاح جزئي') : (batch.status === 'success' ? 'Success' : 'Partial Success')}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm mb-1">{batch.batchName}</div>
                <div className="text-slate-500 text-[11px] mb-3">{batch.providerName}</div>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/80 text-[10px] text-center">
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="text-slate-400 block">{isRTL ? 'مقروء' : 'Read'}</span>
                    <span className="font-extrabold text-slate-800">{batch.totalRead}</span>
                  </div>
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="text-emerald-600 block">{isRTL ? 'مرحّل' : 'Transfer'}</span>
                    <span className="font-extrabold text-emerald-800">{batch.transferredCount}</span>
                  </div>
                  <div className="bg-white p-1 rounded border border-slate-200">
                    <span className="text-purple-600 block">{isRTL ? 'مكرر' : 'Dupl.'}</span>
                    <span className="font-extrabold text-purple-800">{batch.duplicateCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Batch Summary Header */}
          {activeBatch && (
            <div className="p-4 bg-slate-900 text-white rounded-xl mb-6 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div>
                  <span className="text-blue-400 font-mono font-bold">{activeBatch.id}</span>
                  <h3 className="text-base font-black text-white">{activeBatch.batchName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-md font-mono text-[11px]">
                    {isRTL ? `المصدر: ${activeBatch.sourceType} (مصدر مسجل)` : `Source: ${activeBatch.sourceType} (Registered Source)`}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-md font-mono text-[11px]">
                    {isRTL ? `الطريقة: ${activeBatch.inputMethod}` : `Method: ${activeBatch.inputMethod}`}
                  </span>
                </div>
              </div>

              {/* Batch Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-slate-400">{isRTL ? 'إجمالي المقروء' : 'Total Read'}</div>
                  <div className="font-black text-white">{activeBatch.totalRead}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-blue-300">{isRTL ? 'الأسماء المنظفة' : 'Normalized'}</div>
                  <div className="font-black text-blue-300">{activeBatch.normalizedNamesCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-purple-300">{isRTL ? 'المكررة' : 'Duplicates'}</div>
                  <div className="font-black text-purple-300">{activeBatch.duplicateCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-indigo-300">{isRTL ? 'الحقول المدمجة' : 'Merged Fields'}</div>
                  <div className="font-black text-indigo-300">{activeBatch.mergedFieldsCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-emerald-300">{isRTL ? 'الجديدة المُنكَرَة' : 'New Created'}</div>
                  <div className="font-black text-emerald-300">{activeBatch.newRecordsCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-amber-300">{isRTL ? 'غير مكتمل' : 'Incomplete'}</div>
                  <div className="font-black text-amber-300">{activeBatch.incompleteCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-rose-300">{isRTL ? 'الفاشلة' : 'Failed'}</div>
                  <div className="font-black text-rose-300">{activeBatch.failedCount}</div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-teal-300">{isRTL ? 'المرحّلة' : 'Transferred'}</div>
                  <div className="font-black text-teal-300">{activeBatch.transferredCount}</div>
                </div>
              </div>
            </div>
          )}

          {/* Per-Record Audit Table */}
          {activeBatch && (
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>{t('record_results_title') || (isRTL ? 'جدول تدقيق سجلات الاستيراد' : 'Per-Record Ingestion Audit Table')}</span>
              </h3>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="p-3">{t('original_scholarship_name') || (isRTL ? 'الاسم الأصلي' : 'Original Name')}</th>
                      <th className="p-3">{t('cleaned_scholarship_name') || (isRTL ? 'الاسم المنظف المعياري' : 'Cleaned Canonical Name')}</th>
                      <th className="p-3">{t('provider_sponsor') || (isRTL ? 'المزود / الراعي' : 'Provider / Sponsor')}</th>
                      <th className="p-3">{t('duplicate_status') || (isRTL ? 'حالة منع التكرار' : 'Deduplication Status')}</th>
                      <th className="p-3">{t('fields_merged') || (isRTL ? 'الحقول المدمجة' : 'Fields Merged')}</th>
                      <th className="p-3">{t('missing_fields') || (isRTL ? 'الحقول المفقودة' : 'Missing Fields')}</th>
                      <th className="p-3">{t('verification_status') || (isRTL ? 'حالة التحقق' : 'Verification Status')}</th>
                      <th className="p-3 text-right">{isRTL ? 'الإجراء' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeBatch.records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono text-[11px] text-slate-600 max-w-[200px] truncate" title={rec.originalName}>
                          {rec.originalName}
                        </td>
                        <td className="p-3 font-bold text-slate-900 max-w-[220px]">
                          <div>{rec.cleanedName}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{rec.cleanedNameAr}</div>
                        </td>
                        <td className="p-3 text-slate-700">
                          <div>{rec.provider}</div>
                          <a
                            href={rec.officialSourceUrl || rec.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>{isRTL ? 'المصدر الرسمي' : 'Official Source'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.duplicateStatus === 'new'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.duplicateStatus === 'existing_enriched'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {rec.duplicateStatus === 'new'
                              ? (t('new_record') || (isRTL ? 'سجل جديد' : 'New Record'))
                              : rec.duplicateStatus === 'existing_enriched'
                              ? (t('existing_enriched_badge') || (isRTL ? 'موجود ومستكمل' : 'Existing Enriched'))
                              : (t('duplicate') || (isRTL ? 'مكرر وتـم تخطيه' : 'Duplicate Skipped'))}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[10px]">
                          {rec.fieldsMerged.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {rec.fieldsMerged.map((f) => (
                                <span key={f} className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-indigo-700">
                                  +{f}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[10px]">
                          {rec.missingFields.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {rec.missingFields.map((f) => (
                                <span key={f} className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-amber-800">
                                  ? {f}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-emerald-600 font-bold">{isRTL ? 'مكتمل' : 'Complete'}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            rec.verificationStatus === 'verified_official'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {rec.verificationStatus === 'verified_official'
                              ? (t('verified_official') || (isRTL ? 'موثق رسمياً' : 'Verified Official'))
                              : (t('needs_source_verification') || (isRTL ? 'يحتاج تحقق من المصدر' : 'Needs Source Verification'))}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            to="/admin/scholarships"
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{t('open_in_scholarship_workspace') || (isRTL ? 'فتح في مساحة العمل' : 'Open in Workspace')}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
