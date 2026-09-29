"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, MapPin, BadgeCheck, Heart, ArrowRight } from "lucide-react";
import type { ProductCardData } from "@/lib/types";
import { discountPercent, formatMAD, startingPrice } from "@/lib/format";
import useFavoritesStore from "@/lib/stores/favoritesStore";
import useLangStore from "@/lib/stores/langStore";
import { cn } from "@/lib/cn";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { lang } = useLangStore();
  const toggle = useFavoritesStore((s) => s.toggle);
  const has = useFavoritesStore((s) => s.has);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : product.seller?.sellerProfile?.rating || 0;
  const reviewCount = product.reviews?.length ?? 0;
  const businessName = product.seller?.sellerProfile?.businessName;
  const verified = product.seller?.sellerProfile?.verified;
  const fromPrice = startingPrice(product.price, product.bulkPrices);
  const discount = discountPercent(product.price, fromPrice);
  const favored = mounted && has(product.id);

  return (
    <article className="group relative bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-0.5">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              loading="lazy"
              quality={65}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
          )}
          {discount && discount > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-3.5 flex flex-col gap-1.5 flex-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-navy transition-colors leading-snug min-h-[2.5rem]">
            {product.title}
          </h3>

          {avgRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn("w-3 h-3", i <= Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200")}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                {avgRating.toFixed(1)}{reviewCount > 0 ? ` (${reviewCount})` : ""}
              </span>
            </div>
          )}

          <div className="mt-1">
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === "ar" ? "ابتداءً من" : "À partir de"}
            </p>
            <p className="font-extrabold text-navy text-lg leading-tight tabular-nums">
              {formatMAD(fromPrice)}
            </p>
          </div>

          <p className="text-[11px] text-slate-500">
            MOQ: {product.minOrderQty} {lang === "ar" ? "قطعة" : "pièce"}{product.minOrderQty > 1 ? "s" : ""}
          </p>

          {businessName && (
            <p className="flex items-center gap-1 text-[12px] text-slate-600 font-medium truncate">
              <span className="truncate">{businessName}</span>
              {verified && <BadgeCheck className="w-3.5 h-3.5 text-success shrink-0" aria-label="Vérifié" />}
            </p>
          )}

          {product.city && (
            <p className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {product.city}
            </p>
          )}

          <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-navy group-hover:text-primary transition-colors">
            {lang === "ar" ? "عرض المنتج" : "Voir le produit"}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle({
            id: product.id,
            title: product.title,
            price: product.price,
            images: product.images,
            minOrderQty: product.minOrderQty,
            city: product.city,
            bulkPrices: product.bulkPrices,
            seller: product.seller,
          });
        }}
        aria-pressed={favored}
        aria-label={favored ? (lang === "ar" ? "إزالة من المفضلة" : "Retirer des favoris") : (lang === "ar" ? "إضافة للمفضلة" : "Ajouter aux favoris")}
        className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <Heart
          className={cn("w-4 h-4 transition-colors", favored ? "text-primary fill-primary" : "text-slate-500")}
          aria-hidden="true"
        />
      </button>
    </article>
  );
}
