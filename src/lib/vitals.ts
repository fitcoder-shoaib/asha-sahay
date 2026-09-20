import type { Dict } from '../i18n/en'

export type Level = 'normal' | 'low' | 'elevated' | 'high'
export type VitalKey = 'systolic' | 'diastolic' | 'pulse' | 'temp' | 'weight' | 'spo2' | 'sugar'

export type Reading = { level: Level; urgent: boolean }

/**
 * Field-level triage thresholds, roughly following NCD screening guidance used
 * in ASHA training. Deliberately conservative: this only *suggests* a referral,
 * the worker always has the final say.
 */
export function assess(key: VitalKey, raw: string): Reading | null {
  const v = Number(raw)
  if (raw.trim() === '' || Number.isNaN(v)) return null

  const at = (level: Level, urgent = false): Reading => ({ level, urgent })

  switch (key) {
    case 'systolic':
      if (v < 90) return at('low', true)
      if (v < 120) return at('normal')
      if (v < 140) return at('elevated')
      if (v < 180) return at('high')
      return at('high', true)

    case 'diastolic':
      if (v < 60) return at('low', true)
      if (v < 80) return at('normal')
      if (v < 90) return at('elevated')
      if (v < 120) return at('high')
      return at('high', true)

    case 'pulse':
      if (v < 50) return at('low', true)
      if (v < 60) return at('low')
      if (v <= 100) return at('normal')
      if (v <= 120) return at('elevated')
      return at('high', true)

    case 'temp': // °F
      if (v < 97) return at('low')
      if (v <= 99.5) return at('normal')
      if (v < 101) return at('elevated')
      if (v < 102) return at('high')
      return at('high', true)

    // Oxygen saturation only ever falls, so the direction here is always "low".
    // Severity is carried by `urgent`, not by the direction label.
    case 'spo2':
      if (v >= 95) return at('normal')
      if (v === 94) return at('low')
      return at('low', true) // < 94 needs referral

    case 'sugar': // random blood sugar, mg/dL
      if (v < 70) return at('low', true)
      if (v < 140) return at('normal')
      if (v < 200) return at('elevated')
      if (v < 300) return at('high')
      return at('high', true)

    case 'weight':
      return at('normal')
  }
}

export type VitalValues = Record<VitalKey, string>

export const emptyVitals: VitalValues = {
  systolic: '', diastolic: '', pulse: '', temp: '', weight: '', spo2: '', sugar: '',
}

/** Danger-sign symptom ids that on their own warrant referral. */
export const URGENT_SYMPTOMS = ['chestPain', 'breathless', 'bleeding', 'fits', 'unconscious', 'severeHeadache']

/** What the worker should do next. Most real visits land on 'followup'. */
export type Action = 'urgent' | 'followup' | 'none'

/**
 * Triages the visit into one of three outcomes. Anything urgent wins; readings
 * that are off-normal but not dangerous earn a scheduled review instead, which
 * is what most home visits actually need.
 */
export function suggestUrgent(vitals: VitalValues, symptoms: string[]) {
  const hits: VitalKey[] = []
  const watch: VitalKey[] = []
  for (const k of Object.keys(vitals) as VitalKey[]) {
    const r = assess(k, vitals[k])
    if (!r) continue
    if (r.urgent) hits.push(k)
    else if (r.level !== 'normal') watch.push(k)
  }
  const danger = symptoms.filter((s) => URGENT_SYMPTOMS.includes(s))
  const otherSymptoms = symptoms.filter((s) => !URGENT_SYMPTOMS.includes(s))

  const action: Action =
    hits.length > 0 || danger.length > 0
      ? 'urgent'
      : watch.length > 0 || otherSymptoms.length > 0
        ? 'followup'
        : 'none'

  return {
    action,
    urgent: action === 'urgent',
    vitalHits: hits,
    dangerHits: danger,
    watchHits: watch,
  }
}

/** Follow-up intervals offered when the worker picks a later review. */
export const FOLLOW_UP_DAYS = [3, 7, 14, 30] as const
export type FollowUpDays = (typeof FOLLOW_UP_DAYS)[number]

export function levelLabel(level: Level, t: Dict) {
  return {
    normal: t.visits.normal,
    low: t.visits.low,
    elevated: t.visits.elevated,
    high: t.visits.high,
  }[level]
}
