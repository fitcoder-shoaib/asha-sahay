import { useState } from 'react'
import { ChevronLeft, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SosButton from './SosButton'
import DrawerMenu from './DrawerMenu'
import { useT } from '../i18n'

type Props = {
  title: string
  subtitle?: string
  /** Sub-screens show a back arrow; tab screens show the menu button instead. */
  back?: boolean
  /** Hidden only on the SOS screen itself. */
  sos?: boolean
}

export default function AppHeader({ title, subtitle, back = false, sos = true }: Props) {
  const navigate = useNavigate()
  const { t } = useT()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="hdr">
        {back ? (
          <button className="hdr__btn" onClick={() => navigate(-1)} aria-label={t.common.back}>
            <ChevronLeft size={26} />
          </button>
        ) : (
          <button className="hdr__btn" onClick={() => setMenuOpen(true)} aria-label={t.nav.menu}>
            <Menu size={24} />
          </button>
        )}

        <div className="hdr__text">
          <h1 className="hdr__title">{title}</h1>
          {subtitle && <p className="hdr__sub">{subtitle}</p>}
        </div>

        {sos && <SosButton />}
      </header>

      <DrawerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
