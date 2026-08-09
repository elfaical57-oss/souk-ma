import { Metadata } from "next";
import HomeContent, { type Seller } from "./HomeContent";

export const revalidate = 300; // revalidate every 5 minutes

export const metadata: Metadata = {
  title: "JemlaMaroc — Grossiste au Maroc | Achat en Gros, Fournisseurs Vérifiés",
  description:
    "JemlaMaroc, plateforme de grossistes marocains vérifiés. Achetez en gros auprès de 500+ fournisseurs — mode, alimentation, électronique, artisanat, dans 40+ villes du Maroc.",
  alternates: { canonical: "https://jemlamaroc.com" },
  openGraph: {
    title: "JemlaMaroc — Grossiste au Maroc | Achat en Gros, Fournisseurs Vérifiés",
    description:
      "Plateforme de grossistes marocains vérifiés dans 40+ villes. Particuliers, revendeurs et professionnels bienvenus — commandez en gros directement via WhatsApp.",
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
