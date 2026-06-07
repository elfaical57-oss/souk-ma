"use client";

import { useEffect, useState } from "react";
import { Package, Search, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  isActive: boolean;
  views: number;
  images: string[];
  createdAt: string;
  seller: { id: string; name: string };
  category: { nameFr: string };
}

export default function AdminProducts() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("ALL");

  useEffect(() => {
    api.get("/admin/products").then((r) => setProducts(r.data)).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string) => {
    const res = await api.patch(`/admin/products/${id}/toggle`);
    setProducts((p) => p.map((x) => x.id === id ? { ...x, isActive: res.data.isActive } : x));
  };

  const deleteProduct = async (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    await api.delete(`/admin/products/${id}`);
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  const filtered = products.filter((p) => {
    const match = p.title.toLowerCase().includes(search.toLowerCase()) || p.seller.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "ACTIVE") return match && p.isActive;
    if (filter === "INACTIVE") return match && !p.isActive;
    return match;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Package className="w-6 h-6" /> Produits</h1>
        <p className="text-gray-400 text-sm mt-1">{products.length} produits · {products.filter(p => p.isActive).length} actifs</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un produit ou vendeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {[["ALL","Tous"],["ACTIVE","Actifs"],["INACTIVE","Inactifs"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${filter === v ? "bg-primary text-white border-primary" : "bg-gray-900 text-gray-400 border-gray-700 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Produit</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Vendeur</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Catégorie</th>
              <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Prix</th>
              <th className="text-right px-5 py-3.5 text-gray-400 font-medium hidden lg:table-cell">Stock</th>
              <th className="text-right px-5 py-3.5 text-gray-400 font-medium hidden lg:table-cell">Vues</th>
              <th className="text-center px-5 py-3.5 text-gray-400 font-medium">Statut</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="px-5 py-4" colSpan={8}><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>
              </tr>
            )) : filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    <span className="text-white font-medium truncate max-w-[180px]">{p.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">{p.seller.name}</td>
                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">{p.category.nameFr}</td>
                <td className="px-5 py-4 text-white font-bold text-right">{p.price.toFixed(0)} MAD</td>
                <td className={`px-5 py-4 text-right hidden lg:table-cell ${p.stock < 5 ? "text-red-400" : "text-gray-400"}`}>{p.stock}</td>
                <td className="px-5 py-4 text-gray-400 text-right hidden lg:table-cell">{p.views}</td>
                <td className="px-5 py-4 text-center">
                  <button onClick={() => toggleActive(p.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-colors ${
                      p.isActive
                        ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                        : "bg-gray-800 text-gray-500 border-gray-700 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30"
                    }`}>
                    {p.isActive ? "Actif" : "Inactif"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/products/${p.id}`} target="_blank"
                      className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteProduct(p.id, p.title)}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
