"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/catalog";
import useLangStore from "@/lib/stores/langStore";
import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";
import { cardVariant, stagger } from "./motion";

export default function CategoryGrid() {
  const { t } = useLangStore();

  return (
    <section className="container scroll-mt-40">
      <SectionHeader
        title={t.home.cats_title}
        subtitle={t.home.cats_subtitle}
        href="/products"
        linkLabel={t.home.see_all_cats}
      />

      <motion.div
        className="-mx-4 px-4 flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2
                   md:mx-0 md:px-0 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {CATEGORIES.map((c) => (
          <motion.div key={c.slug} variants={cardVariant} className="w-[240px] shrink-0 snap-start md:w-auto md:min-w-0">
            <CategoryCard category={c} />
          </motion.div>
        ))}
      </motion.div>

      <div className="md:hidden mt-4 text-center">
        <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-navy">
          {t.home.see_all} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
