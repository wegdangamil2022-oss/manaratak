import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { ADMIN_BEARER_TOKEN_STORAGE_KEY } from './api/client';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ScholarshipListPage } from './pages/ScholarshipListPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CertificateAdminPage } from './pages/CertificateAdminPage';
import { CmsAdminPage } from './pages/CmsAdminPage';
import { StudentToolsAdminPage } from './pages/StudentToolsAdminPage';
import { ServicesAdminPage } from './pages/ServicesAdminPage';
import { FinanceAdminPage } from './pages/FinanceAdminPage';
import { CareerAdminPage } from './pages/CareerAdminPage';
import { InternationalTestsAdminPage } from './pages/InternationalTestsAdminPage';
import { InternationalTestDetailPage } from './pages/InternationalTestDetailPage';
import { AIGovernancePage } from './pages/AIGovernancePage';
import { AdminReviewQueuePage } from './pages/AdminReviewQueuePage';
import { AdminHealthReadinessPage } from './pages/AdminHealthReadinessPage';
import { ImportAdminPage } from './pages/ImportAdminPage';
import { UniversityAdminPage } from './pages/UniversityAdminPage';
import { MajorAdminPage } from './pages/MajorAdminPage';
import { SettingsAdminPage } from './pages/SettingsAdminPage';
import { StudyDestinationsAdminPage } from './pages/StudyDestinationsAdminPage';
import { StudyDestinationDetailPage } from './pages/StudyDestinationDetailPage';
import { ReferenceDataAdminPage } from './pages/ReferenceDataAdminPage';
import { AcademicTaxonomyAdminPage } from './pages/AcademicTaxonomyAdminPage';
import { AcademicTaxonomyDetailPage } from './pages/AcademicTaxonomyDetailPage';
import { I18nProvider, useTranslation } from './i18n/I18nProvider';

