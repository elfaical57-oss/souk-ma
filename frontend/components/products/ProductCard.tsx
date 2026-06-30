"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, BadgeCheck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  minOrderQty: number;
  city?: string;
  seller?: { sellerProfile?: { businessName?: string; rating?: number; verified?: boolean } };
  reviews?: { rating: number }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const avgRating   = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;
  const reviewCount  = product.reviews?.length ?? 0;
  const businessName = product.seller?.sellerProfile?.businessName;
  const verified     = product.seller?.sellerProfile?.verified;
  const displayRating = reviewCount > 0 ? avgRating : 4.8;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/products/${product.id}`}
        className="bg-white rounded-2xl border border-gray-100 hover:border-primary/25 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 overflow-hidden group flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 shrink-0">
          <Image
            src={product.images[0] || "/images/placeholder.png"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Min order badge */}
          {product.minOrderQty > 1 && (
            <span className="absolute top-2 left-2 bg-[#0f2849]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <ShoppingBag className="w-2.5 h-2.5" />
              Min {product.minOrderQty}
            </span>
          )}

          {/* Verified badge */}
          {verified && (
            <span className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
              <BadgeCheck className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1.5 flex-1">
          {/* Seller */}
          {businessName && (
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-gray-400 truncate font-medium">{businessName}</p>
              {verified && <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />}
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug flex-1">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= Math.round(displayRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {displayRating.toFixed(1)}{reviewCount > 0 ? ` (${reviewCount})` : ""}
            </span>
          </div>

          {/* Price + city */}
          <div className="flex items-end justify-between mt-auto pt-1.5 border-t border-gray-50">
            <div>
              <p className="font-black text-primary text-base leading-none">
                {product.price.toFixed(0)}{" "}
                <span className="text-[11px] font-bold text-gray-400">MAD</span>
              </p>
            </div>
            {product.city && (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                <MapPin className="w-2.5 h-2.5" />
                {product.city}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
