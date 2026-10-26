// The root layout's title template ("%s | JemlaMaroc") appends the brand
// suffix automatically — every builder here only has to fit the part
// before that suffix, sized so the final rendered <title> stays ≤60 chars.
const BRAND_SUFFIX_LENGTH = " | JemlaMaroc".length;

function charBudget(maxLength: number): number {
  return maxLength - BRAND_SUFFIX_LENGTH;
}

// Truncates on a word boundary when that doesn't throw away most of the
// budget (a single very long word still truncates mid-word rather than
// collapsing to almost nothing), and strips trailing punctuation so it
// doesn't collide with the ellipsis (e.g. "en gros –…").
function truncateWord(text: string, budget: number): string {
  if (text.length <= budget) return text;
  const cut = text.slice(0, Math.max(budget - 1, 0));
  const lastSpace = cut.lastIndexOf(" ");
  const clean = lastSpace > budget * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${clean.replace(/[\s\-–—&,.:;]+$/, "")}…`;
}

export function buildSeoTitle(base: string, maxLength = 60): string {
  return truncateWord(base, charBudget(maxLength));
}

// "{Produit} en gros – {Ville}" — the city is never dropped or truncated;
// only the product name shortens if the full title doesn't fit.
export function buildProductTitle(name: string, city?: string, maxLength = 60): string {
  const suffix = city ? ` en gros – ${city}` : " en gros";
  const budget = charBudget(maxLength) - suffix.length;
  if (name.length <= budget) return `${name}${suffix}`;
  return `${truncateWord(name, budget)}${suffix}`;
}

// "{Nom} – Grossiste {catégorie} à {ville}", falling back in order:
//   1. full, with category
//   2. drop the category, keep the city
//   3. truncate the name (last resort), keep "– Grossiste à {ville}"
//   4. no city/category available at all — just the (possibly truncated) name
export function buildSellerTitle(
  businessName: string,
  category: string | undefined,
  city: string | undefined,
  maxLength = 60
): string {
  const budget = charBudget(maxLength);

  if (category && city) {
    const full = `${businessName} – Grossiste ${category} à ${city}`;
    if (full.length <= budget) return full;
  }

  if (city) {
    const withoutCategory = `${businessName} – Grossiste à ${city}`;
    if (withoutCategory.length <= budget) return withoutCategory;
    const suffix = ` – Grossiste à ${city}`;
    return `${truncateWord(businessName, budget - suffix.length)}${suffix}`;
  }

  return truncateWord(`Boutique ${businessName}`, budget);
}
