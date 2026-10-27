// Shows the first sentence, collapses the rest behind "Lire plus" — the
// full text stays in the server-rendered HTML either way (native <details>,
// no JS needed), so nothing is lost for crawlers, just tucked away visually.
export default function CollapsibleIntro({ text, className = "text-gray-600 text-sm leading-relaxed" }: { text: string; className?: string }) {
  const splitAt = text.indexOf(". ");
  const teaser = splitAt > -1 ? text.slice(0, splitAt + 1) : text;
  const rest = splitAt > -1 ? text.slice(splitAt + 1).trim() : "";

  if (!rest) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div>
      <p className={className}>{teaser}</p>
      <details className="group mt-2">
        <summary className="list-none cursor-pointer inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
          <span className="group-open:hidden">Lire plus ↓</span>
          <span className="hidden group-open:inline">Lire moins ↑</span>
        </summary>
        <p className={`${className} mt-2`}>{rest}</p>
      </details>
    </div>
  );
}
