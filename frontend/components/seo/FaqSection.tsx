import type { SeoFaq } from "@/lib/seo-content";

export default function FaqSection({ faqs, title = "Questions fréquentes" }: { faqs: SeoFaq[]; title?: string }) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 group">
            <summary className="font-semibold text-gray-800 text-sm cursor-pointer list-none flex items-center justify-between gap-2">
              {f.q}
              <span className="text-gray-400 group-open:rotate-45 transition-transform shrink-0">+</span>
            </summary>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
