"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  User, Menu, X, MessageCircle, ChevronDown, LayoutDashboard, LogOut,
  Grid3X3, Package, Plus, Store, Settings, Monitor, Shirt, Palette,
  Home as HomeIcon, Car, Leaf, ShoppingBasket, Building2, Heart,
  ShoppingCart, Globe,
} from "lucide-react";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";
import useCartStore from "@/lib/stores/cartStore";
import useFavoritesStore from "@/lib/stores/favoritesStore";
import { cn } from "@/lib/cn";
import Logo from "./Logo";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";

const CATEGORIES = [
  { label: "Électronique",  labelAr: "إلكترونيات",         slug: "electronics",  icon: Monitor        },
  { label: "Mode",          labelAr: "الموضة",              slug: "fashion",      icon: Shirt          },
  { label: "Maison & Déco", labelAr: "المنزل",              slug: "home",         icon: HomeIcon       },
  { label: "Alimentation",  labelAr: "الغذاء",              slug: "food",         icon: ShoppingBasket },
  { label: "Auto & Moto",   labelAr: "السيارات",            slug: "auto",         icon: Car            },
  { label: "Artisanat",     labelAr: "الصناعة التقليدية",  slug: "handicraft",   icon: Palette        },
  { label: "BTP",           labelAr: "مواد البناء",         slug: "construction", icon: Building2      },
  { label: "Agriculture",   labelAr: "الزراعة",             slug: "agriculture",  icon: Leaf           },
];

