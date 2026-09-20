import type { L } from './types'

/** 10 quiz points = ₹1. Kept as one constant so the rate shown always matches the maths. */
export const POINTS_PER_RUPEE = 10

/** Lifetime quiz points earned, minus what has already been redeemed. */
export const POINTS_BALANCE = 2480
export const POINTS_LIFETIME = 4180

export type Reward = { id: string; rupees: number }

export const rewards: Reward[] = [
  { id: 'r50', rupees: 50 },
  { id: 'r100', rupees: 100 },
  { id: 'r250', rupees: 250 },
  { id: 'r500', rupees: 500 },
]

export const costOf = (r: Reward) => r.rupees * POINTS_PER_RUPEE

export type Redemption = { id: string; date: string; rupees: number; status: 'credited' | 'processing' }

export const redemptions: Redemption[] = [
  { id: 'x1', date: '2026-09-02', rupees: 100, status: 'credited' },
  { id: 'x2', date: '2026-07-19', rupees: 50, status: 'credited' },
  { id: 'x3', date: '2026-06-05', rupees: 20, status: 'credited' },
]

export const rewardLabel: L = {
  en: 'Cash is credited to your registered bank account',
  hi: 'राशि आपके पंजीकृत बैंक खाते में जमा होती है',
  ml: 'തുക നിങ്ങളുടെ രജിസ്റ്റർ ചെയ്ത ബാങ്ക് അക്കൗണ്ടിൽ ലഭിക്കും',
}
