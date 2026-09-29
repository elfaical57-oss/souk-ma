"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Store, LogIn, User, LayoutDashboard } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";
import { cn } from "@/lib/cn";

export default function BottomNav() {
  const pathname = usePathname();
  const { lang } = useLangStore();
  const { user } = useAuthStore();
  const isAr = lang === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const accountItem = mounted && user
    ? {
        href:  user.role === "SELLER" ? "/dashboard/seller" : "/profile",
        icon:  user.role === "SELLER" ? LayoutDashboard : User,
        label: isAr ? "حسابي" : "Compte",
      }
    : {
        href:  "/login",
        icon:  LogIn,
        label: isAr ? "دخول" : "Connexion",
      };

  const ITEMS = [
    { href: "/",         icon: Home,    label: isAr ? "الرئيسية" : "Accueil",  exact: true },
    { href: "/products", icon: Package, label: isAr ? "منتجات"   : "Produits", exact: false },
    { href: "/sellers",  icon: Store,   label: isAr ? "موردون"   : "Vendeurs", exact: false },
    { ...accountItem, exact: false },
  ];

  return (
    <nav
      dir={isAr ? "rtl" : "ltr"}
      aria-label={isAr ? "التنقل السفلي" : "Navigation mobile"}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-slate-100 shadow-[0_-4px_24px_rgba(11,37,69,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href + label}
              href={href}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px]"
            >
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-7 bg-primary rounded-b-full" />}
              <Icon
                className={cn("w-[22px] h-[22px] transition-colors", active ? "text-primary" : "text-slate-400")}
                strokeWidth={active ? 2.5 : 1.8}
                aria-hidden="true"
              />
              <span className={cn("text-[10px] font-semibold leading-none", active ? "text-primary" : "text-slate-400")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
