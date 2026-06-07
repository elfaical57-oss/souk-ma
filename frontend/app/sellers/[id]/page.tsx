import { Metadata } from "next";
import SellerPageClient from "./SellerPageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";

async function getSeller(id: string) {
  try {
    const res = await fetch(`${API_URL}/sellers/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const seller = await getSeller(params.id);
  if (!seller) return { title: "Boutique introuvable" };

  const title = `Boutique ${seller.businessName as string}`;
  const description =
    (seller.description as string)?.slice(0, 160) ||
    `Découvrez les produits de ${seller.businessName}, vendeur vérifié sur JemlaMaroc${seller.city ? ` à ${seller.city}` : ""}.`;
  const url = `${BASE_URL}/sellers/${params.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
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

export default async function SellerStorePage({ params }: { params: { id: string } }) {
  const seller = await getSeller(params.id);

  const jsonLd = seller
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: seller.businessName,
        description: seller.description,
        url: `${BASE_URL}/sellers/${params.id}`,
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

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SellerPageClient params={params} />
    </>
  );
}
