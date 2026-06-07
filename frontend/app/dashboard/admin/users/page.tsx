"use client";

import { useEffect, useState } from "react";
import { Users, Search, Trash2, ShieldCheck, MapPin, Phone } from "lucide-react";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  phone: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  city?: string;
  createdAt: string;
  sellerProfile?: { businessName: string; verified: boolean };
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN:  "bg-red-500/20 text-red-400 border-red-500/30",
  SELLER: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  BUYER:  "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function AdminUsers() {
  const [users, setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api.get("/admin/users").then((r) => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  const changeRole = async (id: string, role: string) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    setUsers((u) => u.map((x) => x.id === id ? { ...x, role: role as User["role"] } : x));
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'utilisateur "${name}" ?`)) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchRole   = filter === "ALL" || u.role === filter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="w-6 h-6" /> Utilisateurs</h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} utilisateurs au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "BUYER", "SELLER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                filter === r ? "bg-primary text-white border-primary" : "bg-gray-900 text-gray-400 border-gray-700 hover:text-white"
              }`}
            >
              {r === "ALL" ? "Tous" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Utilisateur</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Téléphone</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Ville</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Rôle</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden lg:table-cell">Inscrit le</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-5 py-4" colSpan={6}>
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-full" />
                </td>
              </tr>
            )) : filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.name}</p>
                      {u.sellerProfile && <p className="text-xs text-orange-400">{u.sellerProfile.businessName}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone}</span>
                </td>
                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">
                  {u.city ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{u.city}</span> : "—"}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border bg-transparent cursor-pointer focus:outline-none ${ROLE_COLORS[u.role]}`}
                  >
                    <option value="BUYER">BUYER</option>
                    <option value="SELLER">SELLER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(u.createdAt).toLocaleDateString("fr-MA")}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => deleteUser(u.id, u.name)}
                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
