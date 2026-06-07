import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tous les produits en gros au Maroc",
  description:
    "Parcourez des milliers de produits en gros sur JemlaMaroc — électronique, mode, alimentation, artisanat, BTP et plus. Vendeurs vérifiés partout au Maroc.",
  alternates: { canonical: "https://jemlamaroc.com/products" },
  openGraph: {
    title: "Tous les produits en gros au Maroc | JemlaMaroc",
    description:
      "Parcourez des milliers de produits en gros sur JemlaMaroc. Vendeurs vérifiés, prix grossiste garanti.",
    url: "https://jemlamaroc.com/products",
    type: "website",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
