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
  const [stats, setStats]         = useState<Stats | null>(null);
  const [sellerStatus, setSellerStatus] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get("/sellers/dashboard/stats").then(r => setStats(r.data)).catch(console.error);
    if (user?.id) {
      api.get(`/sellers/${user.id}`).then(r => setSellerStatus(r.data?.status ?? "pending")).catch(() => {});
    }
  }, [user?.id]);

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
    "Mettez des prix en gros pour attirer particuliers et revendeurs",
    "Précisez votre ville pour les acheteurs locaux",
  ];

  if (sellerStatus === "pending") {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200 shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Compte en attente de vérification</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Votre boutique est en cours de vérification par notre équipe. Vous serez contacté via WhatsApp dès que votre compte sera approuvé.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-800 text-sm font-semibold">⏱ Délai moyen : 24–48h</p>
            <p className="text-amber-700 text-xs mt-1">Notre équipe vérifie chaque vendeur manuellement pour garantir la qualité.</p>
          </div>
          <a
            href="https://wa.me/212634320058?text=Bonjour%2C+j%27ai+cr%C3%A9%C3%A9+un+compte+vendeur+sur+JemlaMaroc+et+j%27attends+la+v%C3%A9rification."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contacter le support
          </a>
        </div>
      </div>
    );
  }

  if (sellerStatus === "rejected") {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Demande refusée</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Votre demande d&apos;inscription en tant que vendeur n&apos;a pas été approuvée. Contactez notre équipe pour plus d&apos;informations.
          </p>
          <a
            href="https://wa.me/212634320058"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Contacter le support WhatsApp
          </a>
        </div>
      </div>
    );
  }

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
