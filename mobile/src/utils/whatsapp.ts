import { Linking } from "react-native";

export function buildWhatsAppUrl(phone: string, message: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "212" + cleaned.slice(1);
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function openWhatsApp(phone: string, message: string) {
  const url = buildWhatsAppUrl(phone, message);
  Linking.openURL(url).catch(() => {});
}

export function orderMessage(productTitle: string, qty: number, city: string): string {
  return (
    `مرحبا، أريد طلب:\n- المنتج: ${productTitle}\n- الكمية: ${qty}\n- المدينة: ${city}` +
    `\n\nBonjour, je voudrais commander :\n- Produit: ${productTitle}\n- Quantité: ${qty}\n- Ville: ${city}`
  );
}
