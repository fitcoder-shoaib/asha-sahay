import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle, CalendarClock, Check, ChevronLeft, ChevronRight, Hospital, ThumbsUp,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import VitalField from '../components/VitalField'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { SYMPTOMS, patients } from '../data/patients'
import {
  FOLLOW_UP_DAYS, emptyVitals, suggestUrgent,
  type Action, type VitalKey, type VitalValues,
} from '../lib/vitals'
import { TODAY, fullDate } from '../lib/date'

const STEPS = [0, 1, 2, 3]
const VITAL_KEYS: VitalKey[] = ['systolic', 'diastolic', 'pulse', 'temp', 'spo2', 'weight', 'sugar']

/** Set by VisitDetail when the worker taps Edit on an existing record. */
type EditState = { patientId?: string; visitIndex?: number } | null

export default function VisitForm() {
  const { t, lang } = useT()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: EditState }

  // When editing, seed every field from the stored visit.
  const editing = useMemo(() => {
    if (!state?.patientId) return null
    const p = patients.find((x) => x.id === state.patientId)
    const v = p?.visits[state.visitIndex ?? 0]
    return p && v ? { patient: p, visit: v } : null
  }, [state])

  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState(false)

  const [name, setName] = useState(editing ? pick(editing.patient.name, lang) : '')
  const [age, setAge] = useState(editing ? String(editing.patient.age) : '')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    editing ? editing.patient.gender : 'female',
  )
  const [address, setAddress] = useState(editing ? pick(editing.patient.address, lang) : '')
  const [vitals, setVitals] = useState<VitalValues>(editing ? editing.visit.vitals : emptyVitals)
  const [symptoms, setSymptoms] = useState<string[]>(editing ? editing.visit.symptoms : [])
  const [noSymptoms, setNoSymptoms] = useState(editing ? editing.visit.symptoms.length === 0 : false)
  const [notes, setNotes] = useState(editing ? pick(editing.visit.notes, lang) : '')
  /** null = follow the suggestion; otherwise the worker has chosen explicitly. */
  const [override, setOverride] = useState<Action | null>(
    editing ? (editing.visit.urgent ? 'urgent' : editing.visit.followUpDays ? 'followup' : 'none') : null,
  )
  const [followDays, setFollowDays] = useState<number>(editing?.visit.followUpDays ?? 7)
  const [saved, setSaved] = useState(false)

  const suggestion = useMemo(() => suggestUrgent(vitals, symptoms), [vitals, symptoms])
  const action: Action = override ?? suggestion.action
  const urgent = action === 'urgent'

  const reviewDate = new Date(TODAY)
  reviewDate.setDate(TODAY.getDate() + followDays)

  const setVital = (k: VitalKey) => (v: string) => setVitals((s) => ({ ...s, [k]: v }))

  const toggleSymptom = (id: string) => {
    setNoSymptoms(false)
    setSymptoms((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const stepNames = [t.visits.step1, t.visits.step2, t.visits.step3, t.visits.step4]

  // Every field on the current step must be filled before Next unlocks.
  const missing = {
    name: name.trim() === '',
    age: age.trim() === '',
    address: address.trim() === '',
    vitals: VITAL_KEYS.filter((k) => vitals[k].trim() === ''),
    symptoms: symptoms.length === 0 && !noSymptoms,
    notes: notes.trim() === '',
  }
  const stepValid = [
    !missing.name && !missing.age && !missing.address,
    missing.vitals.length === 0,
    !missing.symptoms,
    !missing.notes,
  ][step]

  const goNext = () => {
    if (!stepValid) {
      setTouched(true)
      return
    }
    setTouched(false)
    if (step < 3) setStep(step + 1)
    else setSaved(true)
  }

  const err = (bad: boolean) => (touched && bad ? ' fld--err' : '')

  if (saved) {
    return (
      <div className="screen">
        <AppHeader title={editing ? t.visits.editVisit : t.visits.newVisit} back />
        <div className="scroll pad">
          <div className="done fade-in">
            <span className="done__tick"><Check size={32} strokeWidth={3} /></span>
            <h2 className="done__title">
              {editing ? t.visits.updateVisit : t.visits.saveVisit}
            </h2>
            <p className="done__sub">{name}</p>
            <p className="faint" style={{ fontSize: 12.5, margin: 0 }}>{address}</p>
            {action === 'urgent' && (
              <span className="done__urgent">
                <AlertTriangle size={14} /> {t.visits.referred}
              </span>
            )}
            {action === 'followup' && (
              <span className="done__follow">
                <CalendarClock size={14} /> {t.visits.followUpSet} · {fullDate(reviewDate, lang)}
              </span>
            )}
          </div>
          <button className="btn btn--primary btn--block" onClick={() => navigate('/visits')}>
            {t.common.done}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <AppHeader
        title={editing ? t.visits.editVisit : t.visits.newVisit}
        subtitle={`${t.visits.stepOf} ${step + 1} / 4 · ${stepNames[step]}`}
        back
      />

      <div className="steps">
        {STEPS.map((i) => (
          <span
            key={i}
            className={`steps__bar ${i < step ? 'steps__bar--done' : ''} ${i === step ? 'steps__bar--now' : ''}`}
          />
        ))}
      </div>

      <div className="scroll pad">
        {/* ---------- 1. patient ---------- */}
        {step === 0 && (
          <div className="fade-in form">
            <label className={`fld${err(missing.name)}`}>
              <span className="fld__label">
                {t.visits.name} <Req show={touched && missing.name} label={t.common.required} />
              </span>
              <input className="fld__input" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label className={`fld${err(missing.age)}`}>
              <span className="fld__label">
                {t.visits.age} <Req show={touched && missing.age} label={t.common.required} />
              </span>
              <input
                className="fld__input"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
              />
            </label>

            <label className={`fld${err(missing.address)}`}>
              <span className="fld__label">
                {t.visits.address} <Req show={touched && missing.address} label={t.common.required} />
              </span>
              <input
                className="fld__input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.visits.addressPlaceholder}
              />
            </label>

            <span className="fld__label">{t.visits.gender}</span>
            <div className="seg">
              {(['female', 'male', 'other'] as const).map((g) => (
                <button
                  key={g}
                  className={`seg__btn ${gender === g ? 'seg__btn--on' : ''}`}
                  onClick={() => setGender(g)}
                >
                  {{ female: t.visits.female, male: t.visits.male, other: t.visits.other }[g]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------- 2. vitals ---------- */}
        {step === 1 && (
          <div className="fade-in form">
            <span className="fld__label">{t.visits.bp}</span>
            <div className="form__row">
              <VitalField vkey="systolic" label={t.visits.systolic} unit="mmHg" value={vitals.systolic} onChange={setVital('systolic')} placeholder="120" missing={touched && vitals.systolic === ''} />
              <VitalField vkey="diastolic" label={t.visits.diastolic} unit="mmHg" value={vitals.diastolic} onChange={setVital('diastolic')} placeholder="80" missing={touched && vitals.diastolic === ''} />
            </div>
            <div className="form__row">
              <VitalField vkey="pulse" label={t.visits.pulse} unit="bpm" value={vitals.pulse} onChange={setVital('pulse')} placeholder="72" missing={touched && vitals.pulse === ''} />
              <VitalField vkey="temp" label={t.visits.temp} unit="°F" value={vitals.temp} onChange={setVital('temp')} placeholder="98.6" missing={touched && vitals.temp === ''} />
            </div>
            <div className="form__row">
              <VitalField vkey="spo2" label={t.visits.spo2} unit="%" value={vitals.spo2} onChange={setVital('spo2')} placeholder="98" missing={touched && vitals.spo2 === ''} />
              <VitalField vkey="weight" label={t.visits.weight} unit="kg" value={vitals.weight} onChange={setVital('weight')} placeholder="60" missing={touched && vitals.weight === ''} />
            </div>
            <VitalField vkey="sugar" label={t.visits.sugar} unit="mg/dL" value={vitals.sugar} onChange={setVital('sugar')} placeholder="110" missing={touched && vitals.sugar === ''} />
          </div>
        )}

        {/* ---------- 3. symptoms ---------- */}
        {step === 2 && (
          <div className="fade-in form">
            <p className="form__hint">{t.visits.symptomsHint}</p>

            <h3 className="section-title" style={{ color: 'var(--urgent)' }}>{t.visits.dangerSigns}</h3>
            <div className="symps">
              {SYMPTOMS.filter((s) => s.danger).map((s) => (
                <SympChip key={s.id} label={pick(s.label, lang)} danger on={symptoms.includes(s.id)} onClick={() => toggleSymptom(s.id)} />
              ))}
            </div>

            <h3 className="section-title" style={{ marginTop: 16 }}>{t.visits.generalSymptoms}</h3>
            <div className="symps">
              {SYMPTOMS.filter((s) => !s.danger).map((s) => (
                <SympChip key={s.id} label={pick(s.label, lang)} on={symptoms.includes(s.id)} onClick={() => toggleSymptom(s.id)} />
              ))}
            </div>

            <div className="symps" style={{ marginTop: 14 }}>
              <SympChip
                label={t.visits.noSymptoms}
                on={noSymptoms}
                onClick={() => {
                  setNoSymptoms(!noSymptoms)
                  setSymptoms([])
                }}
              />
            </div>
          </div>
        )}

        {/* ---------- 4. referral ---------- */}
        {step === 3 && (
          <div className="fade-in form">
            <label className={`fld${err(missing.notes)}`}>
              <span className="fld__label">
                {t.visits.notes} <Req show={touched && missing.notes} label={t.common.required} />
              </span>
              <textarea
                className="fld__input fld__input--area"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.visits.notesPlaceholder}
              />
            </label>

            <div className={`ref ref--${action}`}>
              <p className="ref__q">{t.visits.actionQuestion}</p>

              <div className="acts">
                <ActionCard
                  on={action === 'urgent'}
                  tone="urgent"
                  icon={<AlertTriangle size={19} />}
                  title={t.visits.actUrgent}
                  sub={t.visits.actUrgentSub}
                  onClick={() => setOverride('urgent')}
                />
                <ActionCard
                  on={action === 'followup'}
                  tone="followup"
                  icon={<CalendarClock size={19} />}
                  title={t.visits.actFollow}
                  sub={t.visits.actFollowSub}
                  onClick={() => setOverride('followup')}
                />
                <ActionCard
                  on={action === 'none'}
                  tone="none"
                  icon={<ThumbsUp size={19} />}
                  title={t.visits.actNone}
                  sub={t.visits.actNoneSub}
                  onClick={() => setOverride('none')}
                />
              </div>

              {action === 'followup' && (
                <div className="fu fade-in">
                  <p className="fu__label">{t.visits.reviewAfter}</p>
                  <div className="fu__opts">
                    {FOLLOW_UP_DAYS.map((d) => (
                      <button
                        key={d}
                        className={`fu__opt ${followDays === d ? 'fu__opt--on' : ''}`}
                        onClick={() => setFollowDays(d)}
                      >
                        {{ 3: t.visits.days3, 7: t.visits.week1, 14: t.visits.weeks2, 30: t.visits.month1 }[d]}
                      </button>
                    ))}
                  </div>
                  <p className="fu__date">
                    <CalendarClock size={14} /> {t.visits.reviewOn}{' '}
                    <strong>{fullDate(reviewDate, lang)}</strong>
                  </p>
                </div>
              )}

              <p className="ref__auto">{t.visits.urgentAuto}</p>

              {(suggestion.vitalHits.length > 0 ||
                suggestion.dangerHits.length > 0 ||
                suggestion.watchHits.length > 0) && (
                <ul className="ref__reasons">
                  {suggestion.vitalHits.map((k) => (
                    <li key={k}>
                      <AlertTriangle size={12} /> {vitalName(k, t)}: {vitals[k]}
                    </li>
                  ))}
                  {suggestion.dangerHits.map((id) => {
                    const sy = SYMPTOMS.find((x) => x.id === id)
                    return sy ? (
                      <li key={id}>
                        <AlertTriangle size={12} /> {pick(sy.label, lang)}
                      </li>
                    ) : null
                  })}
                  {suggestion.watchHits.map((k) => (
                    <li key={k} className="ref__reasons--watch">
                      <CalendarClock size={12} /> {vitalName(k, t)}: {vitals[k]}
                    </li>
                  ))}
                </ul>
              )}

              {urgent && (
                <button className="btn btn--danger btn--block" style={{ marginTop: 12 }}>
                  <Hospital size={18} /> {t.visits.referPhc}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---------- footer nav ---------- */}
      <div className="form__nav form__nav--stack">
        {touched && !stepValid && (
          <p className="form__err">
            <AlertTriangle size={14} />
            {step === 2 ? t.visits.atLeastOneSymptom : step === 3 ? t.visits.notesRequired : t.visits.fillAll}
          </p>
        )}
        <div className="form__navRow">
          <button
            className="btn btn--outline"
            onClick={() => {
              setTouched(false)
              step === 0 ? navigate(-1) : setStep(step - 1)
            }}
          >
            <ChevronLeft size={18} /> {t.common.back}
          </button>
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={goNext}>
            {step < 3 ? (
              <>
                {t.common.next} <ChevronRight size={18} />
              </>
            ) : (
              <>
                <Check size={18} /> {editing ? t.visits.updateVisit : t.visits.saveVisit}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  on, tone, icon, title, sub, onClick,
}: {
  on: boolean
  tone: string
  icon: React.ReactNode
  title: string
  sub: string
  onClick: () => void
}) {
  return (
    <button className={`act act--${tone} ${on ? 'act--on' : ''}`} onClick={onClick}>
      <span className="act__icon">{icon}</span>
      <span className="col" style={{ flex: 1, minWidth: 0 }}>
        <span className="act__title">{title}</span>
        <span className="act__sub">{sub}</span>
      </span>
      <span className={`act__tick ${on ? 'act__tick--on' : ''}`}>
        {on && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  )
}

function Req({ show, label }: { show: boolean; label: string }) {
  if (!show) return null
  return <span className="fld__req">{label}</span>
}

function vitalName(k: VitalKey, t: ReturnType<typeof useT>['t']) {
  return {
    systolic: t.visits.systolic,
    diastolic: t.visits.diastolic,
    pulse: t.visits.pulse,
    temp: t.visits.temp,
    weight: t.visits.weight,
    spo2: t.visits.spo2,
    sugar: t.visits.sugar,
  }[k]
}

function SympChip({
  label, danger = false, on, onClick,
}: { label: string; danger?: boolean; on: boolean; onClick: () => void }) {
  return (
    <button
      className={`symp ${danger ? 'symp--danger' : ''} ${on ? 'symp--on' : ''}`}
      onClick={onClick}
    >
      {on && <Check size={13} strokeWidth={3} />}
      {label}
    </button>
  )
}
