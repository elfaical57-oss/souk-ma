export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function productInquiryMessage(productTitle: string, productUrl: string): string {
  return `مرحبا، أنا مهتم بمنتج: ${productTitle}\n\nBonjour, je suis intéressé par: ${productTitle}\n\nLien: ${productUrl}`;
}

export function orderMessage(productTitle: string, qty: number, city: string): string {
  return `مرحبا، أريد طلب:\n- المنتج: ${productTitle}\n- الكمية: ${qty}\n- المدينة: ${city}\n\nBonjour, je voudrais commander:\n- Produit: ${productTitle}\n- Quantité: ${qty}\n- Ville: ${city}`;
}
