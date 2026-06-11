import { create } from "zustand";
import { persist } from "zustand/middleware";
import fr from "@/messages/fr.json";
import ar from "@/messages/ar.json";

type Lang = "fr" | "ar";

const messages = { fr, ar };

interface LangStore {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: typeof fr;
  setLang: (lang: Lang) => void;
}

const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: "fr",
      dir: "ltr",
      t: fr,
      setLang: (lang) =>
        set({
          lang,
          dir: lang === "ar" ? "rtl" : "ltr",
          t: messages[lang],
        }),
    }),
    {
      name: "jemla-lang",
      partialize: (state) => ({ lang: state.lang }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t   = messages[state.lang];
          state.dir = state.lang === "ar" ? "rtl" : "ltr";
        }
      },
    }
  )
);

export default useLangStore;
