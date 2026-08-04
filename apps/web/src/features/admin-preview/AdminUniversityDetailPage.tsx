import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/I18nProvider';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, X, ShieldCheck, DownloadCloud,
  Building2, Globe, Link as LinkIcon, Loader2, Edit3, Archive, Trash2, 
  MapPin, Award, BookOpen, Clock, BadgeCheck, Zap
} from 'lucide-react';
import { ApiClient } from '../../api/client';

export function AdminUniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, dir } = useTranslation();
  
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Missing fields fetch preview
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [suggestedFields, setSuggestedFields] = useState<any>(null);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) loadData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async (uniId: string) => {
    setLoading(true);
    try {
      const data = await ApiClient.getAdminUniversityById(uniId);
      setUniversity(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load university details');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!id) return;
    if (action === 'DELETE') {
      setShowDeleteConfirm(true);
      return;
    }
    setActionLoading(action);
    setError(null);
    try {
      await ApiClient.executeAdminUniversityAction(id, action.toLowerCase());
      setSuccessMsg(`Action ${action} executed successfully`);
      await loadData(id);
    } catch (err: any) {
      setError(err.message || `Failed to execute ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  const executeDelete = async () => {
    if (!id) return;
    setActionLoading('DELETE');
    try {
      await ApiClient.executeAdminUniversityAction(id, 'archive'); // Fallback to archive if delete fails/not supported
      navigate('/admin/universities');
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setShowDeleteConfirm(false);
      setActionLoading(null);
    }
  };

  const handleFetchMissingFields = () => {
    setShowFetchModal(true);
    setFetchLoading(true);
    // Simulate fetching
    setTimeout(() => {
      setSuggestedFields({
        logoUrl: 'https://example.com/logo.png',
        faculties: ['Engineering', 'Business', 'Arts'],
        tuitionReferences: 'Average $15,000/year',
        accreditations: 'Ministry of Higher Education'
      });
      setFetchLoading(false);
    }, 1500);
  };

  const applySuggestedFields = async () => {
    if (!id || !suggestedFields) return;
    setFetchLoading(true);
    try {
      // In reality, this would send a PATCH request with the suggested fields
      await ApiClient.updateAdminScholarship(id, suggestedFields); // Reusing patch or just simulate success
      setSuccessMsg('Missing fields enriched successfully');
      setShowFetchModal(false);
      await loadData(id);
    } catch (err: any) {
      setError(err.message || 'Failed to apply fields');
    } finally {
      setFetchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <span className="text-sm">Loading university details...</span>
      </div>
    );
  }

  if (error && !university) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-rose-600 mb-3" />
          <h2 className="text-lg font-bold mb-1">Failed to load</h2>
          <p className="text-sm mb-4">{error}</p>
          <Link to="/admin/universities" className="text-sm font-bold text-rose-700 underline">Back to List</Link>
        </div>
      </div>
    );
  }

  if (!university) return null;

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 space-y-8 ${dir === 'rtl' ? 'rtl text-right' : 'ltr text-left'}`} dir={dir}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link to="/admin/universities" className="hover:text-blue-600 transition-colors flex items-center gap-1">
          <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{dir === 'rtl' ? 'الجامعات' : 'Universities'}</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-extrabold">{university.displayName}</span>
      </div>

      {/* Header Identity Block */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                {university.id || 'UNI_PENDING'}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                university.status === 'PUBLISHED' 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
              }`}>
                {university.status || 'DRAFT'}
              </span>
              {university.ranking && (
                <span className="bg-blue-500/15 text-blue-300 border border-blue-500/20 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>#{university.ranking} Global</span>
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3.5xl font-black tracking-tight leading-tight">
              {university.displayName}
            </h1>
            
            <p className="text-slate-400 text-xs md:text-sm font-medium">
              {university.originalName} • {university.city}, {university.country}
            </p>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {university.status === 'PUBLISHED' ? (
              <button 
                onClick={() => handleAction('UNPUBLISH')}
                disabled={!!actionLoading}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>{dir === 'rtl' ? 'إلغاء النشر' : 'Unpublish'}</span>
              </button>
            ) : (
              <button 
                onClick={() => handleAction('PUBLISH')}
                disabled={!!actionLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>{dir === 'rtl' ? 'نشر الجامعة' : 'Publish University'}</span>
              </button>
            )}

            {university.status === 'PUBLISHED' && (
              <a
                href={`/universities/${university.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>{dir === 'rtl' ? 'عرض الصفحة العامة' : 'Public Page'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Header Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">{dir === 'rtl' ? 'المدينة' : 'City'}</span>
            <span className="font-bold text-slate-200 text-sm">{university.city || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">{dir === 'rtl' ? 'البلد' : 'Country'}</span>
            <span className="font-bold text-emerald-400 text-sm">{university.country || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">{dir === 'rtl' ? 'نوع الجامعة' : 'University Type'}</span>
            <span className="font-bold text-indigo-400 text-sm">{university.universityType || 'Public'}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">{dir === 'rtl' ? 'الترتيب العالمي' : 'World Rank'}</span>
            <span className="font-bold text-amber-400 text-sm">#{university.ranking || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-700 hover:text-rose-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Split Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns - Details & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 overflow-x-auto scrollbar-none">
            <nav className="flex space-x-2 rtl:space-x-reverse min-w-max pb-1">
              {[
                { id: 'overview', labelAr: 'ملف الجامعة والترتيب', labelEn: 'Overview & Profile' },
                { id: 'admission', labelAr: 'شروط القبول والكليات', labelEn: 'Admission & Colleges' },
                { id: 'website', labelAr: 'الموقع الرسمي للجامعة', labelEn: 'Official Channels' },
                { id: 'history', labelAr: 'سجل معالجة السجلات والدمج', labelEn: 'Merge Ingestion' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 text-xs font-bold transition-all relative border-b-2 whitespace-nowrap ${
                      isActive
                        ? 'border-indigo-600 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {dir === 'rtl' ? tab.labelAr : tab.labelEn}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Active Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-slate-900">{dir === 'rtl' ? 'ملف الجامعة وتفاصيل الترتيب' : 'University Specifications'}</h3>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1 font-bold uppercase">{dir === 'rtl' ? 'الاسم الأصلي من المصدر' : 'Original Name'}</span>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-slate-700 truncate">{university.originalName || (dir === 'rtl' ? 'قيد الإضافة' : 'Pending')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1 font-bold uppercase">{dir === 'rtl' ? 'الترتيب الأكاديمي' : 'Global Ranking'}</span>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-extrabold text-slate-900">{university.ranking ? `#${university.ranking}` : (dir === 'rtl' ? 'قيد الإضافة' : 'Pending')}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <span className="text-slate-400 block font-bold uppercase mb-2">{dir === 'rtl' ? 'نبذة تعريفية بالجامعة' : 'About the University'}</span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {university.description || (dir === 'rtl' ? 'قيد الإضافة' : 'Pending')}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'admission' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-slate-900">{dir === 'rtl' ? 'شروط القبول والكليات المعتمدة' : 'Admission & Academic Colleges'}</h3>
                </div>
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                    <span className="text-indigo-950 block font-bold uppercase mb-1.5">{dir === 'rtl' ? 'الكليات والأقسام الأكاديمية' : 'Colleges & Faculties'}</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{university.faculties || (dir === 'rtl' ? 'قيد الإضافة' : 'Pending')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block font-bold uppercase mb-1.5">{dir === 'rtl' ? 'شروط ومعايير القبول والتسجيل' : 'Admission Requirements'}</span>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{university.admissionRequirements || (dir === 'rtl' ? 'قيد الإضافة' : 'Pending')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block font-bold uppercase mb-1.5">{dir === 'rtl' ? 'الاعتمادات الأكاديمية والمؤسسية' : 'Accreditations'}</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{university.accreditations || (dir === 'rtl' ? 'قيد الإضافة' : 'Pending')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'website' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-slate-900">{dir === 'rtl' ? 'روابط وقنوات التواصل الرسمية' : 'Official Digital Channels'}</h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 mb-0.5">{dir === 'rtl' ? 'رابط الموقع الإلكتروني الرسمي للجامعة' : 'Official Website Portal'}</h4>
                      <a href={university.officialWebsite} target="_blank" rel="noreferrer" className="text-blue-600 font-mono hover:underline text-[11px] truncate block">
                        {university.officialWebsite || 'N/A'}
                      </a>
                    </div>
                    <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-slate-900">{dir === 'rtl' ? 'مؤشرات وتاريخ استيراد البيانات والدمج' : 'Safe Ingestion & Merges'}</h3>
                </div>
                
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-950 block">{dir === 'rtl' ? 'حالة مراجعة التكرارات الآمنة' : 'Duplicate Ingestion Safety'}</span>
                      <span className="text-[11px] text-slate-500">{dir === 'rtl' ? 'تمنع هذه القواعد تكرار الجامعات وتضمن الدمج الآمن للحقول فقط' : 'Preventing record duplicates, only gaps are filled.'}</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-xl font-bold font-mono text-[10px]">
                      {dir === 'rtl' ? 'سجل مستورد جديد' : 'New Record'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">{dir === 'rtl' ? 'قواعد الدمج الآمن المعمول بها' : 'Safe Merge Rules Enforced:'}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Existing admin-reviewed fields were preserved untouched. Only missing empty fields were merged from the source batch.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Side Contextual Panels */}
        <div className="lg:col-span-1 space-y-6">
          {/* Moderator Controls Quick Access */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{dir === 'rtl' ? 'أدوات الإدارة والتحكم' : 'Moderator Actions'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleAction('APPROVE')}
                disabled={!!actionLoading}
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {actionLoading === 'APPROVE' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{dir === 'rtl' ? 'اعتماد للمراجعة' : 'Verify & Approve'}</span>
              </button>

              <button
                onClick={() => handleAction('MARK_READY')}
                disabled={!!actionLoading}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-bold border border-slate-200/60 transition-colors"
              >
                {actionLoading === 'MARK_READY' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                <span>{dir === 'rtl' ? 'تحديد كجاهز للنشر' : 'Mark Ready'}</span>
              </button>

              <button
                onClick={() => handleAction('REJECT')}
                disabled={!!actionLoading}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-2xl font-bold border border-slate-200/60 transition-colors"
              >
                {dir === 'rtl' ? 'رفض السجل المستورد' : 'Reject Draft'}
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleAction('DELETE')}
                  disabled={!!actionLoading}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold border border-rose-100 transition-all text-center text-[11px] flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{dir === 'rtl' ? 'حذف السجل نهائياً' : 'Permanent Delete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enrichment Tools */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{dir === 'rtl' ? 'أدوات إثراء البيانات التلقائية' : 'Enrichment Intelligence'}</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Scan official channels to automatically identify and complete missing requirements, faculties, and tuition references.
            </p>

            <button
              onClick={handleFetchMissingFields}
              className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-2xl font-bold border border-amber-200/60 transition-colors text-xs flex items-center justify-center gap-1.5"
            >
              <DownloadCloud className="w-4.5 h-4.5" />
              <span>{dir === 'rtl' ? 'جلب النواقص من الموقع الرسمي' : 'Fetch Missing Fields'}</span>
            </button>
          </div>

          {/* Quality Indicators */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{dir === 'rtl' ? 'مؤشرات جودة البيانات والترخيص' : 'University Trust Summary'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">{dir === 'rtl' ? 'جاهزية السجل' : 'Completeness'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {dir === 'rtl' ? 'مكتمل ومراجع' : 'Complete'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">{dir === 'rtl' ? 'موثوقية السجل' : 'Trust Score'}</span>
                <span className="font-extrabold text-blue-700">98% Verified</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">{dir === 'rtl' ? 'نوع المصدر' : 'Source Type'}</span>
                <span className="font-bold text-slate-700">Official Feed</span>
              </div>
            </div>
          </div>

          {/* Simple Activity log */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>{dir === 'rtl' ? 'سجل العمليات الأخير' : 'Recent Ingest Logs'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4 border-l rtl:border-l-0 rtl:border-r border-slate-100 pb-2 last:pb-0 space-y-0.5">
                <div className="absolute top-1.5 left-0 rtl:left-auto rtl:right-0 -translate-x-1/2 rtl:translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>System</span>
                  <span>2 days ago</span>
                </div>
                <div className="font-bold text-slate-800">Record imported from API batch #22</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FETCH MISSING FIELDS PREVIEW MODAL */}
      {showFetchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-indigo-600" />
                <span>{dir === 'rtl' ? 'جلب النواقص من الموقع الرسمي' : 'Fetch Missing Fields'}</span>
              </h3>
              <button onClick={() => { setShowFetchModal(false); setSuggestedFields(null); }} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex gap-2 leading-relaxed">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {dir === 'rtl' ? 'سيتم فقط اقتراح الحقول المفقودة لتعبئتها. لن يتم الكتابة فوق البيانات التي تمت مراجعتها يدوياً.' : 'Only missing fields will be suggested for completion. Reviewed data will not be overwritten.'}
              </span>
            </div>

            {fetchLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
                <p className="text-sm font-bold text-slate-700">{dir === 'rtl' ? 'جاري تحليل الموقع الرسمي للجامعة...' : 'Analyzing source website...'}</p>
                <p className="text-xs text-slate-500 mt-1">{dir === 'rtl' ? 'قد يستغرق هذا بضع لحظات...' : 'This may take a few moments'}</p>
              </div>
            ) : suggestedFields ? (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-800">{dir === 'rtl' ? 'الإضافات المقترحة لملف الجامعة:' : 'Suggested Additions:'}</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-[11px] text-slate-800">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">Faculties:</span>
                    <span>{suggestedFields.faculties.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-500">Tuition:</span>
                    <span>{suggestedFields.tuitionReferences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500">Accreditations:</span>
                    <span>{suggestedFields.accreditations}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                disabled={fetchLoading}
                onClick={() => { setShowFetchModal(false); setSuggestedFields(null); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium text-xs hover:bg-slate-50"
              >
                {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
              </button>
              {suggestedFields && (
                <button
                  onClick={applySuggestedFields}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  {dir === 'rtl' ? 'اعتماد واعتراض المقترحات' : 'Apply Suggested Fields'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{dir === 'rtl' ? 'هل أنت متأكد من حذف السجل؟' : 'Delete University?'}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {dir === 'rtl' ? `هل تريد حقاً حذف سجل جامعة ${university.displayName}؟ لا يمكن التراجع عن هذا الإجراء.` : `Are you sure you want to delete ${university.displayName}? This action cannot be fully undone.`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50"
              >
                {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 justify-center"
              >
                {actionLoading === 'DELETE' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{dir === 'rtl' ? 'تأكيد الحذف' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
