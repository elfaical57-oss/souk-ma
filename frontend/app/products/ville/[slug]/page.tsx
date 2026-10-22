import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqSection from "@/components/seo/FaqSection";
import { CATEGORIES, CATEGORY_FR_SLUGS, CITIES, citySlug, cityBySlug } from "@/lib/catalog";
import { CITY_CONTENT } from "@/lib/seo-content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";
const PAGE_SIZE = 20;

async function getProducts(city: string) {
  try {
    const res = await fetch(`${API_URL}/products?city=${encodeURIComponent(city)}&limit=${PAGE_SIZE}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { products: [], total: 0 };
    return res.json();
  } catch {
    return { products: [], total: 0 };
  }
}

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: citySlug(c) }));
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const city = cityBySlug(params.slug);
  if (!city) return { title: "Ville introuvable" };

  const url = `${BASE_URL}/products/ville/${citySlug(city)}`;
  const title = `Grossiste ${city} — Fournisseurs en Gros au Maroc`;
  const description = `Trouvez des grossistes et fournisseurs vérifiés à ${city}. Achetez en gros directement par WhatsApp, prix négociés, livraison rapide.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "fr_MA" },
  };
}

export default async function CityPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  const city = cityBySlug(params.slug);
  if (!city) notFound();

  const { products, total } = await getProducts(city);
  const content = CITY_CONTENT[params.slug];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Produits", href: "/products" },
          { label: city },
        ]}
      />

      <div className="container py-6">
        <h1 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Grossiste {city} — Fournisseurs en Gros
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl mb-6 leading-relaxed">
          Découvrez les grossistes et fournisseurs vérifiés à {city}. Commandez en gros directement auprès des
          vendeurs locaux, prix négociés et livraison rapide.
        </p>

        <ProductGrid query={{ city }} initialProducts={products} initialTotal={total} />

        <div className="mt-8 text-center">
          <Link href={`/products?city=${encodeURIComponent(city)}`} className="text-primary text-sm font-semibold hover:underline">
            Affiner avec plus de filtres (catégorie, prix) →
          </Link>
        </div>

        {content && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Grossiste à {city} : le commerce de gros dans la région
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{content.intro}</p>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Catégories de grossistes à {city}
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/grossiste/${CATEGORY_FR_SLUGS[cat.slug]}/${citySlug(city)}`}
                className="text-sm bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {cat.label} {city}
              </Link>
            ))}
          </div>
        </section>

        {content && <FaqSection faqs={content.faqs} />}
      </div>
    </div>
  );
}
