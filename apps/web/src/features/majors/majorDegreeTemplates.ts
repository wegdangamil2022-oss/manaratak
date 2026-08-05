export type MajorDegreeTemplateKey = 'Bachelor' | 'Master' | 'Doctorate' | 'Fellowship';

export interface MajorDegreeTemplateSection {
  key: string;
  titleAr: string;
  titleEn: string;
  purposeAr: string;
}

export interface MajorDegreeTemplate {
  key: MajorDegreeTemplateKey;
  labelAr: string;
  labelEn: string;
  summaryAr: string;
  sections: MajorDegreeTemplateSection[];
}

export const majorDegreeTemplates: Record<MajorDegreeTemplateKey, MajorDegreeTemplate> = {
  Bachelor: {
    key: 'Bachelor',
    labelAr: 'بكالوريوس',
    labelEn: 'Bachelor',
    summaryAr: 'قالب يركز على الدراسة الجامعية الأولى، المواد، المهارات، التدريب، الوظائف، والمسارات اللاحقة.',
    sections: [
      { key: 'overview', titleAr: 'النبذة', titleEn: 'Overview', purposeAr: 'تعريف مختصر بالتخصص وما يميزه.' },
      { key: 'what-students-study', titleAr: 'ماذا يدرس الطالب', titleEn: 'What Students Study', purposeAr: 'الموضوعات والمساقات التي يواجهها الطالب.' },
      { key: 'foundation-courses', titleAr: 'المواد التأسيسية', titleEn: 'Foundation Courses', purposeAr: 'الأساسيات المطلوبة قبل التعمق.' },
      { key: 'core-courses', titleAr: 'المواد الأساسية', titleEn: 'Core Courses', purposeAr: 'المواد المركزية في التخصص.' },
      { key: 'practical-training', titleAr: 'الجانب العملي', titleEn: 'Practical Training', purposeAr: 'المعامل، التدريب، المشاريع أو التطبيق الميداني.' },
      { key: 'skills', titleAr: 'المهارات', titleEn: 'Skills', purposeAr: 'المهارات العلمية والمهنية التي يكتسبها الطالب.' },
      { key: 'tracks', titleAr: 'المسارات', titleEn: 'Tracks', purposeAr: 'التفرعات أو المسارات الداخلية.' },
      { key: 'careers', titleAr: 'الوظائف', titleEn: 'Careers', purposeAr: 'المجالات الوظيفية الممكنة.' },
      { key: 'postgraduate-pathways', titleAr: 'الدراسات العليا', titleEn: 'Postgraduate Pathways', purposeAr: 'الماجستير أو التخصصات اللاحقة المناسبة.' },
      { key: 'similar-majors', titleAr: 'التخصصات المشابهة', titleEn: 'Similar Majors', purposeAr: 'روابط تخصصات قريبة أو بديلة.' },
    ],
  },
  Master: {
    key: 'Master',
    labelAr: 'ماجستير',
    labelEn: 'Master',
    summaryAr: 'قالب يركز على نوع البرنامج، الخلفيات المقبولة، المقررات المتقدمة، والبحث أو المشروع.',
    sections: [
      { key: 'overview', titleAr: 'النبذة', titleEn: 'Overview', purposeAr: 'تعريف بالبرنامج واتجاهه.' },
      { key: 'master-type', titleAr: 'نوع الماجستير', titleEn: 'Master Type', purposeAr: 'مهني، بحثي، تنفيذي، أو مختلط.' },
      { key: 'accepted-backgrounds', titleAr: 'الخلفيات المقبولة', titleEn: 'Accepted Backgrounds', purposeAr: 'التخصصات السابقة المناسبة للقبول.' },
      { key: 'advanced-courses', titleAr: 'المقررات المتقدمة', titleEn: 'Advanced Courses', purposeAr: 'مقررات التخصص المتقدم.' },
      { key: 'research-or-project', titleAr: 'البحث أو المشروع', titleEn: 'Research or Project', purposeAr: 'رسالة، مشروع تطبيقي، أو بحث.' },
      { key: 'research-professional-skills', titleAr: 'المهارات البحثية والمهنية', titleEn: 'Research and Professional Skills', purposeAr: 'مهارات التحليل، المنهجية، والممارسة.' },
      { key: 'bachelor-relationship', titleAr: 'العلاقة بالبكالوريوس', titleEn: 'Bachelor Relationship', purposeAr: 'ما يرتبط به من تخصصات بكالوريوس.' },
      { key: 'after-graduation', titleAr: 'المسارات بعد التخرج', titleEn: 'After Graduation', purposeAr: 'وظائف، دكتوراه، أو مسارات مهنية.' },
      { key: 'similar-majors', titleAr: 'التخصصات المشابهة', titleEn: 'Similar Majors', purposeAr: 'برامج ماجستير قريبة أو بديلة.' },
    ],
  },
  Doctorate: {
    key: 'Doctorate',
    labelAr: 'دكتوراه',
    labelEn: 'Doctorate',
    summaryAr: 'قالب يركز على طبيعة البحث، موضوعات الأطروحة، الإشراف، النشر، والمسار الأكاديمي.',
    sections: [
      { key: 'overview', titleAr: 'النبذة', titleEn: 'Overview', purposeAr: 'تعريف بمجال الدكتوراه وعمقه البحثي.' },
      { key: 'doctorate-type', titleAr: 'بحثية أو مهنية', titleEn: 'Doctorate Type', purposeAr: 'PhD أو دكتوراه مهنية أو مسار مختلط.' },
      { key: 'entry-routes', titleAr: 'مسارات الدخول', titleEn: 'Entry Routes', purposeAr: 'المتطلبات والخلفيات المناسبة.' },
      { key: 'research-topics', titleAr: 'موضوعات البحث', titleEn: 'Research Topics', purposeAr: 'المحاور البحثية المحتملة.' },
      { key: 'dissertation', titleAr: 'الأطروحة', titleEn: 'Dissertation', purposeAr: 'طبيعة الأطروحة ومخرجاتها.' },
      { key: 'supervision', titleAr: 'الإشراف', titleEn: 'Supervision', purposeAr: 'علاقة الطالب بالمشرف أو اللجنة.' },
      { key: 'publication', titleAr: 'النشر', titleEn: 'Publication', purposeAr: 'متطلبات النشر أو الإنتاج العلمي.' },
      { key: 'academic-career-path', titleAr: 'المسار الأكاديمي والمهني', titleEn: 'Academic and Career Path', purposeAr: 'أين يتجه الخريج بعد الدكتوراه.' },
      { key: 'similar-majors', titleAr: 'التخصصات المشابهة', titleEn: 'Similar Majors', purposeAr: 'تخصصات بحثية قريبة.' },
    ],
  },
  Fellowship: {
    key: 'Fellowship',
    labelAr: 'زمالة',
    labelEn: 'Fellowship',
    summaryAr: 'قالب يركز على التدريب المهني المتقدم، الترخيص، التقييم، والفئة المستهدفة.',
    sections: [
      { key: 'overview', titleAr: 'النبذة', titleEn: 'Overview', purposeAr: 'تعريف بالزمالة ومجالها المهني.' },
      { key: 'fellowship-type', titleAr: 'نوع الزمالة', titleEn: 'Fellowship Type', purposeAr: 'سريرية، مهنية، بحثية، أو تدريبية.' },
      { key: 'target-audience', titleAr: 'الفئة المستهدفة', titleEn: 'Target Audience', purposeAr: 'من يمكنه الالتحاق بالزمالة.' },
      { key: 'prerequisites', titleAr: 'المتطلبات السابقة', titleEn: 'Prerequisites', purposeAr: 'الشهادات والخبرات المطلوبة.' },
      { key: 'licensure', titleAr: 'الترخيص', titleEn: 'Licensure', purposeAr: 'اشتراطات الترخيص أو التسجيل المهني.' },
      { key: 'training', titleAr: 'التدريب', titleEn: 'Training', purposeAr: 'طبيعة التدريب العملي أو السريري.' },
      { key: 'assessment', titleAr: 'التقييم', titleEn: 'Assessment', purposeAr: 'الاختبارات، التقييمات، أو المتطلبات النهائية.' },
      { key: 'credential-outcome', titleAr: 'الشهادة أو الصفة الناتجة', titleEn: 'Credential Outcome', purposeAr: 'ما يحصل عليه المتدرب بعد الإكمال.' },
      { key: 'related-majors', titleAr: 'التخصصات المرتبطة', titleEn: 'Related Majors', purposeAr: 'التخصصات الأكاديمية أو المهنية المرتبطة.' },
    ],
  },
};

export function normalizeMajorDegreeTemplateKey(value?: string): MajorDegreeTemplateKey {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'master' || normalized === 'masters' || normalized === 'ماجستير') return 'Master';
  if (normalized === 'doctorate' || normalized === 'doctoral' || normalized === 'phd' || normalized === 'دكتوراه') return 'Doctorate';
  if (normalized === 'fellowship' || normalized === 'زمالة') return 'Fellowship';
  return 'Bachelor';
}

export function getMajorDegreeTemplate(value?: string): MajorDegreeTemplate {
  return majorDegreeTemplates[normalizeMajorDegreeTemplateKey(value)];
}
