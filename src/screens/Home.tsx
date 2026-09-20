import { Link } from 'react-router-dom'
import {
  AlertTriangle, BrainCircuit, Check, ChevronRight, Clock, IdCard, ListChecks,
  Stethoscope, Wallet,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { profile } from '../data/profile'
import { payments, sumBy } from '../data/payments'
import { patients, isUrgent } from '../data/patients'
import { POINTS_BALANCE } from '../data/rewards'
import { tasks } from '../data/tasks'
import { TODAY, fromIso, fullDate, rupees } from '../lib/date'

export default function Home() {
  const { t, lang } = useT()

  // Real clock, not the pinned demo date: the greeting should match the room.
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.home.morning : hour < 17 ? t.home.afternoon : t.home.evening

  const owed = sumBy(payments, 'pending') + sumBy(payments, 'process')
  const weekCutoff = new Date(TODAY)
  weekCutoff.setDate(TODAY.getDate() - 7)
  const visitsThisWeek = patients.filter(
    (p) => p.visits[0] && fromIso(p.visits[0].date) >= weekCutoff,
  ).length
  const urgent = patients.filter(isUrgent)

  const total = tasks.length
  const doneCount = tasks.filter((x) => x.done).length
  const taskStats = {
    total,
    done: doneCount,
    left: total - doneCount,
    pct: Math.round((doneCount / total) * 100),
  }
  const nextTasks = tasks.filter((x) => !x.done).slice(0, 2)

  return (
    <div className="screen">
      <AppHeader
        title={`${greeting}, ${pick(profile.name, lang)}`}
        subtitle={`${t.home.role} · ${profile.ashaId}`}
      />

      <div className="scroll pad home">
        <p className="home__date">{fullDate(TODAY, lang)}</p>

        <div className="home__stats">
          <Stat icon={<Wallet size={18} />} label={t.home.pendingTitle} value={rupees(owed)} to="/calendar" />
          <Stat icon={<Stethoscope size={18} />} label={t.home.visitsTitle} value={String(visitsThisWeek)} to="/visits" />
          <Stat icon={<BrainCircuit size={18} />} label={t.home.streakTitle} value={POINTS_BALANCE.toLocaleString('en-IN')} to="/quiz" />
        </div>

        {urgent.length > 0 && (
          <Link to="/visits" className="home__urgent">
            <span className="home__urgentIcon"><AlertTriangle size={20} /></span>
            <span className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="home__urgentTitle">{t.home.urgentTitle}</span>
              <span className="home__urgentBody">
                {urgent.length} {t.home.urgentBody}
              </span>
            </span>
            <ChevronRight size={20} />
          </Link>
        )}

        {/* today's tasks */}
        <h2 className="section-title" style={{ marginTop: 18 }}>{t.tasks.title}</h2>
        <Link to="/tasks" className="tkCard">
          <div className="tkCard__top">
            <span className="tkCard__icon"><ListChecks size={19} /></span>
            <span className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="tkCard__count">
                {taskStats.left} {t.tasks.remaining}
              </span>
              <span className="tkCard__sub">
                {taskStats.done} / {taskStats.total} {t.tasks.doneWord}
              </span>
            </span>
            <ChevronRight size={18} className="faint" />
          </div>

          <div className="tkCard__bar">
            <span className="tkCard__barFill" style={{ width: `${taskStats.pct}%` }} />
          </div>

          <ul className="tkCard__next">
            {nextTasks.map((x) => (
              <li key={x.id}>
                <span className="tkCard__time"><Clock size={11} /> {x.time}</span>
                <span className="tkCard__title">{pick(x.title, lang)}</span>
              </li>
            ))}
            {nextTasks.length === 0 && (
              <li className="tkCard__clear">
                <Check size={13} strokeWidth={3} /> {t.tasks.allDone}
              </li>
            )}
          </ul>
        </Link>

        <h2 className="section-title" style={{ marginTop: 18 }}>{t.home.quickActions}</h2>
        <div className="home__actions">
          <Action to="/visits/new" icon={<Stethoscope size={22} />} label={t.home.newVisit} tone="primary" />
          <Action to="/quiz" icon={<BrainCircuit size={22} />} label={t.home.todayQuiz} tone="accent" />
          <Action to="/profile/qr" icon={<IdCard size={22} />} label={t.home.myId} tone="plain" />
        </div>
      </div>
    </div>
  )
}

function Stat({
  icon, label, value, to,
}: { icon: React.ReactNode; label: string; value: string; to: string }) {
  return (
    <Link to={to} className="stat">
      <span className="stat__icon">{icon}</span>
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </Link>
  )
}

function Action({
  to, icon, label, tone,
}: { to: string; icon: React.ReactNode; label: string; tone: string }) {
  return (
    <Link to={to} className={`action action--${tone}`}>
      <span className="action__icon">{icon}</span>
      <span className="action__label">{label}</span>
      <ChevronRight size={18} className="action__chev" />
    </Link>
  )
}
