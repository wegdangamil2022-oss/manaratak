import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  GitCompare,
  Globe,
  Layers3,
  Loader2,
  Pencil,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { ApiClient } from '../../api/client';
import { phase10MajorCatalogSamples } from './phase10MajorCatalogSamples';
import { findPhase10MajorSample, Phase10MajorSample, Phase10MajorSection } from './phase10MajorSamples';

interface MajorDetailState {
  id: string;
  displayName: string;
  nameAr?: string;
  nameEn?: string;
  code?: string;
  degreeLevel?: string;
  collegeOrField?: string;
  status: string;
  completenessStatus?: string;
  sourceFileName?: string;
  sourceType?: string;
}

interface MajorProfileLike {
  id?: string;
  level?: string;
  code?: string;
  displayName?: string;
  collegeContext?: string;
  status?: string;
  completenessStatus?: string;
}

interface MajorVersionLike {
  id?: string;
  versionNumber?: number;
  status?: string;
  sourceFileName?: string;
  sourceHash?: string;
  importedAt?: string;
}

interface MajorSourceLike {
  id?: string;
  sourceType?: string;
  sourceName?: string;
  sourceHash?: string;
  importedAt?: string;
}

type DetailTab = 'basic' | 'profile' | 'content' | 'sources';

const tabs: Array<{ id: DetailTab; label: string; icon: typeof BookOpen }> = [
  { id: 'basic', label: 'البيانات الأساسية', icon: BookOpen },
  { id: 'profile', label: 'ملف الدرجة', icon: Layers3 },
  { id: 'content', label: 'المحتوى التفصيلي', icon: FileText },
  { id: 'sources', label: 'المصادر والنسخ', icon: GitCompare },
];

function normalizeMajor(value: Record<string, unknown>, id: string): MajorDetailState {
  const optionalFields = typeof value.optionalFields === 'object' && value.optionalFields ? value.optionalFields as Record<string, unknown> : {};
  const localizedNames = typeof optionalFields.localizedNames === 'object' && optionalFields.localizedNames
    ? optionalFields.localizedNames as Record<string, unknown>
    : {};
  const metadata = typeof optionalFields.metadata === 'object' && optionalFields.metadata ? optionalFields.metadata as Record<string, unknown> : {};

  return {
    id: String(value.id ?? id),
    displayName: String(value.displayName ?? value.canonicalName ?? localizedNames.ar ?? localizedNames.en ?? 'تخصص بدون اسم'),
    nameAr: typeof localizedNames.ar === 'string' ? localizedNames.ar : undefined,
    nameEn: typeof localizedNames.en === 'string' ? localizedNames.en : undefined,
    code: typeof value.classificationCode === 'string' ? value.classificationCode : undefined,
    degreeLevel: typeof value.degreeLevel === 'string' ? value.degreeLevel : undefined,
    collegeOrField: typeof value.academicFieldOrDiscipline === 'string'
      ? value.academicFieldOrDiscipline
      : typeof value.collegeOrFaculty === 'string'
        ? value.collegeOrFaculty
        : undefined,
    status: String(value.status ?? 'READY_TO_REVIEW'),
    completenessStatus: typeof value.completenessStatus === 'string' ? value.completenessStatus : undefined,
    sourceType: typeof metadata.sourceImportMode === 'string' ? metadata.sourceImportMode : undefined,
  };
}

function sampleToMajor(sample: Phase10MajorSample): MajorDetailState {
  return {
    id: sample.id,
    displayName: sample.nameAr,
    nameAr: sample.nameAr,
    nameEn: sample.nameEn,
    code: sample.code,
    degreeLevel: sample.degreeLevel,
    collegeOrField: sample.collegeOrField,
    status: sample.status,
    completenessStatus: sample.completenessStatus,
    sourceFileName: sample.sourceFileName,
    sourceType: sample.sourceType,
  };
}

function statusLabel(value: string | undefined): string {
  const map: Record<string, string> = {
    READY_TO_REVIEW: 'تحتاج مراجعة',
    NEEDS_REVIEW: 'تحتاج مراجعة',
    IMPORTED: 'مستوردة',
    READY_TO_PUBLISH: 'جاهزة للنشر',
    PUBLISHED: 'منشورة',
    ARCHIVED: 'مؤرشفة',
  };
  return value ? map[value] ?? value : 'غير محدد';
}

function degreeLabel(value: string | undefined): string {
  const map: Record<string, string> = {
    Bachelor: 'بكالوريوس',
    Master: 'ماجستير',
    Doctorate: 'دكتوراه',
    Fellowship: 'زمالة',
  };
  return value ? map[value] ?? value : 'غير محدد';
}

function FieldCard({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <span className="block text-[12px] font-bold text-slate-400">{label}</span>
      <span className="mt-1 block break-words text-[14px] font-extrabold leading-6 text-slate-900">{value || 'غير محدد'}</span>
    </div>
  );
}

