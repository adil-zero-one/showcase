import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ca } from './ca';
import { en, type Dict } from './en';
import { es } from './es';

export type Lang = 'es' | 'en' | 'ca';
export const LANGS: readonly Lang[] = ['es', 'en', 'ca'] as const;
const DICTS: Record<Lang, Dict> = { es, en, ca };
const STORAGE_KEY = 'ac-lang';

/** Replace {placeholders}: fmt('Showing {n}', { n: 3 }) → 'Showing 3'. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`));
}

/**
 * Default language: saved choice → browser language (if we support it) → Spanish.
 * Spanish is the safest default for recruiters around Tarragona–Reus; Catalan and
 * English are one click away and remembered afterwards.
 */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en' || saved === 'ca') return saved;
  } catch {
    /* storage blocked: fall through */
  }
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = l.slice(0, 2).toLowerCase();
    if (code === 'ca' || code === 'es' || code === 'en') return code;
  }
  return 'es';
}

interface I18n {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}
const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  // Keep <html lang> and <title> in sync, so screen readers and the tab agree.
  useEffect(() => {
    document.documentElement.lang = DICTS[lang].htmlLang;
    document.title = DICTS[lang].documentTitle;
  }, [lang]);

  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n must be used inside <I18nProvider>');
  return v;
}
