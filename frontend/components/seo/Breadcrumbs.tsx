import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

const BASE_URL = "https://jemlamaroc.com";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${BASE_URL}${item.href}` }),
    })),
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="container py-3">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0 flex-wrap">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" aria-hidden="true" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary shrink-0">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-800 font-medium truncate">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
