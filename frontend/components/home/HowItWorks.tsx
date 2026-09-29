"use client";

import { MessageCircle, Search, ShoppingBag, Users } from "lucide-react";
import { motion } from "framer-motion";
import useLangStore from "@/lib/stores/langStore";
import { cardVariant, fadeUp, stagger } from "./motion";

const ICONS = [Search, Users, MessageCircle, ShoppingBag];

export default function HowItWorks() {
  const { t } = useLangStore();
  const h = t.home;

  const STEPS = [
    { n: "01", title: h.how_step1_title, desc: h.how_step1_desc },
    { n: "02", title: h.how_step2_title, desc: h.how_step2_desc },
    { n: "03", title: h.how_step3_title, desc: h.how_step3_desc },
    { n: "04", title: h.how_step4_title, desc: h.how_step4_desc },
  ];

  return (
    <section id="how-it-works" className="container scroll-mt-28">
      <motion.div
        className="text-center mb-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">{h.how_simple}</p>
        <h2 className="font-bold text-navy text-xl sm:text-2xl">{h.how_title}</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">{h.how_subtitle}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {STEPS.map(({ n, title, desc }, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div key={n} variants={cardVariant} className="bg-white rounded-2xl shadow-card p-5 relative">
              <span className="absolute -top-3 left-5 bg-navy text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {n}
              </span>
              <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-navy mb-2 text-sm">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