function roleLabel(role: string, lang: string) {
  if (role === "ADMIN") return lang === "ar" ? "مسؤول" : "Administrateur";
  if (role === "SELLER") return lang === "ar" ? "مورد" : "Fournisseur";
  return lang === "ar" ? "مشتري" : "Acheteur";
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [catMenu, setCatMenu]   = useState(false);
  const [langMenu, setLangMenu] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout }          = useAuthStore();
  const { lang, dir, t, setLang } = useLangStore();
  const cartCount                 = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const favCount                  = useFavoritesStore((s) => s.items.length);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const catMenuRef  = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const pathname    = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
    setCatMenu(false);
    setLangMenu(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenu(false);
        setCatMenu(false);
        setLangMenu(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
      if (catMenuRef.current  && !catMenuRef.current.contains(e.target as Node))  setCatMenu(false);
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangMenu(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const initials = user ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "";

  return (
    <header className={cn("sticky top-0 z-50 bg-white transition-shadow duration-200", scrolled ? "shadow-header" : "border-b border-slate-100")}>
      <TopBar />

      {/* Main header */}
      <div className="container h-16 lg:h-[72px] flex items-center gap-3 lg:gap-6">
        <Logo compact={false} />

        <SearchBar idPrefix="desktop-search" className="hidden md:flex flex-1 max-w-2xl" />

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          {/* Language */}
          <div className="relative hidden sm:block" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenu(!langMenu)}
              aria-expanded={langMenu}
              aria-haspopup="listbox"
              aria-label={lang === "ar" ? "اللغة" : "Langue"}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 hover:text-navy px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors min-h-11"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {lang === "fr" ? "FR" : "AR"}
              <ChevronDown className={cn("w-3 h-3 transition-transform", langMenu && "rotate-180")} aria-hidden="true" />
            </button>
            {langMenu && (
              <div role="listbox" className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-card-hover border border-slate-100 py-1 z-50">
                {([
                  { code: "fr" as const, label: "Français" },
                  { code: "ar" as const, label: "العربية" },
                ]).map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={lang === code}
                    onClick={() => { setLang(code); setLangMenu(false); }}
                    className={cn(
                      "flex items-center w-full px-3 py-2.5 text-sm transition-colors",
                      lang === code ? "text-navy font-semibold bg-orange-50" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/favorites"
            aria-label={lang === "ar" ? "المفضلة" : "Favoris"}
            className="relative p-2.5 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-50 transition-colors min-h-11 min-w-11 flex items-center justify-center"
          >
            <Heart className="w-[18px] h-[18px]" aria-hidden="true" />
            {mounted && favCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favCount > 9 ? "9+" : favCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={lang === "ar" ? "السلة" : "Panier"}
            className="relative p-2.5 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-50 transition-colors min-h-11 min-w-11 flex items-center justify-center"
          >
            <ShoppingCart className="w-[18px] h-[18px]" aria-hidden="true" />
            {mounted && cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {!mounted ? (
            <div className="hidden md:flex items-center gap-2 pl-1">
              <div className="w-24 h-10 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ) : user ? (
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenu(!userMenu)}
                aria-expanded={userMenu}
                aria-haspopup="menu"
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-50 transition-colors min-h-11"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-navy text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                )}
                <span className="text-left leading-tight hidden lg:block">
                  <span className="block text-[13px] font-semibold text-navy max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <span className="block text-[10px] text-slate-500 font-medium">{roleLabel(user.role, lang)}</span>
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", userMenu && "rotate-180")} aria-hidden="true" />
              </button>

              {userMenu && (
                <div role="menu" className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-navy truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{roleLabel(user.role, lang)}</p>
                  </div>

                  {user.role === "SELLER" ? (
                    <>
                      <Link href={`/sellers/${user.id}`} onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <Store className="w-4 h-4 text-slate-400" aria-hidden="true" /> Voir ma boutique
                      </Link>
                      <Link href="/dashboard/seller/products/new" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <Plus className="w-4 h-4 text-slate-400" aria-hidden="true" /> Ajouter un produit
                      </Link>
                      <Link href="/dashboard/seller/products" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <Package className="w-4 h-4 text-slate-400" aria-hidden="true" /> Gérer mes produits
                      </Link>
                      <Link href="/dashboard/seller/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <Settings className="w-4 h-4 text-slate-400" aria-hidden="true" /> Paramètres boutique
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <User className="w-4 h-4 text-slate-400" aria-hidden="true" /> Mon profil
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link href="/dashboard/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" aria-hidden="true" /> Tableau de bord
                        </Link>
                      )}
                      <Link href="/chat" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <MessageCircle className="w-4 h-4 text-slate-400" aria-hidden="true" /> Messages
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button type="button" onClick={() => { logout(); setUserMenu(false); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:bg-red-50 transition-colors w-full">
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 pl-1">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-navy px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                {t.nav.login}
              </Link>
              <Link href="/register?role=seller" className="text-sm font-semibold px-4 py-2 rounded-xl bg-accent hover:bg-accent-light text-navy transition-colors">
                {t.nav.become_seller}
              </Link>
            </div>
          )}

          <button
            type="button"
            className="md:hidden p-2.5 text-navy rounded-lg hover:bg-slate-50 min-h-11 min-w-11 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar idPrefix="mobile-search" compact className="w-full" />
      </div>

      {/* Navigation */}
      <nav className="hidden md:block border-t border-slate-100 bg-white" aria-label="Navigation principale">
        <div className="container flex items-center h-11 gap-0.5">
          <div className="relative shrink-0" ref={catMenuRef}>
            <button
              type="button"
              onClick={() => setCatMenu(!catMenu)}
              aria-expanded={catMenu}
              aria-haspopup="menu"
              className="flex items-center gap-2 text-[13px] text-white bg-navy hover:bg-navy-800 px-3.5 py-1.5 rounded-lg transition-colors font-semibold"
            >
              <Grid3X3 className="w-3.5 h-3.5" aria-hidden="true" />
              {t.nav.categories_all}
              <ChevronDown className={cn("w-3 h-3 transition-transform", catMenu && "rotate-180")} aria-hidden="true" />
            </button>
            {catMenu && (
              <div role="menu" className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-2 z-50 grid grid-cols-1">
                {CATEGORIES.map(({ icon: Icon, ...c }) => (
                  <Link
                    key={c.slug}
                    href={`/products/categorie/${c.slug}`}
                    onClick={() => setCatMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{lang === "ar" ? c.labelAr : c.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/products" className="text-[13px] text-slate-600 hover:text-navy hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
            {t.nav.products}
          </Link>
          <Link href="/sellers" className="text-[13px] text-slate-600 hover:text-navy hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
            {t.nav.sellers}
          </Link>
          <Link href="/products" className="text-[13px] text-slate-600 hover:text-navy hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
            {t.nav.promotions}
          </Link>
          <Link href="/#how-it-works" className="text-[13px] text-slate-600 hover:text-navy hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
            {t.nav.how_it_works}
          </Link>
          <Link
            href="/vendre"
            className="text-[13px] text-navy bg-accent hover:bg-accent-light px-3.5 py-1.5 rounded-lg transition-colors font-semibold ml-2"
          >
            {t.nav.sell}
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 overflow-y-auto max-h-[80vh] shadow-header">
          <nav className="px-4 py-3 space-y-4 text-sm" aria-label="Menu mobile">
            {mounted && user && (
              <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-2.5 px-1 pb-2 mb-1 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-navy text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-navy font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-slate-500 text-xs">{roleLabel(user.role, lang)}</p>
                  </div>
                </div>
                {user.role === "SELLER" ? (
                  <>
                    <Link href={`/sellers/${user.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-navy hover:bg-white rounded-lg font-medium">
                      <Store className="w-4 h-4" aria-hidden="true" /> Voir ma boutique
                    </Link>
                    <Link href="/dashboard/seller/products/new" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-slate-700 hover:bg-white rounded-lg">
                      <Plus className="w-4 h-4" aria-hidden="true" /> Ajouter un produit
                    </Link>
                    <Link href="/dashboard/seller/products" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-slate-700 hover:bg-white rounded-lg">
                      <Package className="w-4 h-4" aria-hidden="true" /> Gérer mes produits
                    </Link>
                    <Link href="/dashboard/seller/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-slate-700 hover:bg-white rounded-lg">
                      <Settings className="w-4 h-4" aria-hidden="true" /> Paramètres boutique
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-slate-700 hover:bg-white rounded-lg">
                      <User className="w-4 h-4" aria-hidden="true" /> Mon profil
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link href="/dashboard/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-slate-700 hover:bg-white rounded-lg">
                        <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Tableau de bord
                      </Link>
                    )}
                    <Link href="/chat" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-slate-700 hover:bg-white rounded-lg">
                      <MessageCircle className="w-4 h-4" aria-hidden="true" /> Messages
                    </Link>
                  </>
                )}
                <button type="button" onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-2 py-2.5 text-primary hover:bg-red-50 rounded-lg w-full text-left">
                  <LogOut className="w-4 h-4" aria-hidden="true" /> Déconnexion
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Link href="/products" onClick={() => setMenuOpen(false)} className="text-center py-2.5 text-navy font-semibold bg-slate-50 hover:bg-slate-100 rounded-xl">
                Produits
              </Link>
              <Link href="/sellers" onClick={() => setMenuOpen(false)} className="text-center py-2.5 text-navy font-semibold bg-slate-50 hover:bg-slate-100 rounded-xl">
                Fournisseurs
              </Link>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 px-1">Catégories</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map(({ icon: Icon, ...c }) => (
                  <Link key={c.slug} href={`/products/categorie/${c.slug}`} onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-slate-700 hover:text-navy bg-slate-50 hover:bg-slate-100 rounded-xl">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="text-[12px] font-medium truncate">{lang === "ar" ? c.labelAr : c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/vendre" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full py-2.5 rounded-xl bg-orange-50 text-accent font-semibold hover:bg-orange-100">
                {t.nav.sell}
              </Link>
              {mounted && !user && (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-navy font-medium hover:bg-slate-50">
                    Connexion
                  </Link>
                  <Link href="/register?role=seller" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl bg-accent text-navy font-semibold hover:bg-accent-light">
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-1 pb-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2 px-1">Langue / اللغة</p>
              <div className="flex gap-2">
                {([
                  { code: "fr" as const, label: "Français" },
                  { code: "ar" as const, label: "العربية" },
                ]).map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => { setLang(code); setMenuOpen(false); }}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors",
                      lang === code ? "border-accent text-accent bg-orange-50" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
