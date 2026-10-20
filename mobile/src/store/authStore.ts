import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api/endpoints";
import { onSessionExpired } from "../api/authEvents";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: Parameters<typeof authApi.register>[0]) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    const [token, userJson] = await Promise.all([
      AsyncStorage.getItem("token"),
      AsyncStorage.getItem("user"),
    ]);
    set({
      token,
      user: userJson ? JSON.parse(userJson) : null,
      isHydrated: true,
    });
  },

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login(phone, password);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register(payload);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    set({ user: null, token: null });
  },

  refreshMe: async () => {
    if (!get().token) return;
    const { data } = await authApi.me();
    set({ user: data });
    await AsyncStorage.setItem("user", JSON.stringify(data));
  },
}));

// A 401 from any request (token expired/revoked) clears the session the same
// way an explicit logout does, so the UI never shows stale "logged in" state
// against a backend that has already rejected the token.
onSessionExpired(() => {
  useAuthStore.getState().logout();
});

export default useAuthStore;
