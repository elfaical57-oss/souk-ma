/**
 * Static visual assets for marketing surfaces.
 * Product/seller images continue to come from the API.
 * These URLs can be replaced with first-party assets later.
 */
export const VISUALS = {
  hero: "/hero-bg.webp",
  promoWarehouse: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=65",
  collage: {
    boxes: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=65",
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=65",
    fashion: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=65",
    home: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=65",
    lanterns: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=600&q=65",
  },
  categories: {
    electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70",
    fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=70",
    home: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=70",
    food: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=70",
    auto: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=70",
    agriculture: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=70",
    construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=70",
    handicraft: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=70",
  },
  // Self-hosted (were hotlinked to Unsplash — fragile: subject to rate
  // limits and occasional load failures, confirmed in practice when
  // Agadir/Fès silently fell back to a blank card).
  cities: {
    Casablanca: "/cities/casablanca.jpg",
    Rabat: "/cities/rabat.jpg",
    Tanger: "/cities/tanger.jpg",
    Marrakech: "/cities/marrakech.jpg",
    Agadir: "/cities/agadir.jpg",
    Fès: "/cities/fes.jpg",
  },
} as const;

export const FEATURED_CITIES = [
  { city: "Casablanca" },
  { city: "Rabat" },
  { city: "Tanger" },
  { city: "Marrakech" },
  { city: "Agadir" },
  { city: "Fès" },
] as const;
