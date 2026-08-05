import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Database,
  Filter,
  GraduationCap,
  Layers3,
  Loader2,
  Search,
  UploadCloud,
} from 'lucide-react';
import { ApiClient } from '../../api/client';
import { getMajorDegreeTemplate } from '../majors/majorDegreeTemplates';
import { phase10MajorCatalogSamples } from './phase10MajorCatalogSamples';
import { phase10MajorSamples, Phase10MajorSample } from './phase10MajorSamples';

interface MajorListItem {
  id: string;
  displayName: string;
  nameAr?: string;
  nameEn?: string;
  code?: string;
  degreeLevel?: string;
  catalogKind?: string;
  collegeOrField?: string;
  academicFieldOrDiscipline?: string;
  collegeOrFaculty?: string;
  classificationCode?: string;
  status: string;
  completenessStatus?: string;
  sectionCount?: number;
  sourceType?: string;
  sourceFileName?: string;
  updatedAt?: string;
}

const degreeOptions = [
  { value: '', label: 'كل الدرجات' },
  { value: 'Bachelor', label: 'بكالوريوس' },
  { value: 'Master', label: 'ماجستير' },
  { value: 'Doctorate', label: 'دكتوراه' },
  { value: 'Fellowship', label: 'زمالة' },
];

const statusOptions = [
  { value: '', label: 'كل الحالات' },
  { value: 'READY_TO_REVIEW', label: 'تحتاج مراجعة' },
  { value: 'IMPORTED', label: 'مستوردة' },
  { value: 'READY_TO_PUBLISH', label: 'جاهزة للنشر' },
  { value: 'PUBLISHED', label: 'منشورة' },
  { value: 'ARCHIVED', label: 'مؤرشفة' },
];

const completenessOptions = [
  { value: '', label: 'كل مستويات الاكتمال' },
  { value: 'COMPLETE', label: 'مكتملة' },
  { value: 'NEEDS_REVIEW', label: 'تحتاج مراجعة' },
  { value: 'INCOMPLETE', label: 'ناقصة' },
];

function getObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeApiMajor(item: Record<string, unknown>): MajorListItem {
  const optionalFields = getObject(item.optionalFields);
  const localizedNames = getObject(optionalFields.localizedNames);
  const metadata = getObject(optionalFields.metadata);

  return {
    id: String(item.id ?? item.publicId ?? item.slug ?? ''),
    displayName: String(item.displayName ?? item.canonicalName ?? localizedNames.ar ?? localizedNames.en ?? 'تخصص بدون اسم'),
    nameAr: getString(localizedNames.ar),
    nameEn: getString(localizedNames.en),
    code: getString(item.classificationCode) ?? getString(optionalFields.classificationCode),
    degreeLevel: getString(item.degreeLevel) ?? getString(optionalFields.degreeLevel),
    catalogKind: getString(metadata.catalogKind),
    collegeOrField: getString(item.academicFieldOrDiscipline) ?? getString(item.collegeOrFaculty) ?? getString(optionalFields.collegeOrFaculty),
    academicFieldOrDiscipline: getString(item.academicFieldOrDiscipline) ?? getString(optionalFields.academicFieldOrDiscipline),
    collegeOrFaculty: getString(item.collegeOrFaculty) ?? getString(optionalFields.collegeOrFaculty),
    classificationCode: getString(item.classificationCode) ?? getString(optionalFields.classificationCode),
    status: String(item.status ?? 'READY_TO_REVIEW'),
    completenessStatus: getString(item.completenessStatus),
    sectionCount: typeof metadata.contentBlockCount === 'number' ? metadata.contentBlockCount : undefined,
    sourceType: getString(metadata.sourceImportMode),
    sourceFileName: getString(optionalFields.sourceFileName) ?? getString(metadata.sourceFileName),
    updatedAt: getString(item.updatedAt),
  };
}

function normalizeSample(sample: Phase10MajorSample): MajorListItem {
  return {
    ...sample,
    collegeOrField: sample.collegeOrField,
    classificationCode: sample.code,
  };
}

function getPhase10FallbackMajors(): MajorListItem[] {
  const byCode = new Map<string, Phase10MajorSample>();
  for (const item of phase10MajorCatalogSamples) byCode.set(item.code, item);
  for (const item of phase10MajorSamples) byCode.set(item.code, item);
  return Array.from(byCode.values()).map(normalizeSample);
}

function statusLabel(status?: string): string {
  return statusOptions.find((option) => option.value === status)?.label ?? status ?? 'غير محدد';
}

function completenessLabel(status?: string): string {
  return completenessOptions.find((option) => option.value === status)?.label ?? status ?? 'غير محدد';
}

