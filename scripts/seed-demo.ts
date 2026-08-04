import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const isDryRun = process.argv.includes('--dry-run') || !process.env.DATABASE_URL;

async function main() {
  const summary = {
    referenceCountries: 3,
    referenceCurrencies: 3,
    referenceLanguages: 2,
    universities: 2,
    scholarships: 2,
    majors: 2,
    courses: 3,
    cmsArticles: 1,
    services: 2,
    careerEmployers: 1,
    careerJobs: 1,
    internationalTests: 49,
    studentTools: 4,
    certificateTemplates: 1,
  };

  if (isDryRun) {
    console.log('[DemoSeed] Dry run only. DATABASE_URL is not required.');
    console.table(summary);
    return;
  }

  await seedReferenceData();
  await seedUniversities();
  await seedScholarships();
  await seedMajors();
  await seedCourses();
  await seedCms();
  await seedServices();
  await seedCareers();
  await seedInternationalTests();
  await seedStudentTools();
  await seedCertificateTemplates();

  console.log('[DemoSeed] Demo content baseline completed.');
  console.table(summary);
}

async function seedReferenceData() {
  await prisma.referenceCurrency.upsert({
    where: { isoCode: 'USD' },
    update: {},
    create: { isoCode: 'USD', numericCode: '840', name: 'US Dollar', symbol: '$', minorUnit: 2 },
  });
  await prisma.referenceCurrency.upsert({
    where: { isoCode: 'TRY' },
    update: {},
    create: { isoCode: 'TRY', numericCode: '949', name: 'Turkish Lira', symbol: 'TRY', minorUnit: 2 },
  });
  await prisma.referenceCurrency.upsert({
    where: { isoCode: 'QAR' },
    update: {},
    create: { isoCode: 'QAR', numericCode: '634', name: 'Qatari Riyal', symbol: 'QAR', minorUnit: 2 },
  });

  await prisma.referenceLanguage.upsert({
    where: { isoCode: 'en' },
    update: {},
    create: { isoCode: 'en', name: 'English', nativeName: 'English', direction: 'LTR' },
  });
  await prisma.referenceLanguage.upsert({
    where: { isoCode: 'ar' },
    update: {},
    create: { isoCode: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'RTL' },
  });

  await prisma.referenceCountry.upsert({
    where: { iso2Code: 'TR' },
    update: {},
    create: {
      iso2Code: 'TR',
      iso3Code: 'TUR',
      name: 'Turkey',
      officialName: 'Republic of Turkey',
      region: 'Asia',
      subregion: 'Western Asia',
      defaultCurrencyCode: 'TRY',
      defaultLanguageCode: 'tr',
    },
  });
  await prisma.referenceCountry.upsert({
    where: { iso2Code: 'QA' },
    update: {},
    create: {
      iso2Code: 'QA',
      iso3Code: 'QAT',
      name: 'Qatar',
      officialName: 'State of Qatar',
      region: 'Asia',
      subregion: 'Western Asia',
      defaultCurrencyCode: 'QAR',
      defaultLanguageCode: 'ar',
    },
  });
  await prisma.referenceCountry.upsert({
    where: { iso2Code: 'MY' },
    update: {},
    create: {
      iso2Code: 'MY',
      iso3Code: 'MYS',
      name: 'Malaysia',
      officialName: 'Malaysia',
      region: 'Asia',
      subregion: 'South-Eastern Asia',
      defaultCurrencyCode: 'USD',
      defaultLanguageCode: 'en',
    },
  });
}

async function seedUniversities() {
  await prisma.university.upsert({
    where: { slug: 'qatar-university' },
    update: {},
    create: {
      publicId: 'uni-demo-qatar-university',
      slug: 'qatar-university',
      canonicalName: 'Qatar University',
      canonicalDedupKey: 'qatar-university|qa|public',
      displayName: 'Qatar University',
      officialWebsite: 'https://www.qu.edu.qa',
      country: 'Qatar',
      institutionType: 'PUBLIC_UNIVERSITY',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      city: 'Doha',
      foundedYear: 1973,
      officialSourceUrl: 'https://www.qu.edu.qa',
      optionalFields: {
        overview: 'A public research university and a key national higher education institution in Qatar.',
        popularFields: ['Engineering', 'Business', 'Medicine'],
      },
    },
  });

  await prisma.university.upsert({
    where: { slug: 'istanbul-university' },
    update: {},
    create: {
      publicId: 'uni-demo-istanbul-university',
      slug: 'istanbul-university',
      canonicalName: 'Istanbul University',
      canonicalDedupKey: 'istanbul-university|tr|public',
      displayName: 'Istanbul University',
      officialWebsite: 'https://www.istanbul.edu.tr',
      country: 'Turkey',
      institutionType: 'PUBLIC_UNIVERSITY',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      city: 'Istanbul',
      foundedYear: 1453,
      officialSourceUrl: 'https://www.istanbul.edu.tr',
      optionalFields: {
        overview: 'A historic public university in Istanbul with broad academic offerings.',
        popularFields: ['Medicine', 'Law', 'Humanities'],
      },
    },
  });
}

