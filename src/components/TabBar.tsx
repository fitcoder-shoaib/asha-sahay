import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Stethoscope, BrainCircuit, User } from 'lucide-react'
import { useT } from '../i18n'

export default function TabBar() {
  const { t } = useT()

  const tabs = [
    { to: '/', icon: Home, label: t.nav.home, end: true },
    { to: '/calendar', icon: CalendarDays, label: t.nav.calendar, end: false },
    { to: '/visits', icon: Stethoscope, label: t.nav.visits, end: false },
    { to: '/quiz', icon: BrainCircuit, label: t.nav.quiz, end: false },
    { to: '/profile', icon: User, label: t.nav.profile, end: false },
  ]

  return (
    <nav className="tabs">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `tab ${isActive ? 'tab--active' : ''}`}
        >
          <Icon size={21} strokeWidth={2.1} />
          <span className="tab__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
