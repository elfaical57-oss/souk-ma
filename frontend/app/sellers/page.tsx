"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  BadgeCheck, MapPin, MessageCircle, Search, Store,
  ArrowRight, Users, Shield, Truck, Filter, X, CheckCircle2,
  ChevronDown, Zap, Package, Star,
} from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl, storeInquiryMessage } from "@/lib/whatsapp";

interface Seller {
  id: string;
  businessName: string;
  slug?: string;
  description?: string;
  city?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  whatsapp?: string;
  logo?: string;
  banner?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}

const PALETTE = [
  "from-blue-600 to-blue-800",
  "from-orange-500 to-orange-700",
  "from-green-600 to-green-800",
  "from-purple-600 to-purple-800",
  "from-teal-600 to-teal-800",
  "from-indigo-600 to-indigo-800",
  "from-pink-600 to-pink-800",
  "from-red-600 to-red-800",
];
const LOGO_BG = [
  "bg-blue-600","bg-orange-500","bg-green-600","bg-purple-600",
  "bg-teal-600","bg-indigo-600","bg-pink-600","bg-red-600",
];

const WA_MSG = (name: string, userId: string) =>
  storeInquiryMessage(name, `https://jemlamaroc.com/sellers/${userId}`);

// ── Seller Card ───────────────────────────────────────────────────────────────

