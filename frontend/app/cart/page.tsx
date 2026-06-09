"use client";

import Image from "next/image";
import { Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import useCartStore from "@/lib/stores/cartStore";
import { buildWhatsAppUrl, orderMessage } from "@/lib/whatsapp";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clear } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Votre panier est vide</h2>
        <p className="font-arabic text-gray-500 mb-6">سلتك فارغة</p>
        <Link href="/products" className="btn-primary">Voir les produits</Link>
      </div>
    );
  }

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.sellerWhatsapp || "no-whatsapp";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleOrderBySeller = (whatsapp: string, sellerItems: typeof items) => {
    const summary = sellerItems.map((i) => `${i.title} x${i.quantity}`).join(", ");
    const msg = `مرحبا، أريد طلب:\n${summary}\n\nBonjour, je voudrais commander:\n${summary}\n\nTotal: ${sellerItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)} MAD`;
    window.open(buildWhatsAppUrl(whatsapp, msg), "_blank");
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Panier / <span className="font-arabic">سلتي</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image src={item.image || "/images/placeholder.png"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                {item.sellerName && <p className="text-xs text-gray-500 mt-0.5">{item.sellerName}</p>}
                <p className="font-bold text-primary mt-1">{item.price.toFixed(2)} MAD</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted text-sm">-</button>
                    <span className="px-3 py-1 text-sm border-x border-border">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold">{(item.price * item.quantity).toFixed(2)} MAD</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Récapitulatif</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Sous-total ({items.length} articles)</span>
                <span>{total().toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span>{total().toFixed(2)} MAD</span>
              </div>
            </div>

            {/* Order by seller via WhatsApp */}
            {Object.entries(grouped).map(([whatsapp, sellerItems]) => (
              whatsapp !== "no-whatsapp" && (
                <button
                  key={whatsapp}
                  onClick={() => handleOrderBySeller(whatsapp, sellerItems)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="truncate">Commander chez {sellerItems[0].sellerName}</span>
                </button>
              )
            ))}

            <button onClick={clear} className="w-full mt-3 text-sm text-red-400 hover:text-red-600 transition-colors">
              Vider le panier
            </button>
          </div>

          <div className="card p-4 bg-green-50 border-green-200">
            <div className="flex gap-2 text-green-700">
              <MessageCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Commande via WhatsApp</p>
                <p className="text-xs text-green-600 mt-1">Contactez directement les vendeurs pour confirmer votre commande et arranger la livraison.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
