"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";
import type { Seller } from "@/lib/types";
import type { ProductCardData } from "@/lib/types";
import useLangStore from "@/lib/stores/langStore";
import SupplierCard from "@/components/suppliers/SupplierCard";
import MarketplaceLanding from "@/components/home/MarketplaceLanding";
import SectionHeader from "@/components/home/SectionHeader";
import { cardVariant, fadeIn, stagger } from "@/components/home/motion";

// Below-the-fold sections: still server-rendered (ssr stays true, content and
// SEO are unaffected) but their JS is split out of the initial bundle instead
// of being parsed/executed before the hero/trust/category content can paint.
const FeaturedProductsSection = dynamic(() => import("@/components/home/FeaturedProductsSection"));
const SupplierDiscovery = dynamic(() => import("@/components/home/SupplierDiscovery"));
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const SupplierCTA = dynamic(() => import("@/components/home/SupplierCTA"));

export type { Seller };

export default function HomeContent({
  sellers,
  products = [],
}: {
  sellers: Seller[];
  products?: ProductCardData[];
}) {
  const { t } = useLangStore();
  const h = t.home;
  const featuredSellers = sellers.slice(0, 4);

  return (
    <div className="bg-background min-h-screen">
      <MarketplaceLanding />

      <div className="space-y-16 pt-8 lg:pt-10">
        <FeaturedProductsSection products={products} />
        <SupplierDiscovery sellers={sellers} />

        <section className="container">
          <SectionHeader
            title={h.suppliers_title}
            subtitle={h.suppliers_subtitle}
            href="/sellers"
            linkLabel={h.all_suppliers}
          />
          {featuredSellers.length === 0 ? (
            <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white rounded-2xl shadow-card py-12 text-center">
              <Store className="w-10 h-10 mx-auto mb-3 text-slate-300" aria-hidden="true" />
              <p className="text-slate-400 text-sm">{h.no_suppliers}</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {featuredSellers.map((s) => (
                <motion.div key={s.id} variants={cardVariant}>
                  <SupplierCard seller={s} />
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="sm:hidden mt-4 text-center">
            <Link href="/sellers" className="inline-flex items-center gap-1 text-sm font-semibold text-navy">
              {h.all_suppliers} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <HowItWorks />
        <SupplierCTA />
      </div>
    </div>
  );
}
