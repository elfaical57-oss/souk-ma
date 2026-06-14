"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight, Check, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
} from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

export default function VendreClient() {
  const { t, lang, setLang } = useLangStore();
  const tv = t.vendre;
  const isAr = lang === "ar";
  const searchParams = useSearchParams();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const param = searchParams.get("lang");
    if (param === "ar" || param === "fr") setLang(param);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const STEPS = [
    {
      num: "01",
      emoji: "🏪",
      title: tv.step1_title,
      desc: tv.step1_desc,
      gradient: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20",
      glow: "group-hover:shadow-blue-500/10",
    },
    {
      num: "02",
      emoji: "📦",
      title: tv.step2_title,
      desc: tv.step2_desc,
      gradient: "from-orange-500/20 to-orange-600/5",
      border: "border-orange-500/20",
      glow: "group-hover:shadow-orange-500/10",
    },
    {
      num: "03",
      emoji: "👥",
      title: tv.step3_title,
      desc: tv.step3_desc,
      gradient: "from-green-500/20 to-green-600/5",
      border: "border-green-500/20",
      glow: "group-hover:shadow-green-500/10",
    },
    {
      num: "04",
      emoji: "📈",
      title: tv.step4_title,
      desc: tv.step4_desc,
      gradient: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/20",
      glow: "group-hover:shadow-purple-500/10",
    },
  ];

  const TRUST = [
    tv.trust1,
    tv.trust2,
    tv.trust3,
    tv.trust4,
    tv.trust5,
  ];

  const PRODUCTS = isAr
    ? [
        { emoji: "🧴", name: "عطور", bg: "bg-purple-500/12 border-purple-500/20" },
        { emoji: "👗", name: "ملابس", bg: "bg-blue-500/12 border-blue-500/20" },
        { emoji: "💄", name: "مستحضرات", bg: "bg-pink-500/12 border-pink-500/20" },
        { emoji: "📱", name: "إلكترونيات", bg: "bg-slate-500/12 border-slate-500/20" },
        { emoji: "🏠", name: "منزليات", bg: "bg-orange-500/12 border-orange-500/20" },
        { emoji: "🛒", name: "غذاء", bg: "bg-green-500/12 border-green-500/20" },
      ]
    : [
        { emoji: "🧴", name: "Parfums", bg: "bg-purple-500/12 border-purple-500/20" },
        { emoji: "👗", name: "Vêtements", bg: "bg-blue-500/12 border-blue-500/20" },
        { emoji: "💄", name: "Cosmétiques", bg: "bg-pink-500/12 border-pink-500/20" },
        { emoji: "📱", name: "Électronique", bg: "bg-slate-500/12 border-slate-500/20" },
        { emoji: "🏠", name: "Maison", bg: "bg-orange-500/12 border-orange-500/20" },
        { emoji: "🛒", name: "Alimentaire", bg: "bg-green-500/12 border-green-500/20" },
      ];

  const FAQS = [
    { q: tv.faq1_q, a: tv.faq1_a },
    { q: tv.faq2_q, a: tv.faq2_a },
    { q: tv.faq3_q, a: tv.faq3_a },
    { q: tv.faq4_q, a: tv.faq4_a },
  ];

  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="bg-[#060f1e] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e]/95 via-[#060f1e]/85 to-[#060f1e]/60" />

        <div className="relative z-10 container py-16 lg:py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/15 text-blue-200 text-sm px-4 py-2 rounded-full mb-7">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
            {tv.hero_badge}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            {tv.hero_title_1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              {tv.hero_title_2}
            </span>
          </h1>

          <p className="text-blue-200/70 text-lg max-w-lg mx-auto mb-9 leading-relaxed">
            {tv.hero_subtitle}
          </p>

          {/* Primary CTA */}
          <Link
            href="/register?role=seller"
            className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-2xl text-xl shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50 mb-4"
          >
            {tv.hero_cta}
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>

          {/* Microcopy */}
          <p className="text-blue-300/45 text-sm">{tv.hero_micro}</p>
        </div>
      </section>

      {/* ── 4 STEPS ──────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-[#060f1e]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
              {tv.how_title}
            </h2>
            <p className="text-blue-200/45 text-base">{tv.how_subtitle}</p>
          </div>

          {/* Desktop: 4 columns */}
          <div className="hidden lg:flex items-start gap-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="contents">
                <div className="flex-1 group relative bg-[#0d1b35] border border-white/8 rounded-2xl p-6 overflow-hidden hover:border-white/15 hover:bg-[#0f1f3d] hover:shadow-2xl transition-all duration-300">
                  {/* Faint background number */}
                  <span
                    className={`absolute -top-2 ${isAr ? "-left-1" : "-right-1"} text-[88px] font-black text-white/[0.035] select-none leading-none pointer-events-none`}
                  >
                    {step.num}
                  </span>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} border ${step.border} flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110`}
                  >
                    {step.emoji}
                  </div>

                  <h3 className="text-white font-black text-lg mb-2 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-blue-200/50 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="pt-12 shrink-0 text-blue-400/20">
                    <ArrowIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: 2x2 grid */}
          <div className="grid lg:hidden grid-cols-2 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="relative bg-[#0d1b35] border border-white/8 rounded-2xl p-5 overflow-hidden"
              >
                <span
                  className={`absolute -top-2 ${isAr ? "-left-1" : "-right-1"} text-[68px] font-black text-white/[0.035] select-none leading-none pointer-events-none`}
                >
                  {step.num}
                </span>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} border ${step.border} flex items-center justify-center text-xl mb-4`}
                >
                  {step.emoji}
                </div>
                <h3 className="text-white font-black text-sm mb-1.5 leading-tight">
                  {step.title}
                </h3>
                <p className="text-blue-200/45 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────── */}
      <section className="py-10 bg-[#0a1829] border-y border-white/6">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
            {TRUST.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-sm font-medium text-blue-200/75"
              >
                <div className="w-5 h-5 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-green-400" strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ───────────────────────────────────── */}
      <section className="py-14 bg-[#060f1e]">
        <div className="container">
          <p className="text-center text-white/35 text-xs font-semibold uppercase tracking-widest mb-7">
            {isAr ? "تبيع فأي قطاع" : "Vendez dans tous les secteurs"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {PRODUCTS.map((p, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 ${p.bg} border rounded-xl px-4 py-2.5 text-white/80 text-sm font-semibold`}
              >
                <span className="text-lg">{p.emoji}</span>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
            {isAr ? "كبر تجارتك اليوم" : "Développez votre activité dès aujourd'hui"}
          </h2>
          <p className="text-orange-100/75 text-lg mb-9 max-w-sm mx-auto">
            {tv.hero_subtitle}
          </p>
          <Link
            href="/register?role=seller"
            className="inline-flex items-center gap-3 bg-white text-orange-600 hover:bg-orange-50 font-black px-10 py-4 rounded-2xl text-xl shadow-2xl shadow-orange-900/25 transition-all hover:scale-105"
          >
            {tv.cta_main}
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>
          <p className="text-orange-200/55 text-sm mt-4">{tv.hero_micro}</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-16 pb-28 bg-[#060f1e]">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-black text-white text-center mb-10">
            {tv.faq_title}
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, idx) => (
              <div
                key={idx}
                className="border border-white/8 rounded-2xl overflow-hidden bg-[#0d1b35]"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors text-start"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-blue-200/60 leading-relaxed border-t border-white/6 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY CTA ───────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#060f1e]/95 backdrop-blur-md border-t border-white/10 shadow-2xl">
          <div className="container py-3 flex items-center justify-between gap-4">
            <p className="text-white font-semibold text-sm hidden sm:block">
              {isAr
                ? "🚀 انشئ متجرك الآن — مجاني 100%"
                : "🚀 Créez votre boutique maintenant — 100% Gratuit"}
            </p>
            <Link
              href="/register?role=seller"
              className="flex-shrink-0 sm:flex-shrink inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black px-6 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105 w-full sm:w-auto"
            >
              {tv.hero_cta}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
