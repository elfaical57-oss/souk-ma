"use client";

import CoverImage from "@/components/ui/CoverImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductCardData } from "@/lib/types";
import { VISUALS } from "@/lib/visuals";
import useLangStore from "@/lib/stores/langStore";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "./SectionHeader";
import { fadeUp } from "./motion";

export default function PromotionSection({ products }: { products: ProductCardData[] }) {
  const { t } = useLangStore();
  const h = t.home;
  const featured = products.slice(0, 3);

  return (
    <section className="container">
      <SectionHeader
        title={h.promo_title}
        subtitle={h.promo_subtitle}
        href="/products"
        linkLabel={h.see_all}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="lg:col-span-5 relative overflow-hidden rounded-2xl min-h-[280px] lg:min-h-full bg-navy"
        >
          <CoverImage
            src={VISUALS.promoWarehouse}
            alt=""
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy/75 to-navy/50" />
          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full min-h-[280px]">
            <span className="self-start text-[10px] font-bold tracking-widest uppercase text-accent bg-accent/15 border border-accent/25 px-2.5 py-1 rounded-full">
              {h.promo_badge}
            </span>
            <div>
              <h3 className="text-white text-2xl sm:text-[1.75rem] font-extrabold leading-tight mb-3">
                {h.promo_banner_title}
              </h3>
              <Link href="/products" className="btn-accent mt-2">
                {h.promo_cta}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className={featured.length ? "lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4" : "lg:col-span-7"}>
          {featured.length > 0 ? (
            featured.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
              <p className="text-slate-500 text-sm mb-4">{t.products.no_products}</p>
              <Link href="/products" className="btn-secondary text-sm">
                {h.explore_btn}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
