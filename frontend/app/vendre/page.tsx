import { Metadata } from "next";
import { Suspense } from "react";
import VendreClient from "./VendreClient";

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  title: "Vendre sur JemlaMaroc | Créez votre boutique grossiste gratuite",
  description:
    "Rejoignez 500+ fournisseurs marocains sur JemlaMaroc. Boutique B2B gratuite en 5 minutes. Recevez des commandes WhatsApp de toute la région.",
  alternates: { canonical: `${BASE_URL}/vendre` },
  openGraph: {
    title: "Vendre sur JemlaMaroc | Boutique grossiste gratuite",
    description:
      "Créez votre boutique B2B en 5 min. 500+ fournisseurs actifs. 0 MAD d'inscription.",
    url: `${BASE_URL}/vendre`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendre sur JemlaMaroc | Boutique grossiste gratuite",
    description: "Créez votre boutique B2B en 5 min. 0 MAD d'inscription.",
  },
};

export default function VendrePage() {
  return (
    <Suspense>
      <VendreClient />
    </Suspense>
  );
}
