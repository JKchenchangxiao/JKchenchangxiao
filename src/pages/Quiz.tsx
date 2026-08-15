import { useCallback, useMemo, useState } from 'react'
import { useStore } from '../store'
import { allTags } from '../data'
import { Button, Card, SpeakButton, Tag } from '../components/ui'
import { generateQuiz, isChoice, spellMatches, type Question, type QuizKind } from '../lib/quiz'

const KIND_LABEL: Record<QuizKind, string> = {
  en2zh: '英译中',
  zh2en: '中译英',
  cloze: '例句填空',
  spell: '拼写',
}

const COUNTS = [5, 10, 20]

export default function Quiz() {
  const { discipline, recordQuiz, review, progress } = useStore()
  const [tag, setTag] = useState<string | null>(null)
  const [count, setCount] = useState(10)
  const [kinds, setKinds] = useState<QuizKind[]>(['en2zh', 'zh2en', 'cloze', 'spell'])
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState<null | boolean>(null)
  const [score, setScore] = useState(0)
  const [wrongIds, setWrongIds] = useState<string[]>([])

  const tags = useMemo(() => allTags(discipline), [discipline])
  const pool = useMemo(
    () => discipline.terms.filter((t) => !tag || t.tags.includes(tag)),
    [discipline, tag],
  )

  const start = useCallback(() => {
    setQuestions(generateQuiz(pool, count, kinds))
    setIndex(0)
    setScore(0)
    setWrongIds([])
    setInput('')
    setChecked(null)
  }, [pool, count, kinds])

  const q = questions?.[index]

  const submit = (choice?: number) => {
    if (!q || checked !== null) return
    const ok = isChoice(q) ? choice === q.answer : spellMatches(input, q.answer)
    setChecked(ok)
    if (ok) setScore((s) => s + 1)
    else setWrongIds((w) => [...w, q.termId])
    // 测验结果反哺记忆曲线：答错的词会更早再次出现在闪卡里
    review(q.termId, ok ? 'good' : 'again')
  }

  const next = () => {
    if (!questions) return
    if (index + 1 >= questions.length) {
      recordQuiz(score, questions.length)
      setIndex(questions.length)
      return
    }
    setIndex((i) => i + 1)
    setInput('')
    setChecked(null)
  }

  if (!questions) {
    const history = progress.quizHistory.slice(-6).reverse()
    return (
      <div className="fade-up space-y-5">
        <Card className="space-y-5 p-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">术语测验</h1>
            <p className="mt-1 text-sm text-slate-500">
              四种题型混合出题，答错的词会自动回到闪卡队列的前面。
            </p>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">范围</div>
            <div className="flex flex-wrap gap-2">
              <Tag active={!tag} onClick={() => setTag(null)}>
                全部 {discipline.terms.length}
              </Tag>
              {tags.map((t) => (
                <Tag key={t} active={tag === t} onClick={() => setTag(t)}>
                  {t}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">题型</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(KIND_LABEL) as QuizKind[]).map((k) => (
                <Tag
                  key={k}
                  active={kinds.includes(k)}
                  onClick={() =>
                    setKinds((prev) =>
                      prev.includes(k)
                        ? prev.length > 1
                          ? prev.filter((x) => x !== k)
                          : prev
                        : [...prev, k],
                    )
                  }
                >
                  {KIND_LABEL[k]}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">题量</div>
            <div className="flex gap-2">
              {COUNTS.map((c) => (
                <Tag key={c} active={count === c} onClick={() => setCount(c)}>
                  {c} 题
                </Tag>
              ))}
            </div>
          </div>

          <Button variant="primary" onClick={start} disabled={pool.length < 4}>
            开始测验
          </Button>
          {pool.length < 4 && (
            <p className="text-xs text-red-500">该范围术语不足 4 个，无法生成选择题。</p>
          )}
        </Card>

        {history.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-3 font-semibold text-slate-900">历史成绩</h2>
            <ul className="divide-y divide-slate-100 text-sm">
              {history.map((h) => (
                <li key={h.at} className="flex items-center justify-between py-2">
                  <span className="text-slate-500">
                    {new Date(h.at).toLocaleString('zh-CN', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="tabular-nums text-slate-800">
                    {h.correct} / {h.total}
                    <span className="ml-2 text-slate-400">
                      {Math.round((h.correct / h.total) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    )
  }

  if (!q) {
    const pct = Math.round((score / questions.length) * 100)
    const wrongTerms = discipline.terms.filter((t) => wrongIds.includes(t.id))
    return (
      <div className="fade-up space-y-5">
        <Card className="p-8 text-center">
          <div className="text-5xl">{pct >= 90 ? '🏆' : pct >= 70 ? '👍' : '📚'}</div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            {score} / {questions.length} · {pct}%
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {pct >= 90
              ? '这一组掌握得很扎实。'
              : pct >= 70
                ? '大部分没问题，错的几个明天还会再考。'
                : '错得不少，建议先回闪卡把这些词过一遍。'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="primary" onClick={start}>
              再来一组
            </Button>
            <Button onClick={() => setQuestions(null)}>调整设置</Button>
          </div>
        </Card>

        {wrongTerms.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-3 font-semibold text-slate-900">需要回炉的词</h2>
            <ul className="space-y-3">
              {wrongTerms.map((t) => (
                <li key={t.id} className="flex items-start gap-3">
                  <SpeakButton text={t.term} className="h-8 w-8" />
                  <div>
                    <div className="serif font-medium text-slate-900">{t.term}</div>
                    <div className="text-sm text-slate-500">
                      {t.zh} · {t.en}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="fade-up space-y-5">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          第 {index + 1} / {questions.length} 题 · {KIND_LABEL[q.kind]}
        </span>
        <span className="tabular-nums">正确 {score}</span>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <h2
            className={`text-2xl font-semibold text-slate-900 ${
              q.kind === 'zh2en' ? '' : 'serif'
            } ${q.kind === 'cloze' ? 'text-xl leading-relaxed' : ''}`}
          >
            {q.prompt}
          </h2>
          {q.kind !== 'zh2en' && q.kind !== 'spell' && (
            <SpeakButton text={q.prompt.replace('______', 'blank')} />
          )}
        </div>
        {q.sub && <p className="mt-2 text-sm text-slate-400">{q.sub}</p>}

        {isChoice(q) ? (
          <div className="mt-6 grid gap-2">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answer
              const state =
                checked === null
                  ? 'idle'
                  : isAnswer
                    ? 'correct'
                    : 'other'
              return (
                <button
                  key={opt}
                  disabled={checked !== null}
                  onClick={() => submit(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-[15px] transition ${
                    state === 'correct'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : state === 'other'
                        ? 'border-slate-200 bg-white text-slate-400'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-[var(--accent)] hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-2 text-xs text-slate-400">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={q.kind === 'en2zh' ? '' : 'serif'}>{opt}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (checked === null) submit()
              else next()
            }}
          >
            <input
              autoFocus
              value={input}
              disabled={checked !== null}
              onChange={(e) => setInput(e.target.value)}
              placeholder="拼出这个英文术语"
              className="serif flex-1 rounded-xl border border-slate-200 px-4 py-3 text-lg outline-none focus:border-[var(--accent)] disabled:bg-slate-50"
            />
            <Button variant="primary" type="submit">
              {checked === null ? '提交' : '下一题'}
            </Button>
          </form>
        )}

        {checked !== null && (
          <div
            className={`fade-up mt-5 rounded-xl p-4 text-sm ${
              checked ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="font-medium">{checked ? '答对了' : '答错了'}</div>
            <div className="mt-1 opacity-90">{q.explain}</div>
          </div>
        )}
      </Card>

      {checked !== null && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={next}>
            {index + 1 >= questions.length ? '查看结果' : '下一题 →'}
          </Button>
        </div>
      )}
    </div>
  )
}
