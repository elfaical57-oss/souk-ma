"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

export default function LoginPage() {
  const [phone, setPhone]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const { login }                       = useAuthStore();
  const { t }                           = useLangStore();
  const router                          = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(phone, password);
      const { user } = useAuthStore.getState();
      if (user?.role === "SELLER")      router.push("/dashboard/seller");
      else if (user?.role === "ADMIN")  router.push("/dashboard/admin");
      else                              router.push("/");
    } catch {
      setError(t.auth.error_login);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060f1e] via-[#0f2849] to-[#1a3a6e] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="mb-8 block">
          <Image src="/logo.png" alt="JemlaMaroc" width={160} height={50} className="h-11 w-auto object-contain" priority />
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900">{t.auth.login_title}</h1>
            <p className="text-sm text-gray-500 mt-1.5">{t.auth.login_subtitle}</p>
          </div>

          {/* Error */}
          <AnimatedError error={error} />

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                {t.auth.phone_label}
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
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">{t.auth.password}</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-12 border-2 border-gray-100 bg-gray-50 rounded-xl px-4 pr-10 text-sm text-gray-800 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.auth.connecting}
                </>
              ) : (
                <>
                  {t.auth.login_btn}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t.auth.no_account}{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              {t.auth.register}
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-blue-300/40 text-xs"
      >
        © {new Date().getFullYear()} JemlaMaroc
      </motion.p>
    </div>
  );
}

function AnimatedError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2"
    >
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
      {error}
    </motion.div>
  );
}
