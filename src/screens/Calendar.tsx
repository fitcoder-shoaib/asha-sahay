import { useEffect, useMemo, useState } from 'react'
import {
  BadgeIndianRupee, CalendarClock, Check, ChevronLeft, ChevronRight, Clock, Hourglass,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import {
  countBy, salary, salaryFor, totalBy, type SalaryMonth, type SalaryStatus,
} from '../data/salary'
import { TODAY, fromIso, fullDate, monthLabel, rupees, shortMonth } from '../lib/date'

function salaryLabel(s: SalaryStatus, t: ReturnType<typeof useT>['t']) {
  return {
    paid: t.calendar.salaryPaid,
    pending: t.calendar.salaryPending,
    delayed: t.calendar.salaryDelayed,
  }[s]
}

/**
 * A year at a glance rather than a day grid. Salary always lands on the 1st,
 * so a month calendar spent most of its space showing a single dot; twelve
 * month cells carry twelve facts in the same room.
 */
export default function Calendar() {
  const { t, lang } = useT()

  const [year, setYear] = useState(TODAY.getFullYear())
  const [selected, setSelected] = useState(TODAY.getMonth())

  // Only offer years we actually hold a record for.
  const years = useMemo(() => {
    const ys = new Set(salary.map((s) => Number(s.month.split('-')[0])))
    return [...ys].sort((a, b) => a - b)
  }, [])
  const minYear = years[0] ?? TODAY.getFullYear()
  const maxYear = years[years.length - 1] ?? TODAY.getFullYear()

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, m) => ({ m, row: salaryFor(year, m) })),
    [year],
  )

  const current = salaryFor(year, selected)

  // Changing year can land on a month with no record — fall back to the latest
  // month that has one, so the lower half is never pointlessly empty.
  useEffect(() => {
    if (salaryFor(year, selected)) return
    const last = months.filter((x) => x.row).pop()
    if (last) setSelected(last.m)
  }, [year, selected, months])

  return (
    <div className="screen">
      <AppHeader title={t.calendar.title} subtitle={`${t.calendar.salaryStatus} · ${year}`} />

      <div className="cal">
        {/* ---------- upper half: the year at a glance ---------- */}
        <section className="cal__top">
          <div className="cal__totals">
            <Total label={t.calendar.salaryPaid} value={totalBy('paid')} n={countBy('paid')} tone="paid" />
            <Total label={t.calendar.salaryDelayed} value={totalBy('delayed')} n={countBy('delayed')} tone="delayed" />
            <Total label={t.calendar.salaryPending} value={totalBy('pending')} n={countBy('pending')} tone="pending" />
          </div>

          <div className="yr__nav">
            <button
              className="cal__navBtn"
              onClick={() => setYear(year - 1)}
              disabled={year <= minYear}
              aria-label={t.common.back}
            >
              <ChevronLeft size={19} />
            </button>
            <span className="yr__label">{year}</span>
            <button
              className="cal__navBtn"
              onClick={() => setYear(year + 1)}
              disabled={year >= maxYear}
              aria-label={t.common.next}
            >
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="yr__grid">
            {months.map(({ m, row }) => {
              const isNow = year === TODAY.getFullYear() && m === TODAY.getMonth()
              return (
                <button
                  key={m}
                  className={[
                    'yr__cell',
                    row ? `yr__cell--${row.status}` : 'yr__cell--none',
                    selected === m && row ? 'yr__cell--sel' : '',
                    isNow ? 'yr__cell--now' : '',
                  ].join(' ')}
                  disabled={!row}
                  onClick={() => setSelected(m)}
                >
                  <span className="yr__cellMonth">{shortMonth(new Date(year, m, 1), lang)}</span>
                  <span className="yr__cellState">{row ? salaryLabel(row.status, t) : '—'}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ---------- lower half: the written record ---------- */}
        <section className="cal__bottom">
          <div className="cal__listHead">
            <h2 className="cal__listTitle">
              {t.calendar.salaryForMonth}{' '}
              <span className="cal__listWhen">
                {monthLabel(new Date(year, selected, 1), lang)}
              </span>
            </h2>
          </div>

          <div className="scroll cal__list">
            {current ? (
              <SalaryRow row={current} />
            ) : (
              <p className="cal__empty">{t.calendar.noneForMonth}</p>
            )}

            <p className="cal__note">{t.calendar.transparencyNote}</p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Total({
  label, value, n, tone,
}: { label: string; value: number; n: number; tone: string }) {
  return (
    <div className={`cal__total cal__total--${tone}`}>
      <span className="cal__totalLabel">
        {label} · {n}
      </span>
      <span className="cal__totalValue">{rupees(value)}</span>
    </div>
  )
}

function SalaryRow({ row }: { row: SalaryMonth }) {
  const { t, lang } = useT()

  const icon = {
    paid: <Check size={15} strokeWidth={3} />,
    delayed: <Clock size={15} />,
    pending: <Hourglass size={15} />,
  }[row.status]

  return (
    <article className={`sal sal--${row.status}`}>
      <div className="sal__head">
        <span className="sal__icon">{icon}</span>
        <div className="col" style={{ flex: 1, minWidth: 0 }}>
          <span className="sal__month">{salaryLabel(row.status, t)}</span>
          <span className="sal__state">{t.calendar.salaryStatus}</span>
        </div>
        <span className="sal__amount">
          <BadgeIndianRupee size={15} />
          {row.amount.toLocaleString('en-IN')}
        </span>
      </div>

      <dl className="sal__rows">
        <div>
          <dt><CalendarClock size={12} /> {t.calendar.dueOn}</dt>
          <dd>{fullDate(fromIso(row.dueOn), lang)}</dd>
        </div>

        {row.creditedOn && (
          <div>
            <dt><Check size={12} /> {t.calendar.creditedOn}</dt>
            <dd>{fullDate(fromIso(row.creditedOn), lang)}</dd>
          </div>
        )}

        {row.status === 'delayed' && row.lateBy !== undefined && (
          <div>
            <dt><Clock size={12} /> {t.calendar.lateBy}</dt>
            <dd className="sal__late">
              {row.lateBy} {t.calendar.salaryDays}
            </dd>
          </div>
        )}

        {row.status === 'pending' && (
          <div>
            <dt><Hourglass size={12} /> {t.calendar.awaiting}</dt>
            <dd>{t.calendar.awaitingSub}</dd>
          </div>
        )}

        {row.status === 'pending' && row.lateBy !== undefined && (
          <div>
            <dt><Clock size={12} /> {t.calendar.overdueBy}</dt>
            <dd className="sal__late">
              {row.lateBy} {t.calendar.salaryDays}
            </dd>
          </div>
        )}
      </dl>
    </article>
  )
}
