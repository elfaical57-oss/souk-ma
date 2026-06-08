import Link from "next/link";
import {
  ChevronRight, BadgeCheck, Truck, MessageCircle,
  Shield, Store, ShoppingBag, MapPin, Search,
  ArrowRight, CheckCircle2, Star, Package, Users, Building2,
} from "lucide-react";

export const revalidate = 0;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Static data ───────────────────────────────────────────────────────────────

const PRODUCT_CATS = [
  { icon: "💻", name: "Électronique",  slug: "electronics",  price: "150 DH",  suppliers: 85  },
  { icon: "👗", name: "Mode & Textile", slug: "fashion",      price: "25 DH",   suppliers: 210 },
  { icon: "🏺", name: "Artisanat",      slug: "handicraft",   price: "15 DH",   suppliers: 130 },
  { icon: "🏠", name: "Maison & Déco",  slug: "home",         price: "30 DH",   suppliers: 175 },
  { icon: "🍎", name: "Alimentation",   slug: "food",         price: "10 DH",   suppliers: 190 },
  { icon: "🚗", name: "Auto & Moto",    slug: "auto",         price: "80 DH",   suppliers: 95  },
  { icon: "🌿", name: "Agriculture",    slug: "agriculture",  price: "8 DH",    suppliers: 155 },
  { icon: "🧱", name: "Matériaux BTP",  slug: "construction", price: "20 DH",   suppliers: 120 },
];

const HOW_STEPS = [
  {
    n: "01",
    icon: Search,
    title: "Cherchez un produit",
    desc: "Parcourez des milliers de produits ou utilisez la barre de recherche pour trouver ce dont vous avez besoin.",
  },
  {
    n: "02",
    icon: Users,
    title: "Comparez les fournisseurs",
    desc: "Consultez les profils des fournisseurs vérifiés, leurs produits et leurs prix de gros.",
  },
  {
    n: "03",
    icon: MessageCircle,
    title: "Contactez le vendeur",
    desc: "Discutez directement via WhatsApp ou la messagerie intégrée pour négocier et commander.",
  },
  {
    n: "04",
    icon: ShoppingBag,
    title: "Achetez au meilleur prix",
    desc: "Finalisez votre commande et bénéficiez des meilleurs prix grossiste au Maroc.",
  },
];

const STATS = [
  { value: "10 000+", label: "Produits listés",      icon: Package },
  { value: "500+",    label: "Fournisseurs actifs",  icon: Store },
  { value: "40+",     label: "Villes couvertes",     icon: MapPin },
  { value: "1 000+",  label: "Acheteurs satisfaits", icon: Star },
];

