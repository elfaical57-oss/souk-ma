import { Metadata } from "next";
import SellersClient from "./SellersClient";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Fournisseurs & Grossistes au Maroc — Particuliers & Revendeurs",
  description:
    "Découvrez les fournisseurs et grossistes marocains vérifiés sur JemlaMaroc. Achetez en gros pour particuliers, revendeurs et professionnels — textile, alimentation, électronique, artisanat.",
  alternates: { canonical: `${BASE_URL}/sellers` },
  openGraph: {
    title: "Fournisseurs & Grossistes au Maroc — Particuliers & Revendeurs",
    description:
      "Grossistes marocains vérifiés, partout au Maroc. Ouverts aux particuliers et revendeurs — commandez directement via WhatsApp.",
    url: `${BASE_URL}/sellers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fournisseurs & Grossistes au Maroc | JemlaMaroc",
    description: "Grossistes vérifiés au Maroc. Particuliers et revendeurs bienvenus — commandez via WhatsApp.",
  },
};

export default function SellersPage() {
  return <SellersClient />;
}
