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

const CITIES = [
  "Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Kénitra","Tétouan","Salé","Nador",
  "Béni Mellal","Mohammedia","El Jadida","Safi","Larache",
];

const BENEFITS = [
  { icon: CheckCircle2, text: "Inscription 100% gratuite, sans engagement" },
  { icon: Package,      text: "Boutique en ligne professionnelle" },
  { icon: Users,        text: "Accès à des milliers d'acheteurs au Maroc" },
  { icon: MessageCircle,text: "Contact direct via WhatsApp Business" },
  { icon: Zap,         text: "Mise en ligne rapide — moins de 5 minutes" },
];

// ── Input component ───────────────────────────────────────────────────────────

function Field({
  label, error, hint, children,
}: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error  && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full" />{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full h-12 border-2 border-gray-100 bg-gray-50 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/8 transition-all placeholder:text-gray-400";
const inputErrCls = "w-full h-12 border-2 border-red-300 bg-red-50 rounded-xl px-4 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all placeholder:text-gray-400";

// ── Main ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}

function RegisterForm() {
  const params      = useSearchParams();
  const initialRole = params.get("role") === "seller" ? "SELLER" : "BUYER";

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

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())         errs.name     = "Nom complet requis";
    if (!form.phone.trim())        errs.phone    = "Numéro requis";
    if (form.password.length < 6)  errs.password = "6 caractères minimum";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.businessName.trim()) errs.businessName = "Nom de boutique requis";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

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
      router.push("/");
    } catch {
      setError("Une erreur est survenue. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const isSeller  = role === "SELLER";
  const totalSteps = isSeller ? 2 : 1;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ══════════════════════════════════════════════════════
          LEFT PANEL — branding + benefits
      ══════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] bg-gradient-to-br from-[#060f1e] via-[#0f2849] to-[#1a3a6e] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/3 rounded-full pointer-events-none" />
        <div className="absolute bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-40 h-40 bg-primary/10 rounded-full pointer-events-none" />

        <div className="relative">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
            <Image src="/logo.png" alt="JemlaMaroc" width={180} height={52} className="h-10 w-auto object-contain" priority />
          </Link>

          {/* Headline */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/15 border border-accent/25 px-3 py-1.5 rounded-full mb-4">
              <BadgeCheck className="w-3.5 h-3.5" />
              Marketplace B2B du Maroc
            </span>
            <h2 className="text-white font-black text-2xl xl:text-3xl leading-tight mb-3">
              Rejoignez des milliers<br />de fournisseurs vérifiés
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
              JemlaMaroc connecte les grossistes marocains avec des acheteurs professionnels partout dans le royaume.
            </p>
          </div>

          {/* Benefits */}
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[["500+","Vendeurs"],["10K+","Produits"],["40+","Villes"]].map(([v, l]) => (
              <div key={l} className="bg-white/6 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-accent font-black text-xl">{v}</p>
                <p className="text-blue-300/70 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust */}
        <div className="relative flex items-center gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-blue-300/60 text-xs">
            <Shield className="w-3.5 h-3.5" />
            Données sécurisées
          </div>
          <div className="flex items-center gap-1.5 text-blue-300/60 text-xs">
            <BadgeCheck className="w-3.5 h-3.5" />
            Vendeurs certifiés
          </div>
          <div className="flex items-center gap-1.5 text-blue-300/60 text-xs">
            <MessageCircle className="w-3.5 h-3.5" />
            Support WhatsApp
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT PANEL — registration form
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-white flex flex-col">

        {/* Mobile-only top bar */}
        <div className="lg:hidden bg-gradient-to-r from-[#0f2849] to-[#1a3a6e] px-5 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="JemlaMaroc" width={140} height={40} className="h-8 w-auto object-contain" priority />
          </Link>
          <Link href="/" className="text-white/60 hover:text-white text-sm">← Accueil</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-12">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-1">
                {isSeller ? "Ouvrez votre boutique gratuitement" : "Créez votre compte"}
              </h1>
              <p className="text-sm text-gray-500">
                {isSeller
                  ? "Commencez à vendre partout au Maroc avec JemlaMaroc."
                  : "Accédez à des milliers de fournisseurs vérifiés."}
              </p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              {([
                { value: "BUYER",  icon: ShoppingBag, label: "Je suis acheteur",  sub: "Je cherche des produits" },
                { value: "SELLER", icon: Store,        label: "Je suis vendeur",   sub: "Je vends en gros" },
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
                    <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </div>
                  <p className={`text-sm font-bold leading-tight ${role === value ? "text-primary" : "text-gray-700"}`}>{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>

            {/* Step indicator (seller only) */}
            {isSeller && (
              <div className="flex items-center gap-3 mb-7">
                {[1, 2].map(n => (
                  <div key={n} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      step > n
                        ? "bg-green-500 text-white"
                        : step === n
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-gray-100 text-gray-400"
                    }`}>
                      {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
                    </div>
                    <span className={`text-xs font-semibold ${step === n ? "text-gray-700" : "text-gray-400"}`}>
                      {n === 1 ? "Infos personnelles" : "Votre boutique"}
                    </span>
                    {n < 2 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                  </div>
                ))}
                {/* Progress bar */}
                <div className="ml-auto flex-1 max-w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── STEP 1: Personal info ─────────────────────────── */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nom complet" error={fieldErrors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => set("name", e.target.value)}
                        className={fieldErrors.name ? inputErrCls : inputCls}
                        placeholder="Mohamed Ali"
                      />
                    </Field>
                    <Field label="Ville">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          value={form.city}
                          onChange={e => set("city", e.target.value)}
                          className={`${inputCls} pl-10 appearance-none`}
                        >
                          <option value="">Choisir...</option>
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </Field>
                  </div>

                  <Field label="Numéro de téléphone" error={fieldErrors.phone}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => set("phone", e.target.value)}
                        className={`${fieldErrors.phone ? inputErrCls : inputCls} pl-10`}
                        placeholder="0612 345 678"
                        dir="ltr"
                      />
                    </div>
                  </Field>

                  <Field label="Mot de passe" error={fieldErrors.password}>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={e => set("password", e.target.value)}
                        className={`${fieldErrors.password ? inputErrCls : inputCls} pr-10`}
                        placeholder="••••••••  (6 caractères min.)"
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

              {/* ── STEP 2: Store info (seller only) ─────────────── */}
              {step === 2 && isSeller && (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-blue-700 mb-2">
                    <Store className="w-4 h-4 shrink-0" />
                    <span>Créez votre profil boutique pour commencer à vendre.</span>
                  </div>

                  <Field label="Nom de votre boutique" error={fieldErrors.businessName}>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={e => set("businessName", e.target.value)}
                      className={fieldErrors.businessName ? inputErrCls : inputCls}
                      placeholder="Ex: Alami Store, Grossiste Casa..."
                    />
                  </Field>

                  <Field
                    label="WhatsApp Business"
                    hint="Les acheteurs vous contacteront via ce numéro"
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={e => set("whatsapp", e.target.value)}
                        className={`${inputCls} pl-10`}
                        placeholder="0612 345 678"
                        dir="ltr"
                      />
                    </div>
                  </Field>

                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-green-700 font-semibold mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Votre boutique sera en ligne immédiatement
                    </p>
                    <p className="text-xs text-green-600">Ajoutez vos produits depuis votre tableau de bord vendeur.</p>
                  </div>
                </>
              )}

              {/* ── CTA Buttons ───────────────────────────────────── */}
              <div className="flex gap-3 pt-1">
                {/* Back button (seller step 2 only) */}
                {isSeller && step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 h-12 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-colors text-sm shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                )}

                {/* Main CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-primary hover:bg-red-700 disabled:opacity-60 text-white font-black rounded-xl transition-all shadow-lg shadow-red-900/20 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Création en cours...
                    </span>
                  ) : isSeller && step === 1 ? (
                    <><span>Continuer</span><ChevronRight className="w-4 h-4" /></>
                  ) : isSeller ? (
                    <><Store className="w-4 h-4" /><span>Créer ma boutique gratuitement</span></>
                  ) : (
                    <><span>Créer mon compte</span><ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {/* Trust line */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Shield className="w-3 h-3" /> 100% sécurisé
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <BadgeCheck className="w-3 h-3" /> Gratuit
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Zap className="w-3 h-3" /> Rapide
                </span>
              </div>
            </form>

            <p className="text-center text-sm text-gray-400 mt-7">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">Se connecter</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-300 text-xs py-5 border-t border-gray-100">
          © {new Date().getFullYear()} JemlaMaroc · Marketplace B2B du Maroc
        </div>
      </div>
    </div>
  );
}
