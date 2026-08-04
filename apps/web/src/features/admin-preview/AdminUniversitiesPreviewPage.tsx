import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import { Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, PlusCircle, UploadCloud, AlertCircle, CheckCircle2, 
  ArchiveX, Loader2, Search, Filter, Edit3, Check, X, ShieldCheck, 
  Building2, Globe, GraduationCap
} from 'lucide-react';
import { ApiClient } from '../../api/client';

interface UniversityItem {
  id: string;
  displayName: string;
  originalName?: string;
  country?: string;
  city?: string;
  universityType?: string;
  ranking?: number;
  status: string;
  completenessStatus?: string;
  verificationStatus?: string;
  translationStatus?: string;
  officialWebsite?: string;
  updatedAt: string;
}

export function AdminUniversitiesPreviewPage() {
  const { t } = useTranslation();
  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';

  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [completenessFilter, setCompletenessFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [page, setPage] = useState<number>(1);

  // Status counts
  const [counts, setCounts] = useState({
    all: 0,
    imported: 0,
    verified: 0,
    missingData: 0,
    needsVerification: 0,
    published: 0,
    archived: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { page, pageSize: 20 };
      if (statusFilter) filters.status = statusFilter;
      if (completenessFilter) filters.completenessStatus = completenessFilter;

      const res = await ApiClient.getAdminUniversities(filters);
      let items: UniversityItem[] = res.data || [];

      // Client-side filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter(item => 
          (item.displayName && item.displayName.toLowerCase().includes(q)) ||
          (item.country && item.country.toLowerCase().includes(q)) ||
          (item.city && item.city.toLowerCase().includes(q))
        );
      }
      if (countryFilter) {
        items = items.filter(i => i.country?.toLowerCase() === countryFilter.toLowerCase());
      }
      if (typeFilter) {
        items = items.filter(i => i.universityType?.toLowerCase() === typeFilter.toLowerCase());
      }

      setUniversities(items);
      setTotal(res.total || items.length);

      fetchCounts();
    } catch (err: any) {
      setError(err.message || 'Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const allRes = await ApiClient.getAdminUniversities({ page: 1, pageSize: 200 });
      const allData: UniversityItem[] = allRes.data || [];
      setCounts({
        all: allData.length,
        imported: allData.filter(i => i.status === 'IMPORTED' || i.status === 'READY_TO_REVIEW').length,
        verified: allData.filter(i => i.verificationStatus === 'verified' || i.status === 'PUBLISHED').length,
        missingData: allData.filter(i => i.completenessStatus === 'incomplete' || !i.country).length,
        needsVerification: allData.filter(i => i.verificationStatus === 'needs_verification' || !i.officialWebsite).length,
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
  }, [page, statusFilter, completenessFilter, countryFilter, typeFilter, demoUnlocked]);

  if (!demoUnlocked) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F4B3A] bg-emerald-50/60 px-2.5 py-1 rounded-lg w-fit border border-[#0F4B3A]/10 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('phase_23_admin_workspace') || 'Phase 23 Enterprise Admin Workspace'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t('admin_universities') || 'Universities'}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('admin_universities_desc') || 'Manage university profiles, campuses, accreditations, and program offerings.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Rule 3: Import button routes to /admin/imports/universities */}
          <Link
            to="/admin/imports/universities"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-all inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-[#0F4B3A]" />
            <span>{t('open_university_import_center') || 'Open University Import Center'}</span>
          </Link>

          <button
            className="px-4 py-2.5 bg-[#0F4B3A] hover:bg-[#0b382b] text-white rounded-xl text-xs font-bold shadow-sm transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('add_university') || 'Add University'}</span>
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

      {/* TOP STATISTICS (7 COUNTERS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: t('all_universities') || 'All Universities', count: counts.all, filter: '', color: 'border-slate-100 bg-white text-slate-900 shadow-sm' },
          { label: t('imported_awaiting_review') || 'Imported / Review', count: counts.imported, filter: 'IMPORTED', color: 'border-blue-100 bg-blue-50/25 text-blue-900 shadow-sm' },
          { label: t('verified_approved') || 'Verified / Approved', count: counts.verified, filter: '', color: 'border-indigo-100 bg-indigo-50/25 text-indigo-900 shadow-sm' },
          { label: t('missing_data') || 'Missing Data', count: counts.missingData, filter: 'INCOMPLETE', color: 'border-amber-100 bg-amber-50/25 text-amber-900 shadow-sm' },
          { label: t('needs_source_verification') || 'Needs Verification', count: counts.needsVerification, filter: '', color: 'border-rose-100 bg-rose-50/25 text-rose-900 shadow-sm' },
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

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-[#0F4B3A]" />
            <span>{t('advanced_filters') || 'Advanced Filters'}</span>
          </div>
          {(statusFilter || completenessFilter || countryFilter || typeFilter || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setCompletenessFilter('');
                setCountryFilter('');
                setTypeFilter('');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              {t('clear_all_filters') || 'Clear all filters'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('search') || 'Search name, country...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0F4B3A] focus:border-[#0F4B3A] focus:outline-none bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-1 focus:ring-[#0F4B3A] focus:border-[#0F4B3A] focus:outline-none hover:bg-slate-50/50 transition-colors"
          >
            <option value="">{t('all_lifecycle_statuses') || 'All Lifecycle Statuses'}</option>
            <option value="IMPORTED">Imported</option>
            <option value="READY_TO_REVIEW">Ready to Review</option>
            <option value="READY_TO_PUBLISH">Ready to Publish</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={completenessFilter}
            onChange={(e) => setCompletenessFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-1 focus:ring-[#0F4B3A] focus:border-[#0F4B3A] focus:outline-none hover:bg-slate-50/50 transition-colors"
          >
            <option value="">{t('all_completeness_statuses') || 'All Completeness Statuses'}</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-1 focus:ring-[#0F4B3A] focus:border-[#0F4B3A] focus:outline-none hover:bg-slate-50/50 transition-colors"
          >
            <option value="">{t('all_types') || 'All Types'}</option>
            <option value="Public">{t('public') || 'Public'}</option>
            <option value="Private">{t('private') || 'Private'}</option>
          </select>
        </div>
      </div>

      {/* UNIVERSITIES VERTICAL LIST / TABLE LAYOUT (Rule 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-xs">{t('loading') || 'Loading...'}</p>
          </div>
        ) : universities.length === 0 ? (
          /* Rule 8: Main list empty state */
          <div className="p-16 text-center text-slate-500 space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{t('no_universities_found') || 'No universities found'}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('no_universities_desc') || 'Get started by adding a university record or importing a batch from trusted sources.'}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                className="px-4 py-2 bg-[#0F4B3A] hover:bg-[#0b382b] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                {t('add_university') || 'Add University'}
              </button>
              <Link
                to="/admin/imports/universities"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-all"
              >
                {t('open_university_import_center') || 'Open University Import Center'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">{t('university_name') || 'University Name'}</th>
                  <th className="p-4">{t('country') || 'Country'}</th>
                  <th className="p-4">{t('university_type') || 'Type'}</th>
                  <th className="p-4">{t('ranking') || 'Ranking'}</th>
                  <th className="p-4">{t('lifecycle_status') || 'Lifecycle Status'}</th>
                  <th className="p-4 text-right">{t('actions') || 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {universities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-emerald-50/10 transition-colors">
                    {/* Name */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{uni.displayName}</div>
                      {uni.city && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {uni.city}
                        </div>
                      )}
                    </td>

                    {/* Country */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-slate-800 font-medium">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{uni.country || '-'}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{uni.universityType || '-'}</div>
                    </td>

                    {/* Ranking */}
                    <td className="p-3.5">
                      {uni.ranking ? (
                        <span className="font-bold text-slate-900">#{uni.ranking}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                        uni.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                        uni.status === 'READY_TO_PUBLISH' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                        uni.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700 border border-slate-200/50' :
                        'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}>
                        {uni.status}
                      </span>
                    </td>

                    {/* Quick Action */}
                    <td className="p-3.5 text-right">
                      <Link
                        to={`/admin/universities/${uni.id}`}
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
