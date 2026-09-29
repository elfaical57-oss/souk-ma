"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import useLangStore from "@/lib/stores/langStore";
import { cn } from "@/lib/cn";

export default function SearchBar({
  className,
  compact = false,
  idPrefix = "search",
}: {
  className?: string;
  compact?: boolean;
  idPrefix?: string;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();
  const { lang } = useLangStore();
  const searchId = `${idPrefix}-q`;
  const categoryId = `${idPrefix}-category`;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    if (category) params.set("category", category);
    router.push(`/products${params.toString() ? `?${params}` : ""}`);
  };

  const placeholder =
    lang === "ar"
      ? "ابحث عن منتج، مورد أو علامة..."
      : "Rechercher un produit, fournisseur, marque...";

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className={cn(
        "flex items-center bg-white overflow-hidden border border-slate-200",
        "focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15",
        "shadow-search transition-all duration-200",
        compact ? "h-10 rounded-xl" : "h-11 lg:h-12 rounded-xl",
        className
      )}
    >
      <label className="sr-only" htmlFor={searchId}>
        {placeholder}
      </label>
      <div className="hidden sm:flex items-center h-full shrink-0 border-r border-slate-200 bg-slate-50/80">
        <label htmlFor={categoryId} className="sr-only">
          {lang === "ar" ? "الفئة" : "Catégorie"}
        </label>
        <select
          id={categoryId}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-full bg-transparent text-[13px] font-medium text-slate-700 pl-3 pr-7 outline-none cursor-pointer max-w-[132px] appearance-none"
        >
          <option value="">{lang === "ar" ? "الفئات" : "Catégories"}</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {lang === "ar" ? c.labelAr : c.label}
            </option>
          ))}
        </select>
      </div>
      <input
        id={searchId}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1 min-w-0 px-3 sm:px-4 text-sm text-slate-800 outline-none h-full bg-transparent placeholder:text-slate-400"
      />
      <button
        type="submit"
        aria-label={lang === "ar" ? "بحث" : "Rechercher"}
        className={cn(
          "bg-accent hover:bg-accent-light h-full flex items-center justify-center transition-colors shrink-0",
          compact ? "px-3" : "px-4 sm:px-5"
        )}
      >
        <Search className="w-4 h-4 text-navy" aria-hidden="true" />
      </button>
    </form>
  );
}
