"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { BarChart3, Eye, ExternalLink, ImagePlus, LoaderCircle, MousePointerClick, Save } from "lucide-react";
import api from "@/lib/api";
import { compressImage, readFileAsDataUrl } from "@/lib/compressImage";

interface HomepageAd {
  imageUrl: string;
  targetUrl: string;
}

interface AdAnalytics {
  period: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

const EMPTY_AD: HomepageAd = { imageUrl: "", targetUrl: "/sellers" };
const INPUT = "w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500";

const PERIODS = [
  { value: "day",   label: "Aujourd'hui" },
  { value: "week",  label: "7 derniers jours" },
  { value: "month", label: "30 derniers jours" },
  { value: "all",   label: "Tout" },
];

function AdStats() {
  const [period, setPeriod] = useState("week");
  const [data, setData] = useState<AdAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<AdAnalytics>("/admin/analytics/ads", { params: { period } })
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const stats = [
    { icon: Eye, value: data?.impressions ?? 0, label: "Impressions", color: "bg-blue-500" },
    { icon: MousePointerClick, value: data?.clicks ?? 0, label: "Clics", color: "bg-green-500" },
    { icon: BarChart3, value: `${(data?.ctr ?? 0).toFixed(1)}%`, label: "Taux de clic (CTR)", color: "bg-orange-500" },
  ];

  return (
    <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-5 sm:p-7">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-white font-semibold text-sm">Statistiques de la bannière</h2>
        <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-xl p-1 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                period === p.value ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-white tabular-nums">{loading ? "-" : value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAdvertisingPage() {
  const [ad, setAd] = useState<HomepageAd>(EMPTY_AD);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get<HomepageAd>("/ads/homepage")
      .then(({ data }) => setAd({ imageUrl: data.imageUrl, targetUrl: data.targetUrl }))
      .catch((reason) => setError(reason?.response?.data?.message || "Impossible de charger la publicité."))
      .finally(() => setLoading(false));
  }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisissez un fichier image.");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess(false);
    try {
      const source = await readFileAsDataUrl(file);
      const compressed = await compressImage(source, 1800, 0.75);
      const { data } = await api.post<{ url: string }>("/upload", { data: compressed });
      setAd((current) => ({ ...current, imageUrl: data.url }));
    } catch (reason: any) {
      setError(reason?.message || "Le téléversement de l’image a échoué.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const { data } = await api.put<HomepageAd>("/ads/homepage", ad);
      setAd({ imageUrl: data.imageUrl, targetUrl: data.targetUrl });
      setSuccess(true);
    } catch (reason: any) {
      setError(reason?.response?.data?.message || "Impossible d’enregistrer la publicité.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-5 sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">Page d’accueil</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Espace publicitaire</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">Changez l’image et le lien de la bannière visible sur la page d’accueil.</p>
      </div>

      <AdStats />

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      {success && <div role="status" className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">La publicité a été enregistrée.</div>}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center text-gray-400"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />Chargement…</div>
      ) : (
        <div className="space-y-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 sm:p-7">
          <div>
            <label htmlFor="ad-image-url" className="mb-2 block text-sm font-semibold text-gray-200">Image de la bannière</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input id="ad-image-url" className={INPUT} value={ad.imageUrl} onChange={(event) => setAd((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="https://…" dir="ltr" />
              <label className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 text-sm font-semibold text-gray-200 transition-colors hover:bg-gray-800">
                {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {uploading ? "Téléversement…" : "Choisir une image"}
                <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={upload} />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">Formats image acceptés. L’image est compressée avant son téléversement.</p>
          </div>

          <div>
            <label htmlFor="ad-target-url" className="mb-2 block text-sm font-semibold text-gray-200">Lien à ouvrir au clic</label>
            <input id="ad-target-url" className={INPUT} value={ad.targetUrl} onChange={(event) => setAd((current) => ({ ...current, targetUrl: event.target.value }))} placeholder="/sellers ou https://exemple.ma" dir="ltr" />
            <p className="mt-2 text-xs text-gray-500">Utilisez un chemin du site (ex. /products) ou un lien http(s).</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-200">Aperçu</p>
              {ad.targetUrl && <a href={ad.targetUrl} target={ad.targetUrl.startsWith("http") ? "_blank" : undefined} rel={ad.targetUrl.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300">Tester le lien<ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
            <div className="relative aspect-[4/1] min-h-28 overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
              {ad.imageUrl ? <img src={ad.imageUrl} alt="Aperçu de la publicité" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-gray-500">Choisissez une image pour voir l’aperçu.</div>}
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-800 pt-5">
            <button type="button" onClick={save} disabled={saving || uploading || !ad.imageUrl || !ad.targetUrl.trim()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Enregistrement…" : "Enregistrer la publicité"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
