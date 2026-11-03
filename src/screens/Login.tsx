import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, ChevronLeft, Eye, EyeOff, LogIn } from 'lucide-react'
import { DEMO, useAuth } from '../auth'
import { useT } from '../i18n'
import Logo from '../components/Logo'

export default function Login() {
  const { t } = useT()
  const navigate = useNavigate()
  const { attempt } = useAuth()

  const [ashaId, setAshaId] = useState('')
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [error, setError] = useState(false)

  const submit = () => {
    if (attempt(ashaId, password)) navigate('/', { replace: true })
    else setError(true)
  }

  return (
    <div className="auth">
      <header className="auth__top">
        <button className="auth__back" onClick={() => navigate('/welcome')} aria-label={t.common.back}>
          <ChevronLeft size={24} />
        </button>
        <Logo size={44} className="auth__logo" />
        <h1 className="auth__title">{t.auth.loginTitle}</h1>
        <p className="auth__sub">{t.auth.loginSub}</p>
      </header>

      <form
        className="scroll auth__body"
        onSubmit={(e) => {
          e.preventDefault()
          if (ashaId.trim() && password) submit()
        }}
      >
        <label className="fld">
          <span className="fld__label">{t.auth.ashaId}</span>
          <input
            className="fld__input"
            value={ashaId}
            onChange={(e) => {
              setAshaId(e.target.value)
              setError(false)
            }}
            placeholder={t.auth.ashaIdHint}
            autoCapitalize="characters"
          />
        </label>

        <label className="fld">
          <span className="fld__label">{t.auth.password}</span>
          <span className="fld__wrap">
            <input
              className="fld__input"
              type={reveal ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
            />
            <button
              className="fld__eye"
              onClick={() => setReveal(!reveal)}
              aria-label={reveal ? t.auth.hide : t.auth.show}
              type="button"
            >
              {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        {error && (
          <p className="form__err fade-in">
            <AlertTriangle size={14} /> {t.auth.wrongCreds}
          </p>
        )}

        <button
          className="btn btn--primary btn--block"
          style={{ marginTop: 6 }}
          type="submit"
          disabled={!ashaId.trim() || !password}
          onClick={submit}
        >
          <LogIn size={18} /> {t.auth.loginBtn}
        </button>

        {/* Seeded demo account — this prototype has no real accounts. */}
        <div className="auth__demo">
          <span className="auth__demoLabel">{t.auth.demoHint}</span>
          <code className="auth__demoCreds">
            {DEMO.ashaId} · {DEMO.password}
          </code>
          <button
            className="btn btn--ghost btn--block"
            style={{ minHeight: 42 }}
            type="button"
            onClick={() => {
              setAshaId(DEMO.ashaId)
              setPassword(DEMO.password)
              setError(false)
            }}
          >
            {t.auth.demoFill}
          </button>
        </div>

        <p className="auth__switch">
          {t.auth.noAccount} <Link to="/register">{t.auth.register}</Link>
        </p>
      </form>
    </div>
  )
}
