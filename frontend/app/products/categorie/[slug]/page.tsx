import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqSection from "@/components/seo/FaqSection";
import { CATEGORIES, CATEGORY_FR_SLUGS, CITIES, categoryBySlug, citySlug } from "@/lib/catalog";
import { CATEGORY_CONTENT } from "@/lib/seo-content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";
const PAGE_SIZE = 20;
const TOP_CITIES = CITIES.slice(0, 8);

async function getProducts(categorySlug: string) {
  try {
    const res = await fetch(`${API_URL}/products?category=${categorySlug}&limit=${PAGE_SIZE}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { products: [], total: 0 };
    return res.json();
  } catch {
    return { products: [], total: 0 };
  }
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = categoryBySlug(params.slug);
  if (!category) return { title: "Catégorie introuvable" };

  const url = `${BASE_URL}/products/categorie/${category.slug}`;
  const title = `Grossiste ${category.label} au Maroc — Fournisseurs Vérifiés`;
  const description = `Achetez en gros ${category.label.toLowerCase()} directement auprès de grossistes marocains vérifiés. Prix de gros, commande directe par WhatsApp, livraison partout au Maroc.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "fr_MA" },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryBySlug(params.slug);
  if (!category) notFound();

  const { products, total } = await getProducts(category.slug);
  const content = CATEGORY_CONTENT[category.slug];

  return (
    <div className="bg-background min-h-screen">
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Produits", href: "/products" },
          { label: category.label },
        ]}
      />

      <div className="container py-6">
        <h1 className="text-2xl font-bold text-navy mb-2">
          Grossiste {category.label} au Maroc
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl mb-6 leading-relaxed">
          Découvrez nos grossistes et fournisseurs vérifiés en {category.label.toLowerCase()}, partout au Maroc.
          Commandez en gros directement auprès des vendeurs, prix négociés et livraison rapide dans tout le royaume.
        </p>

        <ProductGrid query={{ category: category.slug }} initialProducts={products} initialTotal={total} />

        <div className="mt-8 text-center">
          <Link href={`/products?category=${category.slug}`} className="text-primary text-sm font-semibold hover:underline">
            Affiner avec plus de filtres (ville, prix) →
          </Link>
        </div>

        {content && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Grossiste {category.label} au Maroc : comment ça marche ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{content.intro}</p>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Grossistes {category.label.toLowerCase()} par ville
          </h2>
          <div className="flex flex-wrap gap-2">
            {TOP_CITIES.map((city) => (
              <Link
                key={city}
                href={`/grossiste/${CATEGORY_FR_SLUGS[category.slug]}/${citySlug(city)}`}
                className="text-sm bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {category.label} {city}
              </Link>
            ))}
          </div>
        </section>

        {content && <FaqSection faqs={content.faqs} />}
      </div>
    </div>
  );
}
