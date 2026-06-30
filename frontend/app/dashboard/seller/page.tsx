"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, TrendingUp, ShoppingBag, Plus, UserCircle, MessageCircle, ArrowUpRight, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import useAuthStore from "@/lib/stores/authStore";

interface Stats {
  productCount: number;
  totalRevenue: number;
  totalOrders: number;
}

const cardV = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get("/sellers/dashboard/stats").then(r => setStats(r.data)).catch(console.error);
  }, []);

  const STAT_CARDS = stats ? [
    {
      icon: Package,
      label: "Produits actifs",
      value: stats.productCount,
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-50",
      color: "text-blue-600",
      link: "/dashboard/seller/products",
    },
    {
      icon: ShoppingBag,
      label: "Commandes reçues",
      value: stats.totalOrders,
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      color: "text-green-600",
      link: "/chat",
    },
    {
      icon: TrendingUp,
      label: "Chiffre d'affaires",
      value: `${stats.totalRevenue.toFixed(0)} MAD`,
      gradient: "from-primary to-red-700",
      bg: "bg-red-50",
      color: "text-primary",
      link: "/dashboard/seller",
    },
  ] : [];

  const ACTIONS = [
    { href: "/dashboard/seller/products/new", icon: Plus,        label: "Ajouter un produit",    color: "text-primary",   bg: "bg-red-50",    hoverBg: "hover:bg-red-100"    },
    { href: "/dashboard/seller/products",     icon: Package,     label: "Gérer mes produits",    color: "text-blue-600",  bg: "bg-blue-50",   hoverBg: "hover:bg-blue-100"   },
    { href: "/chat",                          icon: MessageCircle, label: "Messages clients",    color: "text-green-600", bg: "bg-green-50",  hoverBg: "hover:bg-green-100"  },
    { href: "/dashboard/seller/profile",      icon: UserCircle,  label: "Mon profil boutique",  color: "text-purple-600",bg: "bg-purple-50", hoverBg: "hover:bg-purple-100" },
  ];

  const TIPS = [
    "Ajoutez plusieurs photos de qualité à vos produits",
    "Répondez rapidement aux messages WhatsApp",
    "Mettez des prix en gros pour attirer les acheteurs B2B",
    "Précisez votre ville pour les acheteurs locaux",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Bonjour{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Tableau de bord vendeur</p>
          </div>
          <Link
            href="/dashboard/seller/products/new"
            className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-red-900/20"
          >
            <Plus className="w-4 h-4" />
            Nouveau produit
          </Link>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          {stats ? STAT_CARDS.map(c => (
            <motion.div key={c.label} variants={cardV}>
              <Link
                href={c.link}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-primary/20 transition-all flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <c.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{c.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
                </div>
              </Link>
            </motion.div>
          )) : Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40" />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h2 className="font-black text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-2">
              {ACTIONS.map(a => (
                <Link
                  key={a.href}
                  href={a.href}
                  className={`flex items-center gap-3 p-3.5 rounded-xl ${a.hoverBg} transition-all group`}
                >
                  <div className={`w-9 h-9 ${a.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <a.icon className={`w-4.5 h-4.5 ${a.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 flex-1">{a.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#0f2849] to-[#1a3f72] rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-accent" />
              <h2 className="font-black">Conseils pour vendre plus</h2>
            </div>
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex gap-2.5 text-sm text-blue-100"
                >
                  <span className="w-5 h-5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                    ✓
                  </span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
