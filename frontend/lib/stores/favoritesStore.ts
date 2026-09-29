import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardData } from "../types";

export type FavoriteProduct = Pick<
  ProductCardData,
  "id" | "title" | "price" | "images" | "minOrderQty" | "city" | "bulkPrices" | "seller"
>;

interface FavoritesStore {
  items: FavoriteProduct[];
  toggle: (product: FavoriteProduct) => void;
  has: (id: string) => boolean;
  count: () => number;
}

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((s) => ({
          items: s.items.some((i) => i.id === product.id)
            ? s.items.filter((i) => i.id !== product.id)
            : [...s.items, product],
        })),
      has: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    { name: "jemla-favorites" }
  )
);

export default useFavoritesStore;
