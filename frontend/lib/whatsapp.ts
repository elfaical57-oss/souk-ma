export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function productInquiryMessage(productTitle: string, productUrl: string): string {
  return (
    `مرحبا، أنا مهتم بهذا المنتج:\n${productTitle}\n${productUrl}` +
    `\n\nBonjour, je suis intéressé par ce produit :\n${productTitle}\n${productUrl}`
  );
}

export function orderMessage(productTitle: string, qty: number, city: string, productUrl: string): string {
  return (
    `مرحبا، أريد طلب:\n- المنتج: ${productTitle}\n- الكمية: ${qty}\n- المدينة: ${city}\n- الرابط: ${productUrl}` +
    `\n\nBonjour, je voudrais commander :\n- Produit: ${productTitle}\n- Quantité: ${qty}\n- Ville: ${city}\n- Lien: ${productUrl}`
  );
}

export function storeInquiryMessage(businessName: string, storeUrl: string): string {
  return (
    `مرحبا ${businessName}، تعرفت عليكم من موقع JemlaMaroc.\nأريد الاستفسار عن منتجاتكم.\n${storeUrl}` +
    `\n\nBonjour ${businessName}, je vous contacte depuis JemlaMaroc.\nJe souhaite avoir plus d'informations sur vos produits.\n${storeUrl}`
  );
}
