"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star, MapPin, Shield, Package, MessageCircle, ShoppingCart,
  ChevronRight, Minus, Plus, Share2, Check, Truck,
  BadgeCheck, Phone, Tag, Store, Clock, Users, Award,
} from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl, productInquiryMessage, orderMessage } from "@/lib/whatsapp";
import useCartStore from "@/lib/stores/cartStore";
import useLangStore from "@/lib/stores/langStore";
import ProductCard from "@/components/products/ProductCard";

interface SellerProfile {
  businessName: string;
  rating: number;
  verified: boolean;
  whatsapp?: string;
  totalSales?: number;
  logo?: string;
  city?: string;
  description?: string;
}

interface Product {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  minOrderQty: number;
  bulkPrices?: { qty: number; price: number }[];
  stock: number;
  images: string[];
  city?: string;
  tags?: string[];
  views: number;
  seller: { id: string; name: string; sellerProfile?: SellerProfile };
  category: { nameFr: string; nameAr: string; slug: string };
  reviews: { rating: number; comment?: string; user: { name: string } }[];
}

interface RelatedProduct {
  id: string; title: string; price: number; images: string[];
  minOrderQty: number; city?: string;
  seller?: { sellerProfile?: { businessName?: string; rating?: number; verified?: boolean } };
  reviews?: { rating: number }[];
}

