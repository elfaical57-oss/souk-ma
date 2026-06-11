import Link from "next/link";
import {
  ChevronRight, BadgeCheck, Truck, MessageCircle,
  Shield, Store, ShoppingBag, MapPin,
  ArrowRight, CheckCircle2, Users, Building2,
  Monitor, Shirt, Palette, Home as HomeIcon, Car, Leaf, ShoppingBasket,
} from "lucide-react";

export const revalidate = 0;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Static data ───────────────────────────────────────────────────────────────

const PRODUCT_CATS = [
  { icon: Monitor,        name: "Électronique",  slug: "electronics",  price: "150 DH" },
  { icon: Shirt,          name: "Mode & Textile", slug: "fashion",      price: "25 DH"  },
  { icon: Palette,        name: "Artisanat",      slug: "handicraft",   price: "15 DH"  },
  { icon: HomeIcon,       name: "Maison & Déco",  slug: "home",         price: "30 DH"  },
  { icon: ShoppingBasket, name: "Alimentation",   slug: "food",         price: "10 DH"  },
  { icon: Car,            name: "Auto & Moto",    slug: "auto",         price: "80 DH"  },
  { icon: Leaf,           name: "Agriculture",    slug: "agriculture",  price: "8 DH"   },
  { icon: Building2,      name: "Matériaux BTP",  slug: "construction", price: "20 DH"  },
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


const TRUST = [
  { icon: BadgeCheck,    label: "Fournisseurs vérifiés", desc: "Profils contrôlés et certifiés", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
  { icon: Shield,        label: "Paiement sécurisé",     desc: "Transactions protégées",         color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
  { icon: Truck,         label: "Livraison au Maroc",    desc: "Partout dans le royaume",        color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
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
                Fournisseurs vérifiés au Maroc
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

            </div>

            {/* Right: product category grid */}
            <div className="hidden lg:grid grid-cols-4 gap-2.5">
              {PRODUCT_CATS.map(({ icon: Icon, ...cat }) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-2xl p-3.5 flex flex-col items-center gap-2 transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRUST.map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`flex items-center gap-2.5 p-3 rounded-xl border ${bg} ${border}`}>
                <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${border}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-xs sm:text-sm leading-tight truncate">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight hidden sm:block">{desc}</p>
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
            {PRODUCT_CATS.map(({ icon: Icon, ...cat }) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:border-primary/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border border-blue-100">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-bold text-gray-800 text-sm text-center leading-tight">{cat.name}</p>
                <p className="text-primary font-bold text-xs">À partir de {cat.price}</p>
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

    </div>
  );
}
