import Link from "next/link";
import { CITIES, citySlug } from "@/lib/catalog";

export default function CityLinks({ title = "Grossistes par ville" }: { title?: string }) {
  return (
    <section className="container py-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {CITIES.map((city) => (
          <Link
            key={city}
            href={`/products/ville/${citySlug(city)}`}
            className="text-sm bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Grossiste {city}
          </Link>
        ))}
      </div>
    </section>
  );
}
