import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BrainCircuit, CalendarDays, Gift, Home, ListChecks, Settings, Stethoscope, User, X,
} from 'lucide-react'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { profile } from '../data/profile'
import Logo from './Logo'

/**
 * Mirrors the bottom tab bar, plus the two destinations that have no room
 * down there (redeem and settings).
 */
export default function DrawerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useT()

  // Escape closes, and the page behind must not scroll while the drawer is up.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const primary = [
    { to: '/', icon: Home, label: t.nav.home, end: true },
    { to: '/calendar', icon: CalendarDays, label: t.nav.calendar, end: false },
    { to: '/visits', icon: Stethoscope, label: t.nav.visits, end: false },
    { to: '/quiz', icon: BrainCircuit, label: t.nav.quiz, end: false },
    { to: '/profile', icon: User, label: t.nav.profile, end: false },
  ]

  const secondary = [
    { to: '/tasks', icon: ListChecks, label: t.nav.tasks },
    { to: '/redeem', icon: Gift, label: t.nav.redeem },
    { to: '/settings', icon: Settings, label: t.nav.settings },
  ]

  return (
    <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
      <button className="drawer__scrim" onClick={onClose} tabIndex={open ? 0 : -1} aria-label={t.common.close} />

      <aside className="drawer__panel" role="dialog" aria-label={t.nav.menu}>
        <header className="drawer__head">
          <Logo size={40} className="drawer__logo" />
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <span className="drawer__name">ASHA Sahay</span>
            <span className="drawer__id">{pick(profile.name, lang)} · {profile.ashaId}</span>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label={t.common.close}>
            <X size={20} />
          </button>
        </header>

        <nav className="drawer__nav">
          {primary.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `drawer__item ${isActive ? 'drawer__item--on' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}

          <span className="drawer__rule" />

          {secondary.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `drawer__item ${isActive ? 'drawer__item--on' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  )
}
