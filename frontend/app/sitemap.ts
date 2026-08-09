import { MetadataRoute } from "next";
import { CATEGORIES, CITIES, citySlug } from "@/lib/catalog";

const BASE_URL = "https://jemlamaroc.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                     lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE_URL}/products`,       lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/sellers`,        lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE_URL}/vendre`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/products/categorie/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${BASE_URL}/products/ville/${citySlug(c)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = await (async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=500`, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      const products: { id: string; updatedAt?: string }[] = Array.isArray(data) ? data : (data.products ?? []);
      return products.map((p) => ({
        url: `${BASE_URL}/products/${p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    } catch {
      return [];
    }
  })();

  const sellerPages: MetadataRoute.Sitemap = await (async () => {
    try {
      const res = await fetch(`${API_URL}/sellers?limit=500`, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      const sellers: { slug?: string; user?: { id: string }; id?: string }[] = Array.isArray(data) ? data : (data.sellers ?? []);
      return sellers.map((s) => ({
        url: `${BASE_URL}/sellers/${s.slug ?? s.user?.id ?? s.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    } catch {
      return [];
    }
  })();

  return [...staticPages, ...categoryPages, ...cityPages, ...productPages, ...sellerPages];
}
