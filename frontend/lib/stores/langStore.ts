import { create } from "zustand";
import { persist } from "zustand/middleware";
import fr from "@/messages/fr.json";
import ar from "@/messages/ar.json";
import { useServerLocale } from "@/lib/locale/LocaleProvider";

type Lang = "fr" | "ar";

const messages = { fr, ar };

interface LangStore {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: typeof fr;
  // Whether the visitor has actually clicked the language switcher this
  // session/before, vs. just inheriting whatever the current URL's locale
  // is. Only an explicit choice should override the URL's own language —
  // otherwise a stale localStorage value would make e.g. /ar render French
  // for a returning visitor, which defeats the point of having /ar be a
  // real, server-correct Arabic page.
  explicit: boolean;
  setLang: (lang: Lang) => void;
}

const useLangStoreRaw = create<LangStore>()(
  persist(
    (set) => ({
      lang: "fr",
      dir: "ltr",
      t: fr,
      explicit: false,
      setLang: (lang) =>
        set({
          lang,
          dir: lang === "ar" ? "rtl" : "ltr",
          t: messages[lang],
          explicit: true,
        }),
    }),
    {
      name: "jemla-lang",
      partialize: (state) => ({ lang: state.lang, explicit: state.explicit }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Back-fill for anyone who had a preference saved before the
          // `explicit` flag existed, so they don't silently get reset to
          // French on their next visit.
          if (state.explicit === undefined) state.explicit = state.lang === "ar";
          state.t   = messages[state.lang];
          state.dir = state.lang === "ar" ? "rtl" : "ltr";
        }
      },
    }
  )
);

// Same shape/signature as the old plain store (`const { t, lang, dir } =
// useLangStore()`), so none of the existing call sites change. The
// difference: until the visitor has explicitly switched languages, this
// defers to the server-resolved locale for the current URL (e.g. "ar" on
// /ar) instead of a possibly-stale persisted preference — which is what
// makes /ar actually render Arabic on a fresh visit, server-side, for
// crawlers included.
export default function useLangStore(): LangStore {
  const serverLocale = useServerLocale();
  const store = useLangStoreRaw();
  if (!store.explicit) {
    return {
      lang: serverLocale,
      dir: serverLocale === "ar" ? "rtl" : "ltr",
      t: messages[serverLocale],
      explicit: false,
      setLang: store.setLang,
    };
  }
  return store;
}
