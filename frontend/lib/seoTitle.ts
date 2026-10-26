// The root layout's title template ("%s | JemlaMaroc") appends the brand
// suffix automatically — pages must never bake it into their own title
// string too, or it renders twice. This helper only has to fit the part
// before that suffix, sized so the final rendered <title> stays ≤60 chars.
const BRAND_SUFFIX_LENGTH = " | JemlaMaroc".length;

export function buildSeoTitle(base: string, maxLength = 60): string {
  const budget = maxLength - BRAND_SUFFIX_LENGTH;
  if (base.length <= budget) return base;

  const cut = base.slice(0, budget - 1);
  // Prefer breaking on a full word — but only if that doesn't throw away
  // most of the available budget (a title with one 50-char word truncates
  // mid-word rather than collapsing to almost nothing).
  const lastSpace = cut.lastIndexOf(" ");
  const clean = lastSpace > budget * 0.6 ? cut.slice(0, lastSpace) : cut;
  // Drop a trailing dash/ampersand/punctuation so it doesn't collide with
  // the ellipsis (e.g. "en gros –…" or "Mode &…").
  return `${clean.replace(/[\s\-–—&,.:;]+$/, "")}…`;
}
