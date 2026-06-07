"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, Store, ShoppingBag, TrendingUp, Clock, MapPin, ChevronRight } from "lucide-react";
import api from "@/lib/api";

interface Stats {
  userCount: number;
  productCount: number;
  orderCount: number;
  sellerCount: number;
  recentUsers: { id: string; name: string; phone: string; role: string; city?: string; createdAt: string }[];
  recentProducts: { id: string; title: string; price: number; isActive: boolean; seller: { name: string }; category: { nameFr: string } }[];
}

const STAT_CARDS = (s: Stats) => [
  { icon: Users,       label: "Utilisateurs",  value: s.userCount,    color: "bg-blue-500",   link: "/dashboard/admin/users" },
  { icon: Store,       label: "Vendeurs",       value: s.sellerCount,  color: "bg-orange-500", link: "/dashboard/admin/sellers" },
  { icon: Package,     label: "Produits",       value: s.productCount, color: "bg-green-500",  link: "/dashboard/admin/products" },
  { icon: ShoppingBag, label: "Commandes",      value: s.orderCount,   color: "bg-purple-500", link: "#" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Vue d&apos;ensemble</h1>
        <p className="text-gray-400 text-sm mt-1">Bienvenue sur le panneau d&apos;administration JemlaMaroc</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats ? STAT_CARDS(stats).map((c) => (
          <Link key={c.label} href={c.link} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-colors group">
            <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center mb-4`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{c.value.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">{c.label}</p>
          </Link>
        )) : Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Nouveaux utilisateurs</h2>
            </div>
            <Link href="/dashboard/admin/users" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {stats?.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{u.name}</p>
                  <p className="text-gray-400 text-xs">{u.phone}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {u.city && <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{u.city}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === "ADMIN" ? "bg-red-500/20 text-red-400" :
                    u.role === "SELLER" ? "bg-orange-500/20 text-orange-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>{u.role}</span>
                </div>
              </div>
            )) ?? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                  <div className="h-2.5 bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent products */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-green-400" />
              <h2 className="text-white font-semibold text-sm">Derniers produits</h2>
            </div>
            <Link href="/dashboard/admin/products" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {stats?.recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.title}</p>
                  <p className="text-gray-400 text-xs">{p.seller.name} · {p.category.nameFr}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-sm font-bold">{p.price.toFixed(0)} MAD</p>
                  <span className={`text-xs ${p.isActive ? "text-green-400" : "text-red-400"}`}>
                    {p.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            )) ?? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
