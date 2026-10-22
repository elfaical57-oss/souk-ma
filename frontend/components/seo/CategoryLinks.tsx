import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export default function CategoryLinks({ title = "Grossistes par catégorie" }: { title?: string }) {
  return (
    <section className="container py-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/categorie/${cat.slug}`}
            className="text-sm bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Grossiste {cat.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
