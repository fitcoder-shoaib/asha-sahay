import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BadgeIndianRupee, CalendarClock, Check, ChevronLeft, ChevronRight, Clock, Hourglass,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import {
  countBy, salary, salaryDueIn, salaryDueOn, totalBy,
  type SalaryMonth, type SalaryStatus,
} from '../data/salary'
import {
  TODAY, dayLabel, fromIso, fullDate, iso, monthGrid, monthLabel, rupees, sameDay,
  shortMonth, weekdayInitials,
} from '../lib/date'

const STATUS_ORDER: SalaryStatus[] = ['paid', 'delayed', 'pending']

function salaryLabel(s: SalaryStatus, t: ReturnType<typeof useT>['t']) {
  return {
    paid: t.calendar.salaryPaid,
    pending: t.calendar.salaryPending,
    delayed: t.calendar.salaryDelayed,
  }[s]
}

export default function Calendar() {
  const { t, lang } = useT()
  const [cursor, setCursor] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)

  // Keep the month being viewed centred in the salary strip. Done by setting
  // scrollLeft rather than scrollIntoView: that also scrolls ancestors, and it
  // lands short when it runs before web fonts have settled the strip's width.
  const salaryRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const centre = () => {
      const strip = salaryRef.current
      const on = strip?.querySelector<HTMLElement>('.cal__salaryItem--on')
      if (!strip || !on) return
      const target = on.offsetLeft - strip.clientWidth / 2 + on.offsetWidth / 2
      const max = strip.scrollWidth - strip.clientWidth
      strip.scrollTo({ left: Math.min(Math.max(0, target), max), behavior: 'smooth' })
    }

    const id = setTimeout(centre, 0)
    // Font loading changes the chip widths, so re-centre once that settles.
    document.fonts?.ready.then(centre).catch(() => {})
    return () => clearTimeout(id)
  }, [cursor])

  const grid = useMemo(() => monthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  /**
   * Salary lands on the 1st of the month, so the calendar marks due dates —
   * one dot per month, coloured by whether that salary actually arrived.
   */
  const byDay = useMemo(() => {
    const map = new Map<string, SalaryStatus[]>()
    for (const s of STATUS_ORDER) {
      for (const row of salary) {
        if (row.status !== s) continue
        const cur = map.get(row.dueOn) ?? []
        if (!cur.includes(s)) cur.push(s)
        map.set(row.dueOn, cur)
      }
    }
    return map
  }, [])

  // Rows whose credit was due in the month on screen (or on the chosen day).
  const listed = useMemo(() => {
    const base = selected
      ? salaryDueOn(selected)
      : salaryDueIn(cursor.getFullYear(), cursor.getMonth())
    return [...base].sort((a, b) => b.month.localeCompare(a.month))
  }, [selected, cursor])

  const shiftMonth = (by: number) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + by, 1))
    setSelected(null)
  }

  return (
    <div className="screen">
      <AppHeader title={t.calendar.title} subtitle={monthLabel(cursor, lang)} />

      <div className="cal">
        {/* ---------- upper half: the calendar ---------- */}
        <section className="cal__top">
          {/* lifetime salary position, so the record is visible at a glance */}
          <div className="cal__totals">
            <Total label={t.calendar.salaryPaid} value={totalBy('paid')} n={countBy('paid')} tone="paid" />
            <Total label={t.calendar.salaryDelayed} value={totalBy('delayed')} n={countBy('delayed')} tone="delayed" />
            <Total label={t.calendar.salaryPending} value={totalBy('pending')} n={countBy('pending')} tone="pending" />
          </div>

          {/* month navigation and salary status share one row: the upper half is
              a fixed 50%, so every extra row is stolen from the grid */}
          <div className="cal__months">
            <button className="cal__navBtn" onClick={() => shiftMonth(-1)} aria-label={t.common.back}>
              <ChevronLeft size={19} />
            </button>

            <div className="cal__salary" ref={salaryRef}>
              {salary.map((m) => {
                const [y, mo] = m.month.split('-').map(Number)
                // The chip is labelled with the month earned, but selects the
                // month it lands in — otherwise tapping "Aug" would list July.
                const [dy, dm] = m.dueOn.split('-').map(Number)
                const on = cursor.getFullYear() === dy && cursor.getMonth() === dm - 1
                return (
                  <button
                    key={m.month}
                    className={`cal__salaryItem cal__salaryItem--${m.status} ${on ? 'cal__salaryItem--on' : ''}`}
                    onClick={() => {
                      setCursor(new Date(dy, dm - 1, 1))
                      setSelected(null)
                    }}
                  >
                    <span className="cal__salaryMonth">
                      {shortMonth(new Date(y, mo - 1, 1), lang)}
                    </span>
                    <span className="cal__salaryState">{salaryLabel(m.status, t)}</span>
                  </button>
                )
              })}
            </div>

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
              const dots = byDay.get(key) ?? []
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
                    {dots.slice(0, 3).map((s) => (
                      <i key={s} className={`cal__dot cal__dot--${s}`} />
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
              {t.calendar.creditedIn}{' '}
              <span className="cal__listWhen">
                {selected ? dayLabel(fromIso(selected), lang) : monthLabel(cursor, lang)}
              </span>
            </h2>
            <span className="cal__listCount">{listed.length}</span>
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
  const [y, m] = row.month.split('-').map(Number)
  const forMonth = new Date(y, m - 1, 1)

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
          <span className="sal__month">{monthLabel(forMonth, lang)}</span>
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
