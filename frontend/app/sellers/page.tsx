"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Star, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import useLangStore from "@/lib/stores/langStore";

interface Seller {
  id: string;
  businessName: string;
  description?: string;
  city: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  whatsapp?: string;
  logo?: string;
  user: { id: string; name: string };
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLangStore();

  useEffect(() => {
    api.get("/sellers").then((r) => setSellers(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">{t.sellers.title}</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <p className="text-center text-gray-500 py-16">{t.sellers.no_sellers}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((s) => (
            <div key={s.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
                  {s.logo
                    ? <img src={s.logo} alt={s.businessName} className="w-full h-full object-cover" />
                    : s.businessName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold">{s.businessName}</h3>
                    {s.verified && <Shield className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-500">{s.city}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{s.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {s.description && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{s.description}</p>}

              <div className="flex gap-2">
                <Link href={`/sellers/${s.user.id}`} className="flex-1 text-center text-sm border border-border py-2 rounded-lg hover:border-primary hover:text-primary transition-colors">
                  {t.sellers.view_shop}
                </Link>
                {s.whatsapp && (
                  <a
                    href={buildWhatsAppUrl(s.whatsapp, `مرحبا ${s.businessName}،\nBonjour ${s.businessName},`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
