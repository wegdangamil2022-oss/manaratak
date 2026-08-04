import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Link, Outlet, useLocation } from 'react-router-dom';
import { AppShell, Container } from '@manaratak/ui';
import { Seo, RelatedPublicLinks, Logo } from '../components';
import { useTranslation } from '../i18n/I18nProvider';
import { ScholarshipList, ScholarshipDetail } from '../features/scholarships';
import { UniversityList, UniversityDetail } from '../features/universities';
import { MajorList, MajorDetail } from '../features/majors';
import { CourseList, CourseDetail } from '../features/courses';
import { CmsContentList, CmsContentDetail } from '../features/cms';
import { ServiceList, ServiceDetail } from '../features/services';
import { InternationalTestList, InternationalTestDetail } from '../features/international-tests';
import { StudentWorkspacePage } from '../features/students';
import { StudentToolsList } from '../features/student-tools';
import { LoginPage } from '../features/auth';
import { CertificateVerificationPage } from '../features/certificates';
import { SearchResultsPage, ComparePage } from '../features/discovery';
import { 
  AdminPreviewShell,
  AdminPreviewLayout,
  AdminGenericPreviewPage,
  AdminScholarshipsPreviewPage,
  AdminScholarshipDetailPage,
  AdminUniversitiesPreviewPage,
  AdminUniversityDetailPage,
  AdminMajorsPreviewPage,
  AdminMajorDetailPage,
  AdminInternationalTestsPreviewPage,
  AdminInternationalTestDetailPage,
  AdminHealthPreviewPage,
  AdminImportsPreviewPage,
  AdminDomainImportCenterPage,
  AdminReviewQueuePreviewPage,
  AdminCoursesLandingPage,
  AdminNativeCoursesPreviewPage,
  AdminNativeCourseDetailPage,
  AdminImportedCoursesPreviewPage,
  AdminImportedCourseDetailPage,
  AdminPaidCoursesPreviewPage,
  AdminPaidCourseDetailPage,
  AdminServicesLandingPage,
  AdminStudentServicesPreviewPage,
  AdminStudentServiceDetailPage,
  AdminGeneralServicesPreviewPage,
  AdminGeneralServiceDetailPage,
  AdminCmsLandingPage,
  AdminCmsArticlesPreviewPage,
  AdminCmsArticleDetailPage,
  AdminCmsFaqsPreviewPage,
  AdminCmsFaqDetailPage,
  AdminCmsPagesPreviewPage,
  AdminCmsPageDetailPage,
  AdminCmsCategoriesPreviewPage,
  AdminCmsTranslationsPreviewPage,
  AdminCmsReviewQueuePage,
  AdminStudentToolsPreviewPage,
  AdminStudentToolDetailPage,
  AdminCertificatesPreviewPage,
  AdminCertificateDetailPage,
  AdminFinancePreviewPage,
  AdminInvoiceDetailPage,
  AdminCareersPreviewPage,
  AdminCareerOpportunityDetailPage,
  AdminAiGovernancePreviewPage,
  AdminSettingsPreviewPage
} from '../features/admin-preview';
import { 
  GraduationCap, 
  School, 
  BookOpen, 
  FileText, 
  Layers, 
  Wrench, 
  Search, 
  Sparkles, 
  Globe, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Menu, 
  X,
  BookMarked,
  Info
} from 'lucide-react';

const RootLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/study-destinations');

  if (isAdminPath) {
    return <AdminPreviewLayout />;
  }

  const navItems = [
    { to: '/scholarships', label: t('nav_scholarships') },
    { to: '/universities', label: t('nav_universities') },
    { to: '/majors', label: t('nav_majors') },
    { to: '/courses', label: t('nav_courses') },
    { to: '/international-tests', label: t('nav_tests') },
    { to: '/services', label: t('nav_services') },
    { to: '/tools', label: t('nav_tools') },
    { to: '/articles', label: t('nav_guides') },
    { to: '/certificates/verify', label: t('nav_verify') },
    { to: '/student/demo-student', label: t('nav_workspace') },
  ];

  // Dynamic login state checking
  const demoEmail = localStorage.getItem('manaratak_demo_email');
  const demoRole = localStorage.getItem('manaratak_demo_role');
  const isLoggedIn = !!demoEmail;

  const handleLogout = () => {
    localStorage.removeItem('manaratak_demo_email');
    localStorage.removeItem('manaratak_demo_role');
    window.location.href = '/';
  };

  const getWorkspaceUrl = () => {
    if (demoRole === 'admin') return '/admin';
    const ref = demoEmail?.includes('@') ? demoEmail.split('@')[0] : 'demo-student';
    return `/student/${encodeURIComponent(ref)}`;
  };

  return (
    <AppShell
      header={
        <>
          {/* 3. أبعاد الهيدر والأزرار (Header Layout & Buttons) - h-24 (96px) on Mobile, h-28 (112px) on Desktop */}
          <div className="bg-white border-b border-slate-100 flex items-center h-24 lg:h-28">
            <div className="mx-auto max-w-7xl w-full px-4 flex items-center justify-between gap-4">
              <Link to="/" className="transition-transform active:scale-95" onClick={() => setMenuOpen(false)}>
                <Logo showText={true} />
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Language Switch */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="text-[#0F4B3A] hover:bg-emerald-50 font-bold border border-[#0F4B3A]/10 text-xs md:text-sm rounded-lg md:rounded-xl px-2.5 py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                >
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">{language === 'en' ? 'عربي' : 'English'}</span>
                  <span className="sm:hidden">{language === 'en' ? 'عربي' : 'EN'}</span>
                </button>

                {/* Interaction Buttons (الدخول / الحساب / خروج) - styled with spec dimensions */}
                {!isLoggedIn ? (
                  <Link 
                    to="/login" 
                    className="bg-[#0F4B3A] text-white hover:bg-[#0c3e30] font-bold text-xs md:text-sm rounded-lg md:rounded-xl px-3 py-1.5 md:px-5 md:py-2.5 flex items-center justify-center transition-all min-h-[40px] shadow-sm"
                  >
                    {t('nav_login')}
                  </Link>
                ) : (
                  <>
                    <Link 
                      to={getWorkspaceUrl()} 
                      className="bg-[#C8A24A] text-white hover:bg-[#b08d3e] font-bold text-xs md:text-sm rounded-lg md:rounded-xl px-3 py-1.5 md:px-5 md:py-2.5 flex items-center justify-center transition-all min-h-[40px] shadow-sm"
                    >
                      {language === 'ar' ? 'الحساب' : 'Account'}
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 font-bold text-xs md:text-sm rounded-lg md:rounded-xl px-2.5 py-1.5 md:px-4 md:py-2 flex items-center justify-center transition-all min-h-[40px] cursor-pointer"
                    >
                      {language === 'ar' ? 'خروج' : 'Logout'}
                    </button>
                  </>
                )}

                {/* Mobile Menu Toggle (Hamburger) */}
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="lg:hidden min-h-[40px] h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  aria-expanded={menuOpen}
                  aria-label="Toggle navigation menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 4. شريط القائمة العائمة (Navigation Bar) - h-14 (56px), bg-gray-50/90 backdrop-blur-md */}
          <div className="sticky top-0 z-50 h-14 bg-gray-50/90 backdrop-blur-md border-b border-slate-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="mx-auto max-w-7xl h-full px-4 flex items-center">
              
              {/* Desktop Nav Items */}
              <nav className="hidden lg:flex items-center gap-6 h-full text-sm font-semibold">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                  return (
                    <Link 
                      key={item.to} 
                      to={item.to} 
                      className={`h-full flex items-center relative text-sm font-semibold transition-all px-1 ${
                        isActive ? 'text-[#0F4B3A]' : 'text-slate-600 hover:text-[#0F4B3A]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A24A]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Nav: scrollable horizontal row of links, text-xs (12px) */}
              <nav className="lg:hidden flex items-center gap-4 h-full w-full overflow-x-auto scrollbar-none scroll-smooth">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                  return (
                    <Link 
                      key={item.to} 
                      to={item.to} 
                      className={`h-full flex items-center relative text-[12px] font-semibold whitespace-nowrap px-2 transition-all flex-shrink-0 ${
                        isActive ? 'text-[#0F4B3A]' : 'text-slate-500 hover:text-[#0F4B3A]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A24A]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

            </div>
          </div>

          {/* Mobile Full Dropdown Menu (on hamburger click) */}
          {menuOpen && (
            <div className="lg:hidden border-b border-slate-100 bg-white/95 backdrop-blur-md p-4 animate-in fade-in slide-in-from-top-3 duration-200">
              <nav className="grid grid-cols-2 gap-2 text-xs font-bold">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="min-h-11 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-700 shadow-sm border border-slate-100 active:bg-slate-100 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F4B3A]" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </>
      }
      footer={
        <footer className="mt-16 border-t border-slate-100 bg-white py-8 px-4 text-center">
          <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-4">
            <Logo showText={true} className="opacity-90 grayscale-[20%]" />
            <p className="text-xs text-slate-400 font-medium">
              {t('footer_copy')}
            </p>
          </div>
        </footer>
      }
    >
      <Container className="px-4 py-6 sm:py-10 max-w-7xl mx-auto">
        <Outlet />
      </Container>
    </AppShell>
  );
};

const HomePage = () => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const heroTitle = language === 'ar' 
    ? <>مستقبلك الأكاديمي يبدأ من <span className="text-amber-400 font-black relative inline-block">هنا<span className="absolute bottom-1 left-0 w-full h-[6px] bg-amber-500/30 rounded-full"></span></span></>
    : <>Your academic future starts <span className="text-amber-400 font-black relative inline-block">here<span className="absolute bottom-1 left-0 w-full h-[6px] bg-amber-500/30 rounded-full"></span></span></>;

  const heroDesc = language === 'ar'
    ? "المنصة العربية الأكبر لإدارة واكتشاف المنح الدراسية العالمية. صممت بمعايير هندسية متقدمة لخدمة طموحاتك."
    : "The largest Arabic platform for managing and discovering global scholarships. Architected with advanced engineering standards to serve your aspirations.";

  const quickTags = language === 'ar'
    ? [
        { label: '✦ منح ممولة بالكامل', link: '/scholarships' },
        { label: '✦ جامعات النخبة', link: '/universities' },
        { label: '✦ كورسات لغة مجانية', link: '/courses' },
        { label: '✦ اختبارات تجريبية', link: '/international-tests' }
      ]
    : [
        { label: '✦ Fully Funded', link: '/scholarships' },
        { label: '✦ Elite Universities', link: '/universities' },
        { label: '✦ Free Language Courses', link: '/courses' },
        { label: '✦ Practice Tests', link: '/international-tests' }
      ];

  const domains = [
    { 
      to: "/scholarships", 
      title: t('card_scholarships_title'), 
      description: t('card_scholarships_desc'),
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-600",
      badge: language === 'ar' ? "ممول" : "Funded"
    },
    { 
      to: "/universities", 
      title: t('card_universities_title'), 
      description: t('card_universities_desc'),
      icon: School,
      color: "from-blue-500 to-indigo-600",
      badge: language === 'ar' ? "اعتمادات" : "Accredited"
    },
    { 
      to: "/majors", 
      title: t('card_majors_title'), 
      description: t('card_majors_desc'),
      icon: Compass,
      color: "from-amber-500 to-orange-600",
      badge: language === 'ar' ? "مستقبل" : "Future"
    },
    { 
      to: "/courses", 
      title: t('card_courses_title'), 
      description: t('card_courses_desc'),
      icon: BookOpen,
      color: "from-rose-500 to-pink-600",
      badge: language === 'ar' ? "مهارات" : "Skills"
    },
    { 
      to: "/international-tests", 
      title: t('card_tests_title'), 
      description: t('card_tests_desc'),
      icon: FileText,
      color: "from-violet-500 to-purple-600",
      badge: language === 'ar' ? "قبول" : "Admission"
    },
    { 
      to: "/tools", 
      title: t('card_tools_title'), 
      description: t('card_tools_desc'),
      icon: Wrench,
      color: "from-cyan-500 to-blue-600",
      badge: language === 'ar' ? "مجاني" : "Free Tools"
    },
    { 
      to: "/search", 
      title: t('card_search_title'), 
      description: t('card_search_desc'),
      icon: Search,
      color: "from-teal-500 to-emerald-600",
      badge: language === 'ar' ? "ذكي" : "Smart Search"
    },
    { 
      to: "/compare", 
      title: t('card_compare_title'), 
      description: t('card_compare_desc'),
      icon: TrendingUp,
      color: "from-fuchsia-500 to-pink-600",
      badge: language === 'ar' ? "مقارنة" : "Compare"
    }
  ];

  return (
    <div className="space-y-12 py-2 sm:py-6 animate-in fade-in duration-300">
      <Seo title={t('study_opportunities_and_student_tools')} description={heroDesc} />
      
      {/* Premium Hero Section with Grid Background */}
      <section 
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#022c22] via-[#044e3f] to-[#01251c] px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
            linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)
          `
        }}
      >
        {/* Subtle decorative grid lines overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Accent Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-amber-300 text-xs font-bold tracking-wide shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'البوابة الأكاديمية الشاملة للطلاب' : 'The Ultimate Academic Portal'}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl tracking-tight text-white">
            {heroTitle}
          </h1>

          {/* Core Subtitle / Description */}
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-emerald-100 sm:text-lg sm:leading-relaxed font-medium">
            {heroDesc}
          </p>

          {/* Functional, Gorgeous Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mt-8">
            <div className="relative flex items-center p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group focus-within:border-amber-400/50 transition-all">
              <Search className="w-5 h-5 text-emerald-200 mx-3" />
              <input 
                type="text" 
                placeholder={language === 'ar' ? 'ابحث عن المنح والجامعات والتخصصات...' : 'Search scholarships, universities, courses...'} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white border-none outline-none placeholder-emerald-200/60 text-sm py-2 px-1 focus:ring-0 min-h-[44px]"
              />
              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-400 text-[#022c22] font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ar' ? 'بحث' : 'Search'}</span>
              </button>
            </div>
          </form>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {quickTags.map((tag, idx) => (
              <Link 
                key={idx} 
                to={tag.link} 
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-emerald-200 hover:bg-white/10 hover:text-white transition-all"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Domain Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold sm:text-3xl text-slate-900 tracking-tight">
            {language === 'ar' ? 'ابدأ رحلتك الأكاديمية الآن' : 'Start Your Academic Journey'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">
            {language === 'ar' 
              ? 'اختر وجهتك المفضلة من بين بوابات منارتك المتكاملة لتكتشف الفرص الحقيقية.' 
              : 'Explore our integrated directories to find trusted pathways, metrics, and application requirements.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {domains.map((dom) => (
            <HomeCard 
              key={dom.to} 
              to={dom.to} 
              title={dom.title} 
              description={dom.description} 
              icon={dom.icon}
              badge={dom.badge}
              color={dom.color}
            />
          ))}
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
        <div className="grid gap-6 md:grid-cols-3 text-center divide-y md:divide-y-0 md:divide-x md:divide-slate-100">
          <div className="py-4 md:py-0 px-4">
            <h4 className="text-3xl font-black text-[#064E3B]">+١٠,٠٠٠</h4>
            <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'ar' ? 'طالب مستفيد' : 'Benefited Students'}</p>
          </div>
          <div className="py-4 md:py-0 px-4">
            <h4 className="text-3xl font-black text-[#D97706]">+٥٠٠</h4>
            <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'ar' ? 'منحة نشطة ومحدثة' : 'Active Scholarships'}</p>
          </div>
          <div className="py-4 md:py-0 px-4">
            <h4 className="text-3xl font-black text-[#064E3B]">%١٠٠</h4>
            <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'ar' ? 'روابط تقديم مباشرة وموثوقة' : 'Direct Verified Links'}</p>
          </div>
        </div>
      </section>

      <RelatedPublicLinks current="home" />
    </div>
  );
};

// Route Groups Definition
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'search',
        element: <SearchResultsPage />
      },
      {
        path: 'compare',
        element: <ComparePage />
      },
      {
        path: 'scholarships',
        element: <ScholarshipList />
      },
      {
        path: 'scholarships/:slug',
        element: <ScholarshipDetail />
      },
      {
        path: 'universities',
        element: <UniversityList />
      },
      {
        path: 'universities/:slug',
        element: <UniversityDetail />
      },
      {
        path: 'majors',
        element: <MajorList />
      },
      {
        path: 'majors/:slug',
        element: <MajorDetail />
      },
      {
        path: 'courses',
        element: <CourseList />
      },
      {
        path: 'courses/:slug',
        element: <CourseDetail />
      },
      {
        path: 'articles',
        element: <CmsContentList />
      },
      {
        path: 'articles/:slug',
        element: <CmsContentDetail />
      },
      {
        path: 'services',
        element: <ServiceList />
      },
      {
        path: 'services/:slug',
        element: <ServiceDetail />
      },
      {
        path: 'international-tests',
        element: <InternationalTestList />
      },
      {
        path: 'international-tests/:slug',
        element: <InternationalTestDetail />
      },
      {
        path: 'tools',
        element: <StudentToolsList />
      },
      {
        path: 'certificates/verify',
        element: <CertificateVerificationPage />
      },
      {
        path: 'student',
        element: <StudentWorkspacePage />
      },
      {
        path: 'student/:studentReferenceId',
        element: <StudentWorkspacePage />
      },
      {
        path: 'admin',
        element: <AdminAccessBridgePage />
      },
      {
        path: 'admin/dashboard',
        element: <AdminGenericPreviewPage titleKey="admin_dashboard" defaultTitle="Dashboard" descKey="admin_dashboard_desc" defaultDesc="Overview of platform operations, metrics, and quick admin actions." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'admin/review-queue',
        element: <AdminReviewQueuePreviewPage />
      },
      {
        path: 'admin/imports',
        element: <AdminImportsPreviewPage />
      },
      {
        path: 'admin/imports/:domainKey',
        element: <AdminDomainImportCenterPage />
      },
      {
        path: 'study-destinations',
        element: <AdminGenericPreviewPage titleKey="admin_study_destinations" defaultTitle="Study Destinations" descKey="admin_study_destinations_desc" defaultDesc="Manage study destinations." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'study-destinations/:countryIso2Code',
        element: <AdminGenericPreviewPage titleKey="admin_study_destination_detail" defaultTitle="Study Destination Detail" descKey="admin_study_destination_detail_desc" defaultDesc="Manage study destination details." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'admin/study-destinations',
        element: <AdminGenericPreviewPage titleKey="admin_study_destinations" defaultTitle="Study Destinations" descKey="admin_study_destinations_desc" defaultDesc="Manage study destinations." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'admin/study-destinations/:countryIso2Code',
        element: <AdminGenericPreviewPage titleKey="admin_study_destination_detail" defaultTitle="Study Destination Detail" descKey="admin_study_destination_detail_desc" defaultDesc="Manage study destination details." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'admin/scholarships',
        element: <AdminScholarshipsPreviewPage />
      },
      {
        path: 'admin/scholarships/:id',
        element: <AdminScholarshipDetailPage />
      },
      {
        path: 'admin/universities',
        element: <AdminUniversitiesPreviewPage />
      },
      {
        path: 'admin/universities/:id',
        element: <AdminUniversityDetailPage />
      },
      {
        path: 'admin/academic-taxonomy',
        element: <AdminGenericPreviewPage titleKey="admin_academic_taxonomy" defaultTitle="Academic Taxonomy" descKey="admin_academic_taxonomy_desc" defaultDesc="Manage academic taxonomy." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'admin/academic-taxonomy/:nodeId',
        element: <AdminGenericPreviewPage titleKey="admin_academic_taxonomy_detail" defaultTitle="Academic Taxonomy Detail" descKey="admin_academic_taxonomy_detail_desc" defaultDesc="Manage academic taxonomy details." statusKey="admin_status_active" defaultStatus="Active" />
      },
      {
        path: 'admin/majors',
        element: <AdminMajorsPreviewPage />
      },
      {
        path: 'admin/majors/:id',
        element: <AdminMajorDetailPage />
      },
      {
        path: 'admin/international-tests',
        element: <AdminInternationalTestsPreviewPage />
      },
      {
        path: 'admin/international-tests/:id',
        element: <AdminInternationalTestDetailPage />
      },
      {
        path: 'admin/courses',
        element: <AdminCoursesLandingPage />
      },
      {
        path: 'admin/courses/native',
        element: <AdminNativeCoursesPreviewPage />
      },
      {
        path: 'admin/courses/native/:id',
        element: <AdminNativeCourseDetailPage />
      },
      {
        path: 'admin/courses/imported',
        element: <AdminImportedCoursesPreviewPage />
      },
      {
        path: 'admin/courses/imported/:id',
        element: <AdminImportedCourseDetailPage />
      },
      {
        path: 'admin/courses/paid',
        element: <AdminPaidCoursesPreviewPage />
      },
      {
        path: 'admin/courses/paid/:id',
        element: <AdminPaidCourseDetailPage />
      },
      {
        path: 'admin/services',
        element: <AdminServicesLandingPage />
      },
      {
        path: 'admin/services/student',
        element: <AdminStudentServicesPreviewPage />
      },
      {
        path: 'admin/services/student/:id',
        element: <AdminStudentServiceDetailPage />
      },
      {
        path: 'admin/services/general',
        element: <AdminGeneralServicesPreviewPage />
      },
      {
        path: 'admin/services/general/:id',
        element: <AdminGeneralServiceDetailPage />
      },
      {
        path: 'admin/cms',
        element: <AdminCmsLandingPage />
      },
      {
        path: 'admin/cms/articles',
        element: <AdminCmsArticlesPreviewPage />
      },
      {
        path: 'admin/cms/articles/:id',
        element: <AdminCmsArticleDetailPage />
      },
      {
        path: 'admin/cms/faqs',
        element: <AdminCmsFaqsPreviewPage />
      },
      {
        path: 'admin/cms/faqs/:id',
        element: <AdminCmsFaqDetailPage />
      },
      {
        path: 'admin/cms/pages',
        element: <AdminCmsPagesPreviewPage />
      },
      {
        path: 'admin/cms/pages/:id',
        element: <AdminCmsPageDetailPage />
      },
      {
        path: 'admin/cms/categories',
        element: <AdminCmsCategoriesPreviewPage />
      },
      {
        path: 'admin/cms/translations',
        element: <AdminCmsTranslationsPreviewPage />
      },
      {
        path: 'admin/cms/review',
        element: <AdminCmsReviewQueuePage />
      },
      {
        path: 'admin/student-tools',
        element: <AdminStudentToolsPreviewPage />
      },
      {
        path: 'admin/student-tools/:id',
        element: <AdminStudentToolDetailPage />
      },
      {
        path: 'admin/certificates',
        element: <AdminCertificatesPreviewPage />
      },
      {
        path: 'admin/certificates/:id',
        element: <AdminCertificateDetailPage />
      },
      {
        path: 'admin/finance',
        element: <AdminFinancePreviewPage />
      },
      {
        path: 'admin/finance/invoices/:id',
        element: <AdminInvoiceDetailPage />
      },
      {
        path: 'admin/careers',
        element: <AdminCareersPreviewPage />
      },
      {
        path: 'admin/careers/opportunities/:id',
        element: <AdminCareerOpportunityDetailPage />
      },
      {
        path: 'admin/ai-governance',
        element: <AdminAiGovernancePreviewPage />
      },
      {
        path: 'admin/health',
        element: <AdminHealthPreviewPage />
      },
      {
        path: 'admin/settings',
        element: <AdminSettingsPreviewPage />
      }
    ]
  }
]);

function AdminAccessBridgePage() {
  const { t } = useTranslation();
  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';
  const rawAdminUrl = import.meta.env.VITE_ADMIN_URL;
  // Use VITE_ADMIN_URL only if it's a valid external URL, not /admin
  const hasExternalAdminUrl = rawAdminUrl && rawAdminUrl !== '/admin' && rawAdminUrl.startsWith('http');

  const openAdminPortal = () => {
    if (hasExternalAdminUrl) {
      window.location.href = demoUnlocked ? `${rawAdminUrl}?auto_unlock=admin-demo` : rawAdminUrl;
    }
  };

  if (!demoUnlocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white border rounded-3xl p-10 shadow-sm">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="text-gray-600 mb-6">You must be logged in as an admin to view this page.</p>
          <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!hasExternalAdminUrl) {
    return <AdminPreviewShell />;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <div className="bg-white border rounded-3xl p-10 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">{t('admin_portal_access') || 'Admin Portal Access'}</h1>
        
        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm font-medium mb-6">
          ✓ {t('demo_admin_unlocked') || 'Demo admin credentials unlocked successfully.'}
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">
            {t('admin_portal_external') || 'The Admin Portal is hosted externally. Click below to proceed.'}
          </p>
          <button
            onClick={openAdminPortal}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
          >
            {t('open_admin_portal') || 'Open Admin Portal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}

function HomeCard({ 
  to, 
  title, 
  description, 
  icon: IconComponent,
  badge,
  color = "from-emerald-500 to-teal-600"
}: { 
  to: string; 
  title: string; 
  description: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  color?: string;
}) {
  const { t, language } = useTranslation();
  return (
    <Link 
      to={to} 
      className="group relative flex flex-col justify-between min-h-48 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg overflow-hidden active:scale-[0.98]"
    >
      {/* Decorative colored ambient light inside card */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-all duration-300 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Rounded Icon Badge */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-300 shadow-sm">
            {IconComponent ? (
              <IconComponent className="w-5 h-5" />
            ) : (
              <GraduationCap className="w-5 h-5" />
            )}
          </div>

          {/* Elegant Badge Pill */}
          {badge && (
            <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 group-hover:border-amber-200 transition-colors">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-800 group-hover:text-[#064E3B] transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Button link inside card */}
      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-amber-600 transition-colors">
        <span>{t('card_open') || 'Explore'}</span>
        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
