import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import { allTags } from '../data'
import { Card, EmptyState, Progress, SpeakButton, Tag } from '../components/ui'
import { isDue, nextIntervalLabel, type Rating } from '../lib/srs'

const RATINGS: { key: Rating; label: string; hint: string; className: string }[] = [
  { key: 'again', label: '重来', hint: '1', className: 'border-red-200 text-red-600 hover:bg-red-50' },
  { key: 'hard', label: '困难', hint: '2', className: 'border-amber-200 text-amber-700 hover:bg-amber-50' },
  { key: 'good', label: '记得', hint: '3', className: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' },
  { key: 'easy', label: '简单', hint: '4', className: 'border-sky-200 text-sky-700 hover:bg-sky-50' },
]

export default function Flashcards() {
  const { discipline, progress, state, cardOf, review, toggleStar } = useStore()
  const [tag, setTag] = useState<string | null>(null)
  const [starredOnly, setStarredOnly] = useState(false)
  const [queue, setQueue] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(0)

  const tags = useMemo(() => allTags(discipline), [discipline])

  // 队列只在切换专业/筛选时重建；进度从 ref 读取，避免答一张卡就打乱剩余顺序
  const progressRef = useRef(progress)
  progressRef.current = progress

  const buildQueue = useCallback(() => {
    const now = Date.now()
    const { cards, starred } = progressRef.current
    const pool = discipline.terms.filter(
      (t) => (!tag || t.tags.includes(tag)) && (!starredOnly || starred.includes(t.id)),
    )
    const due = pool
      .filter((t) => cards[t.id] && isDue(cards[t.id], now))
      .sort((a, b) => cards[a.id].due - cards[b.id].due)
      .map((t) => t.id)
    const fresh = pool.filter((t) => !cards[t.id]).map((t) => t.id)
    const room = Math.max(0, state.dailyGoal - due.length)
    return [...due, ...fresh.slice(0, Math.max(room, 5))]
  }, [discipline, tag, starredOnly, state.dailyGoal])

  useEffect(() => {
    setQueue(buildQueue())
    setRevealed(false)
    setDone(0)
  }, [buildQueue])

  const currentId = queue[0]
  const term = discipline.terms.find((t) => t.id === currentId)
  const card = currentId ? cardOf(currentId) : null
  const starred = currentId ? progress.starred.includes(currentId) : false

  const rate = useCallback(
    (rating: Rating) => {
      if (!currentId) return
      review(currentId, rating)
      setRevealed(false)
      setDone((d) => d + 1)
      // "重来"的卡片放回队尾，本轮结束前会再考一次
      setQueue((q) => (rating === 'again' ? [...q.slice(1), q[0]] : q.slice(1)))
    },
    [currentId, review],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!currentId) return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        if (!revealed) setRevealed(true)
        else rate('good')
        return
      }
      if (revealed && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        rate(RATINGS[Number(e.code.slice(-1)) - 1].key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentId, revealed, rate])

  const totalSession = done + queue.length

  return (
    <div className="fade-up space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Tag active={!tag && !starredOnly} onClick={() => { setTag(null); setStarredOnly(false) }}>
          全部
        </Tag>
        {tags.map((t) => (
          <Tag key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
            {t}
          </Tag>
        ))}
        <Tag active={starredOnly} onClick={() => setStarredOnly((v) => !v)}>
          ★ 收藏 {progress.starred.length}
        </Tag>
      </div>

      {!term || !card ? (
        starredOnly && progress.starred.length === 0 ? (
          <EmptyState
            icon="☆"
            title="收藏本还是空的"
            hint="在闪卡或词库里点 ☆ 收藏那些总是记不住的词，之后就能只练这一组。"
          />
        ) : (
          <EmptyState
            title="这一组已经清空了"
            hint="到期卡片都复习完了。可以换个子领域、打开收藏本，或者去做一组测验巩固一下。"
          />
        )
      ) : (
        <>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Progress value={done} max={Math.max(totalSession, 1)} />
            <span className="shrink-0 tabular-nums">
              {done} / {totalSession}
            </span>
          </div>

          <Card className="overflow-hidden">
            <div
              className="cursor-pointer select-none px-6 py-10 text-center sm:py-14"
              onClick={() => !revealed && setRevealed(true)}
            >
              <div className="flex items-center justify-center gap-3">
                <h2 className="serif text-4xl font-semibold tracking-tight text-slate-900">
                  {term.term}
                </h2>
                <SpeakButton text={term.term} />
              </div>
              <div className="mt-2 text-sm text-slate-400">
                {term.phonetic} {term.pos && <span className="ml-1 italic">{term.pos}</span>}
              </div>

              {!revealed ? (
                <p className="mt-10 text-sm text-slate-400">
                  点击卡片或按 <kbd className="rounded bg-slate-100 px-1.5 py-0.5">空格</kbd> 显示释义
                </p>
              ) : (
                <div className="flip-in mx-auto mt-8 max-w-xl space-y-4 text-left">
                  <div className="text-center text-xl font-medium text-slate-900">{term.zh}</div>
                  <p className="serif rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    {term.en}
                  </p>
                  <div className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-start gap-2">
                      <p className="serif flex-1 text-sm italic leading-relaxed text-slate-800">
                        {term.example}
                      </p>
                      <SpeakButton text={term.example} className="h-8 w-8" />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{term.exampleZh}</p>
                  </div>
                  {term.confusable && (
                    <p className="text-xs text-slate-400">
                      易混：{term.confusable.join(' / ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <button
                onClick={() => toggleStar(term.id)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  starred ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {starred ? '★ 已收藏' : '☆ 收藏'}
              </button>
              <div className="text-xs text-slate-400">
                {card.reps === 0 ? '新词' : `复习 ${card.reps} 次 · 间隔 ${Math.round(card.interval)} 天`}
              </div>
            </div>
          </Card>

          {revealed && (
            <div className="fade-up grid grid-cols-2 gap-3 sm:grid-cols-4">
              {RATINGS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => rate(r.key)}
                  className={`rounded-xl border bg-white py-3 text-sm font-medium transition ${r.className}`}
                >
                  <div>{r.label}</div>
                  <div className="mt-0.5 text-xs font-normal opacity-70">
                    {nextIntervalLabel(card, r.key)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
