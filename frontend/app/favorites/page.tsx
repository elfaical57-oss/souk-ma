"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import useFavoritesStore from "@/lib/stores/favoritesStore";
import useLangStore from "@/lib/stores/langStore";

export default function FavoritesPage() {
  const items = useFavoritesStore((s) => s.items);
  const { lang } = useLangStore();

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-navy mb-1">
          {lang === "ar" ? "المفضلة" : "Mes favoris"}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {lang === "ar"
            ? "المنتجات التي حفظتها للرجوع إليها لاحقاً."
            : "Les produits que vous avez enregistrés pour plus tard."}
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card py-16 text-center">
            <Heart className="w-10 h-10 mx-auto mb-3 text-slate-300" aria-hidden="true" />
            <p className="text-slate-500 text-sm mb-6">
              {lang === "ar" ? "لا توجد منتجات في المفضلة بعد." : "Aucun produit dans vos favoris pour le moment."}
            </p>
            <Link href="/products" className="btn-primary">
              {lang === "ar" ? "استكشاف المنتجات" : "Explorer les produits"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
