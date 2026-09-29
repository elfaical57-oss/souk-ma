"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import useLangStore from "@/lib/stores/langStore";
import { fadeUp } from "./motion";

export default function SupplierCTA() {
  const { t } = useLangStore();
  const h = t.home;

  const benefits = [
    h.cta_buyers,
    h.cta_manage,
    h.cta_visibility,
  ];

  return (
    <section className="container pb-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="rounded-2xl bg-[#FFF4EB] px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div>
          <h2 className="text-navy font-bold text-xl sm:text-2xl mb-1">{h.cta_title}</h2>
          <p className="text-slate-600 text-sm mb-4">{h.cta_desc}</p>
          <ul className="space-y-2">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/register?role=seller" className="btn-accent shrink-0 px-6 py-3.5">
          {h.open_shop}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
