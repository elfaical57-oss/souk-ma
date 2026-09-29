export interface SellerProfileLite {
  businessName?: string;
  rating?: number;
  verified?: boolean;
  city?: string;
  logo?: string;
  whatsapp?: string;
}

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  images: string[];
  minOrderQty: number;
  city?: string;
  bulkPrices?: { qty: number; price: number }[] | null;
  seller?: {
    id?: string;
    sellerProfile?: SellerProfileLite;
  };
  reviews?: { rating: number }[];
}

export interface Seller {
  id: string;
  businessName: string;
  slug?: string;
  city?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  logo?: string;
  banner?: string;
  description?: string;
  whatsapp?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}
