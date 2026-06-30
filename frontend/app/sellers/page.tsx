import { Metadata } from "next";
import SellersClient from "./SellersClient";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Fournisseurs & Grossistes au Maroc — Particuliers & Revendeurs",
  description:
    "Découvrez 500+ fournisseurs et grossistes marocains vérifiés. Achetez en gros pour particuliers, revendeurs et professionnels — textile, alimentation, électronique, artisanat dans 40+ villes.",
  alternates: { canonical: `${BASE_URL}/sellers` },
  openGraph: {
    title: "Fournisseurs & Grossistes au Maroc — Particuliers & Revendeurs",
    description:
      "500+ grossistes marocains vérifiés dans 40+ villes. Ouverts aux particuliers et revendeurs — commandez directement via WhatsApp.",
    url: `${BASE_URL}/sellers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fournisseurs & Grossistes au Maroc | JemlaMaroc",
    description: "500+ grossistes vérifiés au Maroc. Particuliers et revendeurs bienvenus — commandez via WhatsApp.",
  },
};

export default function SellersPage() {
  return <SellersClient />;
}
