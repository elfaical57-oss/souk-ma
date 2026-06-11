"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users, MessageCircle, Store, Zap, Check, ChevronDown, ChevronUp,
  ArrowRight, BadgeCheck, Package, MapPin, Star,
} from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

export default function VendrePage() {
  const { t, lang } = useLangStore();
  const tv = t.vendre;
  const isAr = lang === "ar";

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const BENEFITS = [
    {
      icon: Users,
      title: tv.benefit1_title,
      desc: tv.benefit1_desc,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      icon: MessageCircle,
      title: tv.benefit2_title,
      desc: tv.benefit2_desc,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      icon: Store,
      title: tv.benefit3_title,
      desc: tv.benefit3_desc,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      icon: Zap,
      title: tv.benefit4_title,
      desc: tv.benefit4_desc,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
  ];

  const STEPS = [
    {
      num: "01",
      title: tv.step1_title,
      desc: tv.step1_desc,
      icon: BadgeCheck,
      accent: "bg-blue-600",
    },
    {
      num: "02",
      title: tv.step2_title,
      desc: tv.step2_desc,
      icon: Package,
      accent: "bg-orange-500",
    },
    {
      num: "03",
      title: tv.step3_title,
      desc: tv.step3_desc,
      icon: MessageCircle,
      accent: "bg-green-500",
    },
  ];

  const STATS = [
    { value: "500+", label: tv.stat1_label, icon: Users },
    { value: isAr ? "+10,000" : "10 000+", label: tv.stat2_label, icon: Package },
    { value: "40+", label: tv.stat3_label, icon: MapPin },
    { value: "0 MAD", label: tv.stat4_label, icon: Star },
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
      <section className="relative bg-gradient-to-br from-[#060f1e] via-[#0f2849] to-[#1a3a6e] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative py-20 md:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {tv.hero_badge}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            <span>{tv.hero_title_1}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              {tv.hero_title_2}
            </span>
          </h1>

          <p className="text-blue-200 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            {tv.hero_subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register?role=seller"
              className="group inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50"
            >
              {tv.hero_cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="text-sm text-blue-300 hover:text-white transition-colors py-4 px-2"
            >
              {tv.hero_login}
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex items-center justify-center flex-wrap gap-4 mt-10">
            {[tv.trust_free, tv.trust_time, tv.trust_no_engagement].map((pill) => (
              <div
                key={pill}
                className="flex items-center gap-1.5 text-sm text-blue-200"
              >
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                {pill}
              </div>
            ))}
          </div>

          {/* Logos strip */}
          <div className="mt-16 flex items-center justify-center gap-2 opacity-40">
            <Image src="/logo.png" alt="JemlaMaroc" width={120} height={36} className="h-8 w-auto object-contain brightness-0 invert" />
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
              <div
                key={title}
                className={`p-6 rounded-2xl border ${bg} ${border} hover:shadow-lg transition-shadow`}
              >
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {tv.how_title}
            </h2>
            <p className="text-gray-500 text-lg">{tv.how_subtitle}</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* connector line (desktop) */}
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
              className="inline-flex items-center gap-2 bg-[#060f1e] hover:bg-[#0f2849] text-white font-bold px-8 py-4 rounded-2xl transition-colors"
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
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-300" />
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
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            {tv.faq_title}
          </h2>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
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
      <section className="py-20 bg-orange-500">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {tv.cta_title}
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-md mx-auto">
            {tv.cta_subtitle}
          </p>
          <Link
            href="/register?role=seller"
            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-black px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-orange-700/30 transition-all hover:scale-105"
          >
            {tv.cta_btn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
