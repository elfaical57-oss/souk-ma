import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { CATEGORIES, categoryBySlug } from "@/lib/catalog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";
const PAGE_SIZE = 20;

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
  const description = `Achetez en gros ${category.label.toLowerCase()} directement auprès de grossistes marocains vérifiés. Prix de gros, commande directe, livraison partout au Maroc.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryBySlug(params.slug);
  if (!category) notFound();

  const { products, total } = await getProducts(category.slug);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
            <Link href="/" className="hover:text-primary shrink-0">Accueil</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/products" className="hover:text-primary shrink-0">Produits</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-800 font-medium truncate">{category.label}</span>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {category.icon} Grossiste {category.label} au Maroc
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
      </div>
    </div>
  );
}
