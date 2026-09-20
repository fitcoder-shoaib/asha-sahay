import type { Lang } from '../i18n'

const LOCALE: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN', ml: 'ml-IN' }

/** The app's "today". Fixed so the seeded demo data always lines up. */
export const TODAY = new Date(2026, 8, 20) // 20 Sep 2026

export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const monthLabel = (d: Date, lang: Lang) =>
  d.toLocaleDateString(LOCALE[lang], { month: 'long', year: 'numeric' })

export const dayLabel = (d: Date, lang: Lang) =>
  d.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short' })

export const fullDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' })

/** Weekday initials starting Monday, in the active language. */
export function weekdayInitials(lang: Lang) {
  const base = new Date(2026, 8, 21) // a Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    return d.toLocaleDateString(LOCALE[lang], { weekday: 'narrow' })
  })
}

/** 6x7 grid of dates covering the month, padded with neighbouring days. */
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // Monday-first
  const start = new Date(year, month, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function yearsSince(isoDate: string) {
  const from = fromIso(isoDate)
  let years = TODAY.getFullYear() - from.getFullYear()
  const m = TODAY.getMonth() - from.getMonth()
  if (m < 0 || (m === 0 && TODAY.getDate() < from.getDate())) years--
  return years
}

export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`
