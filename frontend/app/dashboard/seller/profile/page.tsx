"use client";

import { useEffect, useState } from "react";
import { Camera, ImagePlus, Save } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/lib/stores/authStore";
import { uploadImageToImgBB } from "@/lib/compressImage";

export default function SellerProfilePage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({ businessName: "", description: "", city: "", whatsapp: "" });
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
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
      if (s.banner) setBannerPreview(s.banner);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user?.id]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      let logoUrl = logoPreview;
      let bannerUrl = bannerPreview;

      if (logoFile) {
        logoUrl = await uploadImageToImgBB(logoFile, 800);
        setLogoPreview(logoUrl);
        setLogoFile(null);
      }
      if (bannerFile) {
        bannerUrl = await uploadImageToImgBB(bannerFile, 1600);
        setBannerPreview(bannerUrl);
        setBannerFile(null);
      }

      await api.put("/sellers/profile", {
        ...form,
        logo: logoUrl || undefined,
        banner: bannerUrl || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "";
      setError(msg.includes("ImgBB") ? "Erreur upload image — réessayez" : "Erreur lors de la sauvegarde");
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

          {/* Banner */}
          <div className="card overflow-hidden">
            <label className="block cursor-pointer group">
              <div className="relative h-36 bg-gradient-to-r from-blue-900 to-blue-600 overflow-hidden">
                {bannerPreview
                  ? <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
                  : null}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImagePlus className="w-8 h-8 text-white" />
                  <span className="text-white text-sm font-medium">
                    {bannerPreview ? "Changer la bannière" : "Ajouter une bannière"}
                  </span>
                </div>
                {!bannerPreview && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-1 text-white/60">
                      <ImagePlus className="w-8 h-8" />
                      <span className="text-sm">Photo de couverture</span>
                    </div>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleBanner} className="hidden" />
            </label>
            <div className="p-4">
              <p className="text-xs text-gray-400">Cliquez sur la bannière pour changer la photo de couverture — recommandé : 1600×400px</p>
            </div>
          </div>

          {/* Logo */}
          <div className="card p-6">
            <p className="text-sm font-semibold mb-4">Photo de profil</p>
            <label className="flex items-center gap-6 cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary overflow-hidden flex items-center justify-center shrink-0 transition-colors">
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                  : <Camera className="w-8 h-8 text-gray-400" />}
              </div>
              <div>
                <div className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl">
                  <Camera className="w-4 h-4" />
                  {logoPreview ? "Changer la photo" : "Ajouter une photo"}
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG — max 5MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
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
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
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
