"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import useLangStore from "@/lib/stores/langStore";
import CoverImage from "@/components/ui/CoverImage";
import { VISUALS } from "@/lib/visuals";
import { fadeUp, stagger } from "./motion";

export default function HeroSection() {
  const { t } = useLangStore();
  const h = t.home;

  return (
    <section className="relative overflow-hidden min-h-[520px] lg:min-h-[580px] bg-navy-900 pb-10">
      <CoverImage
        src={VISUALS.hero}
        alt=""
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy/75 to-navy/40" />

      <div className="relative z-10 container py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            className="lg:col-span-6"
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-4">
              {h.market_badge}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-white text-[2rem] sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.12] mb-4">
              {h.hero_title_1}
              <br />
              {h.hero_title_mid}{" "}
              <span className="text-accent">{h.hero_title_2}</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100/90 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
              {h.hero_desc}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="btn-primary px-6 py-3.5 text-base">
                {h.explore_btn}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/register?role=seller" className="btn-ghost px-6 py-3.5 text-base">
                {h.become_seller_btn}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5">
              {[
                { icon: BadgeCheck, label: h.trust_verified },
                { icon: Truck, label: h.trust_delivery },
                { icon: ShieldCheck, label: h.trust_payment },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-blue-50 font-medium">
                  <span className="w-5 h-5 rounded-full bg-success/20 text-green-300 flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="hidden lg:block lg:col-span-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative h-[420px]" aria-hidden="true">
      <div className="absolute right-0 top-8 w-[72%] h-[64%] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-card-hover">
        <CoverImage src={VISUALS.collage.boxes} alt="" sizes="420px" className="object-cover" />
      </div>
      <div className="absolute left-2 top-0 w-[158px] h-[158px] rounded-2xl overflow-hidden ring-1 ring-white/25 shadow-card-hover">
        <CoverImage src={VISUALS.collage.electronics} alt="" sizes="160px" className="object-cover" />
      </div>
      <div className="absolute left-8 bottom-[72px] w-[140px] h-[168px] rounded-2xl overflow-hidden ring-1 ring-white/25 shadow-card-hover">
        <CoverImage src={VISUALS.collage.fashion} alt="" sizes="140px" className="object-cover" />
      </div>
      <div className="absolute right-4 bottom-4 w-[136px] h-[136px] rounded-2xl overflow-hidden ring-1 ring-white/25 shadow-card-hover">
        <CoverImage src={VISUALS.collage.lanterns} alt="" sizes="140px" className="object-cover" />
      </div>

      <div className="absolute left-1/2 top-[42%] -translate-x-[18%] bg-white rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-3 min-w-[214px]">
        <span className="w-10 h-10 rounded-full bg-green-50 text-success flex items-center justify-center shrink-0">
          <BadgeCheck className="w-5 h-5" />
        </span>
        <div>
          <p className="text-navy font-bold text-sm leading-tight">2 500+</p>
          <p className="text-[11px] text-slate-500">fournisseurs vérifiés</p>
        </div>
      </div>
    </div>
  );
}
