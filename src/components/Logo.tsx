type Props = {
  size?: number
  /** 'badge' draws the rounded teal tile; 'plain' draws the mark alone. */
  variant?: 'badge' | 'plain'
  className?: string
}

/**
 * ASHA Sahay mark: a heart carrying a pulse line.
 *
 * Two shapes only, so it still reads at favicon size — the pulse is knocked
 * out of the heart rather than drawn on top, which keeps the silhouette clean
 * when the whole thing is 16px wide.
 */
export default function Logo({ size = 48, variant = 'badge', className }: Props) {
  const heart =
    'M24 40.5C24 40.5 6.5 29.2 6.5 18.4C6.5 12.7 11.1 8.1 16.8 8.1C20.2 8.1 23.1 9.8 24 12.3' +
    'C24.9 9.8 27.8 8.1 31.2 8.1C36.9 8.1 41.5 12.7 41.5 18.4C41.5 29.2 24 40.5 24 40.5Z'
  const pulse = 'M12.5 20.4H18.6L21.2 14.6L26.4 26.2L29 20.4H35.6'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="ASHA Sahay"
    >
      {variant === 'badge' && (
        <>
          <defs>
            <linearGradient id="ashaTile" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#12908E" />
              <stop offset="100%" stopColor="#0A5F5E" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="12" fill="url(#ashaTile)" />
        </>
      )}

      <path
        d={heart}
        fill={variant === 'badge' ? '#FFFFFF' : 'currentColor'}
        transform={variant === 'badge' ? 'translate(24 24) scale(.74) translate(-24 -24)' : undefined}
      />
      <path
        d={pulse}
        fill="none"
        stroke={variant === 'badge' ? '#0A5F5E' : '#FFFFFF'}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={variant === 'badge' ? 'translate(24 24) scale(.74) translate(-24 -24)' : undefined}
      />
    </svg>
  )
}
