import { Link } from 'react-router-dom'
import { BrainCircuit, HeartPulse, ShieldAlert, Wallet } from 'lucide-react'
import Logo from '../components/Logo'
import { LANGS, useT } from '../i18n'

export default function Welcome() {
  const { t, lang, setLang } = useT()

  const features = [
    { icon: <Wallet size={17} />, label: t.nav.calendar },
    { icon: <HeartPulse size={17} />, label: t.nav.visits },
    { icon: <BrainCircuit size={17} />, label: t.nav.quiz },
    { icon: <ShieldAlert size={17} />, label: 'SOS' },
  ]

  return (
    <div className="wel">
      <div className="wel__glowA" />
      <div className="wel__glowB" />

      <div className="wel__body">
        <Logo size={80} className="wel__logo" />

        <h1 className="wel__name">ASHA Sahay</h1>
        <p className="wel__tagline">{t.auth.tagline}</p>
        <p className="wel__blurb">{t.auth.blurb}</p>

        <div className="wel__chips">
          {features.map((f) => (
            <span key={f.label} className="wel__chip">
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="wel__foot">
        <p className="wel__langLabel">{t.auth.chooseLanguage}</p>
        <div className="wel__langs">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`wel__lang ${lang === l.code ? 'wel__lang--on' : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <Link to="/login" className="btn btn--block wel__primary">
          {t.auth.getStarted}
        </Link>
        <Link to="/register" className="wel__secondary">
          {t.auth.register}
        </Link>
      </div>
    </div>
  )
}