function degreeLabel(level?: string): string {
  return degreeOptions.find((option) => option.value === level)?.label ?? level ?? 'غير محدد';
}

function DetailBadge({ count, sourceType }: { count?: number; sourceType?: string }) {
  const hasDetails = (count ?? 0) > 0 || sourceType === 'DETAIL_DOSSIER';
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${hasDetails ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
      {hasDetails ? 'لديه تفاصيل' : 'يحتاج تفاصيل'}
    </span>
  );
}

export function AdminMajorsPreviewPage() {
  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';
  const [majors, setMajors] = useState<MajorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSamples, setUsingSamples] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [degree, setDegree] = useState('');
  const [status, setStatus] = useState('');
  const [completeness, setCompleteness] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');

  useEffect(() => {
    if (!demoUnlocked) return;

    let cancelled = false;
    async function loadMajors() {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiClient.getAdminMajors({
          page: 1,
          pageSize: 500,
          degreeLevel: degree || undefined,
          status: status || undefined,
          completenessStatus: completeness || undefined,
          academicFieldOrDiscipline: fieldFilter || undefined,
          search: search || undefined,
        });
        const apiItems = Array.isArray(response.data)
          ? response.data.map((item) => normalizeApiMajor(item as Record<string, unknown>))
          : [];
        if (!cancelled) {
          setMajors(apiItems.length > 0 ? apiItems : getPhase10FallbackMajors());
          setUsingSamples(apiItems.length === 0);
        }
      } catch (loadError) {
        if (!cancelled) {
          setMajors(getPhase10FallbackMajors());
          setUsingSamples(true);
          setError(loadError instanceof Error ? loadError.message : 'تعذر الاتصال ببيانات التخصصات.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = window.setTimeout(() => void loadMajors(), 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [completeness, degree, demoUnlocked, fieldFilter, search, status]);

  const filteredMajors = useMemo(() => {
    const query = search.trim().toLowerCase();
    const fieldQuery = fieldFilter.trim().toLowerCase();
    return majors.filter((major) => {
      const matchesDegree = !degree || major.degreeLevel === degree;
      const matchesStatus = !status || major.status === status;
      const matchesCompleteness = !completeness || major.completenessStatus === completeness;
      const fieldText = [major.academicFieldOrDiscipline, major.collegeOrFaculty, major.collegeOrField].filter(Boolean).join(' ').toLowerCase();
      const text = [
        major.displayName,
        major.nameAr,
        major.nameEn,
        major.code,
        major.classificationCode,
        major.collegeOrField,
        major.sourceFileName,
      ].filter(Boolean).join(' ').toLowerCase();
      return matchesDegree && matchesStatus && matchesCompleteness && (!fieldQuery || fieldText.includes(fieldQuery)) && (!query || text.includes(query));
    });
  }, [completeness, degree, fieldFilter, majors, search, status]);

  const counts = useMemo(() => ({
    total: majors.length,
    bachelor: majors.filter((major) => major.degreeLevel === 'Bachelor').length,
    master: majors.filter((major) => major.degreeLevel === 'Master').length,
    doctorate: majors.filter((major) => major.degreeLevel === 'Doctorate').length,
    fellowship: majors.filter((major) => major.degreeLevel === 'Fellowship').length,
    withDetails: majors.filter((major) => (major.sectionCount ?? 0) > 0 || major.sourceType === 'DETAIL_DOSSIER').length,
    incomplete: majors.filter((major) => major.completenessStatus === 'INCOMPLETE' || major.completenessStatus === 'NEEDS_REVIEW').length,
  }), [majors]);

  if (!demoUnlocked) return <Navigate to="/login" replace />;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-5 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              المرحلة 10: مساحة عمل التخصصات
            </p>
            <h1 className="mt-3 text-[26px] font-black leading-9 sm:text-[34px]">التخصصات الأكاديمية</h1>
            <p className="mt-1 max-w-3xl text-[13px] leading-7 text-slate-500">
              إدارة التخصصات حسب الدرجة، المجال، الكلية، المصدر، حالة النشر، واكتمال تفاصيل الملف.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/admin/imports/majors" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-extrabold text-slate-800 shadow-sm hover:bg-slate-50">
              <UploadCloud className="h-4 w-4 text-blue-600" />
              مركز الاستيراد
            </Link>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0f5d48] px-4 text-[13px] font-extrabold text-white shadow-sm hover:bg-[#0b4c3b]">
              <GraduationCap className="h-4 w-4" />
              إضافة تخصص
            </button>
          </div>
        </header>

        {usingSamples && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[12px] leading-6 text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>تظهر الآن بيانات كتالوج المرحلة 10 كمعاينة احتياطية. بعد تشغيل الاستيراد والترقية ستظهر بيانات قاعدة البيانات مباشرة.</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-[12px] text-slate-500">
            ملاحظة الاتصال: {error}
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {[
            ['كل التخصصات', counts.total, ''],
            ['بكالوريوس', counts.bachelor, 'Bachelor'],
            ['ماجستير', counts.master, 'Master'],
            ['دكتوراه', counts.doctorate, 'Doctorate'],
            ['زمالة', counts.fellowship, 'Fellowship'],
            ['لديها تفاصيل', counts.withDetails, 'details'],
            ['تحتاج مراجعة', counts.incomplete, 'review'],
          ].map(([label, count, filter]) => (
            <button
              key={label}
              onClick={() => {
                if (filter === 'details') return;
                if (filter === 'review') {
                  setCompleteness('NEEDS_REVIEW');
                  return;
                }
                setDegree(typeof filter === 'string' ? filter : '');
              }}
              className="min-h-20 rounded-2xl border border-slate-200 bg-white p-3 text-right shadow-sm hover:border-emerald-300"
            >
              <span className="block text-[12px] font-bold text-slate-500">{label}</span>
              <span className="mt-1 block text-2xl font-black text-slate-950">{count}</span>
            </button>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-extrabold text-slate-700">
            <Filter className="h-4 w-4 text-emerald-700" />
            البحث والتصفية
          </div>
          <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_170px_170px_190px]">
            <label className="relative block">
              <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[13px] outline-none focus:border-emerald-500 focus:bg-white"
                placeholder="ابحث بالاسم، الرمز، الكلية أو الملف..."
              />
            </label>
            <input
              value={fieldFilter}
              onChange={(event) => setFieldFilter(event.target.value)}
              className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none focus:border-emerald-500 focus:bg-white"
              placeholder="فلترة المجال أو الكلية"
            />
            <select value={degree} onChange={(event) => setDegree(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold">
              {degreeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={completeness} onChange={(event) => setCompleteness(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold">
              {completenessOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
              <span className="text-[13px] font-bold">جاري تحميل التخصصات...</span>
            </div>
          ) : filteredMajors.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3 p-6 text-center">
              <BookOpen className="h-10 w-10 text-slate-300" />
              <p className="text-[14px] font-extrabold">لا توجد نتائج حسب الفلاتر الحالية.</p>
            </div>
          ) : (
            <div className="grid gap-3 p-3 lg:grid-cols-2">
              {filteredMajors.map((major) => {
                const template = getMajorDegreeTemplate(major.degreeLevel);
                const detailsCount = major.sectionCount ?? 0;
                return (
                  <article key={major.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-700">{major.code ?? major.classificationCode ?? 'NO-CODE'}</span>
                          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-800">{template.labelAr}</span>
                          <span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">{statusLabel(major.status)}</span>
                          <DetailBadge count={detailsCount} sourceType={major.sourceType} />
                        </div>
                        <h2 className="mt-3 text-[16px] font-black leading-7 text-slate-950">{major.displayName}</h2>
                        {major.nameEn && <p dir="ltr" className="mt-1 text-right text-[12px] font-semibold text-slate-500">{major.nameEn}</p>}
                      </div>
                      <Layers3 className="h-5 w-5 shrink-0 text-slate-300" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <span className="block font-bold text-slate-400">المجال/الكلية</span>
                        <span className="mt-1 block font-extrabold text-slate-800">{major.collegeOrField ?? 'غير محدد'}</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <span className="block font-bold text-slate-400">اكتمال البيانات</span>
                        <span className="mt-1 block font-extrabold text-slate-800">{completenessLabel(major.completenessStatus)}</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <span className="block font-bold text-slate-400">أقسام التفاصيل</span>
                        <span className="mt-1 block font-extrabold text-slate-800">{detailsCount > 0 ? `${detailsCount} قسم` : 'لا توجد تفاصيل'}</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <span className="block font-bold text-slate-400">قالب العرض</span>
                        <span className="mt-1 block font-extrabold text-slate-800">{degreeLabel(major.degreeLevel)}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[12px] text-slate-500">
                      <Database className="h-4 w-4 text-slate-400" />
                      <span>آخر مصدر: <strong className="text-slate-700">{major.sourceFileName ?? major.sourceType ?? 'قاعدة البيانات'}</strong></span>
                    </div>

                    <Link to={`/admin/majors/${major.id}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-4 text-[13px] font-extrabold text-white hover:bg-[#111827]">
                      فتح التفاصيل
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
