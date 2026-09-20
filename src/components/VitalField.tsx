import { useT } from '../i18n'
import { assess, levelLabel, type VitalKey } from '../lib/vitals'

type Props = {
  vkey: VitalKey
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

/**
 * Numeric vital with live triage colouring. The colour is advisory — it never
 * blocks entry, because a worker may well be recording an unusual-but-correct value.
 */
export default function VitalField({ vkey, label, unit, value, onChange, placeholder }: Props) {
  const { t } = useT()
  const reading = assess(vkey, value)
  const tone = reading ? reading.level : 'empty'
  // Direction (low/high) names the reading; urgency drives the colour.
  const urgentClass = reading?.urgent ? ' vf--urgent' : ''

  return (
    <label className={`vf vf--${tone}${urgentClass}`}>
      <span className="vf__label">{label}</span>
      <span className="vf__inputWrap">
        <input
          className="vf__input"
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder ?? '—'}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        />
        <span className="vf__unit">{unit}</span>
      </span>
      {reading && reading.level !== 'normal' && (
        <span className={`vf__level vf__level--${reading.urgent ? 'urgentLevel' : reading.level}`}>
          {levelLabel(reading.level, t)}
        </span>
      )}
    </label>
  )
}
