import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { generalPhrases } from '../data/phrasebank'
import { Card, SpeakButton } from '../components/ui'

export default function Phrases() {
  const { discipline } = useStore()
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const groups = useMemo(() => {
    const merged = [
      ...discipline.phrases.map((g) => ({ ...g, own: true })),
      ...generalPhrases.map((g) => ({ ...g, own: false })),
    ]
    const q = query.trim().toLowerCase()
    if (!q) return merged
    return merged
      .map((g) => ({
        ...g,
        phrases: g.phrases.filter(
          (p) => p.en.toLowerCase().includes(q) || p.zh.includes(query.trim()),
        ),
      }))
      .filter((g) => g.phrases.length > 0)
  }, [discipline, query])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className="fade-up space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">学术与专业句式库</h1>
        <p className="mt-1 text-sm text-slate-500">
          按写作功能分组：写论文时缺哪一段，就查哪一组。点句子可直接复制。
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索中英文，例如 limitation / 局限"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
      />

      {groups.length === 0 && (
        <Card className="p-8 text-center text-sm text-slate-500">没有匹配的句式</Card>
      )}

      <div className="space-y-4">
        {groups.map((g) => (
          <Card key={g.id} className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-semibold text-slate-900">{g.fn}</h2>
              {g.own && (
                <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs text-[var(--accent)]">
                  {discipline.name}专用
                </span>
              )}
            </div>
            <ul className="space-y-3">
              {g.phrases.map((p) => (
                <li key={p.en} className="group flex items-start gap-3">
                  <SpeakButton text={p.en} className="mt-0.5 h-8 w-8" />
                  <button
                    onClick={() => copy(p.en)}
                    className="min-w-0 flex-1 text-left"
                    title="点击复制英文"
                  >
                    <div className="serif text-[15px] leading-relaxed text-slate-900 group-hover:text-[var(--accent)]">
                      {p.en}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-500">{p.zh}</div>
                  </button>
                  {copied === p.en && (
                    <span className="shrink-0 self-center text-xs text-emerald-600">已复制</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
