import api from "@/lib/api";

export function trackWhatsAppClick(
  sellerId: string,
  source: "product_order" | "product_inquiry" | "seller_profile" | "supplier_card",
  productId?: string
) {
  api.post("/analytics/whatsapp-click", { sellerId, source, productId }).catch(() => {});
}
