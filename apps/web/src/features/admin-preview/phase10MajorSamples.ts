export type Phase10MajorKind = 'BACHELOR' | 'MASTER' | 'DOCTORATE' | 'FELLOWSHIP';

export interface Phase10MajorSection {
  sectionKey: string;
  title: string;
  content: string;
  reviewStatus: string;
}

export interface Phase10MajorSample {
  id: string;
  displayName: string;
  nameAr: string;
  nameEn: string;
  code: string;
  degreeLevel: string;
  catalogKind: Phase10MajorKind;
  targetDomain: 'MAJORS' | 'FELLOWSHIPS';
  collegeOrField: string;
  sourceFileName: string;
  status: string;
  completenessStatus: string;
  sectionCount: number;
  sourceType: string;
  updatedAt: string;
  contentSections: Phase10MajorSection[];
}

const bachelorNames = [
  ['MJR-0001', 'الطب والجراحة', 'Medicine and Surgery'],
  ['MJR-0002', 'الطب العام', 'General Medicine'],
  ['MJR-0003', 'الطب البشري', 'Human Medicine'],
  ['MJR-0004', 'العلوم الطبية', 'Medical Sciences'],
  ['MJR-0005', 'العلوم الطبية الحيوية', 'Biomedical Sciences'],
  ['MJR-0006', 'علم التشريح', 'Anatomy'],
  ['MJR-0007', 'علم وظائف الأعضاء', 'Physiology'],
  ['MJR-0008', 'علم الأمراض', 'Pathology'],
  ['MJR-0009', 'علم الأنسجة', 'Histology'],
  ['MJR-0010', 'علم الأجنة', 'Embryology'],
] as const;

const masterNames = [
  ['MAS-0001', 'العلوم الطبية', 'Medical Sciences'],
  ['MAS-0002', 'العلوم الطبية الحيوية', 'Biomedical Sciences'],
  ['MAS-0003', 'علم التشريح', 'Anatomy'],
  ['MAS-0004', 'علم وظائف الأعضاء', 'Physiology'],
  ['MAS-0005', 'علم الأمراض', 'Pathology'],
  ['MAS-0006', 'علم الأنسجة', 'Histology'],
  ['MAS-0007', 'علم الأجنة', 'Embryology'],
  ['MAS-0008', 'علم الأحياء الطبي', 'Medical Biology'],
  ['MAS-0009', 'الأحياء الدقيقة الطبية', 'Medical Microbiology'],
  ['MAS-0010', 'علم المناعة الطبي', 'Medical Immunology'],
] as const;

const doctorateNames = [
  ['DOC-0001', 'العلوم الطبية', 'Medical Sciences'],
  ['DOC-0002', 'العلوم الطبية الحيوية', 'Biomedical Sciences'],
  ['DOC-0003', 'علم التشريح', 'Anatomy'],
  ['DOC-0004', 'علم وظائف الأعضاء', 'Physiology'],
  ['DOC-0005', 'علم الأمراض', 'Pathology'],
  ['DOC-0006', 'علم الأنسجة', 'Histology'],
  ['DOC-0007', 'علم الأجنة', 'Embryology'],
  ['DOC-0008', 'علم الأحياء الطبي', 'Medical Biology'],
  ['DOC-0009', 'الأحياء الدقيقة الطبية', 'Medical Microbiology'],
  ['DOC-0010', 'علم المناعة الطبي', 'Medical Immunology'],
] as const;

const fellowshipNames = [
  ['FEL-0001', 'زمالة طب القلب للبالغين', 'Adult Cardiology Fellowship'],
  ['FEL-0002', 'زمالة أمراض القلب التداخلية', 'Interventional Cardiology Fellowship'],
  ['FEL-0003', 'زمالة الفيزيولوجيا الكهربائية القلبية', 'Clinical Cardiac Electrophysiology Fellowship'],
  ['FEL-0004', 'زمالة قصور القلب المتقدم وزراعة القلب', 'Advanced Heart Failure and Transplant Cardiology Fellowship'],
  ['FEL-0005', 'زمالة تصوير القلب والأوعية', 'Cardiovascular Imaging Fellowship'],
  ['FEL-0006', 'زمالة أمراض القلب الخلقية لدى البالغين', 'Adult Congenital Heart Disease Fellowship'],
  ['FEL-0007', 'زمالة طب القلب الوقائي', 'Preventive Cardiology Fellowship'],
  ['FEL-0008', 'زمالة طب الأوعية الدموية', 'Vascular Medicine Fellowship'],
  ['FEL-0009', 'زمالة الأمراض الصدرية', 'Pulmonary Medicine Fellowship'],
  ['FEL-0010', 'زمالة الأمراض الصدرية والعناية الحرجة', 'Pulmonary and Critical Care Medicine Fellowship'],
] as const;

const bachelorSections = [
  'معلومات التخصص الأساسية',
  'نبذة عن التخصص',
  'ماذا يدرس الطالب؟',
  'المواد التأسيسية',
  'المواد الأساسية في التخصص',
  'الجانب العملي والتطبيقي',
  'المهارات التي يكتسبها الطالب',
  'المسارات داخل التخصص',
  'مجالات العمل',
  'الوظائف المحتملة',
  'الدراسات العليا المرتبطة',
  'التخصصات المشابهة',
  'ملاحظات مهمة',
  'المصادر والمراجعة',
];

