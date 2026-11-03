import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeIndianRupee, Check, Coins, Landmark } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useSession } from '../session'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { POINTS_PER_RUPEE, costOf, rewardLabel, rewards } from '../data/rewards'
import { fromIso, fullDate, rupees } from '../lib/date'

export default function Redeem() {
  const { t, lang } = useT()
  const navigate = useNavigate()
  const { points: balance, redemptions, redeem } = useSession()
  const [claimed, setClaimed] = useState<number | null>(null)

  if (claimed !== null) {
    return (
      <div className="screen">
        <AppHeader title={t.redeem.title} back />
        <div className="scroll pad">
          <div className="done fade-in">
            <span className="done__tick"><Check size={32} strokeWidth={3} /></span>
            <h2 className="done__title">{t.redeem.requested}</h2>
            <p className="rdm__claimAmt">{rupees(claimed)}</p>
            <p className="done__sub">{t.redeem.requestedSub}</p>
          </div>

          <div className="card rdm__after">
            <span className="rdm__afterLabel">{t.redeem.balance}</span>
            <span className="rdm__afterValue">
              {balance.toLocaleString('en-IN')} {t.quiz.pts}
            </span>
          </div>

          <button
            className="btn btn--primary btn--block"
            style={{ marginTop: 14 }}
            onClick={() => navigate('/quiz')}
          >
            {t.redeem.backToQuiz}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <AppHeader title={t.redeem.title} back />

      <div className="scroll pad">
        <section className="rdm__balance">
          <span className="rdm__balanceIcon"><Coins size={26} /></span>
          <span className="rdm__balanceLabel">{t.redeem.balance}</span>
          <span className="rdm__balanceValue">{balance.toLocaleString('en-IN')}</span>
          <span className="rdm__balanceWorth">
            {t.redeem.worth} {rupees(Math.floor(balance / POINTS_PER_RUPEE))} · {t.redeem.rate}
          </span>
        </section>

        <h3 className="section-title" style={{ marginTop: 18 }}>{t.redeem.chooseAmount}</h3>
        <div className="rdm__grid">
          {rewards.map((r) => {
            const cost = costOf(r)
            const affordable = cost <= balance
            return (
              <button
                key={r.id}
                className={`rdm__opt ${affordable ? '' : 'rdm__opt--off'}`}
                disabled={!affordable}
                onClick={() => {
                  redeem(r.rupees)
                  setClaimed(r.rupees)
                }}
              >
                <span className="rdm__optAmt">
                  <BadgeIndianRupee size={17} />
                  {r.rupees}
                </span>
                <span className="rdm__optCost">
                  {t.redeem.cost} {cost.toLocaleString('en-IN')} {t.quiz.pts}
                </span>
                {!affordable && (
                  <span className="rdm__optShort">
                    {(cost - balance).toLocaleString('en-IN')} {t.redeem.needMore}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <p className="rdm__note">
          <Landmark size={14} /> {pick(rewardLabel, lang)}
        </p>

        <h3 className="section-title" style={{ marginTop: 20 }}>{t.redeem.history}</h3>
        <section className="card rdm__history">
          {redemptions.map((x) => (
            <div key={x.id} className="rdm__row">
              <span className="col" style={{ flex: 1, minWidth: 0 }}>
                <span className="rdm__rowAmt">{rupees(x.rupees)}</span>
                <span className="rdm__rowDate">{fullDate(fromIso(x.date), lang)}</span>
              </span>
              <span className={`chip ${x.status === 'credited' ? 'chip--received' : 'chip--process'}`}>
                {x.status === 'credited' ? t.redeem.credited : t.redeem.processing}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
