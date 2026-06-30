"use client";

import Link from "next/link";
import {
  ChevronRight, BadgeCheck, Truck, MessageCircle,
  Shield, Store, ShoppingBag, MapPin,
  ArrowRight, CheckCircle2, Users, Building2,
  Monitor, Shirt, Palette, Home as HomeIcon, Car, Leaf, ShoppingBasket, Search,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import useLangStore from "@/lib/stores/langStore";

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};

const stagger = (delayChildren = 0.08): Variants => ({
  hidden: {},
  show:   { transition: { staggerChildren: delayChildren } },
});

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

// ── Static data ───────────────────────────────────────────────────────────────

const CAT_SLUGS = [
  { icon: Monitor,        slug: "electronics",  priceKey: "150 DH", nameKey: "cat_electronics", color: "from-blue-500 to-blue-700",    iconBg: "bg-blue-50",   iconColor: "text-blue-600"   },
  { icon: Shirt,          slug: "fashion",      priceKey: "25 DH",  nameKey: "cat_fashion",      color: "from-pink-500 to-rose-600",    iconBg: "bg-pink-50",   iconColor: "text-pink-600"   },
  { icon: Palette,        slug: "handicraft",   priceKey: "15 DH",  nameKey: "cat_handicraft",   color: "from-amber-500 to-orange-600", iconBg: "bg-amber-50",  iconColor: "text-amber-600"  },
  { icon: HomeIcon,       slug: "home",         priceKey: "30 DH",  nameKey: "cat_home",         color: "from-teal-500 to-emerald-600", iconBg: "bg-teal-50",   iconColor: "text-teal-600"   },
  { icon: ShoppingBasket, slug: "food",         priceKey: "10 DH",  nameKey: "cat_food",         color: "from-green-500 to-lime-600",   iconBg: "bg-green-50",  iconColor: "text-green-600"  },
  { icon: Car,            slug: "auto",         priceKey: "80 DH",  nameKey: "cat_auto",         color: "from-slate-500 to-gray-700",   iconBg: "bg-slate-50",  iconColor: "text-slate-600"  },
  { icon: Leaf,           slug: "agriculture",  priceKey: "8 DH",   nameKey: "cat_agriculture",  color: "from-lime-500 to-green-600",   iconBg: "bg-lime-50",   iconColor: "text-lime-600"   },
  { icon: Building2,      slug: "construction", priceKey: "20 DH",  nameKey: "cat_construction", color: "from-orange-500 to-red-600",   iconBg: "bg-orange-50", iconColor: "text-orange-600" },
] as const;

const HOW_ICONS = [Search, Users, MessageCircle, ShoppingBag];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Seller {
  id: string;
  businessName: string;
  slug?: string;
  city?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  logo?: string;
  banner?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}

// ── SellerCard ────────────────────────────────────────────────────────────────

