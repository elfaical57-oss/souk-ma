"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Store, LogIn, User, LayoutDashboard, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";
import useCartStore from "@/lib/stores/cartStore";

export default function BottomNav() {
  const pathname      = usePathname();
  const { lang }      = useLangStore();
  const { user }      = useAuthStore();
  const cartItems     = useCartStore(s => s.items);
  const cartCount     = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const isAr          = lang === "ar";
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
    { href: "/",        icon: Home,    label: isAr ? "الرئيسية" : "Accueil",  exact: true,  badge: 0          },
    { href: "/products", icon: Package, label: isAr ? "منتجات"   : "Produits", exact: false, badge: 0          },
    { href: "/sellers",  icon: Store,   label: isAr ? "بائعون"   : "Vendeurs", exact: false, badge: 0          },
    { href: "/cart",     icon: ShoppingBag, label: isAr ? "سلة"  : "Panier",   exact: false, badge: cartCount  },
    { ...accountItem, exact: false, badge: 0 },
  ];

  return (
    <nav
      dir={isAr ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {ITEMS.map(({ href, icon: Icon, label, exact, badge }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href + label}
              href={href}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors group"
            >
              {/* Active indicator bar */}
              <motion.span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] bg-primary rounded-b-full"
                initial={false}
                animate={{ width: active ? 28 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              />

              {/* Icon wrapper */}
              <div className="relative">
                <motion.div
                  animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors ${active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </motion.div>

                {/* Badge */}
                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 leading-none"
                  >
                    {badge > 9 ? "9+" : badge}
                  </motion.span>
                )}
              </div>

              <motion.span
                animate={{ color: active ? "#e63946" : "#9ca3af" }}
                className="text-[10px] font-semibold leading-none"
              >
                {label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
