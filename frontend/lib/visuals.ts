/**
 * Static visual assets for marketing surfaces.
 * Product/seller images continue to come from the API.
 * These URLs can be replaced with first-party assets later.
 */
export const VISUALS = {
  hero: "/hero-bg.jpg",
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
  cities: {
    Casablanca: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=700&q=70",
    Rabat: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=700&q=70",
    Tanger: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=70",
    Marrakech: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=700&q=70",
    Agadir: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=700&q=70",
    Fès: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=700&q=70",
  },
} as const;

export const FEATURED_CITIES = [
  { city: "Casablanca", countLabel: "680+" },
  { city: "Rabat", countLabel: "320+" },
  { city: "Tanger", countLabel: "210+" },
  { city: "Marrakech", countLabel: "310+" },
  { city: "Agadir", countLabel: "190+" },
  { city: "Fès", countLabel: "240+" },
] as const;
