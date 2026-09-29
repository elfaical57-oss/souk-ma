"use client";

import { BadgeCheck, Headphones, Package, ShieldCheck, Truck } from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

const ITEMS = [
  { icon: Package, fr: "+10 000 produits en gros", ar: "+10 000 منتج بالجملة" },
  { icon: BadgeCheck, fr: "+2 500 fournisseurs vérifiés", ar: "+2 500 مورد موثّق" },
  { icon: Truck, fr: "Livraison partout au Maroc", ar: "التوصيل في كل أنحاء المغرب" },
  { icon: ShieldCheck, fr: "Paiement sécurisé", ar: "دفع آمن" },
  { icon: Headphones, fr: "Support 7j/7", ar: "دعم 7 أيام/7" },
] as const;

export default function TopBar() {
  const { lang } = useLangStore();

  return (
    <div className="bg-navy text-white/80">
      <div className="container flex items-center justify-between h-8 gap-4">
        <ul className="flex items-center gap-5 overflow-x-auto scrollbar-hide text-[11px] font-medium tracking-wide">
          {ITEMS.map(({ icon: Icon, fr, ar }, i) => (
            <li
              key={fr}
              className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 ${i > 2 ? "hidden md:flex" : ""}`}
            >
              <Icon className="w-3 h-3 text-accent" aria-hidden="true" />
              <span>{lang === "ar" ? ar : fr}</span>
            </li>
          ))}
        </ul>
        <a
          href="tel:+212634320058"
          className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90 hover:text-white shrink-0"
        >
          <Headphones className="w-3 h-3 text-accent" aria-hidden="true" />
          +212 6 34 32 00 58
        </a>
      </div>
    </div>
  );
}
