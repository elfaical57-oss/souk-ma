"use client";

import { useEffect, useState } from "react";
import { BarChart3, MessageCircle, BadgeCheck, MapPin } from "lucide-react";
import api from "@/lib/api";

interface SellerClicks {
  sellerId: string;
  clicks: number;
  name: string;
  city?: string;
  verified: boolean;
  phone?: string;
}

interface AnalyticsResponse {
  period: string;
  total: number;
  sellers: SellerClicks[];
}

const PERIODS = [
  { value: "day",   label: "Aujourd'hui" },
  { value: "week",  label: "7 derniers jours" },
  { value: "month", label: "30 derniers jours" },
  { value: "all",   label: "Tout" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("week");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/analytics/whatsapp-clicks", { params: { period } })
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const maxClicks = data?.sellers[0]?.clicks || 1;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistiques WhatsApp</h1>
          <p className="text-gray-400 text-sm mt-1">
            Clics sur le bouton WhatsApp / numéro, par vendeur
          </p>
        </div>
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                period === p.value
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Total card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6 w-fit">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{loading ? "—" : (data?.total ?? 0).toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Clics WhatsApp au total</p>
          </div>
        </div>
      </div>

      {/* Per-seller table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
          <BarChart3 className="w-4 h-4 text-green-400" />
          <h2 className="text-white font-semibold text-sm">Classement par vendeur</h2>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                  <div className="h-2.5 bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.sellers.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {data.sellers.map((s, i) => (
              <div key={s.sellerId} className="flex items-center gap-4 px-5 py-3">
                <span className="text-gray-500 text-sm font-mono w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate flex items-center gap-1">
                    {s.name}
                    {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </p>
                  {s.city && (
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {s.city}
                    </p>
                  )}
                </div>
                <div className="hidden sm:block w-40 shrink-0">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.max(4, (s.clicks / maxClicks) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-white font-bold text-sm tabular-nums w-10 text-right shrink-0">
                  {s.clicks}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-gray-400 text-sm">
            Aucun clic WhatsApp enregistré pour cette période.
          </div>
        )}
      </div>
    </div>
  );
}
