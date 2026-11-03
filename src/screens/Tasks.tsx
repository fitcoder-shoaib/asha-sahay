import { useState } from 'react'
import { useSession } from '../session'
import {
  AlertTriangle, Check, ChevronDown, ClipboardList, Clock, MapPin, Syringe,
  Stethoscope, HeartPulse, FileText, Users, User,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useT } from '../i18n'
import { pick } from '../data/types'
import { kindLabel, tasks as seed, type TaskKind } from '../data/tasks'
import { TODAY, fullDate } from '../lib/date'

const ICON: Record<TaskKind, React.ReactNode> = {
  visit: <Stethoscope size={17} />,
  immunisation: <Syringe size={17} />,
  anc: <HeartPulse size={17} />,
  ncd: <ClipboardList size={17} />,
  meeting: <Users size={17} />,
  record: <FileText size={17} />,
}

export default function Tasks() {
  const { t, lang } = useT()
  const { taskDone: done, toggleTask } = useSession()
  const [open, setOpen] = useState<string | null>(null)

  const list = [...seed].sort((a, b) => a.time.localeCompare(b.time))
  const completed = list.filter((x) => done[x.id]).length
  const pct = Math.round((completed / list.length) * 100)

  return (
    <div className="screen">
      <AppHeader title={t.tasks.title} subtitle={fullDate(TODAY, lang)} />

      <div className="scroll pad">
        {/* progress */}
        <section className="tk__head">
          <div className="row--between" style={{ marginBottom: 10 }}>
            <span className="col" style={{ minWidth: 0 }}>
              <span className="tk__headLabel">{t.tasks.progress}</span>
              <span className="tk__headValue">
                {completed} / {list.length} {t.tasks.doneWord}
              </span>
            </span>
            <span className="tk__pct">{pct}%</span>
          </div>
          <div className="tk__bar">
            <span className="tk__barFill" style={{ width: `${pct}%` }} />
          </div>
        </section>

        <p className="tk__hint">{t.tasks.hint}</p>

        {list.map((x) => {
          const isDone = done[x.id]
          const isOpen = open === x.id
          return (
            <article key={x.id} className={`tk ${isDone ? 'tk--done' : ''}`}>
              <div className="tk__row">
                <button
                  className={`tk__check ${isDone ? 'tk__check--on' : ''}`}
                  onClick={() => toggleTask(x.id)}
                  role="checkbox"
                  aria-checked={isDone}
                  aria-label={pick(x.title, lang)}
                >
                  {isDone && <Check size={15} strokeWidth={3.2} />}
                </button>

                <button
                  className="tk__main"
                  onClick={() => setOpen(isOpen ? null : x.id)}
                  aria-expanded={isOpen}
                >
                  <span className="tk__meta">
                    <span className="tk__time"><Clock size={12} /> {x.time}</span>
                    <span className={`tk__kind tk__kind--${x.kind}`}>
                      {ICON[x.kind]} {pick(kindLabel[x.kind], lang)}
                    </span>
                    {x.priority === 'high' && !isDone && (
                      <span className="tk__pri"><AlertTriangle size={11} /> {t.tasks.priority}</span>
                    )}
                  </span>

                  <span className="tk__title">{pick(x.title, lang)}</span>

                  <span className="tk__sub">
                    <span className="tk__subItem"><User size={12} /> {pick(x.who, lang)}</span>
                    <span className="tk__subItem"><MapPin size={12} /> {pick(x.where, lang)}</span>
                  </span>

                  <ChevronDown size={17} className={`tk__chev ${isOpen ? 'tk__chev--open' : ''}`} />
                </button>
              </div>

              {isOpen && (
                <div className="tk__detail fade-in">
                  <p className="tk__detailLabel">{t.tasks.whatToDo}</p>
                  <p className="tk__detailText">{pick(x.detail, lang)}</p>
                </div>
              )}
            </article>
          )
        })}

        {completed === list.length && (
          <div className="tk__allDone fade-in">
            <Check size={18} strokeWidth={3} /> {t.tasks.allDone}
          </div>
        )}
      </div>
    </div>
  )
}
