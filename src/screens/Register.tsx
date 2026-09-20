import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Check, ChevronLeft, Eye, EyeOff, HeartPulse, Lock, ShieldCheck, UserPlus,
} from 'lucide-react'
import { useAuth } from '../auth'
import { useT } from '../i18n'

const digits = (v: string) => v.replace(/\D/g, '')

export default function Register() {
  const { t } = useT()
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [ashaId, setAshaId] = useState('')
  const [emergency, setEmergency] = useState('')
  const [area, setArea] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [reveal, setReveal] = useState(false)
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)

  const bad = {
    name: name.trim() === '',
    phone: phone.length !== 10,
    aadhaar: aadhaar.length !== 12,
    ashaId: ashaId.trim() === '',
    emergency: emergency.length !== 10,
    area: area.trim() === '',
    password: password.length < 6,
    confirm: confirm !== password || confirm === '',
  }
  const valid = !Object.values(bad).some(Boolean)

  const firstError = () => {
    if (bad.phone && phone !== '') return t.auth.badPhone
    if (bad.aadhaar && aadhaar !== '') return t.auth.badAadhaar
    if (bad.password && password !== '') return t.auth.weakPassword
    if (confirm !== '' && confirm !== password) return t.auth.mismatch
    return t.auth.fillAll
  }

  if (done) {
    return (
      <div className="auth">
        <div className="scroll pad" style={{ paddingTop: 60 }}>
          <div className="done fade-in">
            <span className="done__tick"><Check size={32} strokeWidth={3} /></span>
            <h2 className="done__title">{t.auth.doneTitle}</h2>
            <p className="done__sub">{t.auth.doneSub}</p>
          </div>
          <button
            className="btn btn--primary btn--block"
            onClick={() => {
              signIn()
              navigate('/', { replace: true })
            }}
          >
            {t.auth.continueBtn}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth">
      <header className="auth__top">
        <button className="auth__back" onClick={() => navigate('/welcome')} aria-label={t.common.back}>
          <ChevronLeft size={24} />
        </button>
        <span className="auth__mark"><HeartPulse size={20} /></span>
        <h1 className="auth__title">{t.auth.regTitle}</h1>
        <p className="auth__sub">{t.auth.regSub}</p>
      </header>

      <div className="scroll auth__body">
        <Field label={t.auth.name} value={name} onChange={setName} bad={touched && bad.name} req={t.common.required} />

        <Field
          label={t.auth.phone}
          value={phone}
          onChange={(v) => setPhone(digits(v).slice(0, 10))}
          bad={touched && bad.phone}
          req={t.common.required}
          numeric
          prefix="+91"
        />

        <Field
          label={t.auth.aadhaar}
          hint={t.auth.aadhaarHint}
          value={aadhaar}
          onChange={(v) => setAadhaar(digits(v).slice(0, 12))}
          bad={touched && bad.aadhaar}
          req={t.common.required}
          numeric
          icon={<ShieldCheck size={16} />}
        />

        <Field label={t.auth.ashaId} value={ashaId} onChange={setAshaId} bad={touched && bad.ashaId} req={t.common.required} />

        <Field
          label={t.auth.emergency}
          value={emergency}
          onChange={(v) => setEmergency(digits(v).slice(0, 10))}
          bad={touched && bad.emergency}
          req={t.common.required}
          numeric
          prefix="+91"
        />

        <Field label={t.auth.area} value={area} onChange={setArea} bad={touched && bad.area} req={t.common.required} />

        <label className={`fld ${touched && bad.password ? 'fld--err' : ''}`}>
          <span className="fld__label">
            <Lock size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
            {t.auth.password}
            {touched && bad.password && <span className="fld__req">{t.common.required}</span>}
          </span>
          <span className="fld__wrap">
            <input
              className="fld__input"
              type={reveal ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="fld__eye" type="button" onClick={() => setReveal(!reveal)}>
              {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <label className={`fld ${touched && bad.confirm ? 'fld--err' : ''}`}>
          <span className="fld__label">
            {t.auth.confirmPassword}
            {touched && bad.confirm && <span className="fld__req">{t.common.required}</span>}
          </span>
          <input
            className="fld__input"
            type={reveal ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>

        {touched && !valid && (
          <p className="form__err fade-in">
            <AlertTriangle size={14} /> {firstError()}
          </p>
        )}

        <button
          className="btn btn--primary btn--block"
          style={{ marginTop: 6 }}
          onClick={() => (valid ? setDone(true) : setTouched(true))}
        >
          <UserPlus size={18} /> {t.auth.createBtn}
        </button>

        <p className="auth__privacy">
          <ShieldCheck size={13} /> {t.auth.privacyNote}
        </p>

        <p className="auth__switch">
          {t.auth.haveAccount} <Link to="/login">{t.auth.login}</Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  label, hint, value, onChange, bad, req, numeric = false, prefix, icon,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  bad: boolean
  req: string
  numeric?: boolean
  prefix?: string
  icon?: React.ReactNode
}) {
  return (
    <label className={`fld ${bad ? 'fld--err' : ''}`}>
      <span className="fld__label">
        {icon && <span style={{ verticalAlign: '-2px', marginRight: 4 }}>{icon}</span>}
        {label}
        {bad && <span className="fld__req">{req}</span>}
      </span>
      <span className="fld__wrap">
        {prefix && <span className="fld__prefix">{prefix}</span>}
        <input
          className="fld__input"
          inputMode={numeric ? 'numeric' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
      {hint && <span className="fld__hint">{hint}</span>}
    </label>
  )
}
