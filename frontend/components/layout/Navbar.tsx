"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Menu, X, MessageCircle, ChevronDown, LayoutDashboard, LogOut, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";

const CATEGORIES = [
  { label: "Électronique", labelAr: "إلكترونيات", slug: "electronics" },
  { label: "Mode",         labelAr: "الموضة",      slug: "fashion" },
  { label: "Maison",       labelAr: "المنزل",       slug: "home" },
  { label: "Alimentation", labelAr: "الغذاء",       slug: "food" },
  { label: "Auto & Moto",  labelAr: "السيارات",     slug: "auto" },
  { label: "Artisanat",    labelAr: "الصناعة التقليدية", slug: "handicraft" },
  { label: "BTP",          labelAr: "مواد البناء",  slug: "construction" },
  { label: "Agriculture",  labelAr: "الزراعة",      slug: "agriculture" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [q, setQ]               = useState("");

  const { user, logout }         = useAuthStore();
  const { lang, dir, t, setLang } = useLangStore();
  const userMenuRef              = useRef<HTMLDivElement>(null);
  const router                   = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
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
    <header className="bg-[#0f2849] sticky top-0 z-50 shadow-md">

      {/* ── MAIN ROW ── */}
      <div className="container h-14 flex items-center gap-3">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <Image src="/logo.png" alt="JemlaMaroc" width={140} height={40} className="h-9 w-auto object-contain" priority />
        </Link>

        {/* Search bar — hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center bg-white rounded-lg overflow-hidden h-9 mx-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن منتج..." : "Rechercher un produit, une marque..."}
            className="flex-1 px-4 text-sm text-gray-800 outline-none h-full"
          />
          <button type="submit" className="bg-primary hover:bg-red-700 h-full px-4 flex items-center transition-colors">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Lang */}
          <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="hidden sm:flex text-[11px] font-bold text-white/70 hover:text-white px-2 py-1 rounded transition-colors">
            {lang === "fr" ? "ع AR" : "FR"}
          </button>

          {/* Auth */}
          {!mounted ? (
            <div className="hidden md:flex gap-1.5">
              <div className="w-16 h-7 bg-white/10 rounded-lg animate-pulse" />
              <div className="w-20 h-7 bg-primary/40 rounded-lg animate-pulse" />
            </div>
          ) : user ? (
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <div className="w-6 h-6 rounded-md bg-accent text-[#0f2849] font-black text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <span className="text-sm text-white font-medium max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${userMenu ? "rotate-180" : ""}`} />
              </button>

              {userMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 text-gray-800 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      {user.role === "ADMIN" ? "Administrateur" : user.role === "SELLER" ? "Vendeur" : "Acheteur"}
                    </p>
                  </div>
                  <Link href="/profile" onClick={() => setUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    <User className="w-3.5 h-3.5 text-gray-400" /> Mon profil
                  </Link>
                  {(user.role === "SELLER" || user.role === "ADMIN") && (
                    <Link href={`/dashboard/${user.role.toLowerCase()}`} onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" /> Tableau de bord
                    </Link>
                  )}
                  {mounted && user && (
                    <Link href="/chat" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5 text-gray-400" /> Messages
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={() => { logout(); setUserMenu(false); }}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                      <LogOut className="w-3.5 h-3.5" /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              <Link href="/login" className="text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
                {t.nav.login}
              </Link>
              <Link href="/register" className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-primary hover:bg-red-600 transition-colors">
                {t.nav.register}
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── CATEGORY BAR ── */}
      <div className="hidden md:block border-t border-white/10 bg-[#0d2240]">
        <div className="container flex items-center gap-0.5 h-9 overflow-x-auto scrollbar-hide">
          <Link href="/products" className="text-xs text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-colors shrink-0 font-semibold">
            {lang === "ar" ? "كل المنتجات" : "Tout"}
          </Link>
          {CATEGORIES.map(c => (
            <Link key={c.slug} href={`/products?category=${c.slug}`}
              className="text-xs text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0">
              {lang === "ar" ? c.labelAr : c.label}
            </Link>
          ))}
          <Link href="/sellers" className="text-xs text-accent hover:text-yellow-300 px-3 py-1.5 shrink-0 ml-auto font-semibold transition-colors">
            {lang === "ar" ? "البائعون" : "Vendeurs"} →
          </Link>
        </div>
      </div>

      {/* ── MOBILE SEARCH ── */}
      <div className="md:hidden px-3 pb-2.5">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg overflow-hidden h-9">
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder={lang === "ar" ? "ابحث..." : "Rechercher..."}
            className="flex-1 px-3 text-sm text-gray-800 outline-none h-full" />
          <button type="submit" className="bg-primary h-full px-3 flex items-center">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d2240] border-t border-white/10">
          <nav className="container py-3 flex flex-col gap-0.5 text-sm">
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                {lang === "ar" ? c.labelAr : c.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-0.5">
              {mounted && user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"><User className="w-4 h-4" />Mon profil</Link>
                  {(user.role === "SELLER" || user.role === "ADMIN") && (
                    <Link href={`/dashboard/${user.role.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"><LayoutDashboard className="w-4 h-4" />Tableau de bord</Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 text-left transition-colors"><LogOut className="w-4 h-4" />Déconnexion</button>
                </>
              ) : mounted ? (
                <div className="flex gap-2 px-3 pt-1">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-white/20 text-white font-medium text-sm hover:bg-white/10">{t.nav.login}</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg bg-primary text-white font-bold text-sm">{t.nav.register}</Link>
                </div>
              ) : null}
            </div>
            <div className="px-3 pt-2">
              <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
                className="text-xs font-bold text-white/60 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                {lang === "fr" ? "ع AR" : "FR"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