async function seedScholarships() {
  await prisma.scholarship.upsert({
    where: { slug: 'turkiye-scholarship-2027' },
    update: {},
    create: {
      publicId: 'sch-demo-turkiye-2027',
      slug: 'turkiye-scholarship-2027',
      canonicalName: 'Turkiye Scholarship 2027',
      canonicalDedupKey: 'turkiye-scholarship|2027|full',
      displayName: 'Turkiye Scholarship 2027',
      fundingCoverage: 'FULL',
      coverageDetails: 'Tuition fees, accommodation, monthly stipend, health insurance, and travel support.',
      eligibleMajorsOrFields: ['Engineering', 'Medicine', 'Social Sciences'],
      degreeLevel: 'Bachelor, Master, PhD',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      applicationLink: 'https://www.turkiyeburslari.gov.tr',
      officialSourceUrl: 'https://www.turkiyeburslari.gov.tr',
      sponsorName: 'Turkiye Scholarships',
      studyCountry: 'Turkey',
      applicationDeadline: new Date('2027-02-20T23:59:00.000Z'),
      optionalFields: {
        studyLanguage: 'Turkish / English',
        requiredDocuments: ['Passport', 'Academic transcripts', 'Recommendation letters'],
      },
    },
  });

  await prisma.scholarship.upsert({
    where: { slug: 'qatar-university-scholarship-2027' },
    update: {},
    create: {
      publicId: 'sch-demo-qatar-university-2027',
      slug: 'qatar-university-scholarship-2027',
      canonicalName: 'Qatar University Scholarship 2027',
      canonicalDedupKey: 'qatar-university-scholarship|2027|partial',
      displayName: 'Qatar University Scholarship 2027',
      fundingCoverage: 'PARTIAL',
      coverageDetails: 'Tuition waiver options and selected student support depending on scholarship category.',
      eligibleMajorsOrFields: ['Engineering', 'Business', 'Health Sciences'],
      degreeLevel: 'Bachelor',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      applicationLink: 'https://www.qu.edu.qa/students/admission/scholarships',
      officialSourceUrl: 'https://www.qu.edu.qa/students/admission/scholarships',
      sponsorName: 'Qatar University',
      studyCountry: 'Qatar',
      applicationDeadline: new Date('2027-05-15T23:59:00.000Z'),
      optionalFields: {
        studyLanguage: 'English / Arabic',
        requiredDocuments: ['High school certificate', 'Passport', 'English test score if required'],
      },
    },
  });
}

async function seedMajors() {
  await prisma.major.upsert({
    where: { slug: 'computer-science-bachelor' },
    update: {},
    create: {
      publicId: 'major-demo-cs-bachelor',
      slug: 'computer-science-bachelor',
      canonicalName: 'Computer Science',
      canonicalDedupKey: 'computer-science|computing|bachelor|demo',
      displayName: 'Computer Science',
      degreeLevel: 'Bachelor',
      sourceClassificationSystem: 'DEMO_CLASSIFICATION',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      academicFieldOrDiscipline: 'Computing',
      collegeOrFaculty: 'College of Engineering and Computing',
      optionalFields: {
        skills: ['Programming', 'Algorithms', 'Databases', 'Problem solving'],
        careerPaths: ['Software Engineer', 'Data Analyst', 'Systems Developer'],
      },
    },
  });

  await prisma.major.upsert({
    where: { slug: 'public-health-master' },
    update: {},
    create: {
      publicId: 'major-demo-public-health-master',
      slug: 'public-health-master',
      canonicalName: 'Public Health',
      canonicalDedupKey: 'public-health|health|master|demo',
      displayName: 'Public Health',
      degreeLevel: 'Master',
      sourceClassificationSystem: 'DEMO_CLASSIFICATION',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      academicFieldOrDiscipline: 'Health Sciences',
      collegeOrFaculty: 'College of Health',
      optionalFields: {
        skills: ['Epidemiology', 'Health policy', 'Research methods'],
        careerPaths: ['Public Health Specialist', 'Research Coordinator', 'Health Program Manager'],
      },
    },
  });
}

