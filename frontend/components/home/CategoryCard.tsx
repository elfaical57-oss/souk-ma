"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategoryMeta } from "@/lib/catalog";
import useLangStore from "@/lib/stores/langStore";
import CoverImage from "@/components/ui/CoverImage";

export default function CategoryCard({ category }: { category: CategoryMeta }) {
  const { lang } = useLangStore();
  const name = lang === "ar" ? category.labelAr : category.label;
  const desc = lang === "ar" ? category.descriptionAr : category.description;

  return (
    <Link
      href={`/products/categorie/${category.slug}`}
      className="group relative block w-full rounded-2xl overflow-hidden aspect-[4/3] bg-navy-800 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <CoverImage
        src={category.image}
        alt={name}
        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-white font-bold text-base leading-tight">{name}</h3>
        <p className="text-white/75 text-xs mt-1 line-clamp-1">{desc}</p>
        <p className="inline-flex items-center gap-1 text-accent text-xs font-semibold mt-2">
          {category.countLabel} {lang === "ar" ? "منتج" : "produits"}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      </div>
    </Link>
  );
}
