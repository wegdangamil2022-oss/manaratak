import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronLeft, GitBranch, Layers3, Loader2, Network, Search, Tag, Waypoints } from 'lucide-react';
import {
  AcademicStandardMappingDto,
  AcademicTaxonomyAliasDto,
  AcademicTaxonomyFilters,
  AcademicTaxonomyNodeDto,
  ApiClient,
} from '../../api/client';
import { AdminGuard } from './AdminStudyDestinationsPages';

const typeLabels: Record<AcademicTaxonomyNodeDto['nodeType'], string> = {
  ACADEMIC_FIELD: 'مجال أكاديمي',
  DISCIPLINE: 'تخصص تصنيفي',
  PROGRAM_AREA: 'منطقة برامج',
  SPECIALIZATION_CATEGORY: 'فئة تخصصية',
  STANDARD_CLASSIFICATION: 'تصنيف معياري',
};

const statusLabels: Record<AcademicTaxonomyNodeDto['status'], string> = {
  DRAFT: 'مسودة',
  READY_TO_REVIEW: 'جاهز للمراجعة',
  ACTIVE: 'نشط',
  ARCHIVED: 'مؤرشف',
};

export function AdminAcademicTaxonomyPage() {
  const [nodes, setNodes] = useState<AcademicTaxonomyNodeDto[]>([]);
  const [filters, setFilters] = useState<AcademicTaxonomyFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setNodes(await ApiClient.getAdminAcademicTaxonomyNodes(filters));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل التصنيف الأكاديمي');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void loadNodes(); }, [loadNodes]);

  const counts = useMemo(() => ({
    all: nodes.length,
    fields: nodes.filter(node => node.nodeType === 'ACADEMIC_FIELD').length,
    disciplines: nodes.filter(node => node.nodeType === 'DISCIPLINE').length,
    active: nodes.filter(node => node.status === 'ACTIVE').length,
  }), [nodes]);

  return (
    <AdminGuard>
      <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-sm font-bold text-sky-700">البيانات المرجعية · Phase 08</p><h1 className="text-2xl font-extrabold sm:text-4xl">التصنيف الأكاديمي</h1><p className="mt-2 text-sm text-slate-500">المصدر المرجعي للمجالات والتخصصات والتصنيفات التي تعتمد عليها المرحلة 10.</p></div>
            <Link to="/admin/majors" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0f4b3a] px-4 text-sm font-bold text-white">الانتقال للتخصصات <ChevronLeft className="h-4 w-4" /></Link>
          </div>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="إجمالي العقد" value={counts.all} icon={Network} />
            <Metric label="المجالات الأكاديمية" value={counts.fields} icon={Layers3} />
            <Metric label="التخصصات التصنيفية" value={counts.disciplines} icon={BookOpen} />
            <Metric label="العقد النشطة" value={counts.active} icon={Tag} />
          </section>
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
              <label className="relative"><Search className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" /><input value={filters.q || ''} onChange={event => setFilters(current => ({ ...current, q: event.target.value || undefined }))} placeholder="ابحث باسم العقدة أو الكود..." className="min-h-12 w-full rounded-xl border border-slate-200 pr-11 pl-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>
              <select value={filters.nodeType || ''} onChange={event => setFilters(current => ({ ...current, nodeType: event.target.value ? event.target.value as AcademicTaxonomyFilters['nodeType'] : undefined }))} className="min-h-12 rounded-xl border border-slate-200 px-3 text-sm"><option value="">كل أنواع العقد</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <select value={filters.status || ''} onChange={event => setFilters(current => ({ ...current, status: event.target.value ? event.target.value as AcademicTaxonomyFilters['status'] : undefined }))} className="min-h-12 rounded-xl border border-slate-200 px-3 text-sm"><option value="">كل الحالات</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </div>
          </section>
          {error && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
          {loading ? <div className="grid min-h-56 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-sky-700" /></div> : <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="hidden grid-cols-[1fr_180px_150px_130px_80px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 text-xs font-extrabold text-slate-500 md:grid"><span>العقدة</span><span>النوع</span><span>المعيار</span><span>الحالة</span><span>الإجراء</span></div>{nodes.map(node => <div key={node.nodeId} className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-0 md:grid-cols-[1fr_180px_150px_130px_80px] md:items-center md:gap-4 md:px-5"><div><strong className="block text-sm">{node.canonicalName}</strong><span className="font-mono text-xs text-slate-500">{node.canonicalCode}</span></div><span className="text-xs font-bold text-slate-600">{typeLabels[node.nodeType]}</span><span className="text-xs text-slate-600">{node.standardType || 'غير محدد'}{node.standardCode ? ` · ${node.standardCode}` : ''}</span><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${node.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{statusLabels[node.status]}</span><Link to={`/admin/academic-taxonomy/${node.nodeId}`} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-sky-200 px-3 text-xs font-bold text-sky-700">التفاصيل <ChevronLeft className="h-3.5 w-3.5" /></Link></div>)}</section>}
        </div>
      </main>
    </AdminGuard>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className="h-5 w-5 text-sky-700" /><span className="mt-3 block text-xs text-slate-500">{label}</span><strong className="mt-1 block text-2xl">{value}</strong></div>;
}

export function AdminAcademicTaxonomyDetailPage() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [node, setNode] = useState<AcademicTaxonomyNodeDto | null>(null);
  const [children, setChildren] = useState<AcademicTaxonomyNodeDto[]>([]);
  const [parents, setParents] = useState<AcademicTaxonomyNodeDto[]>([]);
  const [aliases, setAliases] = useState<AcademicTaxonomyAliasDto[]>([]);
  const [mappings, setMappings] = useState<AcademicStandardMappingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nodeId) return;
    setLoading(true);
    void Promise.all([
      ApiClient.getAdminAcademicTaxonomyNode(nodeId),
      ApiClient.getAdminAcademicTaxonomyChildren(nodeId),
      ApiClient.getAdminAcademicTaxonomyParents(nodeId),
      ApiClient.getAdminAcademicTaxonomyAliases(nodeId),
      ApiClient.getAdminAcademicTaxonomyMappings(nodeId),
    ]).then(([current, childNodes, parentNodes, nodeAliases, nodeMappings]) => {
      setNode(current); setChildren(childNodes); setParents(parentNodes); setAliases(nodeAliases); setMappings(nodeMappings);
    }).catch(err => setError(err instanceof Error ? err.message : 'تعذر تحميل تفاصيل العقدة')).finally(() => setLoading(false));
  }, [nodeId]);

  if (loading) return <AdminGuard><div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-sky-700" /></div></AdminGuard>;
  if (error || !node) return <AdminGuard><div dir="rtl" className="p-8 text-center text-rose-700">{error || 'العقدة غير موجودة'}</div></AdminGuard>;

  return <AdminGuard><main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}><div className="mx-auto max-w-7xl"><Link to="/admin/academic-taxonomy" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-700"><ArrowRight className="h-4 w-4" /> العودة للتصنيف</Link><header className="rounded-3xl bg-gradient-to-l from-[#123b58] to-[#0d172b] p-6 text-white shadow-lg sm:p-10"><p className="text-sm text-sky-200">{typeLabels[node.nodeType]} · {node.standardType || 'معيار مخصص'}</p><h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">{node.canonicalName}</h1><p className="mt-2 font-mono text-sm text-slate-300">{node.canonicalCode}{node.standardCode ? ` · ${node.standardCode}` : ''}</p></header><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"><section className="space-y-5"><Panel title="البيانات الأساسية" icon={Network}><div className="grid gap-4 sm:grid-cols-2"><Field label="الاسم المعتمد" value={node.canonicalName} /><Field label="النوع" value={typeLabels[node.nodeType]} /><Field label="الحالة" value={statusLabels[node.status]} /><Field label="المعيار" value={node.standardType || 'غير محدد'} /><Field label="الكود المعياري" value={node.standardCode || 'غير محدد'} /><Field label="الكود المرجعي" value={node.canonicalCode} /></div>{node.description && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{node.description}</p>}</Panel><Panel title="الهيكل الهرمي" icon={GitBranch}><RelationList title="العقد الأب" items={parents} empty="لا توجد عقد أب مسجلة." /><RelationList title="العقد الأبناء" items={children} empty="لا توجد عقد أبناء مسجلة." /></Panel><Panel title="الأسماء البديلة والخرائط" icon={Waypoints}><RelationList title={`المرادفات (${aliases.length})`} items={aliases.map(alias => ({ ...node, nodeId: alias.aliasId, canonicalName: alias.alias }))} empty="لا توجد مرادفات مسجلة." />{mappings.length === 0 ? <p className="mt-3 text-xs text-slate-500">لا توجد خرائط بين المعايير لهذه العقدة.</p> : <div className="mt-3 space-y-2">{mappings.map(mapping => <div key={mapping.mappingId} className="rounded-lg bg-slate-50 p-3 text-xs">{mapping.sourceStandard} → {mapping.targetStandard} · {mapping.strength}{mapping.confidence !== undefined ? ` · ثقة ${mapping.confidence}` : ''}</div>)}</div>}</Panel></section><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-extrabold text-slate-500">استخدامات التصنيف</h2><div className="mt-3 space-y-2 text-sm"><Link to="/admin/majors" className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 font-bold text-emerald-800"><BookOpen className="h-4 w-4" /> ربط التخصصات</Link><Link to="/admin/universities" className="flex items-center gap-2 rounded-lg px-3 py-3 text-slate-600 hover:bg-slate-50"><Layers3 className="h-4 w-4" /> البرامج والجامعات</Link></div><p className="mt-5 rounded-xl bg-sky-50 p-3 text-xs leading-6 text-sky-800">هذه البيانات مرجعية. المرحلة 10 تشير إلى معرف العقدة ولا تنشئ نسخة تصنيف محلية.</p></aside></div></div></main></AdminGuard>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="flex items-center gap-2 border-b border-slate-100 pb-4 text-xl font-extrabold"><Icon className="h-5 w-5 text-sky-700" />{title}</h2>{children}</section>; }
function Field({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><span className="block text-xs text-slate-500">{label}</span><strong className="mt-1 block text-sm">{value}</strong></div>; }
function RelationList({ title, items, empty }: { title: string; items: AcademicTaxonomyNodeDto[]; empty: string }) { return <div className="mt-4"><h3 className="text-sm font-bold text-slate-700">{title}</h3>{items.length === 0 ? <p className="mt-2 text-xs text-slate-500">{empty}</p> : <div className="mt-2 grid gap-2 sm:grid-cols-2">{items.map(item => <Link key={item.nodeId} to={`/admin/academic-taxonomy/${item.nodeId}`} className="rounded-xl border border-slate-200 p-3 hover:border-sky-300"><strong className="block text-sm">{item.canonicalName}</strong><span className="font-mono text-xs text-slate-500">{item.canonicalCode}</span></Link>)}</div>}</div>; }
