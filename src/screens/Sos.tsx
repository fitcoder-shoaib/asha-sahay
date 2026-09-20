import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Check, MapPin, Phone, Shield, X } from 'lucide-react'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { profile } from '../data/profile'

export default function Sos() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const [reached, setReached] = useState(0)

  const contacts = [
    {
      key: 'police',
      icon: <Shield size={17} />,
      label: `${t.sos.police} ${profile.police.number}`,
      detail: pick(profile.police.label, lang),
    },
    {
      key: 'emergency',
      icon: <Phone size={17} />,
      label: t.sos.emergencyContact,
      detail: `${pick(profile.emergency.name, lang)} · ${profile.emergency.phone}`,
    },
  ]

  // Contacts "acknowledge" one by one so the screen feels alive during a demo.
  useEffect(() => {
    const timers = contacts.map((_, i) =>
      setTimeout(() => setReached((n) => Math.max(n, i + 1)), 900 * (i + 1)),
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="sos-screen">
      <div className="sos-screen__top">
        <div className="sos-screen__pulse">
          <AlertTriangle size={44} strokeWidth={2.4} />
        </div>
        <h1 className="sos-screen__title">{t.sos.title}</h1>
        <p className="sos-screen__sub">{t.sos.subtitle}</p>
      </div>

      <div className="sos-screen__list">
        <p className="sos-screen__listLabel">{t.sos.notifying}</p>
        {contacts.map((c, i) => (
          <div key={c.key} className="sos-contact">
            {c.icon}
            <div className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="sos-contact__label">{c.label}</span>
              <span className="sos-contact__detail">{c.detail}</span>
            </div>
            {i < reached ? (
              <span className="sos-contact__ok"><Check size={15} strokeWidth={3} /></span>
            ) : (
              <span className="sos-contact__dots">•••</span>
            )}
          </div>
        ))}

        <div className="sos-contact">
          <MapPin size={17} />
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <span className="sos-contact__label">{t.sos.location}</span>
            <span className="sos-contact__detail">
              {pick(profile.villageL, lang)}, {pick(profile.districtL, lang)}
            </span>
          </div>
          <span className="sos-contact__ok"><Check size={15} strokeWidth={3} /></span>
        </div>
      </div>

      <div className="sos-screen__bottom">
        <button className="btn btn--block sos-screen__cancel" onClick={() => navigate(-1)}>
          <X size={20} /> {t.sos.cancelBtn}
        </button>
        <p className="sos-screen__demo">{t.sos.demoNote}</p>
      </div>
    </div>
  )
}
