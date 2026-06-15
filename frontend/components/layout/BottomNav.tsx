"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Store, LogIn, User, LayoutDashboard } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

export default function BottomNav() {
  const pathname = usePathname();
  const { lang } = useLangStore();
  const { user } = useAuthStore();
  const isAr = lang === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const accountItem = mounted && user
    ? {
        href: user.role === "SELLER" ? "/dashboard/seller" : "/",
        icon: user.role === "SELLER" ? LayoutDashboard : User,
        label: isAr ? "حسابي" : "Compte",
      }
    : {
        href: "/login",
        icon: LogIn,
        label: isAr ? "دخول" : "Connexion",
      };

  const ITEMS = [
    { href: "/",        icon: Home,    label: isAr ? "الرئيسية" : "Accueil",  exact: true  },
    { href: "/products", icon: Package, label: isAr ? "منتجات"   : "Produits", exact: false },
    { href: "/sellers",  icon: Store,   label: isAr ? "بائعون"   : "Vendeurs", exact: false },
    { ...accountItem, exact: false },
  ];

  return (
    <nav
      dir={isAr ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-2px_24px_rgba(0,0,0,0.10)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href + label}
              href={href}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              {/* Active top indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-orange-500 rounded-b-full" />
              )}

              <Icon
                className={`w-[22px] h-[22px] transition-colors ${
                  active ? "text-orange-500" : "text-gray-400"
                }`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-semibold leading-none transition-colors ${
                  active ? "text-orange-500" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
