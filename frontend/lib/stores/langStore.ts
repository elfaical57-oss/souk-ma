import { create } from "zustand";
import fr from "@/messages/fr.json";
import ar from "@/messages/ar.json";

type Lang = "fr" | "ar";

const messages = { fr, ar };

type DeepValue<T> = T extends object ? { [K in keyof T]: DeepValue<T[K]> } : string;

interface LangStore {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: typeof fr;
  setLang: (lang: Lang) => void;
}

const useLangStore = create<LangStore>((set) => ({
  lang: "fr",
  dir: "ltr",
  t: fr,
  setLang: (lang) =>
    set({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: messages[lang],
    }),
}));

export default useLangStore;
