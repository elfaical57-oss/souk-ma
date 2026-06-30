"use client";

import Image from "next/image";
import { Trash2, MessageCircle, ShoppingBag, Plus, Minus, ArrowLeft, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "@/lib/stores/cartStore";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import useLangStore from "@/lib/stores/langStore";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clear } = useCartStore();
  const { t } = useLangStore();
  const tc = t.cart;

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-20 text-center"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-gray-800 mb-2">{tc.empty}</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">Ajoutez des produits à votre panier pour passer une commande.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-red-900/20"
        >
          <Package className="w-4 h-4" />
          {tc.see_products}
        </Link>
      </motion.div>
    );
  }

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.sellerWhatsapp || "no-whatsapp";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleOrderBySeller = (whatsapp: string, sellerItems: typeof items) => {
    const summary = sellerItems.map(i => `${i.title} x${i.quantity}`).join(", ");
    const msg = `مرحبا، أريد طلب:\n${summary}\n\nBonjour, je voudrais commander:\n${summary}\n\nTotal: ${sellerItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)} MAD`;
    window.open(buildWhatsAppUrl(whatsapp, msg), "_blank");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="p-2 hover:bg-white rounded-xl transition-colors text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">{tc.title}</h1>
            <p className="text-sm text-gray-400">{items.length} article{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence initial={false}>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug">{item.title}</p>
                    {item.sellerName && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.sellerName}</p>
                    )}
                    <p className="font-black text-primary text-base mt-1.5">
                      {item.price.toFixed(2)} <span className="text-xs font-semibold text-gray-400">MAD</span>
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-900 text-base">{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">MAD</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h2 className="font-black text-gray-900 text-lg mb-5">{tc.summary}</h2>

              <div className="space-y-3 text-sm text-gray-600 mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">{tc.subtotal} ({items.length} {tc.items})</span>
                  <span className="font-semibold text-gray-800">{total().toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span className="text-green-600 font-semibold text-xs">À négocier</span>
                </div>
                <div className="flex justify-between font-black text-base text-gray-900 border-t border-gray-100 pt-3 mt-2">
                  <span>{tc.total}</span>
                  <span className="text-primary">{total().toFixed(2)} MAD</span>
                </div>
              </div>

              {/* Order buttons per seller */}
              <div className="space-y-2">
                {Object.entries(grouped).map(([whatsapp, sellerItems]) =>
                  whatsapp !== "no-whatsapp" ? (
                    <button
                      key={whatsapp}
                      onClick={() => handleOrderBySeller(whatsapp, sellerItems)}
                      className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-md shadow-green-900/20 text-sm"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="truncate">{tc.order_via} {sellerItems[0].sellerName}</span>
                    </button>
                  ) : null
                )}
              </div>

              <button
                onClick={clear}
                className="w-full mt-4 text-sm text-red-400 hover:text-red-600 transition-colors py-2 hover:bg-red-50 rounded-xl"
              >
                {tc.clear}
              </button>
            </motion.div>

            {/* WhatsApp note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4"
            >
              <div className="flex gap-3 text-green-700">
                <MessageCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{tc.whatsapp_title}</p>
                  <p className="text-xs text-green-600 mt-1 leading-relaxed">{tc.whatsapp_note}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
