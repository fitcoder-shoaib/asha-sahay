import type { ReactNode } from 'react'

/** Phone mockup for desktop. Collapses to full-bleed on a real phone (see styles.css). */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="frame">
      <div className="frame__notch" />
      <div className="frame__screen">{children}</div>
    </div>
  )
}
