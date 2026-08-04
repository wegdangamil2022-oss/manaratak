import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApiClient } from '../api/client';
import { useTranslation } from '../i18n/I18nProvider';
import { Loader2, Search, Filter } from 'lucide-react';

interface AcademicTaxonomyNode {
  nodeId: string;
  nodeType: string;
  standardType?: string;
  canonicalCode: string;
  canonicalName: string;
  status: string;
}

export function AcademicTaxonomyAdminPage() {
  const { language } = useTranslation();
  const [nodes, setNodes] = useState<AcademicTaxonomyNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    nodeType: 'all',
    standardType: 'all',
    status: 'all',
  });

  const fetchNodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.nodeType !== 'all') params.append('nodeType', filters.nodeType);
      if (filters.standardType !== 'all') params.append('standardType', filters.standardType);
      if (filters.status !== 'all') params.append('status', filters.status);

      const endpoint = searchQuery ? `/academic-taxonomy/search?${params.toString()}` : `/academic-taxonomy/nodes?${params.toString()}`;
      
      const response = await adminApiClient.request<{ data: AcademicTaxonomyNode[] }>(endpoint);
      setNodes(response.data || []);
    } catch (err) {
      console.error(err);
      setError(language === 'ar' 
        ? 'تعذر تحميل التصنيف الأكاديمي من واجهة البيانات.' 
        : 'Unable to load academic taxonomy from the API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, [filters, searchQuery]);

  const translateNodeType = (type: string) => {
    if (language !== 'ar') return type;
    switch (type) {
      case 'ACADEMIC_FIELD': return 'مجال أكاديمي';
      case 'DISCIPLINE': return 'فرع أكاديمي';
      case 'PROGRAM_AREA': return 'مجال برنامج';
      case 'SPECIALIZATION_CATEGORY': return 'فئة تخصص';
      case 'STANDARD_CLASSIFICATION': return 'تصنيف معياري';
      default: return type;
    }
  };

  const translateStatus = (status: string) => {
    if (language !== 'ar') return status;
    switch (status) {
      case 'DRAFT': return 'مسودة';
      case 'READY_TO_REVIEW': return 'جاهز للمراجعة';
      case 'ACTIVE': return 'نشط';
      case 'ARCHIVED': return 'مؤرشف';
      default: return status;
    }
  };

  const translateStandard = (standard: string) => {
    if (language !== 'ar') return standard;
    if (standard === 'CUSTOM_NATIONAL') return 'معيار وطني مخصص';
    return standard;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'التصنيف الأكاديمي' : 'Academic Taxonomy'}
          </h1>
          <p className="text-gray-500">
            {language === 'ar' 
              ? 'إدارة شجرة التصنيف الأكاديمي والمعايير والمرادفات.' 
              : 'Manage academic taxonomy trees, standards, and aliases.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث في التصنيف الأكاديمي...' : 'Search academic taxonomy...'}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.nodeType}
              onChange={(e) => setFilters(f => ({ ...f, nodeType: e.target.value }))}
            >
              <option value="all">{language === 'ar' ? 'نوع العقدة' : 'Node Type'}</option>
              <option value="ACADEMIC_FIELD">{language === 'ar' ? 'مجال أكاديمي' : 'Academic Field'}</option>
              <option value="DISCIPLINE">{language === 'ar' ? 'فرع أكاديمي' : 'Discipline'}</option>
              <option value="PROGRAM_AREA">{language === 'ar' ? 'مجال برنامج' : 'Program Area'}</option>
              <option value="SPECIALIZATION_CATEGORY">{language === 'ar' ? 'فئة تخصص' : 'Specialization Category'}</option>
              <option value="STANDARD_CLASSIFICATION">{language === 'ar' ? 'تصنيف معياري' : 'Standard Classification'}</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.standardType}
              onChange={(e) => setFilters(f => ({ ...f, standardType: e.target.value }))}
            >
              <option value="all">{language === 'ar' ? 'نوع المعيار' : 'Standard Type'}</option>
              <option value="ISCED">ISCED</option>
              <option value="CIP">CIP</option>
              <option value="CUSTOM_NATIONAL">{language === 'ar' ? 'معيار وطني مخصص' : 'CUSTOM_NATIONAL'}</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              <option value="all">{language === 'ar' ? 'الحالة' : 'Status'}</option>
              <option value="DRAFT">{language === 'ar' ? 'مسودة' : 'DRAFT'}</option>
              <option value="READY_TO_REVIEW">{language === 'ar' ? 'جاهز للمراجعة' : 'READY_TO_REVIEW'}</option>
              <option value="ACTIVE">{language === 'ar' ? 'نشط' : 'ACTIVE'}</option>
              <option value="ARCHIVED">{language === 'ar' ? 'مؤرشف' : 'ARCHIVED'}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error && (
          <div className="p-8 text-center text-red-600 bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : nodes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {language === 'ar' ? 'لا توجد عناصر تصنيف أكاديمي حتى الآن.' : 'No academic taxonomy nodes exist yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">{language === 'ar' ? 'الاسم المعتمد' : 'Canonical Name'}</th>
                  <th className="px-6 py-4 font-semibold">{language === 'ar' ? 'الرمز المعتمد' : 'Canonical Code'}</th>
                  <th className="px-6 py-4 font-semibold">{language === 'ar' ? 'نوع العقدة' : 'Node Type'}</th>
                  <th className="px-6 py-4 font-semibold">{language === 'ar' ? 'المعيار' : 'Standard'}</th>
                  <th className="px-6 py-4 font-semibold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4 font-semibold text-right">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nodes.map(node => (
                  <tr key={node.nodeId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{node.canonicalName}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{node.canonicalCode}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                        {translateNodeType(node.nodeType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{node.standardType ? translateStandard(node.standardType) : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        node.status === 'ACTIVE' ? 'bg-green-50 text-green-700' :
                        node.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                        node.status === 'READY_TO_REVIEW' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {translateStatus(node.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/academic-taxonomy/${node.nodeId}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {language === 'ar' ? 'فتح التفاصيل' : 'Open Detail'}
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
