import { Metadata } from "next";
import { Suspense } from "react";
import VendreClient from "./VendreClient";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  // The root layout's title template ("%s | JemlaMaroc") appends the brand
  // suffix automatically — writing "JemlaMaroc" again here duplicated it
  // in the rendered <title> (confirmed live: "... | JemlaMaroc | JemlaMaroc").
  title: "Devenir fournisseur - Vendre en gros au Maroc",
  description:
    "Rejoignez les fournisseurs marocains sur JemlaMaroc. Boutique grossiste gratuite en 5 minutes. Recevez des commandes WhatsApp de particuliers et revendeurs de toute la région.",
  alternates: { canonical: `${BASE_URL}/vendre` },
  openGraph: {
    title: "Vendre sur JemlaMaroc | Boutique grossiste gratuite",
    description:
      "Créez votre boutique grossiste en 5 min. Fournisseurs actifs partout au Maroc. 0 MAD d'inscription.",
    url: `${BASE_URL}/vendre`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendre sur JemlaMaroc | Boutique grossiste gratuite",
    description: "Créez votre boutique grossiste en 5 min. 0 MAD d'inscription.",
  },
};

export default function VendrePage() {
  return (
    <Suspense>
      <VendreClient />
    </Suspense>
  );
}
