"use client";

import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { motion } from "framer-motion";
import type { Seller } from "@/lib/types";
import type { ProductCardData } from "@/lib/types";
import useLangStore from "@/lib/stores/langStore";
import SupplierCard from "@/components/suppliers/SupplierCard";
import HeroSection from "@/components/home/HeroSection";
import TrustStats from "@/components/home/TrustStats";
import CategoryGrid from "@/components/home/CategoryGrid";
import PromotionSection from "@/components/home/PromotionSection";
import SupplierDiscovery from "@/components/home/SupplierDiscovery";
import HowItWorks from "@/components/home/HowItWorks";
import SupplierCTA from "@/components/home/SupplierCTA";
import SectionHeader from "@/components/home/SectionHeader";
import { cardVariant, fadeIn, stagger } from "@/components/home/motion";

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
      <HeroSection />
      <TrustStats />

      <div className="space-y-16 pt-8 lg:pt-10">
        <CategoryGrid />
        <PromotionSection products={products} />
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
