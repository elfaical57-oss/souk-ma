"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, AlertTriangle, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";

interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  icon: string | null;
  image: string | null;
  _count: { products: number };
}

const EMPTY: Omit<Category, "id" | "_count"> = {
  name: "", nameAr: "", nameFr: "", slug: "", icon: "", image: "",
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Modal({ title, onClose, onSave, saving, children }: {
  title: string; onClose: () => void; onSave: () => void; saving: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
            Annuler
          </button>
          <button onClick={onSave} disabled={saving}
            className="px-5 py-2 text-sm font-bold bg-primary hover:bg-red-700 text-white rounded-xl disabled:opacity-60 flex items-center gap-2 transition-colors">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/admin/categories").then(r => setCategories(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openEdit = (c: Category) => {
    setEditTarget(c);
    setForm({ name: c.name, nameAr: c.nameAr, nameFr: c.nameFr, slug: c.slug, icon: c.icon || "", image: c.image || "" });
    setError("");
  };

  const openAdd = () => {
    setShowAdd(true);
    setForm(EMPTY);
    setError("");
  };

  const handleSave = async () => {
    if (!form.name || !form.nameAr || !form.nameFr || !form.slug) {
      setError("Tous les noms et le slug sont requis.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editTarget) {
        const { data } = await api.patch(`/admin/categories/${editTarget.id}`, form);
        setCategories(cs => cs.map(c => c.id === editTarget.id ? { ...c, ...data } : c));
        setEditTarget(null);
      } else {
        await api.post("/admin/categories", form);
        load();
        setShowAdd(false);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/categories/${deleteConfirm.id}`);
      setCategories(cs => cs.filter(c => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur lors de la suppression");
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const FormFields = () => (
    <>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom français">
          <input className={INPUT} value={form.nameFr} onChange={e => {
            set("nameFr", e.target.value);
            set("name", e.target.value);
            if (!editTarget) set("slug", slugify(e.target.value));
          }} placeholder="Électronique" />
        </Field>
        <Field label="Nom arabe">
          <input className={INPUT} value={form.nameAr} onChange={e => set("nameAr", e.target.value)} placeholder="إلكترونيات" dir="rtl" />
        </Field>
      </div>
      <Field label="Slug (URL)">
        <input className={INPUT} value={form.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="electronics" dir="ltr" />
        <p className="text-[11px] text-gray-500 mt-1">Utilisé dans l'URL : /products?category=<span className="text-gray-400">{form.slug || "..."}</span></p>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Icône (emoji)">
          <input className={INPUT} value={form.icon || ""} onChange={e => set("icon", e.target.value)} placeholder="💻" />
        </Field>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Aperçu</label>
          <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-2xl border border-gray-700">
            {form.icon || "?"}
          </div>
        </div>
      </div>
      <Field label="Image (URL)">
        <input className={INPUT} value={form.image || ""} onChange={e => set("image", e.target.value)} placeholder="https://..." dir="ltr" />
        {form.image && (
          <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-gray-700">
            <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
        )}
      </Field>
    </>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Catégories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" /> Ajouter une catégorie
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors group">
              {/* Image / Icon header */}
              <div className="h-28 relative bg-gray-800 flex items-center justify-center">
                {c.image ? (
                  <img src={c.image} alt={c.nameFr} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">{c.icon || "📦"}</span>
                )}
                {c.image && c.icon && (
                  <div className="absolute bottom-2 left-2 w-9 h-9 bg-black/60 backdrop-blur rounded-lg flex items-center justify-center text-xl">
                    {c.icon}
                  </div>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(c)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirm(c)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-white font-bold text-sm">{c.nameFr}</p>
                <p className="text-gray-400 text-xs mt-0.5" dir="rtl">{c.nameAr}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded-md">{c.slug}</span>
                  <span className="text-[11px] text-gray-400">{c._count.products} produit{c._count.products !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Nouvelle catégorie" onClose={() => setShowAdd(false)} onSave={handleSave} saving={saving}>
          <FormFields />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title={`Modifier · ${editTarget.nameFr}`} onClose={() => setEditTarget(null)} onSave={handleSave} saving={saving}>
          <FormFields />
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold">Supprimer la catégorie ?</p>
                <p className="text-gray-400 text-sm">{deleteConfirm.nameFr}</p>
              </div>
            </div>
            {deleteConfirm._count.products > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm px-3 py-2 rounded-xl flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {deleteConfirm._count.products} produit(s) utilisent cette catégorie
              </div>
            )}
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 text-sm border border-gray-700 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors">
                Annuler
              </button>
              <button onClick={handleDelete} disabled={deleting || deleteConfirm._count.products > 0}
                className="flex-1 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-50 transition-colors">
                {deleting ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
