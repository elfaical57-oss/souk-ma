import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { CITIES, citySlug, cityBySlug } from "@/lib/catalog";

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const city = cityBySlug(params.slug);
  if (!city) return { title: "Ville introuvable" };

  const url = `${BASE_URL}/products/ville/${citySlug(city)}`;
  const title = `Grossiste ${city} — Fournisseurs en Gros au Maroc`;
  const description = `Trouvez des grossistes et fournisseurs vérifiés à ${city}. Achetez en gros directement, prix négociés, livraison rapide.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function CityPage({ params }: { params: { slug: string } }) {
  const city = cityBySlug(params.slug);
  if (!city) notFound();

  const { products, total } = await getProducts(city);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
            <Link href="/" className="hover:text-primary shrink-0">Accueil</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/products" className="hover:text-primary shrink-0">Produits</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-800 font-medium truncate">{city}</span>
          </div>
        </div>
      </div>

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
      </div>
    </div>
  );
}
