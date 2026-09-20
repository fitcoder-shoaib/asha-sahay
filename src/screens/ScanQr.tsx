import { useState } from 'react'
import { BadgeCheck, IdCard, ScanLine } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { profile, qrPayload, verifyCode } from '../data/profile'
import { fromIso, fullDate, yearsSince } from '../lib/date'

type Phase = 'idle' | 'scanning' | 'done'

export default function ScanQr() {
  const { t, lang } = useT()
  const [phase, setPhase] = useState<Phase>('idle')

  // Prototype: no live camera. The payload below is what a real scan would decode.
  const decoded = qrPayload().split(':')

  const run = () => {
    setPhase('scanning')
    setTimeout(() => setPhase('done'), 1600)
  }

  return (
    <div className="screen">
      <AppHeader title={t.profile.scanTitle} back />

      <div className="scroll pad">
        {phase !== 'done' ? (
          <>
            <div className={`scan ${phase === 'scanning' ? 'scan--active' : ''}`}>
              <span className="scan__corner scan__corner--tl" />
              <span className="scan__corner scan__corner--tr" />
              <span className="scan__corner scan__corner--bl" />
              <span className="scan__corner scan__corner--br" />
              {phase === 'scanning' && <span className="scan__line" />}
              <ScanLine size={40} className="scan__icon" />
              <p className="scan__text">
                {phase === 'scanning' ? t.profile.scanning : t.profile.scanHint}
              </p>
            </div>

            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: 18 }}
              onClick={run}
              disabled={phase === 'scanning'}
            >
              {t.profile.scanSimulate}
            </button>
          </>
        ) : (
          <div className="fade-in">
            <div className="verified">
              <span className="verified__tick"><BadgeCheck size={30} /></span>
              <span className="verified__label">{t.profile.verified}</span>
              <span className="verified__sub">{t.profile.verifiedSub}</span>
            </div>

            <div className="card vcard">
              <div className="vcard__head">
                <div className="vcard__avatar">{profile.initials}</div>
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span className="vcard__name">{pick(profile.name, lang)}</span>
                  <span className="vcard__id"><IdCard size={13} /> {profile.ashaId}</span>
                </div>
              </div>

              <dl className="vcard__rows">
                <div>
                  <dt>{t.profile.villageLabel}</dt>
                  <dd>{pick(profile.villageL, lang)}</dd>
                </div>
                <div>
                  <dt>{t.profile.districtLabel}</dt>
                  <dd>{pick(profile.districtL, lang)}, {pick(profile.state, lang)}</dd>
                </div>
                <div>
                  <dt>{t.profile.joined}</dt>
                  <dd>{fullDate(fromIso(profile.joiningDate), lang)}</dd>
                </div>
                <div>
                  <dt>{t.profile.inService}</dt>
                  <dd>{yearsSince(profile.joiningDate)} {t.common.years}</dd>
                </div>
                <div>
                  <dt>{t.profile.trainings}</dt>
                  <dd>{profile.trainings.length}</dd>
                </div>
                <div>
                  <dt>{t.profile.verifyCode}</dt>
                  <dd className="vcard__code">{verifyCode()}</dd>
                </div>
              </dl>

              <p className="vcard__raw">{decoded.slice(0, 2).join(':')}…</p>
            </div>

            <button
              className="btn btn--outline btn--block"
              style={{ marginTop: 14 }}
              onClick={() => setPhase('idle')}
            >
              {t.profile.scanAgain}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
