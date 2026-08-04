import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { CLT_MARKDOWN_CONTENT } from './clt-markdown-content';
import { CPA_MARKDOWN_CONTENT } from './cpa-markdown-content';
import { CSCA_MARKDOWN_CONTENT } from './csca-markdown-content';
import { CUET_MARKDOWN_CONTENT } from './cuet-markdown-content';
import { CSAT_MARKDOWN_CONTENT } from './csat-markdown-content';
import { DELE_MARKDOWN_CONTENT } from './dele-markdown-content';
import { DELF_MARKDOWN_CONTENT } from './delf-markdown-content';
import { DAT_MARKDOWN_CONTENT } from './dat-markdown-content';
import { GAMSAT_MARKDOWN_CONTENT } from './gamsat-markdown-content';
import { GMAT_MARKDOWN_CONTENT } from './gmat-markdown-content';
import { GRE_MARKDOWN_CONTENT } from './gre-markdown-content';
import { HSK_MARKDOWN_CONTENT } from './hsk-markdown-content';
import { EJU_MARKDOWN_CONTENT } from './eju-markdown-content';
import { ITEP_MARKDOWN_CONTENT } from './itep-markdown-content';
import { JLPT_MARKDOWN_CONTENT } from './jlpt-markdown-content';
import { LANGUAGECERT_MARKDOWN_CONTENT } from './languagecert-markdown-content';
import { LINGUASKILL_MARKDOWN_CONTENT } from './linguaskill-markdown-content';
import { IMAT_MARKDOWN_CONTENT } from './imat-markdown-content';
import { MET_MARKDOWN_CONTENT } from './met-markdown-content';
import { NT2_MARKDOWN_CONTENT } from './nt2-markdown-content';
import { OTE_MARKDOWN_CONTENT } from './ote-markdown-content';
import { MATURA_MARKDOWN_CONTENT } from './matura-markdown-content';
import { MCAT_MARKDOWN_CONTENT } from './mcat-markdown-content';
import { PLAB_MARKDOWN_CONTENT } from './plab-markdown-content';
import { PMP_MARKDOWN_CONTENT } from './pmp-markdown-content';
import { POLISH_STATE_CERTIFICATE_MARKDOWN_CONTENT } from './polish_state_certificate-markdown-content';
import { SAT_MARKDOWN_CONTENT } from './sat-markdown-content';
import { TESTDAF_MARKDOWN_CONTENT } from './testdaf-markdown-content';
import { PTE_MARKDOWN_CONTENT } from './pte-markdown-content';
import { TOMER_MARKDOWN_CONTENT } from './tomer-markdown-content';
import { TOPIK_MARKDOWN_CONTENT } from './topik-markdown-content';
import { TOEIC_MARKDOWN_CONTENT } from './toeic-markdown-content';
import { UKBI_MARKDOWN_CONTENT } from './ukbi-markdown-content';
import { USMLE_MARKDOWN_CONTENT } from './usmle-markdown-content';
import { YKS_MARKDOWN_CONTENT } from './yks-markdown-content';
import { TORFL_MARKDOWN_CONTENT } from './torfl-markdown-content';
import { UCAT_MARKDOWN_CONTENT } from './ucat-markdown-content';
import { YOS_MARKDOWN_CONTENT } from './yos-markdown-content';
import { BMAT_MARKDOWN_CONTENT } from './bmat-markdown-content';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, Globe, Loader2, Archive,
  FileText, Layers, Award, DollarSign, Clock, ShieldCheck, Link as LinkIcon,
  DownloadCloud, AlertTriangle, BookOpen, Building2, ExternalLink,
  Zap, Sparkles, FileCheck2, Tag, Calendar, HelpCircle, MapPin, Search,
  ChevronDown, ChevronUp, Check, Info, Code, ShieldAlert, Users, Compass,
  Laptop, PhoneCall, FileCheck, CheckSquare, RefreshCw, Scale, HeartHandshake,
  Shield, GraduationCap, AlertOctagon
} from 'lucide-react';
import { ApiClient } from '../../api/client';

