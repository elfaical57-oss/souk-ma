import { Metadata } from "next";
import HomeContent, { type Seller } from "./HomeContent";
import CityLinks from "@/components/seo/CityLinks";
import CategoryLinks from "@/components/seo/CategoryLinks";
import type { ProductCardData } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Grossiste au Maroc — Achetez en Gros auprès de Fournisseurs Vérifiés",
  description:
    "JemlaMaroc, la marketplace de grossistes marocains vérifiés. Achetez en gros — mode, alimentation, électronique, artisanat — directement auprès de fournisseurs partout au Maroc.",
  alternates: { canonical: "https://jemlamaroc.com" },
  openGraph: {
    title: "Grossiste au Maroc — Achetez en Gros auprès de Fournisseurs Vérifiés | JemlaMaroc",
    description:
      "Marketplace de grossistes marocains vérifiés. Particuliers, revendeurs et professionnels bienvenus — commandez en gros directement via WhatsApp.",
    url: "https://jemlamaroc.com",
    type: "website",
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getAllSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<{ products: ProductCardData[]; total: number }> {
  try {
    const res = await fetch(`${API_URL}/products?limit=4`, { next: { revalidate: 300 } });
    if (!res.ok) return { products: [], total: 0 };
    const data = await res.json();
    return { products: (data.products ?? []) as ProductCardData[], total: data.total ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}

export default async function HomePage() {
  const [allSellers, { products, total: productCount }] = await Promise.all([getAllSellers(), getFeaturedProducts()]);
  return (
    <>
      <HomeContent
        sellers={allSellers}
        products={products}
        sellerCount={allSellers.length}
        productCount={productCount}
      />
      <CategoryLinks />
      <CityLinks />
    </>
  );
}
