"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Store, Eye, EyeOff, Phone } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Nador",
];

export default function RegisterPage() {
  const params      = useSearchParams();
  const initialRole = params.get("role") === "seller" ? "SELLER" : "BUYER";
  const { t, lang } = useLangStore();

  const [form, setForm] = useState({
    name: "", phone: "", password: "", role: initialRole,
    city: "", businessName: "", whatsapp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { register }        = useAuthStore();
  const router              = useRouter();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/");
    } catch {
      setError(t.auth.error_register);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-secondary">
              <Store className="w-8 h-8 text-primary" />
              Jemla<span className="text-primary">Maroc</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 mt-3">{t.auth.register_title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {lang === "ar" ? "أنشئ حسابك مجاناً" : "Créez votre compte gratuitement"}
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "BUYER",  label: t.auth.buyer,  icon: "🛍️", desc: lang === "ar" ? "اشتر بالجملة" : "Acheter en gros" },
              { value: "SELLER", label: t.auth.seller, icon: "🏪", desc: lang === "ar" ? "بع منتجاتك" : "Vendre vos produits" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set("role", r.value)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  form.role === r.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{r.icon}</div>
                <p className="font-bold text-sm text-gray-800">{r.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.name}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="input"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.city}</label>
                <select value={form.city} onChange={(e) => set("city", e.target.value)} className="input">
                  <option value="">{t.auth.select_city}</option>
                  {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                {lang === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="input pl-10"
                  placeholder=""
                  required
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "ar" ? "سيُستخدم لتسجيل الدخول والتواصل" : "Utilisé pour la connexion et le contact"}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Seller fields */}
            {form.role === "SELLER" && (
              <div className="space-y-4 pt-2 border-t border-dashed border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-1">
                  {lang === "ar" ? "معلومات المتجر" : "Informations boutique"}
                </p>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.business_name}</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    className="input"
                    placeholder=""
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.whatsapp_business}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value)}
                      className="input pl-10"
                      placeholder=""
                      dir="ltr"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{t.auth.whatsapp_note}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl disabled:opacity-60 font-bold text-base mt-2"
            >
              {loading ? t.auth.loading : t.auth.register_btn}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t.auth.has_account}{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">{t.auth.login_btn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
