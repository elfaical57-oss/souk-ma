import { Metadata } from "next";
import SellersClient from "./SellersClient";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Fournisseurs & Grossistes au Maroc",
  description:
    "Trouvez les meilleurs grossistes marocains vérifiés sur JemlaMaroc. 500+ fournisseurs dans 40+ villes : textile, alimentaire, cosmétique, électronique et plus.",
  alternates: { canonical: `${BASE_URL}/sellers` },
  openGraph: {
    title: "Fournisseurs & Grossistes au Maroc | JemlaMaroc",
    description:
      "500+ grossistes marocains vérifiés. Commandez directement via WhatsApp sans intermédiaire.",
    url: `${BASE_URL}/sellers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fournisseurs & Grossistes au Maroc | JemlaMaroc",
    description: "500+ grossistes marocains vérifiés. Commandez via WhatsApp.",
  },
};

export default function SellersPage() {
  return <SellersClient />;
}
