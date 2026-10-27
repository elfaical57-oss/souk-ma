"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight, Check, Store, PackagePlus, MessagesSquare, TrendingUp,
} from "lucide-react";
import useLangStore from "@/lib/stores/langStore";
import CoverImage from "@/components/ui/CoverImage";
import FaqSection from "@/components/seo/FaqSection";
import { VISUALS } from "@/lib/visuals";
import { CATEGORIES } from "@/lib/catalog";

export default function VendreClient() {
  const { t, lang, setLang } = useLangStore();
  const tv = t.vendre;
  const isAr = lang === "ar";
  const searchParams = useSearchParams();

  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const param = searchParams.get("lang");
    if (param === "ar" || param === "fr") setLang(param);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const STEPS = [
    { num: 1, icon: Store, title: tv.step1_title, desc: tv.step1_desc, bg: "bg-blue-50", color: "text-blue-600" },
    { num: 2, icon: PackagePlus, title: tv.step2_title, desc: tv.step2_desc, bg: "bg-orange-50", color: "text-accent" },
    { num: 3, icon: MessagesSquare, title: tv.step3_title, desc: tv.step3_desc, bg: "bg-green-50", color: "text-success" },
    { num: 4, icon: TrendingUp, title: tv.step4_title, desc: tv.step4_desc, bg: "bg-red-50", color: "text-primary" },
  ];

  const TRUST = [tv.trust1, tv.trust2, tv.trust3, tv.trust4, tv.trust5];

  const FAQS = [
    { q: tv.faq1_q, a: tv.faq1_a },
    { q: tv.faq2_q, a: tv.faq2_a },
    { q: tv.faq3_q, a: tv.faq3_a },
    { q: tv.faq4_q, a: tv.faq4_a },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="bg-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-slate-100">
        <div className="container py-10 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-accent/20 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
              {tv.hero_badge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-navy leading-tight mb-4">
              {tv.hero_title_1}{" "}
              <span className="text-primary">{tv.hero_title_2}</span>
            </h1>

            <p className="text-slate-500 text-lg max-w-md mb-7 leading-relaxed">
              {tv.hero_subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-7">
              <Link href="/register?role=seller" className="btn-primary text-base px-7 py-3.5">
                {tv.hero_cta}
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-navy hover:text-primary transition-colors">
                {tv.hero_login}
              </Link>
            </div>

            <p className="text-slate-400 text-sm">{tv.hero_micro}</p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[4/3] hidden sm:block">
            <CoverImage
              src={VISUALS.promoWarehouse}
              alt=""
              sizes="(max-width: 1024px) 90vw, 560px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────── */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {TRUST.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Check className="w-4 h-4 text-success shrink-0" strokeWidth={3} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 STEPS ──────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-black text-navy mb-2">{tv.how_title}</h2>
            <p className="text-slate-500 text-base">{tv.how_subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.num} className="card p-6 relative">
                <span className="absolute top-4 end-4 text-xs font-bold text-slate-300">
                  {String(step.num).padStart(2, "0")}
                </span>
                <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-navy font-bold text-base mb-1.5 leading-tight">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ───────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="container">
          <p className="text-center text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6">
            {isAr ? "تبيع في أي قطاع" : "Vendez dans tous les secteurs"}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products/categorie/${c.slug}`}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-primary/40 hover:text-primary rounded-xl px-4 py-2.5 text-slate-700 text-sm font-semibold transition-colors"
              >
                <span className="text-base">{c.icon}</span>
                {isAr ? c.labelAr : c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-16 bg-navy">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
            {isAr ? "كبّر تجارتك اليوم" : "Développez votre activité dès aujourd'hui"}
          </h2>
          <p className="text-blue-200/70 text-base mb-8 max-w-sm mx-auto">
            {tv.hero_subtitle}
          </p>
          <Link href="/register?role=seller" className="btn-accent text-base px-8 py-3.5">
            {tv.cta_main}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
          <p className="text-blue-200/50 text-sm mt-4">{tv.hero_micro}</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-16 pb-28 bg-white">
        <div className="container max-w-2xl">
          <FaqSection faqs={FAQS} title={tv.faq_title} />
        </div>
      </section>

      {/* ── STICKY CTA ───────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(11,37,69,0.08)]">
          <div className="container py-3 flex items-center justify-between gap-4">
            <p className="text-navy font-semibold text-sm hidden sm:block">
              {tv.hero_title_1} {tv.hero_title_2}
            </p>
            <Link href="/register?role=seller" className="btn-primary w-full sm:w-auto">
              {tv.hero_cta}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
