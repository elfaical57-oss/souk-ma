"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageInput, setImageInput] = useState("");

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

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(console.error);
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageInput("");
  };

  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.images.length === 0) {
      setError("Ajoutez au moins une image");
      return;
    }
    if (!form.categoryId) {
      setError("Choisissez une catégorie");
      return;
    }

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
      });
      router.push("/dashboard/seller/products");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { errors?: { fieldErrors?: Record<string, string[]> } } } })?.response?.data?.errors?.fieldErrors;
      setError(msg ? Object.values(msg).flat().join(", ") : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/seller/products" className="p-2 rounded-lg hover:bg-muted transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nouveau produit</h1>
          <p className="text-sm text-gray-500">Remplissez les informations de votre produit</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Informations générales</h2>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Titre du produit *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="input"
              placeholder="Ex: Huile d'olive Meknès 5L"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Décrivez votre produit en détail..."
              required
              minLength={10}
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Prix & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Prix (MAD) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="input"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Qté min. commande</label>
              <input
                type="number"
                value={form.minOrderQty}
                onChange={(e) => set("minOrderQty", e.target.value)}
                className="input"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className="input"
                placeholder="0"
                required
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Category & City */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Catégorie & Localisation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Catégorie *</label>
              <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input" required>
                <option value="">Choisir une catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.nameFr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Ville</label>
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className="input">
                <option value="">Toutes les villes</option>
                {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Tags (séparés par virgule)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className="input"
              placeholder="Ex: bio, marocain, huile"
            />
          </div>
        </div>

        {/* Images */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Images *</h2>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              className="input flex-1"
              placeholder="https://exemple.com/image.jpg"
            />
            <button type="button" onClick={addImage} className="btn-primary px-4 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          <p className="text-xs text-gray-400">Collez l'URL d'une image (Imgur, Google Photos, etc.) et appuyez sur Ajouter</p>

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-full h-24 object-cover rounded-lg border" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                      Principale
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {form.images.length === 0 && (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Aucune image ajoutée</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/seller/products" className="flex-1 py-3 text-center border border-gray-300 rounded-lg text-gray-700 hover:bg-muted transition-colors font-medium">
            Annuler
          </Link>
          <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 rounded-lg disabled:opacity-60 font-medium">
            {loading ? "Création..." : "Créer le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}
