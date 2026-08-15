import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { allTags } from '../data'
import { Card, SpeakButton, Tag } from '../components/ui'
import { isMastered } from '../lib/srs'

export default function Glossary() {
  const { discipline, progress, toggleStar } = useStore()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const [starredOnly, setStarredOnly] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const tags = useMemo(() => allTags(discipline), [discipline])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return discipline.terms.filter(
      (t) =>
        (!tag || t.tags.includes(tag)) &&
        (!starredOnly || progress.starred.includes(t.id)) &&
        (!q ||
          t.term.toLowerCase().includes(q) ||
          t.en.toLowerCase().includes(q) ||
          t.zh.includes(query.trim())),
    )
  }, [discipline, query, tag, starredOnly, progress.starred])

  const statusOf = (id: string) => {
    const card = progress.cards[id]
    if (!card) return { label: '未学', className: 'bg-slate-100 text-slate-500' }
    if (isMastered(card)) return { label: '已掌握', className: 'bg-emerald-50 text-emerald-700' }
    return { label: `学习中 ${card.reps}`, className: 'bg-amber-50 text-amber-700' }
  }

  return (
    <div className="fade-up space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {discipline.name}词库
          <span className="ml-2 text-sm font-normal text-slate-400">
            {list.length} / {discipline.terms.length}
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">支持中英文检索，点条目展开例句。</p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索术语、释义或中文"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
      />

      <div className="flex flex-wrap gap-2">
        <Tag active={!tag} onClick={() => setTag(null)}>
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

      <Card className="divide-y divide-slate-100">
        {list.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">没有匹配的术语</div>
        )}
        {list.map((t) => {
          const status = statusOf(t.id)
          const open = expanded === t.id
          const starred = progress.starred.includes(t.id)
          return (
            <div key={t.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <SpeakButton text={t.term} className="mt-0.5 h-8 w-8" />
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => setExpanded(open ? null : t.id)}
                >
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="serif text-lg font-medium text-slate-900">{t.term}</span>
                    <span className="text-xs text-slate-400">{t.phonetic}</span>
                    {t.pos && <span className="text-xs italic text-slate-400">{t.pos}</span>}
                  </div>
                  <div className="mt-0.5 text-sm text-slate-600">{t.zh}</div>
                  {open && (
                    <div className="fade-up mt-3 space-y-2 border-l-2 border-slate-100 pl-3">
                      <p className="serif text-sm text-slate-700">{t.en}</p>
                      <p className="serif text-sm italic text-slate-800">{t.example}</p>
                      <p className="text-sm text-slate-500">{t.exampleZh}</p>
                      {t.confusable && (
                        <p className="text-xs text-slate-400">易混：{t.confusable.join(' / ')}</p>
                      )}
                    </div>
                  )}
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${status.className}`}>
                    {status.label}
                  </span>
                  <button
                    onClick={() => toggleStar(t.id)}
                    className={`text-lg leading-none transition ${
                      starred ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                    }`}
                    title={starred ? '取消收藏' : '收藏'}
                  >
                    {starred ? '★' : '☆'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
