import { Metadata } from "next";
import HomeContent from "./HomeContent";
import HomeSeoText from "@/components/home/HomeSeoText";
import FaqSection from "@/components/seo/FaqSection";
import CityLinks from "@/components/seo/CityLinks";
import CategoryLinks from "@/components/seo/CategoryLinks";
import { HOME_FAQ } from "@/lib/seo-content";
import { getAllSellers, getFeaturedProducts } from "@/lib/data/homeData";

export const revalidate = 300;

export const metadata: Metadata = {
  // The root layout's title template never reaches this page: layout.tsx
  // and the root page.tsx sit at the same route segment, and Next only
  // applies a template to descendant segments, not the segment that
  // declares it. Every other route gets " | JemlaMaroc" automatically;
  // this one has to spell it out.
  title: "Grossiste en ligne Maroc - Fournisseurs directs | JemlaMaroc",
  description:
    "JemlaMaroc, la marketplace de vente en gros au Maroc. Achetez en gros - mode, alimentation, électronique, artisanat - directement auprès de fournisseurs partout au Maroc, sans intermédiaire.",
  alternates: {
    canonical: "https://jemlamaroc.com",
    languages: {
      fr: "https://jemlamaroc.com",
      ar: "https://jemlamaroc.com/ar",
      "x-default": "https://jemlamaroc.com",
    },
  },
  openGraph: {
    title: "Grossiste en ligne Maroc - Fournisseurs directs | JemlaMaroc",
    description:
      "Marketplace de vente en gros au Maroc. Revendeurs, commerçants et professionnels bienvenus - commandez en gros directement via WhatsApp.",
    url: "https://jemlamaroc.com",
    type: "website",
  },
};

export default async function HomePage() {
  const [allSellers, { products }] = await Promise.all([getAllSellers(), getFeaturedProducts()]);
  return (
    <>
      <HomeContent
        sellers={allSellers}
        products={products}
      />
      <HomeSeoText />
      <div className="container max-w-3xl pb-10">
        <FaqSection faqs={HOME_FAQ} />
      </div>
      <CategoryLinks />
      <CityLinks />
    </>
  );
}