function SellerCard({ s }: { s: Seller }) {
  const initials = s.businessName.slice(0, 2).toUpperCase();
  const palette  = ["bg-blue-500","bg-orange-500","bg-green-500","bg-purple-500","bg-red-500","bg-teal-500","bg-pink-500","bg-indigo-500"];
  const gradients= ["from-blue-600 to-blue-800","from-orange-500 to-orange-700","from-green-600 to-green-800","from-purple-600 to-purple-800","from-red-500 to-red-700","from-teal-600 to-teal-800","from-pink-600 to-pink-800","from-indigo-600 to-indigo-800"];
  const idx      = s.businessName.charCodeAt(0) % palette.length;
  const color    = palette[idx];
  const gradient = gradients[idx];
  const slug     = s.slug || s.user.id;
  const products = s._count?.products ?? 0;

  return (
    <motion.div variants={cardVariant}>
      <Link
        href={`/sellers/${slug}`}
        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
      >
        <div className={`h-20 bg-gradient-to-br ${gradient} relative overflow-hidden shrink-0`}>
          {(s as any).banner && (
            <img src={(s as any).banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/20" />
          {s.verified && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <BadgeCheck className="w-3 h-3" /> Vérifié
            </div>
          )}
        </div>

        <div className="px-4 pb-4 -mt-7 relative flex flex-col flex-1">
          <div className="mb-2">
            {s.logo ? (
              <img src={s.logo} alt={s.businessName} className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md" />
            ) : (
              <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md`}>
                {initials}
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-2 flex-1">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors leading-tight">
                {s.businessName}
              </p>
              {s.city && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{s.city}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1.5 font-medium">{products} produit{products !== 1 ? "s" : ""}</p>
            </div>
            <span className="text-primary mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Section header helper ─────────────────────────────────────────────────────

function SectionHeader({ accentColor, title, subtitle, badge, linkHref, linkLabel }: {
  accentColor: string; title: string; subtitle: string; badge?: string; linkHref: string; linkLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`w-1 h-5 ${accentColor} rounded-full`} />
          <h2 className="font-black text-gray-900 text-lg">{title}</h2>
          {badge && (
            <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 ml-3">{subtitle}</p>
      </div>
      <Link href={linkHref} className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-semibold">
        {linkLabel} <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ── HomeContent ───────────────────────────────────────────────────────────────

export default function HomeContent({ sellers }: { sellers: Seller[] }) {
  const { t } = useLangStore();
  const h = t.home;

  const TRUST = [
    { icon: BadgeCheck, label: t.home.badge ? t.features.verified_title : "Fournisseurs vérifiés", desc: t.features.verified_desc, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100",   ring: "ring-blue-100"   },
    { icon: Shield,     label: t.features.chat_title,     desc: t.features.verified_desc,   color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100",  ring: "ring-green-100"  },
    { icon: Truck,      label: t.features.delivery_title, desc: t.features.delivery_desc,   color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", ring: "ring-purple-100" },
  ];

  const HOW_STEPS = [
    { n: "01", title: h.how_step1_title, desc: h.how_step1_desc },
    { n: "02", title: h.how_step2_title, desc: h.how_step2_desc },
    { n: "03", title: h.how_step3_title, desc: h.how_step3_desc },
    { n: "04", title: h.how_step4_title, desc: h.how_step4_desc },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e3d]/80 via-[#0f2849]/55 to-[#0f2849]/20" />

        <div className="relative z-10 container py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left: text */}
            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              animate="show"
            >
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-bold text-accent bg-accent/15 px-3 py-1.5 rounded-full mb-5 border border-accent/25">
                <BadgeCheck className="w-3.5 h-3.5" />
                {h.badge}
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-white text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-[1.12] mb-4">
                {h.hero_title_1}<br />
                <span className="text-accent">{h.hero_title_2}</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-blue-200 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                {h.hero_desc}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-red-900/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {h.explore_btn}
                </Link>
                <Link
                  href="/register?role=seller"
                  className="inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-orange-400 text-[#0f2849] font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-orange-900/20 hover:-translate-y-0.5 active:scale-95"
                >
                  <Store className="w-5 h-5" />
                  {h.become_seller_btn}
                </Link>
              </motion.div>

              {/* Mobile-only trust stats */}
              <motion.div variants={fadeUp} className="flex items-center gap-4 mt-6 sm:hidden">
                {[
                  { value: "500+", label: "Fournisseurs" },
                  { value: "40+",  label: "Villes" },
                  { value: "100%", label: "Vérifiés" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-accent font-black text-lg leading-none">{value}</span>
                    <span className="text-blue-200/70 text-[10px] font-medium mt-0.5">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: category grid */}
            <motion.div
              className="hidden lg:grid grid-cols-4 gap-2.5"
              variants={stagger(0.06)}
              initial="hidden"
              animate="show"
            >
              {CAT_SLUGS.map(({ icon: Icon, slug, priceKey, nameKey, color }) => (
                <motion.div key={slug} variants={cardVariant}>
                  <Link
                    href={`/products?category=${slug}`}
                    className="group bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-2xl p-3.5 flex flex-col items-center gap-2 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    <div className={`w-9 h-9 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-[11px] font-bold text-center leading-tight">{(h as any)[nameKey]}</p>
                    <p className="text-accent text-[10px] font-semibold">{h.from_price} {priceKey}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-5">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {TRUST.map(({ icon: Icon, label, desc, color, bg, border }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={`flex items-center gap-3 p-4 rounded-xl border ${bg} ${border} hover:shadow-sm transition-shadow`}
              >
                <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${border}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm leading-tight truncate">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight hidden sm:block">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container py-8 space-y-12">

        {/* ── CATEGORIES ── */}
        <section>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <SectionHeader
              accentColor="bg-primary"
              title={h.cats_title}
              subtitle={h.cats_subtitle}
              linkHref="/products"
              linkLabel={h.see_all}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {CAT_SLUGS.map(({ icon: Icon, slug, priceKey, nameKey, iconBg, iconColor, color }) => (
              <motion.div key={slug} variants={cardVariant}>
                <Link
                  href={`/products?category=${slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2.5 hover:shadow-lg hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border border-gray-100 relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <Icon className={`w-7 h-7 ${iconColor} relative z-10`} />
                  </div>
                  <p className="font-bold text-gray-800 text-sm text-center leading-tight">{(h as any)[nameKey]}</p>
                  <span className="text-xs font-bold text-primary bg-red-50 px-2 py-0.5 rounded-full border border-red-100">{h.from_price} {priceKey}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="sm:hidden mt-3 text-center">
            <Link href="/products" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
              {h.see_all} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── SELLERS ── */}
        <section>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <SectionHeader
              accentColor="bg-accent"
              title={h.suppliers_title}
              subtitle={h.suppliers_subtitle}
              badge={h.verified_badge}
              linkHref="/sellers"
              linkLabel={h.all_suppliers}
            />
          </motion.div>

          {sellers.length === 0 ? (
            <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
              <Store className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400 text-sm">{h.no_suppliers}</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {sellers.map(s => <SellerCard key={s.id} s={s} />)}
            </motion.div>
          )}

          <div className="sm:hidden mt-3 text-center">
            <Link href="/sellers" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
              {h.all_suppliers} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works">
          <motion.div
            className="text-center mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-red-50 px-3 py-1.5 rounded-full border border-red-100 mb-3">
              {h.how_simple}
            </div>
            <h2 className="font-black text-gray-900 text-xl sm:text-2xl">{h.how_title}</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">{h.how_subtitle}</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {HOW_STEPS.map(({ n, title, desc }, i) => {
              const Icon = HOW_ICONS[i];
              return (
                <motion.div
                  key={n}
                  variants={cardVariant}
                  className="bg-white border border-gray-200 rounded-2xl p-5 relative hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <div className="absolute -top-3 left-5 bg-primary text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {n}
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── CTA BANNER ── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-gradient-to-br from-[#0f2849] via-[#1a3f72] to-[#0f2849] rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          {/* decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 right-24 w-32 h-32 bg-accent/10 rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-white font-black text-xl sm:text-2xl mb-2">{h.cta_title}</h2>
            <p className="text-blue-200 text-sm max-w-md">{h.cta_desc}</p>
            <ul className="mt-3 space-y-1.5">
              {[h.cta_free, h.cta_shop, h.cta_direct].map(item => (
                <li key={item} className="flex items-center gap-2 text-blue-100 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
            <Link
              href="/register?role=seller"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-orange-400 text-[#0f2849] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              <Store className="w-4 h-4" />
              {h.open_shop}
            </Link>
            <Link
              href="/sellers"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              {h.see_sellers}
            </Link>
          </div>
        </motion.section>

        {/* ── BOTTOM CTAs ── */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={cardVariant}>
            <Link
              href="/products"
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/25 transition-all flex items-center justify-between gap-4 h-full"
            >
              <div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{h.buyer_title}</h3>
                <p className="text-gray-500 text-sm">{h.buyer_desc}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </motion.div>

          <motion.div variants={cardVariant}>
            <Link
              href="/register?role=seller"
              className="group bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 hover:shadow-lg hover:border-orange-400/40 transition-all flex items-center justify-between gap-4 h-full"
            >
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{h.supplier_title}</h3>
                <p className="text-gray-500 text-sm">{h.supplier_desc}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-orange-300 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
}
