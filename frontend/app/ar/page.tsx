import { Metadata } from "next";
import HomeContent from "../HomeContent";
import HomeSeoText from "@/components/home/HomeSeoText";
import FaqSection from "@/components/seo/FaqSection";
import CityLinks from "@/components/seo/CityLinks";
import CategoryLinks from "@/components/seo/CategoryLinks";
import { HOME_FAQ_AR } from "@/lib/seo-content";
import { getAllSellers, getFeaturedProducts } from "@/lib/data/homeData";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "الجملة عبر الإنترنت في المغرب - موردون مباشرون",
  description:
    "جملة ماروك، سوق البيع بالجملة في المغرب. اشترِ بالجملة - الموضة، المواد الغذائية، الإلكترونيات، الصناعة التقليدية - مباشرة من موردين في جميع أنحاء المغرب، بدون وسيط.",
  alternates: {
    canonical: "https://jemlamaroc.com/ar",
    languages: {
      fr: "https://jemlamaroc.com",
      ar: "https://jemlamaroc.com/ar",
      "x-default": "https://jemlamaroc.com",
    },
  },
  openGraph: {
    title: "الجملة عبر الإنترنت في المغرب - موردون مباشرون | جملة ماروك",
    description:
      "سوق البيع بالجملة في المغرب. الموزعون والتجار والمحترفون مرحب بهم - اطلب بالجملة مباشرة عبر واتساب.",
    url: "https://jemlamaroc.com/ar",
    type: "website",
    locale: "ar_MA",
  },
};

export default async function HomePageArabic() {
  const [allSellers, { products }] = await Promise.all([getAllSellers(), getFeaturedProducts()]);
  return (
    <>
      <HomeContent sellers={allSellers} products={products} />
      <HomeSeoText lang="ar" />
      <div className="container max-w-3xl pb-10">
        <FaqSection faqs={HOME_FAQ_AR} title="الأسئلة الشائعة" />
      </div>
      <CategoryLinks lang="ar" />
      <CityLinks lang="ar" />
    </>
  );
}
