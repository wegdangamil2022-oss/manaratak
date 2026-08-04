import { useEffect, useState } from 'react';
import { adminApiClient } from '../api/client';
import { BookOpen, Filter, Loader2, Award, Clipboard } from 'lucide-react';
import { useTranslation } from "../i18n/I18nProvider";

interface Major {
  id: string;
  displayName: string;
  degreeLevel: string;
  academicFieldOrDiscipline?: string | null;
  collegeOrFaculty?: string | null;
  classificationCode?: string | null;
  status: string;
  completenessStatus: string;
  updatedAt: string;
}

interface PaginatedResponse {
  data: Major[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function MajorAdminPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchMajors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: '20' });
      if (statusFilter) params.append('status', statusFilter);
      const response = await adminApiClient.request<PaginatedResponse>(`/admin/majors?${params.toString()}`);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Unable to load academic majors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, [page, statusFilter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin_majors') || 'Academic Majors'}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage academic majors, classifications, and career pathways.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={handleFilterChange} 
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">{t('all_statuses') || 'All Statuses'}</option>
              <option value="IMPORTED">{t('imported') || 'Imported'}</option>
              <option value="READY_TO_REVIEW">{t('ready_to_review') || 'Ready to Review'}</option>
              <option value="PUBLISHED">{t('published') || 'Published'}</option>
            </select>
            <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {loading && !data ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-3">{t('major') || 'Major'}</th>
                  <th className="px-6 py-3">{t('degree_level') || 'Degree Level'}</th>
                  <th className="px-6 py-3">{t('academic_field') || 'Academic Field'}</th>
                  <th className="px-6 py-3">{t('classification_code') || 'CIP Code'}</th>
                  <th className="px-6 py-3">{t('status') || 'Status'}</th>
                  <th className="px-6 py-3">{t('completeness') || 'Completeness'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {!data || data.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BookOpen className="w-8 h-8 text-gray-300" />
                        <span>{t('no_majors_found') || 'No majors found.'}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.data.map((major) => (
                    <tr key={major.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{major.displayName}</span>
                        </div>
                        {major.collegeOrFaculty && (
                          <div className="text-gray-500 text-xs mt-1">{major.collegeOrFaculty}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-gray-400" />
                          {major.degreeLevel.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {major.academicFieldOrDiscipline || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {major.classificationCode ? (
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                            <Clipboard className="w-3.5 h-3.5 text-gray-400" />
                            {major.classificationCode}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${major.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {major.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${major.completenessStatus === 'COMPLETE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {major.completenessStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-700">Page <span className="font-medium">{data.page}</span> of <span className="font-medium">{data.totalPages}</span></span>
              <div className="flex gap-2">
                <button 
                  disabled={data.page === 1} 
                  onClick={() => setPage((value) => Math.max(1, value - 1))} 
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={data.page === data.totalPages} 
                  onClick={() => setPage((value) => value + 1)} 
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
