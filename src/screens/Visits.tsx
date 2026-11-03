import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight, Plus, Search } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { isUrgent, lastVisit } from '../data/patients'
import { useSession } from '../session'
import { dayLabel, fromIso } from '../lib/date'

export default function Visits() {
  const { t, lang } = useT()
  const { patients } = useSession()
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const matched = needle
      ? patients.filter(
          (p) =>
            pick(p.name, lang).toLowerCase().includes(needle) ||
            p.name.en.toLowerCase().includes(needle) ||
            pick(p.address, lang).toLowerCase().includes(needle),
        )
      : patients
    // urgent first, then most recently visited
    return [...matched].sort((a, b) => {
      if (isUrgent(a) !== isUrgent(b)) return isUrgent(a) ? -1 : 1
      return (lastVisit(b)?.date ?? '').localeCompare(lastVisit(a)?.date ?? '')
    })
  }, [q, lang, patients])

  const genderLabel = { male: t.visits.male, female: t.visits.female, other: t.visits.other }

  return (
    <div className="screen">
      <AppHeader title={t.visits.title} subtitle={`${patients.length} ${t.visits.patientsLabel}`} />

      <div className="vis__bar">
        <span className="vis__search">
          <Search size={17} className="faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.visits.searchPlaceholder}
            aria-label={t.common.search}
          />
        </span>
        <Link to="/visits/new" className="vis__new" aria-label={t.visits.newVisit}>
          <Plus size={22} />
        </Link>
      </div>

      <div className="scroll vis__list">
        {list.length === 0 ? (
          <p className="cal__empty">{t.visits.noneFound}</p>
        ) : (
          list.map((p) => {
            const lv = lastVisit(p)
            return (
              <Link key={p.id} to={`/visits/${p.id}`} className="pt">
                <span className={`pt__avatar ${isUrgent(p) ? 'pt__avatar--urgent' : ''}`}>
                  {pick(p.name, lang).trim().charAt(0)}
                </span>
                <span className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span className="pt__name">{pick(p.name, lang)}</span>
                  <span className="pt__meta">
                    {p.age} {t.visits.yrs} · {genderLabel[p.gender]}
                  </span>
                  <span className="pt__addr">{pick(p.address, lang)}</span>
                  {lv && (
                    <span className="pt__last">
                      {t.visits.lastVisit}: {dayLabel(fromIso(lv.date), lang)}
                    </span>
                  )}
                </span>
                {isUrgent(p) && (
                  <span className="pt__flag">
                    <AlertTriangle size={12} /> {t.visits.urgentFlag}
                  </span>
                )}
                <ChevronRight size={18} className="faint" />
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
