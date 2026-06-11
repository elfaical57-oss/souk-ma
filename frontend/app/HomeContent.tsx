"use client";

import Link from "next/link";
import {
  ChevronRight, BadgeCheck, Truck, MessageCircle,
  Shield, Store, ShoppingBag, MapPin,
  ArrowRight, CheckCircle2, Users, Building2,
  Monitor, Shirt, Palette, Home as HomeIcon, Car, Leaf, ShoppingBasket, Search,
} from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

// ── Static data ───────────────────────────────────────────────────────────────

const CAT_SLUGS = [
  { icon: Monitor,        slug: "electronics",  priceKey: "150 DH", nameKey: "cat_electronics" },
  { icon: Shirt,          slug: "fashion",      priceKey: "25 DH",  nameKey: "cat_fashion"      },
  { icon: Palette,        slug: "handicraft",   priceKey: "15 DH",  nameKey: "cat_handicraft"   },
  { icon: HomeIcon,       slug: "home",         priceKey: "30 DH",  nameKey: "cat_home"         },
  { icon: ShoppingBasket, slug: "food",         priceKey: "10 DH",  nameKey: "cat_food"         },
  { icon: Car,            slug: "auto",         priceKey: "80 DH",  nameKey: "cat_auto"         },
  { icon: Leaf,           slug: "agriculture",  priceKey: "8 DH",   nameKey: "cat_agriculture"  },
  { icon: Building2,      slug: "construction", priceKey: "20 DH",  nameKey: "cat_construction" },
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
  const color    = palette[s.businessName.charCodeAt(0) % palette.length];
  const slug     = s.user.id;
  const products = s._count?.products ?? 0;

  return (
    <Link
      href={`/sellers/${slug}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      <div className="h-16 bg-gradient-to-r from-[#1a3f72] to-[#2d6ab4] relative overflow-hidden">
        {(s as any).banner && (
          <img src={(s as any).banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="px-4 pb-4 -mt-6 relative">
        <div className="mb-2">
          {s.logo ? (
            <img src={s.logo} alt={s.businessName} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md" />
          ) : (
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md`}>
              {initials}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors leading-tight">
                {s.businessName}
              </p>
              {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
            </div>
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
  );
}

// ── HomeContent ───────────────────────────────────────────────────────────────

export default function HomeContent({ sellers }: { sellers: Seller[] }) {
  const { t } = useLangStore();
  const h = t.home;

  const TRUST = [
    { icon: BadgeCheck,    label: t.home.badge ? t.features.verified_title : "Fournisseurs vérifiés", desc: t.features.verified_desc, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
    { icon: Shield,        label: t.features.chat_title,    desc: t.features.verified_desc,    color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
    { icon: Truck,         label: t.features.delivery_title, desc: t.features.delivery_desc,   color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  ];

  const HOW_STEPS = [
    { n: "01", title: h.how_step1_title, desc: h.how_step1_desc },
    { n: "02", title: h.how_step2_title, desc: h.how_step2_desc },
    { n: "03", title: h.how_step3_title, desc: h.how_step3_desc },
    { n: "04", title: h.how_step4_title, desc: h.how_step4_desc },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/ChatGPT%20Image%20Jun%2011%2C%202026%2C%2009_46_40%20PM.png')" }}
        />
        {/* Gradient overlay — keeps text readable while letting image show */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1e3d]/90 via-[#0f2849]/80 to-[#1a3f72]/60" />

        <div className="relative z-10 container py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent bg-accent/15 px-3 py-1.5 rounded-full mb-5">
                <BadgeCheck className="w-3.5 h-3.5" />
                {h.badge}
              </span>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-[2.6rem] font-black leading-[1.15] mb-4">
                {h.hero_title_1}<br />
                <span className="text-accent">{h.hero_title_2}</span>
              </h1>
              <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                {h.hero_desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-red-900/30 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {h.explore_btn}
                </Link>
                <Link
                  href="/register?role=seller"
                  className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all"
                >
                  <Store className="w-5 h-5" />
                  {h.become_seller_btn}
                </Link>
              </div>
            </div>

            {/* Category grid */}
            <div className="hidden lg:grid grid-cols-4 gap-2.5">
              {CAT_SLUGS.map(({ icon: Icon, slug, priceKey, nameKey }) => (
                <Link
                  key={slug}
                  href={`/products?category=${slug}`}
                  className="group bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-2xl p-3.5 flex flex-col items-center gap-2 transition-all hover:-translate-y-1"
                >
                  <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                  <p className="text-white text-[11px] font-bold text-center leading-tight">{(h as any)[nameKey]}</p>
                  <p className="text-accent text-[10px] font-semibold">{h.from_price} {priceKey}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRUST.map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`flex items-center gap-2.5 p-3 rounded-xl border ${bg} ${border}`}>
                <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${border}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-xs sm:text-sm leading-tight truncate">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-10">

        {/* CATEGORIES */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h2 className="font-black text-gray-900 text-lg">{h.cats_title}</h2>
              </div>
              <p className="text-sm text-gray-500 ml-3">{h.cats_subtitle}</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-semibold">
              {h.see_all} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CAT_SLUGS.map(({ icon: Icon, slug, priceKey, nameKey }) => (
              <Link
                key={slug}
                href={`/products?category=${slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:border-primary/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border border-blue-100">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-bold text-gray-800 text-sm text-center leading-tight">{(h as any)[nameKey]}</p>
                <p className="text-primary font-bold text-xs">{h.from_price} {priceKey}</p>
              </Link>
            ))}
          </div>

          <div className="sm:hidden mt-3 text-center">
            <Link href="/products" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
              {h.see_all} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* SELLERS */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1 h-5 bg-accent rounded-full" />
                <h2 className="font-black text-gray-900 text-lg">{h.suppliers_title}</h2>
                <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  {h.verified_badge}
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-3">{h.suppliers_subtitle}</p>
            </div>
            <Link href="/sellers" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-semibold">
              {h.all_suppliers} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {sellers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
              <Store className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400 text-sm">{h.no_suppliers}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sellers.map(s => <SellerCard key={s.id} s={s} />)}
            </div>
          )}

          <div className="sm:hidden mt-3 text-center">
            <Link href="/sellers" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
              {h.all_suppliers} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-red-50 px-3 py-1.5 rounded-full border border-red-100 mb-3">
              {h.how_simple}
            </div>
            <h2 className="font-black text-gray-900 text-xl sm:text-2xl">{h.how_title}</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">{h.how_subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_STEPS.map(({ n, title, desc }, i) => {
              const Icon = HOW_ICONS[i];
              return (
                <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 relative hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="absolute -top-3 left-5 bg-primary text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {n}
                  </div>
                  <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mb-4 mt-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-gradient-to-r from-[#0f2849] to-[#1a3f72] rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white font-black text-xl sm:text-2xl mb-2">{h.cta_title}</h2>
            <p className="text-blue-200 text-sm max-w-md">{h.cta_desc}</p>
            <ul className="mt-3 space-y-1">
              {[h.cta_free, h.cta_shop, h.cta_direct].map(item => (
                <li key={item} className="flex items-center gap-2 text-blue-100 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/register?role=seller"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-orange-400 text-[#0f2849] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Store className="w-4 h-4" />
              {h.open_shop}
            </Link>
            <Link
              href="/sellers"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all whitespace-nowrap"
            >
              {h.see_sellers}
            </Link>
          </div>
        </section>

        {/* BOTTOM CTAs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <Link
            href="/products"
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/25 transition-all flex items-center justify-between gap-4"
          >
            <div>
              <ShoppingBag className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-black text-gray-900 text-base mb-1">{h.buyer_title}</h3>
              <p className="text-gray-500 text-sm">{h.buyer_desc}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          <Link
            href="/register?role=seller"
            className="group bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 hover:shadow-lg hover:border-orange-400/40 transition-all flex items-center justify-between gap-4"
          >
            <div>
              <Building2 className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-black text-gray-900 text-base mb-1">{h.supplier_title}</h3>
              <p className="text-gray-500 text-sm">{h.supplier_desc}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-orange-300 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </section>

      </div>
    </div>
  );
}
