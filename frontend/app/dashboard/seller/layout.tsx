"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Plus, Store, Settings, LogOut, Menu, X, MessageCircle } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";

const NAV = [
  { href: "/dashboard/seller",              icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/dashboard/seller/products/new", icon: Plus,            label: "Ajouter un produit" },
  { href: "/dashboard/seller/products",     icon: Package,         label: "Gérer mes produits" },
  { href: "/dashboard/seller/profile",      icon: Settings,        label: "Paramètres boutique" },
  { href: "/chat",                          icon: MessageCircle,   label: "Messages" },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, token, logout } = useAuthStore();
  const pathname = usePathname();
  const router   = useRouter();
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token) { router.push("/login"); return; }
      if (user && user.role !== "SELLER") { router.push("/"); return; }
      setChecking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [user, token, router]);

  useEffect(() => { setOpen(false); }, [pathname]);

  if (checking) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const storeHref = user ? `/sellers/${user.id}` : "/sellers";

  const Sidebar = () => (
    <aside className="w-60 shrink-0 bg-[#0f2849] flex flex-col border-r border-white/10 h-full">
      {/* Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-[#0f2849]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-none">Espace Vendeur</p>
          <p className="text-white/40 text-xs mt-0.5">JemlaMaroc</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden w-8 h-8 flex items-center justify-center text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* View store link */}
      <div className="px-3 pt-3">
        <Link
          href={storeHref}
          target="_blank"
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-accent border border-accent/30 hover:bg-accent/10 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          Voir ma boutique
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-[#0f2849]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <n.icon className="w-4 h-4 shrink-0" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
              {user.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-white/40 text-xs">Vendeur</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 h-14 px-4 bg-[#0f2849] border-b border-white/10 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-[#0f2849]" />
            </div>
            <span className="text-white font-bold text-sm">Espace Vendeur</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
