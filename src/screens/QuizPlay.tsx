import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Info, X } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { todaysQuestions } from '../data/quiz'

export default function QuizPlay() {
  const { t, lang } = useT()
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const q = todaysQuestions[index]
  const revealed = picked !== null
  const isLast = index === todaysQuestions.length - 1
  const correct = picked === q.answer

  const choose = (i: number) => {
    if (revealed) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (isLast) {
      navigate('/quiz/result', { state: { score: score } })
      return
    }
    setIndex(index + 1)
    setPicked(null)
  }

  return (
    <div className="screen">
      <AppHeader
        title={`${t.quiz.question} ${index + 1} / ${todaysQuestions.length}`}
        subtitle={pick(q.topic, lang)}
        back
      />

      <div className="steps" style={{ gridTemplateColumns: `repeat(${todaysQuestions.length}, 1fr)` }}>
        {todaysQuestions.map((_, i) => (
          <span
            key={i}
            className={`steps__bar ${i < index ? 'steps__bar--done' : ''} ${i === index ? 'steps__bar--now' : ''}`}
          />
        ))}
      </div>

      <div className="scroll pad">
        <h2 className="qz__q">{pick(q.q, lang)}</h2>

        <div className="qz__opts">
          {q.options.map((opt, i) => {
            const state = !revealed
              ? ''
              : i === q.answer
                ? 'qz__opt--right'
                : i === picked
                  ? 'qz__opt--wrong'
                  : 'qz__opt--dim'
            return (
              <button key={i} className={`qz__opt ${state}`} onClick={() => choose(i)}>
                <span className="qz__optLetter">{String.fromCharCode(65 + i)}</span>
                <span className="qz__optText">{pick(opt, lang)}</span>
                {revealed && i === q.answer && <Check size={19} strokeWidth={3} />}
                {revealed && i === picked && i !== q.answer && <X size={19} strokeWidth={3} />}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className={`qz__fb fade-in ${correct ? 'qz__fb--right' : 'qz__fb--wrong'}`}>
            <span className="qz__fbTitle">
              {correct ? <Check size={17} strokeWidth={3} /> : <X size={17} strokeWidth={3} />}
              {correct ? t.quiz.correct : t.quiz.incorrect}
            </span>
            <span className="qz__why">
              <Info size={14} /> {pick(q.why, lang)}
            </span>
          </div>
        )}
      </div>

      <div className="form__nav">
        <button className="btn btn--primary btn--block" disabled={!revealed} onClick={next}>
          {isLast ? t.quiz.seeResult : t.quiz.nextQ} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
