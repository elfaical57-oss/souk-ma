import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = "https://jemlamaroc.com";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Produit introuvable" };

  const title = product.title as string;
  const description =
    (product.description as string)?.slice(0, 160) ||
    `Achetez ${title} au meilleur prix de gros au Maroc sur JemlaMaroc.`;
  const image: string | undefined = product.images?.[0];
  const url = `${BASE_URL}/products/${product.slug || params.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(image && { images: [{ url: image, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  // A deleted/never-existed product must return a real 404, not a 200 page
  // that merely says "not found" — otherwise Google keeps the dead URL
  // around indefinitely instead of dropping it from the index.
  if (!product) notFound();

  // Old /products/{cuid} links still work (backend looks up by id or slug) but
  // should consolidate SEO signals onto the slug URL once one exists.
  if (product.slug && product.slug !== params.id) {
    permanentRedirect(`/products/${product.slug}`);
  }

  const avgRating =
    product?.reviews?.length > 0
      ? product.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
        product.reviews.length
      : null;

  const productUrl = `https://jemlamaroc.com/products/${product?.slug || product?.id}`;
  const sellerName: string | undefined =
    product?.seller?.sellerProfile?.businessName || product?.seller?.name;
  const hasValidPrice = typeof product?.price === "number" && product.price > 0;

  const jsonLd = product != null
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description:
          product.description +
          (product.minOrderQty > 1 ? ` Quantité minimale de commande : ${product.minOrderQty}.` : ""),
        image: product.images,
        url: productUrl,
        sku: product.id,
        ...(sellerName && { brand: { "@type": "Brand", name: sellerName } }),
        ...(hasValidPrice && {
          offers: {
            "@type": "Offer",
            url: productUrl,
            price: product.price,
            priceCurrency: "MAD",
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            ...(sellerName && { seller: { "@type": "Organization", name: sellerName } }),
          },
        }),
        ...(avgRating !== null && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: product.reviews.length,
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
      <ProductPageClient params={params} initialProduct={product} />
    </>
  );
}
