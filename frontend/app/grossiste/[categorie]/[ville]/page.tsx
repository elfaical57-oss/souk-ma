import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { CATEGORIES, CATEGORY_FR_SLUGS, CITIES, categoryByFrSlug, citySlug, cityBySlug } from "@/lib/catalog";
import type { ProductCardData } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";
const MIN_PRODUCTS_TO_INDEX = 3;

// Single fetch, reused by generateMetadata, the page, and generateStaticParams —
// Next.js dedupes identical fetch() calls within one render/build pass, so this
// never turns into 112 separate requests for the category x city combinations.
async function getAllProducts(): Promise<ProductCardData[]> {
  try {
    const res = await fetch(`${API_URL}/products?limit=500`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

function filterCombo(products: ProductCardData[], categorySlug: string, city: string) {
  return products.filter(
    (p) => (p as any).category?.slug === categorySlug && p.city && citySlug(p.city) === citySlug(city)
  );
}

export async function generateMetadata(
  { params }: { params: { categorie: string; ville: string } }
): Promise<Metadata> {
  const category = categoryByFrSlug(params.categorie);
  const city = cityBySlug(params.ville);
  if (!category || !city) return { title: "Page introuvable" };

  const products = filterCombo(await getAllProducts(), category.slug, city);
  const url = `${BASE_URL}/grossiste/${params.categorie}/${params.ville}`;
  const title = `Grossiste ${category.label} ${city} — Fournisseurs en Gros | JemlaMaroc`;
  const description = `Trouvez des grossistes en ${category.label.toLowerCase()} à ${city}. Achat en gros direct auprès de fournisseurs vérifiés, commande par WhatsApp, livraison rapide.`;
  const indexable = products.length >= MIN_PRODUCTS_TO_INDEX;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "fr_MA" },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function GrossisteComboPage(
  { params }: { params: { categorie: string; ville: string } }
) {
  const category = categoryByFrSlug(params.categorie);
  const city = cityBySlug(params.ville);
  if (!category || !city) notFound();

  const products = filterCombo(await getAllProducts(), category.slug, city);

  return (
    <div className="bg-background min-h-screen">
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: category.label, href: `/products/categorie/${category.slug}` },
          { label: city, href: `/products/ville/${citySlug(city)}` },
        ]}
      />

      <div className="container py-6">
        <h1 className="text-2xl font-bold text-navy mb-2">
          Grossiste {category.label} {city} — Fournisseurs en Gros
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl mb-6 leading-relaxed">
          Vous cherchez un grossiste en {category.label.toLowerCase()} à {city} ? Découvrez les fournisseurs
          vérifiés de la catégorie {category.label.toLowerCase()} basés à {city} ou livrant dans la région.
          Commandez directement par WhatsApp, négociez vos quantités et profitez de prix de gros sans
          intermédiaire.
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card py-12 text-center">
            <p className="text-gray-400 text-sm mb-3">
              Aucun fournisseur {category.label.toLowerCase()} à {city} pour le moment.
            </p>
            <Link href={`/products/categorie/${category.slug}`} className="text-primary text-sm font-semibold hover:underline">
              Voir tous les fournisseurs {category.label.toLowerCase()} →
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href={`/products/categorie/${category.slug}`} className="text-primary font-semibold hover:underline">
            ← Tous les grossistes {category.label.toLowerCase()}
          </Link>
          <Link href={`/products/ville/${citySlug(city)}`} className="text-primary font-semibold hover:underline">
            ← Tous les grossistes à {city}
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Only pre-render (and let Google index) combinations that actually have
  // enough products — thin/empty combos stay reachable but noindex.
  const products = await getAllProducts();
  const params: { categorie: string; ville: string }[] = [];
  for (const cat of CATEGORIES) {
    for (const city of CITIES) {
      if (filterCombo(products, cat.slug, city).length >= MIN_PRODUCTS_TO_INDEX) {
        params.push({ categorie: CATEGORY_FR_SLUGS[cat.slug], ville: citySlug(city) });
      }
    }
  }
  return params;
}
