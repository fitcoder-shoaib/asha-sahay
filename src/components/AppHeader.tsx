import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SosButton from './SosButton'

type Props = {
  title: string
  subtitle?: string
  back?: boolean
  /** Hidden only on the SOS screen itself. */
  sos?: boolean
}

export default function AppHeader({ title, subtitle, back = false, sos = true }: Props) {
  const navigate = useNavigate()

  return (
    <header className="hdr">
      {back && (
        <button className="hdr__back" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={26} />
        </button>
      )}
      <div className="hdr__text">
        <h1 className="hdr__title">{title}</h1>
        {subtitle && <p className="hdr__sub">{subtitle}</p>}
      </div>
      {sos && <SosButton />}
    </header>
  )
}
