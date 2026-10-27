"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { CATEGORIES, CITIES } from "@/lib/catalog";
import useLangStore from "@/lib/stores/langStore";
import CoverImage from "@/components/ui/CoverImage";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { VISUALS } from "@/lib/visuals";
import api from "@/lib/api";

interface HomepageAd {
  imageUrl: string;
  targetUrl: string;
}

const DEFAULT_AD: HomepageAd = { imageUrl: VISUALS.promoWarehouse, targetUrl: "/sellers" };

export default function MarketplaceLanding() {
  const router = useRouter();
  const { lang } = useLangStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [ad, setAd] = useState<HomepageAd>(DEFAULT_AD);
  const isArabic = lang === "ar";

  useEffect(() => {
    api.get<HomepageAd>("/ads/homepage").then(({ data }) => {
      if (data?.imageUrl && data?.targetUrl) setAd(data);
    }).catch(() => undefined);
  }, []);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    router.push(`/products${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="bg-white pb-8">
      <section className="container pt-5 sm:pt-7" aria-label={isArabic ? "البحث عن المنتجات" : "Recherche de produits"}>
        <h1 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
          {isArabic ? "الجملة عبر الإنترنت في المغرب" : "Grossiste en ligne au Maroc"}
        </h1>
        <form onSubmit={search} className="grid gap-2 md:grid-cols-[1.05fr_1fr_1fr_auto]">
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 px-4 text-slate-400 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="sr-only">{isArabic ? "ابحث" : "Rechercher"}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isArabic ? "منتج أو مورد" : "Produit, fournisseur, marque..."}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
          <SelectDropdown
            value={category}
            onChange={setCategory}
            ariaLabel={isArabic ? "الفئة" : "Catégorie"}
            triggerClassName="bg-slate-50 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100"
            options={[
              { value: "", label: isArabic ? "جميع الفئات" : "Toutes les catégories" },
              ...CATEGORIES.map((item) => ({ value: item.slug, label: isArabic ? item.labelAr : item.label })),
            ]}
          />
          <SelectDropdown
            value={city}
            onChange={setCity}
            ariaLabel={isArabic ? "المدينة" : "Ville"}
            triggerClassName="bg-slate-50 text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-100"
            icon={<MapPin className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />}
            options={[
              { value: "", label: isArabic ? "كل المدن" : "Toutes les villes" },
              ...CITIES.map((item) => ({ value: item, label: item })),
            ]}
          />
          <button type="submit" className="flex h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            <Search className="h-5 w-5" aria-hidden="true" />
            {isArabic ? "بحث" : "Rechercher"}
          </button>
        </form>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
          {CATEGORIES.map((item) => (
            <Link key={item.slug} href={`/products/categorie/${item.slug}`} className="group relative flex min-h-[106px] items-start overflow-hidden rounded-2xl bg-slate-100 p-3 transition-shadow hover:shadow-md sm:min-h-[114px]">
              <span className="relative z-10 max-w-[65%] text-sm font-medium leading-5 text-slate-800">{isArabic ? item.labelAr : item.label}</span>
              <span className="absolute inset-y-0 right-0 w-[58%] opacity-90 transition-transform duration-300 group-hover:scale-105">
                <CoverImage src={item.image} alt="" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw" className="object-cover object-center [mask-image:linear-gradient(to_right,transparent,black_38%)]" />
              </span>
            </Link>
          ))}
        </div>

        <a
          href={ad.targetUrl}
          target={ad.targetUrl.startsWith("http") ? "_blank" : undefined}
          rel={ad.targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={isArabic ? "إعلان" : "Publicité"}
          className="group relative mt-6 block min-h-[210px] overflow-hidden rounded-2xl bg-navy sm:min-h-[250px]"
        >
          <CoverImage src={ad.imageUrl} alt="" sizes="(max-width: 768px) 100vw, 1200px" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        </a>
      </section>
    </div>
  );
}
