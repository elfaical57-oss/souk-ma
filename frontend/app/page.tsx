import Link from "next/link";
import {
  ChevronRight, BadgeCheck, Truck, MessageCircle,
  Shield, Store, ShoppingBag, Zap, MapPin, Star,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  { name: "Électronique",  slug: "electronics",  icon: "💻", bg: "bg-blue-100",    text: "text-blue-700" },
  { name: "Mode",          slug: "fashion",      icon: "👗", bg: "bg-pink-100",    text: "text-pink-700" },
  { name: "Maison & Déco", slug: "home",         icon: "🏠", bg: "bg-amber-100",   text: "text-amber-700" },
  { name: "Alimentation",  slug: "food",         icon: "🍎", bg: "bg-green-100",   text: "text-green-700" },
  { name: "Auto & Moto",   slug: "auto",         icon: "🚗", bg: "bg-red-100",     text: "text-red-700" },
  { name: "Artisanat",     slug: "handicraft",   icon: "🏺", bg: "bg-orange-100",  text: "text-orange-700" },
  { name: "Matériaux BTP", slug: "construction", icon: "🧱", bg: "bg-stone-100",   text: "text-stone-700" },
  { name: "Agriculture",   slug: "agriculture",  icon: "🌿", bg: "bg-emerald-100", text: "text-emerald-700" },
];

const TRUST_BADGES = [
  { Icon: BadgeCheck,    label: "Vendeurs vérifiés",   desc: "Profils certifiés",     color: "text-blue-500",   bg: "bg-blue-50" },
  { Icon: Truck,         label: "Livraison nationale",  desc: "Partout au Maroc",      color: "text-green-500",  bg: "bg-green-50" },
  { Icon: MessageCircle, label: "WhatsApp direct",      desc: "Contactez le vendeur",  color: "text-purple-500", bg: "bg-purple-50" },
  { Icon: Shield,        label: "Achat sécurisé",       desc: "Vendeurs de confiance", color: "text-orange-500", bg: "bg-orange-50" },
];

interface Seller {
  id: string;
  businessName: string;
  city?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  logo?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}

async function getTopSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).slice(0, 8);
  } catch {
    return [];
  }
}

function SellerCard({ s }: { s: Seller }) {
  const initials = s.businessName.slice(0, 2).toUpperCase();
  const palette = ["bg-blue-500","bg-orange-500","bg-green-500","bg-purple-500","bg-red-500","bg-teal-500","bg-pink-500","bg-indigo-500"];
  const color = palette[s.businessName.charCodeAt(0) % palette.length];
  return (
    <Link
      href={`/sellers/${s.user.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="flex items-center gap-3">
        {s.logo ? (
          <img src={s.logo} alt={s.businessName} width={48} height={48} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
        ) : (
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0`}>
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">{s.businessName}</p>
            {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
          </div>
          {s.city && (
            <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-3 h-3" />{s.city}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-center">
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="font-bold text-gray-800 text-sm">{s._count?.products ?? 0}</p>
          <p className="text-[10px] text-gray-400">Produits</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="font-bold text-gray-800 text-sm">{s.totalSales}</p>
          <p className="text-[10px] text-gray-400">Ventes</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="font-bold text-gray-800 text-sm flex items-center justify-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {s.rating > 0 ? s.rating.toFixed(1) : "—"}
          </p>
          <p className="text-[10px] text-gray-400">Note</p>
        </div>
      </div>

      <span className="text-center text-xs font-semibold text-primary border border-primary/30 rounded-lg py-1.5 group-hover:bg-primary group-hover:text-white transition-colors">
        Voir la boutique →
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const sellers = await getTopSellers();

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-[#0f2849]">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#1a3f72] to-[#0d3461] p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-accent/10 rounded-full pointer-events-none" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/15 px-3 py-1 rounded-full mb-3">
                  <Zap className="w-3 h-3" />
                  Offres exclusives grossistes
                </span>
                <h1 className="text-white text-3xl md:text-4xl font-black leading-tight mb-2">
                  Les meilleurs prix<br />de gros au Maroc
                </h1>
                <p className="text-blue-200 text-sm mb-5">
                  Des milliers de produits de vendeurs vérifiés
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explorer les produits
                </Link>
              </div>
              <div className="flex gap-8 mt-6 relative">
                {[["10K+", "Produits"], ["500+", "Vendeurs"], ["40+", "Villes"]].map(([v, l]) => (
                  <div key={v} className="text-center">
                    <p className="text-accent font-black text-xl">{v}</p>
                    <p className="text-blue-300 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/register?role=seller"
                className="flex-1 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white flex items-center justify-between hover:opacity-95 transition-opacity"
              >
                <div>
                  <p className="text-orange-100 text-xs font-semibold mb-1">Vous êtes vendeur ?</p>
                  <p className="font-black text-lg leading-tight">Ouvrez votre boutique</p>
                  <span className="inline-block mt-2 bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-lg">Gratuitement</span>
                </div>
                <Store className="w-12 h-12 text-white/25 shrink-0" />
              </Link>
              <Link
                href="/sellers"
                className="flex-1 rounded-2xl bg-gradient-to-br from-[#1e50a0] to-[#1a3f72] p-5 text-white flex items-center justify-between hover:opacity-95 transition-opacity"
              >
                <div>
                  <p className="text-blue-200 text-xs font-semibold mb-1">Vendeurs certifiés</p>
                  <p className="font-black text-lg leading-tight">Achetez en sécurité</p>
                  <span className="inline-block mt-2 bg-white text-secondary text-xs font-bold px-3 py-1 rounded-lg">Voir les boutiques</span>
                </div>
                <Shield className="w-12 h-12 text-white/25 shrink-0" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      <div className="container py-5 space-y-5">

        {/* ── CATEGORIES ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-sm">Parcourir les catégories</h2>
            <Link href="/products" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
              Tout voir <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <p className={`text-[11px] font-semibold text-center leading-tight ${cat.text} group-hover:underline`}>
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── TOP SELLERS (server-fetched, no client JS) ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="font-bold text-gray-900">Nos vendeurs</h2>
              <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">Vérifiés</span>
            </div>
            <Link href="/sellers" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
              Voir tous les vendeurs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {sellers.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Store className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">Aucun vendeur pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {sellers.map((s) => <SellerCard key={s.id} s={s} />)}
            </div>
          )}
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TRUST_BADGES.map(({ Icon, label, desc, color, bg }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
