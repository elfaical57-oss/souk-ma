"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye, EyeOff, Phone, BadgeCheck, Store, ShoppingBag,
  Users, Shield, MessageCircle, ChevronRight, ArrowLeft, CheckCircle2,
  MapPin, Package, Zap,
} from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

const CITIES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Kénitra","Tétouan","Salé","Nador",
  "Béni Mellal","Mohammedia","El Jadida","Safi","Larache",
];

function Field({
  label, error, hint, children,
}: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-gray-700 mb-2">{label}</label>
      {children}
      {error  && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full" />{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls    = "w-full h-[52px] border-2 border-gray-200 bg-gray-50/80 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder:text-gray-400/80";
const inputErrCls = "w-full h-[52px] border-2 border-red-300 bg-red-50 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200 placeholder:text-gray-400/80";

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}

function RegisterForm() {
  const params      = useSearchParams();
  const initialRole = params.get("role") === "seller" ? "SELLER" : "BUYER";
  const { t } = useLangStore();
  const ta = t.auth;

  const [role, setRole]     = useState<"BUYER" | "SELLER">(initialRole);
  const [step, setStep]     = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "", phone: "", password: "", city: "",
    businessName: "", whatsapp: "",
  });

  const { register } = useAuthStore();
  const router       = useRouter();
  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setFieldErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())         errs.name     = ta.error_name;
    if (!form.phone.trim())        errs.phone    = ta.error_phone;
    if (form.password.length < 6)  errs.password = ta.error_password;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.businessName.trim()) errs.businessName = ta.error_shop;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "SELLER" && step === 1) { handleNext(); return; }
    if (role === "SELLER" && !validateStep2()) return;
    setError("");
    setLoading(true);
    try {
      await register({ ...form, role });
      router.push(role === "SELLER" ? "/dashboard/seller" : "/");
    } catch {
      setError(ta.error_general);
    } finally {
      setLoading(false);
    }
  };

  const isSeller  = role === "SELLER";

  const BENEFITS = [
    { icon: CheckCircle2, text: t.home.cta_free },
    { icon: Package,      text: t.home.cta_shop },
    { icon: Users,        text: t.home.cta_direct },
    { icon: MessageCircle,text: ta.support_wa },
    { icon: Zap,          text: ta.create_shop_btn },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] bg-gradient-to-br from-[#060f1e] via-[#0f2849] to-[#1a3a6e] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">

        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.02] rounded-full pointer-events-none" />
        <div className="absolute bottom-16 -left-24 w-72 h-72 bg-accent/[0.04] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-4 w-32 h-32 bg-white/[0.02] rounded-full pointer-events-none" />

        <div className="relative">
          <Link href="/" className="inline-flex flex-col mb-12 group">
            <Image src="/logo.png" alt="JemlaMaroc" width={260} height={76} className="h-16 w-auto object-contain" priority />
            <span className="text-[11px] text-blue-300/60 font-medium tracking-widest uppercase mt-1.5 leading-none">
              {ta.marketplace_tagline}
            </span>
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/15 border border-accent/25 px-3 py-1.5 rounded-full mb-4">
              <BadgeCheck className="w-3.5 h-3.5" />
              Marketplace B2B du Maroc
            </span>
            <h2 className="text-white font-black text-2xl xl:text-[1.75rem] leading-tight mb-3">
              {isSeller ? ta.open_shop_title : ta.create_account_title}
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
              {isSeller ? ta.seller_desc : ta.buyer_desc}
            </p>
          </div>

          <div className="space-y-3 mb-10">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-accent/15 border border-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                </div>
                <p className="text-blue-100 text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[["500+","Vendeurs"],["10K+","Produits"],["40+","Villes"]].map(([v, l]) => (
              <div key={l} className="bg-white/6 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-accent font-black text-xl">{v}</p>
                <p className="text-blue-300/70 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-blue-300/60 text-xs">
            <Shield className="w-3.5 h-3.5" />
            {ta.data_secured}
          </div>
          <div className="flex items-center gap-1.5 text-blue-300/60 text-xs">
            <BadgeCheck className="w-3.5 h-3.5" />
            {ta.seller}
          </div>
          <div className="flex items-center gap-1.5 text-blue-300/60 text-xs">
            <MessageCircle className="w-3.5 h-3.5" />
            {ta.support_wa}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-white flex flex-col">

        {/* Mobile top bar */}
        <div className="lg:hidden bg-gradient-to-r from-[#060f1e] to-[#1a3a6e] px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <Image src="/logo.png" alt="JemlaMaroc" width={160} height={48} className="h-9 w-auto object-contain" priority />
            <span className="text-[9px] text-blue-300/50 tracking-widest uppercase font-medium mt-0.5">{ta.marketplace_tagline}</span>
          </Link>
          <Link href="/" className="text-white/50 hover:text-white text-xs border border-white/15 px-3 py-1.5 rounded-lg transition-colors">← {t.nav.products}</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-12">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-1">
                {isSeller ? ta.open_shop_title : ta.create_account_title}
              </h1>
              <p className="text-sm text-gray-500">
                {isSeller ? ta.seller_desc : ta.buyer_desc}
              </p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              {([
                { value: "BUYER",  icon: ShoppingBag, label: ta.buyer_label, sub: ta.buyer_sub },
                { value: "SELLER", icon: Store,        label: ta.seller_label, sub: ta.seller_sub },
              ] as const).map(({ value, icon: Icon, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setRole(value); setStep(1); setFieldErrors({}); }}
                  className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all ${
                    role === value
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                    role === value ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <p className={`text-sm font-bold leading-tight ${role === value ? "text-primary" : "text-gray-700"}`}>{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>

            {/* Step indicator (seller only) */}
            {isSeller && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-700">
                    {step === 1 ? ta.step1_label : ta.step2_label}
                  </p>
                  <span className="text-[11px] text-gray-400 font-medium">{step}/2</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2].map(n => (
                    <div key={n} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-200 ${
                        step > n
                          ? "bg-green-500 text-white"
                          : step === n
                            ? "bg-primary text-white ring-4 ring-primary/20"
                            : "bg-gray-100 text-gray-400"
                      }`}>
                        {step > n ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                      </div>
                      <span className={`text-[11px] font-semibold ${step === n ? "text-gray-700" : "text-gray-400"}`}>
                        {n === 1 ? ta.personal_info : ta.your_shop}
                      </span>
                      {n < 2 && <ChevronRight className="w-3 h-3 text-gray-300 mx-1" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label={ta.full_name_label} error={fieldErrors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => set("name", e.target.value)}
                        className={fieldErrors.name ? inputErrCls : inputCls}
                        placeholder={ta.name_placeholder}
                      />
                    </Field>
                    <Field label={ta.city_label}>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          value={form.city}
                          onChange={e => set("city", e.target.value)}
                          className={`${inputCls} pl-10 appearance-none`}
                        >
                          <option value="">{ta.city_placeholder}</option>
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </Field>
                  </div>

                  <Field label={ta.phone_label} error={fieldErrors.phone}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => set("phone", e.target.value)}
                        className={`${fieldErrors.phone ? inputErrCls : inputCls} pl-10`}
                        placeholder={ta.phone_label}
                        dir="ltr"
                      />
                    </div>
                  </Field>

                  <Field label={ta.password} error={fieldErrors.password}>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={e => set("password", e.target.value)}
                        className={`${fieldErrors.password ? inputErrCls : inputCls} pr-10`}
                        placeholder={ta.password_placeholder}
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && isSeller && (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-blue-700 mb-2">
                    <Store className="w-4 h-4 shrink-0" />
                    <span>{ta.create_shop_hint}</span>
                  </div>

                  <Field label={ta.shop_name_label} error={fieldErrors.businessName}>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={e => set("businessName", e.target.value)}
                      className={fieldErrors.businessName ? inputErrCls : inputCls}
                      placeholder={ta.shop_placeholder}
                    />
                  </Field>

                  <Field label={ta.whatsapp_business} hint={ta.whatsapp_note}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={e => set("whatsapp", e.target.value)}
                        className={`${inputCls} pl-10`}
                        placeholder={ta.phone_label}
                        dir="ltr"
                      />
                    </div>
                  </Field>

                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-green-700 font-semibold mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {ta.shop_online}
                    </p>
                    <p className="text-xs text-green-600">{ta.add_products_hint}</p>
                  </div>
                </>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-1">
                {isSeller && step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 h-12 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-colors text-sm shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {ta.back}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-[52px] bg-primary hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black rounded-xl transition-all duration-200 shadow-lg shadow-red-900/25 hover:shadow-xl hover:shadow-red-900/30 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {ta.creating}
                    </span>
                  ) : isSeller && step === 1 ? (
                    <><span>{ta.next_step}</span><ChevronRight className="w-4 h-4" /></>
                  ) : isSeller ? (
                    <><Store className="w-4 h-4" /><span>{ta.create_shop_btn}</span></>
                  ) : (
                    <><span>{ta.create_account_btn}</span><ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  {ta.data_secured}
                </span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                  {ta.support_wa}
                </span>
              </div>
            </form>

            <p className="text-center text-sm text-gray-400 mt-7">
              {ta.already_have_account}{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">{ta.sign_in}</Link>
            </p>
          </div>
        </div>

        <div className="text-center text-gray-300 text-xs py-5 border-t border-gray-100">
          © {new Date().getFullYear()} JemlaMaroc · {ta.marketplace_tagline}
        </div>
      </div>
    </div>
  );
}
