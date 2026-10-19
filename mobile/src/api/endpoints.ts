import { api } from "./client";
import { Category, Product, ProductListResponse, SellerListItem, User } from "../types";

export const authApi = {
  login: (phone: string, password: string) =>
    api.post<{ user: User; token: string }>("/auth/login", { phone, password }),
  register: (data: {
    name: string;
    phone: string;
    password: string;
    role?: "BUYER" | "SELLER";
    city?: string;
    businessName?: string;
    whatsapp?: string;
    sellsWholesale?: boolean;
  }) => api.post<{ user: User; token: string }>("/auth/register", data),
  me: () => api.get<User>("/auth/me"),
};

export const categoriesApi = {
  list: () => api.get<Category[]>("/categories"),
};

export const productsApi = {
  list: (params?: {
    search?: string;
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) => api.get<ProductListResponse>("/products", { params }),
  get: (idOrSlug: string) => api.get<Product>(`/products/${idOrSlug}`),
  create: (data: Partial<Product>) => api.post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
};

export const sellersApi = {
  list: () => api.get<SellerListItem[]>("/sellers"),
  get: (idOrSlug: string) => api.get(`/sellers/${idOrSlug}`),
  myProducts: () => api.get<Product[]>("/sellers/my-products"),
  dashboardStats: () =>
    api.get<{ productCount: number; totalRevenue: number; totalOrders: number }>(
      "/sellers/dashboard/stats"
    ),
  updateProfile: (data: Record<string, unknown>) => api.put("/sellers/profile", data),
};