const TRUST = [
  { icon: BadgeCheck, label: "Fournisseurs vérifiés",   desc: "Profils contrôlés et certifiés",  color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-100" },
  { icon: Shield,     label: "Paiement sécurisé",        desc: "Transactions protégées",          color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  { icon: Truck,      label: "Livraison au Maroc",       desc: "Partout dans le royaume",         color: "text-purple-600",bg: "bg-purple-50",border: "border-purple-100" },
  { icon: MessageCircle, label: "Support WhatsApp",      desc: "Réponse rapide garantie",         color: "text-accent",    bg: "bg-orange-50",border: "border-orange-100" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Seller {
  id: string;
  businessName: string;
  slug?: string;
  city?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  logo?: string;
  banner?: string;
  user: { id: string; name: string };
  _count?: { products: number };
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getTopSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).slice(0, 8);
  } catch {
    return [];
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SellerCard({ s }: { s: Seller }) {
  const initials = s.businessName.slice(0, 2).toUpperCase();
  const palette  = ["bg-blue-500","bg-orange-500","bg-green-500","bg-purple-500","bg-red-500","bg-teal-500","bg-pink-500","bg-indigo-500"];
  const color    = palette[s.businessName.charCodeAt(0) % palette.length];
  const slug     = (s as any).slug || s.user.id;
  const products = s._count?.products ?? 0;

  return (
    <Link
      href={`/sellers/${slug}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      {/* Mini banner */}
      <div className="h-16 bg-gradient-to-r from-[#1a3f72] to-[#2d6ab4] relative overflow-hidden">
        {(s as any).banner && (
          <img src={(s as any).banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="px-4 pb-4 -mt-6 relative">
        {/* Logo */}
        <div className="mb-2">
          {s.logo ? (
            <img
              src={s.logo} alt={s.businessName}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md`}>
              {initials}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors leading-tight">
                {s.businessName}
              </p>
              {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
            </div>
            {s.city && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />{s.city}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5 font-medium">{products} produit{products !== 1 ? "s" : ""}</p>
          </div>
          <span className="text-primary mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const sellers = await getTopSellers();

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#0a1e3d] via-[#0f2849] to-[#1a3f72]">
        <div className="container py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left: text */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent bg-accent/15 px-3 py-1.5 rounded-full mb-5">
                <BadgeCheck className="w-3.5 h-3.5" />
                500+ fournisseurs vérifiés au Maroc
              </span>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-[2.6rem] font-black leading-[1.15] mb-4">
                Achetez directement<br />
                <span className="text-accent">des grossistes marocains</span>
              </h1>
              <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                Des milliers de produits aux prix de gros, fournisseurs vérifiés partout au Maroc.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Explorer les produits
                </Link>
                <Link
                  href="/register?role=seller"
                  className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all"
                >
                  <Store className="w-5 h-5" />
                  Devenir vendeur
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex items-center gap-6">
                {[["10K+","Produits"],["500+","Fournisseurs"],["40+","Villes"]].map(([v, l]) => (
                  <div key={v} className="text-center">
                    <p className="text-accent font-black text-xl leading-none">{v}</p>
                    <p className="text-blue-300/70 text-xs mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: product category grid */}
            <div className="hidden lg:grid grid-cols-4 gap-2.5">
              {PRODUCT_CATS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-2xl p-3.5 flex flex-col items-center gap-2 transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="text-white text-[11px] font-bold text-center leading-tight">{cat.name}</p>
                  <p className="text-accent text-[10px] font-semibold">À partir de {cat.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRUST STRIP
      ════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST.map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${bg} ${border}`}>
                <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${border}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-10">

        {/* ════════════════════════════════════════════
            PRODUCT CATEGORIES
        ════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h2 className="font-black text-gray-900 text-lg">Produits populaires en gros</h2>
              </div>
              <p className="text-sm text-gray-500 ml-3">Trouvez vos fournisseurs par catégorie</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-semibold">
              Tout voir <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
            {PRODUCT_CATS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:border-primary/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 border border-gray-100">
                  {cat.icon}
                </div>
                <p className="font-bold text-gray-800 text-sm text-center leading-tight">{cat.name}</p>
                <div className="text-center">
                  <p className="text-primary font-bold text-xs">À partir de {cat.price}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{cat.suppliers} fournisseurs</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile "voir tout" */}
          <div className="sm:hidden mt-3 text-center">
            <Link href="/products" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
              Voir tous les produits <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOURNISSEURS RECOMMANDÉS
        ════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1 h-5 bg-accent rounded-full" />
                <h2 className="font-black text-gray-900 text-lg">Fournisseurs recommandés</h2>
                <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  Vérifiés
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-3">Nos partenaires grossistes certifiés</p>
            </div>
            <Link href="/sellers" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-semibold">
              Tous les fournisseurs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {sellers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
              <Store className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400 text-sm">Aucun fournisseur disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sellers.map(s => <SellerCard key={s.id} s={s} />)}
            </div>
          )}

          <div className="sm:hidden mt-3 text-center">
            <Link href="/sellers" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
              Voir tous les fournisseurs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════ */}
        <section id="how-it-works">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-red-50 px-3 py-1.5 rounded-full border border-red-100 mb-3">
              Simple & rapide
            </div>
            <h2 className="font-black text-gray-900 text-xl sm:text-2xl">Comment ça marche ?</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Trouvez vos grossistes et commandez en 4 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_STEPS.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 relative hover:shadow-md hover:border-primary/20 transition-all">
                <div className="absolute -top-3 left-5 bg-primary text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  {n}
                </div>
                <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mb-4 mt-2">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CTA BANNER
        ════════════════════════════════════════════ */}
        <section className="bg-gradient-to-r from-[#0f2849] to-[#1a3f72] rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white font-black text-xl sm:text-2xl mb-2">
              Vous êtes grossiste ou fournisseur ?
            </h2>
            <p className="text-blue-200 text-sm max-w-md">
              Rejoignez JemlaMaroc et accédez à des milliers d'acheteurs professionnels partout au Maroc.
            </p>
            <ul className="mt-3 space-y-1">
              {["Inscription 100% gratuite","Boutique professionnelle en ligne","Contactez les acheteurs directement"].map(item => (
                <li key={item} className="flex items-center gap-2 text-blue-100 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/register?role=seller"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-orange-400 text-[#0f2849] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Store className="w-4 h-4" />
              Ouvrir ma boutique
            </Link>
            <Link
              href="/sellers"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all whitespace-nowrap"
            >
              Voir les vendeurs
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS
        ════════════════════════════════════════════ */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="font-black text-gray-900 text-lg sm:text-xl">JemlaMaroc en chiffres</h2>
            <p className="text-gray-500 text-sm mt-1">La marketplace B2B leader au Maroc</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-primary/8 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            BECOME BUYER CTA
        ════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <Link
            href="/products"
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/25 transition-all flex items-center justify-between gap-4"
          >
            <div>
              <ShoppingBag className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-black text-gray-900 text-base mb-1">Je cherche des produits</h3>
              <p className="text-gray-500 text-sm">Parcourez notre catalogue de grossistes</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          <Link
            href="/register?role=seller"
            className="group bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 hover:shadow-lg hover:border-orange-400/40 transition-all flex items-center justify-between gap-4"
          >
            <div>
              <Building2 className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-black text-gray-900 text-base mb-1">Je suis fournisseur</h3>
              <p className="text-gray-500 text-sm">Créez votre boutique gratuitement</p>
            </div>
            <ArrowRight className="w-6 h-6 text-orange-300 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </section>

      </div>

      {/* ════════════════════════════════════════════
          WHATSAPP FLOATING BUTTON
      ════════════════════════════════════════════ */}
      <a
        href="https://wa.me/212600000000?text=Bonjour%2C%20j%27ai%20besoin%20d%27aide%20sur%20JemlaMaroc"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold px-4 py-3 rounded-2xl shadow-xl shadow-green-900/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/40 group"
        aria-label="Contacter via WhatsApp"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-sm">Besoin d'aide ?</span>
      </a>
    </div>
  );
}