function SellerCard({ s }: { s: Seller }) {
  const slug     = s.user.id;
  const initials = s.businessName.slice(0, 2).toUpperCase();
  const idx      = s.businessName.charCodeAt(0) % PALETTE.length;
  const gradient = PALETTE[idx];
  const logoBg   = LOGO_BG[idx];
  const products = s._count?.products ?? 0;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">

      {/* Banner */}
      <div className={`h-28 bg-gradient-to-br ${gradient} relative overflow-hidden shrink-0`}>
        {s.banner ? (
          <img src={s.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          /* Decorative pattern when no banner */
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-4 w-16 h-16 border-2 border-white rounded-full" />
            <div className="absolute -bottom-4 right-12 w-24 h-24 border border-white rounded-full" />
            <div className="absolute top-4 right-20 w-8 h-8 border border-white rounded-full" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/15" />

        {/* Verified pill on banner */}
        {s.verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            <BadgeCheck className="w-3 h-3" />
            Vérifié
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-5 -mt-7 relative flex flex-col flex-1">

        {/* Logo */}
        <div className="mb-3 flex items-end justify-between">
          {s.logo ? (
            <img
              src={s.logo}
              alt={s.businessName}
              className="w-14 h-14 rounded-2xl object-cover border-[3px] border-white shadow-lg"
            />
          ) : (
            <div className={`w-14 h-14 ${logoBg} rounded-2xl flex items-center justify-center text-white font-black text-base border-[3px] border-white shadow-lg`}>
              {initials}
            </div>
          )}

          {/* Response speed badge */}
          {s.whatsapp && (
            <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full font-semibold mt-8">
              <Zap className="w-2.5 h-2.5" />
              Répond rapidement
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1.5 mb-4">
          <h3 className="font-black text-gray-900 text-sm leading-tight group-hover:text-primary transition-colors">
            {s.businessName}
          </h3>

          <div className="flex items-center gap-3 flex-wrap">
            {s.city && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3 text-gray-400" />
                {s.city}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Package className="w-3 h-3 text-gray-400" />
              {products} produit{products !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Stars */}
          {(() => {
            const r = s.rating > 0 ? s.rating : 4.8;
            return (
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3 h-3 ${i <= Math.round(r) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">{r.toFixed(1)}</span>
              </div>
            );
          })()}

          {s.description ? (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{s.description}</p>
          ) : (
            <p className="text-xs text-gray-400 italic">Grossiste marocain vérifié</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Link
            href={`/sellers/${slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold bg-[#0f2849] hover:bg-[#1a3f72] text-white py-2.5 rounded-xl transition-colors group/btn"
          >
            Voir boutique
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          {s.whatsapp ? (
            <a
              href={buildWhatsAppUrl(s.whatsapp, WA_MSG(s.businessName, s.user.id))}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fb855] text-white text-sm font-bold px-3.5 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/sellers/${slug}`}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Contact
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SellersPage() {
  const [sellers, setSellers]       = useState<Seller[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters]   = useState(false);
  const filterRef                       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/sellers").then(r => setSellers(r.data)).finally(() => setLoading(false));
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
    <div className="bg-gray-50 min-h-screen">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#060f1e] via-[#0f2849] to-[#1a3a6e]">
        <div className="container py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

            {/* Left: text + search */}
            <div className="lg:col-span-3">
              {/* Label */}
              <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                <Users className="w-3.5 h-3.5" />
                Annuaire des fournisseurs vérifiés
              </div>

              <h1 className="text-white font-black text-3xl sm:text-[2.2rem] leading-[1.15] mb-3">
                Nos Fournisseurs<br />
                <span className="text-accent">Vérifiés</span>
              </h1>
              <p className="text-blue-200 text-sm sm:text-base mb-5 max-w-lg leading-relaxed">
                Trouvez des grossistes fiables et contactez directement des fournisseurs marocains vérifiés.
              </p>

              {/* Trust bullets */}
              <div className="flex flex-col sm:flex-row gap-2 mb-7">
                {[
                  { icon: BadgeCheck, label: "Fournisseurs vérifiés",            color: "text-blue-300" },
                  { icon: MessageCircle, label: "Contact direct WhatsApp",        color: "text-green-300" },
                  { icon: Truck,      label: "Vente en gros partout au Maroc",    color: "text-accent" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${color} shrink-0`} />
                    <span className="text-blue-100 text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Search + Filter */}
              <div className="flex gap-2 max-w-lg">
                <div className="flex-1 flex items-center bg-white rounded-xl h-12 shadow-xl shadow-black/30 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-accent transition-all overflow-hidden">
                  <Search className="w-4 h-4 text-gray-400 ml-4 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un fournisseur, produit ou ville"
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
                    Filtres
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
                        <p className="font-bold text-gray-800 text-sm">Filtres</p>
                        {activeFilters > 0 && (
                          <button onClick={clearAll} className="text-xs text-primary hover:underline">Réinitialiser</button>
                        )}
                      </div>

                      {/* City filter */}
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wide">Ville</label>
                        <select
                          value={filterCity}
                          onChange={e => setFilterCity(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary bg-gray-50"
                        >
                          <option value="">Toutes les villes</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Verified only */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => setVerifiedOnly(!verifiedOnly)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${verifiedOnly ? "bg-blue-500" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Fournisseurs vérifiés</p>
                          <p className="text-xs text-gray-400">Afficher uniquement les certifiés</p>
                        </div>
                      </label>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full mt-4 bg-[#0f2849] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#1a3f72] transition-colors"
                      >
                        Appliquer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: stats cards */}
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
              {[
                { icon: Users,   value: "500+",  label: "Fournisseurs vérifiés",  color: "text-blue-300",  bg: "bg-blue-500/10",  border: "border-blue-500/20" },
                { icon: Package, value: "10 000+", label: "Produits disponibles", color: "text-accent",     bg: "bg-orange-500/10",border: "border-orange-500/20" },
                { icon: MapPin,  value: "40+",   label: "Villes couvertes",        color: "text-green-300", bg: "bg-green-500/10", border: "border-green-500/20" },
              ].map(({ icon: Icon, value, label, color, bg, border }) => (
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
                  Tous nos fournisseurs sont contrôlés et certifiés par notre équipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CONTENT
      ══════════════════════════════════ */}
      <div className="container py-8">

        {/* Active filters + result info */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm font-semibold text-gray-700">
              {loading
                ? "Chargement..."
                : search || activeFilters > 0
                  ? `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`
                  : "Grossistes partenaires"
              }
            </p>

            {/* Active filter pills */}
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
                Vérifiés seulement
                <button onClick={() => setVerifiedOnly(false)} className="ml-0.5 hover:text-green-900">×</button>
              </span>
            )}
          </div>

          {(search || activeFilters > 0) && (
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors">
              <X className="w-3.5 h-3.5" /> Tout effacer
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 bg-gray-200" />
                <div className="px-4 pb-5 -mt-7">
                  <div className="flex justify-between mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-300 border-[3px] border-white" />
                    <div className="w-24 h-5 bg-gray-100 rounded-full mt-8" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-5" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Store className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-black text-gray-700 text-lg mb-2">Aucun fournisseur trouvé</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              {search || activeFilters > 0
                ? "Essayez une autre ville ou catégorie."
                : "Aucun fournisseur disponible pour le moment."}
            </p>
            <div className="flex gap-3 justify-center">
              {(search || activeFilters > 0) && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 bg-[#0f2849] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a3f72] transition-colors"
                >
                  Voir tous les fournisseurs
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(s => <SellerCard key={s.id} s={s} />)}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && filtered.length > 0 && (
          <div className="mt-10 bg-gradient-to-r from-[#0f2849] to-[#1a3f72] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-black text-base sm:text-lg mb-1">
                Vous êtes grossiste ou fournisseur ?
              </h3>
              <p className="text-blue-200 text-sm">Rejoignez notre réseau et touchez des milliers d'acheteurs.</p>
            </div>
            <Link
              href="/register?role=seller"
              className="shrink-0 flex items-center gap-2 bg-accent hover:bg-orange-400 text-[#0f2849] font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg whitespace-nowrap text-sm"
            >
              <Store className="w-4 h-4" />
              Ouvrir ma boutique
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
