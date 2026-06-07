"use client";

import { useEffect, useState } from "react";
import { Camera, Save } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/lib/stores/authStore";

export default function SellerProfilePage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    businessName: "",
    description: "",
    city: "",
    whatsapp: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/sellers/${user?.id}`).then(r => {
      const s = r.data;
      setForm({
        businessName: s.businessName || "",
        description: s.description || "",
        city: s.city || "",
        whatsapp: s.whatsapp || "",
      });
      if (s.logo) setLogoPreview(s.logo);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user?.id]);

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
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      let logoUrl = logoPreview.startsWith("data:") ? "" : logoPreview;
      if (logoFile && logoPreview.startsWith("data:")) {
        const res = await api.post("/upload", { data: logoPreview, folder: "sellers" });
        logoUrl = res.data.url;
      }
      await api.put("/sellers/profile", { ...form, logo: logoUrl || undefined });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="container py-8">
      <div className="max-w-xl animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-2">Mon profil boutique</h1>
        <p className="text-gray-500 text-sm mb-8">Ces informations sont visibles par les acheteurs</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div className="card p-6">
            <label className="block text-sm font-semibold mb-4">Photo de profil</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                  : <Camera className="w-8 h-8 text-gray-400" />}
              </div>
              <div>
                <label className="cursor-pointer">
                  <div className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl">
                    <Camera className="w-4 h-4" />
                    {logoPreview ? "Changer la photo" : "Ajouter une photo"}
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                </label>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG — max 5MB</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nom de la boutique</label>
              <input value={form.businessName} onChange={e => set("businessName", e.target.value)} required
                className="input w-full" placeholder="Ex: Alami Store" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Description / Présentation</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4}
                className="input w-full resize-none"
                placeholder="Décrivez votre boutique, vos produits, vos spécialités..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ville</label>
                <input value={form.city} onChange={e => set("city", e.target.value)}
                  className="input w-full" placeholder="Casablanca" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">WhatsApp Business</label>
                <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} type="tel"
                  className="input w-full" placeholder="0612345678" dir="ltr" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              Profil mis à jour avec succès !
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" />
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
