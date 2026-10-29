"use client";

import { createContext, useContext } from "react";

type Locale = "fr" | "ar";

const LocaleContext = createContext<Locale>("fr");

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={initialLocale}>{children}</LocaleContext.Provider>;
}

export function useServerLocale(): Locale {
  return useContext(LocaleContext);
}
