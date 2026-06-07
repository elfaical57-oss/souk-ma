import { create } from "zustand";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sellerWhatsapp?: string;
  sellerName?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      if (existing) {
        return { items: s.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) };
      }
      return { items: [...s.items, item] };
    }),

  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  updateQty: (id, qty) =>
    set((s) => ({
      items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => i.id === id ? { ...i, quantity: qty } : i),
    })),

  clear: () => set({ items: [] }),

  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}));

export default useCartStore;
