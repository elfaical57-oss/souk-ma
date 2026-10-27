import { Metadata } from "next";
import HomeContent, { type Seller } from "./HomeContent";
import HomeSeoText from "@/components/home/HomeSeoText";
import FaqSection from "@/components/seo/FaqSection";
import CityLinks from "@/components/seo/CityLinks";
import CategoryLinks from "@/components/seo/CategoryLinks";
import { HOME_FAQ } from "@/lib/seo-content";
import type { ProductCardData } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  // The root layout's title template never reaches this page: layout.tsx
  // and the root page.tsx sit at the same route segment, and Next only
  // applies a template to descendant segments, not the segment that
  // declares it. Every other route gets " | JemlaMaroc" automatically;
  // this one has to spell it out.
  title: "Grossiste en ligne Maroc - Fournisseurs directs | JemlaMaroc",
  description:
    "JemlaMaroc, la marketplace de vente en gros au Maroc. Achetez en gros - mode, alimentation, électronique, artisanat - directement auprès de fournisseurs partout au Maroc, sans intermédiaire.",
  alternates: { canonical: "https://jemlamaroc.com" },
  openGraph: {
    title: "Grossiste en ligne Maroc - Fournisseurs directs | JemlaMaroc",
    description:
      "Marketplace de vente en gros au Maroc. Revendeurs, commerçants et professionnels bienvenus - commandez en gros directement via WhatsApp.",
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
  const [allSellers, { products }] = await Promise.all([getAllSellers(), getFeaturedProducts()]);
  return (
    <>
      <HomeContent
        sellers={allSellers}
        products={products}
      />
      <HomeSeoText />
      <div className="container max-w-3xl pb-10">
        <FaqSection faqs={HOME_FAQ} />
      </div>
      <CategoryLinks />
      <CityLinks />
    </>
  );
}
