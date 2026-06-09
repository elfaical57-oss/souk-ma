"use client";

import { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2, ArrowLeft, ArrowRight, Upload, CheckCircle2, Circle,
  ImageIcon, Tag, MapPin, Package, Sparkles, Info,
  AlertCircle, Check, Star, Plus, X,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import useAuthStore from "@/lib/stores/authStore";

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  icon?: string;
}

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Safi", "El Jadida",
];

const STEPS = [
  { id: 1, label: "Informations produit" },
  { id: 2, label: "Prix & stock" },
  { id: 3, label: "Photos produit" },
  { id: 4, label: "Publication" },
];

const CAT_ICONS: Record<string, string> = {
  electronics: "💻", fashion: "👗", home: "🏠", food: "🍎",
  auto: "🚗", handicraft: "🏺", construction: "🧱", agriculture: "🌿",
};

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0f2849] focus:ring-2 focus:ring-[#0f2849]/10 outline-none transition text-sm bg-white";

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    minOrderQty: "1",
    stock: "",
    categoryId: "",
    city: "",
    tags: "",
    images: [] as string[],
  });
  const [variations, setVariations] = useState<{ name: string; options: string[] }[]>([]);
  const [newVarName, setNewVarName] = useState("");
  const [newVarOption, setNewVarOption] = useState<Record<number, string>>({});

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(console.error);
  }, []);

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const checks = [
    { label: "Titre du produit",  done: form.title.length >= 3 },
    { label: "Description",       done: form.description.length >= 20 },
    { label: "Prix défini",       done: !!form.price && parseFloat(form.price) > 0 },
    { label: "3 photos minimum",  done: form.images.length >= 3 },
    { label: "Catégorie choisie", done: !!form.categoryId },
    { label: "MOQ attractif",     done: parseInt(form.minOrderQty) >= 1 },
  ];
  const progress = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 900;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL("image/jpeg", 0.70));
      };
      img.src = objectUrl;
    });

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).slice(0, 8 - form.images.length);
      if (!arr.length) return;
      setUploading(true);
      setError("");
      try {
        const compressed = await Promise.all(arr.map(compressImage));
        setForm((f) => ({ ...f, images: [...f.images, ...compressed] }));
      } catch {
        setError("Erreur lors du traitement de l'image. Vérifiez le format et réessayez.");
      } finally {
        setUploading(false);
      }
    },
    [form.images.length],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) await addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const canNext = () => {
    if (step === 1) return form.title.length >= 3 && form.description.length >= 10;
    if (step === 2) return !!form.price && parseFloat(form.price) > 0 && !!form.stock;
    if (step === 3) return form.images.length > 0;
    if (step === 4) return !!form.categoryId;
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    if (form.images.length === 0) { setError("Ajoutez au moins une image"); return; }
    if (!form.categoryId) { setError("Choisissez une catégorie"); return; }

    setLoading(true);
    try {
      await api.post("/products", {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        minOrderQty: parseInt(form.minOrderQty) || 1,
        stock: parseInt(form.stock) || 0,
        categoryId: form.categoryId,
        city: form.city || undefined,
        images: form.images,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        variations: variations.filter(v => v.options.length > 0),
      });
      router.push("/dashboard/seller/products");
    } catch (err: unknown) {
      const e = err as any;
      const fieldErrors = e?.response?.data?.errors?.fieldErrors;
      const serverMsg = e?.response?.data?.message;
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        setError(Object.values(fieldErrors).flat().join(", "));
      } else if (serverMsg) {
        setError(serverMsg);
      } else {
        setError(`Erreur ${e?.response?.status ?? "réseau"} — vérifiez tous les champs et réessayez.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky page header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/seller/products"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Ajouter un nouveau produit</h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Publiez votre produit et commencez à recevoir des acheteurs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Boutique active
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Stepper ── */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <Fragment key={s.id}>
              <button
                type="button"
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-2 ${step > s.id ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  step > s.id
                    ? "bg-green-500 text-white"
                    : step === s.id
                    ? "bg-[#0f2849] text-white ring-4 ring-[#0f2849]/20"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-sm font-medium hidden sm:block whitespace-nowrap ${
                  step === s.id ? "text-[#0f2849]" : step > s.id ? "text-green-600" : "text-gray-400"
                }`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 min-w-[16px] transition-colors ${step > s.id ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main form column ── */}
          <div className="lg:col-span-2 space-y-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* STEP 1 — Informations produit */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Informations du produit</h2>
                    <p className="text-xs text-gray-400">Un bon titre et une description claire augmentent les ventes</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    Titre du produit <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className={inputCls}
                    placeholder="Ex : Huile d'olive vierge extra Meknès 5L"
                    required
                    maxLength={80}
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    {form.title.length}/80 caractères · Soyez précis et descriptif
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className={`${inputCls} min-h-[140px] resize-none`}
                    placeholder="Exemple : Huile d'olive vierge extra produite à Meknès. Disponible en gros, livraison partout au Maroc. Idéale pour les épiceries, restaurants et distributeurs."
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    {form.description.length} caractères
                    {form.description.length < 10 && " · Minimum 10 caractères"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    Ville de livraison
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Toutes les villes du Maroc</option>
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2 — Prix & stock */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-green-600 font-black text-xs">MAD</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Prix & stock</h2>
                    <p className="text-xs text-gray-400">Des prix compétitifs en gros attirent plus d'acheteurs B2B</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                      Prix unitaire (MAD) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setField("price", e.target.value)}
                        className={`${inputCls} pr-14`}
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                        MAD
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Prix pour une unité</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                      Qté min. (MOQ)
                    </label>
                    <input
                      type="number"
                      value={form.minOrderQty}
                      onChange={(e) => setField("minOrderQty", e.target.value)}
                      className={inputCls}
                      min="1"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Minimum à acheter</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                      Stock disponible <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setField("stock", e.target.value)}
                      className={inputCls}
                      placeholder="0"
                      required
                      min="0"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Nombre disponible</p>
                  </div>
                </div>

                {form.price && parseFloat(form.price) > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-700">
                      Prix affiché :{" "}
                      <strong>{parseFloat(form.price).toFixed(2)} MAD</strong> / unité ·
                      Commande min. <strong>{form.minOrderQty || 1}</strong> unité(s) ·
                      Stock : <strong>{form.stock || 0}</strong>
                    </p>
                  </div>
                )}

                {/* Variations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-sm font-semibold text-gray-700">Variantes du produit</label>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">Optionnel</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Ajoutez des variantes si votre produit existe en plusieurs tailles, couleurs, etc.</p>

                  {/* Existing variation groups */}
                  {variations.map((v, vi) => (
                    <div key={vi} className="bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{v.name}</span>
                        <button type="button" onClick={() => setVariations(vs => vs.filter((_, i) => i !== vi))}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {v.options.map((opt, oi) => (
                          <span key={oi} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                            {opt}
                            <button type="button"
                              onClick={() => setVariations(vs => vs.map((vv, i) => i === vi ? { ...vv, options: vv.options.filter((_, j) => j !== oi) } : vv))}
                              className="text-gray-400 hover:text-red-500 transition-colors">
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newVarOption[vi] || ""}
                          onChange={e => setNewVarOption(s => ({ ...s, [vi]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = (newVarOption[vi] || "").trim();
                              if (val) {
                                setVariations(vs => vs.map((vv, i) => i === vi ? { ...vv, options: [...vv.options, val] } : vv));
                                setNewVarOption(s => ({ ...s, [vi]: "" }));
                              }
                            }
                          }}
                          placeholder="Ajouter une option..."
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#0f2849] bg-white"
                        />
                        <button type="button"
                          onClick={() => {
                            const val = (newVarOption[vi] || "").trim();
                            if (val) {
                              setVariations(vs => vs.map((vv, i) => i === vi ? { ...vv, options: [...vv.options, val] } : vv));
                              setNewVarOption(s => ({ ...s, [vi]: "" }));
                            }
                          }}
                          className="px-3 py-1.5 bg-[#0f2849] text-white rounded-lg text-xs font-medium hover:bg-[#1a3a6b] transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add new variation group */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newVarName}
                      onChange={e => setNewVarName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = newVarName.trim();
                          if (val) { setVariations(vs => [...vs, { name: val, options: [] }]); setNewVarName(""); }
                        }
                      }}
                      placeholder="Nom de la variante (ex: Taille, Couleur)"
                      className={`${inputCls} flex-1 text-sm`}
                    />
                    <button type="button"
                      onClick={() => {
                        const val = newVarName.trim();
                        if (val) { setVariations(vs => [...vs, { name: val, options: [] }]); setNewVarName(""); }
                      }}
                      className="px-4 py-2.5 bg-[#0f2849] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3a6b] transition-colors flex items-center gap-1.5 shrink-0">
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["Taille", "Couleur", "Poids", "Matière"].map(s => (
                      <button key={s} type="button"
                        onClick={() => { if (!variations.find(v => v.name === s)) setVariations(vs => [...vs, { name: s, options: [] }]); }}
                        className="text-xs text-[#0f2849] border border-[#0f2849]/20 bg-[#0f2849]/5 hover:bg-[#0f2849]/10 px-2.5 py-1 rounded-full transition-colors">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Photos */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Photos du produit</h2>
                    <p className="text-xs text-gray-400">Les produits avec 3+ photos vendent 3× plus</p>
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); !uploading && setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={uploading ? undefined : handleDrop}
                  onClick={() => !uploading && form.images.length < 8 && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all select-none ${
                    uploading || form.images.length >= 8
                      ? "opacity-60 cursor-not-allowed border-gray-200"
                      : isDragging
                      ? "border-[#0f2849] bg-[#0f2849]/5 scale-[1.005] cursor-copy"
                      : "border-gray-200 hover:border-[#0f2849]/50 hover:bg-gray-50/80 cursor-pointer"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                  {uploading ? (
                    <>
                      <div className="w-10 h-10 border-2 border-[#0f2849] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="font-semibold text-gray-700 mb-1">Téléchargement en cours…</p>
                      <p className="text-sm text-gray-400">Veuillez patienter</p>
                    </>
                  ) : (
                    <>
                      <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? "text-[#0f2849]" : "text-gray-300"}`} />
                      <p className="font-semibold text-gray-700 mb-1">
                        {form.images.length >= 8 ? "Maximum atteint (8 photos)" : "Glissez vos photos ici"}
                      </p>
                      <p className="text-sm text-gray-400 mb-3">ou cliquez pour sélectionner depuis votre appareil</p>
                      <p className="text-xs text-gray-400">
                        Ajoutez jusqu'à {8 - form.images.length} photo(s) · JPG, PNG, WebP
                      </p>
                    </>
                  )}
                </div>

                {/* Photo tips */}
                <div className="flex flex-wrap gap-2">
                  {["✅ Bonne lumière", "✅ Fond propre", "✅ Plusieurs angles"].map((t) => (
                    <span key={t} className="bg-gray-50 border border-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Previews */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover rounded-xl border border-gray-100"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-[#0f2849] text-white px-2 py-0.5 rounded-full font-medium leading-tight">
                            Principale
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-center text-gray-400">
                  {form.images.length}/8 photos ·{" "}
                  {form.images.length < 3
                    ? `Ajoutez ${3 - form.images.length} photo(s) de plus pour un meilleur résultat`
                    : "Parfait !"}
                </p>
              </div>
            )}

            {/* STEP 4 — Publication */}
            {step === 4 && (
              <div className="space-y-4">
                {/* Category cards */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Catégorie <span className="text-red-400">*</span>
                      </h2>
                      <p className="text-xs text-gray-400">Choisissez la catégorie la plus pertinente</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setField("categoryId", c.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all ${
                          form.categoryId === c.id
                            ? "border-[#0f2849] bg-[#0f2849]/5 text-[#0f2849] shadow-sm"
                            : "border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-2xl">{c.icon || CAT_ICONS[c.slug] || "📦"}</span>
                        <span className="text-xs text-center leading-tight font-medium">{c.nameFr}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    <Tag className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    Mots-clés (tags)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setField("tags", e.target.value)}
                    className={inputCls}
                    placeholder="Ex : bio, marocain, huile, gros, livraison"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Séparés par des virgules · Augmentent la visibilité dans les recherches
                  </p>
                </div>

                {/* Summary card */}
                <div className="bg-gradient-to-br from-[#0f2849] to-[#1a3a6b] rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold">Résumé avant publication</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Titre</p>
                      <p className="font-medium truncate">{form.title || "—"}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Prix</p>
                      <p className="font-medium">
                        {form.price ? `${parseFloat(form.price).toFixed(2)} MAD` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Stock</p>
                      <p className="font-medium">{form.stock || "0"} unités</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Photos</p>
                      <p className="font-medium">{form.images.length} photo(s)</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">MOQ</p>
                      <p className="font-medium">{form.minOrderQty} unité(s)</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Ville</p>
                      <p className="font-medium">{form.city || "Toutes"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className="flex items-center gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
              )}
              <div className="flex-1" />
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => canNext() && setStep((s) => s + 1)}
                  disabled={!canNext() || uploading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0f2849] text-white font-semibold text-sm hover:bg-[#1a3a6b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <button
                    type="button"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    💾 Sauvegarder brouillon
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !canNext()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-orange-400 text-[#0f2849] font-bold text-sm transition-colors disabled:opacity-50 shadow-lg shadow-orange-900/20"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0f2849] border-t-transparent rounded-full animate-spin" />
                        Publication…
                      </>
                    ) : (
                      "🟠 Publier le produit"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Completion tracker */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Complétion</h3>
                <span className={`text-sm font-bold ${
                  progress >= 80 ? "text-green-600" :
                  progress >= 50 ? "text-orange-500" :
                  "text-gray-400"
                }`}>
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    progress >= 80 ? "bg-green-500" :
                    progress >= 50 ? "bg-accent" :
                    "bg-[#0f2849]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="space-y-2.5">
                {checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-sm">
                    {c.done
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      : <Circle className="w-4 h-4 text-gray-200 shrink-0" />}
                    <span className={c.done ? "text-gray-700" : "text-gray-400"}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-gray-900 text-sm">Conseils pour vendre plus</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2.5">
                  <span className="text-green-500 shrink-0 mt-0.5">✔</span>
                  <span>Ajoutez au moins 3 photos de bonne qualité</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-green-500 shrink-0 mt-0.5">✔</span>
                  <span>Rédigez une description détaillée avec mots-clés</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-green-500 shrink-0 mt-0.5">✔</span>
                  <span>Proposez un prix compétitif en gros</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-green-500 shrink-0 mt-0.5">✔</span>
                  <span>Définissez un MOQ attractif pour les revendeurs</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-green-500 shrink-0 mt-0.5">✔</span>
                  <span>Précisez votre ville pour les acheteurs locaux</span>
                </li>
              </ul>
            </div>

            {/* Store link */}
            {user && (
              <Link
                href={`/sellers/${user.id}`}
                target="_blank"
                className="flex items-center gap-3 p-4 bg-[#0f2849]/5 border border-[#0f2849]/10 rounded-2xl hover:bg-[#0f2849]/10 transition-colors group"
              >
                <div className="w-9 h-9 bg-[#0f2849] rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0f2849] truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 group-hover:text-[#0f2849] transition-colors">
                    Voir ma boutique →
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
