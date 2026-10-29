import { MetadataRoute } from "next";
import { CATEGORIES, CATEGORY_FR_SLUGS, CITIES, GROSSISTE_MIN_PRODUCTS, SELLER_MIN_PRODUCTS, citySlug } from "@/lib/catalog";

const BASE_URL = "https://jemlamaroc.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SitemapProduct {
  id: string;
  slug?: string;
  updatedAt?: string;
  city?: string;
  category?: { slug?: string };
  seller?: { id?: string };
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

  const homeLanguages = { fr: BASE_URL, ar: `${BASE_URL}/ar` };

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, alternates: { languages: homeLanguages } },
    { url: `${BASE_URL}/ar`, alternates: { languages: homeLanguages } },
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

  // Only list sellers with enough active products — thin profiles stay
  // reachable but noindex (same threshold the seller page itself uses).
  const sellerPages: MetadataRoute.Sitemap = sellers
    .filter((s) => products.filter((p) => p.seller?.id === s.user?.id).length >= SELLER_MIN_PRODUCTS)
    .map((s) => ({
      url: `${BASE_URL}/sellers/${s.slug ?? s.user?.id ?? s.id}`,
      ...(s.updatedAt && { lastModified: new Date(s.updatedAt) }),
    }));

  // /grossiste/{categorie}/{ville} combo pages — only indexable ones (same
  // threshold the page itself uses to noindex thin combos).
  const comboPages: MetadataRoute.Sitemap = [];
  for (const c of CATEGORIES) {
    for (const city of CITIES) {
      const matching = products.filter(
        (p) => p.category?.slug === c.slug && p.city && citySlug(p.city) === citySlug(city)
      );
      if (matching.length >= GROSSISTE_MIN_PRODUCTS) {
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
