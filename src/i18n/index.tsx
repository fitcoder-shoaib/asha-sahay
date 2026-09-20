import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import en, { type Dict } from './en'
import hi from './hi'
import ml from './ml'

export type Lang = 'en' | 'hi' | 'ml'

/** Label shown in the language switcher, always in its own script. */
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'हि' },
  { code: 'ml', label: 'മലയാളം', short: 'മ' },
]

const DICTS: Record<Lang, Dict> = { en, hi, ml }

type Ctx = { t: Dict; lang: Lang; setLang: (l: Lang) => void }

const I18nContext = createContext<Ctx>({ t: en, lang: 'en', setLang: () => {} })

const STORE_KEY = 'asha.lang'

/** Storage can throw or be empty (private windows, blocked cookies) — never let it break render. */
function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORE_KEY)
    if (v === 'en' || v === 'hi' || v === 'ml') return v
  } catch {
    /* ignore */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORE_KEY, l)
    } catch {
      /* ignore */
    }
  }

  const value = useMemo(() => ({ t: DICTS[lang], lang, setLang }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** `const { t } = useT()` then `t.nav.home` — typed, so a missing key fails at build. */
export function useT() {
  return useContext(I18nContext)
}
