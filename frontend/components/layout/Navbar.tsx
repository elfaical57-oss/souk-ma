"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Menu, X, MessageCircle, ChevronDown, LayoutDashboard, LogOut, Search, Grid3X3, Package, Plus, Store, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

const CATEGORIES = [
  { label: "Électronique",  labelAr: "إلكترونيات",          slug: "electronics",  icon: "💻" },
  { label: "Mode",          labelAr: "الموضة",               slug: "fashion",      icon: "👗" },
  { label: "Maison & Déco", labelAr: "المنزل",               slug: "home",         icon: "🏠" },
  { label: "Alimentation",  labelAr: "الغذاء",               slug: "food",         icon: "🍎" },
  { label: "Auto & Moto",   labelAr: "السيارات",             slug: "auto",         icon: "🚗" },
  { label: "Artisanat",     labelAr: "الصناعة التقليدية",   slug: "handicraft",   icon: "🏺" },
  { label: "BTP",           labelAr: "مواد البناء",          slug: "construction", icon: "🧱" },
  { label: "Agriculture",   labelAr: "الزراعة",              slug: "agriculture",  icon: "🌿" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [catMenu, setCatMenu]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ]               = useState("");

  const { user, logout }            = useAuthStore();
  const { lang, dir, t, setLang }   = useLangStore();
  const userMenuRef                  = useRef<HTMLDivElement>(null);
  const catMenuRef                   = useRef<HTMLDivElement>(null);
  const router                       = useRouter();
  const pathname                     = usePathname();

  // Pages that have their own search bar — hide the navbar one
  const hideSearch = ["/sellers", "/products"].some(p => pathname.startsWith(p));

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
      if (catMenuRef.current  && !catMenuRef.current.contains(e.target as Node))  setCatMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/products?search=${encodeURIComponent(q.trim())}`);
  };

  const initials = user ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "";

  return (
    <header className={`bg-[#0f2849] sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-2xl" : "shadow-md"}`}>

      {/* ── TOP ROW ── */}
      <div className="container h-[60px] flex items-center gap-3">

        {/* Logo + slogan */}
        <Link href="/" className="shrink-0 flex flex-col justify-center gap-0">
          <Image
            src="/logo.png"
            alt="JemlaMaroc"
            width={200}
            height={56}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="text-[9px] text-blue-300/70 font-medium tracking-widest uppercase hidden sm:block leading-none">
            Le marché de gros du Maroc
          </span>
        </Link>

        {/* Search — hidden on pages that have their own search */}
        <form onSubmit={handleSearch} className={`${hideSearch ? "hidden" : "hidden md:flex"} flex-1 max-w-xl items-center bg-white rounded-xl overflow-hidden h-9 shadow-sm mx-3`}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن منتج أو مورد..." : "Rechercher un produit, fournisseur..."}
            className="flex-1 px-4 text-sm text-gray-800 outline-none h-full"
          />
          <button type="submit" className="bg-primary hover:bg-red-700 h-full px-4 flex items-center transition-colors shrink-0">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">

          {/* Language */}
          <button
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="hidden sm:flex text-[11px] font-bold text-white/60 hover:text-white px-2 py-1 rounded border border-white/15 hover:border-white/30 transition-colors"
          >
            {lang === "fr" ? "ع AR" : "FR"}
          </button>

          {/* Auth */}
          {!mounted ? (
            <div className="hidden md:flex gap-2">
              <div className="w-20 h-8 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-32 h-8 bg-accent/30 rounded-xl animate-pulse" />
            </div>
          ) : user ? (
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-accent text-[#0f2849] font-black text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <span className="text-sm text-white font-medium max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${userMenu ? "rotate-180" : ""}`} />
              </button>

              {userMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user.role === "ADMIN" ? "Administrateur" : user.role === "SELLER" ? "Vendeur" : "Acheteur"}
                    </p>
                  </div>

                  {user.role === "SELLER" ? (
                    <>
                      <Link href={`/sellers/${user.id}`} onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Store className="w-4 h-4 text-gray-400" /> Voir ma boutique
                      </Link>
                      <Link href="/dashboard/seller/products/new" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Plus className="w-4 h-4 text-gray-400" /> Ajouter un produit
                      </Link>
                      <Link href="/dashboard/seller/products" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="w-4 h-4 text-gray-400" /> Gérer mes produits
                      </Link>
                      <Link href="/dashboard/seller/profile" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4 text-gray-400" /> Paramètres boutique
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4 text-gray-400" /> Mon profil
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link href="/dashboard/admin" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" /> Tableau de bord
                        </Link>
                      )}
                      <Link href="/chat" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-4 h-4 text-gray-400" /> Messages
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={() => { logout(); setUserMenu(false); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"
                className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
                Connexion
              </Link>
              <Link href="/register?role=seller"
                className="text-sm font-bold px-4 py-2 rounded-xl bg-accent hover:bg-orange-400 text-[#0f2849] transition-colors shadow-lg shadow-orange-900/20">
                Devenir vendeur
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-white/80 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── SECONDARY NAV ── */}
      <div className="hidden md:block border-t border-white/10 bg-[#0c1f3d]">
        <div className="container flex items-center h-9 gap-0.5">

          <Link href="/products"
            className="text-[13px] text-white/65 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0">
            Produits
          </Link>

          <Link href="/sellers"
            className="text-[13px] text-white/65 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0">
            Fournisseurs
          </Link>

          {/* Catégories dropdown */}
          <div className="relative shrink-0" ref={catMenuRef}>
            <button
              onClick={() => setCatMenu(!catMenu)}
              className="flex items-center gap-1.5 text-[13px] text-white/65 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Grid3X3 className="w-3 h-3" />
              Catégories
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${catMenu ? "rotate-180" : ""}`} />
            </button>
            {catMenu && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                {CATEGORIES.map(c => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`}
                    onClick={() => setCatMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <span className="text-base leading-none">{c.icon}</span>
                    <span>{lang === "ar" ? c.labelAr : c.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/#how-it-works"
            className="text-[13px] text-white/65 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0">
            Comment ça marche
          </Link>

          <Link href="/register?role=seller"
            className="text-[13px] text-accent hover:text-yellow-300 px-3 py-1.5 rounded-lg transition-colors font-semibold shrink-0">
            Vendre sur JemlaMaroc →
          </Link>

          <div className="ml-auto">
            <Link href="/sellers"
              className="text-[11px] text-white/40 hover:text-white/70 px-2 transition-colors">
              {lang === "ar" ? "البائعون" : "Tous les vendeurs"}
            </Link>
          </div>
        </div>
      </div>

      {/* ── MOBILE SEARCH — hidden on pages with own search ── */}
      <div className={`${hideSearch ? "hidden" : ""} md:hidden px-3 pb-2.5`}>
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden h-9 shadow-sm">
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder={lang === "ar" ? "ابحث..." : "Rechercher..."}
            className="flex-1 px-3 text-sm text-gray-800 outline-none h-full" />
          <button type="submit" className="bg-primary h-full px-4 flex items-center transition-colors hover:bg-red-700">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="md:hidden bg-[#0c1f3d] border-t border-white/10">
          <nav className="container py-3 flex flex-col gap-0.5 text-sm">
            <Link href="/products" onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-white font-semibold hover:bg-white/10 rounded-lg transition-colors">Produits</Link>
            <Link href="/sellers" onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-white font-semibold hover:bg-white/10 rounded-lg transition-colors">Fournisseurs</Link>
            <Link href="/register?role=seller" onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-accent font-semibold hover:bg-white/10 rounded-lg transition-colors">Vendre sur JemlaMaroc</Link>

            <p className="px-3 pt-2 pb-1 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Catégories</p>
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/8 rounded-lg flex items-center gap-2.5 transition-colors">
                <span className="text-base">{c.icon}</span>
                {lang === "ar" ? c.labelAr : c.label}
              </Link>
            ))}

            <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1.5">
              {mounted && user ? (
                <>
                  {user.role === "SELLER" ? (
                    <>
                      <Link href={`/sellers/${user.id}`} onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <Store className="w-4 h-4" /> Voir ma boutique
                      </Link>
                      <Link href="/dashboard/seller/products/new" onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" /> Ajouter un produit
                      </Link>
                      <Link href="/dashboard/seller/products" onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <Package className="w-4 h-4" /> Gérer mes produits
                      </Link>
                      <Link href="/dashboard/seller/profile" onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <Settings className="w-4 h-4" /> Paramètres boutique
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <User className="w-4 h-4" /> Mon profil
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link href="/dashboard/admin" onClick={() => setMenuOpen(false)}
                          className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Tableau de bord
                        </Link>
                      )}
                      <Link href="/chat" onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                        <MessageCircle className="w-4 h-4" /> Messages
                      </Link>
                    </>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 text-left transition-colors">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </>
              ) : mounted ? (
                <div className="flex flex-col gap-2 px-3 pt-1">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
                    Connexion
                  </Link>
                  <Link href="/register?role=seller" onClick={() => setMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-accent text-[#0f2849] font-bold hover:bg-orange-400 transition-colors">
                    Devenir vendeur
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="px-3 pt-3">
              <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
                className="text-xs font-bold text-white/50 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                {lang === "fr" ? "ع AR" : "FR"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
