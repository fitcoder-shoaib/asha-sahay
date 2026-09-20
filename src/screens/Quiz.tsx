import { Link } from 'react-router-dom'
import { BrainCircuit, Flame, ListChecks, Play } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { STREAK, todaysQuestions } from '../data/quiz'
import { TODAY, fullDate } from '../lib/date'

export default function Quiz() {
  const { t, lang } = useT()

  // Distinct topics covered today, shown as a teaser.
  const topics = Array.from(new Set(todaysQuestions.map((q) => pick(q.topic, lang))))

  return (
    <div className="screen">
      <AppHeader title={t.quiz.title} subtitle={fullDate(TODAY, lang)} />

      <div className="scroll pad">
        <section className="quizCard">
          <span className="quizCard__icon"><BrainCircuit size={30} /></span>
          <h2 className="quizCard__title">{t.quiz.todaysQuiz}</h2>
          <p className="quizCard__sub">{t.quiz.fiveQuestions}</p>

          <div className="quizCard__streak">
            <Flame size={17} />
            <span className="quizCard__streakNum">{STREAK}</span>
            <span className="quizCard__streakLabel">{t.quiz.streak}</span>
          </div>

          <Link to="/quiz/play" className="btn btn--block quizCard__start">
            <Play size={18} /> {t.quiz.start}
          </Link>
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
      </div>
    </div>
  )
}
