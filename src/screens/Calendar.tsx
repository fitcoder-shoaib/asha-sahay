import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import StatusChip from '../components/StatusChip'
import { useT } from '../i18n'
import { pick } from '../data/types'
import {
  payments, paymentsInMonth, sumBy, STATUS_ORDER, type PayStatus, type Payment,
} from '../data/payments'
import {
  TODAY, dayLabel, fromIso, iso, monthGrid, monthLabel, rupees, sameDay, weekdayInitials,
} from '../lib/date'

type Filter = 'all' | PayStatus

export default function Calendar() {
  const { t, lang } = useT()
  const [cursor, setCursor] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const grid = useMemo(() => monthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])
  const monthPayments = useMemo(
    () => paymentsInMonth(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  )

  // Dots per day, built in a stable status order so colours never reshuffle.
  const byDay = useMemo(() => {
    const map = new Map<string, PayStatus[]>()
    for (const s of STATUS_ORDER) {
      for (const x of payments) {
        if (x.status !== s) continue
        const cur = map.get(x.date) ?? []
        if (!cur.includes(s)) cur.push(s)
        map.set(x.date, cur)
      }
    }
    return map
  }, [])

  const totals = {
    upcoming: sumBy(monthPayments, 'upcoming'),
    pending: sumBy(monthPayments, 'pending'),
    process: sumBy(monthPayments, 'process'),
    received: sumBy(monthPayments, 'received'),
  }

  const listed = useMemo(() => {
    const base = selected ? payments.filter((x) => x.date === selected) : monthPayments
    const out = filter === 'all' ? base : base.filter((x) => x.status === filter)
    return [...out].sort((a, b) => a.date.localeCompare(b.date))
  }, [selected, monthPayments, filter])

  const shiftMonth = (by: number) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + by, 1))
    setSelected(null)
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t.common.all },
    { key: 'upcoming', label: t.calendar.upcoming },
    { key: 'pending', label: t.calendar.pending },
    { key: 'process', label: t.calendar.inProcess },
    { key: 'received', label: t.calendar.received },
  ]

  return (
    <div className="screen">
      <AppHeader
        title={t.calendar.title}
        subtitle={`${t.calendar.received} ${rupees(totals.received)} · ${monthLabel(cursor, lang)}`}
      />

      <div className="cal">
        {/* ---------- upper half: the calendar ---------- */}
        <section className="cal__top">
          <div className="cal__totals">
            <Total label={t.calendar.upcoming} value={totals.upcoming} tone="upcoming" />
            <Total label={t.calendar.pending} value={totals.pending} tone="pending" />
            <Total label={t.calendar.inProcess} value={totals.process} tone="process" />
          </div>

          <div className="cal__nav">
            <button className="cal__navBtn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <span className="cal__month">{monthLabel(cursor, lang)}</span>
            <button className="cal__navBtn" onClick={() => shiftMonth(1)} aria-label="Next month">
              <ChevronRight size={20} />
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

        {/* ---------- lower half: the written list ---------- */}
        <section className="cal__bottom">
          <div className="cal__listHead">
            <h2 className="cal__listTitle">
              {t.calendar.entriesFor}{' '}
              <span className="cal__listWhen">
                {selected ? dayLabel(fromIso(selected), lang) : t.calendar.wholeMonth}
              </span>
            </h2>
            <span className="cal__listCount">{listed.length}</span>
          </div>

          <div className="cal__filters">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`cal__filter ${filter === f.key ? 'cal__filter--on' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="scroll cal__list">
            {listed.length === 0 ? (
              <p className="cal__empty">
                {filter === 'all' ? t.calendar.noneForDay : t.calendar.noneForFilter}
              </p>
            ) : (
              listed.map((x) => (
                <PayRow
                  key={x.id}
                  item={x}
                  open={openId === x.id}
                  onToggle={() => setOpenId(openId === x.id ? null : x.id)}
                  showDate={!selected}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Total({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`cal__total cal__total--${tone}`}>
      <span className="cal__totalLabel">{label}</span>
      <span className="cal__totalValue">{rupees(value)}</span>
    </div>
  )
}

function PayRow({
  item,
  open,
  onToggle,
  showDate,
}: {
  item: Payment
  open: boolean
  onToggle: () => void
  showDate: boolean
}) {
  const { t, lang } = useT()
  return (
    <button className="pay" onClick={onToggle}>
      <span className={`pay__bar pay__bar--${item.status}`} />
      <span className="pay__body">
        <span className="pay__top">
          <span className="pay__name">{pick(item.scheme, lang)}</span>
          <span className="pay__amt">{rupees(item.amount)}</span>
        </span>
        <span className="pay__meta">
          <StatusChip status={item.status} />
          {showDate && <span className="pay__date">{dayLabel(fromIso(item.date), lang)}</span>}
        </span>
        {open && (
          <span className="pay__detail fade-in">
            {item.units} {t.calendar.units} {t.calendar.rate} {rupees(item.rate)}
          </span>
        )}
      </span>
    </button>
  )
}
