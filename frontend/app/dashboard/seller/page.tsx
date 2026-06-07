"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, TrendingUp, ShoppingBag, Plus } from "lucide-react";
import api from "@/lib/api";

interface Stats {
  productCount: number;
  totalRevenue: number;
  totalOrders: number;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/sellers/dashboard/stats").then((r) => setStats(r.data)).catch(console.error);
  }, []);

  const cards = stats ? [
    { icon: Package, label: "Produits actifs", labelAr: "المنتجات", value: stats.productCount, color: "text-blue-600 bg-blue-50" },
    { icon: ShoppingBag, label: "Commandes reçues", labelAr: "الطلبات", value: stats.totalOrders, color: "text-green-600 bg-green-50" },
    { icon: TrendingUp, label: "Chiffre d'affaires", labelAr: "الإيرادات", value: `${stats.totalRevenue.toFixed(0)} MAD`, color: "text-primary bg-red-50" },
  ] : [];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord Vendeur</h1>
          <p className="text-gray-500 font-arabic text-sm">لوحة تحكم البائع</p>
        </div>
        <Link href="/dashboard/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau produit
        </Link>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {cards.map((c) => (
            <div key={c.label} className="card p-6">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold mb-1">{c.value}</p>
              <p className="text-sm text-gray-600">{c.label}</p>
              <p className="text-xs text-gray-400 font-arabic">{c.labelAr}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => <div key={i} className="card p-6 animate-pulse h-36 bg-gray-100" />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link href="/dashboard/seller/products/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Plus className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Ajouter un produit</p>
                <p className="text-xs text-gray-500 font-arabic">إضافة منتج</p>
              </div>
            </Link>
            <Link href="/dashboard/seller/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">Gérer mes produits</p>
                <p className="text-xs text-gray-500 font-arabic">إدارة منتجاتي</p>
              </div>
            </Link>
            <Link href="/chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <ShoppingBag className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Messages clients</p>
                <p className="text-xs text-gray-500 font-arabic">رسائل العملاء</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold mb-4">Conseils / نصائح</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-green-500">✓</span> Ajoutez plusieurs photos de qualité à vos produits</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Répondez rapidement aux messages WhatsApp</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Mettez des prix en gros pour attirer les acheteurs B2B</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Précisez votre ville pour les acheteurs locaux</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
