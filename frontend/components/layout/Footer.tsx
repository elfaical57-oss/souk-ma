"use client";

import Link from "next/link";
import { Store, Phone, Mail, MapPin } from "lucide-react";
import useLangStore from "@/lib/stores/langStore";

export default function Footer() {
  const { t } = useLangStore();

  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-4">
            <Store className="w-6 h-6 text-accent" />
            <span>Jemla<span className="text-accent">Maroc</span></span>
          </div>
          <p className="text-blue-300 text-sm">المتجر الإلكتروني الأول في المغرب</p>
          <p className="text-blue-300 text-sm">La marketplace du Maroc</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.footer.buyers}</h4>
          <ul className="space-y-2 text-sm text-blue-300">
            <li><Link href="/products" className="hover:text-white transition-colors">{t.footer.all_products}</Link></li>
            <li><Link href="/sellers" className="hover:text-white transition-colors">{t.footer.our_sellers}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.footer.sellers}</h4>
          <ul className="space-y-2 text-sm text-blue-300">
            <li><Link href="/register?role=seller" className="hover:text-white transition-colors">{t.footer.become_seller}</Link></li>
            <li><Link href="/dashboard/seller" className="hover:text-white transition-colors">{t.footer.seller_space}</Link></li>
            <li><Link href="/dashboard/seller/products/new" className="hover:text-white transition-colors">{t.footer.add_product}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.footer.contact}</h4>
          <ul className="space-y-2 text-sm text-blue-300">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" />+212 6XX XXX XXX</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" />contact@jemlamaroc.ma</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" />Casablanca, Maroc</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-blue-400">
          <p>© 2026 JemlaMaroc. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
