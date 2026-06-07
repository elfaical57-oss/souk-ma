"use client";

import { useEffect, useState } from "react";
import { Store, Search, BadgeCheck, MapPin, Phone, Trash2, Ban, CheckCircle, Plus, X, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

interface Seller {
  id: string;
  businessName: string;
  city: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  whatsapp?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    city?: string;
    createdAt: string;
    isBlocked: boolean;
    _count: { products: number };
  };
}

function AddSellerModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "123456", city: "", businessName: "", whatsapp: "", description: "" });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let logoUrl = "";
      if (logoFile && logoPreview) {
        const res = await api.post("/upload", { data: logoPreview, folder: "sellers" });
        logoUrl = res.data.url;
      }
      await api.post("/auth/register", { ...form, role: "SELLER", logo: logoUrl || undefined });
      onAdded();
      onClose();
    } catch {
      setError("Erreur lors de la création du vendeur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Ajouter un vendeur</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Logo upload */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Photo de profil</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview
                  ? <Image src={logoPreview} alt="logo" width={64} height={64} className="w-full h-full object-cover" />
                  : <Camera className="w-6 h-6 text-gray-500" />
                }
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 text-sm text-center transition-colors">
                  {logoPreview ? "Changer l'image" : "Choisir une image"}
                </div>
                <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nom complet</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" placeholder="Mohamed Ali" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Ville</label>
              <input value={form.city} onChange={e => set("city", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" placeholder="Casablanca" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Téléphone</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} required type="tel"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" placeholder="0612345678" dir="ltr" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Nom de la boutique</label>
            <input value={form.businessName} onChange={e => set("businessName", e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" placeholder="Alami Store" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Description / Présentation</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Décrivez la boutique, ses produits, ses spécialités..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">WhatsApp Business</label>
            <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} type="tel"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" placeholder="0612345678" dir="ltr" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Mot de passe temporaire</label>
            <input value={form.password} onChange={e => set("password", e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 mt-2">
            {loading ? "Création en cours..." : "Créer le vendeur"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/admin/sellers").then(r => setSellers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleVerify = async (userId: string, current: boolean) => {
    await api.patch(`/admin/sellers/${userId}/verify`, { verified: !current });
    setSellers(s => s.map(x => x.user.id === userId ? { ...x, verified: !current } : x));
  };

  const toggleBlock = async (userId: string, current: boolean) => {
    const action = current ? "débloquer" : "bloquer";
    if (!confirm(`Voulez-vous ${action} ce vendeur ?`)) return;
    await api.patch(`/admin/sellers/${userId}/block`, { blocked: !current });
    setSellers(s => s.map(x => x.user.id === userId ? { ...x, user: { ...x.user, isBlocked: !current } } : x));
  };

  const deleteSeller = async (userId: string, name: string) => {
    if (!confirm(`Supprimer la boutique de "${name}" ? Tous ses produits seront supprimés.`)) return;
    await api.delete(`/admin/sellers/${userId}`);
    setSellers(s => s.filter(x => x.user.id !== userId));
  };

  const filtered = sellers.filter(s => {
    const match = s.businessName.toLowerCase().includes(search.toLowerCase()) || s.user.phone.includes(search) || s.user.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "VERIFIED")   return match && s.verified;
    if (filter === "UNVERIFIED") return match && !s.verified;
    if (filter === "BLOCKED")    return match && s.user.isBlocked;
    return match;
  });

  return (
    <div className="p-8">
      {showAdd && <AddSellerModal onClose={() => setShowAdd(false)} onAdded={load} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Store className="w-6 h-6" /> Vendeurs</h1>
          <p className="text-gray-400 text-sm mt-1">
            {sellers.length} vendeurs · {sellers.filter(s => s.verified).length} vérifiés · {sellers.filter(s => s.user.isBlocked).length} bloqués
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Ajouter un vendeur
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Rechercher nom, boutique ou téléphone..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[["ALL","Tous"],["VERIFIED","Vérifiés"],["UNVERIFIED","Non vérifiés"],["BLOCKED","Bloqués"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${filter === v ? "bg-primary text-white border-primary" : "bg-gray-900 text-gray-400 border-gray-700 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-52 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Store className="w-10 h-10 mx-auto mb-2 text-gray-700" />
          <p>Aucun vendeur trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id}
              className={`bg-gray-900 border rounded-2xl p-5 transition-colors ${s.user.isBlocked ? "border-red-500/30 bg-red-500/5" : "border-gray-800 hover:border-gray-700"}`}>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg overflow-hidden shrink-0 ${s.user.isBlocked ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>
                    {(s as any).logo
                      ? <Image src={(s as any).logo} alt={s.businessName} width={48} height={48} className="w-full h-full object-cover" />
                      : s.businessName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-white font-semibold">{s.businessName}</p>
                      {s.verified && <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />}
                      {s.user.isBlocked && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-medium">Bloqué</span>}
                    </div>
                    <p className="text-gray-400 text-xs">{s.user.name}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-white font-bold">{s.user._count.products}</p>
                  <p className="text-gray-400 text-xs">Produits</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-white font-bold">{s.totalSales}</p>
                  <p className="text-gray-400 text-xs">Ventes</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-white font-bold">{s.rating > 0 ? s.rating.toFixed(1) : "—"}</p>
                  <p className="text-gray-400 text-xs">Note</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1 text-xs text-gray-400 mb-4">
                <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{s.user.phone}</p>
                {s.city && <p className="flex items-center gap-2"><MapPin className="w-3 h-3" />{s.city}</p>}
                <p className="text-gray-500">Inscrit le {new Date(s.user.createdAt).toLocaleDateString("fr-MA")}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                {/* Verify */}
                <button onClick={() => toggleVerify(s.user.id, s.verified)}
                  title={s.verified ? "Retirer vérification" : "Vérifier"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex-1 justify-center ${
                    s.verified
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:opacity-70"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30"
                  }`}>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {s.verified ? "Vérifié" : "Vérifier"}
                </button>

                {/* Block */}
                <button onClick={() => toggleBlock(s.user.id, s.user.isBlocked)}
                  title={s.user.isBlocked ? "Débloquer" : "Bloquer"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex-1 justify-center ${
                    s.user.isBlocked
                      ? "bg-green-500/20 text-green-400 border-green-500/30 hover:opacity-70"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30"
                  }`}>
                  {s.user.isBlocked ? <><CheckCircle className="w-3.5 h-3.5" /> Débloquer</> : <><Ban className="w-3.5 h-3.5" /> Bloquer</>}
                </button>

                {/* Delete */}
                <button onClick={() => deleteSeller(s.user.id, s.businessName)}
                  title="Supprimer la boutique"
                  className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 border border-gray-800 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* View */}
                <Link href={`/sellers/${s.user.id}`} target="_blank"
                  className="text-xs text-primary hover:underline px-2 whitespace-nowrap">
                  Voir →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
