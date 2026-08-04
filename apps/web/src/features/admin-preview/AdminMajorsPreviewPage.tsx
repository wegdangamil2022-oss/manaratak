import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Filter,
  GraduationCap,
  Layers3,
  Loader2,
  Search,
  UploadCloud,
} from 'lucide-react';
import { ApiClient } from '../../api/client';
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

function normalizeApiMajor(item: Record<string, unknown>): MajorListItem {
  const optionalFields = typeof item.optionalFields === 'object' && item.optionalFields ? item.optionalFields as Record<string, unknown> : {};
  const localizedNames = typeof optionalFields.localizedNames === 'object' && optionalFields.localizedNames
    ? optionalFields.localizedNames as Record<string, unknown>
    : {};
  const metadata = typeof optionalFields.metadata === 'object' && optionalFields.metadata ? optionalFields.metadata as Record<string, unknown> : {};

  return {
    id: String(item.id ?? item.publicId ?? item.slug ?? ''),
    displayName: String(item.displayName ?? item.canonicalName ?? localizedNames.ar ?? localizedNames.en ?? 'تخصص بدون اسم'),
    nameAr: typeof localizedNames.ar === 'string' ? localizedNames.ar : undefined,
    nameEn: typeof localizedNames.en === 'string' ? localizedNames.en : undefined,
    code: typeof item.classificationCode === 'string' ? item.classificationCode : undefined,
    degreeLevel: typeof item.degreeLevel === 'string' ? item.degreeLevel : undefined,
    catalogKind: typeof metadata.catalogKind === 'string' ? metadata.catalogKind : undefined,
    collegeOrField: typeof item.academicFieldOrDiscipline === 'string'
      ? item.academicFieldOrDiscipline
      : typeof item.collegeOrFaculty === 'string'
        ? item.collegeOrFaculty
        : undefined,
    academicFieldOrDiscipline: typeof item.academicFieldOrDiscipline === 'string' ? item.academicFieldOrDiscipline : undefined,
    collegeOrFaculty: typeof item.collegeOrFaculty === 'string' ? item.collegeOrFaculty : undefined,
    classificationCode: typeof item.classificationCode === 'string' ? item.classificationCode : undefined,
    status: String(item.status ?? 'READY_TO_REVIEW'),
    completenessStatus: typeof item.completenessStatus === 'string' ? item.completenessStatus : undefined,
    sectionCount: typeof metadata.contentBlockCount === 'number' ? metadata.contentBlockCount : undefined,
    sourceType: typeof metadata.sourceImportMode === 'string' ? metadata.sourceImportMode : undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
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
  for (const item of phase10MajorCatalogSamples) {
    byCode.set(item.code, item);
  }
  for (const item of phase10MajorSamples) {
    byCode.set(item.code, item);
  }
  return Array.from(byCode.values()).map(normalizeSample);
}

function statusLabel(status: string): string {
  const match = statusOptions.find((option) => option.value === status);
  return match?.label ?? status;
}

function degreeLabel(level: string | undefined): string {
  return degreeOptions.find((option) => option.value === level)?.label ?? level ?? 'غير محدد';
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

  useEffect(() => {
    if (!demoUnlocked) return;

    let cancelled = false;
    async function loadMajors() {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiClient.getAdminMajors({ page: 1, pageSize: 200 });
        const apiItems = Array.isArray(response.data) ? response.data.map((item) => normalizeApiMajor(item as Record<string, unknown>)) : [];
        if (!cancelled) {
          setMajors(apiItems.length > 0 ? apiItems : getPhase10FallbackMajors());
          setUsingSamples(apiItems.length === 0);
        }
      } catch (loadError) {
        if (!cancelled) {
          setMajors(getPhase10FallbackMajors());
          setUsingSamples(true);
          setError(loadError instanceof Error ? loadError.message : 'تعذر الاتصال بالبيانات، تم عرض عينات المرحلة 10.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadMajors();
    return () => {
      cancelled = true;
    };
  }, [demoUnlocked]);

  const filteredMajors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return majors.filter((major) => {
      const matchesDegree = !degree || major.degreeLevel === degree;
      const matchesStatus = !status || major.status === status;
      const text = [
        major.displayName,
        major.nameAr,
        major.nameEn,
        major.code,
        major.classificationCode,
        major.collegeOrField,
        major.sourceFileName,
      ].filter(Boolean).join(' ').toLowerCase();
      return matchesDegree && matchesStatus && (!query || text.includes(query));
    });
  }, [degree, majors, search, status]);

  const counts = useMemo(() => ({
    total: majors.length,
    bachelor: majors.filter((major) => major.degreeLevel === 'Bachelor').length,
    master: majors.filter((major) => major.degreeLevel === 'Master').length,
    doctorate: majors.filter((major) => major.degreeLevel === 'Doctorate').length,
    fellowship: majors.filter((major) => major.degreeLevel === 'Fellowship').length,
    withDetails: majors.filter((major) => (major.sectionCount ?? 0) > 0 || major.sourceType === 'DETAIL_DOSSIER').length,
  }), [majors]);

  if (!demoUnlocked) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-5 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              المرحلة 10: كتالوج التخصصات
            </p>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">التخصصات الأكاديمية</h1>
            <p className="mt-1 text-[13px] leading-6 text-slate-500">
              إدارة التخصصات حسب الدرجة، الكلية، المصدر، وحالة اكتمال التفاصيل.
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
            <span>تظهر الآن بيانات كتالوج المرحلة 10 كاملة، مع تفاصيل كاملة لأول 10 من كل درجة. بعد تشغيل الاستيراد ستظهر بيانات قاعدة البيانات بدل المعاينة.</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-[12px] text-slate-500">
            ملاحظة الاتصال: {error}
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['كل التخصصات', counts.total, ''],
            ['بكالوريوس', counts.bachelor, 'Bachelor'],
            ['ماجستير', counts.master, 'Master'],
            ['دكتوراه', counts.doctorate, 'Doctorate'],
            ['زمالة', counts.fellowship, 'Fellowship'],
            ['لديها تفاصيل', counts.withDetails, ''],
          ].map(([label, count, filter]) => (
            <button
              key={label}
              onClick={() => typeof filter === 'string' && filter ? setDegree(filter) : undefined}
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
            التصفية والبحث
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <label className="relative block">
              <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[13px] outline-none focus:border-emerald-500 focus:bg-white"
                placeholder="ابحث بالاسم، الرمز، الكلية أو اسم الملف..."
              />
            </label>
            <select value={degree} onChange={(event) => setDegree(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold">
              {degreeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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
              {filteredMajors.map((major) => (
                <article key={major.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-700">{major.code ?? major.classificationCode ?? 'NO-CODE'}</span>
                        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-800">{degreeLabel(major.degreeLevel)}</span>
                        <span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">{statusLabel(major.status)}</span>
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
                      <span className="block font-bold text-slate-400">أقسام التفاصيل</span>
                      <span className="mt-1 block font-extrabold text-slate-800">{major.sectionCount ?? 'قيد القراءة'}</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[12px] text-slate-500">
                    آخر مصدر: <span className="font-bold text-slate-700">{major.sourceFileName ?? major.sourceType ?? 'قاعدة البيانات'}</span>
                  </div>

                  <Link to={`/admin/majors/${major.id}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-4 text-[13px] font-extrabold text-white hover:bg-[#111827]">
                    فتح التفاصيل
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
