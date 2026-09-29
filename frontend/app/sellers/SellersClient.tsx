"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  BadgeCheck, MapPin, MessageCircle, Search, Store,
  Users, Shield, Truck, Filter, X,
  ChevronDown, Package,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import api from "@/lib/api";
import useLangStore from "@/lib/stores/langStore";
import SupplierCard from "@/components/suppliers/SupplierCard";
import type { Seller } from "@/lib/types";

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit:   { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.2 } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};


export default function SellersClient() {
  const [sellers, setSellers]       = useState<Seller[]>([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState(false);
  const [search, setSearch]         = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters]   = useState(false);
  const filterRef                       = useRef<HTMLDivElement>(null);
  const { t } = useLangStore();

  useEffect(() => {
    let attempt = 0;
    const fetchSellers = () => {
      attempt++;
      api.get("/sellers")
        .then(r => { setSellers(r.data); setLoading(false); })
        .catch(() => {
          if (attempt < 4) {
            setTimeout(fetchSellers, 5000); // backend cold-starting — retry silently
          } else {
            setApiError(true);
            setLoading(false);
          }
        });
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cities = Array.from(new Set(sellers.map(s => s.city).filter(Boolean))) as string[];

  const filtered = sellers.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      s.businessName.toLowerCase().includes(q) ||
      (s.city ?? "").toLowerCase().includes(q) ||
      (s.description ?? "").toLowerCase().includes(q);
    const matchCity     = !filterCity || s.city === filterCity;
    const matchVerified = !verifiedOnly || s.verified;
    return matchSearch && matchCity && matchVerified;
  });

  const activeFilters = [filterCity, verifiedOnly].filter(Boolean).length;

  const clearAll = () => { setSearch(""); setFilterCity(""); setVerifiedOnly(false); };

  return (
    <div className="bg-background min-h-screen">

      {/* HERO */}
      <section className="bg-navy-900">
        <div className="container py-5 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

            {/* Left: text + search */}
            <motion.div
              className="lg:col-span-3"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Users className="w-3.5 h-3.5" />
                {t.sellers.directory_badge}
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-white font-black text-2xl sm:text-[2.2rem] leading-[1.15] mb-2">
                {t.sellers.main_title}<br />
                <span className="text-accent">{t.sellers.main_verified}</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-blue-200 text-sm mb-3 max-w-lg leading-relaxed hidden sm:block">
                {t.sellers.subtitle}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-row flex-wrap gap-x-4 gap-y-1 mb-4">
                {[
                  { icon: BadgeCheck,    label: t.sellers.trust_verified,   color: "text-blue-300" },
                  { icon: MessageCircle, label: t.sellers.trust_whatsapp,   color: "text-green-300" },
                  { icon: Truck,         label: t.sellers.trust_wholesale,  color: "text-accent" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className={`w-3 h-3 ${color} shrink-0`} />
                    <span className="text-blue-100 text-xs font-medium">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Search + Filter */}
              <div className="flex gap-2 max-w-lg">
                <div className="flex-1 flex items-center bg-white rounded-xl h-12 shadow-xl shadow-black/30 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-accent transition-all overflow-hidden">
                  <Search className="w-4 h-4 text-gray-400 ml-4 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t.sellers.search_placeholder}
                    className="flex-1 px-3 text-sm text-gray-800 outline-none h-full bg-transparent"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="px-3 text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
                  )}
                </div>

                {/* Filter button */}
                <div className="relative shrink-0" ref={filterRef}>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-12 flex items-center gap-2 px-4 rounded-xl font-semibold text-sm transition-all border ${
                      activeFilters > 0
                        ? "bg-accent text-[#0f2849] border-accent shadow-lg"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    {t.sellers.filters}
                    {activeFilters > 0 && (
                      <span className="w-4 h-4 bg-[#0f2849] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {activeFilters}
                      </span>
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-gray-800 text-sm">{t.sellers.filters}</p>
                        {activeFilters > 0 && (
                          <button onClick={clearAll} className="text-xs text-primary hover:underline">{t.sellers.reset}</button>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wide">{t.sellers.city}</label>
                        <select
                          value={filterCity}
                          onChange={e => setFilterCity(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary bg-gray-50"
                        >
                          <option value="">{t.sellers.all_cities}</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => setVerifiedOnly(!verifiedOnly)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${verifiedOnly ? "bg-blue-500" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{t.sellers.verified_only}</p>
                          <p className="text-xs text-gray-400">{t.sellers.verified_only_sub}</p>
                        </div>
                      </label>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full mt-4 bg-[#0f2849] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#1a3f72] transition-colors"
                      >
                        {t.sellers.apply}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile-only inline stats */}
              <motion.div variants={fadeUp} className="flex items-center gap-5 mt-4 lg:hidden">
                {[
                  { value: "500+",    label: t.sellers.stat_verified, color: "text-blue-300"  },
                  { value: "10 000+", label: t.sellers.stat_products, color: "text-accent"    },
                  { value: "40+",     label: t.sellers.stat_cities,   color: "text-green-300" },
                ].map(({ value, label, color }) => (
                  <div key={label} className="flex flex-col">
                    <span className={`font-black text-lg leading-none ${color}`}>{value}</span>
                    <span className="text-blue-200/60 text-[10px] mt-0.5">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: stats cards */}
            <motion.div
              className="hidden lg:flex lg:col-span-2 flex-col gap-3"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              initial="hidden"
              animate="show"
            >
              {[
                { icon: Users,   value: "500+",    label: t.sellers.stat_verified, color: "text-blue-300",  bg: "bg-blue-500/10",   border: "border-blue-500/20" },
                { icon: Package, value: "10 000+", label: t.sellers.stat_products, color: "text-accent",    bg: "bg-orange-500/10", border: "border-orange-500/20" },
                { icon: MapPin,  value: "40+",     label: t.sellers.stat_cities,   color: "text-green-300", bg: "bg-green-500/10",  border: "border-green-500/20" },
              ].map(({ icon: Icon, value, label, color, bg, border }) => (
                <motion.div key={label} variants={fadeUp} className={`flex items-center gap-4 ${bg} border ${border} rounded-2xl px-5 py-4 backdrop-blur-sm`}>
                  <div className={`w-10 h-10 ${bg} border ${border} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-blue-200/70 text-xs">{label}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div variants={fadeUp} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                <Shield className="w-4 h-4 text-accent shrink-0" />
                <p className="text-blue-200 text-xs leading-relaxed">
                  {t.sellers.trust_controlled}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="container py-8">

        {/* Active filters + result info */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm font-semibold text-gray-700">
              {loading
                ? t.sellers.loading
                : search || activeFilters > 0
                  ? `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`
                  : t.sellers.partner_wholesalers
              }
            </p>

            {filterCity && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" />
                {filterCity}
                <button onClick={() => setFilterCity("")} className="ml-0.5 hover:text-blue-900">×</button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <BadgeCheck className="w-3 h-3" />
                {t.sellers.verified_pill}
                <button onClick={() => setVerifiedOnly(false)} className="ml-0.5 hover:text-green-900">×</button>
              </span>
            )}
          </div>

          {(search || activeFilters > 0) && (
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors">
              <X className="w-3.5 h-3.5" /> {t.sellers.clear_all}
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse p-4">
                <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-14 bg-slate-50 rounded-xl" />
                    <div className="h-14 bg-slate-50 rounded-xl" />
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl mt-3" />
                </div>
            ))}
          </div>
        ) : apiError ? (
          <div className="text-center py-20 bg-red-50 border border-red-200 rounded-2xl">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Store className="w-10 h-10 text-red-300" />
            </div>
            <h3 className="font-black text-gray-700 text-lg mb-2">Impossible de charger les fournisseurs</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Erreur de connexion au serveur. Vérifiez votre connexion et réessayez.</p>
            <button
              onClick={() => { setApiError(false); setLoading(true); let attempt = 0; const retry = () => { attempt++; api.get("/sellers").then(r => { setSellers(r.data); setLoading(false); }).catch(() => { if (attempt < 4) setTimeout(retry, 5000); else { setApiError(true); setLoading(false); } }); }; retry(); }}
              className="inline-flex items-center gap-2 bg-[#0f2849] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a3f72] transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Store className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-black text-gray-700 text-lg mb-2">{t.sellers.not_found_title}</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              {search || activeFilters > 0 ? t.sellers.not_found_filter : t.sellers.no_sellers}
            </p>
            <div className="flex gap-3 justify-center">
              {(search || activeFilters > 0) && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 bg-[#0f2849] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a3f72] transition-colors"
                >
                  {t.sellers.see_all}
                </button>
              )}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={search + filterCity + String(verifiedOnly)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {filtered.map(s => (
                <motion.div key={s.id} variants={cardVariant}>
                  <SupplierCard seller={s} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom CTA */}
        {!loading && filtered.length > 0 && (
          <div className="mt-10 rounded-2xl bg-navy px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-black text-base sm:text-lg mb-1">
                {t.sellers.cta_title}
              </h3>
              <p className="text-blue-200 text-sm">{t.sellers.cta_subtitle}</p>
            </div>
            <Link
              href="/register?role=seller"
              className="btn-accent shrink-0"
            >
              <Store className="w-4 h-4" />
              {t.sellers.open_shop}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
