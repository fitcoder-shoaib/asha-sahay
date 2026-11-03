import { useMemo, useState } from 'react'
import {
  BadgeIndianRupee, CalendarClock, Check, ChevronLeft, ChevronRight, Clock, Hourglass,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import {
  countBy, salary, salaryDueIn, totalBy, type SalaryMonth, type SalaryStatus,
} from '../data/salary'
import {
  TODAY, dayLabel, fromIso, fullDate, fullDateTime, iso, monthGrid, monthLabel,
  rupees, sameDay, weekdayInitials,
} from '../lib/date'

/** What a dot on a day means: the salary was due, or it actually arrived. */
type Mark = { kind: 'due'; status: SalaryStatus } | { kind: 'credited' }

function salaryLabel(s: SalaryStatus, t: ReturnType<typeof useT>['t']) {
  return {
    paid: t.calendar.salaryPaid,
    pending: t.calendar.salaryPending,
    delayed: t.calendar.salaryDelayed,
    upcoming: t.calendar.salaryUpcoming,
  }[s]
}

/** Months this record touches — the day it was due and the day it landed. */
function touches(row: SalaryMonth) {
  const days = [row.dueOn]
  if (row.creditedOn && row.creditedOn !== row.dueOn) days.push(row.creditedOn)
  return days
}

export default function Calendar() {
  const { t, lang } = useT()
  const [cursor, setCursor] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)

  const grid = useMemo(() => monthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  /**
   * Two marks per salary: the 1st, when it was due, and the day it was
   * actually credited. The gap between them is the thing worth seeing.
   */
  const byDay = useMemo(() => {
    const map = new Map<string, Mark[]>()
    const add = (day: string, mark: Mark) => {
      const cur = map.get(day) ?? []
      if (!cur.some((x) => x.kind === mark.kind)) cur.push(mark)
      map.set(day, cur)
    }
    for (const row of salary) {
      add(row.dueOn, { kind: 'due', status: row.status })
      if (row.creditedOn) add(row.creditedOn, { kind: 'credited' })
    }
    return map
  }, [])

  const listed = useMemo(() => {
    // A month shows the salary paid in it, so the card matches the dots above.
    const rows = selected
      ? salary.filter((r) => touches(r).includes(selected))
      : salaryDueIn(cursor.getFullYear(), cursor.getMonth())
    return [...rows].sort((a, b) => b.month.localeCompare(a.month))
  }, [cursor, selected])

  const shiftMonth = (by: number) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + by, 1))
    setSelected(null)
  }

  return (
    <div className="screen">
      <AppHeader title={t.calendar.title} subtitle={t.calendar.salaryStatus} />

      <div className="cal">
        {/* ---------- upper half: the calendar ---------- */}
        <section className="cal__top">
          <div className="cal__totals">
            <Total label={t.calendar.salaryPaid} value={totalBy('paid')} n={countBy('paid')} tone="paid" />
            <Total label={t.calendar.salaryDelayed} value={totalBy('delayed')} n={countBy('delayed')} tone="delayed" />
            <Total label={t.calendar.salaryPending} value={totalBy('pending')} n={countBy('pending')} tone="pending" />
          </div>

          <div className="cal__nav">
            <button className="cal__navBtn" onClick={() => shiftMonth(-1)} aria-label={t.common.back}>
              <ChevronLeft size={19} />
            </button>
            <span className="cal__navLabel">{monthLabel(cursor, lang)}</span>
            <button className="cal__navBtn" onClick={() => shiftMonth(1)} aria-label={t.common.next}>
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="cal__week">
            {weekdayInitials(lang).map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="cal__grid">
            {grid.map((d) => {
              const key = iso(d)
              const outside = d.getMonth() !== cursor.getMonth()
              const marks = byDay.get(key) ?? []
              return (
                <button
                  key={key}
                  className={[
                    'cal__day',
                    outside ? 'cal__day--out' : '',
                    sameDay(d, TODAY) ? 'cal__day--today' : '',
                    selected === key ? 'cal__day--sel' : '',
                  ].join(' ')}
                  onClick={() => setSelected(selected === key ? null : key)}
                >
                  <span className="cal__dayNum">{d.getDate()}</span>
                  <span className="cal__dots">
                    {marks.map((mk) => (
                      <i
                        key={mk.kind}
                        className={
                          mk.kind === 'credited'
                            ? 'cal__dot cal__dot--credited'
                            : `cal__dot cal__dot--${mk.status}`
                        }
                      />
                    ))}
                  </span>
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
                {selected ? dayLabel(fromIso(selected), lang) : monthLabel(cursor, lang)}
              </span>
            </h2>
            <span className="cal__listCount">{listed.length}</span>
          </div>

          <div className="cal__legend">
            <span>
              <i className={`cal__dot cal__dot--${listed[0]?.status ?? 'pending'}`} />
              {t.calendar.legendDue}
            </span>
            <span><i className="cal__dot cal__dot--credited" /> {t.calendar.legendCredited}</span>
          </div>

          <div className="scroll cal__list">
            {listed.length === 0 ? (
              <p className="cal__empty">
                {selected ? t.calendar.noneForDay : t.calendar.noneForMonth}
              </p>
            ) : (
              listed.map((row) => <SalaryRow key={row.month} row={row} />)
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
  // Titled by the month it is paid in — the month the calendar is showing.
  const due = fromIso(row.dueOn)

  const icon = {
    paid: <Check size={15} strokeWidth={3} />,
    delayed: <Clock size={15} />,
    pending: <Hourglass size={15} />,
    upcoming: <CalendarClock size={15} />,
  }[row.status]

  return (
    <article className={`sal sal--${row.status}`}>
      <div className="sal__head">
        <span className="sal__icon">{icon}</span>
        <div className="col" style={{ flex: 1, minWidth: 0 }}>
          <span className="sal__month">{monthLabel(due, lang)}</span>
          <span className="sal__state">{salaryLabel(row.status, t)}</span>
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
            <dd>
              {row.creditedTime
                ? fullDateTime(fromIso(row.creditedOn), row.creditedTime, lang)
                : fullDate(fromIso(row.creditedOn), lang)}
            </dd>
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

        {row.status === 'upcoming' && (
          <div>
            <dt><CalendarClock size={12} /> {t.calendar.salaryUpcoming}</dt>
            <dd>{t.calendar.upcomingSub}</dd>
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
