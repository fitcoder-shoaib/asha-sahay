import { Link } from 'react-router-dom'
import { BrainCircuit, Check, ChevronRight, Coins, Flame, Gift, ListChecks, Play } from 'lucide-react'
import { useSession } from '../session'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { STREAK, todaysQuestions } from '../data/quiz'
import { POINTS_PER_RUPEE } from '../data/rewards'
import { TODAY, fullDate, rupees } from '../lib/date'

export default function Quiz() {
  const { t, lang } = useT()
  const { points, pointsLifetime, quizScore } = useSession()
  const played = quizScore !== null

  // Distinct topics covered today, shown as a teaser.
  const topics = Array.from(new Set(todaysQuestions.map((q) => pick(q.topic, lang))))

  return (
    <div className="screen">
      <AppHeader title={t.quiz.title} subtitle={fullDate(TODAY, lang)} />

      <div className="scroll pad">
        {/* points balance — the answer to "where are my points?" */}
        <section className="pts">
          <div className="pts__row">
            <span className="pts__icon"><Coins size={22} /></span>
            <div className="col" style={{ flex: 1, minWidth: 0 }}>
              <span className="pts__label">{t.quiz.pointsBalance}</span>
              <span className="pts__value">
                {points.toLocaleString('en-IN')} <i>{t.quiz.pts}</i>
              </span>
            </div>
            <div className="col pts__worth">
              <span className="pts__worthValue">
                {rupees(Math.floor(points / POINTS_PER_RUPEE))}
              </span>
              <span className="pts__worthLabel">{t.quiz.earnedSoFar}</span>
            </div>
          </div>

          <Link to="/redeem" className="pts__cta">
            <Gift size={18} />
            <span style={{ flex: 1 }}>{t.quiz.redeemCta}</span>
            <ChevronRight size={18} />
          </Link>
        </section>

        <section className="quizCard" style={{ marginTop: 14 }}>
          <span className="quizCard__icon"><BrainCircuit size={30} /></span>
          <h2 className="quizCard__title">{t.quiz.todaysQuiz}</h2>
          <p className="quizCard__sub">{t.quiz.fiveQuestions}</p>

          <div className="quizCard__streak">
            <Flame size={17} />
            <span className="quizCard__streakNum">{played ? STREAK + 1 : STREAK}</span>
            <span className="quizCard__streakLabel">{t.quiz.streak}</span>
          </div>

          {played ? (
            <Link to="/quiz/result" className="btn btn--block quizCard__start">
              <Check size={18} strokeWidth={3} /> {t.quiz.yourScore}: {quizScore} / {todaysQuestions.length}
            </Link>
          ) : (
            <Link to="/quiz/play" className="btn btn--block quizCard__start">
              <Play size={18} /> {t.quiz.start}
            </Link>
          )}
        </section>

        <h3 className="section-title" style={{ marginTop: 20 }}>
          <ListChecks size={13} style={{ verticalAlign: '-2px', marginRight: 5 }} />
          {t.quiz.topics}
        </h3>
        <div className="quizTopics">
          {topics.map((tp) => (
            <span key={tp} className="quizTopic">{tp}</span>
          ))}
        </div>

        <p className="pts__lifetime">
          {t.quiz.myPoints}: {pointsLifetime.toLocaleString('en-IN')} {t.quiz.pts}
        </p>
      </div>
    </div>
  )
}
