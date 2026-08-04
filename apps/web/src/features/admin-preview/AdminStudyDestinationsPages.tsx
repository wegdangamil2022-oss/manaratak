import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  WalletCards,
} from 'lucide-react';
import { ApiClient, ReferenceCountryDto } from '../../api/client';

interface CountryMetadata {
  studyDestinationCandidate?: boolean;
  destinationReviewStatus?: string;
  publicVisible?: boolean;
  publicStatus?: string;
  source?: string;
}

interface RelatedCounts {
  universities: number;
  scholarships: number;
}

const getMetadata = (country: ReferenceCountryDto): CountryMetadata => {
  const metadata = country.metadata;
  if (!metadata || typeof metadata !== 'object') return {};
  return metadata as CountryMetadata;
};

const statusLabel = (country: ReferenceCountryDto, arabic: boolean) => {
  const metadata = getMetadata(country);
  if (metadata.publicVisible) return arabic ? 'منشورة للعامة' : 'Public';
  if (metadata.studyDestinationCandidate) return arabic ? 'مرشحة لوجهة دراسة' : 'Study destination candidate';
  return arabic ? 'بيانات مرجعية' : 'Reference data';
};

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('manaratak_demo_role') === 'admin' ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AdminStudyDestinationsPage() {
  const [countries, setCountries] = useState<ReferenceCountryDto[]>([]);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCountries(await ApiClient.getAdminReferenceCountries({ q: query.trim() || undefined, region: region || undefined }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل الدول');
    } finally {
      setLoading(false);
    }
  }, [query, region]);

  useEffect(() => {
    void loadCountries();
  }, [loadCountries]);

  const regions = useMemo(() => Array.from(new Set(countries.map(country => country.region).filter(Boolean))).sort(), [countries]);
  const visibleCountries = countries.filter(country => {
    const metadata = getMetadata(country);
    if (status === 'candidate') return metadata.studyDestinationCandidate === true;
    if (status === 'public') return metadata.publicVisible === true;
    return true;
  });

  return (
    <AdminGuard>
      <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-emerald-700">البيانات المرجعية · Phase 07</p>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">دول الدراسة</h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">إدارة ملفات الدول المرجعية وربطها بمحتوى المنصة.</p>
            </div>
            <button onClick={() => void loadCountries()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:border-emerald-300">
              <RefreshCw className="h-4 w-4" /> تحديث
            </button>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder="البحث باسم الدولة، الرمز (ISO2/ISO3) أو المنطقة..." className="min-h-12 w-full rounded-xl border border-slate-200 bg-white pr-11 pl-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500"><Filter className="h-4 w-4" /> فلاتر</div>
              <select value={region} onChange={event => setRegion(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option value="">كل المناطق</option>
                {regions.map(item => <option key={item} value={item ?? ''}>{item}</option>)}
              </select>
              <select value={status} onChange={event => setStatus(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option value="">كل الحالات</option>
                <option value="candidate">مرشحة لوجهة دراسة</option>
                <option value="public">منشورة للعامة</option>
              </select>
            </div>
          </section>

          {error && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
          {loading ? <div className="grid min-h-56 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div> : (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleCountries.map(country => <CountryCard key={country.iso2Code} country={country} />)}
            </section>
          )}
          {!loading && visibleCountries.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">لا توجد دول مطابقة للفلاتر.</div>}
        </div>
      </main>
    </AdminGuard>
  );
}

function CountryCard({ country }: { country: ReferenceCountryDto }) {
  const metadata = getMetadata(country);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{country.name} <span className="font-mono text-sm text-slate-500">{country.iso2Code}</span></h2>
          <p className="mt-1 text-xs text-slate-500">{country.iso3Code} · {country.region || 'غير محدد'} · {country.subregion || 'غير محدد'}</p>
        </div>
        {metadata.publicVisible ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <Globe2 className="h-5 w-5 shrink-0 text-slate-400" />}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div><span className="block text-slate-400">اللغة الافتراضية</span><strong>{country.defaultLanguageCode || 'غير محددة'}</strong></div>
        <div><span className="block text-slate-400">العملة</span><strong>{country.defaultCurrencyCode || 'غير محددة'}</strong></div>
        <div><span className="block text-slate-400">رمز الاتصال</span><strong dir="ltr">{country.callingCode || 'غير محدد'}</strong></div>
        <div><span className="block text-slate-400">الحالة</span><strong>{statusLabel(country, true)}</strong></div>
      </div>
      <Link to={`/study-destinations/${country.iso2Code}`} className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0f4b3a] px-4 text-sm font-bold text-white hover:bg-[#0b3d2f]">
        فتح ملف الدولة <ChevronLeft className="h-4 w-4" />
      </Link>
    </article>
  );
}

export function AdminStudyDestinationDetailPage() {
  const { countryIso2Code } = useParams<{ countryIso2Code: string }>();
  const [country, setCountry] = useState<ReferenceCountryDto | null>(null);
  const [counts, setCounts] = useState<RelatedCounts>({ universities: 0, scholarships: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryIso2Code) return;
    setLoading(true);
    void ApiClient.getAdminReferenceCountry(countryIso2Code)
      .then(async value => {
        setCountry(value);
        const countryKeys = Array.from(new Set([value.name, value.officialName, value.iso2Code, value.iso3Code].filter(Boolean))) as string[];
        const related = await Promise.all(countryKeys.flatMap(key => [
          ApiClient.getUniversities({ country: key, page: 1, pageSize: 1 }).catch(() => ({ total: 0 })),
          ApiClient.getScholarships({ studyCountry: key, page: 1, pageSize: 1 }).catch(() => ({ total: 0 })),
        ]));
        setCounts({
          universities: related.filter((_result, index) => index % 2 === 0).reduce((total, result) => total + (result.total || 0), 0),
          scholarships: related.filter((_result, index) => index % 2 === 1).reduce((total, result) => total + (result.total || 0), 0),
        });
      })
      .catch(err => setError(err instanceof Error ? err.message : 'تعذر تحميل ملف الدولة'))
      .finally(() => setLoading(false));
  }, [countryIso2Code]);

  if (loading) return <AdminGuard><div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div></AdminGuard>;
  if (error || !country) return <AdminGuard><div dir="rtl" className="p-8 text-center text-rose-700">{error || 'الدولة غير موجودة'}</div></AdminGuard>;

  const sections = [
    { label: 'الجامعات', icon: Building2, count: counts.universities, to: `/admin/universities?country=${encodeURIComponent(country.name)}` },
    { label: 'التخصصات', icon: BookOpen, detail: 'تظهر التخصصات العامة هنا عبر Phase 10، أما البرامج داخل جامعات الدولة فتتبع Phase 11.', to: '/admin/majors' },
    { label: 'المنح الدراسية', icon: GraduationCap, count: counts.scholarships, to: `/admin/scholarships?studyCountry=${encodeURIComponent(country.name)}` },
    { label: 'الاختبارات الدولية', icon: FileText, detail: 'يمكن ربط الاختبار بالدول عبر ملف الاختبار ومراكز التقديم عند توفر العلاقة.', to: '/admin/international-tests' },
    { label: 'الدورات التدريبية', icon: BookOpen, detail: 'الدورات ترتبط بالتخصصات أو المسارات التعليمية، وليس بالدولة المرجعية تلقائيًا.', to: '/admin/courses' },
    { label: 'التكاليف والمعيشة', icon: WalletCards, detail: 'تحتاج مصدرًا موثقًا ونسخة زمنية قبل نشرها للعامة.', to: '/admin/study-destinations' },
  ];

  return (
    <AdminGuard>
      <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 text-slate-900 sm:px-6 lg:px-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="mx-auto max-w-7xl">
          <Link to="/study-destinations" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700"><ArrowRight className="h-4 w-4" /> العودة إلى الدول</Link>
          <header className="rounded-3xl bg-gradient-to-l from-[#063e35] to-[#0d172b] p-6 text-white shadow-lg sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="mb-2 text-sm text-emerald-200">Republic reference profile · {country.iso2Code}</p><h1 className="text-3xl font-extrabold sm:text-5xl">{country.name}</h1><p className="mt-2 text-sm text-slate-300">{country.officialName || country.name} · {country.region || 'غير محدد'}</p></div>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-100">{statusLabel(country, true)}</span>
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="border-b border-slate-100 pb-4 text-2xl font-extrabold">البيانات المرجعية</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DetailField label="الاسم" value={country.name} /><DetailField label="الاسم الرسمي" value={country.officialName || 'غير متوفر'} />
                <DetailField label="ISO 2 Code" value={country.iso2Code} /><DetailField label="ISO 3 Code" value={country.iso3Code} />
                <DetailField label="المنطقة" value={country.region || 'غير محددة'} /><DetailField label="المنطقة الفرعية" value={country.subregion || 'غير محددة'} />
                <DetailField label="اللغة الافتراضية" value={country.defaultLanguageCode || 'غير محددة'} /><DetailField label="العملة الافتراضية" value={country.defaultCurrencyCode || 'غير محددة'} />
                <DetailField label="رمز الاتصال" value={country.callingCode || 'غير محدد'} />
              </div>
              <h2 className="mt-8 border-b border-slate-100 pb-4 text-2xl font-extrabold">علاقات المراحل</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {sections.map(section => <Link key={section.label} to={section.to} className="flex min-h-24 items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"><section.icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><span><strong className="block text-sm">{section.label}{section.count !== undefined ? ` (${section.count})` : ''}</strong><small className="mt-1 block text-xs leading-5 text-slate-500">{section.detail || 'بيانات مرتبطة من مصدرها، ويمكن فتح القسم لمراجعتها.'}</small></span><ChevronLeft className="mr-auto mt-1 h-4 w-4 text-slate-400" /></Link>)}
              </div>
            </section>
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-extrabold text-slate-500">أقسام ملف الدولة</h2><nav className="mt-3 space-y-1">{['البيانات المرجعية', 'الجامعات', 'التخصصات', 'المنح الدراسية', 'الاختبارات', 'تكلفة المعيشة', 'المصادر والتدقيق'].map((label, index) => <div key={label} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${index === 0 ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-slate-600'}`}><MapPin className="h-4 w-4" />{label}</div>)}</nav><div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-500">الدولة المرجعية لا تصبح وجهة دراسة منشورة تلقائيًا. يلزم اعتمادها ومراجعة مصادرها قبل الظهور العام.</div></aside>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4"><span className="block text-xs text-slate-500">{label}</span><strong className="mt-1 block text-base" dir="auto">{value}</strong></div>;
}