export function AdminMajorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const demoUnlocked = localStorage.getItem('manaratak_demo_role') === 'admin';
  const detailSample = findPhase10MajorSample(id);
  const catalogSample = phase10MajorCatalogSamples.find((major) => major.id === id || major.code === id);
  const sample = detailSample ?? catalogSample;
  const [activeTab, setActiveTab] = useState<DetailTab>('basic');
  const [major, setMajor] = useState<MajorDetailState | null>(sample ? sampleToMajor(sample) : null);
  const [profiles, setProfiles] = useState<MajorProfileLike[]>(sample ? [{
    id: `${sample.id}-profile`,
    level: sample.degreeLevel,
    code: sample.code,
    displayName: sample.nameAr,
    collegeContext: sample.collegeOrField,
    status: sample.status,
    completenessStatus: sample.completenessStatus,
  }] : []);
  const [sections, setSections] = useState<Phase10MajorSection[]>(sample?.contentSections ?? []);
  const [versions, setVersions] = useState<MajorVersionLike[]>(sample ? [{
    id: `${sample.id}-version-1`,
    versionNumber: 1,
    status: 'NEEDS_REVIEW',
    sourceFileName: sample.sourceFileName,
    importedAt: sample.updatedAt,
  }] : []);
  const [sources, setSources] = useState<MajorSourceLike[]>(sample ? [{
    id: `${sample.id}-source-1`,
    sourceType: sample.sourceType,
    sourceName: sample.sourceFileName,
    importedAt: sample.updatedAt,
  }] : []);
  const [loading, setLoading] = useState(!sample);
  const [usingSample, setUsingSample] = useState(Boolean(sample));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!demoUnlocked || !id || sample) return;

    let cancelled = false;
    const majorId = id;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const [majorResult, profileResult, sectionResult, versionResult, sourceResult] = await Promise.all([
          ApiClient.getAdminMajorById(majorId),
          ApiClient.getAdminMajorProfiles(majorId),
          ApiClient.getAdminMajorContentSections(majorId),
          ApiClient.getAdminMajorVersions(majorId),
          ApiClient.getAdminMajorSources(majorId),
        ]);
        if (cancelled) return;
        setMajor(normalizeMajor(majorResult as Record<string, unknown>, majorId));
        setProfiles(Array.isArray(profileResult.data) ? profileResult.data as MajorProfileLike[] : []);
        setSections(Array.isArray(sectionResult.data) ? sectionResult.data as Phase10MajorSection[] : []);
        setVersions(Array.isArray(versionResult.data) ? versionResult.data as MajorVersionLike[] : []);
        setSources(Array.isArray(sourceResult.data) ? sourceResult.data as MajorSourceLike[] : []);
        setUsingSample(false);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل تفاصيل التخصص.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDetail();
    return () => {
      cancelled = true;
    };
  }, [demoUnlocked, id, sample]);

  const contentGroups = useMemo(() => {
    const important = sections.slice(0, 6);
    const remaining = sections.slice(6);
    return { important, remaining };
  }, [sections]);

  if (!demoUnlocked) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f7f8fa] text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
          <span className="text-[13px] font-bold">جاري تحميل تفاصيل التخصص...</span>
        </div>
      </main>
    );
  }

  if (!major) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-white p-6 text-center">
          <p className="text-[14px] font-extrabold text-rose-700">لم يتم العثور على التخصص.</p>
          <Link to="/admin/majors" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 text-[13px] font-bold text-white">العودة للقائمة</Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-5 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="mx-auto max-w-7xl space-y-5">
        <Link to="/admin/majors" className="inline-flex items-center gap-2 text-[13px] font-extrabold text-slate-600 hover:text-emerald-800">
          <ArrowRight className="h-4 w-4" />
          العودة إلى التخصصات
        </Link>

        <header className="rounded-3xl bg-[#071322] p-5 text-white shadow-lg sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-[12px] font-bold">{major.code ?? 'NO-CODE'}</span>
                <span className="rounded-lg bg-emerald-400/15 px-2.5 py-1 text-[12px] font-bold text-emerald-200">{degreeLabel(major.degreeLevel)}</span>
                <span className="rounded-lg bg-blue-400/15 px-2.5 py-1 text-[12px] font-bold text-blue-200">{statusLabel(major.status)}</span>
              </div>
              <h1 className="mt-4 text-2xl font-black leading-9 sm:text-4xl">{major.displayName}</h1>
              {major.nameEn && <p dir="ltr" className="mt-2 text-right text-[14px] font-semibold text-slate-300">{major.nameEn}</p>}
              <p className="mt-3 max-w-3xl text-[13px] leading-7 text-slate-300">
                صفحة موحدة تعرض التفاصيل حسب نوع الدرجة. لا يتم فرض أقسام البكالوريوس على الماجستير أو الدكتوراه أو الزمالة.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-4 lg:min-w-[460px]">
              <FieldCard label="أقسام التفاصيل" value={sections.length} />
              <FieldCard label="النسخ" value={versions.length} />
              <FieldCard label="المصادر" value={sources.length} />
              <FieldCard label="المراجعة" value={statusLabel(major.completenessStatus)} />
            </div>
          </div>
        </header>

        {usingSample && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[12px] leading-6 text-amber-900">
            {sections.length > 0
              ? `هذه تفاصيل معاينة من ملف المرحلة 10: ${major.sourceFileName}. بعد استيراد السجلات واعتمادها ستظهر نفس الأقسام من قاعدة البيانات.`
              : `هذا التخصص موجود في كتالوج المرحلة 10: ${major.sourceFileName}. لم يتم إرفاق ملف تفاصيل له بعد.`}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[12px] leading-6 text-rose-800">
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 px-2 text-[12px] font-extrabold text-slate-400">أقسام ملف التخصص</div>
            <nav className="grid gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-h-11 items-center gap-2 rounded-xl px-3 text-right text-[13px] font-extrabold ${selected ? 'bg-emerald-50 text-emerald-900' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <h2 className="text-[18px] font-black">البيانات الأساسية</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldCard label="الاسم العربي" value={major.nameAr ?? major.displayName} />
                  <FieldCard label="الاسم الإنجليزي" value={major.nameEn} />
                  <FieldCard label="الرمز" value={major.code} />
                  <FieldCard label="الدرجة" value={degreeLabel(major.degreeLevel)} />
                  <FieldCard label="المجال/الكلية" value={major.collegeOrField} />
                  <FieldCard label="حالة النشر" value={statusLabel(major.status)} />
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-[18px] font-black">ملف الدرجة</h2>
                <div className="grid gap-3">
                  {profiles.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-500">لم يتم إنشاء ملف درجة بعد.</p>
                  ) : profiles.map((profile) => (
                    <article key={profile.id ?? profile.code} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-white px-2 py-1 font-mono text-[12px] font-bold">{profile.code ?? major.code}</span>
                        <span className="rounded-lg bg-emerald-100 px-2 py-1 text-[12px] font-bold text-emerald-800">{degreeLabel(profile.level ?? major.degreeLevel)}</span>
                      </div>
                      <h3 className="mt-3 text-[15px] font-black">{profile.displayName ?? major.displayName}</h3>
                      <p className="mt-1 text-[13px] text-slate-500">السياق: {profile.collegeContext ?? major.collegeOrField ?? 'غير محدد'}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-[18px] font-black">المحتوى التفصيلي</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-600">{sections.length} قسم محفوظ</span>
                </div>

                {sections.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-500">لا توجد أقسام تفاصيل لهذا التخصص بعد.</p>
                ) : (
                  <>
                    <div className="grid gap-3">
                      {contentGroups.important.map((section) => (
                        <article key={section.sectionKey} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-[15px] font-black leading-7">{section.title}</h3>
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">{statusLabel(section.reviewStatus)}</span>
                          </div>
                          <p className="mt-2 text-[13px] leading-7 text-slate-600">{section.content}</p>
                        </article>
                      ))}
                    </div>

                    {contentGroups.remaining.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-[14px] font-black text-slate-700">أقسام إضافية من الملف</h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {contentGroups.remaining.map((section) => (
                            <div key={section.sectionKey} className="rounded-xl border border-slate-100 bg-white p-3">
                              <span className="text-[13px] font-extrabold text-slate-800">{section.title}</span>
                              <p className="mt-1 line-clamp-2 text-[12px] leading-6 text-slate-500">{section.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <h2 className="flex items-center gap-2 text-[18px] font-black"><UploadCloud className="h-5 w-5 text-emerald-700" /> المصادر</h2>
                  {sources.length === 0 ? <p className="rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-500">لا توجد مصادر.</p> : sources.map((source) => (
                    <article key={source.id ?? source.sourceName} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[13px]">
                      <p className="font-extrabold text-slate-900">{source.sourceName ?? major.sourceFileName ?? 'مصدر غير محدد'}</p>
                      <p className="mt-1 text-slate-500">النوع: {source.sourceType ?? major.sourceType ?? 'غير محدد'}</p>
                      {source.sourceHash && <p className="mt-1 break-all font-mono text-[11px] text-slate-400">البصمة: {source.sourceHash}</p>}
                    </article>
                  ))}
                </div>

                <div className="space-y-3">
                  <h2 className="flex items-center gap-2 text-[18px] font-black"><Database className="h-5 w-5 text-blue-700" /> النسخ والتغييرات</h2>
                  {versions.length === 0 ? <p className="rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-500">لا توجد نسخ.</p> : versions.map((version) => (
                    <article key={version.id ?? version.versionNumber} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[13px]">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-extrabold text-slate-900">نسخة {version.versionNumber ?? 1}</p>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">{statusLabel(version.status)}</span>
                      </div>
                      <p className="mt-1 text-slate-500">{version.sourceFileName ?? major.sourceFileName ?? 'ملف غير محدد'}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-extrabold text-slate-800 hover:bg-slate-50">
            <Pencil className="h-4 w-4" />
            تعديل
          </button>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-[13px] font-extrabold text-white hover:bg-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            اعتماد للمراجعة
          </button>
          <a href={`/majors/${major.id}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-[13px] font-extrabold text-white hover:bg-slate-800">
            <Globe className="h-4 w-4" />
            فتح الصفحة العامة
          </a>
        </div>
      </div>
    </main>
  );
}
