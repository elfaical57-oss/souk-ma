import { Metadata } from "next";

export const metadata: Metadata = {
  // Same reasoning as products/layout.tsx: this layout's own title metadata
  // resets template inheritance for seller pages below it unless it
  // redefines the template itself.
  title: {
    default: "Vendeurs certifiés au Maroc",
    template: "%s | JemlaMaroc",
  },
  description:
    "Découvrez les meilleurs vendeurs grossistes au Maroc sur JemlaMaroc. Boutiques vérifiées, prix de gros garantis. Contactez directement via WhatsApp.",
  alternates: { canonical: "https://jemlamaroc.com/sellers" },
  openGraph: {
    title: "Vendeurs certifiés au Maroc | JemlaMaroc",
    description:
      "Les meilleurs vendeurs grossistes au Maroc sur JemlaMaroc. Boutiques vérifiées, prix garantis.",
    url: "https://jemlamaroc.com/sellers",
    type: "website",
  },
};

export default function SellersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
