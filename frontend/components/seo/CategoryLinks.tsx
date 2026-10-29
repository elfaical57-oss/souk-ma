import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export default function CategoryLinks({
  title,
  lang = "fr",
}: {
  title?: string;
  lang?: "fr" | "ar";
}) {
  const isArabic = lang === "ar";
  const heading = title ?? (isArabic ? "الجملة حسب الفئة" : "Grossistes par catégorie");

  return (
    <section className="container py-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{heading}</h2>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/categorie/${cat.slug}`}
            className="text-sm bg-white border border-gray-200 hover:border-primary/40 hover:text-primary text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            {isArabic ? `جملة ${cat.labelAr}` : `Grossiste ${cat.label}`}
          </Link>
        ))}
      </div>
    </section>
  );
}
