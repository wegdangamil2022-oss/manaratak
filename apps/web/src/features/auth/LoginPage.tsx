import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../../i18n/I18nProvider";
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  Info, 
  Sparkles, 
  ShieldAlert,
  GraduationCap,
  School
} from 'lucide-react';

type LoginRole = 'student' | 'admin';

export function LoginPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const isRtl = language === 'ar';

  // State
  const [isRegister, setIsRegister] = useState(true); // Default to register "إنشاء حساب جديد" like the screenshot
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<LoginRole>('student');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleQuickFill = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setEmail('wegdangamil2022@gmail.com');
      setPassword('wegdan1234@1234');
      setRole('admin');
      setName('wegdan gamil');
    } else {
      setEmail('student@manaratak.com');
      setPassword('student123');
      setRole('student');
      setName('أحمد محمد');
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage(isRtl ? 'الرجاء إدخال البريد الإلكتروني.' : 'Email is required.');
      return;
    }

    if (!password) {
      setMessage(isRtl ? 'الرجاء إدخال كلمة المرور.' : 'Password is required.');
      return;
    }

    // Automatically map the email to the admin role if it matches the designated admin email
    const finalRole = normalizedEmail === 'wegdangamil2022@gmail.com' ? 'admin' : role;

    if (finalRole === 'admin') {
      if (normalizedEmail !== 'wegdangamil2022@gmail.com' || password !== 'wegdan1234@1234') {
        setMessage(isRtl 
          ? 'رمز المسؤول أو كلمة المرور غير صالحة للعرض التجريبي.' 
          : 'Invalid admin credentials for the demo.');
        return;
      }
      
      localStorage.setItem('manaratak_demo_email', normalizedEmail);
      localStorage.setItem('manaratak_demo_role', 'admin');

      // Detect environment to safely route the admin demo access
      let adminUrl = import.meta.env.VITE_ADMIN_URL;
      
      if (!adminUrl || adminUrl === '/admin') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          adminUrl = 'http://localhost:3001';
        } else {
          // We are in a hosted preview environment
          navigate('/admin');
          return;
        }
      }

      window.location.href = `${adminUrl}?auto_unlock=admin-demo`;
      return;
    }

    // Student Role
    localStorage.setItem('manaratak_demo_email', normalizedEmail);
    localStorage.setItem('manaratak_demo_role', 'student');

    // Custom student id parsed from email
    const studentRef = normalizedEmail.includes('@') ? normalizedEmail.split('@')[0] : 'demo-student';
    navigate(`/student/${encodeURIComponent(studentRef)}`);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Premium Form Container */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] overflow-hidden p-6 sm:p-10 space-y-6 relative">
        
        {/* Subtle decorative color gradient dots inside form */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Title and Typing Cursor Header */}
        <div className="text-center space-y-2 relative">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight inline-flex items-center justify-center gap-1">
            <span>
              {isRegister 
                ? (isRtl ? 'إنشاء حساب جديد' : 'Create New Account') 
                : (isRtl ? 'تسجيل الدخول' : 'Sign In')}
            </span>
            <span className="inline-block w-[3px] h-7 bg-slate-900 animate-pulse rounded-full align-middle ml-1" />
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            {isRegister 
              ? (isRtl ? 'انضم إلى أكبر منصة للمنح الدراسية' : 'Join the largest scholarship platform')
              : (isRtl ? 'مرحباً بك مجدداً في منارتك' : 'Welcome back to Manaratak')}
          </p>
        </div>

        {/* Google Registration Button */}
        <button
          type="button"
          onClick={() => setMessage(isRtl ? 'تم محاكاة التسجيل بجوجل بنجاح!' : 'Google sign-in simulated successfully!')}
          className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
        >
          {/* Colorful Google G Logo SVG */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.86-3.577-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l3.256-3.133C18.29 1.625 15.54 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.557-4.437 10.557-10.74 0-.72-.078-1.272-.173-1.685H12.24z"
            />
          </svg>
          <span>
            {isRegister 
              ? (isRtl ? 'التسجيل باستخدام جوجل' : 'Sign up with Google') 
              : (isRtl ? 'تسجيل الدخول باستخدام جوجل' : 'Sign in with Google')}
          </span>
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-white px-2">
            {isRtl ? 'أو عبر البريد' : 'OR VIA EMAIL'}
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={submit} className="space-y-4">
          
          {/* Role Select Tabs */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
              {isRtl ? 'نوع الحساب' : 'Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                  role === 'student'
                    ? 'bg-slate-50/80 border-2 border-[#064e3b] text-[#064e3b] shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span>{isRtl ? 'طالب' : 'Student'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-slate-50/80 border-2 border-[#064e3b] text-[#064e3b] shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <School className="w-4 h-4 flex-shrink-0" />
                <span>{isRtl ? 'مؤسسة / جامعة' : 'Institution / University'}</span>
              </button>
            </div>
          </div>

          {/* Full Name Field (Sign Up Only) */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRtl ? 'أحمد محمد' : 'Ahmed Mohamed'}
                  className={`w-full min-h-[46px] bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] text-sm text-slate-700 placeholder-slate-400 font-medium transition-all ${
                    isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
                  }`}
                />
                <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                  isRtl ? 'right-4' : 'left-4'
                }`} />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
              {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full min-h-[46px] bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] text-sm text-slate-700 placeholder-slate-400 font-medium transition-all ${
                  isRtl ? 'pr-11 pl-4 text-right animate-none direction-ltr' : 'pl-11 pr-4 text-left'
                }`}
              />
              <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                isRtl ? 'right-4' : 'left-4'
              }`} />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500">
                {isRtl ? 'كلمة المرور' : 'Password'}
              </label>
              {!isRegister && (
                <button 
                  type="button" 
                  onClick={() => setMessage(isRtl ? 'يرجى مراجعة المسؤول أو إعادة المحاولة.' : 'Please contact administrator to reset.')}
                  className="text-[10px] font-bold text-slate-400 hover:text-emerald-700 hover:underline"
                >
                  {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className={`w-full min-h-[46px] bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] text-sm text-slate-700 placeholder-slate-400 font-medium transition-all ${
                  isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
                }`}
              />
              <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                isRtl ? 'right-4' : 'left-4'
              }`} />
            </div>
          </div>

          {/* Status Message alert box */}
          {message && (
            <div className="p-3 rounded-xl text-xs font-bold flex items-start gap-2 border bg-amber-50/60 border-amber-100 text-amber-800 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>{message}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full min-h-[50px] rounded-2xl bg-[#064e3b] hover:bg-[#054031] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer mt-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4 flex-shrink-0" /> : <LogIn className="w-4 h-4 flex-shrink-0" />}
            <span>
              {isRegister 
                ? (isRtl ? 'إنشاء حساب' : 'Create Account') 
                : (isRtl ? 'تسجيل الدخول' : 'Sign In')}
            </span>
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage(null);
            }}
            className="text-xs sm:text-sm font-extrabold text-[#064e3b] hover:text-[#0b4632] hover:underline transition-all cursor-pointer"
          >
            {isRegister
              ? (isRtl ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign in')
              : (isRtl ? 'ليس لديك حساب؟ إنشاء حساب جديد' : "Don't have an account? Sign up")}
          </button>
        </div>

        {/* Interactive Quick Fill Helper inside the card but highly styled */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-extrabold text-slate-400 text-center uppercase tracking-wide">
            {isRtl ? 'الدخول التجريبي الفوري' : 'Instant Demo Acccess'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 hover:bg-amber-100/70 transition-colors cursor-pointer"
            >
              {isRtl ? '✦ تعبئة المسؤول' : '✦ Fill Admin'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/70 transition-colors cursor-pointer"
            >
              {isRtl ? '✦ تعبئة الطالب' : '✦ Fill Student'}
            </button>
          </div>
        </div>

      </div>

      {/* Under-card Notice */}
      <p className="text-center text-[10px] font-semibold text-slate-400 mt-4 leading-normal max-w-xs mx-auto">
        {isRtl 
          ? 'تنبيه: هذا تسجيل دخول تجريبي آمن لتسهيل الاختبار والمعاينة الحية للمسؤولين والطلاب.' 
          : 'Notice: This secure demo login facilitates live testing & previews for admins and students.'}
      </p>

    </div>
  );
}