function Skeleton() {
  return (
    <div className="container py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square rounded-2xl bg-gray-200 mb-3" />
          <div className="flex gap-2">{[1,2,3].map(i => <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg" />)}</div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5";
  return (
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${cls} ${s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

export default function ProductPageClient({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "delivery" | "seller" | "reviews">("desc");
  const [cartToast, setCartToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const addItem = useCartStore(s => s.addItem);
  const { lang } = useLangStore();

  useEffect(() => {
    api.get(`/products/${params.id}`).then(res => {
      setProduct(res.data);
      setQty(res.data.minOrderQty || 1);
    });
  }, [params.id]);

  useEffect(() => {
    if (!product) return;
    api.get(`/products?category=${product.category.slug}&limit=6`)
      .then(res => {
        const list: RelatedProduct[] = Array.isArray(res.data) ? res.data : (res.data.products ?? []);
        setRelated(list.filter(p => p.id !== product.id).slice(0, 4));
      })
      .catch(() => {});
  }, [product]);

  if (!product) return <Skeleton />;

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0;

  const whatsapp = product.seller.sellerProfile?.whatsapp;
  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const profile = product.seller.sellerProfile;
  const title = lang === "ar" && product.titleAr ? product.titleAr : product.title;
  const catName = lang === "ar" ? product.category.nameAr : product.category.nameFr;

  const stockStatus = product.stock === 0 ? "rupture" : product.stock < 5 ? "faible" : "disponible";
  const total = (product.price * qty).toFixed(2);

  const handleWhatsAppOrder   = () => whatsapp && window.open(buildWhatsAppUrl(whatsapp, orderMessage(product.title, qty, product.city || "Maroc")), "_blank");
  const handleWhatsAppInquiry = () => whatsapp && window.open(buildWhatsAppUrl(whatsapp, productInquiryMessage(product.title, productUrl)), "_blank");
  const handleAddToCart = () => {
    addItem({ id: product.id, title: product.title, price: product.price, image: product.images[0], quantity: qty, sellerWhatsapp: whatsapp, sellerName: profile?.businessName || product.seller.name });
    setCartToast(true);
    setTimeout(() => setCartToast(false), 2500);
  };
  const handleShare = () => navigator.clipboard.writeText(productUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });

  const TABS = [
    { id: "desc",     label: "Description" },
    { id: "delivery", label: "Livraison" },
    { id: "seller",   label: "Fournisseur" },
    { id: "reviews",  label: `Avis (${product.reviews.length})` },
  ] as const;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-0">

      {/* ── Cart toast ── */}
      <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${cartToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="bg-[#0f2849] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" /> <span className="text-sm font-medium">Ajouté au panier</span>
        </div>
      </div>

      <div className="container py-6 max-w-7xl">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/products" className="hover:text-primary transition-colors">Produits</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">{catName}</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-gray-800 font-medium truncate max-w-[180px]">{product.title}</span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">

          {/* ── LEFT: Gallery ── */}
          <div>
            {/* Main image with zoom */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-3 relative group">
              <div className="aspect-[4/3] overflow-hidden cursor-zoom-in">
                <img
                  src={imgError[selectedImage] ? "/images/placeholder.png" : (product.images[selectedImage] || "/images/placeholder.png")}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
                  onError={() => setImgError(e => ({ ...e, [selectedImage]: true }))}
                />
              </div>
              {/* Image counter */}
              {product.images.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {selectedImage + 1} / {product.images.length}
                </span>
              )}
              {/* Share */}
              <button
                onClick={handleShare}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                title="Copier le lien"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
              </button>
              {/* Views */}
              <span className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                {product.views}
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-white ${
                      i === selectedImage ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={() => {}} />
                  </button>
                ))}
              </div>
            )}

            {/* ── Tabs (below gallery on desktop) ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-5 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 min-w-[100px] py-3.5 text-sm font-medium transition-colors whitespace-nowrap px-3 ${
                      tab === t.id ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Description */}
                {tab === "desc" && (
                  <div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">{product.description}</p>
                    {product.descriptionAr && (
                      <p className="text-gray-600 leading-relaxed mt-4 font-arabic text-right border-t pt-4 text-[15px]">{product.descriptionAr}</p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t">
                        <Tag className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                        {product.tags.map(tag => (
                          <Link key={tag} href={`/products?search=${tag}`} className="text-xs bg-gray-50 border border-gray-200 hover:border-primary hover:text-primary px-2.5 py-1 rounded-full text-gray-600 transition-colors">
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Livraison */}
                {tab === "delivery" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                      <Truck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800 text-sm">Livraison partout au Maroc</p>
                        <p className="text-green-700 text-sm mt-0.5">Disponible dans toutes les villes du royaume</p>
                      </div>
                    </div>
                    {[
                      { icon: Clock, label: "Délai standard", value: "3 à 5 jours ouvrés" },
                      { icon: Award, label: "Livraison express", value: "Disponible sur demande" },
                      { icon: Users, label: "Grandes quantités", value: "Tarifs négociables selon volume" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">{item.label}</p>
                          <p className="text-sm font-medium text-gray-800">{item.value}</p>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 pt-2">Contactez le fournisseur via WhatsApp pour confirmer les modalités et les frais exacts.</p>
                  </div>
                )}

                {/* Infos fournisseur */}
                {tab === "seller" && profile && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#0f2849] rounded-2xl flex items-center justify-center text-white font-black text-2xl shrink-0 overflow-hidden">
                        {profile.logo ? <img src={profile.logo} alt={profile.businessName} className="w-full h-full object-cover" /> : profile.businessName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">{profile.businessName}</h3>
                          {profile.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                        </div>
                        {profile.rating > 0 && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <StarRow rating={profile.rating} />
                            <span className="text-sm text-gray-500">{profile.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: MapPin, label: "Localisation", value: product.city || profile.city || "Maroc" },
                        { icon: Shield, label: "Statut", value: profile.verified ? "Vérifié JemlaMaroc" : "Fournisseur actif" },
                        { icon: MessageCircle, label: "Contact", value: whatsapp ? "WhatsApp disponible" : "Par message" },
                        { icon: Clock, label: "Réponse", value: "Généralement rapide" },
                      ].map(item => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <item.icon className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-xs text-gray-400">{item.label}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {profile.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
                    )}
                    <Link href={`/sellers/${product.seller.id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0f2849] text-white font-semibold text-sm hover:bg-[#1a3a6b] transition-colors">
                      <Store className="w-4 h-4" /> Voir la boutique
                    </Link>
                  </div>
                )}

                {/* Avis */}
                {tab === "reviews" && (
                  <div>
                    {product.reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="font-medium text-sm">Aucun avis pour l&apos;instant</p>
                        <p className="text-xs mt-1">Soyez le premier à commander et laisser un avis</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                          <div className="text-center">
                            <p className="text-4xl font-black text-gray-900">{avgRating.toFixed(1)}</p>
                            <StarRow rating={avgRating} />
                            <p className="text-xs text-gray-500 mt-1">{product.reviews.length} avis</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {product.reviews.map((r, i) => (
                            <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-[#0f2849] text-white text-xs flex items-center justify-center font-bold">
                                    {r.user.name[0].toUpperCase()}
                                  </div>
                                  <p className="font-medium text-sm">{r.user.name}</p>
                                </div>
                                <StarRow rating={r.rating} size="xs" />
                              </div>
                              {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Purchase panel ── */}
          <div className="space-y-4 lg:sticky lg:top-20">

            {/* Product info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

              {/* Category + views */}
              <div className="flex items-center justify-between mb-3">
                <Link href={`/products?category=${product.category.slug}`}
                  className="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-primary/15 transition-colors">
                  <Tag className="w-3 h-3" /> {catName}
                </Link>
                {product.city && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" /> {product.city}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">{title}</h1>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-4">
                <StarRow rating={avgRating} />
                <span className="text-sm text-gray-500">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-sm text-gray-500">{product.reviews.length} avis</span>
              </div>

              {/* Price block */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-4 border border-primary/10 mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-primary">{product.price.toFixed(2)}</span>
                  <span className="text-base font-bold text-primary/70">MAD</span>
                  <span className="text-sm text-gray-500">/ unité</span>
                </div>
                {product.minOrderQty > 1 && (
                  <p className="text-sm text-gray-600 font-medium">
                    MOQ : <strong className="text-gray-800">{product.minOrderQty} pièces</strong> minimum
                  </p>
                )}
                <p className="text-xs text-green-600 mt-1.5 font-medium">
                  Prix négociable pour grandes quantités
                </p>
              </div>

              {/* Bulk tiers */}
              {product.bulkPrices && product.bulkPrices.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prix dégressifs</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {product.bulkPrices.map(bp => (
                      <div key={bp.qty} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                        <p className="text-xs text-gray-400">+{bp.qty} pcs</p>
                        <p className="font-bold text-sm text-primary">{bp.price} MAD</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock badge */}
              <div className={`flex items-center gap-2 text-sm mb-4 px-3 py-2 rounded-xl ${
                stockStatus === "rupture" ? "bg-red-50 text-red-600 border border-red-100" :
                stockStatus === "faible"  ? "bg-orange-50 text-orange-600 border border-orange-100" :
                "bg-green-50 text-green-700 border border-green-100"
              }`}>
                <Package className="w-4 h-4 shrink-0" />
                {stockStatus === "rupture" ? "Rupture de stock" :
                 stockStatus === "faible"  ? `Seulement ${product.stock} restant(s)` :
                 `${product.stock} unités en stock`}
              </div>

              {/* Quantity + bulk calculator */}
              {stockStatus !== "rupture" && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quantité</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-14 text-center font-bold text-sm">{qty}</span>
                      <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                      <p className="text-xs text-gray-400 leading-none">Total estimé</p>
                      <p className="text-lg font-black text-gray-900 leading-tight">{total} <span className="text-xs font-semibold text-gray-500">MAD</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    {qty} unité{qty > 1 ? "s" : ""} × {product.price.toFixed(2)} MAD = <strong className="text-gray-700">{total} MAD</strong>
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-2.5">
                {whatsapp ? (
                  <>
                    <button onClick={handleWhatsAppOrder} disabled={stockStatus === "rupture"}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200 text-[15px]">
                      <MessageCircle className="w-5 h-5" /> Commander via WhatsApp
                    </button>
                    <button onClick={handleWhatsAppInquiry}
                      className="w-full border-2 border-green-400 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Phone className="w-4 h-4" /> Contacter le fournisseur
                    </button>
                  </>
                ) : (
                  <div className="text-center text-sm text-gray-400 py-3 border border-dashed rounded-xl">Contact WhatsApp non disponible</div>
                )}
                <button onClick={handleAddToCart} disabled={stockStatus === "rupture"}
                  className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: BadgeCheck, label: "Fournisseur vérifié",  color: "text-blue-500" },
                  { icon: MessageCircle, label: "Contact WhatsApp",  color: "text-green-500" },
                  { icon: Truck, label: "Livraison Maroc",        color: "text-orange-500" },
                  { icon: Shield, label: "Vente en gros",             color: "text-[#0f2849]" },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <b.icon className={`w-4 h-4 ${b.color} shrink-0`} />
                    <span className="text-xs font-medium text-gray-700 leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller card */}
            {profile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fournisseur</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#0f2849] rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 overflow-hidden">
                    {profile.logo ? <img src={profile.logo} alt={profile.businessName} className="w-full h-full object-cover" /> : profile.businessName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-bold text-gray-900 truncate">{profile.businessName}</p>
                      {profile.verified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                    </div>
                    {product.city && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {product.city}
                      </p>
                    )}
                    {profile.rating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarRow rating={profile.rating} size="xs" />
                        <span className="text-xs text-gray-500">{profile.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {profile.verified && (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg mb-3">
                    <BadgeCheck className="w-3.5 h-3.5" /> Fournisseur vérifié JemlaMaroc
                  </div>
                )}
                <Link href={`/sellers/${product.seller.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#0f2849]/20 text-[#0f2849] hover:bg-[#0f2849]/5 font-semibold text-sm transition-colors">
                  <Store className="w-4 h-4" /> Voir la boutique
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Produits similaires</h2>
              <Link href={`/products?category=${product.category.slug}`}
                className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile sticky CTA ── */}
      {whatsapp && stockStatus !== "rupture" && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-2xl p-3 flex gap-2 lg:hidden z-40">
          <button onClick={handleWhatsAppOrder}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[15px]">Commander WhatsApp</span>
          </button>
          <button onClick={handleAddToCart}
            className="w-14 border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
