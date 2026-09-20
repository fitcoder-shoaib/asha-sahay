import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BellRing, ChevronRight, Globe, HelpCircle, Info, LifeBuoy, LogOut,
  Phone, ShieldCheck, UserRound,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { LANGS, useT } from '../i18n'
import { pick } from '../data/types'
import { profile } from '../data/profile'

const APP_VERSION = '0.1.0'

export default function Settings() {
  const { t, lang, setLang } = useT()
  const navigate = useNavigate()

  // Toggles are local to the screen: nothing here is persisted in the prototype.
  const [paymentAlerts, setPaymentAlerts] = useState(true)
  const [quizReminder, setQuizReminder] = useState(true)
  const [visitDue, setVisitDue] = useState(false)
  const [appLock, setAppLock] = useState(false)
  const [dataSharing, setDataSharing] = useState(true)
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <div className="screen">
      <AppHeader title={t.settings.title} back />

      <div className="scroll pad set">
        {/* language */}
        <Section icon={<Globe size={17} />} title={t.settings.language} sub={t.settings.languageSub}>
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
        </Section>

        {/* notifications */}
        <Section icon={<BellRing size={17} />} title={t.settings.notifications} sub={t.settings.notificationsSub}>
          <Toggle label={t.settings.paymentAlerts} on={paymentAlerts} onChange={setPaymentAlerts} />
          <Toggle label={t.settings.quizReminder} on={quizReminder} onChange={setQuizReminder} />
          <Toggle label={t.settings.visitDue} on={visitDue} onChange={setVisitDue} />
        </Section>

        {/* privacy */}
        <Section icon={<ShieldCheck size={17} />} title={t.settings.privacy} sub={t.settings.privacySub}>
          <Toggle label={t.settings.appLock} sub={t.settings.appLockSub} on={appLock} onChange={setAppLock} />
          <Toggle label={t.settings.dataSharing} on={dataSharing} onChange={setDataSharing} />
        </Section>

        {/* emergency contact */}
        <Section
          icon={<Phone size={17} />}
          title={t.settings.emergencyContact}
          sub={t.settings.emergencyContactSub}
        >
          <div className="set__contact">
            <span className="set__contactAvatar"><UserRound size={20} /></span>
            <div className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="set__contactName">{pick(profile.emergency.name, lang)}</span>
              <span className="set__contactMeta">
                {pick(profile.emergency.relation, lang)} · {profile.emergency.phone}
              </span>
            </div>
          </div>
          <button className="btn btn--ghost btn--block" style={{ minHeight: 42 }}>
            {t.settings.changeContact}
          </button>
        </Section>

        {/* help */}
        <Section icon={<HelpCircle size={17} />} title={t.settings.help} sub={t.settings.helpSub}>
          <LinkRow icon={<LifeBuoy size={17} />} label={t.settings.userGuide} />
          <LinkRow icon={<Phone size={17} />} label={t.settings.contactSupport} />
          <LinkRow icon={<Info size={17} />} label={t.settings.about} />
          <p className="set__version">
            {t.settings.version} {APP_VERSION}
          </p>
        </Section>

        {/* logout */}
        {confirmLogout ? (
          <div className="card set__logoutCard fade-in">
            <p className="set__logoutQ">{t.settings.logoutQ}</p>
            <p className="set__logoutSub">{t.settings.logoutSub}</p>
            <div className="set__logoutBtns">
              <button className="btn btn--outline" onClick={() => setConfirmLogout(false)}>
                {t.common.cancel}
              </button>
              <button
                className="btn btn--danger"
                style={{ flex: 1 }}
                onClick={() => {
                  setConfirmLogout(false)
                  navigate('/')
                }}
              >
                <LogOut size={18} /> {t.settings.logout}
              </button>
            </div>
          </div>
        ) : (
          <button className="set__logout" onClick={() => setConfirmLogout(true)}>
            <LogOut size={19} /> {t.settings.logout}
          </button>
        )}

        <p className="set__demo">{t.settings.demoNote}</p>
      </div>
    </div>
  )
}

function Section({
  icon, title, sub, children,
}: {
  icon: React.ReactNode
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <section className="card set__section">
      <div className="set__head">
        <span className="set__headIcon">{icon}</span>
        <div className="col" style={{ flex: 1, minWidth: 0 }}>
          <span className="set__title">{title}</span>
          <span className="set__sub">{sub}</span>
        </div>
      </div>
      <div className="set__body">{children}</div>
    </section>
  )
}

function Toggle({
  label, sub, on, onChange,
}: { label: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="tgl" onClick={() => onChange(!on)} role="switch" aria-checked={on}>
      <span className="col" style={{ flex: 1, minWidth: 0 }}>
        <span className="tgl__label">{label}</span>
        {sub && <span className="tgl__sub">{sub}</span>}
      </span>
      <span className={`tgl__track ${on ? 'tgl__track--on' : ''}`}>
        <span className="tgl__knob" />
      </span>
    </button>
  )
}

function LinkRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="set__link">
      <span className="set__linkIcon">{icon}</span>
      <span className="set__linkLabel">{label}</span>
      <ChevronRight size={17} className="faint" />
    </button>
  )
}
