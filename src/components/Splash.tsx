import { useEffect, useState } from 'react'

const SHOW_MS = 2600
const FADE_MS = 450

/**
 * Opening animation, played once each time the app is loaded.
 * The emblem pops in over a rising sun, then the wordmark and slogan slide up.
 * Tap anywhere to skip.
 */
export default function Splash() {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')

  useEffect(() => {
    if (phase !== 'in') return
    const t = setTimeout(() => setPhase('out'), reduced ? 900 : SHOW_MS)
    return () => clearTimeout(t)
  }, [phase, reduced])

  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => setPhase('gone'), FADE_MS)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div
      className={`splash ${phase === 'out' ? 'splash--out' : ''}`}
      onClick={() => setPhase('out')}
      role="presentation"
    >
      <div className="splash__stage">
        <div className="splash__sun" />
        <img className="splash__mark" src="/logo-mark.png" alt="ASHA Sahay" draggable={false} />
      </div>
      <img className="splash__word" src="/logo-wordmark.png" alt="" draggable={false} />
      <div className="splash__dots">
        <span /><span /><span />
      </div>
    </div>
  )
}
