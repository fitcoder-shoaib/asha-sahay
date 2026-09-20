import { QRCodeSVG } from 'qrcode.react'
import Logo from '../components/Logo'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { profile, qrPayload, verifyCode } from '../data/profile'

export default function QrId() {
  const { t, lang } = useT()

  return (
    <div className="screen">
      <AppHeader title={t.profile.myQr} back />

      <div className="scroll pad qr">
        <div className="qr__card">
          <div className="qr__head">
            <Logo size={20} variant="plain" />
            <span>ASHA SAHAY</span>
          </div>

          <div className="qr__code">
            <QRCodeSVG value={qrPayload()} size={186} level="M" marginSize={0} />
          </div>

          <h2 className="qr__name">{pick(profile.name, lang)}</h2>
          <p className="qr__id">{profile.ashaId}</p>

          <dl className="qr__rows">
            <div>
              <dt>{t.profile.villageLabel}</dt>
              <dd>{pick(profile.villageL, lang)}</dd>
            </div>
            <div>
              <dt>{t.profile.blockLabel}</dt>
              <dd>{pick(profile.block, lang)}</dd>
            </div>
            <div>
              <dt>{t.profile.districtLabel}</dt>
              <dd>{pick(profile.districtL, lang)}</dd>
            </div>
            <div>
              <dt>{t.profile.verifyCode}</dt>
              <dd className="qr__verify">{verifyCode()}</dd>
            </div>
          </dl>
        </div>

        <p className="qr__hint">{t.profile.qrHint}</p>
      </div>
    </div>
  )
}
