import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { emitSessionExpired } from "./authEvents";
import { navigateToLogin } from "../navigation/navigationRef";

export const API_URL = "https://api.jemlamaroc.com/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dedupe: several requests can fail with 401 around the same time (e.g. a
// screen firing off parallel calls); only react to the first one so we don't
// call logout/navigate repeatedly for a single expired session.
let handlingSessionExpiry = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint && !handlingSessionExpiry) {
      handlingSessionExpiry = true;
      emitSessionExpired();
      navigateToLogin();
      // Allow a later, genuinely new expiry to be handled again.
      setTimeout(() => {
        handlingSessionExpiry = false;
      }, 2000);
    }

    return Promise.reject(error);
  }
);
