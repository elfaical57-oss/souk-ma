"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, Store } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

const SEEN_KEY = "supplier_popup_seen";
const EXCLUDED_PREFIXES = ["/login", "/register", "/dashboard"];

export default function SupplierPopup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { lang } = useLangStore();
  const isArabic = lang === "ar";

  useEffect(() => {
    if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return;
    if (user?.role === "SELLER" || user?.role === "ADMIN") return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }

    let cancelled = false;
    api.get<{ supplierPopupEnabled: boolean }>("/settings")
      .then(({ data }) => {
        if (!cancelled && data.supplierPopupEnabled) {
          setTimeout(() => { if (!cancelled) setOpen(true); }, 800);
        }
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, [pathname, user]);

  function dismiss() {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    setOpen(false);
  }

  function confirmSupplier() {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    setOpen(false);
    router.push("/register?role=seller");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={dismiss} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
        <button
          type="button"
          onClick={dismiss}
          aria-label={isArabic ? "إغلاق" : "Fermer"}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-orange-50 text-accent flex items-center justify-center">
          <Store className="w-6 h-6" aria-hidden="true" />
        </div>

        <h2 className="text-navy font-bold text-lg mb-2">
          {isArabic ? "هل أنت مورد؟" : "Êtes-vous fournisseur ?"}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {isArabic
            ? "سجل مجانًا وابع بالجملة لآلاف المشترين في جميع أنحاء المغرب."
            : "Inscrivez-vous gratuitement et vendez en gros à des milliers d'acheteurs partout au Maroc."}
        </p>

        <div className="flex flex-col gap-2">
          <button type="button" onClick={confirmSupplier} className="btn-primary w-full justify-center">
            {isArabic ? "نعم، أنا مورد" : "Oui, je suis fournisseur"}
          </button>
          <button type="button" onClick={dismiss} className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            {isArabic ? "لا، أنا مشتري" : "Non, je suis acheteur"}
          </button>
        </div>
      </div>
    </div>
  );
}
