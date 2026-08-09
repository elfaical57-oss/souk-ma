import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue Grossiste — Produits en Gros au Maroc",
  description:
    "Parcourez des milliers de produits chez nos grossistes vérifiés — électronique, mode, alimentation, artisanat, BTP et plus, partout au Maroc.",
  alternates: { canonical: "https://jemlamaroc.com/products" },
  openGraph: {
    title: "Catalogue Grossiste — Produits en Gros au Maroc | JemlaMaroc",
    description:
      "Parcourez des milliers de produits chez nos grossistes vérifiés. Vendeurs vérifiés, prix grossiste garanti.",
    url: "https://jemlamaroc.com/products",
    type: "website",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
