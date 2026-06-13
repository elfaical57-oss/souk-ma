"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users, MessageCircle, Store, Zap, Check, ChevronDown, ChevronUp,
  ArrowRight, BadgeCheck, Package, MapPin, Shield, Star,
} from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

export default function VendreClient() {
  const { t, lang } = useLangStore();
  const tv = t.vendre;
  const isAr = lang === "ar";

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const BENEFITS = [
    { icon: Users,         title: tv.benefit1_title, desc: tv.benefit1_desc, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
    { icon: MessageCircle, title: tv.benefit2_title, desc: tv.benefit2_desc, color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
    { icon: Store,         title: tv.benefit3_title, desc: tv.benefit3_desc, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { icon: Zap,           title: tv.benefit4_title, desc: tv.benefit4_desc, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  ];

  const STEPS = [
    { num: "01", title: tv.step1_title, desc: tv.step1_desc, icon: BadgeCheck,    accent: "bg-blue-600"   },
    { num: "02", title: tv.step2_title, desc: tv.step2_desc, icon: Package,        accent: "bg-orange-500" },
    { num: "03", title: tv.step3_title, desc: tv.step3_desc, icon: MessageCircle, accent: "bg-green-500"  },
  ];

  const STATS = [
    { value: "500+",                          label: tv.stat1_label, icon: Users,   color: "text-blue-300",  bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
    { value: isAr ? "+10,000" : "10 000+",   label: tv.stat2_label, icon: Package, color: "text-accent",    bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { value: "40+",                           label: tv.stat3_label, icon: MapPin,  color: "text-green-300", bg: "bg-green-500/10",  border: "border-green-500/20"  },
    { value: "0 MAD",                         label: tv.stat4_label, icon: Star,    color: "text-yellow-300",bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  ];

  const FAQS = [
    { q: tv.faq1_q, a: tv.faq1_a },
    { q: tv.faq2_q, a: tv.faq2_a },
    { q: tv.faq3_q, a: tv.faq3_a },
    { q: tv.faq4_q, a: tv.faq4_a },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="bg-white">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Gradient overlay — heavier on left for text, fades right so image shows */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e]/90 via-[#0f2849]/75 to-[#0f2849]/40" />

        <div className="relative z-10 container py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">

            {/* Left: text + CTA */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {tv.hero_badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black text-white leading-[1.1] mb-5">
                {tv.hero_title_1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  {tv.hero_title_2}
                </span>
              </h1>

              <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                {tv.hero_subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <Link
                  href="/register?role=seller"
                  className="group inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base shadow-2xl shadow-orange-500/30 transition-all hover:-translate-y-0.5"
                >
                  {tv.hero_cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center py-4 px-2 text-sm text-blue-300 hover:text-white transition-colors"
                >
                  {tv.hero_login}
                </Link>
              </div>

              <div className="flex items-center flex-wrap gap-5">
                {[tv.trust_free, tv.trust_time, tv.trust_no_engagement].map((pill) => (
                  <div key={pill} className="flex items-center gap-1.5 text-sm text-blue-200">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {pill}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stats cards */}
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
              {STATS.map(({ value, label, icon: Icon, color, bg, border }) => (
                <div key={label} className={`flex items-center gap-4 ${bg} border ${border} rounded-2xl px-5 py-4 backdrop-blur-sm`}>
                  <div className={`w-10 h-10 ${bg} border ${border} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-blue-200/70 text-xs">{label}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                <Shield className="w-4 h-4 text-accent shrink-0" />
                <p className="text-blue-200 text-xs leading-relaxed">
                  {isAr ? "منصة موثوقة — موردون مدققون في المغرب" : "Plateforme fiable — fournisseurs vérifiés au Maroc"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              {tv.benefits_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div key={title} className={`p-6 rounded-2xl border ${bg} ${border} hover:shadow-lg transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 border ${border}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{tv.how_title}</h2>
            <p className="text-gray-500 text-lg">{tv.how_subtitle}</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-10 left-[calc(16.5%+1rem)] right-[calc(16.5%+1rem)] h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-green-200" />

            {STEPS.map(({ num, title, desc, icon: Icon, accent }, idx) => (
              <div key={num} className="relative flex flex-col items-center text-center">
                <div className={`relative z-10 w-20 h-20 rounded-2xl ${accent} flex items-center justify-center shadow-lg mb-5`}>
                  <Icon className="w-9 h-9 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-100 rounded-full text-xs font-black text-gray-700 flex items-center justify-center shadow">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register?role=seller"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
            >
              {tv.hero_cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#060f1e] to-[#0f2849]">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {STATS.map(({ value, label, icon: Icon, color, bg, border }) => (
              <div key={label} className="text-center">
                <div className={`w-12 h-12 ${bg} border ${border} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-sm text-blue-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">{tv.faq_title}</h2>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{tv.cta_title}</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-md mx-auto">{tv.cta_subtitle}</p>
          <Link
            href="/register?role=seller"
            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-black px-10 py-4 rounded-xl text-lg shadow-2xl shadow-orange-700/30 transition-all hover:scale-105"
          >
            {tv.cta_btn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