async function seedCourses() {
  await prisma.course.upsert({
    where: { slug: 'manaratak-scholarship-preparation' },
    update: {},
    create: {
      publicId: 'course-demo-scholarship-prep',
      slug: 'manaratak-scholarship-preparation',
      canonicalName: 'Manaratak Scholarship Preparation',
      canonicalDedupKey: 'manaratak-scholarship-preparation|native|free',
      displayName: 'Manaratak Scholarship Preparation',
      accessType: 'FREE',
      originType: 'NATIVE_MANARATAK',
      directCourseUrl: 'https://www.manaratak.local/courses/manaratak-scholarship-preparation',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      platformName: 'MANARATAK',
      providerName: 'MANARATAK',
      learningLanguage: 'Arabic',
      studyDuration: '3 hours',
      certificateAvailable: true,
      category: 'Scholarship Preparation',
      difficultyLevel: 'Beginner',
      optionalFields: {
        curriculum: ['Finding scholarships', 'Preparing documents', 'Writing a motivation letter'],
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: 'global-academic-writing-free-course' },
    update: {},
    create: {
      publicId: 'course-demo-academic-writing',
      slug: 'global-academic-writing-free-course',
      canonicalName: 'Academic Writing Free Course',
      canonicalDedupKey: 'academic-writing|external|free',
      displayName: 'Academic Writing Free Course',
      accessType: 'FREE',
      originType: 'EXTERNAL_LINKED',
      directCourseUrl: 'https://www.coursera.org/learn/academic-writing',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      platformName: 'Coursera',
      providerName: 'Global Provider',
      learningLanguage: 'English',
      studyDuration: '8 hours',
      certificateAvailable: true,
      category: 'Academic Skills',
      difficultyLevel: 'Beginner',
      optionalFields: {
        externalPolicy: 'Learner is redirected to the provider course page.',
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: 'ielts-preparation-paid-course' },
    update: {},
    create: {
      publicId: 'course-demo-ielts-paid',
      slug: 'ielts-preparation-paid-course',
      canonicalName: 'IELTS Preparation Paid Course',
      canonicalDedupKey: 'ielts-preparation|native|paid',
      displayName: 'IELTS Preparation Paid Course',
      accessType: 'PAID',
      originType: 'PAID_COURSE',
      directCourseUrl: 'https://www.manaratak.local/courses/ielts-preparation-paid-course',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      platformName: 'MANARATAK',
      providerName: 'MANARATAK',
      learningLanguage: 'Arabic / English',
      studyDuration: '12 hours',
      certificateAvailable: true,
      category: 'International Tests',
      difficultyLevel: 'Intermediate',
      optionalFields: {
        pricingReferenceId: 'finance-price-demo-ielts-course',
      },
    },
  });
}

async function seedCms() {
  const node = await prisma.cmsContentNode.upsert({
    where: { slug: 'how-to-prepare-scholarship-documents' },
    update: {},
    create: {
      publicId: 'cms-demo-scholarship-documents',
      slug: 'how-to-prepare-scholarship-documents',
      contentType: 'GUIDE',
      status: 'PUBLISHED',
      title: 'How to Prepare Scholarship Documents',
      summary: 'A practical guide for preparing core scholarship application documents.',
      categorySlug: 'study-guides',
      seoMetadata: { title: 'Scholarship Document Guide' },
      editorialMetadata: { reviewedBy: 'MANARATAK Editorial Team' },
      publishedAt: new Date(),
    },
  });

  await prisma.cmsLocalizedContent.upsert({
    where: { contentId_locale: { contentId: node.id, locale: 'en' } },
    update: {},
    create: {
      contentId: node.id,
      locale: 'en',
      title: 'How to Prepare Scholarship Documents',
      summary: 'A concise preparation checklist for scholarship applicants.',
      body: 'Prepare your passport, academic certificates, transcripts, recommendation letters, and motivation letter early. Always verify requirements from the official source before applying.',
      readingTimeMinutes: 4,
    },
  });
}

async function seedServices() {
  await prisma.serviceCatalogItem.upsert({
    where: { slug: 'document-translation-review' },
    update: {},
    create: {
      publicId: 'service-demo-document-translation',
      slug: 'document-translation-review',
      canonicalName: 'Document Translation Review',
      canonicalDedupKey: 'document-translation-review|document|online|ar-en',
      displayName: 'Document Translation Review',
      serviceCategory: 'Document Services',
      fulfillmentType: 'MANUAL_REVIEW',
      serviceDescription: 'Review translated academic documents before submission.',
      serviceAvailabilityStatus: 'AVAILABLE',
      requiredInputsOrDocuments: ['Original document', 'Translated document'],
      deliveryMode: 'ONLINE',
      responsibleServiceOwnerType: 'MANARATAK_TEAM',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      estimatedDeliveryTime: '2-3 business days',
      supportedLanguages: ['Arabic', 'English'],
      publicDisplayMetadata: { highlight: 'Useful before scholarship applications' },
    },
  });

  await prisma.serviceCatalogItem.upsert({
    where: { slug: 'motivation-letter-preparation' },
    update: {},
    create: {
      publicId: 'service-demo-motivation-letter',
      slug: 'motivation-letter-preparation',
      canonicalName: 'Motivation Letter Preparation',
      canonicalDedupKey: 'motivation-letter-preparation|student|online|en',
      displayName: 'Motivation Letter Preparation',
      serviceCategory: 'Student Services',
      fulfillmentType: 'MANUAL_SERVICE',
      serviceDescription: 'Guided support for preparing a scholarship motivation letter.',
      serviceAvailabilityStatus: 'AVAILABLE',
      requiredInputsOrDocuments: ['Academic background', 'Target scholarship', 'Draft notes'],
      deliveryMode: 'ONLINE',
      responsibleServiceOwnerType: 'MANARATAK_TEAM',
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      estimatedDeliveryTime: '3-5 business days',
      supportedLanguages: ['Arabic', 'English'],
      publicDisplayMetadata: { paid: true },
    },
  });
}

async function seedCareers() {
  const employer = await prisma.careerEmployer.upsert({
    where: { slug: 'manaratak-career-partner' },
    update: {},
    create: {
      publicId: 'career-employer-demo-manaratak-partner',
      slug: 'manaratak-career-partner',
      canonicalName: 'Manaratak Career Partner',
      canonicalDedupKey: 'manaratak-career-partner|education|verified',
      displayName: 'Manaratak Career Partner',
      employerType: 'RECRUITMENT_METADATA',
      industry: 'Education Technology',
      country: 'Yemen',
      city: "Sana'a",
      verificationStatus: 'VERIFIED',
      description: 'Demo recruitment metadata for career page review.',
    },
  });

  await prisma.careerJobPosting.upsert({
    where: { slug: 'remote-student-success-intern' },
    update: {},
    create: {
      publicId: 'career-job-demo-student-success-intern',
      slug: 'remote-student-success-intern',
      canonicalTitle: 'Remote Student Success Intern',
      canonicalDedupKey: 'remote-student-success-intern|manaratak-career-partner|remote|internship',
      title: 'Remote Student Success Intern',
      opportunityType: 'INTERNSHIP',
      employmentType: 'Internship',
      jobCategory: 'Student Support',
      description: 'Support students with scholarship discovery, course navigation, and onboarding.',
      country: 'Remote',
      status: 'PUBLISHED',
      employerId: employer.id,
      applicationDeadline: new Date('2027-03-31T23:59:00.000Z'),
      externalPostingUrl: 'https://www.manaratak.local/careers/remote-student-success-intern',
      requiredSkills: ['Communication', 'Research', 'Arabic', 'English'],
      remoteOption: true,
    },
  });
}

async function seedInternationalTests() {
  const tests = [
    ['test-ielts-academic', 'IELTS Academic', 'اختبار آيلتس الأكاديمي', 'IELTS Academic', 'British Council / IDP / Cambridge Assessment', 'LANGUAGE_PROFICIENCY'],
    ['test-toefl-ibt', 'TOEFL iBT', 'اختبار التوفل عبر الإنترنت (TOEFL iBT)', 'TOEFL iBT Test', 'Educational Testing Service (ETS)', 'LANGUAGE_PROFICIENCY'],
    ['test-duolingo-det', 'Duolingo English Test', 'اختبار دولينجو للغة الإنجليزية (DET)', 'Duolingo English Test', 'Duolingo, Inc.', 'LANGUAGE_PROFICIENCY'],
    ['test-alevel-uk', 'A-Level (UK & International)', 'المستوى المتقدم البريطاني والدولي (A-Level)', 'Advanced Level Qualifications (A-Level)', 'Cambridge / Pearson Edexcel / OxfordAQA', 'UNDERGRAD_ADMISSION'],
    ['test-abitur-de', 'Abitur (German Qualification)', 'الثانوية العامة الألمانية (Abitur)', 'German Allgemeine Hochschulreife (Abitur)', 'وزارات التعليم الألمانية (KMK / IQB)', 'UNDERGRAD_ADMISSION'],
    ['test-act-us', 'ACT (Enhanced ACT)', 'اختبار القبول الجامعي الأمريكي (ACT)', 'ACT (American College Testing)', 'ACT Education Corp.', 'UNDERGRAD_ADMISSION'],
    ['test-celpebras-br', 'Celpe-Bras (Portuguese Test)', 'اختبار اللغة البرتغالية البرازيلي (Celpe-Bras)', 'Celpe-Bras (Brazilian Portuguese Proficiency)', 'Inep / Ministério da Educação', 'LANGUAGE_PROFICIENCY'],
    ['test-cils-it', 'CILS (Italian Certification)', 'شهادة الكفاءة في اللغة الإيطالية (CILS)', 'CILS (Italian Language Certification)', 'Università per Stranieri di Siena', 'LANGUAGE_PROFICIENCY'],
    ['test-ap-us', 'AP Exams (Advanced Placement)', 'اختبارات التقدم المتقدم الجامعية (AP)', 'Advanced Placement (AP Exams)', 'College Board', 'ACADEMIC_PLACEMENT'],
    ['test-cambridge-uk', 'Cambridge English Qualifications', 'مؤهلات كامبريدج للغة الإنجليزية (A2 - C2)', 'Cambridge English Qualifications', 'Cambridge University Press & Assessment', 'LANGUAGE_PROFICIENCY'],
    ['test-clt-us', 'CLT (Classic Learning Test)', 'اختبار التعلم الكلاسيكي للقبول الجامعي (CLT)', 'Classic Learning Test (CLT)', 'Classic Learning Initiatives, LLC', 'UNDERGRAD_ADMISSION'],
    ['test-cpa-us', 'U.S. CPA (Uniform CPA Exam)', 'ترخيص وامتحان المحاسب القانوني المعتمد (U.S. CPA)', 'Certified Public Accountant (Uniform CPA Examination)', 'AICPA / NASBA / State Boards / Prometric', 'PROFESSIONAL_LICENSING'],
    ['test-csca-cn', 'CSCA (China Scholastic Competency Assessment)', 'اختبار الكفاءة الأكاديمية للقبول الجامعي في الصين (CSCA)', 'China Scholastic Competency Assessment (CSCA)', 'China Scholarship Council (CSC)', 'UNDERGRAD_ADMISSION'],
    ['test-cuet-in', 'CUET (Common University Entrance Test)', 'اختبار القبول الجامعي المشترك في الهند (CUET)', 'Common University Entrance Test (CUET)', 'National Testing Agency (NTA)', 'UNDERGRAD_ADMISSION'],
    ['test-csat-kr', 'CSAT / Suneung (College Scholastic Ability Test)', 'اختبار القدرة الدراسية الجامعية - سونونغ (CSAT / Suneung)', 'College Scholastic Ability Test (CSAT / Suneung)', 'Korea Institute for Curriculum and Evaluation (KICE)', 'UNDERGRAD_ADMISSION'],
    ['test-dele-es', 'DELE (Spanish Language Diploma)', 'دبلومات اللغة الإسبانية الرسمية (DELE)', 'Diplomas de Espanol como Lengua Extranjera (DELE)', 'Instituto Cervantes', 'LANGUAGE_PROFICIENCY'],
    ['test-delf-dalf-fr', 'DELF / DALF (French Language Diplomas)', 'دبلومات اللغة الفرنسية الرسمية (DELF / DALF)', 'DELF / DALF French Language Diplomas', 'France Education international (FEI)', 'LANGUAGE_PROFICIENCY'],
    ['test-dat-us', 'DAT (US Dental Admission Test)', 'اختبار القبول في كليات طب الأسنان الأمريكي (DAT)', 'Dental Admission Test (DAT)', 'American Dental Association (ADA)', 'PROFESSIONAL_LICENSING'],
    ['test-gamsat-uk-au', 'GAMSAT (Graduate Medical School Admissions Test)', 'اختبار القبول لكليات الطب للدراسات العليا (GAMSAT)', 'Graduate Medical School Admissions Test (GAMSAT)', 'Australian Council for Educational Research (ACER)', 'GRAD_ADMISSION'],
    ['test-gmat-focus', 'GMAT Exam (Focus Edition)', 'اختبار القبول للدراسات العليا وإدارة الأعمال (GMAT)', 'Graduate Management Admission Test (GMAT)', 'Graduate Management Admission Council (GMAC)', 'GRAD_ADMISSION'],
    ['test-gre-shorter', 'GRE General Test (Shorter Version)', 'اختبار القبول للدراسات العليا (GRE)', 'GRE General Test (Shorter Version)', 'Educational Testing Service (ETS)', 'GRAD_ADMISSION'],
    ['test-hsk-chinese', 'HSK (Hanyu Shuiping Kaoshi)', 'اختبار كفاءة اللغة الصينية (HSK)', 'Hanyu Shuiping Kaoshi (HSK)', 'Center for Language Education and Cooperation (CLEC)', 'LANGUAGE_PROFICIENCY'],
    ['test-eju-japanese', 'EJU (Japanese University Admission for International Students)', 'اختبار القبول الجامعي الياباني للطلاب الدوليين (EJU)', 'Examination for Japanese University Admission for International Students (EJU)', 'Japan Student Services Organization (JASSO)', 'UNDERGRAD_ADMISSION'],
    ['test-itep-academic', 'iTEP Academic', 'اختبار iTEP الأكاديمي للغة الإنجليزية', 'iTEP Academic English Proficiency', 'Boston Educational Services (BES)', 'LANGUAGE_PROFICIENCY'],
    ['test-jlpt-exam', 'JLPT (Japanese Language Proficiency Test)', 'اختبار كفاءة اللغة اليابانية (JLPT)', 'Japanese Language Proficiency Test', 'Japan Foundation & JEES', 'LANGUAGE_PROFICIENCY'],
    ['test-languagecert-academic', 'LANGUAGECERT Academic', 'اختبار لانجويج سيرت الأكاديمي (LANGUAGECERT Academic)', 'LANGUAGECERT Academic English', 'PeopleCert / LANGUAGECERT', 'LANGUAGE_PROFICIENCY'],
    ['test-linguaskill-cambridge', 'Linguaskill (by Cambridge)', 'اختبار لينجواسكيل من كامبريدج (Linguaskill)', 'Linguaskill (Cambridge Assessment English)', 'Cambridge University Press & Assessment', 'LANGUAGE_PROFICIENCY'],
    ['test-imat-italy', 'IMAT (International Medical Admissions Test)', 'اختبار القبول لكليات الطب الإيطالية (IMAT)', 'International Medical Admissions Test (IMAT)', 'Cambridge Assessment Admissions Testing / MUR Italy', 'UNDERGRAD_ADMISSION'],
    ['test-met-michigan', 'Michigan English Test (MET)', 'اختبار ميشيغان للغة الإنجليزية (MET)', 'Michigan English Test (MET)', 'Michigan Language Assessment', 'LANGUAGE_PROFICIENCY'],
    ['test-staatsexamen-nt2', 'Staatsexamen Nt2 (Dutch State Exam)', 'الامتحان الحكومي للهولندية كلغة ثانية (Staatsexamen Nt2)', 'Staatsexamen Nederlands als tweede taal', 'CvTE & DUO', 'LANGUAGE_PROFICIENCY'],
    ['test-oxford-ote', 'Oxford Test of English (OTE)', 'اختبار أكسفورد للغة الإنجليزية (Oxford Test of English)', 'Oxford Test of English (OTE)', 'Oxford University Press', 'LANGUAGE_PROFICIENCY'],
    ['test-matura-europe', 'Matura (Secondary School & University Admission)', 'عائلة شهادات وامتحانات الثانوية والقبول الجامعي (Matura)', 'Matura / Maturita (European Family)', 'National Ministries of Education', 'UNDERGRAD_ADMISSION'],
    ['test-mcat-aamc', 'MCAT (Medical College Admission Test)', 'اختبار القبول في كليات الطب (MCAT)', 'Medical College Admission Test (MCAT)', 'AAMC', 'GRAD_ADMISSION'],
    ['test-plab', 'PLAB (Professional and Linguistic Assessments Board)', 'اختبار تقييم المهنيين واللغويات (PLAB)', 'Professional and Linguistic Assessments Board', 'GMC', 'PROFESSIONAL_LICENSING'],
    ['test-pmp', 'PMP (Project Management Professional)', 'شهادة محترف إدارة المشاريع (PMP)', 'Project Management Professional', 'PMI', 'PROFESSIONAL_LICENSING'],
    ['test-polish-state', 'Polish State Certificate Exam (Certyfikat Polski)', 'امتحان شهادة الدولة في اللغة البولندية', 'State Certificate Examinations in Polish as a Foreign Language', 'State Commission (Poland)', 'LANGUAGE_PROFICIENCY'],
    ['test-pte', 'PTE Academic (Pearson Test of English)', 'اختبار بيرسون الأكاديمي للغة الإنجليزية', 'Pearson Test of English Academic', 'Pearson', 'LANGUAGE_PROFICIENCY'],
    ['test-sat', 'SAT (Scholastic Assessment Test)', 'اختبار القبول الجامعي (SAT)', 'Scholastic Assessment Test', 'College Board', 'UNDERGRAD_ADMISSION'],
    ['test-testdaf', 'TestDaF (Test Deutsch als Fremdsprache)', 'اختبار الألمانية كلغة أجنبية (TestDaF)', 'Test Deutsch als Fremdsprache', 'g.a.s.t.', 'LANGUAGE_PROFICIENCY'],
    ['test-tomer', 'TOMER (Turkish Proficiency Test)', 'اختبار كفاءة اللغة التركية (TOMER)', 'TOMER Turkish Proficiency Test', 'Ankara University', 'LANGUAGE_PROFICIENCY'],
    ['test-topik', 'TOPIK (Test of Proficiency in Korean)', 'اختبار الكفاءة في اللغة الكورية (TOPIK)', 'Test of Proficiency in Korean', 'NIIED', 'LANGUAGE_PROFICIENCY'],
    ['test-toeic', 'TOEIC (Test of English for International Communication)', 'اختبار اللغة الإنجليزية للتواصل الدولي (TOEIC)', 'Test of English for International Communication', 'ETS', 'LANGUAGE_PROFICIENCY'],
    ['test-ukbi', 'UKBI (Indonesian Language Proficiency Test)', 'اختبار الكفاءة في اللغة الإندونيسية (UKBI)', 'Indonesian Language Proficiency Test (UKBI)', 'Kemendikdasmen', 'LANGUAGE_PROFICIENCY'],
    ['test-usmle', 'USMLE (United States Medical Licensing Examination)', 'امتحان الترخيص الطبي الأمريكي (USMLE)', 'United States Medical Licensing Examination (USMLE)', 'FSMB & NBME', 'PROFESSIONAL_LICENSING'],
    ['test-yks', 'YKS (Higher Education Institutions Examination)', 'اختبار مؤسسات التعليم العالي التركية (YKS)', 'YKS (Higher Education Institutions Exam)', 'OSYM', 'UNDERGRAD_ADMISSION'],
    ['test-torfl', 'TORFL / TRKI (Test of Russian as a Foreign Language)', 'اختبار الكفاءة في اللغة الروسية (TORFL)', 'Test of Russian as a Foreign Language (TORFL)', 'Russian Ministry of Education', 'LANGUAGE_PROFICIENCY'],
    ['test-ucat', 'UCAT (University Clinical Aptitude Test)', 'اختبار الكفاءة السريرية الجامعية (UCAT)', 'University Clinical Aptitude Test', 'UCAT Consortium', 'UNDERGRAD_ADMISSION'],
    ['test-yos', 'YOS / TR-YOS (Turkish Universities Student Admission)', 'اختبار الطلاب الأجانب في تركيا (YOS)', 'Turkish Universities Student Admission Exam (TR-YOS)', 'OSYM', 'UNDERGRAD_ADMISSION'],
    ['test-bmat', 'BMAT (BioMedical Admissions Test)', 'اختبار القبول في الطب الحيوي (BMAT)', 'BioMedical Admissions Test (BMAT)', 'CAAT', 'UNDERGRAD_ADMISSION']
  ] as const;

  await prisma.internationalTest.deleteMany({});
  await prisma.internationalTest.createMany({
    data: tests.map(([publicId, displayName, localizedNameAr, localizedNameEn, providerName, testCategory]) => {
      const slug = publicId.replace(/^test-/, '');
      return {
        publicId,
        slug,
        canonicalName: localizedNameEn,
        canonicalDedupKey: `${slug}|${providerName}`.toLowerCase(),
        displayName,
        localizedNameAr,
        localizedNameEn,
        abbreviation: displayName.split(/[ (]/)[0],
        testCategory,
        providerName,
        isPubliclyVisible: true,
        isSourceVerified: false,
        status: 'PUBLISHED',
        completenessStatus: 'NEEDS_REVIEW',
        optionalFields: {
          phase09SeedSource: 'frontend-preview-baseline',
          sourceOfTruthStatus: 'database-baseline',
          sourceMarkdownModule: `${slug.split('-')[0]}-markdown-content.ts`
        }
      };
    })
  });
  return;

  // Clear any existing to ensure clean slate for unique/relation constraints
  await prisma.internationalTest.deleteMany({
    where: { slug: { in: ['ielts', 'ielts-academic', 'toefl-ibt', 'act', 'cpa'] } }
  });

  // 1. IELTS (slug: 'ielts')
  await prisma.internationalTest.create({
    data: {
      publicId: 'test-demo-ielts',
      slug: 'ielts',
      canonicalName: 'IELTS Academic Test',
      canonicalDedupKey: 'ielts-academic-test|british-council|english',
      displayName: 'IELTS Academic',
      testCode: 'IELTS',
      testCategory: 'LANGUAGE_PROFICIENCY',
      providerName: 'British Council / IDP / Cambridge English',
      isPubliclyVisible: true,
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      registrationRequirements: 'Valid Passport or National ID card',
      identificationRequirements: 'Must bring the same physical Passport or National ID card used during registration to the exam hall.',
      retakePolicy: 'Candidates can retake the test at any time, with no restrictions or mandatory waiting periods.',
      variants: {
        create: [
          { variantName: 'IELTS Academic on Computer', deliveryMode: 'ONLINE' },
          { variantName: 'IELTS Academic on Paper', deliveryMode: 'IN_PERSON' }
        ]
      },
      sections: {
        create: [
          { sectionName: 'Listening', sectionType: 'LISTENING', order: 1, durationMinutes: 30, scoreMinimum: 0, scoreMaximum: 9 },
          { sectionName: 'Reading', sectionType: 'READING', order: 2, durationMinutes: 60, scoreMinimum: 0, scoreMaximum: 9 },
          { sectionName: 'Writing', sectionType: 'WRITING', order: 3, durationMinutes: 60, scoreMinimum: 0, scoreMaximum: 9 },
          { sectionName: 'Speaking', sectionType: 'SPEAKING', order: 4, durationMinutes: 14, scoreMinimum: 0, scoreMaximum: 9 }
        ]
      },
      scoreScale: {
        create: {
          overallMinimum: 0,
          overallMaximum: 9,
          scoreIncrement: 0.5,
          cefrEquivalency: 'Band 4.0 = B1, Band 5.5 = B2, Band 7.0 = C1, Band 8.5 = C2',
          resultValidityDurationMonths: 24,
          resultDeliveryTimeDays: 5
        }
      },
      fees: {
        create: [
          { feeType: 'REGISTRATION', amount: 1150, currencyCode: 'SAR', hasRegionalVariation: true }
        ]
      },
      officialLinks: {
        create: [
          { linkType: 'REGISTRATION', url: 'https://www.ielts.org', description: 'Book your IELTS test' },
          { linkType: 'INFORMATION', url: 'https://takeielts.britishcouncil.org', description: 'British Council IELTS guide' }
        ]
      },
      availability: {
        create: {
          availableCountryIds: ['SA', 'QA', 'TR', 'MY'],
          onlineAvailabilityRegions: ['Global']
        }
      },
      preparationMaterials: {
        create: [
          { title: 'IELTS Official Practice Material', materialType: 'PRACTICE_TEST', url: 'https://takeielts.britishcouncil.org/prepare' }
        ]
      }
    }
  });

  // 2. TOEFL iBT (slug: 'toefl-ibt')
  await prisma.internationalTest.create({
    data: {
      publicId: 'test-demo-toefl-ibt',
      slug: 'toefl-ibt',
      canonicalName: 'TOEFL iBT Test',
      canonicalDedupKey: 'toefl-ibt-test|ets|english',
      displayName: 'TOEFL iBT',
      testCode: 'TOEFL',
      testCategory: 'LANGUAGE_PROFICIENCY',
      providerName: 'ETS',
      isPubliclyVisible: true,
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      registrationRequirements: 'National Identification card or Valid Passport.',
      identificationRequirements: 'Government-issued ID containing candidate photo, signature, and name matching the registration.',
      retakePolicy: 'Candidates can retake the test as many times as wished, but cannot take it more than once in a 3-day period.',
      variants: {
        create: [
          { variantName: 'TOEFL iBT Computer-Delivered', deliveryMode: 'IN_PERSON' },
          { variantName: 'TOEFL iBT Home Edition', deliveryMode: 'ONLINE' }
        ]
      },
      sections: {
        create: [
          { sectionName: 'Reading', sectionType: 'READING', order: 1, durationMinutes: 36, scoreMinimum: 0, scoreMaximum: 30 },
          { sectionName: 'Listening', sectionType: 'LISTENING', order: 2, durationMinutes: 36, scoreMinimum: 0, scoreMaximum: 30 },
          { sectionName: 'Speaking', sectionType: 'SPEAKING', order: 3, durationMinutes: 16, scoreMinimum: 0, scoreMaximum: 30 },
          { sectionName: 'Writing', sectionType: 'WRITING', order: 4, durationMinutes: 29, scoreMinimum: 0, scoreMaximum: 30 }
        ]
      },
      scoreScale: {
        create: {
          overallMinimum: 0,
          overallMaximum: 120,
          scoreIncrement: 1,
          cefrEquivalency: '57-86 = B2, 95-120 = C1/C2',
          resultValidityDurationMonths: 24,
          resultDeliveryTimeDays: 6
        }
      },
      fees: {
        create: [
          { feeType: 'REGISTRATION', amount: 920, currencyCode: 'SAR', hasRegionalVariation: true }
        ]
      },
      officialLinks: {
        create: [
          { linkType: 'REGISTRATION', url: 'https://www.ets.org/toefl', description: 'Official TOEFL iBT registration' }
        ]
      },
      availability: {
        create: {
          availableCountryIds: ['SA', 'QA', 'TR', 'MY'],
          onlineAvailabilityRegions: ['Global']
        }
      },
      preparationMaterials: {
        create: [
          { title: 'TOEFL iBT Free Practice Test', materialType: 'PRACTICE_TEST', url: 'https://www.ets.org/toefl/test-takers/ibt/prepare' }
        ]
      }
    }
  });

  // 3. ACT (slug: 'act')
  await prisma.internationalTest.create({
    data: {
      publicId: 'test-demo-act',
      slug: 'act',
      canonicalName: 'ACT Admission Test',
      canonicalDedupKey: 'act-test|college-board|english',
      displayName: 'ACT',
      testCode: 'ACT',
      testCategory: 'UNDERGRAD_ADMISSION',
      providerName: 'ACT Inc.',
      isPubliclyVisible: true,
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      registrationRequirements: 'Active online account, payment via approved gateway.',
      identificationRequirements: 'Government-issued ID or official ACT Student ID Form with candidate photo.',
      retakePolicy: 'Candidates can take the ACT up to 12 times in total.',
      variants: {
        create: [
          { variantName: 'ACT National Test', deliveryMode: 'IN_PERSON' }
        ]
      },
      sections: {
        create: [
          { sectionName: 'English', sectionType: 'LANGUAGE_USE', order: 1, durationMinutes: 45, scoreMinimum: 1, scoreMaximum: 36 },
          { sectionName: 'Mathematics', sectionType: 'QUANTITATIVE', order: 2, durationMinutes: 60, scoreMinimum: 1, scoreMaximum: 36 },
          { sectionName: 'Reading', sectionType: 'READING', order: 3, durationMinutes: 35, scoreMinimum: 1, scoreMaximum: 36 },
          { sectionName: 'Science', sectionType: 'ANALYTICAL', order: 4, durationMinutes: 35, scoreMinimum: 1, scoreMaximum: 36 }
        ]
      },
      scoreScale: {
        create: {
          overallMinimum: 1,
          overallMaximum: 36,
          scoreIncrement: 1,
          resultValidityDurationMonths: 60,
          resultDeliveryTimeDays: 14
        }
      },
      fees: {
        create: [
          { feeType: 'REGISTRATION', amount: 185, currencyCode: 'USD', hasRegionalVariation: false }
        ]
      },
      officialLinks: {
        create: [
          { linkType: 'REGISTRATION', url: 'https://www.act.org', description: 'Register for the ACT' }
        ]
      },
      availability: {
        create: {
          availableCountryIds: ['US', 'SA', 'QA', 'TR'],
          onlineAvailabilityRegions: []
        }
      },
      preparationMaterials: {
        create: [
          { title: 'Official ACT Practice Guides', materialType: 'STUDY_GUIDE', url: 'https://www.act.org/content/act/en/products-and-services/the-act/preparing-for-the-act' }
        ]
      }
    }
  });

  // 4. CPA (slug: 'cpa')
  await prisma.internationalTest.create({
    data: {
      publicId: 'test-demo-cpa',
      slug: 'cpa',
      canonicalName: 'Uniform Certified Public Accountant Examination',
      canonicalDedupKey: 'cpa-exam|aicpa|accounting',
      displayName: 'CPA Exam',
      testCode: 'CPA',
      testCategory: 'PROFESSIONAL_LICENSING',
      providerName: 'AICPA / NASBA',
      isPubliclyVisible: true,
      status: 'PUBLISHED',
      completenessStatus: 'COMPLETE',
      registrationRequirements: 'Bachelor degree with 150 semester hours of education, specific business/accounting credits.',
      identificationRequirements: 'Two valid, unexpired forms of identification (one primary with photo, one secondary). Names must match exactly.',
      retakePolicy: 'Candidates can retake failed sections as soon as scores are released and a new NTS is issued.',
      variants: {
        create: [
          { variantName: 'CPA Computer-Based Exam', deliveryMode: 'IN_PERSON' }
        ]
      },
      sections: {
        create: [
          { sectionName: 'Auditing and Attestation (AUD)', sectionType: 'PROFESSIONAL_KNOWLEDGE', order: 1, durationMinutes: 240, scoreMinimum: 0, scoreMaximum: 99 },
          { sectionName: 'Financial Accounting and Reporting (FAR)', sectionType: 'PROFESSIONAL_KNOWLEDGE', order: 2, durationMinutes: 240, scoreMinimum: 0, scoreMaximum: 99 },
          { sectionName: 'Regulation (REG)', sectionType: 'PROFESSIONAL_KNOWLEDGE', order: 3, durationMinutes: 240, scoreMinimum: 0, scoreMaximum: 99 }
        ]
      },
      scoreScale: {
        create: {
          overallMinimum: 0,
          overallMaximum: 99,
          scoreIncrement: 1,
          passFailRules: 'Passing score is 75 for each of the four sections.',
          resultValidityDurationMonths: 30,
          resultDeliveryTimeDays: 14
        }
      },
      fees: {
        create: [
          { feeType: 'REGISTRATION', amount: 350, currencyCode: 'USD', hasRegionalVariation: false }
        ]
      },
      officialLinks: {
        create: [
          { linkType: 'REGISTRATION', url: 'https://nasba.org/exams/cpaexam/', description: 'Apply for CPA Exam on NASBA' },
          { linkType: 'INFORMATION', url: 'https://www.aicpa-cima.com/resources/toolkit/cpa-exam', description: 'AICPA CPA Exam Toolkit' }
        ]
      },
      availability: {
        create: {
          availableCountryIds: ['US', 'SA', 'QA', 'TR'],
          onlineAvailabilityRegions: []
        }
      },
      preparationMaterials: {
        create: [
          { title: 'AICPA CPA Exam Blueprints', materialType: 'STUDY_GUIDE', url: 'https://www.aicpa-cima.com/resources/download/learn-what-is-tested-on-the-cpa-exam' }
        ]
      }
    }
  });
}

async function seedStudentTools() {
  const tools = [
    ['scholarship-matcher', 'Scholarship Matcher', 'Find matching scholarships from structured preferences.', 'Scholarships', 'AI_ASSISTED', 1],
    ['major-advisor', 'Major Advisor', 'Explore majors by degree level, skills, and career outcomes.', 'Majors', 'AI_ASSISTED', 2],
    ['motivation-letter-helper', 'Motivation Letter Helper', 'Draft a safer first version of a motivation letter.', 'Documents', 'AI_ASSISTED', 3],
    ['study-cost-estimator', 'Study Cost Estimator', 'Estimate study cost from reference and finance projections.', 'Finance', 'DETERMINISTIC', 4],
  ];

  for (const [toolKey, displayName, description, category, executionType, launchOrder] of tools) {
    await prisma.studentToolRegistryEntry.upsert({
      where: { toolKey: String(toolKey) },
      update: {},
      create: {
        toolKey: String(toolKey),
        displayName: String(displayName),
        description: String(description),
        category: String(category),
        executionType: String(executionType),
        visibilityStatus: 'ACTIVE',
        implementationPriority: 'P1_CORE_LAUNCH',
        aiDependencyLevel: executionType === 'AI_ASSISTED' ? 'REQUIRED' : 'NONE',
        publicEnabled: true,
        anonymousEnabled: true,
        authenticatedEnabled: true,
        adminOnly: false,
        launchOrder: Number(launchOrder),
        dependencyMetadata: { demoSeed: true },
        costRiskMetadata: { risk: executionType === 'AI_ASSISTED' ? 'MEDIUM' : 'LOW' },
      },
    });
  }
}

async function seedCertificateTemplates() {
  await prisma.certificateTemplate.upsert({
    where: { publicId: 'cert-template-demo-course-completion' },
    update: {},
    create: {
      publicId: 'cert-template-demo-course-completion',
      name: 'Course Completion Demo Template',
      templateVersion: 'v1',
      status: 'ACTIVE',
      issuerName: 'MANARATAK',
      issuerReferenceId: 'issuer-demo-manaratak',
      metadata: { demoSeed: true, eapAssetRequiredBeforeProduction: true },
    },
  });
}

main()
  .catch((error) => {
    console.error('[DemoSeed] Failed to seed demo content.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
