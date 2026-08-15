import { Fragment, useMemo, useState } from 'react'
import { useStore } from '../store'
import { Button, Card, SpeakButton } from '../components/ui'
import type { Reading } from '../data/types'

const LEVEL_LABEL = { basic: '入门', intermediate: '进阶', advanced: '高阶' } as const

function AnnotatedText({
  text,
  glossary,
}: {
  text: string
  glossary: { term: string; zh: string }[]
}) {
  const parts = useMemo(() => {
    if (glossary.length === 0) return [{ text, gloss: null as string | null }]
    const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length)
    const pattern = sorted
      .map((g) => g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')
    const re = new RegExp(`(${pattern})`, 'gi')
    const lookup = new Map(sorted.map((g) => [g.term.toLowerCase(), g.zh]))
    return text.split(re).map((chunk) => ({
      text: chunk,
      gloss: lookup.get(chunk.toLowerCase()) ?? null,
    }))
  }, [text, glossary])

  return (
    <>
      {parts.map((p, i) =>
        p.gloss ? (
          <span
            key={i}
            title={p.gloss}
            className="group relative cursor-help border-b border-dashed border-[var(--accent)] text-[var(--accent)]"
          >
            {p.text}
            <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
              {p.gloss}
            </span>
          </span>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  )
}

function ReadingDetail({ reading, onBack }: { reading: Reading; onBack: () => void }) {
  const { markReading, progress } = useStore()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showGlossary, setShowGlossary] = useState(false)

  const answered = Object.keys(answers).length
  const correct = reading.questions.filter((q, i) => answers[i] === q.answer).length
  const finished = answered === reading.questions.length
  const done = progress.readingsDone.includes(reading.id)

  const pick = (qi: number, oi: number) => {
    if (answers[qi] !== undefined) return
    const nextAnswers = { ...answers, [qi]: oi }
    setAnswers(nextAnswers)
    if (Object.keys(nextAnswers).length === reading.questions.length) markReading(reading.id)
  }

  return (
    <div className="fade-up space-y-5">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
        ← 返回阅读列表
      </button>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {reading.genre}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {LEVEL_LABEL[reading.level]}
          </span>
          {done && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">已完成</span>
          )}
        </div>
        <h1 className="serif mt-3 text-2xl font-semibold leading-snug text-slate-900">
          {reading.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{reading.titleZh}</p>

        <div className="serif mt-6 space-y-4 text-[17px] leading-8 text-slate-800">
          {reading.paragraphs.map((p, i) => (
            <div key={i} className="group flex items-start gap-2">
              <p className="flex-1">
                <AnnotatedText text={p} glossary={reading.glossary} />
              </p>
              <SpeakButton text={p} className="mt-1 opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={() => setShowGlossary((v) => !v)}
            className="text-sm font-medium text-[var(--accent)]"
          >
            {showGlossary ? '收起词表' : `展开生词表（${reading.glossary.length}）`}
          </button>
          {showGlossary && (
            <ul className="fade-up mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {reading.glossary.map((g) => (
                <li key={g.term} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="serif text-slate-800">{g.term}</span>
                  <span className="text-slate-500">{g.zh}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-semibold text-slate-900">理解检测</h2>
          {finished && (
            <span className="text-sm text-slate-500">
              答对 {correct} / {reading.questions.length}
            </span>
          )}
        </div>

        <ol className="space-y-6">
          {reading.questions.map((q, qi) => {
            const chosen = answers[qi]
            return (
              <li key={qi}>
                <p className="font-medium text-slate-800">
                  {qi + 1}. {q.q}
                </p>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const isAnswer = oi === q.answer
                    const revealed = chosen !== undefined
                    return (
                      <button
                        key={oi}
                        disabled={revealed}
                        onClick={() => pick(qi, oi)}
                        className={`rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                          revealed && isAnswer
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : revealed && oi === chosen
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : revealed
                                ? 'border-slate-200 text-slate-400'
                                : 'border-slate-200 text-slate-700 hover:border-[var(--accent)] hover:bg-slate-50'
                        }`}
                      >
                        <span className="mr-2 text-xs text-slate-400">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {chosen !== undefined && (
                  <p className="fade-up mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {q.explain}
                  </p>
                )}
              </li>
            )
          })}
        </ol>

        {finished && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onBack}>读下一篇 →</Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default function ReadingPage() {
  const { discipline, progress } = useStore()
  const [openId, setOpenId] = useState<string | null>(null)

  const reading = discipline.readings.find((r) => r.id === openId)
  if (reading) return <ReadingDetail reading={reading} onBack={() => setOpenId(null)} />

  return (
    <div className="fade-up space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">专业阅读</h1>
        <p className="mt-1 text-sm text-slate-500">
          真实体裁的选段：论文摘要、教材、病例、财报。生词已做行内标注，鼠标悬停即可看释义。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {discipline.readings.map((r) => {
          const done = progress.readingsDone.includes(r.id)
          return (
            <Card
              key={r.id}
              className="cursor-pointer p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <button className="w-full text-left" onClick={() => setOpenId(r.id)}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                    {r.genre}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                    {LEVEL_LABEL[r.level]}
                  </span>
                  {done && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                      已完成
                    </span>
                  )}
                </div>
                <h2 className="serif mt-3 text-lg font-semibold leading-snug text-slate-900">
                  {r.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{r.titleZh}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {r.paragraphs.length} 段 · {r.glossary.length} 个生词 · {r.questions.length} 道题
                </p>
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
