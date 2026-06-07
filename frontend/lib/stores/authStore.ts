import { create } from "zustand";
import api from "../api";

interface User {
  id: string;
  name: string;
  phone?: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

function getStored<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(key) || "null"); }
  catch { return null; }
}

const useAuthStore = create<AuthStore>((set) => ({
  user:  getStored<User>("auth_user"),
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,

  login: async (phone, password) => {
    const res = await api.post("/auth/login", { phone, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("auth_user", JSON.stringify(res.data.user));
    set({ user: res.data.user, token: res.data.token });
  },

  register: async (data) => {
    const res = await api.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("auth_user", JSON.stringify(res.data.user));
    set({ user: res.data.user, token: res.data.token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/auth/me");
      localStorage.setItem("auth_user", JSON.stringify(res.data));
      set({ user: res.data });
    } catch (err: any) {
      // Only clear on real auth failures, not network errors
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
        set({ user: null, token: null });
      }
    }
  },
}));

export default useAuthStore;
