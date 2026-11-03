import logoMark from '../assets/logo-mark.png'

type Props = {
  size?: number
  /** 'badge' sits the emblem on a white rounded tile; 'plain' draws the emblem alone. */
  variant?: 'badge' | 'plain'
  className?: string
}

/** ASHA Sahay emblem: the ASHA worker, the sun, and the family at home. */
export default function Logo({ size = 48, variant = 'badge', className }: Props) {
  const img = (
    <img
      src={logoMark}
      alt="ASHA Sahay"
      width={variant === 'badge' ? Math.round(size * 0.84) : size}
      height={variant === 'badge' ? Math.round(size * 0.84) : size}
      className={variant === 'plain' ? className : undefined}
      draggable={false}
    />
  )

  if (variant === 'plain') return img

  return (
    <span
      className={`logo-badge ${className ?? ''}`}
      style={{ width: size, height: size, borderRadius: size * 0.26 }}
    >
      {img}
    </span>
  )
}
