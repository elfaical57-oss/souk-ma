import { Metadata } from "next";
import HomeContent, { type Seller } from "./HomeContent";

export const revalidate = 300; // revalidate every 5 minutes

export const metadata: Metadata = {
  title: "JemlaMaroc — Marketplace B2B Grossiste au Maroc",
  description:
    "JemlaMaroc est la marketplace B2B N°1 au Maroc. Achetez en gros directement auprès de 500+ fournisseurs vérifiés dans 40+ villes. Textile, alimentaire, cosmétique et plus.",
  alternates: { canonical: "https://jemlamaroc.com" },
  openGraph: {
    title: "JemlaMaroc — Marketplace B2B Grossiste au Maroc",
    description:
      "500+ grossistes vérifiés. Commandez en gros directement via WhatsApp. Livraison partout au Maroc.",
    url: "https://jemlamaroc.com",
    type: "website",
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getTopSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).slice(0, 8);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sellers = await getTopSellers();
  return <HomeContent sellers={sellers} />;
}
