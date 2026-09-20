import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, CalendarClock, Check, Pencil } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { patients, symptomById } from '../data/patients'
import { assess, levelLabel, type VitalKey } from '../lib/vitals'
import { addDays, fromIso, fullDate } from '../lib/date'

const VITAL_ORDER: VitalKey[] = ['systolic', 'diastolic', 'pulse', 'temp', 'spo2', 'sugar', 'weight']
const UNITS: Record<VitalKey, string> = {
  systolic: 'mmHg', diastolic: 'mmHg', pulse: 'bpm', temp: '°F',
  spo2: '%', sugar: 'mg/dL', weight: 'kg',
}

export default function VisitDetail() {
  const { id } = useParams()
  const { t, lang } = useT()
  const patient = patients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div className="screen">
        <AppHeader title={t.visits.title} back />
        <div className="scroll pad"><p className="cal__empty">{t.visits.noneFound}</p></div>
      </div>
    )
  }

  const names: Record<VitalKey, string> = {
    systolic: t.visits.systolic, diastolic: t.visits.diastolic, pulse: t.visits.pulse,
    temp: t.visits.temp, spo2: t.visits.spo2, sugar: t.visits.sugar, weight: t.visits.weight,
  }
  const genderLabel = { male: t.visits.male, female: t.visits.female, other: t.visits.other }

  return (
    <div className="screen">
      <AppHeader
        title={pick(patient.name, lang)}
        subtitle={`${patient.age} ${t.visits.yrs} · ${genderLabel[patient.gender]} · ${pick(patient.address, lang)}`}
        back
      />

      <div className="scroll pad">
        <h3 className="section-title">{t.visits.visitHistory}</h3>

        {patient.visits.map((v, i) => {
          const recorded = VITAL_ORDER.filter((k) => v.vitals[k] !== '')
          return (
            <section key={i} className="card" style={{ marginBottom: 12 }}>
              <div className="row--between" style={{ marginBottom: 10 }}>
                <span className="vd__date">{fullDate(fromIso(v.date), lang)}</span>
                {v.urgent ? (
                  <span className="chip chip--urgentFlag">
                    <AlertTriangle size={12} /> {t.visits.urgentFlag}
                  </span>
                ) : v.followUpDays ? (
                  <span className="chip chip--follow">
                    <CalendarClock size={12} /> {t.visits.actFollow}
                  </span>
                ) : (
                  <span className="chip chip--received">
                    <Check size={12} /> {t.visits.noReferral}
                  </span>
                )}
              </div>

              {recorded.length === 0 ? (
                <p className="faint" style={{ fontSize: 12.5, margin: 0 }}>{t.visits.noVitals}</p>
              ) : (
                <div className="vd__grid">
                  {recorded.map((k) => {
                    const r = assess(k, v.vitals[k])
                    return (
                      <div key={k} className={`vd__cell vd__cell--${r?.urgent ? 'urgent' : (r?.level ?? 'normal')}`}>
                        <span className="vd__cellLabel">{names[k]}</span>
                        <span className="vd__cellValue">
                          {v.vitals[k]} <i>{UNITS[k]}</i>
                        </span>
                        {r && r.level !== 'normal' && (
                          <span className={`vd__cellLevel vd__cellLevel--${r.urgent ? 'urgentLevel' : r.level}`}>
                            {levelLabel(r.level, t)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {v.symptoms.length > 0 && (
                <div className="vd__symps">
                  {v.symptoms.map((s) => {
                    const sym = symptomById(s)
                    return sym ? (
                      <span key={s} className={`symp symp--static ${sym.danger ? 'symp--danger' : ''}`}>
                        {pick(sym.label, lang)}
                      </span>
                    ) : null
                  })}
                </div>
              )}

              <p className="vd__notes">{pick(v.notes, lang)}</p>

              {v.followUpDays && (
                <p className="vd__follow">
                  <CalendarClock size={14} /> {t.visits.reviewOn}{' '}
                  <strong>{fullDate(addDays(fromIso(v.date), v.followUpDays), lang)}</strong>
                </p>
              )}

              <Link
                to="/visits/new"
                state={{ patientId: patient.id, visitIndex: i }}
                className="btn btn--outline vd__edit"
              >
                <Pencil size={15} /> {t.common.edit}
              </Link>
            </section>
          )
        })}
      </div>
    </div>
  )
}
