"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star, MapPin, Shield, MessageCircle, Package,
  ChevronRight, BadgeCheck, Phone, Calendar,
} from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import useLangStore from "@/lib/stores/langStore";

interface SellerProfile {
  id: string;
  businessName: string;
  description?: string;
  city: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  whatsapp?: string;
  logo?: string;
  banner?: string;
  user: {
    id: string;
    name: string;
    email: string;
    city?: string;
    createdAt: string;
    products: {
      id: string;
      title: string;
      price: number;
      images: string[];
      stock: number;
      views: number;
      category: { nameFr: string; nameAr: string };
    }[];
  };
}

function ProductMiniCard({ p, lang }: { p: SellerProfile["user"]["products"][0]; lang: string }) {
  return (
    <Link href={`/products/${p.id}`} className="card hover:shadow-md transition-all group overflow-hidden">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {p.images[0] ? (
          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
        <p className="text-sm font-bold text-primary mt-1">{p.price.toFixed(2)} MAD</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {lang === "ar" ? p.category.nameAr : p.category.nameFr}
        </p>
      </div>
    </Link>
  );
}

export default function SellerStorePage({ params }: { params: { id: string } }) {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { lang } = useLangStore();

  useEffect(() => {
    api.get(`/sellers/${params.id}`)
      .then((r) => setSeller(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-40 bg-gray-200" />
        <div className="container py-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-300 -mt-10" />
            <div className="space-y-2 pt-2">
              <div className="h-5 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !seller) {
    return (
      <div className="container py-20 text-center">
        <p className="text-xl text-gray-500 mb-4">Boutique introuvable</p>
        <Link href="/sellers" className="text-primary hover:underline">Voir tous les vendeurs</Link>
      </div>
    );
  }

  const memberSince = new Date(seller.user.createdAt).getFullYear();
  const products = seller.user.products;

  return (
    <div className="bg-muted min-h-screen pb-12">
      {/* Banner */}
      <div
        className="h-44 w-full relative"
        style={{
          background: seller.banner
            ? `url(${seller.banner}) center/cover`
            : "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container">
        {/* Profile row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 mb-6 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-secondary border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-3xl shrink-0 overflow-hidden">
            {seller.logo ? (
              <img src={seller.logo} alt={seller.businessName} className="w-full h-full object-cover" />
            ) : (
              seller.businessName[0]
            )}
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{seller.businessName}</h1>
                  {seller.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                  {seller.city && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{seller.city}</span>
                  )}
                  {seller.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      {seller.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Membre depuis {memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> {products.length} produit(s)
                  </span>
                </div>
              </div>

              {/* WhatsApp CTA */}
              {seller.whatsapp && (
                <div className="flex gap-2 shrink-0">
                  <a
                    href={buildWhatsAppUrl(seller.whatsapp, `Bonjour ${seller.businessName}, j'ai une question.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Contacter
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Produits", value: products.length },
            { label: "Note", value: seller.rating > 0 ? seller.rating.toFixed(1) + " / 5" : "—" },
            { label: "Ventes", value: seller.totalSales || 0 },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {seller.description && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-2">À propos</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{seller.description}</p>
          </div>
        )}

        {/* Products */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Produits de la boutique</h2>
            <Link
              href={`/products?seller=${seller.user.id}`}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun produit pour l&apos;instant</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((p) => (
                <ProductMiniCard key={p.id} p={p} lang={lang} />
              ))}
            </div>
          )}
        </div>

        {/* Guarantees */}
        {seller.verified && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-blue-700">
            <Shield className="w-5 h-5 shrink-0" />
            Ce vendeur est vérifié par JemlaMaroc. Vous pouvez acheter en toute confiance.
          </div>
        )}
      </div>
    </div>
  );
}
