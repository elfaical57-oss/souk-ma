"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BadgeCheck, MapPin, Star, Store } from "lucide-react";
import api from "@/lib/api";

interface Seller {
  id: string;
  businessName: string;
  city: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  logo?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}

function SellerCard({ s }: { s: Seller }) {
  const initials = s.businessName.slice(0, 2).toUpperCase();
  const colors = ["bg-blue-500","bg-orange-500","bg-green-500","bg-purple-500","bg-red-500","bg-teal-500","bg-pink-500","bg-indigo-500"];
  const color = colors[s.businessName.charCodeAt(0) % colors.length];
  return (
    <Link
      href={`/sellers/${s.user.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="flex items-center gap-3">
        {s.logo ? (
          <img src={s.logo} alt={s.businessName} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
        ) : (
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0`}>
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">{s.businessName}</p>
            {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
          </div>
          {s.city && (
            <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-3 h-3" />{s.city}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-center">
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="font-bold text-gray-800 text-sm">{s._count?.products ?? 0}</p>
          <p className="text-[10px] text-gray-400">Produits</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="font-bold text-gray-800 text-sm">{s.totalSales}</p>
          <p className="text-[10px] text-gray-400">Ventes</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="font-bold text-gray-800 text-sm flex items-center justify-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {s.rating > 0 ? s.rating.toFixed(1) : "—"}
          </p>
          <p className="text-[10px] text-gray-400">Note</p>
        </div>
      </div>

      <span className="text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg py-1.5 group-hover:bg-primary group-hover:text-white transition-colors">
        Voir la boutique →
      </span>
    </Link>
  );
}

export default function SellersGridClient() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/sellers").then((r) => setSellers(r.data.slice(0, 8))).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse h-44" />
        ))}
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Store className="w-10 h-10 mx-auto mb-2 text-gray-200" />
        <p className="text-sm">Aucun vendeur pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {sellers.map((s) => <SellerCard key={s.id} s={s} />)}
    </div>
  );
}
