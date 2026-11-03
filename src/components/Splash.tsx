import { useEffect, useState } from 'react'
import logoMark from '../assets/logo-mark.png'
import logoName from '../assets/logo-name.png'
import logoSlogan from '../assets/logo-slogan.png'

const SHOW_MS = 3200
const FADE_MS = 450

/**
 * Opening animation, played once each time the app is loaded.
 * The emblem pops in over a rising sun, then the name, then the slogan slide up.
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
        <img className="splash__mark" src={logoMark} alt="ASHA Sahay" draggable={false} />
      </div>
      <div className="splash__text">
        <img className="splash__name" src={logoName} alt="" draggable={false} />
        <img className="splash__slogan" src={logoSlogan} alt="" draggable={false} />
      </div>
      <div className="splash__dots">
        <span /><span /><span />
      </div>
    </div>
  )
}
