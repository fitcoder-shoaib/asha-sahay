/**
 * Monthly fixed-salary status, separate from the per-scheme incentive payments.
 * This is the thing a worker actually worries about: did this month land or not.
 */
export type SalaryStatus = 'paid' | 'pending' | 'delayed'

export type SalaryMonth = {
  /** YYYY-MM */
  month: string
  amount: number
  status: SalaryStatus
  /** Days late, only meaningful when status is 'delayed'. */
  lateBy?: number
  creditedOn?: string
}

export const salary: SalaryMonth[] = [
  { month: '2026-04', amount: 7000, status: 'paid', creditedOn: '2026-05-04' },
  { month: '2026-05', amount: 7000, status: 'delayed', lateBy: 18, creditedOn: '2026-06-24' },
  { month: '2026-06', amount: 7000, status: 'paid', creditedOn: '2026-07-03' },
  { month: '2026-07', amount: 7000, status: 'paid', creditedOn: '2026-08-05' },
  { month: '2026-08', amount: 7000, status: 'delayed', lateBy: 11, creditedOn: '2026-09-16' },
  { month: '2026-09', amount: 7000, status: 'pending' },
]

export const salaryFor = (year: number, month: number) =>
  salary.find((s) => s.month === `${year}-${String(month + 1).padStart(2, '0')}`)
