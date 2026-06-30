import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// In-flight request deduplication for GET calls
const inFlight = new Map<string, Promise<any>>();

const originalGet = api.get.bind(api);
api.get = (url: string, config?: any) => {
  const key = url + JSON.stringify(config?.params || {});
  if (inFlight.has(key)) return inFlight.get(key)!;
  const req = originalGet(url, config).finally(() => inFlight.delete(key));
  inFlight.set(key, req);
  return req;
};

export default api;
