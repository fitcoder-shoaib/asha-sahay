import { TODAY, iso, monthKey, monthStart } from '../lib/date'

/**
 * The monthly fixed salary — the only thing the payments screen tracks.
 *
 * A month's salary is credited at the START of the following month, so each
 * new month opens with the previous month's update. Generated relative to the
 * real date rather than hard-coded, so the view never goes stale.
 */
export type SalaryStatus = 'paid' | 'pending' | 'delayed'

export type SalaryMonth = {
  /** YYYY-MM the salary is FOR. */
  month: string
  amount: number
  status: SalaryStatus
  /** When it should land: the 1st of the following month. */
  dueOn: string
  /** When it actually landed. Absent while pending. */
  creditedOn?: string
  /** Days past dueOn — how late it arrived, or how overdue it still is. */
  lateBy?: number
}

const AMOUNT = 7000

/** How many months back the history runs. */
const HISTORY = 12

/**
 * Stable pseudo-random so the same month always gets the same story across
 * reloads — a real delay pattern, not a different one every refresh.
 */
function seeded(key: string) {
  let h = 2166136261
  for (const c of key) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function build(): SalaryMonth[] {
  const out: SalaryMonth[] = []

  for (let i = HISTORY; i >= 0; i--) {
    const forMonth = monthStart(-i)
    const key = monthKey(forMonth)
    const due = monthStart(-i + 1) // 1st of the following month
    const dueOn = iso(due)

    // Nothing can be credited before its due date.
    if (due > TODAY) {
      out.push({ month: key, amount: AMOUNT, status: 'pending', dueOn })
      continue
    }

    const roll = seeded(key) % 10
    // Roughly one month in four runs late; the rest land within a few days.
    const late = roll < 3
    const offset = late ? 9 + (roll % 3) * 5 : roll % 5

    const credited = new Date(due)
    credited.setDate(due.getDate() + offset)

    // Not in her hands yet. Stays 'pending' however overdue it is — 'delayed'
    // is reserved for money that did arrive, just late. A worker needs to tell
    // "came late" from "still missing" at a glance.
    if (credited > TODAY) {
      const overdue = Math.round((TODAY.getTime() - due.getTime()) / 86_400_000)
      out.push({
        month: key,
        amount: AMOUNT,
        status: 'pending',
        dueOn,
        ...(overdue > 0 ? { lateBy: overdue } : {}),
      })
      continue
    }

    out.push({
      month: key,
      amount: AMOUNT,
      status: late ? 'delayed' : 'paid',
      dueOn,
      creditedOn: iso(credited),
      ...(late ? { lateBy: offset } : {}),
    })
  }

  return out
}

export const salary: SalaryMonth[] = build()

export const salaryFor = (year: number, month: number) =>
  salary.find((s) => s.month === `${year}-${String(month + 1).padStart(2, '0')}`)

/** Salary rows whose due date falls in the given month — what the calendar marks. */
export const salaryDueIn = (year: number, month: number) =>
  salary.filter((s) => {
    const [y, m] = s.dueOn.split('-').map(Number)
    return y === year && m - 1 === month
  })

export const salaryDueOn = (isoDate: string) => salary.filter((s) => s.dueOn === isoDate)

export const totalBy = (status: SalaryStatus) =>
  salary.filter((s) => s.status === status).reduce((a, s) => a + s.amount, 0)

export const countBy = (status: SalaryStatus) => salary.filter((s) => s.status === status).length
