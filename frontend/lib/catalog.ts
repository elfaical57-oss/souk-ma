import { VISUALS } from "./visuals";

export interface CategoryMeta {
  slug: string;
  label: string;
  labelAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  image: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "electronics",
    label: "Électronique",
    labelAr: "إلكترونيات",
    icon: "💻",
    description: "Smartphones, accessoires, informatique...",
    descriptionAr: "هواتف، إكسسوارات، معلوماتية...",
    image: VISUALS.categories.electronics,
  },
  {
    slug: "fashion",
    label: "Mode & Textile",
    labelAr: "الموضة والملابس",
    icon: "👗",
    description: "Vêtements, tissus, accessoires...",
    descriptionAr: "ملابس، أقمشة، إكسسوارات...",
    image: VISUALS.categories.fashion,
  },
  {
    slug: "home",
    label: "Maison & Déco",
    labelAr: "المنزل والديكور",
    icon: "🏠",
    description: "Mobilier, cuisine, linge de maison...",
    descriptionAr: "أثاث، مطبخ، مفروشات...",
    image: VISUALS.categories.home,
  },
  {
    slug: "food",
    label: "Alimentation",
    labelAr: "الغذاء",
    icon: "🍎",
    description: "Produits alimentaires, boissons, épicerie...",
    descriptionAr: "مواد غذائية، مشروبات، بقالة...",
    image: VISUALS.categories.food,
  },
  {
    slug: "auto",
    label: "Auto & Moto",
    labelAr: "السيارات",
    icon: "🚗",
    description: "Pièces, accessoires, équipements...",
    descriptionAr: "قطع غيار، إكسسوارات، معدات...",
    image: VISUALS.categories.auto,
  },
  {
    slug: "agriculture",
    label: "Agriculture",
    labelAr: "الزراعة",
    icon: "🌿",
    description: "Semences, matériel, intrants...",
    descriptionAr: "بذور، معدات، مستلزمات...",
    image: VISUALS.categories.agriculture,
  },
  {
    slug: "construction",
    label: "Matériaux BTP",
    labelAr: "مواد البناء",
    icon: "🧱",
    description: "Ciment, outillage, matériaux...",
    descriptionAr: "إسمنت، أدوات، مواد بناء...",
    image: VISUALS.categories.construction,
  },
  {
    slug: "handicraft",
    label: "Artisanat",
    labelAr: "الصناعة التقليدية",
    icon: "🏺",
    description: "Produits artisanaux, déco marocaine...",
    descriptionAr: "منتجات تقليدية، ديكور مغربي...",
    image: VISUALS.categories.handicraft,
  },
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

// French slugs for the /grossiste/[categorie]/[ville] combo route — kept separate
// from CategoryMeta.slug so the existing /products/categorie/[slug] URLs never change.
export const CATEGORY_FR_SLUGS: Record<string, string> = {
  electronics: "electronique",
  fashion: "vetements",
  home: "maison-deco",
  food: "alimentation",
  auto: "auto-moto",
  agriculture: "agriculture",
  construction: "materiaux-btp",
  handicraft: "artisanat",
};

export function categoryByFrSlug(frSlug: string): CategoryMeta | undefined {
  const slug = Object.keys(CATEGORY_FR_SLUGS).find((k) => CATEGORY_FR_SLUGS[k] === frSlug);
  return slug ? categoryBySlug(slug) : undefined;
}

export function cityBySlug(slug: string): string | undefined {
  return CITIES.find((c) => citySlug(c) === slug);
}
