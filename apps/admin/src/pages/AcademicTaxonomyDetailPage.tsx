import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApiClient } from '../api/client';
import { useTranslation } from '../i18n/I18nProvider';
import { Loader2, ArrowLeft, Network, Box, AlertTriangle, PlayCircle } from 'lucide-react';

interface AcademicTaxonomyNode {
  nodeId: string;
  nodeType: string;
  standardType?: string;
  standardCode?: string;
  canonicalCode: string;
  canonicalName: string;
  description?: string;
  status: string;
  localizedNames?: Record<string, string>;
}

export function AcademicTaxonomyDetailPage() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { language } = useTranslation();
  const [node, setNode] = useState<AcademicTaxonomyNode | null>(null);
  const [children, setChildren] = useState<AcademicTaxonomyNode[]>([]);
  const [parents, setParents] = useState<AcademicTaxonomyNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [nodeRes, childrenRes, parentsRes] = await Promise.all([
          adminApiClient.request<AcademicTaxonomyNode>(`/academic-taxonomy/nodes/${nodeId}`),
          adminApiClient.request<{ data: AcademicTaxonomyNode[] }>(`/academic-taxonomy/nodes/${nodeId}/children`),
          adminApiClient.request<{ data: AcademicTaxonomyNode[] }>(`/academic-taxonomy/nodes/${nodeId}/parents`),
        ]);
        if (active) {
          setNode(nodeRes);
          setChildren(childrenRes.data || []);
          setParents(parentsRes.data || []);
        }
      } catch (err) {
        if (active) {
          setError(language === 'ar' 
            ? 'تعذر تحميل التصنيف الأكاديمي من واجهة البيانات.' 
            : 'Unable to load academic taxonomy from the API.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => { active = false; };
  }, [nodeId, language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !node) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Link to="/academic-taxonomy" className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> 
          {language === 'ar' ? 'العودة إلى التصنيف الأكاديمي' : 'Back to Academic Taxonomy'}
        </Link>
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 text-center">
          {error || (language === 'ar' ? 'لم يتم العثور على العقدة' : 'Node not found')}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'hierarchy', label: language === 'ar' ? 'العلاقات الهرمية' : 'Hierarchy' },
    { id: 'aliases', label: language === 'ar' ? 'المرادفات' : 'Aliases' },
    { id: 'mappings', label: language === 'ar' ? 'المعايير والربط' : 'Standards & Mappings' },
    { id: 'validation', label: language === 'ar' ? 'التحقق' : 'Validation' },
    { id: 'import', label: language === 'ar' ? 'مراجعة الاستيراد' : 'Import Review' }
  ];

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

  const isAr = language === 'ar';

  return (
    <div className={`max-w-5xl mx-auto space-y-6 pb-12 ${isAr ? 'rtl text-right' : 'ltr text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4">
        <Link to="/academic-taxonomy" className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-500 flex items-center justify-center">
          <ArrowLeft className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
        </Link>
        <div>
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">{isAr ? 'التصنيف الأكاديمي' : 'Academic Taxonomy'}</span>
          <h1 className="text-md font-extrabold text-slate-900 leading-none">{node.canonicalName}</h1>
        </div>
      </div>

      {/* Header Identity Block */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-purple-500/15 text-purple-300 border border-purple-500/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                {node.canonicalCode}
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                {translateNodeType(node.nodeType)}
              </span>
              {node.standardType && (
                <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {translateStandard(node.standardType)}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3.5xl font-black tracking-tight leading-tight">
              {node.canonicalName}
            </h1>
            
            <p className="text-slate-400 text-xs md:text-sm font-medium">
              {isAr ? 'حالة النظام:' : 'System status:'} <span className="text-purple-300 font-extrabold">{translateStatus(node.status)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto scrollbar-none pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-emerald-500 text-[#0F4B3A]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 md:p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{language === 'ar' ? 'الاسم المعتمد' : 'Canonical Name'}</h3>
                <div className="text-gray-900 font-medium">{node.canonicalName}</div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{language === 'ar' ? 'الرمز المعتمد' : 'Canonical Code'}</h3>
                <div className="text-gray-900 font-mono">{node.canonicalCode}</div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{language === 'ar' ? 'نوع العقدة' : 'Node Type'}</h3>
                <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-medium">
                  {translateNodeType(node.nodeType)}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{language === 'ar' ? 'الحالة' : 'Status'}</h3>
                <span className={`inline-block px-2.5 py-1 rounded-md text-sm font-medium ${
                  node.status === 'ACTIVE' ? 'bg-green-50 text-green-700' :
                  node.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                  node.status === 'READY_TO_REVIEW' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {translateStatus(node.status)}
                </span>
              </div>
              {node.standardType && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{language === 'ar' ? 'نوع المعيار' : 'Standard Type'}</h3>
                  <div className="text-gray-900">{translateStandard(node.standardType)}</div>
                </div>
              )}
              {node.standardCode && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{language === 'ar' ? 'الرمز المعياري' : 'Standard Code'}</h3>
                  <div className="text-gray-900 font-mono">{node.standardCode}</div>
                </div>
              )}
            </div>

            {node.description && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{language === 'ar' ? 'الوصف' : 'Description'}</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{node.description}</p>
              </div>
            )}

            {node.localizedNames && Object.keys(node.localizedNames).length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{language === 'ar' ? 'الأسماء المترجمة' : 'Localized Names'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(node.localizedNames).map(([locale, name]) => (
                    <div key={locale} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-xs text-gray-500 uppercase">{locale}</span>
                      <span className="text-gray-900 font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Network className="h-5 w-5 text-gray-400" />
                {language === 'ar' ? 'الآباء' : 'Parents'}
              </h3>
              {parents.length === 0 ? (
                <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                  {language === 'ar' ? 'لا يوجد آباء' : 'No parents'}
                </div>
              ) : (
                <div className="grid gap-3">
                  {parents.map(parent => (
                    <Link key={parent.nodeId} to={`/academic-taxonomy/${parent.nodeId}`} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Box className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{parent.canonicalName}</div>
                          <div className="text-xs text-gray-500 font-mono">{parent.canonicalCode}</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {translateNodeType(parent.nodeType)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Network className="h-5 w-5 text-gray-400" />
                {language === 'ar' ? 'الأبناء' : 'Children'}
              </h3>
              {children.length === 0 ? (
                <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                  {language === 'ar' ? 'لا يوجد أبناء' : 'No children'}
                </div>
              ) : (
                <div className="grid gap-3">
                  {children.map(child => (
                    <Link key={child.nodeId} to={`/academic-taxonomy/${child.nodeId}`} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Box className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{child.canonicalName}</div>
                          <div className="text-xs text-gray-500 font-mono">{child.canonicalCode}</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {translateNodeType(child.nodeType)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'aliases' && (
          <div className="py-12 text-center text-gray-500 max-w-md mx-auto">
            <Network className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>
              {language === 'ar' 
                ? 'ستظهر المرادفات هنا عند توفر واجهة القراءة الخاصة بها.' 
                : 'Aliases will appear here when read endpoints are available.'}
            </p>
          </div>
        )}

        {activeTab === 'mappings' && (
          <div className="py-12 text-center text-gray-500 max-w-md mx-auto">
            <Network className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>
              {language === 'ar' 
                ? 'ستظهر روابط ISCED/CIP هنا عند توفر واجهة القراءة الخاصة بها.' 
                : 'ISCED/CIP mappings will appear here when read endpoints are available.'}
            </p>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-6">
            <div className="bg-blue-50 text-blue-800 p-5 rounded-xl border border-blue-100 flex gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">
                  {language === 'ar' ? 'التحقق عبر واجهة المشرف' : 'Admin Validation API'}
                </h4>
                <p className="text-sm text-blue-700/80">
                  {language === 'ar' 
                    ? 'التحقق متاح عبر واجهة بيانات المشرف. لا يوجد نشر تلقائي في هذه المرحلة.' 
                    : 'Validation is available through the admin API. There is no auto-publish functionality here.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-amber-50 text-amber-800 p-5 rounded-xl border border-amber-200 flex gap-3">
              <PlayCircle className="h-6 w-6 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">
                  {language === 'ar' ? 'قيود مراجعة الاستيراد' : 'Import Review Constraints'}
                </h4>
                <p className="text-sm text-amber-700/80">
                  {language === 'ar' 
                    ? 'مراجعة الاستيراد ستستخدم دفعات Phase 06 المرحلية بدون نشر تلقائي.' 
                    : 'Import review will use Phase 06 staged batches without automatic publishing.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
