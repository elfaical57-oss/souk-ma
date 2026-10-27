"use client";

import CoverImage from "@/components/ui/CoverImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Seller } from "@/lib/types";
import { citySlug, CITIES } from "@/lib/catalog";
import { FEATURED_CITIES, VISUALS } from "@/lib/visuals";
import useLangStore from "@/lib/stores/langStore";
import SectionHeader from "./SectionHeader";
import { cardVariant, stagger } from "./motion";

function cityImage(city: string): string {
  return VISUALS.cities[city as keyof typeof VISUALS.cities] ?? VISUALS.hero;
}

export default function SupplierDiscovery({ sellers }: { sellers: Seller[] }) {
  const { t, lang } = useLangStore();
  const h = t.home;

  const counts = FEATURED_CITIES.map(({ city }) => ({
    city,
    live: sellers.filter((s) => s.city === city).length,
  }));

  return (
    <section className="container">
      <SectionHeader
        title={h.cities_title}
        subtitle={h.cities_subtitle}
        href="/sellers"
        linkLabel={h.all_suppliers}
      />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {counts.map(({ city, live }) => (
          <motion.div key={city} variants={cardVariant}>
            <Link
              href={`/products/ville/${citySlug(city)}`}
              className="group relative block rounded-2xl overflow-hidden aspect-[5/4] bg-navy-800 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <CoverImage
                src={cityImage(city)}
                alt={city}
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/65 to-black/20" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-white font-bold text-sm">{city}</p>
                <p className="text-white/80 text-[11px] mt-0.5 inline-flex items-center gap-1">
                  {live > 0 ? `${live} ${lang === "ar" ? "مورد" : live > 1 ? "fournisseurs" : "fournisseur"}` : (lang === "ar" ? "اكتشف" : "Découvrir")}
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-6 mb-2">
        {lang === "ar" ? "مدن أخرى" : "Autres villes"}
      </p>
      <div className="flex flex-wrap gap-2">
        {CITIES.filter((c) => !FEATURED_CITIES.some((f) => f.city === c)).map((c) => (
          <Link
            key={c}
            href={`/products/ville/${citySlug(c)}`}
            className="text-xs bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-500 px-2.5 py-1 rounded-lg transition-colors"
          >
            {c}
          </Link>
        ))}
      </div>
    </section>
  );
}
