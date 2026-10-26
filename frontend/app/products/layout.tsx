import { Metadata } from "next";
import CategoryLinks from "@/components/seo/CategoryLinks";
import CityLinks from "@/components/seo/CityLinks";

export const metadata: Metadata = {
  // This layout's own title metadata resets title-template inheritance for
  // everything below it (product/category/city pages) — without its own
  // template here, those leaf pages' titles would render without the
  // " | JemlaMaroc" suffix the root layout's template would otherwise add.
  title: {
    default: "Catalogue Grossiste — Produits en Gros au Maroc",
    template: "%s | JemlaMaroc",
  },
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
  return (
    <>
      {children}
      <CategoryLinks />
      <CityLinks />
    </>
  );
}
