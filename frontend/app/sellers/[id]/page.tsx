import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import SellerPageClient from "./SellerPageClient";
import { SELLER_MIN_PRODUCTS } from "@/lib/catalog";
import { buildSellerTitle } from "@/lib/seoTitle";

interface SellerProductForCategory {
  category?: { nameFr?: string };
}

// The category with the most active listings — used to describe what this
// seller mainly deals in when none of them alone makes the page indexable.
function mainCategory(products: SellerProductForCategory[]): string | undefined {
  const counts = new Map<string, number>();
  for (const p of products) {
    const name = p.category?.nameFr;
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [name, count] of counts) {
    if (count > bestCount) { best = name; bestCount = count; }
  }
  return best;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";

async function getSeller(id: string) {
  try {
    const res = await fetch(`${API_URL}/sellers/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const seller = await getSeller(params.id);
  if (!seller) return { title: "Boutique introuvable" };

  const products = (seller.user?.products ?? []) as SellerProductForCategory[];
  const category = mainCategory(products);
  const title = buildSellerTitle(seller.businessName, category, seller.city);
  const description =
    (seller.description as string)?.slice(0, 160) ||
    `Découvrez les produits de ${seller.businessName}, vendeur vérifié sur JemlaMaroc${seller.city ? ` à ${seller.city}` : ""}.`;
  const url = `${BASE_URL}/sellers/${seller.slug || params.id}`;
  const productCount = products.length;
  const indexable = productCount >= SELLER_MIN_PRODUCTS;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(seller.logo && { images: [{ url: seller.logo as string, alt: seller.businessName as string }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(seller.logo && { images: [seller.logo as string] }),
    },
  };
}

export default async function SellerStorePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const seller = await getSeller(params.id);

  if (seller?.slug && seller.slug !== params.id) {
    permanentRedirect(`/sellers/${seller.slug}`);
  }

  const jsonLd = seller
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: seller.businessName,
        description: seller.description,
        url: `${BASE_URL}/sellers/${(seller as any).slug || params.id}`,
        ...(seller.city && {
          address: {
            "@type": "PostalAddress",
            addressLocality: seller.city,
            addressCountry: "MA",
          },
        }),
        ...(seller.logo && { image: seller.logo }),
        ...(seller.rating > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (seller.rating as number).toFixed(1),
            reviewCount: seller.totalSales || 1,
          },
        }),
      }
    : null;

  const breadcrumbJsonLd = seller
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Fournisseurs", item: `${BASE_URL}/sellers` },
          { "@type": "ListItem", position: 3, name: seller.businessName },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <SellerPageClient params={params} initialSeller={seller} />
    </>
  );
}
