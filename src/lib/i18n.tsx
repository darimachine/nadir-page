import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'bg' | 'en';
type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx>({ lang: 'bg', setLang: () => {} });

const KEY = 'nadir.lang';
function initial(): Lang {
  try {
    const s = localStorage.getItem(KEY);
    if (s === 'bg' || s === 'en') return s;
  } catch {}
  return 'bg';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/** t('български', 'English') — every visible string is written in both languages side by side. */
export function useT() {
  const { lang } = useLang();
  return <T,>(bg: T, en: T): T => (lang === 'bg' ? bg : en);
}

export function useNum() {
  const { lang } = useLang();
  return (n: number, digits = 0) =>
    n.toLocaleString(lang === 'bg' ? 'bg-BG' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
