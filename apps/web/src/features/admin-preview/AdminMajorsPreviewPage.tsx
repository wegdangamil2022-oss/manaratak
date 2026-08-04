import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import { Link, Navigate } from 'react-router-dom';
import { 
  PlusCircle, UploadCloud, AlertCircle, Loader2, Search, Filter, 
  ShieldCheck, GraduationCap, X
} from 'lucide-react';
import { ApiClient } from '../../api/client';

interface MajorItem {
  id: string;
  displayName: string;
  nameAr?: string;
  nameEn?: string;
  degreeLevel?: string; // Bachelor, Master, PhD, Diploma
  collegeOrField?: string;
  cipCode?: string;
  iscedCode?: string;
  jobDemandLevel?: string; // High, Medium, Low
  status: string;
  completenessStatus?: string;
  translationStatus?: string;
  updatedAt?: string;
}

export function AdminMajorsPreviewPage() {
  const { t } = useTranslation();
  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';

  const [majors, setMajors] = useState<MajorItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [degreeFilter, setDegreeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // 8 Status Counters as required
  const [counts, setCounts] = useState({
    all: 0,
    imported: 0,
    missingData: 0,
    needsTranslation: 0,
    classifiedMapped: 0,
    readyToPublish: 0,
    published: 0,
    archived: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { page, pageSize: 20 };
      if (statusFilter) filters.status = statusFilter;

      const res = await ApiClient.getAdminMajors(filters);
      let items: MajorItem[] = res.data || [];

      // Client-side filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter(item => 
          (item.displayName && item.displayName.toLowerCase().includes(q)) ||
          (item.collegeOrField && item.collegeOrField.toLowerCase().includes(q)) ||
          (item.cipCode && item.cipCode.toLowerCase().includes(q)) ||
          (item.iscedCode && item.iscedCode.toLowerCase().includes(q))
        );
      }
      if (degreeFilter) {
        items = items.filter(i => i.degreeLevel?.toLowerCase() === degreeFilter.toLowerCase());
      }

      setMajors(items);
      setTotal(res.total || items.length);

      fetchCounts();
    } catch (err: any) {
      setError(err.message || 'Failed to load majors');
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const allRes = await ApiClient.getAdminMajors({ page: 1, pageSize: 200 });
      const allData: MajorItem[] = allRes.data || [];
      setCounts({
        all: allData.length,
        imported: allData.filter(i => i.status === 'IMPORTED' || i.status === 'READY_TO_REVIEW').length,
        missingData: allData.filter(i => i.completenessStatus === 'incomplete' || !i.collegeOrField).length,
        needsTranslation: allData.filter(i => i.translationStatus === 'needs_translation' || (!i.nameAr || !i.nameEn)).length,
        classifiedMapped: allData.filter(i => i.cipCode || i.iscedCode).length,
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
  }, [page, statusFilter, degreeFilter, demoUnlocked]);

  if (!demoUnlocked) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md w-fit border border-blue-200 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('phase_23_admin_workspace') || 'Phase 23 Enterprise Admin Workspace'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t('admin_majors') || 'Majors & Specializations'}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('admin_majors_desc') || 'Review, normalize, classify, and publish academic majors and degree programs.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Rule 3: Import button routes to /admin/imports/majors */}
          <Link
            to="/admin/imports/majors"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 shadow-xs transition-all inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>{t('open_majors_import_center') || 'Open Majors Import Center'}</span>
          </Link>

          <button
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('add_major') || 'Add Major'}</span>
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
          { label: t('all_majors') || 'All Majors', count: counts.all, filter: '', color: 'border-slate-200 bg-white text-slate-900' },
          { label: t('imported_awaiting_review') || 'Imported / Review', count: counts.imported, filter: 'IMPORTED', color: 'border-blue-200 bg-blue-50/50 text-blue-900' },
          { label: t('missing_data') || 'Missing Data', count: counts.missingData, filter: '', color: 'border-amber-200 bg-amber-50/50 text-amber-900' },
          { label: t('needs_translation') || 'Needs Translation', count: counts.needsTranslation, filter: '', color: 'border-purple-200 bg-purple-50/50 text-purple-900' },
          { label: t('classified_mapped') || 'Classified / Mapped', count: counts.classifiedMapped, filter: '', color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900' },
          { label: t('ready_to_publish') || 'Ready to Publish', count: counts.readyToPublish, filter: 'READY_TO_PUBLISH', color: 'border-teal-200 bg-teal-50/50 text-teal-900' },
          { label: t('published') || 'Published', count: counts.published, filter: 'PUBLISHED', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
          { label: t('archived') || 'Archived', count: counts.archived, filter: 'ARCHIVED', color: 'border-slate-300 bg-slate-100 text-slate-700' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => setStatusFilter(stat.filter)}
            className={`p-3 rounded-2xl border cursor-pointer hover:shadow-xs transition-all ${stat.color} ${statusFilter === stat.filter ? 'ring-2 ring-blue-600' : ''}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 truncate">{stat.label}</span>
            <span className="text-xl font-black mt-1 block">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>{t('advanced_filters') || 'Advanced Filters'}</span>
          </div>
          {(statusFilter || degreeFilter || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setDegreeFilter('');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              {t('clear_all_filters') || 'Clear all filters'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('search') || 'Search name, CIP, ISCED...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="">{t('all_lifecycle_statuses') || 'All Lifecycle Statuses'}</option>
            <option value="IMPORTED">Imported</option>
            <option value="READY_TO_REVIEW">Ready to Review</option>
            <option value="READY_TO_PUBLISH">Ready to Publish</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="">{t('all_degree_levels') || 'All Degree Levels'}</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>
      </div>

      {/* MAJORS LIGHTWEIGHT VERTICAL LIST / TABLE LAYOUT (Rule 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-xs">{t('loading') || 'Loading...'}</p>
          </div>
        ) : majors.length === 0 ? (
          /* Rule 9: Main list empty state */
          <div className="p-16 text-center text-slate-500 space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{t('no_majors_found') || 'No majors found'}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('no_majors_desc') || 'Get started by adding a major record or importing a taxonomy batch.'}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                {t('add_major') || 'Add Major'}
              </button>
              <Link
                to="/admin/imports/majors"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-all"
              >
                {t('open_majors_import_center') || 'Open Majors Import Center'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">{t('major_name') || 'Major Name'}</th>
                  <th className="p-3.5">{t('degree_level') || 'Degree Level'}</th>
                  <th className="p-3.5">{t('college_field') || 'College / Field'}</th>
                  <th className="p-3.5">{t('classification_code') || 'CIP / ISCED Code'}</th>
                  <th className="p-3.5">{t('job_demand') || 'Job Demand'}</th>
                  <th className="p-3.5">{t('lifecycle_status') || 'Status'}</th>
                  <th className="p-3.5 text-right">{t('actions') || 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {majors.map((major) => (
                  <tr key={major.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{major.displayName}</div>
                      {major.nameEn && major.nameEn !== major.displayName && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {major.nameEn}
                        </div>
                      )}
                    </td>

                    {/* Degree Level */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[11px]">
                        {major.degreeLevel || 'Bachelor'}
                      </span>
                    </td>

                    {/* College / Field */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{major.collegeOrField || '-'}</div>
                    </td>

                    {/* CIP / ISCED Code */}
                    <td className="p-3.5">
                      {major.cipCode || major.iscedCode ? (
                        <div className="flex items-center gap-1">
                          {major.cipCode && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono text-[10px] border border-blue-200">CIP: {major.cipCode}</span>}
                          {major.iscedCode && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono text-[10px] border border-purple-200">ISCED: {major.iscedCode}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Job Demand (Optional as per Rule 1) */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        major.jobDemandLevel === 'High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        major.jobDemandLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {major.jobDemandLevel || 'Medium'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                        major.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        major.status === 'READY_TO_PUBLISH' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        major.status === 'ARCHIVED' ? 'bg-slate-200 text-slate-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {major.status}
                      </span>
                    </td>

                    {/* Quick Action: View Details */}
                    <td className="p-3.5 text-right">
                      <Link
                        to={`/admin/majors/${major.id}`}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1"
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
