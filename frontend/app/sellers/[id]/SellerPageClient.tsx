"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Star, MapPin, Shield, MessageCircle, Package,
  ChevronRight, BadgeCheck, Phone, Calendar,
  Check, Clock, ShoppingBag, Eye,
  Store, Tag,
} from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import useLangStore from "@/lib/stores/langStore";

interface SellerReview {
  rating: number;
  comment?: string;
  createdAt?: string;
  user: { name: string };
}

interface SellerProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  stock: number;
  views: number;
  minOrderQty?: number;
  category: { nameFr: string; nameAr: string };
  reviews?: SellerReview[];
}

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
    products: SellerProduct[];
  };
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">Rupture</span>;
  if (stock < 5)   return <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">Stock faible</span>;
  return null;
}

function ProductCard({ p, lang }: { p: SellerProduct; lang: string }) {
  const catName   = lang === "ar" ? p.category.nameAr : p.category.nameFr;
  const reviews   = p.reviews ?? [];
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <Link href={`/products/${p.id}`}
      className="bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {p.images[0] ? (
          <img
            src={p.images[0]}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-200" />
          </div>
        )}
        <StockBadge stock={p.stock} />
        {p.minOrderQty && p.minOrderQty > 1 && (
          <span className="absolute top-2 left-2 bg-[#0f2849]/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            Min {p.minOrderQty}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Tag className="w-2.5 h-2.5" />{catName}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {p.title}
        </h3>

        {/* Stars */}
        {(() => {
          const r = reviews.length > 0 ? avgRating : 4.8;
          return (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= Math.round(r) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">
                {r.toFixed(1)}{reviews.length > 0 ? ` (${reviews.length})` : ""}
              </span>
            </div>
          );
        })()}

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <span className="text-base font-black text-primary">{p.price.toFixed(0)}</span>
            <span className="text-xs font-semibold text-primary/70 ml-0.5">MAD</span>
            <p className="text-[10px] text-gray-400 leading-none">/ unité</p>
          </div>
          {p.stock > 0 && (
            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full font-medium">
              Dispo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="container py-6">
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-24 rounded-2xl bg-gray-300 -mt-14" />
          <div className="space-y-2 flex-1 pt-4">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="h-8 bg-gray-200 rounded w-32 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,6,7,8].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

export default function SellerPageClient({ params }: { params: { id: string } }) {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeCategory, setActiveCategory] = useState("tous");
  const { lang } = useLangStore();

  useEffect(() => {
    api.get(`/sellers/${params.id}`)
      .then(r => setSeller(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  const products = seller?.user.products ?? [];

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const cats: { id: string; label: string }[] = [{ id: "tous", label: "Tous" }];
    for (const p of products) {
      const name = lang === "ar" ? p.category.nameAr : p.category.nameFr;
      if (!seen.has(name)) { seen.add(name); cats.push({ id: name, label: name }); }
    }
    return cats;
  }, [products, lang]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "tous") return products;
    return products.filter(p => (lang === "ar" ? p.category.nameAr : p.category.nameFr) === activeCategory);
  }, [products, activeCategory, lang]);

  if (loading) return <Skeleton />;

  if (notFound || !seller) {
    return (
      <div className="container py-20 text-center">
        <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-500 mb-2">Boutique introuvable</p>
        <p className="text-sm text-gray-400 mb-5">Ce fournisseur n&apos;existe pas ou a été supprimé.</p>
        <Link href="/sellers" className="btn btn-primary text-sm">Voir tous les fournisseurs</Link>
      </div>
    );
  }

  const memberYear     = new Date(seller.user.createdAt).getFullYear();
  const totalViews     = products.reduce((s, p) => s + (p.views || 0), 0);
  const satisfaction   = seller.rating > 0 ? Math.round(seller.rating / 5 * 100) : null;
  const isNew          = products.length === 0 && seller.totalSales === 0;
  const whatsappUrl    = seller.whatsapp ? buildWhatsAppUrl(seller.whatsapp, `Bonjour ${seller.businessName}, je souhaite obtenir plus d'informations.`) : null;
  const allReviews     = products.flatMap(p => (p.reviews ?? []).map(r => ({ ...r, productTitle: p.title }))).slice(0, 8);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pb-0">

      {/* ── Banner ── */}
      <div className="relative h-48 md:h-60 w-full overflow-hidden">
        {seller.banner ? (
          <>
            <img src={seller.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
          </>
        ) : (
          <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, #0f2849 0%, #1a3a6b 40%, #0d3d6b 70%, #0f2849 100%)`,
          }}>
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          </div>
        )}

        {/* City + member info on banner */}
        <div className="absolute bottom-4 left-0 right-0 container">
          <div className="flex items-end justify-between">
            <div />
            <div className="flex items-center gap-3 text-white/70 text-xs">
              {seller.city && (
                <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <MapPin className="w-3 h-3" /> {seller.city}
                </span>
              )}
              <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Calendar className="w-3 h-3" /> Membre depuis {memberYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl">

        {/* ── Hero row ── */}
        <div className="flex flex-col sm:flex-row items-start gap-4 -mt-12 mb-5 relative z-10">

          {/* Logo */}
          <div className="w-24 h-24 rounded-2xl bg-[#0f2849] border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-3xl shrink-0 overflow-hidden">
            {seller.logo ? (
              <img src={seller.logo} alt={seller.businessName} className="w-full h-full object-cover" />
            ) : (
              <span>{seller.businessName[0].toUpperCase()}</span>
            )}
          </div>

          {/* Info + CTA card */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mt-2 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              {/* Left: name + badges + quick stats */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">{seller.businessName}</h1>
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                      <BadgeCheck className="w-3.5 h-3.5" /> Fournisseur vérifié
                    </span>
                  )}
                </div>

                {/* Quick info row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-sm text-gray-500">
                  {seller.city && (
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {seller.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                    <strong className="text-gray-700">{products.length}</strong> produit{products.length !== 1 ? "s" : ""}
                  </span>
                  {seller.rating > 0 ? (
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                      <strong className="text-gray-700">{seller.rating.toFixed(1)}</strong>
                      <span className="text-gray-400 text-xs">/ 5</span>
                    </span>
                  ) : isNew ? (
                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-100">
                      Nouveau fournisseur
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span className="text-green-600 font-medium">Répond rapidement</span>
                  </span>
                </div>
              </div>

              {/* Right: CTAs */}
              <div className="flex flex-col gap-2 shrink-0 sm:min-w-[160px]">
                {whatsappUrl ? (
                  <>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-green-200">
                      <MessageCircle className="w-4 h-4" /> Contacter
                    </a>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 border border-green-300 text-green-600 hover:bg-green-50 font-medium px-4 py-2 rounded-xl text-sm transition-colors">
                      <Phone className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 text-center py-2 px-3 border border-dashed rounded-xl">
                    Contact non disponible
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              icon: Package,
              value: products.length > 0 ? products.length.toString() : isNew ? "—" : products.length.toString(),
              label: "Produits disponibles",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Star,
              value: satisfaction ? `${satisfaction}%` : isNew ? "Nouveau" : "—",
              label: "Satisfaction clients",
              color: "text-yellow-600",
              bg: "bg-yellow-50",
            },
            {
              icon: ShoppingBag,
              value: seller.totalSales > 0 ? seller.totalSales.toString() : isNew ? "Nouveau" : "0",
              label: "Commandes traitées",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              icon: Eye,
              value: totalViews > 0 ? (totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString()) : "—",
              label: "Vues boutique",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── About ── */}
        {seller.description && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-500" />
              À propos du fournisseur
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{seller.description}</p>
          </div>
        )}

        {/* ── Products section ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-bold text-gray-900 text-lg">Produits de la boutique</h2>
            <Link href={`/products?seller=${seller.user.id}`}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category tabs */}
          {categories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-1 px-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-[#0f2849] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-14">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="font-medium text-gray-400">Aucun produit dans cette catégorie</p>
              <button onClick={() => setActiveCategory("tous")} className="text-sm text-primary mt-2 hover:underline">
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(p => <ProductCard key={p.id} p={p} lang={lang} />)}
            </div>
          )}
        </div>

        {/* ── Trust section — below products ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0f2849]" />
            Pourquoi acheter chez ce fournisseur ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Fournisseur vérifié", sub: "Identité et activité confirmées", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
              { label: "Vente en gros",        sub: "Prix dégressifs selon quantité",  color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
              { label: "Contact WhatsApp",     sub: "Réponse directe et rapide",        color: "text-green-600",  bg: "bg-green-50 border-green-100" },
              { label: "Livraison au Maroc",   sub: "Partout dans le royaume",          color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
            ].map(item => (
              <div key={item.label} className={`flex items-start gap-3 p-3 rounded-xl border ${item.bg}`}>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Check className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Avis clients
              {allReviews.length > 0 && (
                <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full font-medium">
                  {allReviews.length} avis
                </span>
              )}
            </h2>
            {seller.rating > 0 && (
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(seller.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
                <span className="text-sm font-bold text-gray-700 ml-1">{seller.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {allReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allReviews.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0f2849] text-white text-xs flex items-center justify-center font-bold shrink-0">
                        {r.user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{r.user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{(r as any).productTitle}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-8 h-8 mx-auto mb-2 text-gray-200" />
              <p className="text-sm font-medium text-gray-400">Aucun avis pour le moment</p>
              <p className="text-xs text-gray-400 mt-1">Soyez le premier à commander et laisser un avis</p>
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Contacter le fournisseur
                </a>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ── Mobile sticky CTA ── */}
      {whatsappUrl && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex gap-2 lg:hidden z-40">
          <a href={whatsappUrl} target="_blank" rel="noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200 text-[15px]">
            <MessageCircle className="w-5 h-5" />
            Contacter le fournisseur
          </a>
        </div>
      )}
    </div>
  );
}
