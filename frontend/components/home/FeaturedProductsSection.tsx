"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductCardData } from "@/lib/types";
import useLangStore from "@/lib/stores/langStore";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "./SectionHeader";

export default function FeaturedProductsSection({ products }: { products: ProductCardData[] }) {
  const { t } = useLangStore();
  const h = t.home;
  const featured = products.slice(0, 4);

  return (
    <section className="container">
      <SectionHeader
        title={t.products.title}
        subtitle={h.cats_subtitle}
        href="/products"
        linkLabel={h.see_all}
      />

      {featured.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-card">
          <p className="mb-4 text-sm text-slate-500">{t.products.no_products}</p>
          <Link href="/products" className="btn-secondary text-sm">{h.explore_btn}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      )}
    </section>
  );
}
