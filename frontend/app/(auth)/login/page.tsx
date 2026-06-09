"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

export default function LoginPage() {
  const [phone, setPhone]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const { login }                       = useAuthStore();
  const { t, lang }                     = useLangStore();
  const router                          = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(phone, password);
      router.push("/");
    } catch {
      setError(t.auth.error_login);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060f1e] via-[#0f2849] to-[#1a3a6e] flex flex-col items-center justify-center p-4">

      {/* Logo */}
      <Link href="/" className="mb-8 block">
        <Image src="/logo.png" alt="JemlaMaroc" width={160} height={50} className="h-11 w-auto object-contain" priority />
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">{t.auth.login_title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {lang === "ar" ? "أدخل رقم هاتفك لتسجيل الدخول" : "Connectez-vous à votre compte"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              {lang === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full h-12 border-2 border-gray-100 bg-gray-50 rounded-xl pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                required
                dir="ltr"
                placeholder="06XXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">{t.auth.password}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-12 border-2 border-gray-100 bg-gray-50 rounded-xl px-4 pr-10 text-sm text-gray-800 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-12 bg-primary hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-red-900/20">
            {loading ? "Connexion..." : t.auth.login_btn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t.auth.no_account}{" "}
          <Link href="/register" className="text-primary hover:underline font-semibold">{t.auth.register}</Link>
        </p>
      </div>

      <p className="mt-6 text-blue-300/40 text-xs">© {new Date().getFullYear()} JemlaMaroc</p>
    </div>
  );
}
