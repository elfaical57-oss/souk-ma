import { Metadata } from "next";
import HomeContent, { type Seller } from "./HomeContent";

export const revalidate = 300; // revalidate every 5 minutes

export const metadata: Metadata = {
  title: "JemlaMaroc — Achat en Gros au Maroc | 500+ Fournisseurs Vérifiés",
  description:
    "Trouvez les meilleurs fournisseurs et prix de gros au Maroc. Pour particuliers, revendeurs et professionnels — mode, alimentation, électronique, artisanat. Commandez directement via WhatsApp, livraison partout au Maroc.",
  alternates: { canonical: "https://jemlamaroc.com" },
  openGraph: {
    title: "JemlaMaroc — Achat en Gros au Maroc | 500+ Fournisseurs Vérifiés",
    description:
      "500+ fournisseurs marocains vérifiés dans 40+ villes. Particuliers, revendeurs et professionnels bienvenus — commandez en gros directement via WhatsApp.",
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
