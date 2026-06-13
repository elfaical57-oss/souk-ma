"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight, Check, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  Store, Package, Globe, ShoppingBag, Truck, Clock, BarChart2, Headphones,
  BadgeCheck, Shield,
} from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

// ─── Mini UI Mockups ──────────────────────────────────────────────────────────

function GreenCheck() {
  return (
    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-[3px] border-[#091524] shadow-lg z-10">
      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </div>
  );
}

function StoreMockup({ isAr }: { isAr: boolean }) {
  return (
    <div className="bg-[#0d1e38] border border-white/10 rounded-xl p-3 relative">
      <div className="flex items-center gap-1 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-400/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
        <div className="w-2 h-2 rounded-full bg-green-400/70" />
        <span className="text-blue-400/40 text-[8px] ml-1">{isAr ? "متجرك" : "Boutique"}</span>
      </div>
      <div className="space-y-2">
        <div className="bg-white/8 border border-white/10 rounded-lg px-2 py-2">
          <div className="text-blue-300/40 text-[7px] mb-0.5">{isAr ? "اسم المتجر" : "Nom du magasin"}</div>
          <div className="text-white/50 text-[9px]">{isAr ? "متجري..." : "MonMagasin..."}</div>
        </div>
        <div className="bg-white/8 border border-white/10 rounded-lg px-2 py-2 flex justify-between items-center">
          <div>
            <div className="text-blue-300/40 text-[7px]">{isAr ? "مجال النشاط" : "Secteur"}</div>
            <div className="text-white/50 text-[9px]">{isAr ? "موضة" : "Mode & Textile"}</div>
          </div>
          <span className="text-white/30 text-[9px]">▾</span>
        </div>
        <div className="bg-orange-500 rounded-lg py-2 text-center text-white text-[9px] font-bold">
          {isAr ? "إنشاء المتجر" : "Créer ma boutique"}
        </div>
      </div>
      <GreenCheck />
    </div>
  );
}

function ProductsMockup({ isAr }: { isAr: boolean }) {
  const items = isAr
    ? [{ color: "bg-blue-500", name: "تيشيرت رجالي", price: "120 DH", stock: "50" },
       { color: "bg-pink-500", name: "حقيبة نسائية", price: "250 DH", stock: "30" }]
    : [{ color: "bg-blue-500", name: "T-shirt homme", price: "120 DH", stock: "50" },
       { color: "bg-pink-500", name: "Sac à main", price: "250 DH", stock: "30" }];
  return (
    <div className="bg-[#0d1e38] border border-white/10 rounded-xl p-3 relative">
      <div className="text-blue-200/60 text-[9px] font-bold mb-2">{isAr ? "منتجاتي" : "Mes produits"}</div>
      {items.map((p, i) => (
        <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg p-1.5 mb-1.5 last:mb-0">
          <div className={`w-7 h-7 ${p.color} rounded-md shrink-0 flex items-center justify-center`}>
            <Package className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/80 text-[8px] font-medium truncate">{p.name}</div>
            <div className="text-blue-300/60 text-[7px]">{p.price} • {isAr ? "المخزون" : "Stock"}: {p.stock}</div>
          </div>
          <div className="text-[7px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
            {isAr ? "نشط" : "Actif"}
          </div>
        </div>
      ))}
      <div className="mt-2 text-center text-orange-400 text-[8px] font-semibold">
        + {isAr ? "إضافة منتج جديد" : "Ajouter produit"}
      </div>
      <GreenCheck />
    </div>
  );
}

function PublishMockup({ isAr }: { isAr: boolean }) {
  return (
    <div className="bg-[#0d1e38] border border-white/10 rounded-xl p-3 relative">
      <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 rounded-lg px-2 py-1.5 mb-3">
        <svg className="w-3 h-3 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
        </svg>
        <span className="text-green-300 text-[8px] truncate">votre-boutique.jemlamaroc.com</span>
      </div>
      <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
        <Store className="w-8 h-8 text-blue-300/50" />
        <div className="text-white/40 text-[8px] text-center">{isAr ? "متجرك الآن مباشر!" : "Boutique en ligne !"}</div>
        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </div>
      </div>
      <GreenCheck />
    </div>
  );
}

function OrdersMockup({ isAr }: { isAr: boolean }) {
  const orders = isAr
    ? [
        { id: "#1025", name: "أحمد",  amount: "250 DH", status: "قيد المعالجة", cls: "text-yellow-400 bg-yellow-500/10" },
        { id: "#1024", name: "سمية",  amount: "120 DH", status: "تم تأكيده",    cls: "text-green-400 bg-green-500/10"  },
        { id: "#1023", name: "ياسين", amount: "180 DH", status: "تم تأكيده",    cls: "text-green-400 bg-green-500/10"  },
      ]
    : [
        { id: "#1025", name: "Ahmed",  amount: "250 DH", status: "En cours",  cls: "text-yellow-400 bg-yellow-500/10" },
        { id: "#1024", name: "Samia",  amount: "120 DH", status: "Confirmé",  cls: "text-green-400 bg-green-500/10"  },
        { id: "#1023", name: "Yassin", amount: "180 DH", status: "Confirmé",  cls: "text-green-400 bg-green-500/10"  },
      ];
  return (
    <div className="bg-[#0d1e38] border border-white/10 rounded-xl p-3 relative">
      <div className="text-blue-200/60 text-[9px] font-bold mb-2">{isAr ? "الطلبات" : "Commandes"}</div>
      {orders.map((o) => (
        <div key={o.id} className="flex items-center gap-1.5 bg-white/5 rounded-md px-2 py-1.5 mb-1 last:mb-0">
          <div className="text-blue-400/60 text-[7px] font-mono shrink-0 w-9">{o.id}</div>
          <div className="text-white/70 text-[8px] flex-1 truncate font-medium">{o.name}</div>
          <div className="text-blue-300 text-[7px] shrink-0">{o.amount}</div>
          <div className={`text-[6px] ${o.cls} px-1 py-0.5 rounded font-semibold shrink-0`}>{o.status}</div>
        </div>
      ))}
      <GreenCheck />
    </div>
  );
}

function DeliveryMockup({ isAr }: { isAr: boolean }) {
  return (
    <div className="bg-[#0d1e38] border border-white/10 rounded-xl p-3 relative">
      <div className="flex items-center justify-center gap-2 py-1">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div className="text-[7px] text-blue-300/60">{isAr ? "توصيل" : "Livreur"}</div>
        </div>
        <div className="relative shrink-0">
          <div className="w-12 h-12 bg-amber-600/80 rounded-xl border border-amber-500/40 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0d1e38]">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">😊</span>
          </div>
          <div className="text-[7px] text-orange-300/70">{isAr ? "الزبون" : "Client"}</div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="flex justify-center gap-0.5">
          {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
        </div>
        <div className="text-[8px] text-green-400 font-semibold mt-0.5">
          {isAr ? "تقييم ممتاز" : "Excellent avis client"}
        </div>
      </div>
      <GreenCheck />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VendreClient() {
  const { t, lang, setLang } = useLangStore();
  const tv = t.vendre;
  const isAr = lang === "ar";
  const searchParams = useSearchParams();

  // ?lang=ar forces Arabic on load (for Facebook Arabic ads)
  useEffect(() => {
    const param = searchParams.get("lang");
    if (param === "ar" || param === "fr") setLang(param);
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const STEPS = [
    { num: 1, title: tv.step1_title, desc: tv.step1_desc, mockup: <StoreMockup isAr={isAr} /> },
    { num: 2, title: tv.step2_title, desc: tv.step2_desc, mockup: <ProductsMockup isAr={isAr} /> },
    { num: 3, title: tv.step3_title, desc: tv.step3_desc, mockup: <PublishMockup isAr={isAr} /> },
    { num: 4, title: tv.step4_title, desc: tv.step4_desc, mockup: <OrdersMockup isAr={isAr} /> },
    { num: 5, title: tv.step5_title, desc: tv.step5_desc, mockup: <DeliveryMockup isAr={isAr} /> },
  ];

  const FEATURES = [
    { icon: <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-green-500/30">FREE</div>, title: tv.feat1_title, sub: tv.feat1_sub },
    { icon: <Clock className="w-5 h-5 text-yellow-300" />,     title: tv.feat2_title, sub: tv.feat2_sub },
    { icon: <BarChart2 className="w-5 h-5 text-blue-300" />,   title: tv.feat3_title, sub: tv.feat3_sub },
    { icon: <Headphones className="w-5 h-5 text-purple-300" />, title: tv.feat4_title, sub: tv.feat4_sub },
  ];

  const FAQS = [
    { q: tv.faq1_q, a: tv.faq1_a },
    { q: tv.faq2_q, a: tv.faq2_a },
    { q: tv.faq3_q, a: tv.faq3_a },
    { q: tv.faq4_q, a: tv.faq4_a },
  ];

  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="bg-[#091524] min-h-screen">

      {/* ── MAIN INFOGRAPHIC SECTION ─────────────── */}
      <section className="py-14 lg:py-20">
        <div className="container max-w-6xl">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-blue-200 text-sm px-4 py-2 rounded-full">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              {tv.hero_badge}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white leading-tight mb-4">
            {tv.hero_title_1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              {tv.hero_title_2}
            </span>
          </h1>

          <p className="text-center text-blue-200/70 text-base sm:text-lg max-w-xl mx-auto mb-14">
            {tv.hero_subtitle}
          </p>

          {/* ── 5 STEPS — desktop ─────────────────── */}
          <div className="hidden lg:flex items-start gap-1 mb-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="contents">
                <div className="flex-1 flex flex-col items-center text-center px-1.5">
                  {/* Number badge */}
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm mb-3 shadow-lg shadow-green-500/30 border-2 border-green-400/50">
                    {step.num}
                  </div>
                  {/* Title */}
                  <h3 className="text-white font-black text-sm mb-3 min-h-[2.5rem] flex items-center">{step.title}</h3>
                  {/* Mockup */}
                  <div className="w-full relative pb-4 mb-4">
                    {step.mockup}
                  </div>
                  {/* Description */}
                  <p className="text-blue-200/55 text-xs leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="pt-12 shrink-0 text-blue-400/25">
                    <ArrowIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── 5 STEPS — mobile ──────────────────── */}
          <div className="flex lg:hidden flex-col gap-6 mb-10">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-px flex-1 bg-green-500/20 mt-2" />}
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="text-white font-black text-base mb-3">{step.title}</h3>
                  <div className="max-w-xs relative pb-4 mb-4">{step.mockup}</div>
                  <p className="text-blue-200/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── FEATURE STRIP ─────────────────────── */}
          <div className="border-t border-white/8 pt-10 mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{f.title}</div>
                    <div className="text-blue-300/55 text-xs mt-0.5">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA BUTTON ────────────────────────── */}
          <div className="flex justify-center">
            <Link
              href="/register?role=seller"
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-orange-500/40"
            >
              {tv.cta_main}
              <ArrowRight className="w-5 h-5 shrink-0" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-16 bg-[#060f1e]">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-black text-white text-center mb-10">{tv.faq_title}</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, idx) => (
              <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-white/4">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-white hover:bg-white/5 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-blue-400 shrink-0" />
                  }
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-blue-200/65 leading-relaxed border-t border-white/8 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
