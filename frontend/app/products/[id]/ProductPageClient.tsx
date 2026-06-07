"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star, MapPin, Shield, Package, MessageCircle,
  ShoppingCart, ChevronRight, Minus, Plus, Share2, Check,
  TruckIcon, BadgeCheck, Phone,
} from "lucide-react";
import api from "@/lib/api";
import { buildWhatsAppUrl, productInquiryMessage, orderMessage } from "@/lib/whatsapp";
import useCartStore from "@/lib/stores/cartStore";
import useLangStore from "@/lib/stores/langStore";

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
  seller: {
    id: string;
    name: string;
    sellerProfile?: {
      businessName: string;
      rating: number;
      verified: boolean;
      whatsapp?: string;
      totalSales?: number;
    };
  };
  category: { nameFr: string; nameAr: string; slug: string };
  reviews: { rating: number; comment?: string; user: { name: string } }[];
}

function Skeleton() {
  return (
    <div className="container py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square rounded-2xl bg-gray-200 mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg" />)}
          </div>
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

export default function ProductPageClient({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "reviews">("desc");
  const [cartToast, setCartToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);
  const { lang } = useLangStore();

  useEffect(() => {
    api.get(`/products/${params.id}`).then((res) => {
      setProduct(res.data);
      setQty(res.data.minOrderQty || 1);
    });
  }, [params.id]);

  if (!product) return <Skeleton />;

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const whatsapp = product.seller.sellerProfile?.whatsapp;
  const productUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleWhatsAppOrder = () => {
    if (!whatsapp) return;
    window.open(buildWhatsAppUrl(whatsapp, orderMessage(product.title, qty, product.city || "Maroc")), "_blank");
  };

  const handleWhatsAppInquiry = () => {
    if (!whatsapp) return;
    window.open(buildWhatsAppUrl(whatsapp, productInquiryMessage(product.title, productUrl)), "_blank");
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: qty,
      sellerWhatsapp: whatsapp,
      sellerName: product.seller.sellerProfile?.businessName || product.seller.name,
    });
    setCartToast(true);
    setTimeout(() => setCartToast(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const stockStatus =
    product.stock === 0 ? "rupture" :
    product.stock < 5 ? "faible" : "disponible";

  const title = lang === "ar" && product.titleAr ? product.titleAr : product.title;
  const catName = lang === "ar" ? product.category.nameAr : product.category.nameFr;

  return (
    <div className="bg-muted min-h-screen">
      {/* Cart toast */}
      <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${cartToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="bg-secondary text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Ajouté au panier</span>
        </div>
      </div>

      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary transition-colors">Produits</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">{catName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Left: images + description */}
          <div>
            {/* Main image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-3 aspect-[4/3]">
              <img
                src={imgError[selectedImage] ? "/images/placeholder.png" : (product.images[selectedImage] || "/images/placeholder.png")}
                alt={title}
                className="w-full h-full object-contain"
                onError={() => setImgError((e) => ({ ...e, [selectedImage]: true }))}
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      i === selectedImage ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-gray-300"
                    } bg-white`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={() => {}} />
                  </button>
                ))}
              </div>
            )}

            {/* Tabs: Description / Reviews */}
            <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setTab("desc")}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors ${tab === "desc" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-gray-500 hover:text-gray-800"}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setTab("reviews")}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors ${tab === "reviews" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-gray-500 hover:text-gray-800"}`}
                >
                  Avis ({product.reviews.length})
                </button>
              </div>

              <div className="p-6">
                {tab === "desc" ? (
                  <div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                    {product.descriptionAr && (
                      <p className="text-gray-600 leading-relaxed mt-4 font-arabic text-right border-t pt-4">{product.descriptionAr}</p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        {product.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-2.5 py-1 rounded-full text-gray-600 border">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {product.reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Aucun avis pour l&apos;instant</p>
                      </div>
                    ) : (
                      <>
                        {/* Rating summary */}
                        <div className="flex items-center gap-4 mb-6 p-4 bg-muted rounded-xl">
                          <div className="text-center">
                            <p className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                            <div className="flex justify-center mt-1">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{product.reviews.length} avis</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {product.reviews.map((r, i) => (
                            <div key={i} className="p-4 rounded-xl bg-muted">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                                    {r.user.name[0].toUpperCase()}
                                  </div>
                                  <p className="font-medium text-sm">{r.user.name}</p>
                                </div>
                                <div className="flex">
                                  {[1,2,3,4,5].map((s) => (
                                    <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                                  ))}
                                </div>
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

          {/* Right: sticky purchase panel */}
          <div className="space-y-4 lg:sticky lg:top-20">
            {/* Product info card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h1 className="text-xl font-bold text-gray-900 leading-snug">{title}</h1>
                <button onClick={handleShare} className="p-2 rounded-lg hover:bg-muted text-gray-400 hover:text-gray-700 transition-colors shrink-0" title="Copier le lien">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Stars + meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                  <span className="text-gray-500 ml-1">{avgRating.toFixed(1)} ({product.reviews.length})</span>
                </div>
                {product.city && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" /> {product.city}
                  </span>
                )}
                <span className="text-gray-400 text-xs">{product.views} vues</span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 mb-4 border border-primary/10">
                <p className="text-3xl font-bold text-primary">{product.price.toFixed(2)} <span className="text-lg">MAD</span></p>
                {product.minOrderQty > 1 && (
                  <p className="text-xs text-gray-500 mt-1">Minimum: {product.minOrderQty} pièces</p>
                )}
              </div>

              {/* Bulk prices */}
              {product.bulkPrices && product.bulkPrices.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prix de gros</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {product.bulkPrices.map((bp) => (
                      <div key={bp.qty} className="bg-muted rounded-lg p-2 text-center border border-border">
                        <p className="text-xs text-gray-500">+{bp.qty} pcs</p>
                        <p className="font-bold text-sm text-secondary">{bp.price} MAD</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className={`flex items-center gap-2 text-sm mb-4 px-3 py-2 rounded-lg ${
                stockStatus === "rupture" ? "bg-red-50 text-red-600" :
                stockStatus === "faible" ? "bg-orange-50 text-orange-600" :
                "bg-green-50 text-green-700"
              }`}>
                <Package className="w-4 h-4 flex-shrink-0" />
                {stockStatus === "rupture" ? "Rupture de stock" :
                 stockStatus === "faible" ? `Seulement ${product.stock} restant(s)` :
                 `${product.stock} en stock`}
              </div>

              {/* Quantity */}
              {stockStatus !== "rupture" && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantité</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors text-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-sm">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Total: <span className="font-bold text-gray-800">{(product.price * qty).toFixed(2)} MAD</span>
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2">
                {whatsapp ? (
                  <>
                    <button
                      onClick={handleWhatsAppOrder}
                      disabled={stockStatus === "rupture"}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-green-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Commander via WhatsApp
                    </button>
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Demander un renseignement
                    </button>
                  </>
                ) : (
                  <div className="text-center text-sm text-gray-400 py-2">Vendeur non joignable via WhatsApp</div>
                )}
                <button
                  onClick={handleAddToCart}
                  disabled={stockStatus === "rupture"}
                  className="w-full border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au panier
                </button>
              </div>
            </div>

            {/* Seller card */}
            {product.seller.sellerProfile && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Vendeur</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {product.seller.sellerProfile.businessName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900">{product.seller.sellerProfile.businessName}</p>
                      {product.seller.sellerProfile.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    {product.seller.sellerProfile.rating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600">{product.seller.sellerProfile.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link href={`/sellers/${product.seller.id}`} className="block text-center text-sm text-primary hover:underline font-medium">
                  Voir la boutique
                </Link>
              </div>
            )}

            {/* Guarantees */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Vendeur vérifié JemlaMaroc</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <TruckIcon className="w-4 h-4 text-green-500 shrink-0" />
                <span>Livraison partout au Maroc</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span>Contact direct via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
