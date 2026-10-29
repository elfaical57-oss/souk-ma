import Link from "next/link";
import { CITIES, citySlug } from "@/lib/catalog";

export default function CityLinks({
  title,
  lang = "fr",
}: {
  title?: string;
  lang?: "fr" | "ar";
}) {
  const isArabic = lang === "ar";
  const heading = title ?? (isArabic ? "الجملة حسب المدينة" : "Grossistes par ville");

  return (
    <section className="container py-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{heading}</h2>
      <div className="flex flex-wrap gap-2">
        {CITIES.map((city) => (
          <Link
            key={city}
            href={`/products/ville/${citySlug(city)}`}
            className="text-sm bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            {/* City names stay in Latin script in the Arabic sentence for
                Phase 1 — lib/catalog.ts has no Arabic city names yet. */}
            {isArabic ? `جملة ${city}` : `Grossiste ${city}`}
          </Link>
        ))}
      </div>
    </section>
  );
}
