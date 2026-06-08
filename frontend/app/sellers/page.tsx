"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, MapPin, MessageCircle, Search, Store, ArrowRight, Users } from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Seller {
  id: string;
  businessName: string;
  slug?: string;
  description?: string;
  city?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  whatsapp?: string;
  logo?: string;
  banner?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}

const PALETTE = ["bg-blue-500","bg-orange-500","bg-green-500","bg-purple-500","bg-red-500","bg-teal-500","bg-pink-500","bg-indigo-500"];

function SellerCard({ s }: { s: Seller }) {
  const slug     = s.slug || s.user.id;
  const initials = s.businessName.slice(0, 2).toUpperCase();
  const color    = PALETTE[s.businessName.charCodeAt(0) % PALETTE.length];
  const products = s._count?.products ?? 0;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col">

      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-[#1a3f72] to-[#2d6ab4] relative overflow-hidden shrink-0">
        {s.banner && (
          <img src={s.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Card body */}
      <div className="px-4 pb-4 -mt-5 relative flex flex-col flex-1">
        {/* Logo */}
        <div className="mb-3">
          {s.logo ? (
            <img
              src={s.logo}
              alt={s.businessName}
              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md`}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start gap-1 flex-wrap mb-0.5">
            <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-primary transition-colors">
              {s.businessName}
            </h3>
            {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 flex-wrap">
            {s.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{s.city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Store className="w-3 h-3" />{products} produit{products !== 1 ? "s" : ""}
            </span>
          </div>

          {s.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{s.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
          <Link
            href={`/sellers/${slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-200 hover:border-primary hover:text-primary py-2 rounded-xl transition-colors group/btn"
          >
            Voir boutique
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          {s.whatsapp && (
            <a
              href={buildWhatsAppUrl(s.whatsapp, `Bonjour ${s.businessName}, je vous contacte depuis JemlaMaroc.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellersPage() {
  const [sellers, setSellers]   = useState<Seller[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    api.get("/sellers").then(r => setSellers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = sellers.filter(s =>
    s.businessName.toLowerCase().includes(search.toLowerCase()) ||
    (s.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Page header */}
      <div className="bg-gradient-to-br from-[#0a1e3d] via-[#0f2849] to-[#1a3f72]">
        <div className="container py-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-accent/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <span className="text-accent text-xs font-bold uppercase tracking-wider">Annuaire des fournisseurs</span>
            </div>
            <h1 className="text-white font-black text-2xl sm:text-3xl mb-2">
              Nos Fournisseurs Vérifiés
            </h1>
            <p className="text-blue-200 text-sm mb-6">
              Découvrez nos grossistes et fournisseurs certifiés partout au Maroc
            </p>

            {/* Search */}
            <div className="flex items-center bg-white rounded-xl overflow-hidden h-11 shadow-lg max-w-md">
              <Search className="w-4 h-4 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Chercher un fournisseur, une ville..."
                className="flex-1 px-3 text-sm text-gray-800 outline-none h-full"
              />
              {search && (
                <button onClick={() => setSearch("")} className="px-3 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">

        {/* Stats bar */}
        {!loading && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <span className="font-bold text-gray-800">{filtered.length}</span>
            fournisseur{filtered.length !== 1 ? "s" : ""}
            {search && <span> trouvé{filtered.length !== 1 ? "s" : ""} pour «&nbsp;<span className="text-primary font-medium">{search}</span>&nbsp;»</span>}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-20 bg-gray-200" />
                <div className="px-4 pb-4 -mt-5">
                  <div className="w-11 h-11 rounded-xl bg-gray-300 border-2 border-white mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Store className="w-14 h-14 mx-auto mb-4 text-gray-200" />
            <h3 className="font-bold text-gray-700 mb-1">Aucun fournisseur trouvé</h3>
            <p className="text-gray-400 text-sm">
              {search ? `Aucun résultat pour "${search}"` : "Aucun fournisseur disponible pour le moment"}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-4 text-sm text-primary hover:underline font-medium">
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(s => <SellerCard key={s.id} s={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
