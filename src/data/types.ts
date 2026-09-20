import type { Lang } from '../i18n'

/** A mock-data string that exists in all three languages. */
export type L = Record<Lang, string>

export const pick = (v: L, lang: Lang) => v[lang]
