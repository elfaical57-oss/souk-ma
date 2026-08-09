export interface CategoryMeta {
  slug: string;
  label: string;
  labelAr: string;
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { label: "Électronique",  labelAr: "إلكترونيات",        slug: "electronics",  icon: "💻" },
  { label: "Mode",          labelAr: "الموضة",             slug: "fashion",      icon: "👗" },
  { label: "Maison & Déco", labelAr: "المنزل والديكور",    slug: "home",         icon: "🏠" },
  { label: "Alimentation",  labelAr: "الغذاء",             slug: "food",         icon: "🍎" },
  { label: "Auto & Moto",   labelAr: "السيارات",           slug: "auto",         icon: "🚗" },
  { label: "Artisanat",     labelAr: "الصناعة التقليدية",  slug: "handicraft",   icon: "🏺" },
  { label: "Matériaux BTP", labelAr: "مواد البناء",        slug: "construction", icon: "🧱" },
  { label: "Agriculture",   labelAr: "الزراعة",            slug: "agriculture",  icon: "🌿" },
];

export const CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès",
  "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Safi", "El Jadida",
];

export function citySlug(city: string): string {
  return city
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function cityBySlug(slug: string): string | undefined {
  return CITIES.find((c) => citySlug(c) === slug);
}
