// Single source of truth for design tokens.
// Kept as a plain object so it ports to React Native StyleSheet unchanged.

export const colors = {
  primary: '#0E7C7B',
  primaryDark: '#0A5F5E',
  primaryLight: '#E6F2F2',
  accent: '#C2185B',
  accentLight: '#FCE4EC',

  // payment + triage status
  received: '#1B873F',
  receivedBg: '#E7F5EC',
  pending: '#B7791F',
  pendingBg: '#FDF3E2',
  process: '#1D6FD0',
  processBg: '#E6F0FC',
  urgent: '#C62828',
  urgentBg: '#FDEAEA',

  text: '#14211F',
  textMuted: '#5C6B69',
  textFaint: '#8B9896',
  border: '#DDE5E4',
  surface: '#FFFFFF',
  bg: '#F4F7F7',
  white: '#FFFFFF',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const

export const type = {
  h1: 24,
  h2: 20,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
} as const

/** Minimum touch target. Users are outdoors on cheap phones. */
export const TAP = 48
