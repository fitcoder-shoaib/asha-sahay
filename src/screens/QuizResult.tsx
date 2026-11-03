import { Link, Navigate } from 'react-router-dom'
import { useSession } from '../session'
import { Flame, Home, Trophy } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { POINTS_PER_CORRECT, STREAK, todaysQuestions } from '../data/quiz'

export default function QuizResult() {
  const { t } = useT()
  const { quizScore } = useSession()
  if (quizScore === null) return <Navigate to="/quiz" replace />
  const score = quizScore
  const total = todaysQuestions.length
  const pct = (score / total) * 100

  const message = score === total ? t.quiz.perfect : score >= 3 ? t.quiz.good : t.quiz.keep

  return (
    <div className="screen">
      <AppHeader title={t.quiz.title} back />

      <div className="scroll pad">
        <section className="res fade-in">
          <span className="res__cup"><Trophy size={32} /></span>
          <p className="res__label">{t.quiz.scored}</p>
          <p className="res__score">
            {score}<span className="res__outOf"> / {total}</span>
          </p>
          <p className="res__msg">{message}</p>

          <div className="res__meter">
            <span className="res__meterFill" style={{ width: `${pct}%` }} />
          </div>

          <div className="res__stats">
            <div className="res__stat">
              <span className="res__statNum">+{score * POINTS_PER_CORRECT}</span>
              <span className="res__statLabel">{t.quiz.pointsEarned}</span>
            </div>
            <div className="res__stat">
              <span className="res__statNum">
                <Flame size={16} style={{ verticalAlign: '-2px' }} /> {STREAK + 1}
              </span>
              <span className="res__statLabel">{t.quiz.streak}</span>
            </div>
          </div>
        </section>

        <div className="card res__done">
          <p className="res__doneTitle">{t.quiz.completed}</p>
          <p className="res__doneSub">{t.quiz.comeBack}</p>
        </div>

        <Link to="/" className="btn btn--primary btn--block" style={{ marginTop: 14 }}>
          <Home size={18} /> {t.quiz.backHome}
        </Link>
      </div>
    </div>
  )
}
