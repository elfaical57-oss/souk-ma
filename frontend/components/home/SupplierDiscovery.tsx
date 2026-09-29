"use client";

import CoverImage from "@/components/ui/CoverImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Seller } from "@/lib/types";
import { citySlug } from "@/lib/catalog";
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

  const counts = FEATURED_CITIES.map(({ city, countLabel }) => {
    const live = sellers.filter((s) => s.city === city).length;
    return {
      city,
      label: live > 0 ? `${live}` : countLabel,
    };
  });

  return (
    <section className="container">
      <SectionHeader
        title={h.cities_title}
        subtitle={h.cities_subtitle}
        href="/sellers"
        linkLabel={h.all_suppliers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 hidden md:flex items-center justify-center">
          <MoroccoMap />
        </div>

        <motion.div
          className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {counts.map(({ city, label }) => (
            <motion.div key={city} variants={cardVariant}>
              <Link
                href={`/products/ville/${citySlug(city)}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[5/4] bg-navy-800 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <CoverImage
                  src={cityImage(city)}
                  alt={city}
                  sizes="(max-width: 640px) 50vw, 22vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/65 to-black/20" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white font-bold text-sm">{city}</p>
                  <p className="text-white/80 text-[11px] mt-0.5 inline-flex items-center gap-1">
                    {label} {lang === "ar" ? "مورد" : "fournisseurs"}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MoroccoMap() {
  return (
    <div className="relative w-full max-w-[280px]">
      <svg viewBox="0 0 260 340" className="w-full h-auto text-navy" role="img" aria-label="Carte du Maroc">
        <path
          fill="currentColor"
          opacity="0.12"
          d="M108 22c18-8 38-6 54 6 12 9 18 22 22 36 4 16 2 28 10 42 8 14 22 18 28 34 6 16-2 32 2 48 4 18 18 28 16 48-2 22-18 34-24 52-6 18 2 32-8 46-10 14-28 16-42 26-16 12-22 30-40 36-16 6-34 0-50-6-12-5-22-16-26-30-4-16 4-30 2-46-2-18-16-28-18-46-2-20 8-36 6-54-2-16-14-26-14-44 0-20 12-34 16-50 4-14 10-26 28-34 8-4 22-8 38-4z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.35"
          d="M108 22c18-8 38-6 54 6 12 9 18 22 22 36 4 16 2 28 10 42 8 14 22 18 28 34 6 16-2 32 2 48 4 18 18 28 16 48-2 22-18 34-24 52-6 18 2 32-8 46-10 14-28 16-42 26-16 12-22 30-40 36-16 6-34 0-50-6-12-5-22-16-26-30-4-16 4-30 2-46-2-18-16-28-18-46-2-20 8-36 6-54-2-16-14-26-14-44 0-20 12-34 16-50 4-14 10-26 28-34 8-4 22-8 38-4z"
        />
        {[
          { cx: 118, cy: 48, label: "Tanger" },
          { cx: 108, cy: 92, label: "Rabat" },
          { cx: 96, cy: 118, label: "Casablanca" },
          { cx: 148, cy: 100, label: "Fès" },
          { cx: 118, cy: 168, label: "Marrakech" },
          { cx: 88, cy: 210, label: "Agadir" },
        ].map((p) => (
          <g key={p.label}>
            <circle cx={p.cx} cy={p.cy} r="11" fill="#FF8A3D" opacity="0.22" />
            <circle cx={p.cx} cy={p.cy} r="6" fill="#FF8A3D" />
            <text x={p.cx + 12} y={p.cy + 4} fill="#0B2545" fontSize="11" fontWeight="600">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-center text-xs font-semibold text-slate-500 mt-2">Maroc</p>
    </div>
  );
}