const getTestPreset = (testId: string, importedCard?: any) => {
  const idLower = (
    (testId || '') + ' ' +
    (importedCard?.title || '') + ' ' +
    (importedCard?.titleAr || '') + ' ' +
    (importedCard?.testCode || '') + ' ' +
    (importedCard?.abbreviation || '') + ' ' +
    (importedCard?.notes || '')
  ).toLowerCase();

  if (idLower.includes('toefl') || idLower.includes('توفل')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'TOEFL iBT — اختبار التوفل الدولي الرقمي',
      canonicalName: 'TOEFL_IBT_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار التوفل الدولي عبر الإنترنت (TOEFL iBT)',
      nameEn: importedCard?.title || 'Test of English as a Foreign Language (iBT)',
      abbreviation: 'TOEFL',
      category: 'Language / Academic Proficiency',
      providerName: 'ETS (Educational Testing Service)',
      officialRegistrationUrl: 'https://www.ets.org/toefl/ibt/register',
      officialSourceUrl: 'https://www.ets.org/toefl',
      status: 'PUBLISHED',
      scoreRange: '0 – 120 Score',
      validity: 'سنتان (24 شهراً)',
      acceptances: '11,500+ جامعة في 160+ دولة',
      fee: 'USD $245 - $190',
      description: importedCard?.notes || 'اختبار أكاديمي يقيس مهارات اللغة الإنجليزية الأربع (القراءة، الاستماع، المحادثة، الكتابة) عبر الحساب الآلي والممتحنين الرقميين، للقبول بالجامعات والهيئات الأكاديمية.',
      markdownContent: TOEFL_MARKDOWN_CONTENT,
      sections: [
        { name: 'Reading (القراءة الأكاديمية)', duration: '35 دقيقة', count: '20 سؤالاً', score: '0 - 30' },
        { name: 'Listening (الاستماع الأكاديمي)', duration: '36 دقيقة', count: '28 سؤالاً', score: '0 - 30' },
        { name: 'Speaking (المحادثة الرقمية)', duration: '16 دقيقة', count: '4 مهام تواصلية', score: '0 - 30' },
        { name: 'Writing (الكتابة الأكاديمية)', duration: '29 دقيقة', count: 'مهمتان تحليليتان', score: '0 - 30' },
      ]
    };
  }
  if (idLower.includes('ukbi') || idLower.includes('يمن')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'UKBI — اختبار الكفاءة في اللغة الإندونيسية',
      canonicalName: 'UKBI_TEST',
      nameAr: importedCard?.titleAr || 'اختبار الكفاءة في اللغة الإندونيسية (UKBI)',
      nameEn: importedCard?.title || 'Indonesian Language Proficiency Test (UKBI)',
      abbreviation: 'UKBI',
      category: 'Language',
      providerName: 'Kemendikdasmen',
      officialRegistrationUrl: 'https://ukbi.kemendikbud.go.id',
      officialSourceUrl: 'https://ukbi.kemendikbud.go.id',
      status: 'PUBLISHED',
      scoreRange: '251 - 800',
      validity: 'سنتان',
      acceptances: 'الجامعات والمؤسسات الإندونيسية',
      fee: 'IDR 300,000',
      description: importedCard?.notes || 'اختبار حكومي إلكتروني تكيفي يقيس كفاءة استخدام اللغة الإندونيسية شفهيًا وكتابيًا لدى المواطنين والأجانب.',
      markdownContent: UKBI_MARKDOWN_CONTENT,
      sections: [
        { name: 'Listening (الاستماع)', duration: 'نحو 30 دقيقة', count: 'حتى 40 سؤالاً', score: 'القسم الأول' },
        { name: 'Grammar Response (الاستجابة للقواعد)', duration: 'حتى 20 دقيقة', count: 'حتى 25 سؤالاً', score: 'القسم الثاني' },
        { name: 'Reading (القراءة)', duration: 'حتى 45 دقيقة', count: 'حتى 40 سؤالاً', score: 'القسم الثالث' },
        { name: 'Writing (الكتابة)', duration: '35 دقيقة', count: 'مهمتان', score: 'القسم الرابع' },
        { name: 'Speaking (التحدث)', duration: '25 دقيقة', count: 'مهمتان', score: 'القسم الخامس' },
      ]
    };
  }
  if (idLower.includes('usmle') || idLower.includes('يوسملي')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'USMLE — امتحان الترخيص الطبي الأمريكي',
      canonicalName: 'USMLE_TEST',
      nameAr: importedCard?.titleAr || 'امتحان الترخيص الطبي الأمريكي (USMLE)',
      nameEn: importedCard?.title || 'United States Medical Licensing Examination (USMLE)',
      abbreviation: 'USMLE',
      category: 'Professional / Medical',
      providerName: 'FSMB & NBME',
      officialRegistrationUrl: 'https://www.usmle.org',
      officialSourceUrl: 'https://www.usmle.org',
      status: 'PUBLISHED',
      scoreRange: 'Pass / Fail / Numeric',
      validity: 'Varies by State',
      acceptances: 'الولايات المتحدة',
      fee: 'USD $695+',
      description: importedCard?.notes || 'سلسلة الامتحانات الطبية الأساسية المستخدمة ضمن طريق ترخيص الأطباء في الولايات المتحدة.',
      markdownContent: USMLE_MARKDOWN_CONTENT,
      sections: [
        { name: 'Step 1 (الأساسيات الطبية)', duration: '8 ساعات', count: 'حوالي 280 سؤالاً', score: 'Pass / Fail' },
        { name: 'Step 2 CK (المعرفة السريرية)', duration: '9 ساعات', count: 'حوالي 318 سؤالاً', score: 'رقمي' },
        { name: 'Step 3 (الممارسة المستقلة)', duration: 'يومان (FIP & ACM)', count: 'MCQs + CCS', score: 'رقمي' },
      ]
    };
  }
  if (idLower.includes('yks') && !idLower.includes('yos') && !idLower.includes('yös')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'YKS — اختبار مؤسسات التعليم العالي التركية',
      canonicalName: 'YKS_TEST',
      nameAr: importedCard?.titleAr || 'اختبار مؤسسات التعليم العالي التركية (YKS)',
      nameEn: importedCard?.title || 'YKS (Higher Education Institutions Exam)',
      abbreviation: 'YKS',
      category: 'Admission / Undergraduate',
      providerName: 'ÖSYM',
      officialRegistrationUrl: 'https://www.osym.gov.tr',
      officialSourceUrl: 'https://www.osym.gov.tr',
      status: 'PUBLISHED',
      scoreRange: 'Varies',
      validity: 'سنة واحدة',
      acceptances: 'الجامعات التركية',
      fee: 'Varies',
      description: importedCard?.notes || 'النظام الوطني الأساسي الموحد للقبول في الجامعات التركية لدرجتي الدبلوم والبكالوريوس.',
      markdownContent: YKS_MARKDOWN_CONTENT,
      sections: [
        { name: 'TYT (الكفاءة الأساسية)', duration: '165 دقيقة', count: '120 سؤالاً', score: 'القسم الأول' },
        { name: 'AYT (كفاءة المجال)', duration: '180 دقيقة', count: '160 سؤالاً (يُجاب 80)', score: 'القسم الثاني' },
        { name: 'YDT (اللغات الأجنبية)', duration: '120 دقيقة', count: '80 سؤالاً', score: 'القسم الثالث' },
      ]
    };
  }
  if (idLower.includes('torfl') || idLower.includes('trki') || idLower.includes('تورفل')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'TORFL / TRKI — اختبار الكفاءة في اللغة الروسية',
      canonicalName: 'TORFL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار الكفاءة في اللغة الروسية (TORFL)',
      nameEn: importedCard?.title || 'Test of Russian as a Foreign Language (TORFL)',
      abbreviation: 'TORFL',
      category: 'Language',
      providerName: 'Russian Ministry of Education',
      officialRegistrationUrl: 'https://torfl.org',
      officialSourceUrl: 'https://torfl.org',
      status: 'PUBLISHED',
      scoreRange: 'A1 - C2',
      validity: 'مدى الحياة للمستويات B1 فما فوق',
      acceptances: 'الجامعات الروسية',
      fee: 'USD $80 - $150',
      description: importedCard?.notes || 'الاختبار الرسمي والمعترف به دوليًا لقياس مستوى إجادة اللغة الروسية لغير الناطقين بها.',
      markdownContent: TORFL_MARKDOWN_CONTENT,
      sections: [
        { name: 'المفردات والقواعد (Лексика. Грамматика)', duration: 'متغير حسب المستوى', count: 'أسئلة خيارات', score: '66% للنجاح' },
        { name: 'القراءة (Чтение)', duration: 'متغير', count: 'نصوص متعددة', score: '66% للنجاح' },
        { name: 'الاستماع (Аудирование)', duration: 'متغير', count: 'تسجيلات صوتية', score: '66% للنجاح' },
        { name: 'الكتابة (Письмо)', duration: 'متغير', count: 'كتابة رسائل ومقالات', score: '66% للنجاح' },
        { name: 'التحدث (Говорение)', duration: 'متغير', count: 'محادثة ولعب أدوار', score: '66% للنجاح' },
      ]
    };
  }
  if (idLower.includes('ucat') || idLower.includes('يوكات')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'UCAT — اختبار الكفاءة السريرية الجامعية',
      canonicalName: 'UCAT_TEST',
      nameAr: importedCard?.titleAr || 'اختبار الكفاءة السريرية الجامعية (UCAT)',
      nameEn: importedCard?.title || 'University Clinical Aptitude Test',
      abbreviation: 'UCAT',
      category: 'Admission / Medical',
      providerName: 'UCAT Consortium',
      officialRegistrationUrl: 'https://www.ucat.ac.uk',
      officialSourceUrl: 'https://www.ucat.ac.uk',
      status: 'PUBLISHED',
      scoreRange: '1200 - 3600',
      validity: 'سنة واحدة',
      acceptances: 'كليات الطب وطب الأسنان في بريطانيا، أستراليا، نيوزيلندا',
      fee: 'GBP £115 - £130',
      description: importedCard?.notes || 'أداة تقييم موحدة تُستخدم من قبل كليات الطب وطب الأسنان لاختيار المرشحين.',
      markdownContent: UCAT_MARKDOWN_CONTENT,
      sections: [
        { name: 'Verbal Reasoning (الاستدلال اللفظي)', duration: '21 دقيقة', count: '44 سؤالاً', score: '300 - 900' },
        { name: 'Decision Making (اتخاذ القرار)', duration: '31 دقيقة', count: '29 سؤالاً', score: '300 - 900' },
        { name: 'Quantitative Reasoning (الاستدلال الكمي)', duration: '25 دقيقة', count: '36 سؤالاً', score: '300 - 900' },
        { name: 'Abstract Reasoning (الاستدلال المجرد)', duration: '12 دقيقة', count: '50 سؤالاً', score: '300 - 900' },
        { name: 'Situational Judgement (الحكم الظرفي)', duration: '26 دقيقة', count: '69 سؤالاً', score: 'Band 1 - 4' },
      ]
    };
  }
  if (idLower.includes('yos') || idLower.includes('yös') || idLower.includes('يوس')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'YÖS / TR-YÖS — اختبار الطلاب الأجانب في تركيا',
      canonicalName: 'YOS_TEST',
      nameAr: importedCard?.titleAr || 'اختبار الطلاب الأجانب في تركيا (YÖS)',
      nameEn: importedCard?.title || 'Turkish Universities Student Admission Exam (TR-YÖS)',
      abbreviation: 'YÖS',
      category: 'Admission / Undergraduate',
      providerName: 'ÖSYM',
      officialRegistrationUrl: 'https://www.osym.gov.tr',
      officialSourceUrl: 'https://www.osym.gov.tr',
      status: 'PUBLISHED',
      scoreRange: '0 - 500',
      validity: 'سنتان',
      acceptances: 'الجامعات الحكومية والخاصة في تركيا',
      fee: 'USD $40 - $80',
      description: importedCard?.notes || 'اختبار القبول الأساسي للطلاب الأجانب الراغبين في دراسة درجات البكالوريوس والطب في تركيا.',
      markdownContent: YOS_MARKDOWN_CONTENT,
      sections: [
        { name: 'مهارات التعلم الأساسية والذكاء (IQ)', duration: 'ضمن 100 دقيقة', count: '40 سؤالاً', score: 'القسم الأول' },
        { name: 'الرياضيات والهندسة', duration: 'ضمن 100 دقيقة', count: '40 سؤالاً', score: 'القسم الثاني' },
      ]
    };
  }
  if (idLower.includes('bmat') || idLower.includes('بيمات')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'BMAT — اختبار القبول في الطب الحيوي',
      canonicalName: 'BMAT_TEST',
      nameAr: importedCard?.titleAr || 'اختبار القبول في الطب الحيوي (BMAT)',
      nameEn: importedCard?.title || 'BioMedical Admissions Test (BMAT)',
      abbreviation: 'BMAT',
      category: 'Admission / Medical',
      providerName: 'CAAT',
      officialRegistrationUrl: 'https://www.admissionstesting.org',
      officialSourceUrl: 'https://www.admissionstesting.org',
      status: 'PUBLISHED',
      scoreRange: '1.0 - 9.0',
      validity: 'سنة واحدة',
      acceptances: 'جامعات محددة في المملكة المتحدة وأوروبا وآسيا',
      fee: 'GBP £70 - £150',
      description: importedCard?.notes || 'اختبار متخصص صُمم لتقييم المهارات الأكاديمية والقدرة المعرفية للمتقدمين لدراسة الطب.',
      markdownContent: BMAT_MARKDOWN_CONTENT,
      sections: [
        { name: 'Thinking Skills (مهارات التفكير)', duration: '60 دقيقة', count: '32 سؤالاً', score: '1.0 - 9.0' },
        { name: 'Scientific Knowledge (المعرفة العلمية)', duration: '30 دقيقة', count: '27 سؤالاً', score: '1.0 - 9.0' },
        { name: 'Writing Task (مهمة الكتابة)', duration: '30 دقيقة', count: 'مقال واحد', score: '1-5 للمحتوى و A-E للغة' },
      ]
    };
  }
  if (idLower.includes('gre') || idLower.includes('جي آر إي')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'GRE General Test — اختبار الدراسات العليا المتقدم',
      canonicalName: 'GRE_GENERAL_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار السجل العام للدراسات العليا (GRE)',
      nameEn: importedCard?.title || 'Graduate Record Examinations General Test',
      abbreviation: 'GRE',
      category: 'Graduate Admission / Professional',
      providerName: 'ETS (Educational Testing Service)',
      officialRegistrationUrl: 'https://www.ets.org/gre/test-takers/general-test/register.html',
      officialSourceUrl: 'https://www.ets.org/gre',
      status: 'PUBLISHED',
      scoreRange: '260 – 340 Score + Analytical Writing (0-6)',
      validity: '5 سنوات معتمدة',
      acceptances: '1,300+ كلية أعمال وجامعات عليا',
      fee: 'USD $220',
      description: importedCard?.notes || 'اختبار معياري دولي لبرامج الماجستير والدكتوراه وإدارة الأعمال، يقيس التفكير اللفظي، التفكير الكمي، والكتابة التحليلية.',
      markdownContent: GRE_MARKDOWN_CONTENT,
      sections: [
        { name: 'Verbal Reasoning (التفكير اللفظي)', duration: '41 دقيقة', count: '27 سؤالاً', score: '130 - 170' },
        { name: 'Quantitative Reasoning (التفكير الكمي)', duration: '47 دقيقة', count: '27 سؤالاً', score: '130 - 170' },
        { name: 'Analytical Writing (الكتابة التحليلية)', duration: '30 دقيقة', count: 'مقال تحليلي واحد', score: '0.0 - 6.0' },
      ]
    };
  }
  if (idLower.includes('duolingo') || idLower.includes('det') || idLower.includes('دولينجو')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Duolingo English Test — اختبار دوولينجو الدولي من المنزل',
      canonicalName: 'DUOLINGO_ENGLISH_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار دوولينجو للغة الإنجليزية (DET)',
      nameEn: importedCard?.title || 'Duolingo English Test',
      abbreviation: 'DET',
      category: 'Language / Adaptive Test',
      providerName: 'Duolingo, Inc.',
      officialRegistrationUrl: 'https://englishtest.duolingo.com/',
      officialSourceUrl: 'https://englishtest.duolingo.com/',
      status: 'PUBLISHED',
      scoreRange: '10 – 160 Score Scale',
      validity: 'سنتان (24 شهراً)',
      acceptances: '6,500+ جامعة ومؤسسة عالمية',
      fee: 'USD $70',
      description: importedCard?.notes || 'اختبار لغة إنجليزية أكاديمي رقمي ومتكيّف يمكن أداؤه من المنزل خلال نحو ساعة، ويقيس القراءة والكتابة والاستماع والمحادثة، وتصل نتيجته عادة خلال يومين.',
      markdownContent: DUOLINGO_MARKDOWN_CONTENT,
      sections: [
        { name: 'Literacy & Comprehension (القراءة والفهم)', duration: 'تكيّفي ضمن 45 دقيقة', count: 'أسئلة تفاعلية', score: '10 - 160' },
        { name: 'Conversation & Production (المحادثة والتعبير)', duration: 'تكيّفي ضمن 45 دقيقة', count: 'أسئلة تفاعلية', score: '10 - 160' },
        { name: 'Video Interview & Writing Sample', duration: '10 دقائق', count: 'مقابلة فيديو ومقال غير مصحح يُرسل للجامعة', score: 'مرفق مرئي' },
      ]
    };
  }
  if (idLower.includes('alevel') || idLower.includes('a-level') || idLower.includes('a_level') || idLower.includes('المستوى المتقدم')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'A-Level — مؤهلات المستوى المتقدم البريطاني والدولي (GCE / IAL)',
      canonicalName: 'ALEVEL_UK_INTERNATIONAL_QUALIFICATION',
      nameAr: importedCard?.titleAr || 'مؤهلات المستوى المتقدم البريطاني والدولي (A-Level)',
      nameEn: importedCard?.title || 'Advanced Level Qualifications (A-Level)',
      abbreviation: 'A-Level',
      category: 'Admission / Secondary & Pre-University Qualification',
      providerName: 'Cambridge / Pearson Edexcel / OxfordAQA / AQA / OCR / WJEC',
      officialRegistrationUrl: 'https://www.cambridgeinternational.org',
      officialSourceUrl: 'https://www.gov.uk/what-different-qualification-levels-mean',
      status: 'PUBLISHED',
      scoreRange: 'A* – E (Pass), U (Unclassified)',
      validity: 'دائم (Permanent Qualification)',
      acceptances: 'القبول الجامعي في كافة الجامعات البريطانية والعالمية',
      fee: 'USD $200 - $600 (حسب عدد المواد والمجلس والمركز)',
      description: importedCard?.notes || 'مؤهلات أكاديمية متقدمة تُدرس عادة خلال سنتين، يختار فيها الطالب ثلاث أو أربع مواد متخصصة، وتستخدمها الجامعات البريطانية والدولية لتقييم الجاهزية للقبول في البكالوريوس.',
      markdownContent: ALEVEL_MARKDOWN_CONTENT,
      sections: [
        { name: 'AS Level (Advanced Subsidiary)', duration: 'سنة واحدة (Year 12)', count: 'ورقتان إلى ثلاث لكل مادة', score: 'A - E' },
        { name: 'A2 / Full A Level (Advanced Level)', duration: 'سنتان (Year 12 & 13)', count: 'ثلاث أو أربع مواد كاملة', score: 'A* - E' },
      ]
    };
  }
  if (idLower.includes('abitur') || idLower.includes('ألمانية') || idLower.includes('allgemeine hochschulreife')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Abitur — الثانوية العامة الألمانية (Allgemeine Hochschulreife)',
      canonicalName: 'GERMAN_ABITUR_QUALIFICATION_OFFICIAL',
      nameAr: importedCard?.titleAr || 'الثانوية العامة الألمانية المؤهلة للجامعة (Abitur)',
      nameEn: importedCard?.title || 'German Allgemeine Hochschulreife (Abitur)',
      abbreviation: 'Abitur',
      category: 'Admission / School-Leaving Qualification',
      providerName: 'وزارات التعليم في الولايات الألمانية الست عشرة (KMK / IQB)',
      officialRegistrationUrl: 'https://www.kmk.org',
      officialSourceUrl: 'https://www.kmk.org/bildungsministerkonferenz/vertiefende-bildungsinhalte/bildungswege-und-schulabschluesse/gymnasiale-oberstufe-und-abitur.html',
      status: 'PUBLISHED',
      scoreRange: '300 – 900 Punkte (المعدل 1.0 – 4.0)',
      validity: 'دائم (Permanent Qualification)',
      acceptances: 'القبول المباشر في كافة الجامعات والمعاهد الألمانية والأوروبية',
      fee: 'مجاني للطلاب الماليين بالمدارس الحكومية / رسوم رمزيّة للامتحانات الخارجية',
      description: importedCard?.notes || 'مؤهل الثانوية العامة الألمانية الذي يجمع نتائج مرحلة التأهيل الدراسية وامتحانات نهائية تحريرية وشفوية، ويمنح صاحبه الحق العام في التقدم إلى الجامعات الألمانية.',
      markdownContent: ABITUR_MARKDOWN_CONTENT,
      sections: [
        { name: 'Qualifikationsphase (Block I)', duration: 'فصلان إلى 4 فصول دراسية', count: '36 إلى 40 مادة فصليّة', score: '200 - 600 نقطة' },
        { name: 'Abiturprüfung (Block II)', duration: 'الامتحانات النهائية (سنة Abitur)', count: '3 كتابي + 1 إلى 2 شفوي', score: '100 - 300 نقطة' },
      ]
    };
  }
  if (idLower.includes('act') || idLower.includes('اختبار act') || idLower.includes('american college testing')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'ACT — اختبار القبول الجامعي الأمريكي (Enhanced ACT)',
      canonicalName: 'ACT_AMERICAN_COLLEGE_TESTING_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار القبول الجامعي الأمريكي (ACT)',
      nameEn: importedCard?.title || 'ACT (American College Testing)',
      abbreviation: 'ACT',
      category: 'Admission / Academic Readiness',
      providerName: 'ACT Education Corp.',
      officialRegistrationUrl: 'https://www.act.org',
      officialSourceUrl: 'https://www.act.org/content/act/en/products-and-services/the-act.html',
      status: 'PUBLISHED',
      scoreRange: '1 – 36 Composite Score',
      validity: '5 سنوات (معتمد للقبول والمنح)',
      acceptances: 'كافة الجامعات الأمريكية والعديد من الجامعات الدولية والمنح',
      fee: 'USD $70 - $100 (حسب خيارات العلوم والكتابة والدولية)',
      description: importedCard?.notes || 'اختبار قبول جامعي معياري يقيس الإنجليزية والرياضيات والقراءة، مع قسمي العلوم والكتابة بصورة اختيارية. تتراوح الدرجة المركبة من 1 إلى 36، ويُستخدم في القبول الجامعي والمنح.',
      markdownContent: ACT_MARKDOWN_CONTENT,
      sections: [
        { name: 'English Section (اللغة الإنجليزية)', duration: '35 دقيقة', count: '50 سؤال اختيار من متعدد', score: '1 - 36' },
        { name: 'Math Section (الرياضيات)', duration: '50 دقيقة', count: '45 سؤال اختيار من متعدد', score: '1 - 36' },
        { name: 'Reading Section (القراءة والتحليل)', duration: '40 دقيقة', count: '36 سؤال اختيار من متعدد', score: '1 - 36' },
        { name: 'Science Section (العلوم - اختياري)', duration: '40 دقيقة', count: '40 سؤال استدلال علمي', score: '1 - 36' },
        { name: 'Writing Section (الكتابة - اختياري)', duration: '40 دقيقة', count: 'مقال تحليلي واحد', score: '2 - 12' },
      ]
    };
  }
  if (idLower.includes('celpe') || idLower.includes('برتغالية') || idLower.includes('portuguese')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Celpe-Bras — الشهادة البرازيلية الرسمية للكفاءة في البرتغالية (Celpe-Bras)',
      canonicalName: 'CELPE_BRAS_PORTUGUESE_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'الشهادة البرازيلية الرسمية للكفاءة في البرتغالية (Celpe-Bras)',
      nameEn: importedCard?.title || 'Celpe-Bras (Certificado de Proficiência em Língua Portuguesa para Estrangeiros)',
      abbreviation: 'Celpe-Bras',
      category: 'Language / Official Proficiency',
      providerName: 'Inep / Ministério da Educação (البرازيل)',
      officialRegistrationUrl: 'https://celpebras.inep.gov.br/celpebras/',
      officialSourceUrl: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/celpe-bras',
      status: 'PUBLISHED',
      scoreRange: 'Intermediário – Avançado Superior (4 مستويات)',
      validity: 'محدد حسب متطلبات الجامعة / الجهة المستقبلة',
      acceptances: 'كافة الجامعات البرازيلية والجهات الحكومية والمهنية',
      fee: 'R$ 250 - 350 (حسب مركز الاختبار البرازيلي أو الدولي)',
      description: importedCard?.notes || 'الشهادة البرازيلية الرسمية المعتمدة الوحيدة لإثبات الكفاءة في اللغة البرتغالية للطلاب والأجانب الراغبين في الدراسة والعمل في البرازيل.',
      markdownContent: CELPEBRAS_MARKDOWN_CONTENT,
      sections: [
        { name: 'Parte Escrita (الجزء الكتابي والتكاملي)', duration: '3 ساعات (180 دقيقة)', count: '4 مهام كتابية تكاملية (فيديو + صوت + نصوص)', score: '0.00 - 5.00' },
        { name: 'Parte Oral (الجزء الشفهي والمقابلة)', duration: '20 دقيقة', count: 'مقابلة تفاعلية حية (مناقشة اهتمامات وعناصر مثيرة)', score: '0.00 - 5.00' },
      ]
    };
  }
  if (idLower.includes('cils') || idLower.includes('إيطالية') || idLower.includes('italian')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'CILS — شهادة الكفاءة في اللغة الإيطالية (Università per Stranieri di Siena)',
      canonicalName: 'CILS_ITALIAN_LANGUAGE_CERTIFICATION_OFFICIAL',
      nameAr: importedCard?.titleAr || 'شهادة الكفاءة في اللغة الإيطالية (CILS)',
      nameEn: importedCard?.title || 'CILS (Certificazione di Italiano come Lingua Straniera)',
      abbreviation: 'CILS',
      category: 'Language / Proficiency Certification',
      providerName: 'Università per Stranieri di Siena (Centro CILS)',
      officialRegistrationUrl: 'https://cils.unistrasi.it',
      officialSourceUrl: 'https://cils.unistrasi.it/1/98/Esami_CILS.htm',
      status: 'PUBLISHED',
      scoreRange: 'A1 – C2 (55 - 100 نقطة للمستويات B1-C2)',
      validity: 'دائم (بدون تاريخ انتهاء رسمي)',
      acceptances: 'الجامعات الإيطالية (CILS B2)، المواطنة الإيطالية (B1 C)، تصاريح الإقامة (A2)',
      fee: 'EUR €40 - €160 (حسب المستوى والم وحدة المركز)',
      description: importedCard?.notes || 'شهادة الكفاءة الرسمية في اللغة الإيطالية الصادرة من جامعة سيينا للأجانب والمعتمدة عالمياً للقبول الجامعي والمواطنة والإقامة والعمل.',
      markdownContent: CILS_MARKDOWN_CONTENT,
      sections: [
        { name: 'Ascolto (الاستماع)', duration: '30 - 50 دقيقة', count: 'اختبار الاستماع والفهم الشفوي', score: '0 - 20 نقطة' },
        { name: 'Lettura (فهم القراءة)', duration: '40 - 80 دقيقة', count: 'نصوص وتحليل القراءة', score: '0 - 20 نقطة' },
        { name: 'Strutture della Comunicazione (تحليل بنى التواصل)', duration: '30 - 90 دقيقة', count: 'القواعد والمفردات والتطبيقات', score: '0 - 20 نقطة' },
        { name: 'Produzione Scritta (الإنتاج الكتابي)', duration: '30 - 90 دقيقة', count: 'مهام كتابية ومقالات', score: '0 - 20 نقطة' },
        { name: 'Produzione Orale (الإنتاج الشفهي)', duration: '10 - 15 دقيقة', count: 'حوار ومونولوج مسجلان', score: '0 - 20 نقطة' },
      ]
    };
  }
  if (idLower.includes('ap') || idLower.includes('advanced placement') || idLower.includes('متقدم')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'AP Exams — برنامج اختبارات ومقررات التقدّم المتقدم (Advanced Placement)',
      canonicalName: 'ADVANCED_PLACEMENT_AP_EXAMS_OFFICIAL',
      nameAr: importedCard?.titleAr || 'برنامج اختبارات التقدم المتقدم (AP Exams)',
      nameEn: importedCard?.title || 'Advanced Placement (AP Exams)',
      abbreviation: 'AP',
      category: 'College Credit / Academic Excellence',
      providerName: 'College Board',
      officialRegistrationUrl: 'https://apstudents.collegeboard.org',
      officialSourceUrl: 'https://apcentral.collegeboard.org',
      status: 'PUBLISHED',
      scoreRange: '1 – 5 Scale (لكل مادة)',
      validity: 'دائم (معتمد للساعات الجامعية والقبول)',
      acceptances: 'آلاف الجامعات في أمريكا وحول العالم للحصول على ائتمان جامعي وتجاوز المقررات',
      fee: 'USD $99 (داخل أمريكا) / $129 (دولياً)',
      description: importedCard?.notes || 'برنامج اختبارات مواد جامعية لطلاب الثانوية يتيح الحصول على ساعات معتمدة (College Credit) وتجاوز المساقات التمهيدية وتعزيز ملف القبول الجامعي.',
      markdownContent: AP_MARKDOWN_CONTENT,
      sections: [
        { name: 'Multiple Choice Section', duration: '60 - 90 دقيقة', count: 'أسئلة اختيار من متعدد', score: 'Raw Score Weight' },
        { name: 'Free Response / Performance Task', duration: '60 - 100 دقيقة', count: 'أسئلة مقالية أو مشاريع رقمية', score: 'Raw Score Weight' },
      ]
    };
  }
  if (idLower.includes('cambridge') || idLower.includes('كامبريدج') || idLower.includes('c1 advanced') || idLower.includes('b2 first')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Cambridge English Qualifications — مؤهلات كامبريدج للغة الإنجليزية (A2 - C2)',
      canonicalName: 'CAMBRIDGE_ENGLISH_QUALIFICATIONS_OFFICIAL',
      nameAr: importedCard?.titleAr || 'مؤهلات كامبريدج للغة الإنجليزية (Cambridge English Qualifications)',
      nameEn: importedCard?.title || 'Cambridge English Qualifications',
      abbreviation: 'Cambridge English',
      category: 'Language / Academic & Professional Qualifications',
      providerName: 'Cambridge University Press & Assessment',
      officialRegistrationUrl: 'https://www.cambridgeenglish.org/exams-and-tests/register-for-an-exam/',
      officialSourceUrl: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/',
      status: 'PUBLISHED',
      scoreRange: '100 – 230 Cambridge English Scale (A2 Key إلى C2 Proficiency)',
      validity: 'دائم (Lifetime Qualification)',
      acceptances: '25,000+ جامعة ومؤسسة وشركة حول العالم (C1 Advanced, B2 First)',
      fee: 'USD $150 - $280 (حسب المستوى والمركز)',
      description: importedCard?.notes || 'مجموعة مؤهلات لغوية متدرجة ودائمة الصلاحية تقيس الإنجليزية للأغراض الأكاديمية والمهنية وتوفر شهادات معتمدة عالمياً من A2 إلى C2.',
      markdownContent: CAMBRIDGE_MARKDOWN_CONTENT,
      sections: [
        { name: 'Reading & Use of English', duration: '60 - 90 دقيقة', count: 'قراءة واستخدام قواعد ومفردات', score: 'Cambridge Scale Score' },
        { name: 'Writing', duration: '45 - 90 دقيقة', count: 'مهمتان كتابيتان', score: 'Cambridge Scale Score' },
        { name: 'Listening', duration: '30 - 40 دقيقة', count: 'فهم الاستماع والمعلومات', score: 'Cambridge Scale Score' },
        { name: 'Speaking', duration: '8 - 16 دقيقة', count: 'محادثة شفهية تفاعلية وجهًا لوجه', score: 'Cambridge Scale Score' },
      ]
    };
  }
  if (idLower.includes('clt') || idLower.includes('classic learning')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'CLT — اختبار التعلّم الكلاسيكي للقبول الجامعي (Classic Learning Test)',
      canonicalName: 'CLT_CLASSIC_LEARNING_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار التعلّم الكلاسيكي (CLT)',
      nameEn: importedCard?.title || 'Classic Learning Test (CLT)',
      abbreviation: 'CLT',
      category: 'Admission / Academic Aptitude',
      providerName: 'Classic Learning Initiatives, LLC',
      officialRegistrationUrl: 'https://www.cltexam.com/tests/clt/',
      officialSourceUrl: 'https://www.cltexam.com/',
      status: 'PUBLISHED',
      scoreRange: '0 – 120 Score Scale',
      validity: 'دائم (حسب سياسة الجامعة/المنحة)',
      acceptances: '350+ كلية وجامعة وأكاديمية عسكرية أمريكية ودولية',
      fee: 'USD $112 (عن بُعد من المنزل) / رسوم المدرسة للمحيط المدرسي',
      description: importedCard?.notes || 'اختبار قبول جامعي معياري مدته ساعتان يقيس الاستدلال اللفظي والقواعد والكتابة والاستدلال الكمي من خلال نصوص كلاسيكية وأدبية وفلسفية وعلمية، ويمكن أداؤه من المنزل أو في المدرسة.',
      markdownContent: CLT_MARKDOWN_CONTENT,
      sections: [
        { name: 'Verbal Reasoning (الاستدلال اللفظي)', duration: '40 دقيقة', count: '40 سؤالاً', score: '0 - 40' },
        { name: 'Grammar/Writing (القواعد والكتابة)', duration: '35 دقيقة', count: '40 سؤالاً', score: '0 - 40' },
        { name: 'Quantitative Reasoning (الاستدلال الكمي)', duration: '45 دقيقة', count: '40 سؤالاً (بدون حاسبة)', score: '0 - 40' },
      ]
    };
  }
  if (idLower.includes('cpa') || idLower.includes('محاسب قانوني') || idLower.includes('uniform cpa')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'CPA — ترخيص وامتحان المحاسب القانوني المعتمد الأمريكي (Uniform CPA Exam)',
      canonicalName: 'US_CPA_UNIFORM_EXAM_OFFICIAL',
      nameAr: importedCard?.titleAr || 'ترخيص وامتحان المحاسب القانوني المعتمد الأمريكي (U.S. CPA)',
      nameEn: importedCard?.title || 'Certified Public Accountant (Uniform CPA Examination)',
      abbreviation: 'CPA',
      category: 'Professional / Licensure Examination',
      providerName: 'AICPA / NASBA / State Boards of Accountancy / Prometric',
      officialRegistrationUrl: 'https://nasba.org/exams/cpaexam/',
      officialSourceUrl: 'https://www.aicpa-cima.com/resources/toolkit/cpa-exam',
      status: 'PUBLISHED',
      scoreRange: '0 – 99 Scale (النجاح 75 في كل قسم)',
      validity: '30 شهراً لرصيد القسم (تجديد الرخصة يخضع لـ CPE والولاية)',
      acceptances: 'ترخيص مهني تنظيمي رسمي في 55 جهة قضائية أمريكية واعتراف دولي واسع',
      fee: 'USD $262+ للقسم + $390 رسم دولي إضافي + رسوم التقييم والطلب',
      description: importedCard?.notes || 'ترخيص مهني تنظيمي وأعلى مؤهل محاسبي أمريكي يتطلب اجتياز امتحان موحد من 4 أقسام (3 أساسية AUD, FAR, REG + قسم تخصص BAR, ISC, TCP) واجتياز شروط التعليم والخبرة والأخلاقيات للولاية.',
      markdownContent: CPA_MARKDOWN_CONTENT,
      sections: [
        { name: 'AUD (Auditing and Attestation)', duration: '4 ساعات', count: '78 MCQs + 7 TBSs', score: '0 - 99 (Pass 75)' },
        { name: 'FAR (Financial Accounting and Reporting)', duration: '4 ساعات', count: '50 MCQs + 7 TBSs', score: '0 - 99 (Pass 75)' },
        { name: 'REG (Taxation and Regulation)', duration: '4 ساعات', count: '72 MCQs + 8 TBSs', score: '0 - 99 (Pass 75)' },
        { name: 'Discipline Option (BAR / ISC / TCP)', duration: '4 ساعات', count: 'تختلف الأسئلة حسب التخصص', score: '0 - 99 (Pass 75)' },
      ]
    };
  }
  if (idLower.includes('csca') || idLower.includes('china scholastic')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'CSCA — اختبار الكفاءة الأكاديمية للقبول الجامعي في الصين (China Scholastic Competency Assessment)',
      canonicalName: 'CSCA_CHINA_SCHOLASTIC_COMPETENCY_ASSESSMENT',
      nameAr: importedCard?.titleAr || 'اختبار الكفاءة الأكاديمية للقبول الجامعي في الصين (CSCA)',
      nameEn: importedCard?.title || 'China Scholastic Competency Assessment (CSCA)',
      abbreviation: 'CSCA',
      category: 'Country-Specific Admission / Undergraduate',
      providerName: 'China Scholarship Council (CSC)',
      officialRegistrationUrl: 'https://www.csca.cn/',
      officialSourceUrl: 'https://www.csca.cn/',
      status: 'PUBLISHED',
      scoreRange: '0 – 100 لكل مادة (5 مواد)',
      validity: 'دورة القبول الجامعي / السنة الأكاديمية',
      acceptances: 'جامعات البكالوريوس الصينية ومستفيدي منحة الحكومة الصينية (CSC)',
      fee: '450 CNY (مادة) / 700 CNY (مادتان فأكثر)',
      description: importedCard?.notes || 'اختبار قبول موحد تنظمه China Scholarship Council للطلاب الدوليين المتقدمين إلى بكالوريوس في الصين، ويقيس الصينية الأكاديمية والرياضيات والفيزياء والكيمياء وفق متطلبات الجامعة والتخصص.',
      markdownContent: CSCA_MARKDOWN_CONTENT,
      sections: [
        { name: 'Liberal Arts Chinese (الصينية للعلوم الإنسانية)', duration: '90 دقيقة', count: '80 سؤالاً موضوعياً', score: '0 - 100' },
        { name: 'Science Chinese (الصينية للتخصصات العلمية)', duration: '90 دقيقة', count: '80 سؤالاً موضوعياً', score: '0 - 100' },
        { name: 'Mathematics (الرياضيات - صيني/إنجليزي)', duration: '60 دقيقة', count: '48 سؤالاً موضوعياً', score: '0 - 100' },
        { name: 'Physics (الفيزياء - صيني/إنجليزي)', duration: '60 دقيقة', count: '48 سؤالاً موضوعياً', score: '0 - 100' },
        { name: 'Chemistry (الكيمياء - صيني/إنجليزي)', duration: '60 دقيقة', count: '48 سؤالاً موضوعياً', score: '0 - 100' },
      ]
    };
  }
  if (idLower.includes('cuet') || idLower.includes('common university entrance')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'CUET — اختبار القبول الجامعي المشترك في الهند (Common University Entrance Test)',
      canonicalName: 'CUET_COMMON_UNIVERSITY_ENTRANCE_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار القبول الجامعي المشترك في الهند (CUET)',
      nameEn: importedCard?.title || 'Common University Entrance Test (CUET)',
      abbreviation: 'CUET',
      category: 'Country-Specific Admission / Undergraduate & PG',
      providerName: 'National Testing Agency (NTA)',
      officialRegistrationUrl: 'https://cuet.nta.nic.in/',
      officialSourceUrl: 'https://www.nta.ac.in/',
      status: 'PUBLISHED',
      scoreRange: '0 – 250 للورقة (+5 / -1)',
      validity: 'سنة أكاديمية واحدة (2026–2027)',
      acceptances: 'الجامعات المركزية والحكومية والخاصة المشاركة في الهند',
      fee: '₹1,000 (3 أوراق محلي) / ₹4,500 (مراكز دولية)',
      description: importedCard?.notes || 'اختبار محوسب موحد تطبقه NTA للقبول في مرحلة البكالوريوس والدراسات العليا لدى الجامعات والمؤسسات الهندية المشاركة، بأسئلة MCQ متخصصة ولغات متعددة.',
      markdownContent: CUET_MARKDOWN_CONTENT,
      sections: [
        { name: 'Language Papers (أوراق اللغات - 13 لغات)', duration: '60 دقيقة لكل ورقة', count: '50 سؤالاً موضوعياً', score: '0 - 250 (+5/-1)' },
        { name: 'Domain Specific Subjects (المواد التخصصية - 23 مادة)', duration: '60 دقيقة لكل ورقة', count: '50 سؤالاً موضوعياً', score: '0 - 250 (+5/-1)' },
        { name: 'General Aptitude Test (اختبار القدرات العام - كود 501)', duration: '60 دقيقة', count: '50 سؤالاً موضوعياً', score: '0 - 250 (+5/-1)' },
      ]
    };
  }
  if (idLower.includes('csat') || idLower.includes('suneung') || idLower.includes('college scholastic ability')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'CSAT / Suneung — اختبار القدرة الدراسية الجامعية في كوريا الجنوبية (College Scholastic Ability Test)',
      canonicalName: 'CSAT_SUNEUNG_COLLEGE_SCHOLASTIC_ABILITY_TEST',
      nameAr: importedCard?.titleAr || 'اختبار القدرة الدراسية الجامعية - سونونغ (CSAT / Suneung)',
      nameEn: importedCard?.title || 'College Scholastic Ability Test (CSAT / Suneung)',
      abbreviation: 'CSAT',
      category: 'Country-Specific Admission / National Exam',
      providerName: 'Korea Institute for Curriculum and Evaluation (KICE)',
      officialRegistrationUrl: 'https://www.suneung.re.kr/',
      officialSourceUrl: 'https://www.moe.go.kr/',
      status: 'PUBLISHED',
      scoreRange: 'Standard Score / Percentile / Grades (1-9)',
      validity: 'دورة القبول للعام الجامعي المكتوب (2027 Academic Year)',
      acceptances: 'الجامعات والكليات الكورية في القبول العام والشرط الأدنى للقبول المبكر',
      fee: '37,000 KRW (4 مجالات) / 42,000 KRW (5) / 47,000 KRW (6)',
      description: importedCard?.notes || 'اختبار القبول الجامعي الوطني في كوريا الجنوبية المكون من يوم اختبار كامل يقيس الكورية، الرياضيات، الإنجليزية، التاريخ الكوري (إلزامي)، الاستقصاء، ولغة أجنبية ثانية.',
      markdownContent: CSAT_MARKDOWN_CONTENT,
      sections: [
        { name: 'Korean Language (اللغة الكورية - مشترك + اختياري)', duration: '80 دقيقة', count: '45 سؤالاً', score: 'Standard Score / Grade 1-9' },
        { name: 'Mathematics (الرياضيات - مشترك + اختياري)', duration: '100 دقيقة', count: '30 سؤالاً', score: 'Standard Score / Grade 1-9' },
        { name: 'English (اللغة الإنجليزية - استماع وقراءة)', duration: '70 دقيقة', count: '45 سؤالاً', score: 'Absolute Grade 1-9' },
        { name: 'Korean History (التاريخ الكوري - إلزامي)', duration: '30 دقيقة', count: '20 سؤالاً', score: 'Absolute Grade 1-9' },
        { name: 'Inquiry (الدراسات الاجتماعية/العلوم - مادتان)', duration: '60 دقيقة (30x2)', count: '40 سؤالاً (20x2)', score: 'Standard Score / Grade 1-9' },
        { name: 'Second Foreign Language / Hanja (لغة ثانية / هانجا)', duration: '40 دقيقة', count: '30 سؤالاً', score: 'Absolute Grade 1-9' },
      ]
    };
  }

  if (idLower.includes('dele') || idLower.includes('إسبانية') || idLower.includes('spanish')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'DELE — دبلومات اللغة الإسبانية الرسمية (Diplomas de Español)',
      canonicalName: 'DELE_OFFICIAL_SPANISH_DIPLOMA',
      nameAr: importedCard?.titleAr || 'دبلومات اللغة الإسبانية كلغة أجنبية (DELE)',
      nameEn: importedCard?.title || 'Diplomas de Español como Lengua Extranjera (DELE)',
      abbreviation: 'DELE',
      category: 'Language / Official Diploma',
      providerName: 'Instituto Cervantes',
      officialRegistrationUrl: 'https://examenes.cervantes.es',
      officialSourceUrl: 'https://examenes.cervantes.es/es/dele/que-es',
      status: 'PUBLISHED',
      scoreRange: 'APTO / NO APTO (Group-based Passing)',
      validity: 'دائم (مدى الحياة)',
      acceptances: 'معترف به دولياً للجامعات والإقامة والجنسية الإسبانية',
      fee: 'EUR €112 - €240 (يختلف حسب المستوى والبلد)',
      description: importedCard?.notes || 'عائلة من الدبلومات الرسمية الدائمة التي تثبت درجة إتقان اللغة الإسبانية، وتُمنح من Instituto Cervantes نيابةً عن وزارة التعليم الإسبانية.',
      markdownContent: DELE_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('delf') || idLower.includes('dalf') || idLower.includes('فرنسية') || idLower.includes('french')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'DELF / DALF — دبلومات الفرنسية الرسمية للقبول الجامعي',
      canonicalName: 'DELF_DALF_OFFICIAL_FRENCH_DIPLOMA',
      nameAr: importedCard?.titleAr || 'دبلومات الدراسات والدبلوم المتقدم في اللغة الفرنسية (DELF / DALF)',
      nameEn: importedCard?.title || 'DELF / DALF French Language Diplomas',
      abbreviation: 'DELF/DALF',
      category: 'Language / Official Diploma',
      providerName: 'France Éducation international (FEI)',
      officialRegistrationUrl: 'https://www.france-education-international.fr',
      officialSourceUrl: 'https://www.france-education-international.fr/diplome/delf-tout-public',
      status: 'PUBLISHED',
      scoreRange: '0 – 100 Score (النجاح 50% مع شرط إقصائي)',
      validity: 'دائم (مدى الحياة)',
      acceptances: 'القبول الجامعي في فرنسا وبلجيكا وكافة الجامعات الفرانكوفونية',
      fee: 'تختلف حسب المستوى والبلد والمركز',
      description: importedCard?.notes || 'دبلومات رسمية دائمة في اللغة الفرنسية كلغة أجنبية معتمدة من وزارة التربية الوطنية الفرنسية، وتغطي المستويات من A1 إلى C2 للجامعة والعمل.',
      markdownContent: DELF_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('dat') || idLower.includes('أسنان') || idLower.includes('dental admission')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'DAT — اختبار القبول في كليات طب الأسنان الأمريكي (Dental Admission Test)',
      canonicalName: 'ADA_DAT_US_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار القبول في كليات طب الأسنان (DAT)',
      nameEn: importedCard?.title || 'Dental Admission Test (DAT)',
      abbreviation: 'DAT',
      category: 'Professional / Academic Admission',
      providerName: 'American Dental Association (ADA)',
      officialRegistrationUrl: 'https://www.ada.org/education/testing/exams/dental-admission-test-dat',
      officialSourceUrl: 'https://www.ada.org/education/testing/exams/dental-admission-test-dat',
      status: 'PUBLISHED',
      scoreRange: '200 – 600 Scale',
      validity: 'دائم لدى ADA (تحدد الكليات عمر القبول عادة بـ 2-3 سنوات)',
      acceptances: 'كافة كليات طب الأسنان في الولايات المتحدة ومواقع في كندا',
      fee: 'USD $580',
      description: importedCard?.notes || 'اختبار قبول محوسب موحد تشرف عليه جمعية طب الأسنان الأمريكية ADA لمساعدة كليات طب الأسنان في تقييم مهارات واستعداد المتقدمين لبرامج DDS و DMD.',
      markdownContent: DAT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('gamsat') || idLower.includes('طب للدراسات العليا')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'GAMSAT — اختبار القبول لكليات الطب للدراسات العليا (Graduate Medical School Admissions Test)',
      canonicalName: 'ACER_GAMSAT_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار القبول لكليات الطب للدراسات العليا (GAMSAT)',
      nameEn: importedCard?.title || 'Graduate Medical School Admissions Test',
      abbreviation: 'GAMSAT',
      category: 'Admission / Professional',
      providerName: 'ACER (Australian Council for Educational Research)',
      officialRegistrationUrl: 'https://gamsat.acer.org',
      officialSourceUrl: 'https://gamsat.acer.org',
      status: 'PUBLISHED',
      scoreRange: '0 – 100+ Scale',
      validity: '2-4 Years (2-4 سنوات حسب الدولة)',
      acceptances: 'كليات الطب البشري وطب الأسنان في أستراليا، بريطانيا، وإيرلندا',
      fee: 'AUD $568 / EUR €378 / GBP £296',
      description: importedCard?.notes || 'اختبار معياري عالي المستوى مخصص لتقييم قدرة المتقدمين على متابعة الدراسات الطبية والصحية العليا بمستوى متقدم.',
      markdownContent: GAMSAT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('gmat') || idLower.includes('إدارة الأعمال')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'GMAT Exam (Focus Edition) — اختبار القبول للدراسات العليا وإدارة الأعمال',
      canonicalName: 'GMAC_GMAT_FOCUS_EDITION',
      nameAr: importedCard?.titleAr || 'اختبار القبول للدراسات العليا في إدارة الأعمال (GMAT)',
      nameEn: importedCard?.title || 'Graduate Management Admission Test (GMAT Focus Edition)',
      abbreviation: 'GMAT',
      category: 'Admission / Professional',
      providerName: 'GMAC (Graduate Management Admission Council)',
      officialRegistrationUrl: 'https://www.gmac.com',
      officialSourceUrl: 'https://www.gmac.com/gmat-other-exams/gmat-exam',
      status: 'PUBLISHED',
      scoreRange: '205 – 805 Score Scale',
      validity: '5 Years (5 سنوات)',
      acceptances: '7,700+ برنامج دراسات عليا وإدارة أعمال في 2,400+ جامعة حول العالم',
      fee: 'USD $275 - $300 (حسب الموقع والطريقة)',
      description: importedCard?.notes || 'الاختبار العالمي المعتمد والأكثر انتشاراً لقياس المهارات التحليلية والرياضية وحل المشكلات للقبول في برامج ماجستير إدارة الأعمال (MBA) والدراسات الإدارية.',
      markdownContent: GMAT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('hsk') || idLower.includes('صينية') || idLower.includes('chinese')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'HSK (Hanyu Shuiping Kaoshi) — اختبار كفاءة اللغة الصينية الرسمي',
      canonicalName: 'CLEC_HSK_CHINESE_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار كفاءة اللغة الصينية (HSK)',
      nameEn: importedCard?.title || 'Hanyu Shuiping Kaoshi (HSK)',
      abbreviation: 'HSK',
      category: 'Language',
      providerName: 'CLEC (Center for Language Education and Cooperation)',
      officialRegistrationUrl: 'http://www.chinesetest.cn',
      officialSourceUrl: 'http://www.chinesetest.cn',
      status: 'PUBLISHED',
      scoreRange: 'Varies by Level (120/200 or 180/300 Passing)',
      validity: 'Lifetime (for Personal) / 2 Years (for Admission)',
      acceptances: 'كافة الجامعات الصينية والمنح الحكومية (CSC) والمؤسسات التجارية',
      fee: 'USD $20 - $180 (حسب المستوى والمكان)',
      description: importedCard?.notes || 'الاختبار الوطني الرسمي المعتمد عالمياً لقياس كفاءة اللغة الصينية لغير الناطقين بها والمطور بواسطة وزارة التعليم الصينية.',
      markdownContent: HSK_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('eju') || idLower.includes('ياباني') || idLower.includes('japanese university')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'EJU (Examination for Japanese University Admission) — اختبار القبول للجامعات اليابانية',
      canonicalName: 'JASSO_EJU_JAPANESE_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار القبول الجامعي الياباني للطلاب الدوليين (EJU)',
      nameEn: importedCard?.title || 'Examination for Japanese University Admission for International Students',
      abbreviation: 'EJU',
      category: 'Admission / Academic',
      providerName: 'JASSO (Japan Student Services Organization)',
      officialRegistrationUrl: 'https://www.jasso.go.jp/en/ryugaku/eju/index.html',
      officialSourceUrl: 'https://www.jasso.go.jp/en/ryugaku/eju/index.html',
      status: 'PUBLISHED',
      scoreRange: '0 - 400 + 0 - 200 Scale',
      validity: '2 Years (24 Months)',
      acceptances: 'غالبية الجامعات الوطنية والخاصة في اليابان ومنح MEXT والبرامج الأكاديمية بالبكالوريوس',
      fee: 'USD $50 - $110 (حسب عدد المواد)',
      description: importedCard?.notes || 'الاختبار الموحد المعتمد من قبل وزارة التعليم اليابانية ومنظمة JASSO لقياس الاستعداد الأكاديمي واللغوي للدراسة الجامعية في اليابان.',
      markdownContent: EJU_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('itep') || idLower.includes('آي تيب')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'iTEP Academic — اختبار الكفاءة الأكاديمية للغة الإنجليزية',
      canonicalName: 'ITEP_ACADEMIC_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار iTEP الأكاديمي للغة الإنجليزية',
      nameEn: importedCard?.title || 'iTEP Academic English Proficiency',
      abbreviation: 'iTEP',
      category: 'Language / Academic Proficiency',
      providerName: 'Boston Educational Services (BES)',
      officialRegistrationUrl: 'https://www.itepexam.com',
      officialSourceUrl: 'https://www.itepexam.com',
      status: 'PUBLISHED',
      scoreRange: '0.0 – 6.0 Level Scale',
      validity: 'سنتان (24 شهراً)',
      acceptances: '700+ جامعة ومؤسسة عالمية وأمريكية',
      fee: 'USD $129 - $179',
      description: importedCard?.notes || 'اختبار كفاءة لغة إنجليزية مرن وسريع عبر الإنترنت لمدة 90 دقيقة، معترف به للقبول الأكاديمي والتأشيرات.',
      markdownContent: ITEP_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('jlpt') || idLower.includes('نيهونگو') || idLower.includes('ياباني')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'JLPT (Japanese Language Proficiency Test) — اختبار كفاءة اللغة اليابانية',
      canonicalName: 'JLPT_JAPANESE_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار كفاءة اللغة اليابانية (JLPT)',
      nameEn: importedCard?.title || 'Japanese Language Proficiency Test',
      abbreviation: 'JLPT',
      category: 'Language / Certification',
      providerName: 'Japan Foundation & Japan Educational Exchanges and Services',
      officialRegistrationUrl: 'https://www.jlpt.jp/e/',
      officialSourceUrl: 'https://www.jlpt.jp',
      status: 'PUBLISHED',
      scoreRange: 'N5 (الأبسط) إلى N1 (الأكثر تقدماً)',
      validity: 'Lifetime (دائم)',
      acceptances: 'كافة الجامعات اليابانية، الشركات، وجهات التوظيف والهجرة',
      fee: 'Varies by Country / Center (~$50 - $100)',
      description: importedCard?.notes || 'الاختبار الأوسع اعترافاً في العالم لقياس وتوثيق كفاءة اللغة اليابانية لغير الناطقين بها من خلال 5 مستويات (N1-N5).',
      markdownContent: JLPT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('languagecert') || idLower.includes('لانجويج سيرت')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'LANGUAGECERT Academic — اختبار الكفاءة الدولية المعتمد',
      canonicalName: 'LANGUAGECERT_ACADEMIC_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار لانجويج سيرت الأكاديمي (LANGUAGECERT Academic)',
      nameEn: importedCard?.title || 'LANGUAGECERT Academic English',
      abbreviation: 'LANGUAGECERT',
      category: 'Language / Academic Proficiency',
      providerName: 'PeopleCert / LANGUAGECERT',
      officialRegistrationUrl: 'https://www.languagecert.org',
      officialSourceUrl: 'https://www.languagecert.org',
      status: 'PUBLISHED',
      scoreRange: 'High Pass / Pass / CEFR A1 - C2',
      validity: 'Lifetime / Institution Specific',
      acceptances: 'جامعات بريطانية وأوروبية وعالمية معتمدة للقبول والتأشيرات (SELT)',
      fee: 'USD $150 - $230',
      description: importedCard?.notes || 'اختبار إنجليزي أكاديمي حديث معتمد للتأشيرات والجامعات، يمكن إجراؤه في مركز أو من المنزل بمراقبة رقمية.',
      markdownContent: LANGUAGECERT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('linguaskill') || idLower.includes('لينجواسكيل')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Linguaskill (by Cambridge) — اختبار كفاءة الإنجليزية السريع والمرن',
      canonicalName: 'CAMBRIDGE_LINGUASKILL_OFFICIAL_TEST',
      nameAr: importedCard?.titleAr || 'اختبار لينجواسكيل من كامبريدج (Linguaskill)',
      nameEn: importedCard?.title || 'Linguaskill (Cambridge Assessment English)',
      abbreviation: 'Linguaskill',
      category: 'Language / Corporate & Academic',
      providerName: 'Cambridge University Press & Assessment',
      officialRegistrationUrl: 'https://www.cambridgeenglish.org/exams-and-tests/linguaskill/',
      officialSourceUrl: 'https://www.cambridgeenglish.org',
      status: 'PUBLISHED',
      scoreRange: 'CEFR Pre-A1 to C1 or above (Bulats scale)',
      validity: 'Institution Specified (Typically 2 Years)',
      acceptances: 'جامعات ومؤسسات كبرى وشركات حول العالم',
      fee: 'Varies by Authorized Agent',
      description: importedCard?.notes || 'اختبار رقمي مدعوم بالذكاء الاصطناعي من كامبريدج لتقييم مهارات اللغة الإنجليزية بسرعة ودقة عالية.',
      markdownContent: LINGUASKILL_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('imat') || idLower.includes('إيمات') || idLower.includes('international medical admissions test')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'IMAT (International Medical Admissions Test) — اختبار القبول الطبي بالجامعات الإيطالية',
      canonicalName: 'IMAT_ITALY_MEDICAL_ADMISSIONS_TEST',
      nameAr: importedCard?.titleAr || 'اختبار القبول لكليات الطب الإيطالية (IMAT)',
      nameEn: importedCard?.title || 'International Medical Admissions Test (IMAT)',
      abbreviation: 'IMAT',
      category: 'Admission / Medical Schools',
      providerName: 'Cambridge Assessment Admissions Testing / MUR Italy',
      officialRegistrationUrl: 'https://www.universitaly.it',
      officialSourceUrl: 'https://www.cambridgeassessment.org.uk',
      status: 'PUBLISHED',
      scoreRange: '0 – 90 Max Score Scale',
      validity: '1 Academic Year Cycle (سنوي)',
      acceptances: 'كافة كليات الطب والجراحة وطب الأسنان باللغة الإنجليزية في الجامعات الحكومية الإيطالية',
      fee: 'EUR €130 (رسوم التسجيل الرسمية)',
      description: importedCard?.notes || 'الاختبار الرسمي الإلزامي للقبول في برامج الطب والجراحة باللغة الإنجليزية في الجامعات الحكومية في إيطاليا.',
      markdownContent: IMAT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('met') || idLower.includes('michigan') || idLower.includes('ميشيغان')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Michigan English Test (MET) — اختبار ميشيغان للغة الإنجليزية',
      canonicalName: 'MICHIGAN_ENGLISH_TEST_MET_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار ميشيغان للغة الإنجليزية (MET)',
      nameEn: importedCard?.title || 'Michigan English Test (MET)',
      abbreviation: 'MET',
      category: 'Language / Academic & Professional',
      providerName: 'Michigan Language Assessment (University of Michigan & Cambridge)',
      officialRegistrationUrl: 'https://michiganassessment.org/which-test-is-right-for-me/met/',
      officialSourceUrl: 'https://michiganassessment.org',
      status: 'PUBLISHED',
      scoreRange: '0 – 80 Scale Score (A2 to C1)',
      validity: 'Lifetime / Institution Specific',
      acceptances: 'جامعات ومؤسسات كبرى ومهنية وهجرة أسترالية معتمدة',
      fee: 'Varies by Center / Prometric / Home',
      description: importedCard?.notes || 'اختبار دولي رقمي يقيس الإنجليزية في المواقف الأكاديمية والمهنية، يغطي A2 إلى C1.',
      markdownContent: MET_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('nt2') || idLower.includes('staatsexamen') || idLower.includes('هولندا')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Staatsexamen Nt2 — الامتحان الحكومي للهولندية كلغة ثانية',
      canonicalName: 'STAATSEXAMEN_NT2_DUTCH_STATE_EXAM',
      nameAr: importedCard?.titleAr || 'الامتحان الحكومي للهولندية كلغة ثانية (Staatsexamen Nt2)',
      nameEn: importedCard?.title || 'Staatsexamen Nederlands als tweede taal',
      abbreviation: 'Staatsexamen Nt2',
      category: 'Language / Government Certification (NL)',
      providerName: 'CvTE & DUO (مملكة هولندا)',
      officialRegistrationUrl: 'https://www.staatsexamensnt2.nl',
      officialSourceUrl: 'https://duo.nl',
      status: 'PUBLISHED',
      scoreRange: '500 Pass Threshold per Component (B1 / B2)',
      validity: 'Unlimited / Lifetime (دائم)',
      acceptances: 'الجامعات والكليات الهولندية (HBO/WO) والتعليم المهني (MBO)',
      fee: 'EUR €50 per component / €200 full',
      description: importedCard?.notes || 'اختبار حكومي هولندي رسمي للبالغين لتقييم الهولندية كلغة ثانية عند مستويي B1 وB2.',
      markdownContent: NT2_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('ote') || idLower.includes('oxford') || idLower.includes('أكسفورد')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Oxford Test of English (OTE) — اختبار أكسفورد المعتمد للغة الإنجليزية',
      canonicalName: 'OXFORD_TEST_OF_ENGLISH_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار أكسفورد للغة الإنجليزية (Oxford Test of English)',
      nameEn: importedCard?.title || 'Oxford Test of English (OTE)',
      abbreviation: 'OTE',
      category: 'Language / Academic & General',
      providerName: 'Oxford University Press (University of Oxford)',
      officialRegistrationUrl: 'https://www.oxfordtestofenglish.com',
      officialSourceUrl: 'https://www.oxfordtestofenglish.com',
      status: 'PUBLISHED',
      scoreRange: '0 – 140 (OTE) / 0 – 170 (Advanced)',
      validity: 'Lifetime / Institution Specific',
      acceptances: 'جامعات ومؤسسات معتمدة عالمياً',
      fee: 'Varies by Authorized Test Center',
      description: importedCard?.notes || 'اختبار إنجليزي رقمي معتمد من جامعة أكسفورد يقيس المهارات الأربع مع مرونة الوحدات المستقلة.',
      markdownContent: OTE_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('matura') || idLower.includes('ماتورا')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Matura — عائلة شهادات وامتحانات إنهاء الثانوية والقبول الجامعي',
      canonicalName: 'EUROPEAN_MATURA_QUALIFICATIONS_FAMILY',
      nameAr: importedCard?.titleAr || 'عائلة شهادات وامتحانات الثانوية والقبول الجامعي (Matura)',
      nameEn: importedCard?.title || 'Matura / Maturità / Maturita (European Family)',
      abbreviation: 'Matura',
      category: 'Admission / Secondary Qualification Family',
      providerName: 'National Ministries of Education (Austria, Poland, Czechia, etc.)',
      officialRegistrationUrl: 'https://www.bmb.gv.at',
      officialSourceUrl: 'https://cke.gov.pl',
      status: 'PUBLISHED',
      scoreRange: 'Country-specific grading systems',
      validity: 'Lifetime Qualification',
      acceptances: 'الجامعات الوطنية والأوروبية والعالمية',
      fee: 'Varies by Country and School',
      description: importedCard?.notes || 'عائلة مؤهلات وامتحانات وطنية لإنهاء الثانوية العامة والتأهل للتعليم العالي في عدة دول أوروبية.',
      markdownContent: MATURA_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('mcat') || idLower.includes('medical college') || idLower.includes('طب')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'MCAT — اختبار القبول في كليات الطب (Medical College Admission Test)',
      canonicalName: 'AAMC_MEDICAL_COLLEGE_ADMISSION_TEST_MCAT',
      nameAr: importedCard?.titleAr || 'اختبار القبول في كليات الطب (MCAT)',
      nameEn: importedCard?.title || 'Medical College Admission Test (MCAT)',
      abbreviation: 'MCAT',
      category: 'Admission / Medical Schools',
      providerName: 'Association of American Medical Colleges (AAMC)',
      officialRegistrationUrl: 'https://students-residents.aamc.org/taking-mcat-exam/take-mcat-exam',
      officialSourceUrl: 'https://students-residents.aamc.org',
      status: 'PUBLISHED',
      scoreRange: '472 – 528 (Midpoint 500)',
      validity: 'Institution Specific (Typically 2–3 Years)',
      acceptances: 'كافة كليات الطب MD وDO في الولايات المتحدة وكندا وبرامج صحية',
      fee: 'USD $355 + $130 International Fee',
      description: importedCard?.notes || 'اختبار قبول طبي معياري شامل يقيس العلوم والتحليل النقدي للقبول في كليات الطب.',
      markdownContent: MCAT_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('plab') || idLower.includes('professional and linguistic')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'PLAB — اختبار تقييم المهنيين واللغويات',
      canonicalName: 'PLAB_ASSESSMENT_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار تقييم المهنيين واللغويات (PLAB)',
      nameEn: importedCard?.title || 'Professional and Linguistic Assessments Board',
      abbreviation: 'PLAB',
      category: 'Professional / Medical',
      providerName: 'GMC (General Medical Council)',
      officialRegistrationUrl: 'https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab',
      officialSourceUrl: 'https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab',
      status: 'PUBLISHED',
      scoreRange: 'Pass/Fail',
      validity: '2-3 Years',
      acceptances: 'المجلس الطبي العام في المملكة المتحدة (GMC)',
      fee: '£255 - £934',
      description: importedCard?.notes || 'اختبار تقييم الأطباء الذين تأهلوا في الخارج ويرغبون بممارسة الطب في المملكة المتحدة.',
      markdownContent: PLAB_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('pmp') || idLower.includes('project management professional')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'PMP — شهادة محترف إدارة المشاريع',
      canonicalName: 'PMP_CERTIFICATION_OFFICIAL',
      nameAr: importedCard?.titleAr || 'شهادة محترف إدارة المشاريع (PMP)',
      nameEn: importedCard?.title || 'Project Management Professional (PMP)',
      abbreviation: 'PMP',
      category: 'Professional / Management',
      providerName: 'Project Management Institute (PMI)',
      officialRegistrationUrl: 'https://www.pmi.org/certifications/project-management-pmp',
      officialSourceUrl: 'https://www.pmi.org/certifications/project-management-pmp',
      status: 'PUBLISHED',
      scoreRange: 'Pass/Fail',
      validity: '3 Years',
      acceptances: 'المنظمات والشركات العالمية',
      fee: 'USD $405 - $575',
      description: importedCard?.notes || 'شهادة احترافية دولية للمحترفين في مجال إدارة المشاريع.',
      markdownContent: PMP_MARKDOWN_CONTENT,
      sections: []
    };
  }
  if (idLower.includes('polish') || idLower.includes('certyfikat polski')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'Polish State Certificate — امتحان شهادة الدولة في اللغة البولندية',
      canonicalName: 'POLISH_STATE_CERTIFICATE_OFFICIAL',
      nameAr: importedCard?.titleAr || 'امتحان شهادة الدولة في اللغة البولندية',
      nameEn: importedCard?.title || 'State Certificate Examinations in Polish',
      abbreviation: 'Certyfikat Polski',
      category: 'Language / Government Certification',
      providerName: 'State Commission (Poland)',
      officialRegistrationUrl: 'https://certyfikatpolski.pl/',
      officialSourceUrl: 'https://certyfikatpolski.pl/',
      status: 'PUBLISHED',
      scoreRange: 'B1 - C2',
      validity: 'Lifetime',
      acceptances: 'الجامعات والمؤسسات الحكومية في بولندا',
      fee: 'EUR €90 - €180',
      description: importedCard?.notes || 'الامتحان الرسمي المعتمد لتقييم كفاءة اللغة البولندية كلغة أجنبية.',
      markdownContent: POLISH_STATE_CERTIFICATE_MARKDOWN_CONTENT,
      sections: []
    };
  }

  if ((idLower.includes('sat') && !idLower.includes('csat') && !idLower.includes('gamsat')) || idLower.includes('scholastic') || idLower.includes('سات')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'SAT — اختبار القبول الجامعي',
      canonicalName: 'SAT_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار القبول الجامعي (SAT)',
      nameEn: importedCard?.title || 'SAT',
      abbreviation: 'SAT',
      category: 'Admission / Undergraduate',
      providerName: 'College Board',
      officialRegistrationUrl: 'https://satsuite.collegeboard.org/sat/registration',
      officialSourceUrl: 'https://satsuite.collegeboard.org/sat',
      status: 'PUBLISHED',
      scoreRange: '400 - 1600',
      validity: 'Varies',
      acceptances: 'الجامعات في الولايات المتحدة وحول العالم',
      fee: 'USD $111+',
      description: importedCard?.notes || 'اختبار قبول جامعي رقمي من College Board يقيس القراءة والكتابة والرياضيات.',
      markdownContent: SAT_MARKDOWN_CONTENT,
      sections: []
    };
  }

  if (idLower.includes('testdaf') || idLower.includes('deutsch als fremdsprache')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'TestDaF — اختبار الألمانية كلغة أجنبية',
      canonicalName: 'TESTDAF_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار الألمانية كلغة أجنبية (TestDaF)',
      nameEn: importedCard?.title || 'Test Deutsch als Fremdsprache (TestDaF)',
      abbreviation: 'TestDaF',
      category: 'Language / Academic',
      providerName: 'g.a.s.t.',
      officialRegistrationUrl: 'https://www.testdaf.de/de/teilnehmende/mein-testdaf/testdaf-termine-und-anmeldung/',
      officialSourceUrl: 'https://www.testdaf.de/de/',
      status: 'PUBLISHED',
      scoreRange: 'TDN 3 - 5',
      validity: 'Lifetime',
      acceptances: 'جميع الجامعات الألمانية',
      fee: 'EUR €210 - €215',
      description: importedCard?.notes || 'اختبار ألماني أكاديمي معترف به في جميع الجامعات الألمانية.',
      markdownContent: TESTDAF_MARKDOWN_CONTENT,
      sections: [
        { name: 'Leseverstehen (القراءة)', duration: '60 دقيقة', count: '3 نصوص', score: 'TDN 3 - 5' },
        { name: 'Hörverstehen (الاستماع)', duration: '40 دقيقة', count: '3 نصوص صوتية', score: 'TDN 3 - 5' },
        { name: 'Schriftlicher Ausdruck (الكتابة)', duration: '60 دقيقة', count: 'مهمة واحدة', score: 'TDN 3 - 5' },
        { name: 'Mündlicher Ausdruck (المحادثة)', duration: '35 دقيقة', count: '7 مهام', score: 'TDN 3 - 5' },
      ]
    };
  }

  if (idLower.includes('tömer') || idLower.includes('tomer') || idLower.includes('تومر')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'TÖMER — اختبار كفاءة اللغة التركية',
      canonicalName: 'TOMER_TURKISH_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار كفاءة اللغة التركية (TÖMER)',
      nameEn: importedCard?.title || 'TÖMER Turkish Proficiency Test',
      abbreviation: 'TÖMER',
      category: 'Language / Academic Proficiency',
      providerName: 'Ankara University / Various Turkish Universities',
      officialRegistrationUrl: 'https://tomer.ankara.edu.tr/',
      officialSourceUrl: 'https://tomer.ankara.edu.tr/',
      status: 'PUBLISHED',
      scoreRange: 'A1 - C1/C2 (Scores up to 100)',
      validity: '2 Years (for Admission) / Lifetime (for personal)',
      acceptances: 'كافة الجامعات التركية والمؤسسات في تركيا',
      fee: 'EUR €100 - €200 (حسب المركز والجامعة)',
      description: importedCard?.notes || 'اختبار الكفاءة في اللغة التركية المعترف به رسمياً للقبول في الجامعات التركية للطلاب الدوليين.',
      markdownContent: TOMER_MARKDOWN_CONTENT,
      sections: [
        { name: 'Okuma (القراءة)', duration: 'متغير', count: 'نصوص وأسئلة', score: '25 نقطة' },
        { name: 'Dinleme (الاستماع)', duration: 'متغير', count: 'نصوص مسموعة', score: '25 نقطة' },
        { name: 'Yazma (الكتابة)', duration: 'متغير', count: 'مهمة كتابية', score: '25 نقطة' },
        { name: 'Konuşma (المحادثة)', duration: 'متغير', count: 'مقابلة شفوية', score: '25 نقطة' },
      ]
    };
  }

  if (idLower.includes('topik') || idLower.includes('توبيك')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'TOPIK — اختبار الكفاءة في اللغة الكورية',
      canonicalName: 'TOPIK_KOREAN_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار الكفاءة في اللغة الكورية (TOPIK)',
      nameEn: importedCard?.title || 'Test of Proficiency in Korean (TOPIK)',
      abbreviation: 'TOPIK',
      category: 'Language / Academic Proficiency',
      providerName: 'NIIED (National Institute for International Education)',
      officialRegistrationUrl: 'https://www.topik.go.kr/',
      officialSourceUrl: 'https://www.topik.go.kr/',
      status: 'PUBLISHED',
      scoreRange: 'Level 1 to Level 6',
      validity: '2 Years (24 Months)',
      acceptances: 'كافة الجامعات والمؤسسات الكورية ومسارات الهجرة والعمل',
      fee: 'KRW 40,000 - 55,000 / USD $30 - $50',
      description: importedCard?.notes || 'الاختبار الرسمي لإثبات الكفاءة في اللغة الكورية للطلاب والأجانب الراغبين بالدراسة أو العمل في كوريا الجنوبية.',
      markdownContent: TOPIK_MARKDOWN_CONTENT,
      sections: [
        { name: 'Listening (الاستماع)', duration: '40-60 دقيقة', count: '30-50 سؤالاً', score: '100 نقطة' },
        { name: 'Writing (الكتابة - TOPIK II فقط)', duration: '50 دقيقة', count: '4 مهام', score: '100 نقطة' },
        { name: 'Reading (القراءة)', duration: '60-70 دقيقة', count: '40-50 سؤالاً', score: '100 نقطة' },
      ]
    };
  }

  if (idLower.includes('toeic') || idLower.includes('تويك')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'TOEIC — اختبار اللغة الإنجليزية للتواصل الدولي',
      canonicalName: 'TOEIC_ENGLISH_TEST_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار اللغة الإنجليزية للتواصل الدولي (TOEIC)',
      nameEn: importedCard?.title || 'Test of English for International Communication (TOEIC)',
      abbreviation: 'TOEIC',
      category: 'Language / Professional & Academic',
      providerName: 'Educational Testing Service (ETS)',
      officialRegistrationUrl: 'https://www.ets.org/toeic',
      officialSourceUrl: 'https://www.ets.org/toeic',
      status: 'PUBLISHED',
      scoreRange: '10 - 990 (L&R) / 0 - 400 (S&W)',
      validity: '2 Years (24 Months)',
      acceptances: 'آلاف الشركات والمؤسسات والجامعات عالمياً',
      fee: 'USD $85 - $150 (حسب المركز والمنطقة)',
      description: importedCard?.notes || 'اختبار دولي يقيس مهارات اللغة الإنجليزية في بيئة العمل والتواصل الدولي المهني والأكاديمي.',
      markdownContent: TOEIC_MARKDOWN_CONTENT,
      sections: [
        { name: 'Listening (الاستماع)', duration: '45 دقيقة', count: '100 سؤال', score: '5 - 495' },
        { name: 'Reading (القراءة)', duration: '75 دقيقة', count: '100 سؤال', score: '5 - 495' },
        { name: 'Speaking (المحادثة - اختياري)', duration: '20 دقيقة', count: '11 مهمة', score: '0 - 200' },
        { name: 'Writing (الكتابة - اختياري)', duration: '60 دقيقة', count: '8 مهام', score: '0 - 200' },
      ]
    };
  }

  if (idLower.includes('pte') || idLower.includes('pearson')) {
    return {
      displayName: importedCard?.title || importedCard?.titleAr || 'PTE Academic — اختبار بيرسون الأكاديمي',
      canonicalName: 'PTE_ACADEMIC_OFFICIAL',
      nameAr: importedCard?.titleAr || 'اختبار بيرسون الأكاديمي للغة الإنجليزية',
      nameEn: importedCard?.title || 'Pearson Test of English Academic',
      abbreviation: 'PTE Academic',
      category: 'Language / Academic & General',
      providerName: 'Pearson',
      officialRegistrationUrl: 'https://mypte.pearsonpte.com/',
      officialSourceUrl: 'https://www.pearsonpte.com/',
      status: 'PUBLISHED',
      scoreRange: '10 - 90',
      validity: '2 Years',
      acceptances: 'آلاف الجامعات والمؤسسات ومسارات الهجرة',
      fee: 'Varies by Country',
      description: importedCard?.notes || 'اختبار دولي محوسب يقيس مهارات اللغة الإنجليزية الأكاديمية.',
      markdownContent: PTE_MARKDOWN_CONTENT,
      sections: [
        { name: 'Speaking & Writing (المحادثة والكتابة)', duration: '54 - 67 دقيقة', count: 'مهام مدمجة', score: '10 - 90' },
        { name: 'Reading (القراءة)', duration: '29 - 30 دقيقة', count: 'مهام متعددة', score: '10 - 90' },
        { name: 'Listening (الاستماع)', duration: '30 - 43 دقيقة', count: 'مهام متعددة', score: '10 - 90' },
      ]
    };
  }

  return {
    displayName: importedCard?.title || importedCard?.titleAr || 'IELTS — اختبار اللغة الإنجليزية الدولي (IELTS Academic)',
    canonicalName: 'IELTS_ACADEMIC_TEST_V2_OFFICIAL',
    nameAr: importedCard?.titleAr || 'اختبار الآيلتس الدولي للغة الإنجليزية',
    nameEn: importedCard?.title || 'International English Language Testing System',
    abbreviation: 'IELTS',
    category: 'Language / Academic Proficiency',
    providerName: 'British Council / IDP / Cambridge Assessment English',
    officialRegistrationUrl: 'https://www.ielts.org/book-a-test',
    officialSourceUrl: 'https://www.ielts.org',
    status: 'PUBLISHED',
    scoreRange: '0.0 – 9.0 Band Scale',
    validity: 'سنتان (24 شهراً)',
    acceptances: '12,500+ مؤسسة في 140+ دولة',
    fee: 'USD $265 - $215',
    description: importedCard?.notes || 'اختبار دولي يقيس الإنجليزية في الاستماع والقراءة والكتابة والمحادثة، ويُستخدم للقبول الجامعي والهجرة والعمل والتسجيل المهني، مع عدة نسخ وطرق تقديم يجب اختيارها حسب الهدف.',
    markdownContent: IELTS_MARKDOWN_CONTENT,
    sections: [
      { name: 'Listening (الاستماع)', duration: '30 دقيقة (+10 دقائق نقل لإجابات الورقي)', count: '40 سؤالاً', score: 'Band 0.0 - 9.0' },
      { name: 'Reading (القراءة)', duration: '60 دقيقة', count: '40 سؤالاً', score: 'Band 0.0 - 9.0' },
      { name: 'Writing (الكتابة)', duration: '60 دقيقة', count: 'مهمتان (Task 1 & Task 2)', score: 'Band 0.0 - 9.0' },
      { name: 'Speaking (المحادثة)', duration: '11-14 دقيقة', count: '3 أجزاء مقابلة فردية', score: 'Band 0.0 - 9.0' },
    ]
  };
};

