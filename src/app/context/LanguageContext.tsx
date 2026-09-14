import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, categoryLabel, type Lang } from "../../lib/i18n";

const STORAGE_KEY = "martani-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
  tCat: (value: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "id";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" ? "en" : "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((prev) => (prev === "id" ? "en" : "id"));
  const t = (key: string) => translate(lang, key);
  const tCat = (value: string) => categoryLabel(lang, value);

  const value: LanguageContextValue = { lang, setLang, toggle, t, tCat };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
