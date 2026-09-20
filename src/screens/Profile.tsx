import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award, BadgeCheck, CalendarDays, ChevronDown, ChevronRight, Globe, GraduationCap,
  HeartPulse, IdCard, QrCode, ScanLine, Settings as SettingsIcon,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { LANGS, useT } from '../i18n'
import { pick } from '../data/types'
import { profile } from '../data/profile'
import { fromIso, fullDate, yearsSince } from '../lib/date'

export default function Profile() {
  const { t, lang, setLang } = useT()
  const [trainingsOpen, setTrainingsOpen] = useState(true)
  const years = yearsSince(profile.joiningDate)
  const maxNcd = Math.max(...profile.ncd.byMonth.map((m) => m.count))

  const monthName = (ym: string) =>
    fromIso(`${ym}-01`).toLocaleDateString(lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'ml-IN', {
      month: 'short',
      year: 'numeric',
    })

  return (
    <div className="screen">
      <AppHeader title={t.profile.title} />

      <div className="scroll pad prof">
        {/* identity */}
        <section className="card prof__id">
          <div className="prof__avatar">{profile.initials}</div>
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <h2 className="prof__name">{pick(profile.name, lang)}</h2>
            <p className="prof__meta">
              {pick(profile.villageL, lang)} · {pick(profile.block, lang)}
            </p>
            <p className="prof__meta">
              {pick(profile.districtL, lang)}, {pick(profile.state, lang)}
            </p>
            <span className="prof__idChip">
              <IdCard size={13} /> {t.profile.ashaId} {profile.ashaId}
            </span>
          </div>
        </section>

        {/* language */}
        <section className="card prof__lang">
          <span className="prof__langLabel"><Globe size={16} /> {t.profile.language}</span>
          <div className="prof__langBtns">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`prof__langBtn ${lang === l.code ? 'prof__langBtn--on' : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* ID + certificate actions */}
        <div className="prof__links">
          <Link to="/profile/qr" className="prof__link">
            <span className="prof__linkIcon prof__linkIcon--teal"><QrCode size={20} /></span>
            <span className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="prof__linkTitle">{t.profile.myQr}</span>
              <span className="prof__linkSub">{t.profile.myQrSub}</span>
            </span>
            <ChevronRight size={18} className="faint" />
          </Link>

          <Link to="/profile/certificate" className="prof__link">
            <span className="prof__linkIcon prof__linkIcon--rose"><BadgeCheck size={20} /></span>
            <span className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="prof__linkTitle">{t.profile.certificate}</span>
              <span className="prof__linkSub">{t.profile.certificateSub}</span>
            </span>
            <ChevronRight size={18} className="faint" />
          </Link>

          <Link to="/settings" className="prof__link">
            <span className="prof__linkIcon prof__linkIcon--plain"><SettingsIcon size={20} /></span>
            <span className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="prof__linkTitle">{t.profile.openSettings}</span>
              <span className="prof__linkSub">{t.profile.openSettingsSub}</span>
            </span>
            <ChevronRight size={18} className="faint" />
          </Link>

          <Link to="/scan" className="prof__link">
            <span className="prof__linkIcon prof__linkIcon--plain"><ScanLine size={20} /></span>
            <span className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="prof__linkTitle">{t.profile.scan}</span>
              <span className="prof__linkSub">{t.profile.scanHint}</span>
            </span>
            <ChevronRight size={18} className="faint" />
          </Link>
        </div>

        {/* service */}
        <h3 className="section-title">{t.profile.joined}</h3>
        <section className="card prof__service">
          <CalendarDays size={22} className="prof__serviceIcon" />
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <span className="prof__serviceDate">{fullDate(fromIso(profile.joiningDate), lang)}</span>
            <span className="prof__serviceYears">
              {t.profile.inService} · {years} {t.common.years}
            </span>
          </div>
          <div className="prof__serviceBadge">{years}+</div>
        </section>

        {/* service history */}
        <h3 className="section-title">{t.profile.serviceHistory}</h3>
        <section className="card">
          <ol className="tl">
            {/* newest posting first */}
            {[...profile.serviceHistory].reverse().map((s, i) => (
              <li key={i} className={`tl__item ${s.to === null ? 'tl__item--now' : ''}`}>
                <span className="tl__dot" />
                <span className="tl__when">
                  {monthName(s.from)} — {s.to ? monthName(s.to) : t.common.today}
                </span>
                <span className="tl__role">{pick(s.role, lang)}</span>
                <span className="tl__place">{pick(s.place, lang)}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* trainings */}
        <button
          className="prof__collapse"
          onClick={() => setTrainingsOpen(!trainingsOpen)}
          aria-expanded={trainingsOpen}
        >
          <span className="section-title" style={{ margin: 0 }}>
            {t.profile.trainings} <span className="faint">({profile.trainings.length})</span>
          </span>
          <ChevronDown
            size={18}
            className={`prof__chev ${trainingsOpen ? 'prof__chev--open' : ''}`}
          />
        </button>
        <section
          className="card prof__trainings"
          style={trainingsOpen ? undefined : { display: 'none' }}
        >
          {profile.trainings.map((tr, i) => (
            <div key={i} className="train">
              <GraduationCap size={18} className="train__icon" />
              <div className="col" style={{ flex: 1, minWidth: 0 }}>
                <span className="train__name">{pick(tr.name, lang)}</span>
                <span className="train__meta">
                  {fullDate(fromIso(tr.date), lang)} · {tr.hours}h
                </span>
              </div>
              {tr.certified && <BadgeCheck size={17} className="train__cert" />}
            </div>
          ))}
        </section>

        {/* NCD screenings */}
        <h3 className="section-title">{t.profile.ncd}</h3>
        <section className="card">
          <div className="row--between" style={{ marginBottom: 12 }}>
            <span className="row" style={{ gap: 8 }}>
              <HeartPulse size={20} className="prof__serviceIcon" />
              <span className="ncd__label">{t.profile.ncdTotal}</span>
            </span>
            <span className="ncd__total">{profile.ncd.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="ncd__chart">
            {profile.ncd.byMonth.map((m, i) => (
              <div key={i} className="ncd__col">
                <span className="ncd__count">{m.count}</span>
                <span className="ncd__bar" style={{ height: `${(m.count / maxNcd) * 100}%` }} />
                <span className="ncd__month">{pick(m.month, lang)}</span>
              </div>
            ))}
          </div>
          <p className="ncd__caption">{t.profile.lastSixMonths}</p>
        </section>

        {/* achievements */}
        <h3 className="section-title">{t.profile.achievements}</h3>
        <section className="prof__badges">
          {profile.achievements.map((a, i) => (
            <div key={i} className="badge">
              <span className="badge__icon"><Award size={19} /></span>
              <span className="badge__year">{a.year}</span>
              <span className="badge__title">{pick(a.title, lang)}</span>
              <span className="badge__note">{pick(a.note, lang)}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
