import { QRCodeSVG } from 'qrcode.react'
import { BadgeCheck } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { profile, qrPayload, verifyCode } from '../data/profile'
import { TODAY, fromIso, fullDate, yearsSince } from '../lib/date'
import { fill } from '../lib/template'

export default function Certificate() {
  const { t, lang } = useT()
  const years = yearsSince(profile.joiningDate)

  return (
    <div className="screen">
      <AppHeader title={t.profile.certificate} back />

      <div className="scroll pad">
        <article className="cert">
          <div className="cert__seal"><BadgeCheck size={26} /></div>

          <h2 className="cert__title">{t.profile.certTitle}</h2>
          <div className="cert__rule" />

          <p className="cert__lead">{t.profile.certBody}</p>
          <p className="cert__name">{pick(profile.name, lang)}</p>
          <p className="cert__ashaId">{profile.ashaId}</p>

          <p className="cert__lead">
            {fill(t.profile.certBody2, {
              date: <strong>{fullDate(fromIso(profile.joiningDate), lang)}</strong>,
              years: <strong>{years} {t.common.years}</strong>,
            })}
          </p>

          <p className="cert__place">
            {pick(profile.villageL, lang)}, {pick(profile.block, lang)},{' '}
            {pick(profile.districtL, lang)}, {pick(profile.state, lang)}
          </p>

          <div className="cert__stats">
            <div className="cert__stat">
              <span className="cert__statNum">{profile.trainings.length}</span>
              <span className="cert__statLabel">{t.profile.certTrainings}</span>
            </div>
            <div className="cert__stat">
              <span className="cert__statNum">{profile.ncd.total.toLocaleString('en-IN')}</span>
              <span className="cert__statLabel">{t.profile.certScreenings}</span>
            </div>
          </div>

          <div className="cert__foot">
            <div className="col">
              <span className="cert__footLabel">{t.profile.verifyCode}</span>
              <span className="cert__code">{verifyCode()}</span>
              <span className="cert__footLabel" style={{ marginTop: 8 }}>{t.profile.issuedOn}</span>
              <span className="cert__issued">{fullDate(TODAY, lang)}</span>
            </div>
            <div className="cert__qr">
              <QRCodeSVG value={qrPayload()} size={74} level="M" marginSize={0} />
            </div>
          </div>

          <p className="cert__issuer">{t.profile.certificateSub}</p>
        </article>
      </div>
    </div>
  )
}