function AdminLayout() {
  const [adminAccess, setAdminAccess] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auto_unlock') === 'admin-demo') {
      localStorage.setItem('manaratak_admin_access', 'demo-unlocked');
      localStorage.removeItem(ADMIN_BEARER_TOKEN_STORAGE_KEY);
      
      // Clean up the URL
      const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
      
      setAdminAccess(true);
    } else {
      setAdminAccess(
        localStorage.getItem('manaratak_admin_access') === 'demo-unlocked'
        || Boolean(localStorage.getItem(ADMIN_BEARER_TOKEN_STORAGE_KEY))
      );
    }
  }, []);

  const lockAdmin = () => {
    localStorage.removeItem('manaratak_admin_access');
    localStorage.removeItem(ADMIN_BEARER_TOKEN_STORAGE_KEY);
    setAdminAccess(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold tracking-tight">{t('admin_title')}</h1>
          {adminAccess && (
            <nav className="flex flex-wrap gap-4">
              <a href="/dashboard" className="text-sm font-medium hover:text-black">{t('admin_nav_dashboard')}</a>
              <a href="/review-queue" className="text-sm font-medium hover:text-black">{t('admin_nav_review')}</a>
              <a href="/imports" className="text-sm font-medium hover:text-black">{t('admin_nav_imports')}</a>
              <a href="/health-readiness" className="text-sm font-medium hover:text-black">{t('admin_nav_health')}</a>
              <a href="/scholarships" className="text-sm font-medium hover:text-black">{t('admin_nav_scholarships')}</a>
              <a href="/universities" className="text-sm font-medium hover:text-black">{t('admin_nav_universities')}</a>
              <a href="/majors" className="text-sm font-medium hover:text-black">{t('admin_nav_majors')}</a>
              <a href="/courses" className="text-sm font-medium hover:text-black">{t('admin_nav_courses')}</a>
              <a href="/certificates" className="text-sm font-medium hover:text-black">{t('admin_nav_certificates')}</a>
              <a href="/cms" className="text-sm font-medium hover:text-black">{t('admin_nav_cms')}</a>
              <a href="/services" className="text-sm font-medium hover:text-black">{t('admin_nav_services')}</a>
              <a href="/finance" className="text-sm font-medium hover:text-black">{t('admin_nav_finance')}</a>
              <a href="/careers" className="text-sm font-medium hover:text-black">{t('admin_nav_careers')}</a>
              <a href="/international-tests" className="text-sm font-medium hover:text-black">{t('admin_nav_tests')}</a>
              <a href="/ai-governance" className="text-sm font-medium hover:text-black">{t('admin_nav_ai')}</a>
              <a href="/student-tools" className="text-sm font-medium hover:text-black">{t('admin_nav_tools')}</a>
              <a href="/study-destinations" className="text-sm font-medium hover:text-black">{t('admin_nav_study_destinations')}</a>
              <a href="/settings" className="text-sm font-medium hover:text-black">{t('admin_nav_settings')}</a>
              <a href="/academic-taxonomy" className="text-sm font-medium hover:text-black">{t('admin_nav_academic_taxonomy')}</a>
              <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="text-sm font-medium text-blue-600 hover:text-blue-800">{t('admin_lang_switch')}</button>
              <button onClick={lockAdmin} className="text-sm font-medium text-red-600 hover:text-red-800">{t('lock')}</button>
            </nav>
          )}
        </header>
        <main className="flex-1 p-6">
          {!adminAccess ? (
            <AdminAccessGate onUnlock={() => setAdminAccess(true)} />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<AdminDashboardPage />} />
              <Route path="/review-queue" element={<AdminReviewQueuePage />} />
              <Route path="/imports" element={<ImportAdminPage />} />
              <Route path="/health-readiness" element={<AdminHealthReadinessPage />} />
              <Route path="/scholarships" element={<ScholarshipListPage />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
              <Route path="/admin/scholarships" element={<ScholarshipListPage />} />
              <Route path="/admin/scholarships/:id" element={<ScholarshipDetailPage />} />
              <Route path="/universities" element={<UniversityAdminPage />} />
              <Route path="/majors" element={<MajorAdminPage />} />
              <Route path="/courses" element={<CourseListPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/certificates" element={<CertificateAdminPage />} />
              <Route path="/cms" element={<CmsAdminPage />} />
              <Route path="/services" element={<ServicesAdminPage />} />
              <Route path="/finance" element={<FinanceAdminPage />} />
              <Route path="/careers" element={<CareerAdminPage />} />
              <Route path="/international-tests" element={<InternationalTestsAdminPage />} />
              <Route path="/international-tests/:id" element={<InternationalTestDetailPage />} />
              <Route path="/admin/international-tests" element={<InternationalTestsAdminPage />} />
              <Route path="/admin/international-tests/:id" element={<InternationalTestDetailPage />} />
              <Route path="/ai-governance" element={<AIGovernancePage />} />
              <Route path="/student-tools" element={<StudentToolsAdminPage />} />
              <Route path="/study-destinations" element={<StudyDestinationsAdminPage />} />
              <Route path="/study-destinations/:countryIso2Code" element={<StudyDestinationDetailPage />} />
              <Route path="/settings" element={<SettingsAdminPage />} />
              <Route path="/settings/reference-data" element={<ReferenceDataAdminPage />} />
              <Route path="/academic-taxonomy" element={<AcademicTaxonomyAdminPage />} />
              <Route path="/academic-taxonomy/:nodeId" element={<AcademicTaxonomyDetailPage />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

function AdminAccessGate({ onUnlock }: { onUnlock: () => void }) {
    const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedCode = code.trim();
    if (trimmedCode === 'admin-demo') {
      localStorage.setItem('manaratak_admin_access', 'demo-unlocked');
      localStorage.removeItem(ADMIN_BEARER_TOKEN_STORAGE_KEY);
      onUnlock();
      return;
    }

    if (trimmedCode.length < 32) {
      setError(t('admin_bearer_length_error'));
      return;
    }

    localStorage.removeItem('manaratak_admin_access');
    localStorage.setItem(ADMIN_BEARER_TOKEN_STORAGE_KEY, trimmedCode);
    onUnlock();
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 bg-white border rounded-3xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white p-8">
        <p className="text-sm uppercase tracking-wide text-indigo-200 mb-2">{t('admin_access')}</p>
        <h2 className="text-3xl font-bold mb-3">{t('protected_admin_shell')}</h2>
        <p className="text-slate-200">
          {t('use_the_local_demo_code_during_development_or_a_st')}</p>
      </div>
      <form onSubmit={submit} className="p-8 space-y-4">
        <label className="block text-sm font-medium">{t('admin_access_code_or_bearer_token')}</label>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={t('admin_demo_or_production_bearer_token')}
          type="password"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-black text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-800">{t('unlock_admin')}</button>
        <p className="text-xs text-gray-500">
          {t('development_shortcut')}<span className="font-mono">{t('admin_demo')}</span>{t('production_requires_a_server_configured_bearer_tok')}</p>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AdminLayout />
    </I18nProvider>
  );
}
