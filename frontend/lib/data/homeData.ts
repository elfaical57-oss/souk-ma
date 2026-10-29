import type { Seller, ProductCardData } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAllSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<{ products: ProductCardData[]; total: number }> {
  try {
    const res = await fetch(`${API_URL}/products?limit=4`, { next: { revalidate: 300 } });
    if (!res.ok) return { products: [], total: 0 };
    const data = await res.json();
    return { products: (data.products ?? []) as ProductCardData[], total: data.total ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}
