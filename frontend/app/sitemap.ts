import { MetadataRoute } from "next";
import { CATEGORIES, CATEGORY_FR_SLUGS, CITIES, citySlug } from "@/lib/catalog";

const BASE_URL = "https://jemlamaroc.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const MIN_PRODUCTS_TO_INDEX = 3;

interface SitemapProduct {
  id: string;
  slug?: string;
  updatedAt?: string;
  city?: string;
  category?: { slug?: string };
}

interface SitemapSeller {
  slug?: string;
  user?: { id: string };
  id?: string;
  updatedAt?: string;
}

async function getAllProducts(): Promise<SitemapProduct[]> {
  try {
    const res = await fetch(`${API_URL}/products?limit=500`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products ?? []);
  } catch {
    return [];
  }
}

async function getAllSellers(): Promise<SitemapSeller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers?limit=500`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.sellers ?? []);
  } catch {
    return [];
  }
}

function maxDate(dates: (string | undefined)[]): Date | undefined {
  const valid = dates.filter((d): d is string => !!d).map((d) => new Date(d).getTime());
  return valid.length ? new Date(Math.max(...valid)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, sellers] = await Promise.all([getAllProducts(), getAllSellers()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL },
    { url: `${BASE_URL}/products` },
    { url: `${BASE_URL}/sellers` },
    { url: `${BASE_URL}/vendre` },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => {
    const lastModified = maxDate(
      products.filter((p) => p.category?.slug === c.slug).map((p) => p.updatedAt)
    );
    return { url: `${BASE_URL}/products/categorie/${c.slug}`, ...(lastModified && { lastModified }) };
  });

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => {
    const lastModified = maxDate(
      products.filter((p) => p.city && citySlug(p.city) === citySlug(city)).map((p) => p.updatedAt)
    );
    return { url: `${BASE_URL}/products/ville/${citySlug(city)}`, ...(lastModified && { lastModified }) };
  });

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug || p.id}`,
    ...(p.updatedAt && { lastModified: new Date(p.updatedAt) }),
  }));

  const sellerPages: MetadataRoute.Sitemap = sellers.map((s) => ({
    url: `${BASE_URL}/sellers/${s.slug ?? s.user?.id ?? s.id}`,
    ...(s.updatedAt && { lastModified: new Date(s.updatedAt) }),
  }));

  // /grossiste/{categorie}/{ville} combo pages — only indexable ones (same
  // >=3-products threshold the page itself uses to noindex thin combos).
  const comboPages: MetadataRoute.Sitemap = [];
  for (const c of CATEGORIES) {
    for (const city of CITIES) {
      const matching = products.filter(
        (p) => p.category?.slug === c.slug && p.city && citySlug(p.city) === citySlug(city)
      );
      if (matching.length >= MIN_PRODUCTS_TO_INDEX) {
        const lastModified = maxDate(matching.map((p) => p.updatedAt));
        comboPages.push({
          url: `${BASE_URL}/grossiste/${CATEGORY_FR_SLUGS[c.slug]}/${citySlug(city)}`,
          ...(lastModified && { lastModified }),
        });
      }
    }
  }

  return [...staticPages, ...categoryPages, ...cityPages, ...productPages, ...sellerPages, ...comboPages];
}
