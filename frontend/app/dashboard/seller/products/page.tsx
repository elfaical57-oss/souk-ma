"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Package } from "lucide-react";
import api from "@/lib/api";

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  isActive: boolean;
  images: string[];
  views: number;
  category?: { nameFr: string };
  createdAt: string;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/sellers/my-products")
      .then((r) => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes Produits</h1>
          <p className="text-sm text-gray-500">{products.length} produit(s)</p>
        </div>
        <Link href="/dashboard/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium mb-1">Aucun produit</p>
          <p className="text-sm mb-4">Ajoutez votre premier produit pour commencer à vendre</p>
          <Link href="/dashboard/seller/products/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Produit</th>
                <th className="text-left p-4 font-medium text-gray-600">Catégorie</th>
                <th className="text-right p-4 font-medium text-gray-600">Prix</th>
                <th className="text-right p-4 font-medium text-gray-600">Stock</th>
                <th className="text-right p-4 font-medium text-gray-600">Vues</th>
                <th className="text-right p-4 font-medium text-gray-600">Statut</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium truncate max-w-[200px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{p.category?.nameFr || "—"}</td>
                  <td className="p-4 text-right font-semibold">{p.price.toFixed(2)} MAD</td>
                  <td className="p-4 text-right">
                    <span className={p.stock < 5 ? "text-red-600 font-medium" : ""}>{p.stock}</span>
                  </td>
                  <td className="p-4 text-right text-gray-500">{p.views}</td>
                  <td className="p-4 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/products/${p.id}`} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/seller/products/${p.id}/edit`} className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
