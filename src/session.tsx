import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { L } from './data/types'
import { patients as seedPatients, type Patient, type Visit } from './data/patients'
import { tasks as seedTasks } from './data/tasks'
import { POINTS_PER_CORRECT } from './data/quiz'
import {
  POINTS_BALANCE, POINTS_LIFETIME, POINTS_PER_RUPEE, redemptions as seedRedemptions,
  type Redemption,
} from './data/rewards'
import { TODAY, iso } from './lib/date'

/**
 * What the worker does during a session — visits saved, tasks ticked, today's
 * quiz, points redeemed — shared across screens so every screen agrees.
 * Held in memory only: a reload starts fresh, and nothing leaves the device.
 */

/** Typed text has no translations; show it the same in every language. */
const same = (s: string): L => ({ en: s, hi: s, ml: s })

export type VisitInput = {
  /** Set when editing an existing record. */
  patientId?: string
  visitIndex?: number
  name: string
  age: number
  gender: Patient['gender']
  address: string
  visit: Omit<Visit, 'date' | 'notes'> & { notes: string }
}

type Ctx = {
  patients: Patient[]
  /** Saves a new or edited visit; returns the patient's id. */
  saveVisit: (input: VisitInput, lang: keyof L) => string

  taskDone: Record<string, boolean>
  toggleTask: (id: string) => void

  /** Today's quiz score, or null until it is played. */
  quizScore: number | null
  finishQuiz: (score: number) => void

  points: number
  pointsLifetime: number
  redemptions: Redemption[]
  redeem: (rupees: number) => void
}

const SessionContext = createContext<Ctx | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(seedPatients)
  const [taskDone, setTaskDone] = useState<Record<string, boolean>>(
    () => Object.fromEntries(seedTasks.map((x) => [x.id, x.done])),
  )
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [points, setPoints] = useState(POINTS_BALANCE)
  const [pointsLifetime, setPointsLifetime] = useState(POINTS_LIFETIME)
  const [redemptions, setRedemptions] = useState<Redemption[]>(seedRedemptions)

  const value = useMemo<Ctx>(() => {
    const saveVisit: Ctx['saveVisit'] = (input, lang) => {
      // Keep the original translations unless the worker actually changed the text.
      const keep = (orig: L | undefined, typed: string) =>
        orig && orig[lang].trim().toLowerCase() === typed.trim().toLowerCase() ? orig : same(typed)

      const existing =
        patients.find((p) => p.id === input.patientId) ??
        // A "new" visit for someone already on the list joins their history.
        patients.find((p) =>
          Object.values(p.name).some((n) => n.trim().toLowerCase() === input.name.trim().toLowerCase()),
        )

      const editingVisit =
        input.patientId !== undefined && existing ? existing.visits[input.visitIndex ?? 0] : undefined

      const visit: Visit = {
        ...input.visit,
        date: editingVisit?.date ?? iso(TODAY),
        notes: keep(editingVisit?.notes, input.visit.notes),
      }

      const id = existing?.id ?? `n${Date.now()}`
      const patient: Patient = {
        id,
        name: keep(existing?.name, input.name.trim()),
        age: input.age,
        gender: input.gender,
        address: keep(existing?.address, input.address.trim()),
        visits: existing
          ? editingVisit
            ? existing.visits.map((v, i) => (i === (input.visitIndex ?? 0) ? visit : v))
            : [visit, ...existing.visits]
          : [visit],
      }

      setPatients((list) =>
        existing ? list.map((p) => (p.id === id ? patient : p)) : [patient, ...list],
      )
      return id
    }

    return {
      patients,
      saveVisit,
      taskDone,
      toggleTask: (id) => setTaskDone((d) => ({ ...d, [id]: !d[id] })),
      quizScore,
      finishQuiz: (score) => {
        if (quizScore !== null) return // one attempt a day
        setQuizScore(score)
        setPoints((p) => p + score * POINTS_PER_CORRECT)
        setPointsLifetime((p) => p + score * POINTS_PER_CORRECT)
      },
      points,
      pointsLifetime,
      redemptions,
      redeem: (rupees) => {
        setPoints((p) => p - rupees * POINTS_PER_RUPEE)
        setRedemptions((r) => [
          { id: `x${Date.now()}`, date: iso(TODAY), rupees, status: 'processing' },
          ...r,
        ])
      },
    }
  }, [patients, taskDone, quizScore, points, pointsLifetime, redemptions])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}
