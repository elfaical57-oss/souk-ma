"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Store, Package, Tag, LogOut, Shield } from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";

const NAV = [
  { href: "/dashboard/admin",             icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/dashboard/admin/users",       icon: Users,           label: "Utilisateurs" },
  { href: "/dashboard/admin/sellers",     icon: Store,           label: "Vendeurs" },
  { href: "/dashboard/admin/products",    icon: Package,         label: "Produits" },
  { href: "/dashboard/admin/categories",  icon: Tag,             label: "Catégories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, logout } = useAuthStore();
  const pathname = usePathname();
  const router   = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token) { router.push("/login"); return; }
      if (user && user.role !== "ADMIN") { router.push("/"); return; }
      setChecking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [user, token, router]);

  if (checking) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-900 flex flex-col border-r border-gray-800">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">JemlaMaroc</p>
            <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <n.icon className="w-4 h-4 shrink-0" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-800">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-gray-400 text-xs">Administrateur</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-gray-950">
        {children}
      </main>
    </div>
  );
}
