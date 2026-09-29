"use client";

import { useState, useEffect } from "react";
import { Store } from "lucide-react";
import api from "@/lib/api";
import type { Seller } from "@/lib/types";
import SupplierCard from "@/components/suppliers/SupplierCard";

export default function SellersGridClient() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/sellers").then((r) => setSellers(r.data.slice(0, 8))).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-4 animate-pulse h-48" />
        ))}
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <Store className="w-10 h-10 mx-auto mb-2 text-slate-200" aria-hidden="true" />
        <p className="text-sm">Aucun vendeur pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {sellers.map((s) => <SupplierCard key={s.id} seller={s} />)}
    </div>
  );
}
