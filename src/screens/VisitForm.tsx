import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Hospital } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import VitalField from '../components/VitalField'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { SYMPTOMS } from '../data/patients'
import { emptyVitals, suggestUrgent, type VitalKey, type VitalValues } from '../lib/vitals'

const STEPS = [0, 1, 2, 3]

export default function VisitForm() {
  const { t, lang } = useT()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female')
  const [household, setHousehold] = useState('')
  const [vitals, setVitals] = useState<VitalValues>(emptyVitals)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  /** null = follow the suggestion; true/false = the worker has overridden it. */
  const [override, setOverride] = useState<boolean | null>(null)
  const [saved, setSaved] = useState(false)

  const suggestion = useMemo(() => suggestUrgent(vitals, symptoms), [vitals, symptoms])
  const urgent = override ?? suggestion.urgent

  const setVital = (k: VitalKey) => (v: string) => setVitals((s) => ({ ...s, [k]: v }))
  const toggleSymptom = (id: string) =>
    setSymptoms((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const stepNames = [t.visits.step1, t.visits.step2, t.visits.step3, t.visits.step4]
  const canNext = step !== 0 || name.trim().length > 0

  if (saved) {
    return (
      <div className="screen">
        <AppHeader title={t.visits.newVisit} back />
        <div className="scroll pad">
          <div className="done fade-in">
            <span className="done__tick"><Check size={32} strokeWidth={3} /></span>
            <h2 className="done__title">{t.visits.saveVisit}</h2>
            <p className="done__sub">{name || t.visits.step1}</p>
            {urgent && (
              <span className="done__urgent">
                <AlertTriangle size={14} /> {t.visits.referred}
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
        title={t.visits.newVisit}
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
            <label className="fld">
              <span className="fld__label">{t.visits.name}</span>
              <input className="fld__input" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <div className="form__row">
              <label className="fld">
                <span className="fld__label">{t.visits.age}</span>
                <input
                  className="fld__input"
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
                />
              </label>
              <label className="fld">
                <span className="fld__label">{t.visits.household}</span>
                <input
                  className="fld__input"
                  value={household}
                  onChange={(e) => setHousehold(e.target.value)}
                  placeholder="HH-0000"
                />
              </label>
            </div>

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
              <VitalField vkey="systolic" label={t.visits.systolic} unit="mmHg" value={vitals.systolic} onChange={setVital('systolic')} placeholder="120" />
              <VitalField vkey="diastolic" label={t.visits.diastolic} unit="mmHg" value={vitals.diastolic} onChange={setVital('diastolic')} placeholder="80" />
            </div>
            <div className="form__row">
              <VitalField vkey="pulse" label={t.visits.pulse} unit="bpm" value={vitals.pulse} onChange={setVital('pulse')} placeholder="72" />
              <VitalField vkey="temp" label={t.visits.temp} unit="°F" value={vitals.temp} onChange={setVital('temp')} placeholder="98.6" />
            </div>
            <div className="form__row">
              <VitalField vkey="spo2" label={t.visits.spo2} unit="%" value={vitals.spo2} onChange={setVital('spo2')} placeholder="98" />
              <VitalField vkey="weight" label={t.visits.weight} unit="kg" value={vitals.weight} onChange={setVital('weight')} placeholder="60" />
            </div>
            <VitalField vkey="sugar" label={t.visits.sugar} unit="mg/dL" value={vitals.sugar} onChange={setVital('sugar')} placeholder="110" />
          </div>
        )}

        {/* ---------- 3. symptoms ---------- */}
        {step === 2 && (
          <div className="fade-in form">
            <p className="form__hint">{t.visits.symptomsHint}</p>

            <h3 className="section-title" style={{ color: 'var(--urgent)' }}>{t.visits.dangerSigns}</h3>
            <div className="symps">
              {SYMPTOMS.filter((s) => s.danger).map((s) => (
                <SympChip key={s.id} id={s.id} label={pick(s.label, lang)} danger on={symptoms.includes(s.id)} onClick={() => toggleSymptom(s.id)} />
              ))}
            </div>

            <h3 className="section-title" style={{ marginTop: 16 }}>{t.visits.generalSymptoms}</h3>
            <div className="symps">
              {SYMPTOMS.filter((s) => !s.danger).map((s) => (
                <SympChip key={s.id} id={s.id} label={pick(s.label, lang)} on={symptoms.includes(s.id)} onClick={() => toggleSymptom(s.id)} />
              ))}
            </div>
          </div>
        )}

        {/* ---------- 4. referral ---------- */}
        {step === 3 && (
          <div className="fade-in form">
            <label className="fld">
              <span className="fld__label">{t.visits.notes}</span>
              <textarea
                className="fld__input fld__input--area"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.visits.notesPlaceholder}
              />
            </label>

            <div className={`ref ${urgent ? 'ref--urgent' : ''}`}>
              <p className="ref__q">{t.visits.urgentQuestion}</p>

              <div className="ref__btns">
                <button
                  className={`ref__btn ${urgent ? 'ref__btn--yes' : ''}`}
                  onClick={() => setOverride(true)}
                >
                  {t.common.yes}
                </button>
                <button
                  className={`ref__btn ${!urgent ? 'ref__btn--no' : ''}`}
                  onClick={() => setOverride(false)}
                >
                  {t.common.no}
                </button>
              </div>

              <p className="ref__auto">{t.visits.urgentAuto}</p>

              {(suggestion.vitalHits.length > 0 || suggestion.dangerHits.length > 0) && (
                <ul className="ref__reasons">
                  {suggestion.vitalHits.map((k) => (
                    <li key={k}>
                      <AlertTriangle size={12} /> {vitalName(k, t)}: {vitals[k]}
                    </li>
                  ))}
                  {suggestion.dangerHits.map((id) => {
                    const s = SYMPTOMS.find((x) => x.id === id)
                    return s ? (
                      <li key={id}>
                        <AlertTriangle size={12} /> {pick(s.label, lang)}
                      </li>
                    ) : null
                  })}
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
      <div className="form__nav">
        <button
          className="btn btn--outline"
          onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}
        >
          <ChevronLeft size={18} /> {t.common.back}
        </button>
        {step < 3 ? (
          <button
            className="btn btn--primary"
            style={{ flex: 1 }}
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
          >
            {t.common.next} <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={() => setSaved(true)}>
            <Check size={18} /> {t.visits.saveVisit}
          </button>
        )}
      </div>
    </div>
  )
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
}: { id: string; label: string; danger?: boolean; on: boolean; onClick: () => void }) {
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
