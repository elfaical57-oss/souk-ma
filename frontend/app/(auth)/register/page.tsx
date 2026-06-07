"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Phone } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Nador",
];

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
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
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-7">
          <h1 className="text-2xl font-black text-gray-900">{t.auth.register_title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {lang === "ar" ? "أنشئ حسابك مجاناً" : "Créez votre compte gratuitement"}
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-1.5 mb-6 p-1 bg-gray-100 rounded-2xl">
          {[
            { value: "BUYER",  label: t.auth.buyer,  icon: "🛍️" },
            { value: "SELLER", label: t.auth.seller, icon: "🏪" },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => set("role", r.value)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                form.role === r.value
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{r.icon}</span>
              {r.label}
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
                required
                dir="ltr"
              />
            </div>
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

          {/* Seller-only fields */}
          {form.role === "SELLER" && (
            <div className="space-y-4 pt-3 border-t border-dashed border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {lang === "ar" ? "معلومات المتجر" : "Informations boutique"}
              </p>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.business_name}</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                  className="input"
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
  );
}