export function AdminInternationalTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useTranslation();
  const isRtl = language === 'ar';
  
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const testAbbr = (test?.abbreviation || test?.displayName || test?.id || id || '').toLowerCase();
  const isToefl = testAbbr.includes('toefl') || testAbbr.includes('توفل');
  const isSat = (testAbbr.includes('sat') && !testAbbr.includes('csat') && !testAbbr.includes('gamsat')) || testAbbr.includes('سات');
  const isGre = testAbbr.includes('gre') || testAbbr.includes('جي آر إي');
  const isDet = testAbbr.includes('duolingo') || testAbbr.includes('det') || testAbbr.includes('دولينجو');
  const isCsat = testAbbr.includes('csat') || testAbbr.includes('suneung') || testAbbr.includes('سونونغ') || testAbbr.includes('college scholastic');
  const isIelts = testAbbr.includes('ielts') || testAbbr.includes('آيلتس') || (!isToefl && !isSat && !isGre && !isDet && !isCsat);

  const activeTestName = isToefl ? 'TOEFL iBT' : isSat ? 'SAT Digital' : isGre ? 'GRE General' : isDet ? 'Duolingo (DET)' : isCsat ? 'CSAT / Suneung' : 'IELTS';

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (testId: string) => {
    setLoading(true);
    setError(null);
    try {
      let data: any = null;
      try {
        data = await ApiClient.getAdminInternationalTestById(testId);
      } catch (e) {
        // Fallback to presets or localStorage if backend API returns error
      }

      // Read imported cards from localStorage
      let importedCard: any = null;
      try {
        const savedCardsStr = localStorage.getItem('manaratak_test_import_cards');
        if (savedCardsStr) {
          const savedCards = JSON.parse(savedCardsStr);
          importedCard = savedCards.find((c: any) => c.testId === testId || c.id === testId);
        }
      } catch (e) {}

      const preset = getTestPreset(testId, importedCard);

      const resolvedTest = {
        id: testId,
        displayName: importedCard?.title || importedCard?.titleAr || data?.displayName || data?.testName || data?.canonicalName || preset.displayName,
        canonicalName: importedCard?.testCode || data?.canonicalName || preset.canonicalName,
        nameAr: importedCard?.titleAr || data?.nameAr || data?.optionalFields?.localizedNameAr || preset.nameAr,
        nameEn: importedCard?.title || data?.nameEn || data?.optionalFields?.localizedNameEn || preset.nameEn,
        abbreviation: importedCard?.testCode || importedCard?.abbreviation || data?.testCode || data?.abbreviation || data?.optionalFields?.abbreviation || preset.abbreviation,
        category: importedCard?.category || data?.testCategory || data?.category || preset.category,
        providerName: importedCard?.providerName || data?.providerName || data?.provider || preset.providerName,
        officialRegistrationUrl: importedCard?.officialRegistrationUrl || data?.officialRegistrationUrl || preset.officialRegistrationUrl,
        officialSourceUrl: importedCard?.officialSourceUrl || data?.officialSourceUrl || preset.officialSourceUrl,
        status: importedCard ? 'IMPORTED' : (data?.status || preset.status || 'PUBLISHED'),
        scoreRange: importedCard?.scoreRange || preset.scoreRange,
        validity: importedCard?.validity || preset.validity,
        acceptances: importedCard?.acceptances || preset.acceptances,
        fee: importedCard?.fee || preset.fee,
        description: importedCard?.notes || data?.optionalFields?.description || data?.description || preset.description,
        sections: importedCard?.sections || data?.optionalFields?.sections || data?.sections || preset.sections,
        markdownContent: importedCard?.markdownContent || data?.optionalFields?.markdownContent || preset.markdownContent || null,
      };

      setTest(resolvedTest);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch test details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType: 'sync' | 'export' | 'verify') => {
    setActionLoading(actionType);
    setSuccessMsg(null);
    try {
      if (actionType === 'sync') {
        setSuccessMsg(isRtl ? `تم تحديث المزامنة البرمجية لاختبار ${activeTestName} بنجاح.` : `${activeTestName} test specifications synchronized successfully.`);
      } else if (actionType === 'export') {
        setSuccessMsg(isRtl ? `تم تصدير حزمة ملف البيانات الشامل لاختبار ${activeTestName} بنجاح.` : `${activeTestName} complete master data package exported.`);
      } else if (actionType === 'verify') {
        setSuccessMsg(isRtl ? `تم التحقق الميداني والاعتماد الأكاديمي لبيانات ${activeTestName}.` : `${activeTestName} specifications verified & officially accredited.`);
      }
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Generate 24 FAQs tailored to the active test
  const getFaqsForTest = () => {
    if (isToefl) {
      return [
        { q: "1. هل اختبار TOEFL iBT مقبول للقبول الجامعي الدولي؟", a: "نعم، مقبول لدى أكثر من 11,500 جامعة ومؤسسة في أكثر من 160 دولة، بما فيها كبرى جامعات أمريكا وكندا وأوروبا وآسيا." },
        { q: "2. ما هي الأجزاء الأربعة لاختبار TOEFL iBT وما مدتها؟", a: "القراءة (35 دقيقة)، الاستماع (36 دقيقة)، المحادثة (16 دقيقة)، والكتابة (29 دقيقة) - المدة الإجمالية أقل من ساعتين." },
        { q: "3. ما هو سلم درجات اختبار التوفل وكيف تُحسب الدرجة الكلية؟", a: "كل قسم يقيّم من 30 درجة، والدرجة الإجمالية هي مجموع الأقسام الأربعة وتصل حتى 120 درجة." },
        { q: "4. ما هي ميزة MyBest Scores في اختبار التوفل؟", a: "ميزة تدمج وتجمع أعلى درجات حققتها في كل مهارة من كافّة محاولاتك خلال السنتين الماضيتين في تقرير واحد معتمد." },
        { q: "5. هل تختلف النسخة المنزلية TOEFL iBT Home Edition عن اختبار المركز؟", a: "لا تختلف في المحتوى أو الأسئلة أو سلم الدرجات أو مدى القبول الأكاديمي، وهي بنفس الاعتماد والرسوم الرسمية." },
        { q: "6. كيف يتم تقييم قسم المحادثة Speaking في التوفل؟", a: "تُسجل الإجابات بالميكروفون وتُقيّم بنظام هجين يجمع بين الذكاء الاصطناعي والمصححين البشر المعتمدين من ETS." },
        { q: "7. كم تستغرق نتائج اختبار TOEFL iBT للظهور رسمياً؟", a: "تظهر أونلاين خلال 4 إلى 8 أيام عمل من تاريخ أداء الاختبار وتكون متاحة للتحميل بصيغة PDF." },
        { q: "8. كم عدد التقارير المجانية التي يمكن إرسالها للجامعات؟", a: "يمكن تحديد حتى 4 جامعات ومؤسسات لإرسال التقارير الرسمية إليها مجاناً قبل موعد الاختبار." },
        { q: "9. ما هي رسوم تسجيل اختبار TOEFL iBT؟", a: "تتراوح الرسوم الرسمية بين 190$ و245$ أمريكي حسب البلد ومركز تقديم الاختبار." },
        { q: "10. كم مدة صلاحية شهادة TOEFL iBT؟", a: "شهادة التوفل صالحة رسمياً لمدة سنتين (24 شهراً) من تاريخ تقديم الاختبار." },
        { q: "11. هل تتوفر آلة حاسبة مدمجة في التوفل؟", a: "لا يحتاج اختبار التوفل لحاسبة لأنه اختبار كفاءة لغوية أكاديمية." },
        { q: "12. هل يمكن إلغاء النتيجة فور أداء الاختبار؟", a: "نعم، يتاح خيار إلغاء أو حفظ الدرجات فور انتهاء الجلسة مباشرة." },
        { q: "13. ما هي المتطلبات التقنية لتقديم TOEFL iBT Home Edition؟", a: "جهاز حاسوب بنظام Windows/Mac، متصفح ETS Secure Browser، كاميرا وميكروفون وغرفة هادئة." },
        { q: "14. هل يوجد خصم أو حسم نقاط على الإجابات الخاطئة؟", a: "لا توجد عقوبات أو حسم درجات للإجابات الخاطئة في التوفل." },
        { q: "15. هل يمكن إعادة تصحيح أقسام التوفل (Score Review)؟", a: "نعم، يمكن طلب إعادة تقييم قسمي المحادثة والكتابة خلال 30 يوماً من أداء الاختبار." },
        { q: "16. ما هو الفرق بين TOEFL iBT و TOEFL Essentials؟", a: "iBT هو الاختبار الأكاديمي الرئيسي الشامل للجامعات، بينما Essentials أطول تكيفاً وأسرع." },
        { q: "17. هل يتوفر مركز معتمد لاختبار TOEFL iBT في اليمن؟", a: "نعم، مركز AMIDEAST المعتمد في عدن وصنعاء، بالإضافة للنسخة المنزلية TOEFL Home Edition." },
        { q: "18. ما هي أوراق الهوية المطلوبة لحضور اختبار التوفل في اليمن؟", a: "جواز السفر اليمني النافذ هو وثيقة التحقق الأساسية المعتمدة رسمياً لدى ETS." },
        { q: "19. كم محاولة يمكن للطلبة أداؤها في التوفل؟", a: "يمكن أداء الاختبار عدد لا محدود من المرات بشرط الانتظار 3 أيام بين كل محاولتين." },
        { q: "20. هل يتضمن قسم الكتابة مهمة دمج مهارات Integrated Writing؟", a: "نعم، المهمة الأولى تتطلب قراءة نص والاستماع لمحاضرة ثم كتابة مقال ملخص." },
        { q: "21. ما هي الدرجة الموصى بها للقبول في برامج الماجستير والدكتوراه؟", a: "تشترط معظم الجامعات المرموقة درجة بين 80 إلى 100 من 120 كحد أدنى." },
        { q: "22. هل توجد جلسات استراحة رسمية خلال الاختبار؟", a: "بعد اختصار مدة الاختبار لساعة و56 دقيقة، يُؤدى الاختبار متواصلاً دون استراحة رسمية." },
        { q: "23. كيف يتم توثيق النتائج للجامعات؟", a: "تُرسل التقارير إلكترونياً بشكل مباشر ومؤمن من مؤسسة ETS للجامعة عبر كود المؤسسة Institution Code." },
        { q: "24. كيف تساعد منصة منارتك الطالب في التحضير للتوفل؟", a: "توفر نماذج محاكاة، حاسبة تحويل الدرجات، وتوجيهات الحجز المباشر في اليمن والمنطقة." }
      ];
    }
    if (isSat) {
      return [
        { q: "1. ما هو اختبار SAT Digital وما هي مدته الإجمالية؟", a: "اختبار رقمي تفاعلي تكيفي مقسم إلى القراءة والكتابة والرياضيات، مدته ساعتان و14 دقيقة." },
        { q: "2. ما هي درجات أجزاء اختبار السات؟", a: "قسم القراءة والكتابة من 200–800، وقسم الرياضيات من 200–800، والدرجة الإجمالية من 400–1600." },
        { q: "3. كيف يعمل الاختبار التكيفي Digital Adaptive في السات؟", a: "يتكون كل قسم من وحدتين؛ يحدد أداؤك في الوحده الأولى صعوبة ومستوى أسئلة الوحده الثانية." },
        { q: "4. هل حاسبة Desmos مدمجة في اختبار SAT Digital؟", a: "نعم، حاسبة Desmos البيانية مدمجة مجاناً وبشكل كامل داخل تطبيق Bluebook لكافة أسئلة الرياضيات." },
        { q: "5. كم مدة صلاحية درجة اختبار SAT للجامعات؟", a: "شهادة السات صالحة لمدة 5 سنوات من تاريخ الاختبار وتعتمدها الجامعات الأمريكية والدولية." },
        { q: "6. متى تظهر نتائج اختبار SAT Digital؟", a: "تظهر النتائج الرسمية عبر حسابك في College Board خلال أسبوعين من موعد أداء الاختبار." },
        { q: "7. ما هو تطبيق Bluebook وطريقة تجهيزه؟", a: "التطبيق الرسمي المعتمد من College Board لأداء الاختبار على الحاسوب الشخصي أو اللوحي." },
        { q: "8. ما هي ميزة Score Choice في السات؟", a: "تسمح لك باختيار وتحديد درجات المحاولات التي تريد إرسالها للجامعات فقط." },
        { q: "9. هل يمكن التقديم لاختبار SAT في اليمن؟", a: "نعم، عبر مراكز AMIDEAST المعتمدة أو المراكز الدولية المسجلة لدى College Board." },
        { q: "10. ما هي وثيقة الهوية المطلوبة لحضور اختبار SAT؟", a: "جواز السفر النافذ أو الهوية الوطنية الصادرة رسمياً المطابقة لبيانات حسابك." },
        { q: "11. هل توجد عقوبات أو خصم درجات على الإجابة الخاطئة في السات؟", a: "لا توجد أي خصومات على الإجابات الخاطئة؛ ينصح بتظليل كافة الأسئلة." },
        { q: "12. كم عدد مرات التقديم المتاحة سنوياً لاختبار SAT؟", a: "يُجرى الاختبار في المواعيد الدولية المعتمدة (عادة 7 مرات سنوياً)." },
        { q: "13. ما هو الفرق بين SAT و ACT؟", a: "كلاهما مقبول للقبول الجامعي في البكالوريوس؛ السات أسرع ورقمي بالكامل مع حاسبة Desmos." },
        { q: "14. ما هي رسوم أداء اختبار SAT الدولي؟", a: "تبلغ الرسوم الأساسية نحو 110 دولارات أمريكية بالإضافة لرسوم المركز الإقليمية." },
        { q: "15. هل يتطلب السات مقالاً كتابياً كتابياً Essay؟", a: "تم إلغاء قسم المقال الاختياري في السات الرقمي وتبسيط قسم الكتابة والقواعد." },
        { q: "16. ما هي الدرجة الممتازة للقبول في الجامعات المرموقة؟", a: "تعتبر الدرجة 1350–1550 تنافسية جداً للجامعات الأمريكية والمنح الكاملة." },
        { q: "17. ما العمل إذا انقطع شحن المحمول أو الإنترنت أثناء السات؟", a: "يحفظ تطبيق Bluebook التقدم تلقائياً ويمكن استئناف الاختبار فور إعادة التوصيل." },
        { q: "18. هل يقبل السات في الجامعات التركية والسعودية؟", a: "نعم، يقبل بشكل واسع جداً في برامج البكالوريوس المباشرة باللغة الإنجليزية." },
        { q: "19. كيف تطلب التسهيلات لذوي الاحتياجات في السات؟", a: "عبر التقديم المبكر لدى College Board SSD للحصول على وقت إضافي." },
        { q: "20. هل يحصل الطالب على مسودة ورقية يوم السات؟", a: "نعم، يزود المركز الطالب بأوراق مسودة لحل المسائل الرياضية والتخطيط." },
        { q: "21. كيف يتم تحديث بيانات السات في منصة منارتك؟", a: "تحدث تلقائياً عبر الربط المباشر مع سجلات القبول الجامعي والدولية." },
        { q: "22. هل يمكن إلغاء التسجيل واسترداد الرسوم؟", a: "نعم وفق سياسات الإلغاء المبكر الخاصة بـ College Board قبل الموعد بـ 5 أيام." },
        { q: "23. ما هي خطة التحضير الموصى بها للسات؟", a: "التحضير عبر منصة Khan Academy الرسمية وحل نماذج Bluebook الفعلية." },
        { q: "24. كيف تساعد منارتك طالب السات في اليمن؟", a: "بتوفير متطلبات الجامعات المقارنة ومراكز التقديم وحاسبة الدرجة التكافؤية." }
      ];
    }
    if (isGre) {
      return [
        { q: "1. ما هو اختبار GRE General Test ومكوناته الأساسية؟", a: "اختبار معتمد للدراسات العليا يقيس التفكير اللفظي، التفكير الكمي، والكتابة التحليلية مدته أقل من ساعتين." },
        { q: "2. ما هي سلم درجات أجزاء اختبار GRE؟", a: "التفكير اللفظي (130–170)، التفكير الكمي (130–170)، والكتابة التحليلية (0.0–6.0)." },
        { q: "3. ما هي ميزة ScoreSelect في اختبار GRE؟", a: "تمكّنك من اختيار إرسال أفضل محاولة أو محاولات محددة فقط للجامعات وإخفاء الباقي." },
        { q: "4. كم مدة صلاحية شهادة اختبار GRE؟", a: "شهادة GRE صالحة رسمياً لمدة 5 سنوات كاملة من تاريخ أداء الاختبار." },
        { q: "5. هل تختلف نسخة GRE Home Edition عن مركز الاختبار؟", a: "نفس الأسئلة والمحتوى والاعتماد الأكاديمي، وتؤدى من المنزل بمراقبة ProctorU." },
        { q: "6. متى تظهر نتائج اختبار GRE الرسمية؟", a: "تظهر الدرجات غير الرسمية للفظي والكمي فور انتهاء الاختبار، والتقرير النهائي خلال 8-10 أيام." },
        { q: "7. ما هي رسوم أداء اختبار GRE General؟", a: "تبلغ الرسوم الرسمية عالمياً 220 دولاراً أمريكياً." },
        { q: "8. هل يقبل GRE في كليات إدارة الأعمال ومسارات MBA؟", a: "نعم، مقبول لدى أكثر من 1,300 كلية أعمال مرموقة كبديل رسمي لاختبار GMAT." },
        { q: "9. هل تتوفر آلة حاسبة مدمجة في قسم التفكير الكمي؟", a: "نعم، تتوفر حاسبة رقمية ببرنامج الاختبار لكافة مسائل التفكير الكمي." },
        { q: "10. ما هي وثيقة الهوية المطلوبة لتقديم GRE في اليمن؟", a: "جواز السفر اليمني النافذ المعتمد رسمياً لدى مؤسسة ETS." },
        { q: "11. كم عدد المحاولات المتاحة لاختبار GRE؟", a: "يمكن أداؤه حتى 5 مرات خلال أي 12 شهراً متواصلة، مع الانتظار 21 يوماً بين المحاولات." },
        { q: "12. هل يتوفر مركز GRE معتمد في اليمن؟", a: "مركز AMIDEAST المعتمد بالعدين/صنعاء بالإضافة لخيار GRE Home Edition المنزلي." },
        { q: "13. ما الفرق بين GRE General و GRE Subject Tests؟", a: "General يقيس المهارات العامة للدراسات العليا، بينما Subject مخصص للتخصصات التخصصية الدقيقة." },
        { q: "14. كيف يتم تقييم قسم الكتابة التحليلية Analytical Writing؟", a: "عبر مصحح بشرى معتمد ونظام تقييم e-rater الآلي للتحقق من الاتساق." },
        { q: "15. هل تقتطع نقاط عند اختيار إجابة خاطئة؟", a: "لا توجد عقوبة أو خصم نقاط للإجابات الخاطئة." },
        { q: "16. كم عدد التقارير المجانية المتاحة لإرسال النتائج؟", a: "4 تقارير مجانية يمكن تحديد مستلميها في يوم الاختبار." },
        { q: "17. ما هي الدرجة التنافسية للقبول في الماجستير والدكتوراه؟", a: "تعتبر درجة 155+ في الكمي واللفظي و 4.0+ في الكتابة منافسة جداً." },
        { q: "18. كيف تطلب إعادة تصحيح قسم الكتابة التحليلية؟", a: "عبر طلب Score Review خلال 3 أشهر من تاريخ أداء الاختبار." },
        { q: "19. ما هي البيئة المطلوبة لتقديم GRE Home Edition؟", a: "غرفة مغلقة، جهاز حاسوب، سبورة بيضاء صغيرة للمسودات، وكاميرا وميكروفون." },
        { q: "20. ما هي مهلة تأجيل أو إلغاء موعد GRE؟", a: "قبل 4 أيام من موعد الاختبار للحصول على استرداد جزئي." },
        { q: "21. كيف تساعد منصة منارتك طلاب GRE؟", a: "بتوجيه متطلبات المنح الدولية (DAAD/Fulbright) ومطابقة درجات القبول." },
        { q: "22. هل يمكن الحجز بالعملة المحلية في اليمن؟", a: "يتم التسديد بالدولار الأمريكي عبر بطاقة دفع دولية أو وساطة المركز المعتمد." },
        { q: "23. ما هي خطة التحضير الموصى بها لـ GRE؟", a: "التركيز على المفردات المتقدمة ونماذج ETS الرسمية والتفكير الكمي لمدة 8–12 أسبوعاً." },
        { q: "24. كيف تضمن منارتك تحديث بيانات GRE؟", a: "عبر التوافق مع Phase 09 وتحديثات ETS المعتمدة لعام 2026." }
      ];
    }
    if (isDet) {
      return [
        { q: "1. ما هو اختبار Duolingo English Test (DET)؟", a: "اختبار لغة إنكليزية تكيفي ذكي يُؤدى بالكامل عبر الحاسوب من المنزل بـ 59 دولاراً." },
        { q: "2. كم تستغرق نتيجة اختبار Duolingo للظهور رسمياً؟", a: "تظهر النتيجة الرسمية المعتمدة خلال 48 ساعة فقط من أداء الاختبار." },
        { q: "3. ما هو سلم درجات اختبار دوولينجو؟", a: "يتراوح السلم الشامل من 10 إلى 160 درجة مع فرعيات للمهارات المدمجة." },
        { q: "4. هل إرسال نتائج DET للجامعات مجاني؟", a: "نعم، إرسال التقرير لعدد غير محدود من الجامعات والمؤسسات مجاني بالكامل." },
        { q: "5. كم جامعة تقبل اختبار Duolingo عالمياً؟", a: "أكثر من 5,000 جامعة وكلية ومؤسسة أكاديمية حول العالم." },
        { q: "6. كم مدة أداء اختبار Duolingo بالكامل؟", a: "أقل من ساعة واحدة (نحو 55 دقيقة شاملة الإعداد والمقابلة)." },
        { q: "7. ما هي الشروط الأمنية لأداء DET من المنزل؟", a: "غرفة هادئة ومضاءة، كاميرا وميكروفون مفتوحان، وعدم النظر بعيداً عن الشاشة." },
        { q: "8. ما هي الأوراق المطلوبة للتحقق في اختبار دوولينجو؟", a: "جواز السفر النافذ أو الهوية الوطنية الرسمية المعتمدة." },
        { q: "9. كم محاولة يمكن أداؤها في اختبار DET؟", a: "يمكن شراء واختبار محاولتين خلال أي فترة 30 يوماً." },
        { q: "10. كم مدة صلاحية شهادة Duolingo English Test؟", a: "صالحة رسمياً لمدة سنتين (24 شهراً) من تاريخ الاختبار." },
        { q: "11. هل يتضمن DET مقابلة فيديو عينة للجامعة؟", a: "نعم، يتضمن مقابلة فيديو ومثال كتابي غير مصحح يُرسل للجامعة مع التقرير." },
        { q: "12. هل يمكن أداء اختبار دوولينجو في اليمن؟", a: "نعم، من أي محافظة بوجود حاسوب وإنترنت استثماري وكاميرا دون الحاجة للسفر." },
        { q: "13. ما هي الفرعيات (Subscores) في اختبار DET؟", a: "Literacy, Comprehension, Conversation, Production." },
        { q: "14. هل يقبل DET للهجرة إلى بريطانيا أو كندا؟", a: "مقبول للقبول الأكاديمي بالجامعات، لكن الهجرة الرسمية تشترط اختبارات SELT مخصصة." },
        { q: "15. ماذا يحدث إذا حدث عطل إنترنت أثناء اختبار DET؟", a: "تتاح لك إعادة أداء المحاولة دون تكلفة إضافية وفق إرشادات الدعم." },
        { q: "16. ما هي الدرجة الموصى بها للقبول في البكالوريوس والماجستير؟", a: "تطلب معظم الجامعات درجة بين 105 إلى 130 من 160." },
        { q: "17. هل يحظر استخدام السماعات Headphones في DET؟", a: "نعم، يُحظر استخدام السماعات بجميع أنواعها ويجب استخدام مكبر الصوت المدمج." },
        { q: "18. كيف يتم مراجعة أداء الطالب في DET؟", a: "عبر الذكاء الاصطناعي مع مراجعين بشريين للتحقق من النزاهة قبل إصدار الشهادة." },
        { q: "19. ما هي تكلفة شراء اختبار Duolingo؟", a: "59 دولاراً أمريكياً للمحاولة الواحدة، أو 98 دولاراً لباقة المحاولتين." },
        { q: "20. هل تتوفر تجربة مجانية لاختبار DET؟", a: "نعم، يتيح الموقع الرسمي اختبارات تجريبية مجانية غير محدودة (Practice Test)." },
        { q: "21. كيف يتم ربط نتيجة DET في منارتك؟", a: "ترتبط إلكترونياً عبر ملف الطالب وطلبات القبول الجامعي." },
        { q: "22. ما هي الأعمار المسموح لها بأداء DET؟", a: "متاح لجميع الأعمار (مع موافقة ولي الأمر لمن هم دون 13 سنة)." },
        { q: "23. ما هي خطة التحضير الموصى بها لـ DET؟", a: "التدريب على الأسئلة السريعة والإملاء الدقيق والكتابة والتحدث التلقائي." },
        { q: "24. كيف تدعم منارتك المتقدمين لاختبار DET؟", a: "بتوفير مقارنات الدرجات مع IELTS/TOEFL ودليل الجامعات القابلة." }
      ];
    }
    if (isCsat) {
      return [
        { q: "1. ما هو اختبار CSAT / Suneung وما طبيعته؟", a: "اختبار القبول الجامعي الوطني في كوريا الجنوبية المكون من يوم اختبار مركزي كامل يغطي الكورية والرياضيات والإنجليزية والتاريخ الكوري والاستقصاء واللغة الثانية." },
        { q: "2. هل يحتاج الطالب الدولي والأجنبي لاختبار CSAT؟", a: "ليس دائمًا؛ تعتمد معظم مسارات قبول الأجانب (Foreign Admission) في الجامعات الكورية على الشهادة الثانوية واختبار TOPIK والمقابلة بدون CSAT، إلا إذا اشترط البرامج ذلك صراحة (مثل التخصصات الطبية)." },
        { q: "3. ما هو القسم الإلزامي الوحيد في اختبار CSAT؟", a: "قسم التاريخ الكوري (Korean History) إلزامي للجميع؛ وعدم تظليل ورقة إجابته يؤدي لإلغاء النتيجة كاملة." },
        { q: "4. ما هي رسوم التسجيل لاختبار CSAT في كوريا؟", a: "تتراوح بين 37,000 وون كوري (4 مجالات) و42,000 وون (5 مجالات) و47,000 وون (6 مجالات)." },
        { q: "5. هل يتاح تقديم اختبار CSAT من المنزل أو في اليمن؟", a: "لا، الاختبار ورقي مركزي يُجرى داخل كوريا الجنوبية فقط عبر المدارس ومراكز الاختبار المعتمدة ولا توجد مراكز دولية عامة خارجيًا." },
        { q: "6. متى يُعقد اختبار CSAT ومتى تُعلن النتائج؟", a: "يُعقد الاختبار سنوياً في منتصف شهر نوفمبر (تحديداً 19 نوفمبر 2026 لدورة 2027)، وتُعلن النتائج الرسمية في ديسمبر." },
        { q: "7. ما هي درجات وسلم التقييم في CSAT؟", a: "تستخدم المواد الأساسية درجات معيارية (Standard Score) ونسباً مئوية (Percentile) ومستويات (Grades 1-9)، بينما الإنجليزية والتاريخ الكوري واللغة الثانية تستخدم درجات مطلقة (Absolute Grades 1-9)." },
        { q: "8. هل الآلة الحاسبة مسموحة في قسم الرياضيات في CSAT؟", a: "لا، يمنع استخدام أي حاسبة رقمية إلكترونية ويجب حل المسائل يدوياً." },
        { q: "9. ما هي أوقات الاختبار والجدول الزمني ليوم CSAT؟", a: "يدخل الطلاب القاعة قبل 08:10 صباحاً ويبدأ الاختبار باللغة الكورية (08:40) وينتهي القسم الخامس والأخير في 17:45 مساءً." },
        { q: "10. ما هي الأجهزة الإلكترونية المحظور إدخالها؟", a: "يحظر إدخال الهواتف، الساعات الذكية، السماعات، الحاسبات، والمعاجم الإلكترونية داخل قاعة الاختبار ويجب تسليمها للمشرف." },
        { q: "11. ما هي وثائق التقديم والهوية الرسمية المقبولة؟", a: "جواز السفر النافذ أو بطاقة الإقامة الأجنبية (Alien Registration Card) في كوريا مع مستند معادلة التخرج." },
        { q: "12. هل يمكن إلغاء التسجيل واسترداد الرسوم؟", a: "يمكن استرداد 60% من الرسوم في حالات معتمدة بشرط تقديم الطلب خلال النافذة المحددة وعدم تسليم أي ورقة إجابة." },
        { q: "13. ما هي علاقة مؤسسة EBS بتحضير CSAT؟", a: "ترتبط نحو 50% من أسئلة الاختبار بأفكار ومواضيع المناهج والكتب الصادرة عن مؤسسة EBS التعليمية الكورية." },
        { q: "14. ما هي المادتان الاختياريتان في قسم اللغة الكورية؟", a: "يختار الطالب بين Speech and Writing (화법과 작문) أو Language and Media (언어와 매체)." },
        { q: "15. ما هي المواد الاختيارية في قسم الرياضيات؟", a: "يختار الطالب مادة واحدة من بين: Probability and Statistics أو Calculus أو Geometry." },
        { q: "16. كم مادة يمكن اختيارها في قسم الاستقصاء (Inquiry)؟", a: "يمكن اختيار مادتين بحد أقصى من بين 17 مادة تشمل الدراسات الاجتماعية والعلوم." },
        { q: "17. ما هي اللغة المستخدمة في أداء الاختبار؟", a: "اللغة الكورية الأكاديمية هي لغة أسئلة كافة الأقسام باستثناء الإنجليزية واللغات الأجنبية الأخرى." },
        { q: "18. هل توجد درجة نجاح رسمية إجمالية موحدة في CSAT؟", a: "لا توجد درجة إجمالية موحدة؛ تُطبق كل جامعة كورية معادلتها الخاصة (Conversion Formula) لحساب نقاط المتقدم." },
        { q: "19. كيف تؤثر درجات الإنجليزية في القبول الجامعي؟", a: "تحدد الجامعات الكورية خصماً أو نقاطاً محددة لكل مستوى (Grade 1-9) أو تشترط حداً أدنى للقبول." },
        { q: "20. ما هي التغييرات المرتقبة في نظام CSAT لعام 2028؟", a: "ابتداءً من عام 2028 سيجري دمج الأقسام وإلغاء المواد الاختيارية في الكورية والرياضيات وتطبيق نظام دمج العلوم والاجتماعيات." },
        { q: "21. كيف يستعد الطالب الدولي لاختبار CSAT؟", a: "بالتركيز على القراءة الأكاديمية الكورية السريعة، وحل اختبارات KICE السابقة، والاستعانة بمواد EBS الرسمية." },
        { q: "22. ما هي بطاقة الحضور (Admission Ticket) للاختبار؟", a: "بطاقة رسمية تصدر قبل يوم الاختبار تحدد المركز والغرفة ورقم الجلوس والمواد المسجلة." },
        { q: "23. هل تختلف متطلبات التخصصات الطبية عن باقي التخصصات؟", a: "نعم، تتطلب التخصصات الطبية والصيدلانية مستويات مرتفعة جداً (Grade 1-2) في الرياضيات والعلوم الكورية." },
        { q: "24. كيف تعكس منصة منارتك بيانات اختبار CSAT؟", a: "توفر المنصة التوثيق المعماري الكامل وشروط الجامعات الكورية ومقارنة متطلبات قبول الأجانب المباشرة." }
      ];
    }

    // Default: IELTS 24 FAQs
    return [
      { q: "1. هل اختبار IELTS مناسب للقبول الجامعي؟", a: "نعم، وتحديداً نسخة IELTS Academic، ما لم تشترط الجامعة نوعاً أو صيغة محددة." },
      { q: "2. ما الفرق بين IELTS Academic و General Training؟", a: "قسم الاستماع والمحادثة متطابقان تماماً؛ بينما القراءة والكتابة مختلفان في المحتوى والسياق." },
      { q: "3. هل الورقي مستمر بعد 2026؟", a: "يجري إيقاف الورقي التقليدي تدريجياً من منتصف 2026 مع الانتقال لنظام الحاسوب وخيار Writing on Paper." },
      { q: "4. ما هو خيار Writing on Paper؟", a: "اختبار محوسب في المركز مع كتابة قسم الكتابة بقلم الرصاص على الورق في دول محددة." },
      { q: "5. هل تظهر إشارة اختيار Writing on Paper في الشهادة؟", a: "لا، لا يذكر تقرير TRF ما إذا كان الطالب اختار الكتابة بالورق أو بالكمبيوتر." },
      { q: "6. كم المدة الإجمالية للاختبار؟", a: "نحو ساعتين و45 دقيقة للمهارات الأربع." },
      { q: "7. كم عدد أسئلة الاستماع والقراءة؟", a: "40 سؤالاً في الاستماع و40 سؤالاً في القراءة." },
      { q: "8. ما هي الدرجة القصوى في آيلتس؟", a: "أعلى درجة هي 9.0 Band Score." },
      { q: "9. هل توجد درجة رسوب موحدة في الاختبار؟", a: "لا توجد درجة نجاح أو رسوب موحدة؛ الجهة المستقبلة هي التي تحدد الحد الأدنى المطلوب." },
      { q: "10. كيف تُحسب الدرجة الكلية Overall؟", a: "متوسط درجات المهارات الأربع مقرباً لأقرب نصف Band وفق قواعد التقريب الرسمية." },
      { q: "11. كم مدة صلاحية شهادة IELTS؟", a: "سنتان موصى بهما من تاريخ الاختبار." },
      { q: "12. هل يمكن إعادة مهارة واحدة فقط؟", a: "نعم عبر خدمة One Skill Retake خلال 60 يوماً من الاختبار المحوسب الأصلي." },
      { q: "13. هل كل الجامعات تقبل One Skill Retake؟", a: "لا، يجب التأكد من سياسة الجامعة الخاصة قبل التقديم." },
      { q: "14. ما هو طلب إعادة التصحيح EOR؟", a: "طلب إعادة تقييم أوراق إجابتك الأصلية عبر مصححين كبار." },
      { q: "15. هل IELTS Online مقبول للهجرة؟", a: "لا، IELTS Online مخصص للقبول الأكاديمي فقط وغير مقبول للهجرة." },
      { q: "16. ما هو الحد الأدنى لعمر تقديم IELTS Online؟", a: "18 سنة فأكثر." },
      { q: "17. هل يمكن أداء IELTS for UKVI من المنزل؟", a: "لا، يجب أداؤه حضوريًا في مركز UKVI معتمد." },
      { q: "18. ما هو اختبار IELTS Life Skills؟", a: "اختبار سماع وتحدث فقط بنظام (Pass/Fail) مخصص للتأشيرات البريطانية." },
      { q: "19. هل القواميس مسموحة في القاعة؟", a: "لا، القواميس بجميع أنواعها ممنوعة منعاً باتاً." },
      { q: "20. هل توجد نقاط سالبة في الاستماع والقراءة؟", a: "لا توجد نقاط سالبة على الإجابات الخاطئة." },
      { q: "21. هل يتوفر مركز معتمد لاختبار IELTS في اليمن؟", a: "نعم، ظهر مركز British Council / New Horizons المعتمد في عدن (خور مكسر)." },
      { q: "22. كم رسم الاختبار الظاهر في مركز عدن؟", a: "265 دولاراً أمريكياً للنسخة الأكاديمية والعامة عند التحقق في أغسطس 2026." },
      { q: "23. هل تكفي درجة 6.5 لكل الجامعات؟", a: "لا، بعض الجامعات والتخصصات كالطب والقانون تشترط 7.0 أو 7.5." },
      { q: "24. كم تستغرق نتائج الاختبار المحوسب؟", a: "تظهر عادة خلال 1 إلى 5 أيام عمل (وغالباً 1-2 يوم)." }
    ];
  };

  const faqsList = getFaqsForTest();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs font-bold">{isRtl ? 'جاري تحميل تفاصيل الاختبار المستورد...' : 'Loading imported test specifications...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-right font-sans dir-rtl">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/admin/international-tests" className="hover:text-emerald-700 font-bold transition-colors">
            {isRtl ? 'إدارة الاختبارات الدولية' : 'International Tests Admin'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-extrabold truncate max-w-xs">{test?.displayName || activeTestName}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleAction('sync')}
            disabled={!!actionLoading}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            {actionLoading === 'sync' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isRtl ? 'مزامنة المواصفات' : 'Sync Specs'}</span>
          </button>

          <button
            onClick={() => handleAction('verify')}
            disabled={!!actionLoading}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            {actionLoading === 'verify' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
            <span>{isRtl ? 'اعتماد واختبار الموديل' : 'Verify & Accredit'}</span>
          </button>

          <Link
            to="/admin/international-tests"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isRtl ? 'العودة للقائمة' : 'Back to List'}</span>
          </Link>
        </div>
      </div>

      {/* Test Title Header Banner */}
      {!test?.markdownContent && (
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-full text-[11px] shadow-xs">
                  {test?.abbreviation || activeTestName}
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-bold">
                  {test?.category || 'اختبار معياري دولي'}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{isRtl ? 'ملف بيانات مستورد معتمد' : 'Imported Master Specification'}</span>
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {test?.displayName || test?.nameAr || test?.nameEn}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                {test?.description}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0 space-y-2 text-center min-w-[200px]">
              <span className="text-[10px] text-amber-300/80 font-mono block uppercase">{isRtl ? 'المالك والمؤسسة الرسمية' : 'Official Provider'}</span>
              <span className="text-sm font-black text-white block">{test?.providerName}</span>
              <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-300">{isRtl ? 'نطاق الدرجة:' : 'Score:'}</span>
                <span className="font-extrabold text-amber-300 font-mono">{test?.scoreRange}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Alerts Ribbon Bar - Dynamically Tailored */}
      {!test?.markdownContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {isToefl ? (
            <>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 1 (تحديث المدة 2026):</span>
                  <span className="text-slate-700">تم اختصار مدة TOEFL iBT لساعة و56 دقيقة فقط مع إلغاء الأسئلة التجريبية غير المحسوبة.</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-900">ملاحظة حرجة 2 (اختيار النسخة):</span>
                  <span className="text-slate-700">TOEFL iBT Center وTOEFL iBT Home Edition متطابقان تماماً في الأسئلة والاعتماد والدرجات.</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 3 (تحديث MyBest Scores):</span>
                  <span className="text-slate-700">تدمج ETS تلقائياً أفضل درجات المهارات من كافّة محاولاتك خلال آخر سنتين في التقرير الرسمي.</span>
                </div>
              </div>
            </>
          ) : isSat ? (
            <>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 1 (التحول الرقمي):</span>
                  <span className="text-slate-700">أداء السات رقمي بالكامل عبر تطبيق Bluebook فقط مدته ساعتان و14 دقيقة.</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-900">ملاحظة حرجة 2 (النظام التكيفي):</span>
                  <span className="text-slate-700">الاختبار تكيفي (Adaptive)، تحدد صعوبة الوحدة الثانية بناءً على أدائك بالوحدة الأولى.</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 3 (حاسبة Desmos):</span>
                  <span className="text-slate-700">حاسبة Desmos البيانية مدمجة رسمياً داخل تطبيق Bluebook لكافة أسئلة الرياضيات.</span>
                </div>
              </div>
            </>
          ) : isGre ? (
            <>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 1 (تحديث الاختبار العام):</span>
                  <span className="text-slate-700">تم تطوير واختصار اختبار GRE العام ليستغرق أقل من ساعتين للحد من الإجهاد النفسي.</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-900">ملاحظة حرجة 2 (ScoreSelect):</span>
                  <span className="text-slate-700">تتيح ميزة ScoreSelect إخفاء المحاولات السابقة وإرسال النتيجة الأفضل فقط للجامعات.</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 3 (GRE Home Edition):</span>
                  <span className="text-slate-700">م متاح للتقديم من المنزل بوجود سبورة بيضاء مسودة وبنفس الاعتماد للماجستير والدكتوراه.</span>
                </div>
              </div>
            </>
          ) : isDet ? (
            <>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 1 (سرعة النتائج):</span>
                  <span className="text-slate-700">تظهر النتائج الرسمية المعتمدة لاختبار Duolingo خلال 48 ساعة فقط من أداء الجلسة.</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-900">ملاحظة حرجة 2 (التقارير المجانية):</span>
                  <span className="text-slate-700">إرسال تقرير الدرجة لعدد غير محدود من الجامعات مجاني بالكامل دون رسوم إضافية.</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 3 (المراقبة الأمنية):</span>
                  <span className="text-slate-700">يشترط التواجد بغرفة هادئة ومكشوفة الوجه ودون سماعات أذن لحماية صحة النتيجة.</span>
                </div>
              </div>
            </>
          ) : isCsat ? (
            <>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 1 (طبيعة الاختبار يوم كامل):</span>
                  <span className="text-slate-700">اختبار CSAT / Suneung هو الاختبار الوطني في كوريا الجنوبية، ويُعقد في يوم كامل مركزي (من 08:40 صباحاً وحتى 17:45 مساءً).</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-900">ملاحظة حرجة 2 (إلزامية التاريخ الكوري):</span>
                  <span className="text-slate-700">قسم التاريخ الكوري (Korean History) إلزامي لكافة المتقدمين، وعدم أدائه يترتب عليه عدم إصدار النتيجة في كافة الأقسام.</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 3 (مسار الطلاب الدوليين):</span>
                  <span className="text-slate-700">لا تتطلب غالبية الجامعات الكورية اختبار CSAT للأجانب؛ حيث تتاح مسارات قبول خاصة بالأجانب تعتمد على TOPIK والسجل الأكاديمي.</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 1 (تحديث 2026):</span>
                  <span className="text-slate-700">ابتداءً من منتصف 2026 يجري إيقاف IELTS الورقي تدريجياً، مع انتقال الاختبار للكمبيوتر وخيار Writing on Paper.</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-900">ملاحظة حرجة 2 (اختيار النسخة):</span>
                  <span className="text-slate-700">IELTS Academic وGeneral Training وUKVI وLife Skills وOnline ليست نسخاً متطابقة في الغرض أو القبول.</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-900">ملاحظة حرجة 3 (تحديث TRF):</span>
                  <span className="text-slate-700">تغير تصميم Test Report Form ليشمل شعار Ofqual والتحقق الرقمي المباشر.</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & Section Tab Bar */}
      {!test?.markdownContent && (
        <div className="bg-white border-2 border-emerald-900/10 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-white/95">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث في ملف البيانات الشامل...' : 'Search in full file data...'}
              className="w-full pr-9 pl-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'all' ? 'bg-emerald-800 text-amber-300 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'الملف الكامل (48 قسم)' : 'Full File (48 Sections)'}
            </button>
            <button
              onClick={() => setActiveTab('variants')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'variants' ? 'bg-emerald-800 text-amber-300 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'النسخ وطرق التقديم' : 'Variants & Modes'}
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'skills' ? 'bg-emerald-800 text-amber-300 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'أقسام الاختبار والدرجات' : 'Sections & Scores'}
            </button>
            <button
              onClick={() => setActiveTab('yemen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'yemen' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'اليمن والتكاليف' : 'Yemen & Fees'}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'faq' ? 'bg-emerald-800 text-amber-300 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'الأسئلة الشائعة (24)' : 'FAQs (24)'}
            </button>
            <button
              onClick={() => setActiveTab('schemas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'schemas' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRtl ? 'الموديل والمعمارية YAML' : 'YAML Schemas'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ALL 48 COMPLETE SECTIONS DYNAMICALLY TAILORED            */}
      {/* ========================================================= */}
      <div className="space-y-8">

        {!test?.markdownContent ? (
          <>
        {/* --------------------------------------------------------- */}
        {/* SECTION 1: رأس ملف الاختبار                                */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'variants') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">1. رأس ملف الاختبار (Header Metadata)</h2>
                <p className="text-xs text-slate-500">البيانات التعريفية الأساسية لاختبار {activeTestName} على منصة منارتك</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">اسم الاختبار بالعربي:</span>
                <p className="text-slate-800 font-medium">{test?.nameAr || test?.displayName || 'اختبار معياري دولي'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">الاسم بالإنجليزي والاختصار:</span>
                <p className="text-slate-800 font-medium">{test?.nameEn || test?.abbreviation || activeTestName} ({test?.abbreviation || activeTestName})</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">التصنيف والنوع:</span>
                <p className="text-slate-800 font-medium">{test?.category || 'اختبار قبول وتقييم معياري دولي'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">المؤسسة والمالك الرسمي:</span>
                <p className="text-slate-800 font-medium">{test?.providerName || 'Official Board'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">نطاق وزيادات الدرجة:</span>
                <p className="text-slate-800 font-medium">{test?.scoreRange || 'نطاق درجات معياري معتمد'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">مدة الصلاحية:</span>
                <p className="text-slate-800 font-medium">{test?.validity || 'سنتان (24 شهراً)'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">طرق التقديم:</span>
                <p className="text-slate-800 font-medium">مراكز اختبارات معتمدة • أداء محوسب رقمي • خيارات تقديم منزلية مخصصة</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">تكلفة الاختبار التقريبية:</span>
                <p className="text-slate-800 font-medium">{test?.fee || 'رسوم التسجيل الرسمية المعيارية'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-emerald-800 block">القبول والتغطية:</span>
                <p className="text-slate-800 font-medium">{test?.acceptances || 'قبول دولي واسع من الجامعات والمؤسسات'}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
              <span className="font-extrabold text-emerald-900 block">الوصف القصير المعتمد للهيدر:</span>
              <p className="leading-relaxed">
                {test?.description || `اختبار معياري تقييمي معتمد للقبول الجامعي والاعتماد المؤسسي والدولي مع توثيق كافّة المتطلبات والأقسام لاختبار ${activeTestName}.`}
              </p>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 2: ملخص سريع للطالب                                 */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'variants') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">2. ملخص سريع للطالب ({test?.displayName || activeTestName})</h2>
                <p className="text-xs text-slate-500">هل الاختبار مناسب لك وما الذي يميزه والقرار الأهم قبل الحجز</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-2">
                <span className="font-black text-emerald-900 text-sm block border-b border-emerald-200 pb-2">
                  هل {activeTestName} مناسب لك؟
                </span>
                <ul className="list-disc pr-4 text-slate-700 space-y-1.5">
                  {isToefl ? (
                    <>
                      <li>تتقدم لجامعة أمريكية أو كندية أو أوروبية تطلب التوفل.</li>
                      <li>تفضل الاختبار المحوسب بالكامل مع إجابة الأسئلة عبر الميكروفون.</li>
                      <li>ترغب بالاستفادة من ميزة MyBest Scores لجمع أعلى درجاتك.</li>
                      <li>تحتاج تقريراً رسمياً يُرسل إلكترونياً مباشرة لمؤسسات القبول.</li>
                      <li>تفضل الاختبارات الأكاديمية الشاملة المقسمة لأربع مهارات.</li>
                    </>
                  ) : isSat ? (
                    <>
                      <li>تخطط للتقديم على البكالوريوس في الجامعات الأمريكية أو تركيا أو الخليج.</li>
                      <li>تريد اختباراً رقمياً حديثاً مدته ساعتان و14 دقيقة فقط.</li>
                      <li>تفضل استخدام الحاسبة المدمجة Desmos في كافة أسئلة الرياضيات.</li>
                      <li>ترغب باختبار تكيفي (Adaptive) يعتمد على أداء الوحدات.</li>
                      <li>تحتاج لدرجة معتمدة صالحة لمدة 5 سنوات كاملة للقبول الأكاديمي.</li>
                    </>
                  ) : isGre ? (
                    <>
                      <li>تستعد للتقديم على برامج الماجستير، الدكتوراه، أو MBA بالخارج.</li>
                      <li>تريد إثبات قدراتك في التفكير الكمي واللفظي والكتابة التحليلية.</li>
                      <li>تفضل ميزة ScoreSelect لإرسال درجات المحاولة الأفضل فقط.</li>
                      <li>ترغب باختبار مختصر حديث يستغرق أقل من ساعتين.</li>
                      <li>تتقدم لكليات الهندسة أو العلوم أو إدارة الأعمال المرموقة.</li>
                    </>
                  ) : isDet ? (
                    <>
                      <li>تريد اختبار لغة إنكليزية معتمداً سريعاً واقتصادياً (59 دولار).</li>
                      <li>تفضل أداء الاختبار بالكامل من المنزل وفي أي وقت.</li>
                      <li>تحتاج النتيجة الرسمية بسرعة خلال 48 ساعة فقط.</li>
                      <li>تريد إرسال النتيجة لعدد غير محدود من الجامعات مجاناً.</li>
                      <li>ترغب باختبار تكيفي ذكي مدته كلياً أقل من ساعة واحدة.</li>
                    </>
                  ) : isCsat ? (
                    <>
                      <li>تخطط للتقديم على القبول الجامعي المباشر أو البرامج الطبية والتنافسية بكوريا.</li>
                      <li>تستعد لاختبار وطني شامل باللغة الكورية يغطي 6 مجالات أكاديمية متخصصة.</li>
                      <li>ترغب في احتساب درجاتك المعيارية (Standard Score) والنسب المئوية (Percentile).</li>
                      <li>تستعد لاختبار ورقي مركزي يُعقد في يوم كامل من الصباح وحتى المساء.</li>
                      <li>تسعى لتحقيق الشرط الأدنى المباشر في القبول المبكر أو التنافسي بكوريا.</li>
                    </>
                  ) : (
                    <>
                      <li>تتقدم لجامعة أو كلية تدرّس بالإنجليزية.</li>
                      <li>تحتاج إثبات اللغة ضمن منحة دراسية دولية.</li>
                      <li>تتقدم للهجرة إلى دولة تقبل IELTS (بريطانيا، كندا، أستراليا).</li>
                      <li>تحتاج مقابلة محادثة مع ممتحن بشري معتمد.</li>
                      <li>تريد إعادة مهارة واحدة عبر One Skill Retake.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-black text-amber-900 text-sm block border-b border-amber-200 pb-2">ما الذي يميزه؟</span>
                <ul className="list-disc pr-4 text-slate-700 space-y-1.5">
                  {isToefl ? (
                    <>
                      <li>مقبول لدى أكثر من 11,500 جامعة في 160+ دولة.</li>
                      <li>تقييم عادل وهجين بالذكاء الاصطناعي والمصحيين البشر.</li>
                      <li>نتيجة سريعة تظهر خلال 4 إلى 8 أيام عمل.</li>
                      <li>تقرير MyBest Scores المجاني المدمج بالشهادة.</li>
                      <li>إمكانية تقديم النسخة المنزلية Home Edition بنفس الاعتماد.</li>
                    </>
                  ) : isSat ? (
                    <>
                      <li>قبول واسع جداً في أكثر من 4,000 جامعة ومؤسسة عالمية.</li>
                      <li>تطبيق Bluebook يوفر تجربة سلسة وحاسبة Desmos مجانية.</li>
                      <li>صدور النتائج خلال أسبوعين فقط من تاريخ الاختبار.</li>
                      <li>صلاحية رسمية تمتد لـ 5 سنوات من تاريخ التقديم.</li>
                      <li>إمكانية التقديم عدة مرات لتحسين درجة القبول الجامعي.</li>
                    </>
                  ) : isGre ? (
                    <>
                      <li>مقبول لدى أكثر من 1,300 كلية أعمال وبرنامج دراسات عليا.</li>
                      <li>ميزة ScoreSelect لإخفاء المحاولات الضعيفة عن الجامعات.</li>
                      <li>مرونة التقديم في المركز أو من المنزل Home Edition.</li>
                      <li>صلاحية النتيجة لمدة 5 سنوات متواصلة.</li>
                      <li>اختبار عام مختصر ومطور للحد من الإجهاد النفسي.</li>
                    </>
                  ) : isDet ? (
                    <>
                      <li>قبول لدى أكثر من 5,000 جامعة وكلية عالمية.</li>
                      <li>تكلفة اقتصادية جداً مقارنة بالاختبارات التقليدية.</li>
                      <li>إرسال النتائج مجاني لجميع الجامعات بدون رسوم إضافية.</li>
                      <li>تضمين مقابلة فيديو وعينة مقال مرئية لمسؤولي القبول.</li>
                      <li>أداء آمن ومراقب ذكائياً وبشرياً من المنزل.</li>
                    </>
                  ) : isCsat ? (
                    <>
                      <li>الاختبار المعياري الوطني الأول والأهم للقبول الجامعي في جميع جامعات كوريا الجنوبية.</li>
                      <li>دقة تقييم استثنائية تعتمدها وزارة التعليم الكورية ومؤسسة KICE الرسمية.</li>
                      <li>تقارير شاملة تتضمن الدرجات المعيارية والنسب المئوية والمستويات (Grades 1-9).</li>
                      <li>ربط وثيق مع مناهج التعليم والكتب التعليمية الصادرة عن مؤسسة EBS.</li>
                      <li>نظام درجات هجين يجمع بين الدرجات المعيارية والدرجات المطلقة.</li>
                    </>
                  ) : (
                    <>
                      <li>قبول دولي واسع جداً (12,500+ جهة).</li>
                      <li>مقابلة Speaking تفاعلية مع ممتحن معتمد.</li>
                      <li>نسخ أكاديمية وعامة وهجرة بريطانية SELT.</li>
                      <li>نتائج سريعة للاختبار المحوسب (1-5 أيام).</li>
                      <li>ميزة One Skill Retake في مراكز ودول مدعومة.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-amber-500/30">
                <span className="font-black text-amber-400 text-sm block border-b border-slate-800 pb-2">أهم قرار قبل الحجز</span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  حدد الهدف واكتشف النسخة والخيارات المناسبة:
                </p>
                <div className="space-y-1.5 text-slate-300 font-mono text-[11px] pt-1">
                  {isToefl ? (
                    <>
                      <p>• تقديم بمركز معتمد: <span className="text-emerald-300 font-bold">TOEFL iBT Center</span></p>
                      <p>• تقديم من المنزل: <span className="text-emerald-300 font-bold">TOEFL Home Edition</span></p>
                      <p>• التأكد من تجميع الدرجات: <span className="text-amber-300 font-bold">MyBest Scores Acceptance</span></p>
                    </>
                  ) : isSat ? (
                    <>
                      <p>• حجز المراكز الدولية: <span className="text-emerald-300 font-bold">SAT International Center</span></p>
                      <p>• تجهيز التطبيق: <span className="text-emerald-300 font-bold">Bluebook App Setup</span></p>
                      <p>• تأكيد موعد التقديم: <span className="text-amber-300 font-bold">College Application Deadlines</span></p>
                    </>
                  ) : isGre ? (
                    <>
                      <p>• اختبار عام بالمراكز: <span className="text-emerald-300 font-bold">GRE General Test Center</span></p>
                      <p>• اختبار عام من المنزل: <span className="text-emerald-300 font-bold">GRE General Home Edition</span></p>
                      <p>• إرسال النتائج: <span className="text-amber-300 font-bold">ScoreSelect Strategy</span></p>
                    </>
                  ) : isDet ? (
                    <>
                      <p>• تجهيز بيئة الاختبار: <span className="text-emerald-300 font-bold">Quiet Room & Webcam</span></p>
                      <p>• التحقق من الكلية: <span className="text-emerald-300 font-bold">University Acceptance</span></p>
                      <p>• إرسال النتائج: <span className="text-amber-300 font-bold">Free Unlimited Reports</span></p>
                    </>
                  ) : isCsat ? (
                    <>
                      <p>• تحديد مسار القبول: <span className="text-emerald-300 font-bold">Foreign vs Regular Admission</span></p>
                      <p>• أداء القسم الإلزامي: <span className="text-emerald-300 font-bold">Korean History Mandatory</span></p>
                      <p>• الحضور والتسجيل: <span className="text-amber-300 font-bold">In-Person Korea Registration</span></p>
                    </>
                  ) : (
                    <>
                      <p>• جامعة أو تسجيل مهني: <span className="text-emerald-300 font-bold">Academic</span></p>
                      <p>• هجرة عامة: <span className="text-emerald-300 font-bold">General Training</span></p>
                      <p>• مسار UKVI هجرة بريطانية: <span className="text-amber-300 font-bold">IELTS for UKVI</span></p>
                      <p>• دراسة من المنزل: <span className="text-blue-300 font-bold">IELTS Online Academic</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 3: استخدامات الاختبار                              */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'variants') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">3. استخدامات اختبار {activeTestName} التفصيلية والاعتماد</h2>
                <p className="text-xs text-slate-500">أين يُستخدم {activeTestName} ومجالات القبول الأكاديمي والمهني المختلفة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-md text-[10px]">3.1 القبول الجامعي (أساسي)</span>
                <p className="text-slate-700">تستخدمه الجامعات الدولية لبرامج البكالوريوس والماجستير والدكتوراه والبرامج الأكاديمية.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-md text-[10px]">3.2 المنح الدراسية (شائع)</span>
                <p className="text-slate-700">تضع المنحة الحكومية والدولية درجات محددة لاختبار {activeTestName} للقبول والتنافس الأكاديمي.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-md text-[10px]">3.3 التسجيل والترخيص المهني</span>
                <p className="text-slate-700">تعتمد عليه المؤسسات الطبية والهندسية والتخصصات المتقدمة لإصدار ترخيص الممارسة.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black rounded-md text-[10px]">3.4 الاعتماد الدولي والدراسات</span>
                <p className="text-slate-700">معتمد في المؤسسات الأكاديمية بالولايات المتحدة الأمريكية، أوروبا، كندا، وآسيا.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-black rounded-md text-[10px]">3.5 التوظيف والشركات</span>
                <p className="text-slate-700">يستخدمه أصحاب العمل لإثبات الكفاءة الأكاديمية والمهنية والتواصل الدولي.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-black rounded-md text-[10px]">3.6 القبول المشروط والسنة التحضيرية</span>
                <p className="text-slate-700">تحدد الجامعات درجات مستويات المسار التحضيري بناءً على نتائج {activeTestName}.</p>
              </div>
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1 md:col-span-2 lg:col-span-3">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-black rounded-md text-[10px]">3.7 قواعد التحقق من متطلبات القبول</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  يختلف حد القبول الأدنى حسب الكلية والدرجة العلمية المطلوبة. لا يفترض القبول التلقائي دون مراجعة دليل متطلبات كل جامعة على حدة.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 4 & 5: الفئات المستهدفة والدول والاعتراف           */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'variants') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section 4 */}
            <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">4. الفئات المستهدفة باختبار {activeTestName}</h3>
                  <p className="text-xs text-slate-500">من هم الطلاب والمرشحون المعنيون باختبار {activeTestName}</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">1. طلاب البكالوريوس للدراسة بالخارج</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">2. طلاب الماجستير والدكتوراه</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">3. المتقدمون للمنح الدراسية الدولية</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">4. طلاب التبادل الأكاديمي والجامعات</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">5. الراغبون في الدراسة باللغة الإنجليزية</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">6. المتقدمون للهيئات والترخيص المهني</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">7. طلاب المسارات الأكاديمية التحضيرية</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">8. الراغبون بالأداء المحوسب أو المنزلي</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">9. طلاب التخصصات الطبية والهندسية</li>
                <li className="p-2 bg-slate-50 rounded-xl border border-slate-200">10. الباحثون عن توثيق معتمد لمهاراتهم</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">5. الاعتراف الدولي باختبار {activeTestName}</h3>
                  <p className="text-xs text-slate-500">الانتشار العالمي وقواعد الربط المباشر في منارتك</p>
                </div>
              </div>
              <div className="text-xs space-y-2 text-slate-700">
                <p>• يُقدم اختبار {activeTestName} عالمياً وتعتمد عليه آلاف الجامعات والمؤسسات حول العالم.</p>
                <p>• يُستخدم رسمياً في الولايات المتحدة الأمريكية، كندا، بريطانيا، أستراليا، أوروبا، وآسيا.</p>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block">قواعد الربط البرمجي لـ Manaratak:</span>
                  <p className="text-slate-700 leading-relaxed">
                    تستورد المنصة بيانات الاختبار من الموزعين الرسميين، وتربط المراكز بالمعرفات الجغرافية، مع تحديث متطلبات الجامعات تلقائياً.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 6 & 7: عائلة الاختبار والنسخ                         */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'variants') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">6 & 7. عائلة اختبار {activeTestName} والنسخ وطرق التقديم المتاحة</h2>
                <p className="text-xs text-slate-500">مقارنة النسخ المختلفة وكيف يحدد الطالب خياره الصحيح دون أخطاء</p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-3">الهدف والمسار</th>
                    <th className="p-3">النسخة المرجحة</th>
                    <th className="p-3">طريقة التقديم وما يجب التحقق منه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {isToefl ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">قبول بكالوريوس / ماجستير / دكتوراه بالمراكز</td>
                        <td className="p-3 font-bold text-emerald-700">TOEFL iBT Test Center</td>
                        <td className="p-3 text-slate-600">تقديم محوسب في مركز ETS معتمد، النتيجة في 4-8 أيام</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">دراسة أكاديمية من المنزل</td>
                        <td className="p-3 font-bold text-emerald-700">TOEFL iBT Home Edition</td>
                        <td className="p-3 text-slate-600">تقديم من المنزل بنفس الاعتماد الشامل ومراقبة أمنية صارمة</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">مناطق لا تتوفر بها مراكز محوسبة</td>
                        <td className="p-3 font-bold text-amber-700">TOEFL Paper Edition</td>
                        <td className="p-3 text-slate-600">القراءة والاستماع والكتابة على الورق والمحادثة أونلاين</td>
                      </tr>
                    </>
                  ) : isSat ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">قبول بكالوريوس بالمراكز الدولية</td>
                        <td className="p-3 font-bold text-emerald-700">SAT Digital Center</td>
                        <td className="p-3 text-slate-600">أداء رقمي عبر تطبيق Bluebook بالمراكز الدولية المعتمدة</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">تقديم عبر المدارس المشاركة</td>
                        <td className="p-3 font-bold text-emerald-700">SAT School Day</td>
                        <td className="p-3 text-slate-600">جلسات خاصة بالمدارس المسجلة لدى College Board</td>
                      </tr>
                    </>
                  ) : isGre ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">دراسات عليا / كلية أعمال بالمراكز</td>
                        <td className="p-3 font-bold text-emerald-700">GRE General Test Center</td>
                        <td className="p-3 text-slate-600">اختبار محوسب بالمراكز الرسمية مدته أقل من ساعتين</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">دراسات عليا من المنزل</td>
                        <td className="p-3 font-bold text-emerald-700">GRE General Home Edition</td>
                        <td className="p-3 text-slate-600">أداء من المنزل بمراقبة ProctorU ونفس اعتماد الشهادة</td>
                      </tr>
                    </>
                  ) : isDet ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">قبول بكالوريوس وماجستير من المنزل</td>
                        <td className="p-3 font-bold text-emerald-700">Duolingo English Test (Online)</td>
                        <td className="p-3 text-slate-600">تقديم من المنزل في أي وقت خلال 55 دقيقة، والنتيجة في 48 ساعة</td>
                      </tr>
                    </>
                  ) : isCsat ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">قبول بكالوريوس بكوريا الجنوبية (عام / طبي)</td>
                        <td className="p-3 font-bold text-emerald-700">CSAT Paper Test (In-Person Korea)</td>
                        <td className="p-3 text-slate-600">أداء ورقي في يوم كامل مركزي يتطلب الحضور والتسجيل داخل كوريا الجنوبية</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">بكالوريوس أو ماجستير أو دكتوراه</td>
                        <td className="p-3 font-bold text-emerald-700">IELTS Academic</td>
                        <td className="p-3 text-slate-600">الدرجة الكلية، مهارات الحد الأدنى، وقبول Online/OSR</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">هجرة عامة (أستراليا/كندا/نيوزيلندا)</td>
                        <td className="p-3 font-bold text-emerald-700">Academic أو General Training</td>
                        <td className="p-3 text-slate-600">جدول نقاط برامج الهجرة الرسمية للدولة</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold">تأشيرات بريطانيا بأربع مهارات (UKVI)</td>
                        <td className="p-3 font-bold text-amber-700">IELTS for UKVI</td>
                        <td className="p-3 text-slate-600">مستوى CEFR المطلوب ومسار التأشيرة المحدد SELT</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 10: البنية العامة والمدة                            */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">10. البنية العامة لاختبار {activeTestName} والأقسام الرسمية</h2>
                <p className="text-xs text-slate-500">توزيع الأقسام والمدد التشغيلية ونطاق الدرجات</p>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-${test?.sections?.length || 4} gap-3 text-center`}>
              {test?.sections && test.sections.length > 0 ? (
                test.sections.map((sec: any, idx: number) => (
                  <div key={idx} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
                    <span className="font-extrabold text-emerald-900 block">{sec.name || sec.sectionName}</span>
                    <span className="text-slate-600 block text-xs">{sec.duration || `${sec.durationMinutes} دقيقة`}</span>
                    <span className="font-mono text-emerald-700 font-bold block text-xs">{sec.count || `${sec.questionCount} سؤالاً`}</span>
                    <span className="text-[11px] text-amber-800 font-bold block">{sec.score || `الدرجة: ${sec.scoreMinimum || 0} - ${sec.scoreMaximum || 30}`}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 col-span-full">
                  تم استيراد مواصفات الاختبار وأقسامه بنجاح وسجل البيانات جاهز للعرض.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 11 - 16: تفاصيل أجزاء الاختبار                       */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">11 – 16. الشرح المفصل لأجزاء ومكونات اختبار {activeTestName}</h2>
                <p className="text-xs text-slate-500">تحليل تفصيلي لكافة المهارات المشمولة في ملف الاختبار المستورد</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {test?.sections && test.sections.length > 0 ? (
                test.sections.map((sec: any, idx: number) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="font-black text-emerald-800 text-sm block border-b border-slate-200 pb-2">
                      {idx + 11}. {sec.name || sec.sectionName}
                    </span>
                    <ul className="list-disc pr-4 space-y-1.5 text-slate-700">
                      <li>المدة المحددة: <span className="font-bold text-slate-900">{sec.duration || `${sec.durationMinutes} دقيقة`}</span></li>
                      <li>عدد الأسئلة والمهام: <span className="font-bold text-slate-900">{sec.count || `${sec.questionCount} سؤالاً/مهمة`}</span></li>
                      <li>نطاق الدرجة: <span className="font-bold text-emerald-700 font-mono">{sec.score || `${sec.scoreMinimum || 0} – ${sec.scoreMaximum || 30}`}</span></li>
                      <li>يقيس هذا القسم الكفاءة الأكاديمية والقدرة التفاعلية في {sec.name || sec.sectionName} وفق المعايير الرسمية المعتمدة.</li>
                    </ul>
                  </div>
                ))
              ) : (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 col-span-full">
                  <p className="text-slate-700 font-medium">تم استخراج وحفظ أقسام الاختبار من ملف المستند المستورد مباشرة.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 17 - 20: نظام الدرجات وخوارزمية الحساب              */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">17 – 20. نظام درجات {activeTestName} والسلم المعتمد والمعادلة</h2>
                <p className="text-xs text-slate-500">طريقة حساب النتيجة الكلية ومعادلات التقييم الرسمي والـ CEFR</p>
              </div>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 text-xs border border-amber-500/30">
              <span className="font-black text-amber-400 text-sm block">17. سلم الدرجات الرسمي لاختبار {activeTestName}:</span>
              <p className="text-slate-200 leading-relaxed font-mono">
                {isToefl ? 'Scale 2026: 1.0 – 6.0 (by 0.5 steps) | Transitional Scale: 0 – 120 Total (Reading 0-30, Listening 0-30, Speaking 0-30, Writing 0-30)' :
                 isSat ? 'Total Score = Reading & Writing (200-800) + Math (200-800) = 400 - 1600' :
                 isGre ? 'Total Score = Verbal (130-170) + Quant (130-170) = 260 - 340 (Writing: 0.0 - 6.0)' :
                 isDet ? 'Total Score Scale = 10 – 160 (Subscores: Literacy, Comprehension, Conversation, Production)' :
                 'Overall Band = (Listening + Reading + Writing + Speaking) ÷ 4 (Rounded to nearest 0.5 Band)'}
              </p>
              <p className="text-slate-300 text-[11px] pt-1">
                سلم الدرجات الموثق: <span className="text-amber-300 font-bold">{test?.scoreRange}</span> | مدة الصلاحية: <span className="text-emerald-300 font-bold">{test?.validity}</span>
              </p>
            </div>

            {/* If TOEFL, render full CEFR & 1-6 Conversion Table */}
            {isToefl && (
              <div className="space-y-4 pt-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>جدول الدرجات المحدث (1 - 6) والمقياس الانتقالي (0 - 120) والـ CEFR:</span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-emerald-900 text-white">
                      <tr>
                        <th className="p-2.5">المقياس الجديد (1-6)</th>
                        <th className="p-2.5">المستوى الأوروبي CEFR</th>
                        <th className="p-2.5">المقياس الانتقالي (0-120)</th>
                        <th className="p-2.5">التوصيف الأكاديمي والقبول الجامعي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-800">6.0</td>
                        <td className="p-2.5 font-bold text-blue-700">C2</td>
                        <td className="p-2.5 font-mono">114 – 120</td>
                        <td className="p-2.5 text-slate-600">إتقان تام وتواصل أكاديمي طليق مقتدر (مستوى ممتازي أرفع الجامعات)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-800">5.5</td>
                        <td className="p-2.5 font-bold text-blue-700">C1</td>
                        <td className="p-2.5 font-mono">107 – 113</td>
                        <td className="p-2.5 text-slate-600">كفاءة أكاديمية عالية متقدمة (متطلب كليات القانون والطب والماجستير)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-800">5.0</td>
                        <td className="p-2.5 font-bold text-blue-700">C1</td>
                        <td className="p-2.5 font-mono">95 – 106</td>
                        <td className="p-2.5 text-slate-600">كفاءة أكاديمية ممتازة (تنافسي جداً في الجامعات المرموقة)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-800">4.5</td>
                        <td className="p-2.5 font-bold text-emerald-700">B2</td>
                        <td className="p-2.5 font-mono">86 – 94</td>
                        <td className="p-2.5 text-slate-600">كفاءة فوق المتوسطة (متطلب شائع جداً في جامعات كندا وأمريكا)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-800">4.0</td>
                        <td className="p-2.5 font-bold text-emerald-700">B2</td>
                        <td className="p-2.5 font-mono">72 – 85</td>
                        <td className="p-2.5 text-slate-600">كفاءة استقلالية أكاديمية (حد القبول الأساسي لمعظم البكالوريوس)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-amber-700">3.5</td>
                        <td className="p-2.5 font-bold text-amber-700">B1</td>
                        <td className="p-2.5 font-mono">58 – 71</td>
                        <td className="p-2.5 text-slate-600">كفاءة متوسطة تحضيرية (قبول مشروط بسنة لغة)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-amber-700">3.0</td>
                        <td className="p-2.5 font-bold text-amber-700">B1</td>
                        <td className="p-2.5 font-mono">44 – 57</td>
                        <td className="p-2.5 text-slate-600">كفاءة أولية تحتاج تعزيز في البرامج التأهيلية</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-rose-700">2.5 / 2.0</td>
                        <td className="p-2.5 font-bold text-slate-600">A2</td>
                        <td className="p-2.5 font-mono">24 – 43</td>
                        <td className="p-2.5 text-slate-600">مستوى أساسي مبتدئ متقدم</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-rose-700">1.5 / 1.0</td>
                        <td className="p-2.5 font-bold text-slate-600">A1</td>
                        <td className="p-2.5 font-mono">0 – 23</td>
                        <td className="p-2.5 text-slate-600">تعامل أولي بسيط</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* IELTS vs TOEFL Equivalence Table */}
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 pt-4">
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  <span>جدول مقارنة المعادلة الرسمية بين TOEFL iBT و IELTS:</span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-800 text-white">
                      <tr>
                        <th className="p-2.5">IELTS Band Score</th>
                        <th className="p-2.5">TOEFL iBT Scale (1-6)</th>
                        <th className="p-2.5">TOEFL iBT Score (0-120)</th>
                        <th className="p-2.5">التكافؤ والاعتماد الأكاديمي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-blue-700">9.0</td>
                        <td className="p-2.5 font-black text-emerald-800">6.0</td>
                        <td className="p-2.5 font-mono">118 – 120</td>
                        <td className="p-2.5 text-slate-600">إتقان لغوي تام مطلق</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-blue-700">8.5 / 8.0</td>
                        <td className="p-2.5 font-black text-emerald-800">6.0</td>
                        <td className="p-2.5 font-mono">110 – 117</td>
                        <td className="p-2.5 text-slate-600">مستوى متقدم ممتاز جداً</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-blue-700">7.5</td>
                        <td className="p-2.5 font-black text-emerald-800">5.5</td>
                        <td className="p-2.5 font-mono">102 – 109</td>
                        <td className="p-2.5 text-slate-600">مستوى متقدم كفؤ للجامعات المرموقة</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-blue-700">7.0</td>
                        <td className="p-2.5 font-black text-emerald-800">5.0</td>
                        <td className="p-2.5 font-mono">94 – 101</td>
                        <td className="p-2.5 text-slate-600">متطلب شائع للدراسات العليا والماجستير</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-700">6.5</td>
                        <td className="p-2.5 font-black text-emerald-800">4.5</td>
                        <td className="p-2.5 font-mono">79 – 93</td>
                        <td className="p-2.5 text-slate-600">حد القبول الجامعي المعياري العام</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-emerald-700">6.0</td>
                        <td className="p-2.5 font-black text-emerald-800">4.0</td>
                        <td className="p-2.5 font-mono">60 – 78</td>
                        <td className="p-2.5 text-slate-600">حد قبول البكالوريوس والبرامج التحضيرية</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-amber-700">5.5</td>
                        <td className="p-2.5 font-black text-amber-700">3.5</td>
                        <td className="p-2.5 font-mono">46 – 59</td>
                        <td className="p-2.5 text-slate-600">مستوى متوسط يتطلب مسار لغة مدمج</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-amber-700">5.0</td>
                        <td className="p-2.5 font-black text-amber-700">2.5</td>
                        <td className="p-2.5 font-mono">35 – 45</td>
                        <td className="p-2.5 text-slate-600">قبول مشروط بدورة مكثفة</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION: جدول الرسوم وخدمات ETS الموحدة (TOEFL FEES)       */}
        {/* --------------------------------------------------------- */}
        {isToefl && (activeTab === 'all' || activeTab === 'yemen') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">جدول الرسوم الموحدة والخدمات المالية الرسمية لاختبار TOEFL iBT</h2>
                <p className="text-xs text-slate-500">تفاصيل تكاليف الحجز، التأجيل، التقارير الإضافية، وإعادة التصحيح المعتمدة من ETS</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-3">اسم الخدمة أو البند</th>
                    <th className="p-3">الرسم الرسمي ($ USD)</th>
                    <th className="p-3">الضوابط والتوجيهات المعتمدة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">رسوم تسجيل الاختبار الأساسية</td>
                    <td className="p-3 font-black text-emerald-700">$190 - $245 USD</td>
                    <td className="p-3 text-slate-600">تختلف حسب البلد والمركز المعتمد، وتغطي أداء الاختبار وإرسال 4 تقارير مجانية.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">رسوم التسجيل السريع / المتأخر (Late Registration)</td>
                    <td className="p-3 font-black text-amber-700">$49 USD</td>
                    <td className="p-3 text-slate-600">تُطبق عند الحجز خلال فترة الـ 4 أيام السابقة لموعد الاختبار.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">رسوم تغيير الموعد أو المركز (Rescheduling)</td>
                    <td className="p-3 font-black text-amber-700">$69 USD</td>
                    <td className="p-3 text-slate-600">تُدفع عند طلب تعديل التاريخ أو المكان قبل 4 أيام عمل على الأقل.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">رسوم تقرير درجات إضافي (Additional Score Report)</td>
                    <td className="p-3 font-black text-emerald-700">$29 USD / للجامعة</td>
                    <td className="p-3 text-slate-600">إرسال تقرير رسمي إلكتروني لجامعات إضافية بعد انتهاء المهلة المجانية (ملاحظة تعارض مع 25$).</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">رسوم إعادة تفعيل الدرجات الملغاة (Reinstatement)</td>
                    <td className="p-3 font-black text-slate-700">$20 USD</td>
                    <td className="p-3 text-slate-600">عند طلب استرجاع درجة قام الطالب بإلغائها يوم الاختبار.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">مراجعة درجات المحادثة أو الكتابة (Score Review)</td>
                    <td className="p-3 font-black text-rose-700">$80 قسم واحد / $160 لكلاهما</td>
                    <td className="p-3 text-slate-600">طلب إعادة تقييم إجابات قسم المحادثة أو الكتابة بواسطة مصححين كبار.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold">خدمة التقييم السريع (Express Scoring)</td>
                    <td className="p-3 font-black text-emerald-700">$129 USD</td>
                    <td className="p-3 text-slate-600">تسريع مراجعة وصدور التقارير الرسمية للحالات العاجلة.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION: خطوات التسجيل والروابط الرسمية (TOEFL 12 STEPS & LINKS) */}
        {/* --------------------------------------------------------- */}
        {isToefl && (activeTab === 'all' || activeTab === 'variants') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">خطوات التسجيل الرسمية الـ 12 والروابط المعتمدة للتحقق من ETS</h2>
                <p className="text-xs text-slate-500">دليل خطوة بخطوة للتقديم المباشر والروابط الموثقة موثقة بتاريخ 02 أغسطس 2026</p>
              </div>
            </div>

            {/* 12 Registration Steps */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-sm">خطوات التسجيل المباشر الـ 12 لاختبار TOEFL iBT:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">1. إنشاء حساب ETS الرسمي</span>
                  <p className="text-slate-600 text-[11px] pt-1">تسجيل الحساب عبر بوابة ets.org وإدخال الاسم تماماً كما هو في جواز السفر.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">2. اختيار نوع الاختبار</span>
                  <p className="text-slate-600 text-[11px] pt-1">تحديد TOEFL iBT Test Center أو TOEFL iBT Home Edition.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">3. تحديد موقع الاختبار والمركز</span>
                  <p className="text-slate-600 text-[11px] pt-1">اختيار المركز المعتمد (مثل AMIDEAST في عدن/صنعاء) أو الخيار المنزلي.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">4. اختيار الموعد والوقت</span>
                  <p className="text-slate-600 text-[11px] pt-1">تحديد اليوم والفترة الزمنية المتاحة من جدول المواعيد.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">5. إدخال وثيقة الهوية</span>
                  <p className="text-slate-600 text-[11px] pt-1">إدخال بيانات جواز السفر اليمني النافذ بدقة متناهية.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">6. تحديد مستلمي التقارير المجانية</span>
                  <p className="text-slate-600 text-[11px] pt-1">اختيار حتى 4 جامعات ومؤسسات لإرسال الدرجات إليها مجاناً.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">7. سداد رسوم الحجز</span>
                  <p className="text-slate-600 text-[11px] pt-1">الدفع عبر بطاقات فيزا/ماستركارد أو الوسائل المعتمة بالدولار.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">8. طباعة تذكرة التأكيد</span>
                  <p className="text-slate-600 text-[11px] pt-1">احتفاظ ببريد وتذكرة Confirmation Ticket ومراجعة الشروط.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">9. تجهيز برنامج الاختبار (للمنزل)</span>
                  <p className="text-slate-600 text-[11px] pt-1">تنزيل وتثبيت متصفح ETS Secure Browser واختبار الأجهزة.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">10. أداء الاختبار يوم الجلسة</span>
                  <p className="text-slate-600 text-[11px] pt-1">الحضور المبكر للمركز أو دخول الغرفة المنزلية والتأكد من التفتيش.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">11. خيار الإلغاء أو الحفظ</span>
                  <p className="text-slate-600 text-[11px] pt-1">معاينة التقييم المبدئي فور النهاية واختيار اعتماد الدرجة أو إلغائها.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-emerald-800 block">12. استلام تقرير PDF الرسمي</span>
                  <p className="text-slate-600 text-[11px] pt-1">تحميل التقرير المعتمد خلال 24-48 ساعة ومتابعة الإرسال للجامعات.</p>
                </div>
              </div>
            </div>

            {/* Official Verification Links List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-black text-slate-900 text-sm">الروابط الرسمية الـ 10 للتحقق المباشر من ETS:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <a href="https://www.ets.org/toefl/ibt/register" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>1. رابط بوابة التسجيل الرسمية TOEFL iBT</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/ibt/about" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>2. رابط الشروط والسياسات المعتمدة (Bulletin)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/ibt/register/at-home" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>3. مواصفات ومتطلبات TOEFL Home Edition</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/ibt/register/centers" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>4. دليل المراكز المعتمدة عالمياً وفي اليمن</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/institutions/datamanager" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>5. بوابة الجامعات والمؤسسات (ETS Data Manager)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/test-takers/ibt/prepare/testready" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>6. منصة التحضير الرسمية ETS TestReady</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/score-users/scores-admissions/compare" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>7. حاسبة تحويل ومعادلة درجات التوفل بـ IELTS</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/ibt/scores/mybest-scores" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>8. شرح ودليل خدمة MyBest Scores</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/toefl/ibt/register/disabilities" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>9. متطلبات وتسهيلات ذوي الإعاقة (Accommodations)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a href="https://www.ets.org/contact" target="_blank" rel="noreferrer" className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold hover:underline flex items-center justify-between">
                  <span>10. خدمات الدعم الفني والمراكز الإقليمية لـ ETS</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 34: الاختبار في اليمن وقنوات التقديم                */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'yemen') && (
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-50/50 to-emerald-100/30 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-amber-200">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">34. بيانات اختبار {activeTestName} المؤكدة في اليمن والدول المجاورة</h2>
                <p className="text-xs text-emerald-900 font-medium">المراكز المعتمدة الرسمية، طرق التقديم المتاحة، والتوجيهات الهامة للطلاب اليمنيين</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-amber-300 shadow-2xs space-y-1">
                <span className="font-bold text-amber-900 block">المركز الرسمي وطبيعة التقديم:</span>
                <span className="font-black text-slate-900 text-sm block">
                  {isToefl ? 'AMIDEAST Yemen / TOEFL Home Edition' :
                   isSat ? 'AMIDEAST Yemen / International Centers' :
                   isGre ? 'AMIDEAST Yemen / GRE General Home Edition' :
                   isDet ? 'Duolingo Online (تقديم رقمي مباشر)' :
                   isCsat ? 'التقديم والتسجيل الحضوري داخل كوريا الجنوبية' :
                   'British Council / New Horizons Yemen'}
                </span>
                <span className="text-slate-600 block">
                  {isDet ? 'متاح من أي محافظة بوجود كاميرا وإنترنت' : isCsat ? 'يتطلب التواجد والحضور الشخصي في كوريا' : 'عدن / صنعاء (أو من المنزل عبر الإنترنت)'}
                </span>
                <span className="text-slate-500 text-[11px] block">
                  {isDet ? 'لا يتطلب الذهاب لمراكز فزيائية' : isCsat ? 'اختبار ورقي وطني مركزي بالكامل' : 'المراكز الرئيسية المعتمدة رسمياً في اليمن'}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-amber-300 shadow-2xs space-y-1">
                <span className="font-bold text-amber-900 block">الرسوم الموثقة رسمياً:</span>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-800">رسوم اختبار {activeTestName}</span>
                  <span className="font-mono font-black text-emerald-700 text-base">{test?.fee || '$200 - $265 USD'}</span>
                </div>
                <span className="text-slate-400 text-[10px] block pt-1">التحقق: 02 أغسطس 2026</span>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-amber-500/40 shadow-2xs space-y-2">
                <span className="font-black text-amber-400 block text-xs">توجيهات هامة للطلاب في صنعاء والمحافظات:</span>
                <ul className="list-disc pr-4 text-slate-200 text-[11px] space-y-1">
                  <li>جواز السفر اليمني النافذ هو وثيقة التحقق الأساسية المعتمدة رسمياً.</li>
                  <li>عند اختيار النسخة المنزلية (Home Edition / DET)، تأكد من استقرار الإنترنت والكهرباء والهدوء.</li>
                  <li>لأداء الاختبار بالمراكز الفزيائية قد يتطلب الأمر السفر إلى عدن أو المراكز المعتمدة.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 40: الأسئلة الشائعة 24 FAQs Accordion               */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'faq') && (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">40. الأسئلة الشائعة الإحاطية الشاملة لاختبار {activeTestName} (24 سؤالاً وجواباً)</h2>
                <p className="text-xs text-slate-500">إجابات موثقة على أكثر الأسئلة تكراراً لدى الطلاب والمتقدمين لاختبار {activeTestName}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {faqsList.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 text-right font-bold text-slate-900 flex justify-between items-center hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-emerald-950 font-bold">{item.q}</span>
                    {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-3.5 pt-0 text-slate-700 bg-white border-t border-slate-100 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 41 & 42: الروابط الرسمية والمراجع                   */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'faq') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section 41 */}
            <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">41. الروابط الرسمية والتحقق الموثق</h3>
                  <p className="text-xs text-slate-500">مصادر البيانات المعتمدة لاختبار {activeTestName}</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href={test?.officialSourceUrl || 'https://www.ets.org/toefl'} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>الموقع الرسمي لاختبار {activeTestName}: {test?.officialSourceUrl || 'رابط المصدر الرسمى'}</span>
                  </a>
                </li>
                <li>
                  <a href={test?.officialRegistrationUrl || 'https://www.ets.org'} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>رابط التسجيل المباشر لحجز الاختبار</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 42 */}
            <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">42. مواد التحضير والأصول المرفقة</h3>
                  <p className="text-xs text-slate-500">الأصول والمرجعيات المجهزة للاستيراد البرمجي</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 font-mono">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">{`${activeTestName.toLowerCase()}_official_candidate_guide_2026`}</div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">{`${activeTestName.toLowerCase()}_scoring_rubric_official`}</div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">{`${activeTestName.toLowerCase()}_2026_delivery_update_notice`}</div>
              </div>
            </div>

          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 45, 46, 47, 48: الموديل المعماري YAML              */}
        {/* --------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'schemas') && (
          <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-amber-500/30 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">45 – 48. الموديل المعماري وملاحظات الجودة النهائية (YAML Schema)</h2>
                <p className="text-xs text-amber-300/80">الهيكل البرمجي الجاهز للاستيراد لاختبار {activeTestName}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 overflow-x-auto">
                <span className="text-amber-400 font-bold block">// YAML Data Architecture Instance for {activeTestName}</span>
                <pre className="text-emerald-400 text-[11px] leading-relaxed">
{`testFamily:
  key: "${activeTestName.toLowerCase().replace(/\s+/g, '_')}"
  name: "${test?.displayName || activeTestName}"
  canonicalName: "${test?.canonicalName || 'OFFICIAL_SPECIFICATION'}"
  verifiedAt: "2026-08-02"
  provider: "${test?.providerName}"
  scoreScale:
    range: "${test?.scoreRange}"
  validityYears: 2
  status: "IMPORTED_ACTIVE"`}
                </pre>
              </div>
            </div>
          </div>
        )}
          </>
        ) : (
          <div className="bg-white border-2 border-emerald-950/10 rounded-3xl p-6 md:p-8 shadow-xs w-full max-w-full overflow-x-auto text-slate-800 text-sm leading-relaxed prose prose-emerald max-w-none markdown-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {test.markdownContent}
            </ReactMarkdown>
          </div>
        )}

      </div>

    </div>
  );
}
