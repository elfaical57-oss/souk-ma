export type Role = "BUYER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  city?: string;
  avatar?: string;
  sellerProfile?: SellerProfile | null;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  slug?: string | null;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  city: string;
  address?: string | null;
  whatsapp?: string | null;
  sellsWholesale: boolean;
  verified: boolean;
  status: string;
  rating: number;
  totalSales: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  icon?: string | null;
  image?: string | null;
  parentId?: string | null;
}

export interface BulkPrice {
  qty: number;
  price: number;
}

export interface Product {
  id: string;
  slug?: string | null;
  title: string;
  titleAr?: string | null;
  titleFr?: string | null;
  description: string;
  descriptionAr?: string | null;
  descriptionFr?: string | null;
  price: number;
  minOrderQty: number;
  bulkPrices?: BulkPrice[] | null;
  variations?: { name: string; options: string[] }[] | null;
  stock: number;
  images: string[];
  isActive: boolean;
  views: number;
  sellerId: string;
  seller?: { id: string; name: string; sellerProfile?: SellerProfile | null };
  categoryId: string;
  category?: Category;
  city?: string | null;
  tags?: string[];
  createdAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { name: string; avatar?: string | null };
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}
