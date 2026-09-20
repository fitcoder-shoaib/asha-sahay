import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n'

const HOLD_MS = 3000
const R = 21
const CIRC = 2 * Math.PI * R

/**
 * Press-and-hold for 3s to fire. Releasing early cancels and the ring snaps back.
 * Deliberately hard to trigger by accident — this lives in a pocket all day.
 */
export default function SosButton() {
  const navigate = useNavigate()
  const { t } = useT()
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)

  // Timer-driven rather than requestAnimationFrame: rAF stalls whenever the
  // page stops producing frames, and a safety control must never silently hang.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAt = useRef(0)
  const lastTick = useRef(0)
  const fired = useRef(false)

  const stop = useCallback(() => {
    if (timer.current !== null) clearInterval(timer.current)
    timer.current = null
    setHolding(false)
    setProgress(0)
  }, [])

  const frame = useCallback(() => {
    const p = Math.min(1, (performance.now() - startedAt.current) / HOLD_MS)
    setProgress(p)

    // one haptic tick per second elapsed
    const sec = Math.floor(p * 3)
    if (sec > lastTick.current) {
      lastTick.current = sec
      navigator.vibrate?.(30)
    }

    if (p >= 1) {
      if (!fired.current) {
        fired.current = true
        navigator.vibrate?.([90, 50, 90, 50, 250])
        stop()
        navigate('/sos')
      }
    }
  }, [navigate, stop])

  const begin = useCallback(
    (e: React.PointerEvent) => {
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* synthetic pointer */ }
      fired.current = false
      lastTick.current = 0
      startedAt.current = performance.now()
      setHolding(true)
      navigator.vibrate?.(20)
      if (timer.current !== null) clearInterval(timer.current)
      timer.current = setInterval(frame, 16)
    },
    [frame],
  )

  useEffect(() => () => { if (timer.current !== null) clearInterval(timer.current) }, [])

  const remaining = Math.max(1, Math.ceil(3 - progress * 3))

  return (
    <div className="sos-wrap">
      <button
        className={`sos ${holding ? 'sos--holding' : ''}`}
        onPointerDown={begin}
        onPointerUp={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={t.sos.hold}
      >
        <svg className="sos__ring" width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r={R} className="sos__track" />
          <circle
            cx="26" cy="26" r={R}
            className="sos__fill"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
          />
        </svg>
        <span className="sos__label">{holding ? remaining : 'SOS'}</span>
      </button>
      {holding && <span className="sos__hint">{t.sos.activating}</span>}
    </div>
  )
}
