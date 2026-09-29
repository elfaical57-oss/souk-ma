"use client";

import { Headphones, Package, ShieldCheck, Truck, Users } from "lucide-react";
import { motion } from "framer-motion";
import useLangStore from "@/lib/stores/langStore";
import { fadeUp, stagger } from "./motion";

export default function TrustStats() {
  const { lang } = useLangStore();
  const isAr = lang === "ar";

  const STATS = [
    { icon: Package, value: "10 000+", label: isAr ? "منتج بالجملة" : "Produits en gros" },
    { icon: Users, value: "2 500+", label: isAr ? "مورد موثّق" : "Fournisseurs vérifiés" },
    { icon: Truck, value: isAr ? "التوصيل" : "Livraison", label: isAr ? "في كل أنحاء المغرب" : "Partout au Maroc" },
    { icon: ShieldCheck, value: isAr ? "دفع آمن" : "Paiement sécurisé", label: isAr ? "معاملات محمية" : "Transactions protégées" },
    { icon: Headphones, value: "Support 7j/7", label: isAr ? "فريق في خدمتكم" : "Une équipe à votre écoute" },
  ];

  return (
    <section className="relative z-20 container -mt-8 lg:-mt-10" aria-label={isAr ? "مؤشرات الثقة" : "Indicateurs de confiance"}>
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        variants={stagger(0.06)}
        initial="hidden"
        animate="show"
      >
        {STATS.map(({ icon: Icon, value, label }) => (
          <motion.div
            key={value + label}
            variants={fadeUp}
            className="bg-white rounded-2xl shadow-card px-4 py-4 flex items-start gap-3"
          >
            <span className="w-10 h-10 rounded-xl bg-orange-50 text-accent flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-navy text-sm leading-tight">{value}</p>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
