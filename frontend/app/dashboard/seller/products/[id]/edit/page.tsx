"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Save, Trash2, Upload, ImageIcon, Tag,
  MapPin, Package, AlertCircle, Plus, X,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Category { id: string; nameFr: string; slug: string; icon?: string; }
interface Variation { name: string; options: string[]; }

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Safi", "El Jadida",
];

const CAT_ICONS: Record<string, string> = {
  electronics: "💻", fashion: "👗", home: "🏠", food: "🍎",
  auto: "🚗", handicraft: "🏺", construction: "🧱", agriculture: "🌿",
};

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0f2849] focus:ring-2 focus:ring-[#0f2849]/10 outline-none transition text-sm bg-white";

const MAX = 900;
function compressImage(file: File): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.70));
    };
    img.src = url;
  });
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", price: "", minOrderQty: "1",
    stock: "", categoryId: "", city: "", tags: "",
    images: [] as string[], isActive: true,
  });
  const [variations, setVariations]       = useState<Variation[]>([]);
  const [newVarName, setNewVarName]       = useState("");
  const [newVarOption, setNewVarOption]   = useState<Record<number, string>>({});

  useEffect(() => {
    Promise.all([
      api.get(`/products/${productId}`),
      api.get("/categories"),
    ]).then(([pRes, cRes]) => {
      const p = pRes.data;
      setForm({
        title:       p.title        ?? "",
        description: p.description  ?? "",
        price:       p.price?.toString() ?? "",
        minOrderQty: p.minOrderQty?.toString() ?? "1",
        stock:       p.stock?.toString() ?? "0",
        categoryId:  p.categoryId   ?? p.category?.id ?? "",
        city:        p.city         ?? "",
        tags:        (p.tags ?? []).join(", "),
        images:      p.images       ?? [],
        isActive:    p.isActive     ?? true,
      });
      if (Array.isArray(p.variations)) setVariations(p.variations);
      setCategories(cRes.data);
    }).catch(() => setError("Impossible de charger le produit")).finally(() => setLoading(false));
  }, [productId]);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 8 - form.images.length);
    if (!arr.length) return;
    setUploading(true);
    try {
      const compressed = await Promise.all(arr.map(compressImage));
      setForm(f => ({ ...f, images: [...f.images, ...compressed] }));
    } catch { setError("Erreur image"); }
    finally { setUploading(false); }
  }, [form.images.length]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length) await addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) { setError("Ajoutez au moins une image"); return; }
    if (!form.categoryId) { setError("Choisissez une catégorie"); return; }
    setSaving(true); setError("");
    try {
      await api.put(`/products/${productId}`, {
        title:       form.title,
        description: form.description,
        price:       parseFloat(form.price),
        minOrderQty: parseInt(form.minOrderQty) || 1,
        stock:       parseInt(form.stock) || 0,
        categoryId:  form.categoryId,
        city:        form.city || undefined,
        images:      form.images,
        tags:        form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        isActive:    form.isActive,
        variations:  variations.filter(v => v.options.length > 0),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/seller/products"), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="container py-8 max-w-3xl animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48" />
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard/seller/products" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">
              Modifier : {form.title || "Produit"}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">Les modifications seront visibles immédiatement</p>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <span className="text-gray-600">Actif</span>
            <div
              onClick={() => set("isActive", !form.isActive)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-1"}`} />
            </div>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
            ✅ Produit mis à jour — redirection…
          </div>
        )}

        {/* ── Informations ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-gray-900 text-sm">Informations du produit</h2>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Titre <span className="text-red-400">*</span></label>
            <input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="Titre du produit" required maxLength={80} />
            <p className="text-[11px] text-gray-400 mt-1">{form.title.length}/80</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description <span className="text-red-400">*</span></label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} className={`${inputCls} min-h-[120px] resize-none`} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5"><MapPin className="w-3 h-3 inline mr-1 text-gray-400" />Ville</label>
            <select value={form.city} onChange={e => set("city", e.target.value)} className={inputCls}>
              <option value="">Toutes les villes</option>
              {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* ── Prix & stock ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600 font-black text-xs bg-green-50 rounded-lg px-2 py-0.5">MAD</span>
            <h2 className="font-semibold text-gray-900 text-sm">Prix & stock</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Prix (MAD) <span className="text-red-400">*</span></label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)} className={inputCls} placeholder="0.00" required min="0" step="0.01" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">MOQ</label>
              <input type="number" value={form.minOrderQty} onChange={e => set("minOrderQty", e.target.value)} className={inputCls} min="1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Stock <span className="text-red-400">*</span></label>
              <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} className={inputCls} placeholder="0" required min="0" />
            </div>
          </div>

          {/* Variations */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-semibold text-gray-600">Variantes</label>
              <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">Optionnel</span>
            </div>
            {variations.map((v, vi) => (
              <div key={vi} className="bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{v.name}</span>
                  <button type="button" onClick={() => setVariations(vs => vs.filter((_, i) => i !== vi))} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {v.options.map((opt, oi) => (
                    <span key={oi} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                      {opt}
                      <button type="button" onClick={() => setVariations(vs => vs.map((vv, i) => i === vi ? { ...vv, options: vv.options.filter((_, j) => j !== oi) } : vv))} className="text-gray-400 hover:text-red-500">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={newVarOption[vi] || ""}
                    onChange={e => setNewVarOption(s => ({ ...s, [vi]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (newVarOption[vi] || "").trim();
                        if (val) { setVariations(vs => vs.map((vv, i) => i === vi ? { ...vv, options: [...vv.options, val] } : vv)); setNewVarOption(s => ({ ...s, [vi]: "" })); }
                      }
                    }}
                    placeholder="Ajouter une option…" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#0f2849] bg-white"
                  />
                  <button type="button" onClick={() => { const val = (newVarOption[vi] || "").trim(); if (val) { setVariations(vs => vs.map((vv, i) => i === vi ? { ...vv, options: [...vv.options, val] } : vv)); setNewVarOption(s => ({ ...s, [vi]: "" })); } }} className="px-3 py-1.5 bg-[#0f2849] text-white rounded-lg text-xs font-medium hover:bg-[#1a3a6b]">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input type="text" value={newVarName} onChange={e => setNewVarName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const val = newVarName.trim(); if (val) { setVariations(vs => [...vs, { name: val, options: [] }]); setNewVarName(""); } } }}
                placeholder="Nom de la variante (Taille, Couleur…)" className={`${inputCls} flex-1`} />
              <button type="button" onClick={() => { const val = newVarName.trim(); if (val) { setVariations(vs => [...vs, { name: val, options: [] }]); setNewVarName(""); } }}
                className="px-4 py-2.5 bg-[#0f2849] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3a6b] flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Taille","Couleur","Poids","Matière"].map(s => (
                <button key={s} type="button" onClick={() => { if (!variations.find(v => v.name === s)) setVariations(vs => [...vs, { name: s, options: [] }]); }}
                  className="text-xs text-[#0f2849] border border-[#0f2849]/20 bg-[#0f2849]/5 hover:bg-[#0f2849]/10 px-2.5 py-1 rounded-full transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Photos ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <h2 className="font-semibold text-gray-900 text-sm">Photos ({form.images.length}/8)</h2>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); !uploading && setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={uploading ? undefined : handleDrop}
            onClick={() => !uploading && form.images.length < 8 && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer select-none ${uploading || form.images.length >= 8 ? "opacity-60 cursor-not-allowed border-gray-200" : isDragging ? "border-[#0f2849] bg-[#0f2849]/5" : "border-gray-200 hover:border-[#0f2849]/50 hover:bg-gray-50"}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
            {uploading ? (
              <><div className="w-8 h-8 border-2 border-[#0f2849] border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-sm text-gray-500">Compression…</p></>
            ) : (
              <><Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-[#0f2849]" : "text-gray-300"}`} /><p className="text-sm text-gray-500">{form.images.length >= 8 ? "Maximum atteint" : "Glissez ou cliquez pour ajouter"}</p></>
            )}
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" />
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-[#0f2849] text-white px-1.5 py-0.5 rounded-full">Principale</span>}
                  <button type="button" onClick={e => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Catégorie & tags ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-orange-500" />
            <h2 className="font-semibold text-gray-900 text-sm">Catégorie & tags</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(c => (
              <button key={c.id} type="button" onClick={() => set("categoryId", c.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs transition-all ${form.categoryId === c.id ? "border-[#0f2849] bg-[#0f2849]/5 text-[#0f2849]" : "border-gray-100 hover:border-gray-200 text-gray-600"}`}>
                <span className="text-2xl">{c.icon || CAT_ICONS[c.slug] || "📦"}</span>
                <span className="font-medium text-center leading-tight">{c.nameFr}</span>
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Mots-clés (séparés par virgule)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)} className={inputCls} placeholder="bio, marocain, gros…" />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pb-4">
          <Link href="/dashboard/seller/products" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Annuler
          </Link>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-orange-400 text-[#0f2849] font-bold text-sm transition-colors disabled:opacity-50 shadow-lg shadow-orange-900/20">
            {saving ? <><div className="w-4 h-4 border-2 border-[#0f2849] border-t-transparent rounded-full animate-spin" /> Sauvegarde…</> : <><Save className="w-4 h-4" /> Enregistrer les modifications</>}
          </button>
        </div>
      </form>
    </div>
  );
}
