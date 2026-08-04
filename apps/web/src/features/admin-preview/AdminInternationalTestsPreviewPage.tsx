import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import { Link, Navigate } from 'react-router-dom';
import { 
  PlusCircle, UploadCloud, AlertCircle, Loader2, Search, Filter, 
  ShieldCheck, FileCheck2, X, Globe, DollarSign, Clock
} from 'lucide-react';
import { ApiClient } from '../../api/client';

interface TestItem {
  id: string;
  displayName: string;
  nameAr?: string;
  nameEn?: string;
  provider?: string;
  providerName?: string;
  sourceImportRecordId?: string;
  createdAt?: string;
  category?: string; // Language, Admission, Professional, Aptitude
  minScoreRange?: string;
  validityDuration?: string;
  approxFee?: string;
  centersCount?: number;
  countriesCount?: number;
  status: string;
  completenessStatus?: string;
  verificationStatus?: string;
  updatedAt?: string;
}

interface AdminInternationalTestFilters {
  page: number;
  pageSize: number;
  status?: string;
}

interface PaginatedAdminInternationalTests {
  data?: TestItem[];
  total?: number;
}

const testGroups = [
  { key: '', labelAr: 'كل الأنواع', labelEn: 'All Types' },
  { key: 'language', labelAr: 'اختبارات اللغة', labelEn: 'Language' },
  { key: 'university_admission', labelAr: 'القبول الجامعي', labelEn: 'University Admission' },
  { key: 'specialized_admission', labelAr: 'القبول التخصصي', labelEn: 'Specialized Admission' },
  { key: 'professional_licensing', labelAr: 'الترخيص المهني', labelEn: 'Professional Licensing' },
  { key: 'other', labelAr: 'أخرى', labelEn: 'Other' }
];

function resolveTestGroup(test: TestItem): string {
  const text = `${test.id} ${test.displayName} ${test.nameEn ?? ''} ${test.category ?? ''}`.toLowerCase();
  if (/(cpa|plab|usmle|pmp|licensure|licensing|professional certification|professional \/ medical|professional \/ management)/.test(text)) {
    return 'professional_licensing';
  }
  if (/(dat|mcat|gamsat|ucat|imat|bmat|medical|dental|professional admission)/.test(text)) {
    return 'specialized_admission';
  }
  if (/(sat|act|gre|gmat|ap exams|csat|csca|cuet|eju|a-level|alevel|abitur|clt|admission|college credit|qualification)/.test(text)) {
    return 'university_admission';
  }
  if (/(ielts|toefl|duolingo|hsk|testdaf|jlpt|dele|delf|dalf|toeic|topik|language|english|french|spanish|chinese|japanese|german)/.test(text)) {
    return 'language';
  }
  return 'other';
}

function groupLabel(groupKey: string): string {
  return testGroups.find((group) => group.key === groupKey)?.labelAr ?? 'أخرى';
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    IMPORTED: 'مستورد',
    READY_TO_REVIEW: 'بانتظار المراجعة',
    READY_TO_PUBLISH: 'جاهز للنشر',
    PUBLISHED: 'منشور',
    ARCHIVED: 'مؤرشف'
  };
  return labels[status] ?? status;
}