const masterSections = [
  'معلومات تخصص الماجستير الأساسية',
  'نبذة عن تخصص الماجستير',
  'أنواع البرنامج الشائعة',
  'تخصصات بكالوريوس مرتبطة مباشرة',
  'تخصصات قريبة قد تقبل',
  'شروط القبول العامة',
  'ماذا يدرس الطالب؟',
  'المقررات المتقدمة',
  'البحث أو المشروع',
  'المهارات البحثية والمهنية',
  'التدريب أو التطبيق',
  'المسارات داخل البرنامج',
  'مخرجات التعلم',
  'فرص العمل بعد التخرج',
  'القطاعات المرتبطة',
  'الدكتوراه المرتبطة',
  'الزمالات المرتبطة',
  'التخصصات المشابهة',
  'العلاقة بالبكالوريوس',
  'ملاحظات قبول',
  'ملاحظات جودة',
  'المصادر والمراجعة',
];

const doctorateSections = [
  'معلومات تخصص الدكتوراه الأساسية',
  'طبيعة الدكتوراه وهدفها',
  'أنواع الدكتوراه الشائعة',
  'تخصصات الماجستير المرتبطة',
  'تخصصات قريبة قد تقبل',
  'مسارات الدخول',
  'مراحل الدراسة',
  'المعرفة المتقدمة',
  'موضوعات البحث',
  'الاختبار الشامل',
  'المقترح البحثي',
  'الأطروحة',
  'الإشراف الأكاديمي',
  'النشر العلمي',
  'التدريس الأكاديمي',
  'المهارات البحثية',
  'المسارات الأكاديمية',
  'المسارات المهنية',
  'ما بعد الدكتوراه',
  'التخصصات المشابهة',
  'الارتباط بالماجستير',
  'ملاحظات اعتماد',
  'ملاحظات جودة',
  'المصادر والمراجعة',
];

const fellowshipSections = [
  'معلومات الزمالة الأساسية',
  'طبيعة الزمالة وهدفها',
  'نوع الزمالة',
  'الفئة المستهدفة',
  'المؤهلات السابقة العامة',
  'الترخيص أو التسجيل المهني',
  'مدة التدريب',
  'مكونات التدريب',
  'المهارات السريرية أو المهنية',
  'طرق التقييم',
  'الشهادة أو الصفة الناتجة',
  'المراكز أو الجهات المحتملة',
  'الحالات أو الإجراءات المتقدمة',
  'المتطلبات السابقة',
  'المسار المهني بعد الزمالة',
  'الزمالات المشابهة',
  'العلاقة بالتخصصات الطبية',
  'ملاحظات قبول',
  'ملاحظات جودة',
  'المصادر والمراجعة',
];

function buildSections(code: string, nameAr: string, titles: string[]): Phase10MajorSection[] {
  return titles.map((title, index) => ({
    sectionKey: `${String(index + 1).padStart(2, '0')}-${code.toLowerCase()}`,
    title,
    content: `محتوى ${title} لتخصص ${nameAr} مستورد من ملف التفاصيل التجريبي للمرحلة 10، ومحفوظ بحالة مراجعة قبل النشر.`,
    reviewStatus: 'NEEDS_REVIEW',
  }));
}

function makeSamples(
  rows: readonly (readonly [string, string, string])[],
  catalogKind: Phase10MajorKind,
  degreeLevel: string,
  collegeOrField: string,
  sourceFileName: string,
  sectionTitles: string[],
): Phase10MajorSample[] {
  return rows.map(([code, nameAr, nameEn]) => ({
    id: `phase10-${code}`,
    displayName: nameAr,
    nameAr,
    nameEn,
    code,
    degreeLevel,
    catalogKind,
    targetDomain: catalogKind === 'FELLOWSHIP' ? 'FELLOWSHIPS' : 'MAJORS',
    collegeOrField,
    sourceFileName,
    status: 'READY_TO_REVIEW',
    completenessStatus: 'NEEDS_REVIEW',
    sectionCount: sectionTitles.length,
    sourceType: 'DETAIL_DOSSIER',
    updatedAt: '2026-08-04',
    contentSections: buildSections(code, nameAr, sectionTitles),
  }));
}

export const phase10MajorSamples: Phase10MajorSample[] = [
  ...makeSamples(bachelorNames, 'BACHELOR', 'Bachelor', 'كلية الطب', 'MANARATAK_Bachelor_Majors_Medicine_01_First_10.md', bachelorSections),
  ...makeSamples(masterNames, 'MASTER', 'Master', 'العلوم الطبية', 'masters_MAS-0001_to_MAS-0010.md', masterSections),
  ...makeSamples(doctorateNames, 'DOCTORATE', 'Doctorate', 'العلوم الطبية', 'doctorates_DOC-0001_to_DOC-0010.md', doctorateSections),
  ...makeSamples(fellowshipNames, 'FELLOWSHIP', 'Fellowship', 'الزمالات الطبية المهنية', 'fellowships_FEL-0001_to_FEL-0010.md', fellowshipSections),
];

export function findPhase10MajorSample(id: string | undefined): Phase10MajorSample | undefined {
  return phase10MajorSamples.find((major) => major.id === id || major.code === id);
}
