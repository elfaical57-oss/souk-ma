"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronRight } from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès",
  "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Safi", "El Jadida",
];

const CATEGORIES = [
  { label: "Électronique",  labelAr: "إلكترونيات",        value: "electronics",  icon: "💻" },
  { label: "Mode",          labelAr: "الموضة",             value: "fashion",      icon: "👗" },
  { label: "Maison & Déco", labelAr: "المنزل والديكور",    value: "home",         icon: "🏠" },
  { label: "Alimentation",  labelAr: "الغذاء",             value: "food",         icon: "🍎" },
  { label: "Auto & Moto",   labelAr: "السيارات",           value: "auto",         icon: "🚗" },
  { label: "Artisanat",     labelAr: "الصناعة التقليدية",  value: "handicraft",   icon: "🏺" },
  { label: "Matériaux BTP", labelAr: "مواد البناء",        value: "construction", icon: "🧱" },
  { label: "Agriculture",   labelAr: "الزراعة",            value: "agriculture",  icon: "🌿" },
];

const PRICE_RANGES = [
  { label: "Moins de 100 MAD", min: "", max: "100" },
  { label: "100 – 500 MAD",    min: "100", max: "500" },
  { label: "500 – 2000 MAD",   min: "500", max: "2000" },
  { label: "2000 – 10000 MAD", min: "2000", max: "10000" },
  { label: "Plus de 10000 MAD",min: "10000", max: "" },
];

function ProductsContent() {
  const params   = useSearchParams();
  const router   = useRouter();
  const { lang } = useLangStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(params.get("search") || "");

  const currentCategory = params.get("category") || "";
  const currentCity     = params.get("city") || "";
  const currentMin      = params.get("minPrice") || "";
  const currentMax      = params.get("maxPrice") || "";
  const currentSearch   = params.get("search") || "";

  const [minPrice, setMinPrice] = useState(currentMin);
  const [maxPrice, setMaxPrice] = useState(currentMax);

  useEffect(() => {
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setLocalSearch(params.get("search") || "");
  }, [params]);

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams();
    if (currentSearch)   p.set("search",   currentSearch);
    if (currentCategory) p.set("category", currentCategory);
    if (currentCity)     p.set("city",     currentCity);
    if (currentMin)      p.set("minPrice", currentMin);
    if (currentMax)      p.set("maxPrice", currentMax);
    Object.entries(overrides).forEach(([k, v]) => { if (v) p.set(k, v); else p.delete(k); });
    return `/products?${p.toString()}`;
  };

  const go = (overrides: Record<string, string>) => { router.push(buildUrl(overrides)); setMobileOpen(false); };

  const clearAll = () => {
    setMinPrice(""); setMaxPrice("");
    const p = new URLSearchParams();
    if (currentSearch) p.set("search", currentSearch);
    router.push(`/products?${p.toString()}`);
  };

  const hasFilters = currentCategory || currentCity || currentMin || currentMax;

  const query: Record<string, string> = {};
  params.forEach((v, k) => { query[k] = v; });

  const activeCat = CATEGORIES.find(c => c.value === currentCategory);

  const Sidebar = () => (
    <div className="space-y-0 divide-y divide-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-0">
        <span className="font-bold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          {lang === "ar" ? "تصفية" : "Filtres"}
        </span>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium">
            <X className="w-3 h-3" /> {lang === "ar" ? "مسح" : "Effacer tout"}
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="py-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          {lang === "ar" ? "الفئات" : "Catégories"}
        </p>
        <div className="space-y-0.5">
          <button onClick={() => go({ category: "" })}
            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors text-left ${!currentCategory ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
            <span className="text-base">🛍️</span>
            <span>{lang === "ar" ? "جميع الفئات" : "Toutes les catégories"}</span>
            {!currentCategory && <ChevronRight className="w-3 h-3 ml-auto" />}
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => go({ category: c.value === currentCategory ? "" : c.value })}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors text-left ${currentCategory === c.value ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
              <span className="text-base">{c.icon}</span>
              <span>{lang === "ar" ? c.labelAr : c.label}</span>
              {currentCategory === c.value && <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="py-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          {lang === "ar" ? "المدينة" : "Ville"}
        </p>
        <div className="relative">
          <select value={currentCity} onChange={(e) => go({ city: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary appearance-none bg-white">
            <option value="">{lang === "ar" ? "جميع المدن" : "Toutes les villes"}</option>
            {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Price ranges */}
      <div className="py-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          {lang === "ar" ? "نطاق السعر" : "Fourchette de prix"}
        </p>
        <div className="space-y-0.5">
          {PRICE_RANGES.map((r) => {
            const active = currentMin === r.min && currentMax === r.max;
            return (
              <button key={r.label} onClick={() => go({ minPrice: r.min, maxPrice: r.max })}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <input type="number" placeholder={lang === "ar" ? "أدنى سعر" : "Prix min"}
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-primary" />
          <input type="number" placeholder={lang === "ar" ? "أقصى سعر" : "Prix max"}
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-primary" />
        </div>
        <button onClick={() => go({ minPrice, maxPrice })}
          className="w-full mt-2 bg-primary text-white text-sm py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
          {lang === "ar" ? "تطبيق" : "Appliquer"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Breadcrumb + search bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push("/")}>
              {lang === "ar" ? "الرئيسية" : "Accueil"}
            </span>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-800 font-medium truncate">
              {activeCat ? (lang === "ar" ? activeCat.labelAr : activeCat.label) : (lang === "ar" ? "جميع المنتجات" : "Tous les produits")}
            </span>
          </div>

          {/* Inline search */}
          <form onSubmit={(e) => { e.preventDefault(); go({ search: localSearch }); }} className="hidden md:flex items-center border border-gray-200 rounded-xl overflow-hidden max-w-sm w-full">
            <Search className="w-4 h-4 text-gray-400 mx-3 shrink-0" />
            <input value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث في المنتجات..." : "Rechercher dans les produits..."}
              className="flex-1 py-2 text-sm text-gray-700 outline-none" />
            {localSearch && <button type="button" onClick={() => { setLocalSearch(""); go({ search: "" }); }} className="px-2"><X className="w-3.5 h-3.5 text-gray-400" /></button>}
          </form>
        </div>
      </div>

      <div className="container py-5">
        <div className="flex gap-5">

          {/* ── SIDEBAR ── (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-4">
              <Sidebar />
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {hasFilters && (
                  <>
                    {currentCategory && (
                      <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                        {activeCat?.icon} {lang === "ar" ? activeCat?.labelAr : activeCat?.label}
                        <button onClick={() => go({ category: "" })} className="ml-1 hover:opacity-70"><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {currentCity && (
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        📍 {currentCity}
                        <button onClick={() => go({ city: "" })} className="ml-1 hover:opacity-70"><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {(currentMin || currentMax) && (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        💰 {currentMin || "0"} – {currentMax || "∞"} MAD
                        <button onClick={() => go({ minPrice: "", maxPrice: "" })} className="ml-1 hover:opacity-70"><X className="w-3 h-3" /></button>
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                {lang === "ar" ? "تصفية" : "Filtres"}
                {hasFilters && <span className="bg-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">!</span>}
              </button>
            </div>

            <ProductGrid query={query} />
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">{lang === "ar" ? "التصفية" : "Filtres"}</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