export function AdminInternationalTestsPreviewPage() {
  const { t } = useTranslation();
  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';

  const [tests, setTests] = useState<TestItem[]>([]);
  const [allTests, setAllTests] = useState<TestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // 8 Status Counters as required
  const [counts, setCounts] = useState({
    all: 0,
    imported: 0,
    verifiedApproved: 0,
    missingData: 0,
    needsSourceVerification: 0,
    readyToPublish: 0,
    published: 0,
    archived: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: AdminInternationalTestFilters = { page, pageSize: 100 };
      if (statusFilter) filters.status = statusFilter;

      let res: PaginatedAdminInternationalTests = { data: [] };
      try {
        res = await ApiClient.getAdminInternationalTests(filters);
      } catch (fErr) {
        console.warn('Backend tests API unavailable, using fallback items:', fErr);
      }
      let items: TestItem[] = res?.data || [];

      // Fallback sample data if no tests returned from backend
      if (items.length === 0 && !statusFilter && !searchQuery) {
        items = [
          {
            id: 'test-ielts-academic',
            displayName: 'IELTS Academic',
            nameAr: 'اختبار آيلتس الأكاديمي',
            nameEn: 'IELTS Academic',
            provider: 'British Council / IDP / Cambridge Assessment',
            category: 'Language',
            minScoreRange: 'Band 9.0 - 0.0',
            validityDuration: '2 Years (24 Months)',
            approxFee: 'USD $265 - $215',
            centersCount: 1400,
            countriesCount: 140,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-toefl-ibt',
            displayName: 'TOEFL iBT',
            nameAr: 'اختبار التوفل عبر الإنترنت (TOEFL iBT)',
            nameEn: 'TOEFL iBT Test',
            provider: 'Educational Testing Service (ETS)',
            category: 'Language',
            minScoreRange: '1.0 – 6.0 Band Scale (0 – 120 Score)',
            validityDuration: '2 Years (24 Months)',
            approxFee: 'USD $245 - $190',
            centersCount: 1200,
            countriesCount: 160,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-duolingo-det',
            displayName: 'Duolingo English Test',
            nameAr: 'اختبار دولينجو للغة الإنجليزية (DET)',
            nameEn: 'Duolingo English Test',
            provider: 'Duolingo, Inc.',
            category: 'Language',
            minScoreRange: '10 – 160 Score Scale',
            validityDuration: '2 Years (24 Months)',
            approxFee: 'USD $70',
            centersCount: 0,
            countriesCount: 200,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-alevel-uk',
            displayName: 'A-Level (UK & International)',
            nameAr: 'المستوى المتقدم البريطاني والدولي (A-Level)',
            nameEn: 'Advanced Level Qualifications (A-Level)',
            provider: 'Cambridge / Pearson Edexcel / OxfordAQA',
            category: 'Admission / Qualification',
            minScoreRange: 'A* – E (Pass), U (Unclassified)',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'USD $200 - $600',
            centersCount: 2500,
            countriesCount: 160,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-abitur-de',
            displayName: 'Abitur (German Qualification)',
            nameAr: 'الثانوية العامة الألمانية (Abitur)',
            nameEn: 'German Allgemeine Hochschulreife (Abitur)',
            provider: 'وزارات التعليم الألمانية (KMK / IQB)',
            category: 'Admission / School Qualification',
            minScoreRange: '300 – 900 Punkte (المعدل 1.0 – 4.0)',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'Free / Nominally Low',
            centersCount: 3000,
            countriesCount: 80,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-act-us',
            displayName: 'ACT (Enhanced ACT)',
            nameAr: 'اختبار القبول الجامعي الأمريكي (ACT)',
            nameEn: 'ACT (American College Testing)',
            provider: 'ACT Education Corp.',
            category: 'Admission / Academic Readiness',
            minScoreRange: '1 – 36 Composite Score',
            validityDuration: '5 Years (5 سنوات)',
            approxFee: 'USD $70 - $100',
            centersCount: 2000,
            countriesCount: 130,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-celpebras-br',
            displayName: 'Celpe-Bras (Portuguese Test)',
            nameAr: 'اختبار اللغة البرتغالية البرازيلي (Celpe-Bras)',
            nameEn: 'Celpe-Bras (Brazilian Portuguese Proficiency)',
            provider: 'Inep / Ministério da Educação (البرازيل)',
            category: 'Language',
            minScoreRange: 'Intermediário – Avançado Superior',
            validityDuration: 'Institution Specified',
            approxFee: 'R$ 250 - 350',
            centersCount: 120,
            countriesCount: 45,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-cils-it',
            displayName: 'CILS (Italian Certification)',
            nameAr: 'شهادة الكفاءة في اللغة الإيطالية (CILS)',
            nameEn: 'CILS (Italian Language Certification)',
            provider: 'Università per Stranieri di Siena',
            category: 'Language',
            minScoreRange: 'A1 – C2 (55 - 100 Score)',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'EUR €40 - €160',
            centersCount: 350,
            countriesCount: 80,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-ap-us',
            displayName: 'AP Exams (Advanced Placement)',
            nameAr: 'اختبارات التقدم المتقدم الجامعية (AP)',
            nameEn: 'Advanced Placement (AP Exams)',
            provider: 'College Board',
            category: 'College Credit / Admission',
            minScoreRange: '1 – 5 Score Scale',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'USD $99 - $129',
            centersCount: 3500,
            countriesCount: 120,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-cambridge-uk',
            displayName: 'Cambridge English Qualifications',
            nameAr: 'مؤهلات كامبريدج للغة الإنجليزية (A2 - C2)',
            nameEn: 'Cambridge English Qualifications',
            provider: 'Cambridge University Press & Assessment',
            category: 'Language',
            minScoreRange: '100 – 230 Cambridge Scale',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'USD $150 - $280',
            centersCount: 2800,
            countriesCount: 130,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-clt-us',
            displayName: 'CLT (Classic Learning Test)',
            nameAr: 'اختبار التعلّم الكلاسيكي للقبول الجامعي (CLT)',
            nameEn: 'Classic Learning Test (CLT)',
            provider: 'Classic Learning Initiatives, LLC',
            category: 'Admission / Academic Aptitude',
            minScoreRange: '0 – 120 Score Scale',
            validityDuration: 'Lifetime (حسب الجامعة/المنحة)',
            approxFee: 'USD $112 (Home)',
            centersCount: 500,
            countriesCount: 50,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-cpa-us',
            displayName: 'U.S. CPA (Uniform CPA Exam)',
            nameAr: 'ترخيص وامتحان المحاسب القانوني المعتمد (U.S. CPA)',
            nameEn: 'Certified Public Accountant (Uniform CPA Examination)',
            provider: 'AICPA / NASBA / State Boards / Prometric',
            category: 'Professional / Licensure',
            minScoreRange: '0 – 99 Scale (Pass 75)',
            validityDuration: '30 Months (Exam Credit)',
            approxFee: 'USD $262+ / section + $390 intl',
            centersCount: 1000,
            countriesCount: 20,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-csca-cn',
            displayName: 'CSCA (China Scholastic Competency Assessment)',
            nameAr: 'اختبار الكفاءة الأكاديمية للقبول الجامعي في الصين (CSCA)',
            nameEn: 'China Scholastic Competency Assessment (CSCA)',
            provider: 'China Scholarship Council (CSC)',
            category: 'Country-Specific Admission',
            minScoreRange: '0 – 100 Per Subject (5 Subjects)',
            validityDuration: 'Admission Cycle / Academic Year',
            approxFee: '450 CNY (1 Subject) / 700 CNY (2+)',
            centersCount: 100,
            countriesCount: 30,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-cuet-in',
            displayName: 'CUET (Common University Entrance Test)',
            nameAr: 'اختبار القبول الجامعي المشترك في الهند (CUET)',
            nameEn: 'Common University Entrance Test (CUET)',
            provider: 'National Testing Agency (NTA)',
            category: 'Country-Specific Admission',
            minScoreRange: '0 – 250 Per Paper (+5/-1)',
            validityDuration: '1 Academic Year (2026–2027)',
            approxFee: '₹1,000 (Local) / ₹4,500 (Intl)',
            centersCount: 321,
            countriesCount: 13,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-csat-kr',
            displayName: 'CSAT / Suneung (College Scholastic Ability Test)',
            nameAr: 'اختبار القدرة الدراسية الجامعية - سونونغ (CSAT / Suneung)',
            nameEn: 'College Scholastic Ability Test (CSAT / Suneung)',
            provider: 'Korea Institute for Curriculum and Evaluation (KICE)',
            category: 'Country-Specific Admission',
            validityDuration: '2027 Academic Year Cycle',
            approxFee: '37,000 – 47,000 KRW',
            centersCount: 1200,
            countriesCount: 1,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-dele-es',
            displayName: 'DELE (Spanish Language Diploma)',
            nameAr: 'دبلومات اللغة الإسبانية الرسمية (DELE)',
            nameEn: 'Diplomas de Español como Lengua Extranjera (DELE)',
            provider: 'Instituto Cervantes',
            category: 'Language',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'EUR €112 - €240',
            centersCount: 1000,
            countriesCount: 100,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-delf-dalf-fr',
            displayName: 'DELF / DALF (French Language Diplomas)',
            nameAr: 'دبلومات اللغة الفرنسية الرسمية (DELF / DALF)',
            nameEn: 'DELF / DALF French Language Diplomas',
            provider: 'France Éducation international (FEI)',
            category: 'Language',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'Varies by Country',
            centersCount: 1200,
            countriesCount: 170,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-dat-us',
            displayName: 'DAT (US Dental Admission Test)',
            nameAr: 'اختبار القبول في كليات طب الأسنان الأمريكي (DAT)',
            nameEn: 'Dental Admission Test (DAT)',
            provider: 'American Dental Association (ADA)',
            category: 'Admission / Professional',
            validityDuration: 'Lifetime (ADA) / 2-3 Years (Schools)',
            approxFee: 'USD $580',
            centersCount: 500,
            countriesCount: 2,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-gamsat-uk-au',
            displayName: 'GAMSAT (Graduate Medical School Admissions Test)',
            nameAr: 'اختبار القبول لكليات الطب للدراسات العليا (GAMSAT)',
            nameEn: 'Graduate Medical School Admissions Test (GAMSAT)',
            provider: 'Australian Council for Educational Research (ACER)',
            category: 'Admission / Professional',
            validityDuration: '2-4 Years (حسب الدولة)',
            approxFee: 'AUD $568 / EUR €378 / GBP £296',
            centersCount: 50,
            countriesCount: 5,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-gmat-focus',
            displayName: 'GMAT Exam (Focus Edition)',
            nameAr: 'اختبار القبول للدراسات العليا وإدارة الأعمال (GMAT)',
            nameEn: 'Graduate Management Admission Test (GMAT)',
            provider: 'Graduate Management Admission Council (GMAC)',
            category: 'Admission / Professional',
            validityDuration: '5 Years (5 سنوات)',
            approxFee: 'USD $275 - $300',
            centersCount: 1000,
            countriesCount: 110,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-gre-shorter',
            displayName: 'GRE General Test (Shorter Version)',
            nameAr: 'اختبار القبول للدراسات العليا (GRE)',
            nameEn: 'GRE General Test (Shorter Version)',
            provider: 'Educational Testing Service (ETS)',
            category: 'Admission / Academic',
            validityDuration: '5 Years (5 سنوات)',
            approxFee: 'USD $220',
            centersCount: 1000,
            countriesCount: 160,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-hsk-chinese',
            displayName: 'HSK (Hanyu Shuiping Kaoshi)',
            nameAr: 'اختبار كفاءة اللغة الصينية (HSK)',
            nameEn: 'Hanyu Shuiping Kaoshi (HSK)',
            provider: 'Center for Language Education and Cooperation (CLEC)',
            category: 'Language',
            validityDuration: 'Lifetime / 2 Years (for Admission)',
            approxFee: 'USD $20 - $180',
            centersCount: 1500,
            countriesCount: 140,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-eju-japanese',
            displayName: 'EJU (Japanese University Admission for International Students)',
            nameAr: 'اختبار القبول الجامعي الياباني للطلاب الدوليين (EJU)',
            nameEn: 'Examination for Japanese University Admission for International Students (EJU)',
            provider: 'Japan Student Services Organization (JASSO)',
            category: 'Admission / Academic',
            validityDuration: '2 Years (24 Months)',
            approxFee: '50 - 110 USD',
            centersCount: 300,
            countriesCount: 15,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-itep-academic',
            displayName: 'iTEP Academic',
            nameAr: 'اختبار iTEP الأكاديمي للغة الإنجليزية',
            nameEn: 'iTEP Academic English Proficiency',
            provider: 'Boston Educational Services (BES)',
            category: 'Language',
            minScoreRange: '0.0 – 6.0 Level Scale',
            validityDuration: '2 Years (24 Months)',
            approxFee: 'USD $129 - $179',
            centersCount: 400,
            countriesCount: 60,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-jlpt-exam',
            displayName: 'JLPT (Japanese Language Proficiency Test)',
            nameAr: 'اختبار كفاءة اللغة اليابانية (JLPT)',
            nameEn: 'Japanese Language Proficiency Test',
            provider: 'Japan Foundation & JEES',
            category: 'Language',
            minScoreRange: 'N5 to N1 Scale',
            validityDuration: 'Lifetime (دائم)',
            approxFee: 'USD $50 - $100',
            centersCount: 800,
            countriesCount: 85,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-languagecert-academic',
            displayName: 'LANGUAGECERT Academic',
            nameAr: 'اختبار لانجويج سيرت الأكاديمي (LANGUAGECERT Academic)',
            nameEn: 'LANGUAGECERT Academic English',
            provider: 'PeopleCert / LANGUAGECERT',
            category: 'Language',
            minScoreRange: 'High Pass / Pass / CEFR A1-C2',
            validityDuration: 'Lifetime / Institution Specific',
            approxFee: 'USD $150 - $230',
            centersCount: 600,
            countriesCount: 90,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-linguaskill-cambridge',
            displayName: 'Linguaskill (by Cambridge)',
            nameAr: 'اختبار لينجواسكيل من كامبريدج (Linguaskill)',
            nameEn: 'Linguaskill (Cambridge Assessment English)',
            provider: 'Cambridge University Press & Assessment',
            category: 'Language',
            minScoreRange: 'CEFR Pre-A1 to C1+',
            validityDuration: 'Institution Specified (2 Years)',
            approxFee: 'Varies by Authorized Center',
            centersCount: 900,
            countriesCount: 110,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-imat-italy',
            displayName: 'IMAT (International Medical Admissions Test)',
            nameAr: 'اختبار القبول لكليات الطب الإيطالية (IMAT)',
            nameEn: 'International Medical Admissions Test (IMAT)',
            provider: 'Cambridge Assessment Admissions Testing / MUR Italy',
            category: 'Admission / Medical',
            minScoreRange: '0 – 90 Score Scale',
            validityDuration: '1 Academic Year (سنوي)',
            approxFee: 'EUR €130',
            centersCount: 40,
            countriesCount: 20,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-met-michigan',
            displayName: 'Michigan English Test (MET)',
            nameAr: 'اختبار ميشيغان للغة الإنجليزية (MET)',
            nameEn: 'Michigan English Test (MET)',
            provider: 'Michigan Language Assessment',
            category: 'Language / Academic & Professional',
            minScoreRange: '0 – 80 Scale Score',
            validityDuration: 'Lifetime',
            approxFee: 'Varies by Center',
            centersCount: 300,
            countriesCount: 45,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-staatsexamen-nt2',
            displayName: 'Staatsexamen Nt2 (Dutch State Exam)',
            nameAr: 'الامتحان الحكومي للهولندية كلغة ثانية (Staatsexamen Nt2)',
            nameEn: 'Staatsexamen Nederlands als tweede taal',
            provider: 'CvTE & DUO (هولندا)',
            category: 'Language / Government Certification',
            minScoreRange: 'B1 / B2 Threshold',
            validityDuration: 'Lifetime',
            approxFee: 'EUR €50-200',
            centersCount: 50,
            countriesCount: 2,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-oxford-ote',
            displayName: 'Oxford Test of English (OTE)',
            nameAr: 'اختبار أكسفورد للغة الإنجليزية (Oxford Test of English)',
            nameEn: 'Oxford Test of English (OTE)',
            provider: 'Oxford University Press',
            category: 'Language / Academic & General',
            minScoreRange: '0 – 140 (OTE)',
            validityDuration: 'Lifetime',
            approxFee: 'Varies by Center',
            centersCount: 400,
            countriesCount: 50,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-matura-europe',
            displayName: 'Matura (Secondary School & University Admission)',
            nameAr: 'عائلة شهادات وامتحانات الثانوية والقبول الجامعي (Matura)',
            nameEn: 'Matura / Maturità (European Family)',
            provider: 'National Ministries of Education',
            category: 'Admission / Secondary Qualification',
            minScoreRange: 'National Scale',
            validityDuration: 'Lifetime',
            approxFee: 'Varies',
            centersCount: 1500,
            countriesCount: 15,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-mcat-aamc',
            displayName: 'MCAT (Medical College Admission Test)',
            nameAr: 'اختبار القبول في كليات الطب (MCAT)',
            nameEn: 'Medical College Admission Test (MCAT)',
            provider: 'AAMC',
            category: 'Admission / Medical Schools',
            minScoreRange: '472 – 528',
            validityDuration: '2-3 Years',
            approxFee: 'USD $355',
            centersCount: 600,
            countriesCount: 25,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-plab',
            displayName: 'PLAB (Professional and Linguistic Assessments Board)',
            nameAr: 'اختبار تقييم المهنيين واللغويات (PLAB)',
            nameEn: 'Professional and Linguistic Assessments Board',
            provider: 'GMC',
            category: 'Professional / Medical',
            minScoreRange: 'Pass/Fail',
            validityDuration: '2-3 Years',
            approxFee: '£255 - £934',
            centersCount: 50,
            countriesCount: 15,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-pmp',
            displayName: 'PMP (Project Management Professional)',
            nameAr: 'شهادة محترف إدارة المشاريع (PMP)',
            nameEn: 'Project Management Professional',
            provider: 'PMI',
            category: 'Professional / Management',
            minScoreRange: 'Pass/Fail',
            validityDuration: '3 Years',
            approxFee: 'USD $405 - $575',
            centersCount: 500,
            countriesCount: 100,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-polish-state',
            displayName: 'Polish State Certificate Exam (Certyfikat Polski)',
            nameAr: 'امتحان شهادة الدولة في اللغة البولندية',
            nameEn: 'State Certificate Examinations in Polish as a Foreign Language',
            provider: 'State Commission (Poland)',
            category: 'Language / Government Certification',
            minScoreRange: 'B1 - C2',
            validityDuration: 'Lifetime',
            approxFee: 'EUR €90 - €180',
            centersCount: 30,
            countriesCount: 5,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-pte',
            displayName: 'PTE Academic (Pearson Test of English)',
            nameAr: 'اختبار بيرسون الأكاديمي للغة الإنجليزية',
            nameEn: 'Pearson Test of English Academic',
            provider: 'Pearson',
            category: 'Language / Academic & General',
            minScoreRange: '10 - 90',
            validityDuration: '2 Years',
            approxFee: 'Varies by Country',
            centersCount: 400,
            countriesCount: 115,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-sat',
            displayName: 'SAT (Scholastic Assessment Test)',
            nameAr: 'اختبار القبول الجامعي (SAT)',
            nameEn: 'Scholastic Assessment Test',
            provider: 'College Board',
            category: 'Admission / Undergraduate',
            minScoreRange: '400 - 1600',
            validityDuration: 'Varies',
            approxFee: 'USD $111+',
            centersCount: 500,
            countriesCount: 100,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-testdaf',
            displayName: 'TestDaF (Test Deutsch als Fremdsprache)',
            nameAr: 'اختبار الألمانية كلغة أجنبية (TestDaF)',
            nameEn: 'Test Deutsch als Fremdsprache',
            provider: 'g.a.s.t.',
            category: 'Language / Academic',
            minScoreRange: 'TDN 3 - 5',
            validityDuration: 'Lifetime',
            approxFee: 'EUR €210',
            centersCount: 550,
            countriesCount: 100,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-tomer',
            displayName: 'TÖMER (Turkish Proficiency Test)',
            nameAr: 'اختبار كفاءة اللغة التركية (TÖMER)',
            nameEn: 'TÖMER Turkish Proficiency Test',
            provider: 'Ankara University',
            category: 'Language / Academic',
            minScoreRange: 'A1 - C2',
            validityDuration: '2 Years (Admission)',
            approxFee: 'EUR €100 - €200',
            centersCount: 50,
            countriesCount: 15,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-topik',
            displayName: 'TOPIK (Test of Proficiency in Korean)',
            nameAr: 'اختبار الكفاءة في اللغة الكورية (TOPIK)',
            nameEn: 'Test of Proficiency in Korean',
            provider: 'NIIED',
            category: 'Language / Academic',
            minScoreRange: 'Level 1 - Level 6',
            validityDuration: '2 Years',
            approxFee: 'KRW 40k-55k / USD $30-$50',
            centersCount: 300,
            countriesCount: 80,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-toeic',
            displayName: 'TOEIC (Test of English for International Communication)',
            nameAr: 'اختبار اللغة الإنجليزية للتواصل الدولي (TOEIC)',
            nameEn: 'Test of English for International Communication',
            provider: 'ETS',
            category: 'Language / Professional',
            minScoreRange: '10 - 990 (L&R)',
            validityDuration: '2 Years',
            approxFee: 'USD $85 - $150',
            centersCount: 1000,
            countriesCount: 160,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-ukbi',
            displayName: 'UKBI (Indonesian Language Proficiency Test)',
            nameAr: 'اختبار الكفاءة في اللغة الإندونيسية (UKBI)',
            nameEn: 'Indonesian Language Proficiency Test (UKBI)',
            provider: 'Kemendikdasmen',
            category: 'Language',
            minScoreRange: '251 - 800',
            validityDuration: '2 Years',
            approxFee: 'IDR 300,000',
            centersCount: 0,
            countriesCount: 0,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-usmle',
            displayName: 'USMLE (United States Medical Licensing Examination)',
            nameAr: 'امتحان الترخيص الطبي الأمريكي (USMLE)',
            nameEn: 'United States Medical Licensing Examination (USMLE)',
            provider: 'FSMB & NBME',
            category: 'Professional / Medical',
            minScoreRange: 'Pass / Fail / Numeric',
            validityDuration: 'Varies by State',
            approxFee: 'USD $695+',
            centersCount: 500,
            countriesCount: 80,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-yks',
            displayName: 'YKS (Higher Education Institutions Examination)',
            nameAr: 'اختبار مؤسسات التعليم العالي التركية (YKS)',
            nameEn: 'YKS (Higher Education Institutions Exam)',
            provider: 'ÖSYM',
            category: 'Admission / Undergraduate',
            minScoreRange: 'Varies',
            validityDuration: '1 Year',
            approxFee: 'Varies',
            centersCount: 2000,
            countriesCount: 1,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-torfl',
            displayName: 'TORFL / TRKI (Test of Russian as a Foreign Language)',
            nameAr: 'اختبار الكفاءة في اللغة الروسية (TORFL)',
            nameEn: 'Test of Russian as a Foreign Language (TORFL)',
            provider: 'Russian Ministry of Education',
            category: 'Language',
            minScoreRange: 'A1 - C2',
            validityDuration: 'Lifetime (B1+)',
            approxFee: 'USD $80 - $150',
            centersCount: 150,
            countriesCount: 40,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-ucat',
            displayName: 'UCAT (University Clinical Aptitude Test)',
            nameAr: 'اختبار الكفاءة السريرية الجامعية (UCAT)',
            nameEn: 'University Clinical Aptitude Test',
            provider: 'UCAT Consortium',
            category: 'Admission / Medical',
            minScoreRange: '1200 - 3600',
            validityDuration: '1 Year',
            approxFee: 'GBP £115 - £130',
            centersCount: 300,
            countriesCount: 60,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-yos',
            displayName: 'YÖS / TR-YÖS (Turkish Universities Student Admission)',
            nameAr: 'اختبار الطلاب الأجانب في تركيا (YÖS)',
            nameEn: 'Turkish Universities Student Admission Exam (TR-YÖS)',
            provider: 'ÖSYM',
            category: 'Admission / Undergraduate',
            minScoreRange: '0 - 500',
            validityDuration: '2 Years',
            approxFee: 'USD $40 - $80',
            centersCount: 200,
            countriesCount: 50,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          },
          {
            id: 'test-bmat',
            displayName: 'BMAT (BioMedical Admissions Test)',
            nameAr: 'اختبار القبول في الطب الحيوي (BMAT)',
            nameEn: 'BioMedical Admissions Test (BMAT)',
            provider: 'CAAT',
            category: 'Admission / Medical',
            minScoreRange: '1.0 - 9.0',
            validityDuration: '1 Year',
            approxFee: 'GBP £70 - £150',
            centersCount: 150,
            countriesCount: 40,
            status: 'PUBLISHED',
            verificationStatus: 'verified',
            completenessStatus: 'complete',
          }
        ];
      }

      // Merge imported test cards from localStorage
      try {
        const savedCardsStr = localStorage.getItem('manaratak_test_import_cards');
        if (savedCardsStr) {
          const savedCards = JSON.parse(savedCardsStr);
          for (const card of savedCards) {
            const cardTitleLower = ((card.title || '') + ' ' + (card.titleAr || '') + ' ' + (card.testId || '')).toLowerCase();
            const isToefl = cardTitleLower.includes('toefl') || cardTitleLower.includes('توفل');
            const isIelts = cardTitleLower.includes('ielts') || cardTitleLower.includes('آيلتس');
            const isDuolingo = cardTitleLower.includes('duolingo') || cardTitleLower.includes('دولينجو') || cardTitleLower.includes('det');
            const isAlevel = cardTitleLower.includes('alevel') || cardTitleLower.includes('a-level') || cardTitleLower.includes('المستوى المتقدم');
            const isAbitur = cardTitleLower.includes('abitur') || cardTitleLower.includes('ألمانية') || cardTitleLower.includes('allgemeine hochschulreife');
            const isAct = cardTitleLower.includes('act') || cardTitleLower.includes('american college testing');
            const isCelpebras = cardTitleLower.includes('celpe') || cardTitleLower.includes('برتغالية') || cardTitleLower.includes('portuguese');
            const isCils = cardTitleLower.includes('cils') || cardTitleLower.includes('إيطالية') || cardTitleLower.includes('italian');
            const isAp = cardTitleLower.includes('ap') || cardTitleLower.includes('advanced placement') || cardTitleLower.includes('متقدم');
            const isCambridge = cardTitleLower.includes('cambridge') || cardTitleLower.includes('كامبريدج') || cardTitleLower.includes('c1 advanced');
            const isTomer = cardTitleLower.includes('tömer') || cardTitleLower.includes('tomer') || cardTitleLower.includes('تومر');
            const isTopik = cardTitleLower.includes('topik') || cardTitleLower.includes('توبيك');
            const isToeic = cardTitleLower.includes('toeic') || cardTitleLower.includes('تويك');

            if (isTomer) {
              const existingIndex = items.findIndex(i => i.id === 'test-tomer' || i.displayName.toLowerCase().includes('tömer') || i.displayName.toLowerCase().includes('tomer'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-tomer',
                  displayName: card.title || card.titleAr || 'TÖMER (Turkish Proficiency Test)',
                  nameAr: card.titleAr || card.title || 'اختبار كفاءة اللغة التركية (TÖMER)',
                  nameEn: card.title || card.titleAr || 'TÖMER Turkish Proficiency Test',
                  provider: card.providerName || 'Ankara University',
                  category: 'Language / Academic',
                  minScoreRange: card.scoreRange || 'A1 - C2',
                  validityDuration: card.validity || '2 Years',
                  approxFee: 'EUR €100 - €200',
                  centersCount: 50,
                  countriesCount: 15,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isTopik) {
              const existingIndex = items.findIndex(i => i.id === 'test-topik' || i.displayName.toLowerCase().includes('topik'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-topik',
                  displayName: card.title || card.titleAr || 'TOPIK (Test of Proficiency in Korean)',
                  nameAr: card.titleAr || card.title || 'اختبار الكفاءة في اللغة الكورية (TOPIK)',
                  nameEn: card.title || card.titleAr || 'Test of Proficiency in Korean',
                  provider: card.providerName || 'NIIED',
                  category: 'Language / Academic',
                  minScoreRange: card.scoreRange || 'Level 1 - Level 6',
                  validityDuration: card.validity || '2 Years',
                  approxFee: 'KRW 40k-55k / USD $30-$50',
                  centersCount: 300,
                  countriesCount: 80,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isToeic) {
              const existingIndex = items.findIndex(i => i.id === 'test-toeic' || i.displayName.toLowerCase().includes('toeic'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-toeic',
                  displayName: card.title || card.titleAr || 'TOEIC (Test of English for International Communication)',
                  nameAr: card.titleAr || card.title || 'اختبار اللغة الإنجليزية للتواصل الدولي (TOEIC)',
                  nameEn: card.title || card.titleAr || 'Test of English for International Communication',
                  provider: card.providerName || 'ETS',
                  category: 'Language / Professional',
                  minScoreRange: card.scoreRange || '10 - 990 (L&R)',
                  validityDuration: card.validity || '2 Years',
                  approxFee: 'USD $85 - $150',
                  centersCount: 1000,
                  countriesCount: 160,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isCelpebras) {
              const existingIndex = items.findIndex(i => i.id === 'test-celpebras-br' || i.displayName.toLowerCase().includes('celpe'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-celpebras-br',
                  displayName: card.title || card.titleAr || 'Celpe-Bras (Portuguese Test)',
                  nameAr: card.titleAr || card.title || 'اختبار اللغة البرتغالية البرازيلي (Celpe-Bras)',
                  nameEn: card.title || card.titleAr || 'Celpe-Bras (Brazilian Portuguese Proficiency)',
                  provider: card.providerName || 'Inep / Ministério da Educação (البرازيل)',
                  category: 'Language',
                  minScoreRange: card.scoreRange || 'Intermediário – Avançado Superior',
                  validityDuration: card.validity || 'Institution Specified',
                  approxFee: 'R$ 250 - 350',
                  centersCount: 120,
                  countriesCount: 45,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isCils) {
              const existingIndex = items.findIndex(i => i.id === 'test-cils-it' || i.displayName.toLowerCase().includes('cils'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-cils-it',
                  displayName: card.title || card.titleAr || 'CILS (Italian Certification)',
                  nameAr: card.titleAr || card.title || 'شهادة الكفاءة في اللغة الإيطالية (CILS)',
                  nameEn: card.title || card.titleAr || 'CILS (Italian Language Certification)',
                  provider: card.providerName || 'Università per Stranieri di Siena',
                  category: 'Language',
                  minScoreRange: card.scoreRange || 'A1 – C2 (55 - 100 Score)',
                  validityDuration: card.validity || 'Lifetime (دائم)',
                  approxFee: 'EUR €40 - €160',
                  centersCount: 350,
                  countriesCount: 80,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isAp) {
              const existingIndex = items.findIndex(i => i.id === 'test-ap-us' || i.displayName.toLowerCase().includes('ap'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-ap-us',
                  displayName: card.title || card.titleAr || 'AP Exams (Advanced Placement)',
                  nameAr: card.titleAr || card.title || 'اختبارات التقدم المتقدم الجامعية (AP)',
                  nameEn: card.title || card.titleAr || 'Advanced Placement (AP Exams)',
                  provider: card.providerName || 'College Board',
                  category: 'College Credit / Admission',
                  minScoreRange: card.scoreRange || '1 – 5 Score Scale',
                  validityDuration: card.validity || 'Lifetime (دائم)',
                  approxFee: 'USD $99 - $129',
                  centersCount: 3500,
                  countriesCount: 120,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isCambridge) {
              const existingIndex = items.findIndex(i => i.id === 'test-cambridge-uk' || i.displayName.toLowerCase().includes('cambridge'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-cambridge-uk',
                  displayName: card.title || card.titleAr || 'Cambridge English Qualifications',
                  nameAr: card.titleAr || card.title || 'مؤهلات كامبريدج للغة الإنجليزية (A2 - C2)',
                  nameEn: card.title || card.titleAr || 'Cambridge English Qualifications',
                  provider: card.providerName || 'Cambridge University Press & Assessment',
                  category: 'Language',
                  minScoreRange: card.scoreRange || '100 – 230 Cambridge Scale',
                  validityDuration: card.validity || 'Lifetime (دائم)',
                  approxFee: 'USD $150 - $280',
                  centersCount: 2800,
                  countriesCount: 130,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isAbitur) {
              const existingIndex = items.findIndex(i => i.id === 'test-abitur-de' || i.displayName.toLowerCase().includes('abitur'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-abitur-de',
                  displayName: card.title || card.titleAr || 'Abitur (German Qualification)',
                  nameAr: card.titleAr || card.title || 'الثانوية العامة الألمانية (Abitur)',
                  nameEn: card.title || card.titleAr || 'German Allgemeine Hochschulreife (Abitur)',
                  provider: card.providerName || 'وزارات التعليم الألمانية (KMK / IQB)',
                  category: 'Admission / School Qualification',
                  minScoreRange: card.scoreRange || '300 – 900 Punkte (المعدل 1.0 – 4.0)',
                  validityDuration: card.validity || 'Lifetime (دائم)',
                  approxFee: 'Free / Nominally Low',
                  centersCount: 3000,
                  countriesCount: 80,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isAct) {
              const existingIndex = items.findIndex(i => i.id === 'test-act-us' || i.displayName.toLowerCase().includes('act'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-act-us',
                  displayName: card.title || card.titleAr || 'ACT (Enhanced ACT)',
                  nameAr: card.titleAr || card.title || 'اختبار القبول الجامعي الأمريكي (ACT)',
                  nameEn: card.title || card.titleAr || 'ACT (American College Testing)',
                  provider: card.providerName || 'ACT Education Corp.',
                  category: 'Admission / Academic Readiness',
                  minScoreRange: card.scoreRange || '1 – 36 Composite Score',
                  validityDuration: card.validity || '5 Years (5 سنوات)',
                  approxFee: 'USD $70 - $100',
                  centersCount: 2000,
                  countriesCount: 130,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isAlevel) {
              const existingIndex = items.findIndex(i => i.id === 'test-alevel-uk' || i.displayName.toLowerCase().includes('alevel') || i.displayName.toLowerCase().includes('a-level'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-alevel-uk',
                  displayName: card.title || card.titleAr || 'A-Level (UK & International)',
                  nameAr: card.titleAr || card.title || 'المستوى المتقدم البريطاني والدولي (A-Level)',
                  nameEn: card.title || card.titleAr || 'Advanced Level Qualifications (A-Level)',
                  provider: card.providerName || 'Cambridge / Pearson Edexcel / OxfordAQA',
                  category: 'Admission / Qualification',
                  minScoreRange: card.scoreRange || 'A* – E (Pass), U (Unclassified)',
                  validityDuration: card.validity || 'Lifetime (دائم)',
                  approxFee: 'USD $200 - $600',
                  centersCount: 2500,
                  countriesCount: 160,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isDuolingo) {
              const existingIndex = items.findIndex(i => i.id === 'test-duolingo-det' || i.displayName.toLowerCase().includes('duolingo'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-duolingo-det',
                  displayName: card.title || card.titleAr || 'Duolingo English Test',
                  nameAr: card.titleAr || card.title || 'اختبار دولينجو للغة الإنجليزية (DET)',
                  nameEn: card.title || card.titleAr || 'Duolingo English Test',
                  provider: card.providerName || 'Duolingo, Inc.',
                  category: 'Language / Adaptive Test',
                  minScoreRange: card.scoreRange || '10 – 160 Score Scale',
                  validityDuration: card.validity || '2 Years (24 Months)',
                  approxFee: 'USD $70',
                  centersCount: 0,
                  countriesCount: 200,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isToefl) {
              const existingIndex = items.findIndex(i => i.id === 'test-toefl-ibt' || i.displayName.toLowerCase().includes('toefl'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-toefl-ibt',
                  displayName: card.title || card.titleAr || 'TOEFL iBT',
                  nameAr: card.titleAr || card.title || 'اختبار التوفل عبر الإنترنت (TOEFL iBT)',
                  nameEn: card.title || card.titleAr || 'TOEFL iBT Test',
                  provider: card.providerName || 'Educational Testing Service (ETS)',
                  category: 'Language / Academic Proficiency',
                  minScoreRange: card.scoreRange || '1.0 – 6.0 Band Scale (0 – 120 Score)',
                  validityDuration: card.validity || '2 Years (24 Months)',
                  approxFee: 'USD $245 - $190',
                  centersCount: 1200,
                  countriesCount: 160,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (isIelts) {
              const existingIndex = items.findIndex(i => i.id === 'test-ielts-academic' || i.displayName.toLowerCase().includes('ielts'));
              if (existingIndex !== -1) {
                items[existingIndex] = {
                  ...items[existingIndex],
                  displayName: card.title || card.titleAr || items[existingIndex].displayName,
                  nameAr: card.titleAr || card.title || items[existingIndex].nameAr,
                  status: card.status || items[existingIndex].status,
                };
              } else {
                items.unshift({
                  id: 'test-ielts-academic',
                  displayName: card.title || card.titleAr || 'IELTS Academic',
                  nameAr: card.titleAr || card.title || 'اختبار الآيلتس الأكاديمي',
                  nameEn: card.title || card.titleAr || 'IELTS Academic',
                  provider: card.providerName || 'British Council / IDP / Cambridge',
                  category: 'Language / Academic Proficiency',
                  minScoreRange: card.scoreRange || 'Band 9.0 - 0.0',
                  validityDuration: card.validity || '2 Years (24 Months)',
                  approxFee: 'USD $265 - $215',
                  centersCount: 1400,
                  countriesCount: 140,
                  status: card.status || 'PUBLISHED',
                  verificationStatus: 'verified',
                  completenessStatus: 'complete',
                });
              }
              continue;
            }

            if (card.testId && !items.some((i: TestItem) => i.id === card.testId)) {
              items.unshift({
                id: card.testId,
                displayName: card.title || card.titleAr,
                nameAr: card.titleAr || card.title,
                nameEn: card.title || card.titleAr,
                provider: card.providerName || 'British Council / IDP / Cambridge',
                category: 'Language / Academic Proficiency',
                minScoreRange: card.scoreRange || 'Band 9.0 - 0.0',
                validityDuration: card.validity || '2 Years (24 Months)',
                approxFee: 'USD $265 - $215',
                centersCount: 1400,
                countriesCount: 140,
                status: card.status || 'PUBLISHED',
                verificationStatus: 'verified',
                completenessStatus: 'complete',
              });
            }
          }
        }
      } catch (e) {}

      // Deduplicate items list to ensure TOEFL and IELTS only appear once
      const seenKeys = new Set<string>();
      const uniqueItems: TestItem[] = [];
      for (const item of items) {
        let key = item.id;
        const lowerName = (item.displayName || '').toLowerCase();
        if (lowerName.includes('toefl') || item.id.includes('toefl')) key = 'test-toefl-ibt';
        if (lowerName.includes('ielts') || item.id.includes('ielts')) key = 'test-ielts-academic';
        if (lowerName.includes('duolingo') || item.id.includes('duolingo') || item.id.includes('det')) key = 'test-duolingo-det';
        if (lowerName.includes('alevel') || lowerName.includes('a-level') || item.id.includes('alevel')) key = 'test-alevel-uk';
        if (lowerName.includes('csat') || lowerName.includes('suneung') || item.id.includes('csat')) key = 'test-csat-kr';
        if (lowerName.includes('tömer') || lowerName.includes('tomer') || item.id.includes('tomer')) key = 'test-tomer';
        if (lowerName.includes('topik') || item.id.includes('topik')) key = 'test-topik';
        if (lowerName.includes('toeic') || item.id.includes('toeic')) key = 'test-toeic';
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueItems.push(item);
        }
      }
      const allLoadedItems = uniqueItems;
      setAllTests(allLoadedItems);
      items = allLoadedItems;

      // Client-side filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter(item => 
          (item.displayName && item.displayName.toLowerCase().includes(q)) ||
          (item.provider && item.provider.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
        );
      }
      if (categoryFilter) {
        items = items.filter(i => resolveTestGroup(i) === categoryFilter);
      }

      setTests(items);
      setTotal(res.total || items.length);

      fetchCounts(allLoadedItems);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load international tests';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async (loadedItems: TestItem[]) => {
    try {
      const allData = loadedItems;
      setCounts({
        all: allData.length,
        imported: allData.filter(i => i.status === 'IMPORTED' || i.status === 'READY_TO_REVIEW').length,
        verifiedApproved: allData.filter(i => i.verificationStatus === 'verified' || i.status === 'PUBLISHED').length,
        missingData: allData.filter(i => i.completenessStatus === 'incomplete').length,
        needsSourceVerification: allData.filter(i => i.verificationStatus === 'needs_verification').length,
        readyToPublish: allData.filter(i => i.status === 'READY_TO_PUBLISH').length,
        published: allData.filter(i => i.status === 'PUBLISHED').length,
        archived: allData.filter(i => i.status === 'ARCHIVED').length,
      });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!demoUnlocked) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, categoryFilter, searchQuery, demoUnlocked]);

  if (!demoUnlocked) {
    return <Navigate to="/login" replace />;
  }

  const groupSummary = testGroups.map((group) => ({
    ...group,
    count: group.key ? allTests.filter((test) => resolveTestGroup(test) === group.key).length : allTests.length
  }));

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F4B3A] bg-emerald-50/60 px-2.5 py-1 rounded-lg w-fit border border-[#0F4B3A]/10 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('phase_23_admin_workspace') || 'Phase 23 Enterprise Admin Workspace'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t('admin_international_tests') || 'International Standardized Tests'}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('admin_international_tests_desc') || 'Manage standardized exams, providers, score validity, test centers, and university acceptance requirements.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Rule 3: Import button routes to /admin/imports/international-tests */}
          <Link
            to="/admin/imports/international-tests"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-all inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-[#0F4B3A]" />
            <span>{t('open_tests_import_center') || 'Open Tests Import Center'}</span>
          </Link>

          <button
            className="px-4 py-2.5 bg-[#0F4B3A] hover:bg-[#0b382b] text-white rounded-xl text-xs font-bold shadow-sm transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('add_test') || 'Add Test'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-700 hover:text-rose-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* TOP STATISTICS (8 COUNTERS as strictly required) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: t('all_tests') || 'All Tests', count: counts.all, filter: '', color: 'border-slate-100 bg-white text-slate-900 shadow-sm' },
          { label: t('imported_awaiting_review') || 'Imported / Review', count: counts.imported, filter: 'IMPORTED', color: 'border-blue-100 bg-blue-50/25 text-blue-900 shadow-sm' },
          { label: t('verified_approved') || 'Verified / Approved', count: counts.verifiedApproved, filter: '', color: 'border-emerald-100 bg-emerald-50/25 text-emerald-900 shadow-sm' },
          { label: t('missing_data') || 'Missing Data', count: counts.missingData, filter: '', color: 'border-amber-100 bg-amber-50/25 text-amber-900 shadow-sm' },
          { label: t('needs_source_verification') || 'Needs Source Verification', count: counts.needsSourceVerification, filter: '', color: 'border-purple-100 bg-purple-50/25 text-purple-900 shadow-sm' },
          { label: t('ready_to_publish') || 'Ready to Publish', count: counts.readyToPublish, filter: 'READY_TO_PUBLISH', color: 'border-teal-100 bg-teal-50/25 text-teal-900 shadow-sm' },
          { label: t('published') || 'Published', count: counts.published, filter: 'PUBLISHED', color: 'border-emerald-100 bg-emerald-50/25 text-emerald-900 shadow-sm' },
          { label: t('archived') || 'Archived', count: counts.archived, filter: 'ARCHIVED', color: 'border-slate-200 bg-slate-100/50 text-slate-700 shadow-xs' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => setStatusFilter(stat.filter)}
            className={`p-3.5 rounded-2xl border cursor-pointer hover:shadow-xs transition-all ${stat.color} ${statusFilter === stat.filter ? 'ring-2 ring-[#0F4B3A] border-transparent' : ''}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">{stat.label}</span>
            <span className="text-xl font-black mt-1 block">{stat.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث باسم الاختبار أو الجهة أو النوع"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/60 pr-10 pl-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4B3A] focus:bg-white"
              dir="rtl"
            />
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className="h-11 px-4 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 inline-flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>مسح التصفية</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {groupSummary.map((group) => (
            <button
              key={group.key || 'all'}
              onClick={() => setCategoryFilter(group.key)}
              className={`h-9 px-3 rounded-xl border text-[11px] font-black inline-flex items-center gap-2 ${
                categoryFilter === group.key
                  ? 'bg-[#0F4B3A] text-white border-[#0F4B3A]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{group.labelAr}</span>
              <span className={`px-1.5 py-0.5 rounded-lg ${
                categoryFilter === group.key ? 'bg-white/15 text-white' : 'bg-white text-slate-500 border border-slate-200'
              }`}>
                {group.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-bold text-slate-500">
          يعرض {tests.length} من {total || allTests.length} اختبار، مع التقسيم حسب عائلة الاختبار وليس حسب نصوص الملفات الخام.
        </div>
      </div>

      {/* LIGHTWEIGHT VERTICAL LIST / TABLE LAYOUT (Rule 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-xs">{t('loading') || 'Loading...'}</p>
          </div>
        ) : tests.length === 0 ? (
          /* Rule 8: Main list empty state */
          <div className="p-16 text-center text-slate-500 space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{t('no_tests_found') || 'No international tests found'}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('no_tests_desc') || 'Get started by adding an international test record or importing a batch from trusted test providers.'}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                {t('add_test') || 'Add Test'}
              </button>
              <Link
                to="/admin/imports/international-tests"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-all"
              >
                {t('open_tests_import_center') || 'Open Tests Import Center'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">{t('test_name') || 'Test Name'}</th>
                  <th className="p-4">{t('official_provider') || 'Official Provider / Owner'}</th>
                  <th className="p-4">نوع الاختبار</th>
                  <th className="p-4">{t('validity_duration') || 'Validity Duration'}</th>
                  <th className="p-4">{t('approx_fee') || 'Approx. Fee'}</th>
                  <th className="p-4">{t('lifecycle_status') || 'Status'}</th>
                  <th className="p-4 text-right">{t('actions') || 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-emerald-50/10 transition-colors">
                    {/* Name */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{test.displayName}</div>
                      {test.nameAr && test.nameAr !== test.displayName && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {test.nameAr}
                        </div>
                      )}
                      {test.sourceImportRecordId && (
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/50 rounded text-[10px] font-mono">
                            Import Record: {test.sourceImportRecordId}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Official Provider */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{test.providerName || test.provider || '-'}</div>
                      {test.createdAt && (
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          Created: {new Date(test.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black">
                        <Globe className="w-3.5 h-3.5 text-[#0F4B3A]" />
                        <span>{groupLabel(resolveTestGroup(test))}</span>
                      </div>
                      {test.category && (
                        <div className="text-[10px] text-slate-400 mt-1 max-w-[160px] truncate" title={test.category}>
                          {test.category}
                        </div>
                      )}
                    </td>

                    {/* Validity Duration */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{test.validityDuration || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Approx Fee (Optional allowed if space permits) */}
                    <td className="p-3.5">
                      <span className="text-slate-700 font-medium inline-flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        {test.approxFee || 'N/A'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                        test.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                        test.status === 'READY_TO_PUBLISH' ? 'bg-teal-50 text-teal-700 border border-[#0F4B3A]/20' :
                        test.status === 'IMPORTED' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                        test.status === 'READY_TO_REVIEW' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                        test.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700 border border-slate-200/50' :
                        'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}>
                        {statusLabel(test.status)}
                      </span>
                    </td>

                    {/* Action: View Details */}
                    <td className="p-3.5 text-right">
                      <Link
                        to={`/admin/international-tests/${test.id}`}
                        className="px-3 py-1.5 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/30 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t('view_details') || 'View Details'}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
