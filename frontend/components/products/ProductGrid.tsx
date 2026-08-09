"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import api from "@/lib/api";
import useLangStore from "@/lib/stores/langStore";

const PAGE_SIZE = 20;

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  minOrderQty: number;
  city?: string;
  seller?: { sellerProfile?: { businessName?: string; rating?: number } };
  reviews?: { rating: number }[];
}

interface ProductGridProps {
  query?: Record<string, string>;
  initialProducts?: Product[];
  initialTotal?: number;
}

export default function ProductGrid({ query = {}, initialProducts, initialTotal }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(initialProducts ? PAGE_SIZE < (initialTotal ?? 0) : false);
  const [loading, setLoading]   = useState(!initialProducts);
  const [loadingMore, setLoadingMore] = useState(false);
  const { t } = useLangStore();
  const queryKey = JSON.stringify(query);
  const abortRef = useRef<AbortController | null>(null);
  const skippedFirstFetch = useRef(false);

  const fetchProducts = useCallback(async (pageNum: number, replace: boolean) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    replace ? setLoading(true) : setLoadingMore(true);
    try {
      const params = new URLSearchParams({ ...query, page: String(pageNum), limit: String(PAGE_SIZE) });
      const res = await api.get(`/products?${params}`, { signal: ctrl.signal });
      const { products: data, total } = res.data;
      setProducts(prev => replace ? data : [...prev, ...data]);
      setHasMore((pageNum * PAGE_SIZE) < total);
      setPage(pageNum);
    } catch (err: any) {
      if (err?.code !== "ERR_CANCELED") console.error(err);
    } finally {
      replace ? setLoading(false) : setLoadingMore(false);
    }
  }, [queryKey]);

  useEffect(() => {
    if (!skippedFirstFetch.current && initialProducts) {
      skippedFirstFetch.current = true;
      return;
    }
    fetchProducts(1, true);
    return () => abortRef.current?.abort();
  }, [queryKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">{t.products.no_products}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchProducts(page + 1, false)}
            disabled={loadingMore}
            className="px-8 py-3 bg-white border border-border rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loadingMore ? (
              <><span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Chargement...</>
            ) : (
              "Charger plus de produits"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
