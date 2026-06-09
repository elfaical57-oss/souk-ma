import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";

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
  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;
  const reviewCount  = product.reviews?.length ?? 0;
  const businessName = product.seller?.sellerProfile?.businessName;
  const verified     = product.seller?.sellerProfile?.verified;

  return (
    <Link href={`/products/${product.id}`}
      className="bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.images[0] || "/images/placeholder.png"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Min order badge */}
        {product.minOrderQty > 1 && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            Min {product.minOrderQty}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {/* Seller */}
        {businessName && (
          <div className="flex items-center gap-1">
            <p className="text-[10px] text-gray-400 truncate">{businessName}</p>
            {verified && <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {reviewCount > 0 ? (
            <>
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{avgRating.toFixed(1)} ({reviewCount})</span>
            </>
          ) : (
            <span className="text-[10px] text-gray-400">Nouveau</span>
          )}
        </div>

        {/* Price + city */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <p className="font-black text-primary text-base leading-none">{product.price.toFixed(0)} <span className="text-xs font-semibold">MAD</span></p>
          </div>
          {product.city && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <MapPin className="w-2.5 h-2.5" />{product.city}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
