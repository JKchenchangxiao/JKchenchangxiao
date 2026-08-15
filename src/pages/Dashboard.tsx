import { useStore } from '../store'
import type { Route } from '../lib/router'
import { Button, Card, Progress, SpeakButton, Stat } from '../components/ui'
import { lastDays } from '../lib/storage'
import { generalPhrases } from '../data/phrasebank'

export default function Dashboard({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const {
    discipline,
    progress,
    reviewedToday,
    streak,
    dueCards,
    newCards,
    masteredCount,
    state,
    setDailyGoal,
    resetDiscipline,
  } = useStore()

  const days = lastDays(progress.reviewsByDay, 14)
  const peak = Math.max(1, ...days.map((d) => d.count))
  const total = discipline.terms.length
  const touched = Object.keys(progress.cards).length

  // 每天固定推荐同一个词，日期一变才轮换
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  const wordOfDay = discipline.terms[dayIndex % total]
  const phraseOfDay = generalPhrases[dayIndex % generalPhrases.length]

  const quizAccuracy = (() => {
    const recent = progress.quizHistory.slice(-5)
    if (recent.length === 0) return null
    const c = recent.reduce((s, q) => s + q.correct, 0)
    const t = recent.reduce((s, q) => s + q.total, 0)
    return Math.round((c / t) * 100)
  })()

  return (
    <div className="fade-up space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="text-lg">{discipline.icon}</span>
              {discipline.name} · {discipline.nameEn}
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {reviewedToday >= state.dailyGoal
                ? '今日目标已完成，继续保持'
                : dueCards.length > 0
                  ? `有 ${dueCards.length} 张卡片到期，先把旧词捡回来`
                  : '开始今天的学习吧'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{discipline.description}</p>
          </div>
          <Button variant="primary" className="shrink-0" onClick={() => onNavigate('flashcards')}>
            开始学习 →
          </Button>
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              今日进度 <span className="font-medium text-slate-800">{reviewedToday}</span> /{' '}
              {state.dailyGoal} 张
            </span>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              每日目标
              <select
                value={state.dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 outline-none"
              >
                {[10, 20, 30, 50, 80].map((n) => (
                  <option key={n} value={n}>
                    {n} 张
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Progress value={reviewedToday} max={state.dailyGoal} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="待复习" value={dueCards.length} hint={`另有 ${newCards.length} 个新词未学`} />
        <Stat label="已掌握" value={masteredCount} hint={`共 ${total} 个术语`} />
        <Stat label="连续打卡" value={`${streak} 天`} hint={streak > 0 ? '别断了' : '今天开个头'} />
        <Stat
          label="近期测验正确率"
          value={quizAccuracy === null ? '—' : `${quizAccuracy}%`}
          hint={quizAccuracy === null ? '还没做过测验' : '最近 5 次平均'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-semibold text-slate-900">最近 14 天</h2>
            <span className="text-xs text-slate-400">柱高 = 当天复习卡片数</span>
          </div>
          <div className="flex h-32 items-end gap-1.5">
            {days.map((d) => (
              <div key={d.key} className="group flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full flex-1">
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-[var(--accent)] opacity-80 transition-all group-hover:opacity-100"
                    style={{ height: `${(d.count / peak) * 100}%`, minHeight: d.count ? 4 : 0 }}
                    title={`${d.label}：${d.count} 张`}
                  />
                  {d.count === 0 && (
                    <div className="absolute bottom-0 h-1 w-full rounded-full bg-slate-100" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm">
            <Button onClick={() => onNavigate('quiz')}>做一组测验</Button>
            <Button onClick={() => onNavigate('reading')}>
              精读文献（{progress.readingsDone.length}/{discipline.readings.length}）
            </Button>
            <Button onClick={() => onNavigate('phrases')}>查学术句式</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              今日一词
            </div>
            <div className="mt-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="serif truncate text-xl font-semibold text-slate-900">
                  {wordOfDay.term}
                </div>
                <div className="text-xs text-slate-400">{wordOfDay.phonetic}</div>
              </div>
              <SpeakButton text={wordOfDay.term} />
            </div>
            <div className="mt-3 text-sm text-slate-700">{wordOfDay.zh}</div>
            <p className="serif mt-3 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
              {wordOfDay.example}
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              今日句式 · {phraseOfDay.fn}
            </div>
            <p className="serif mt-2 text-sm text-slate-800">{phraseOfDay.phrases[0].en}</p>
            <p className="mt-1 text-sm text-slate-500">{phraseOfDay.phrases[0].zh}</p>
          </Card>
        </div>
      </div>

      <Card className="flex flex-col gap-3 p-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          进度保存在浏览器本地（{touched}/{total} 个术语已建立记忆卡），换设备不会同步。
        </span>
        <Button
          variant="ghost"
          className="shrink-0 text-red-500 hover:bg-red-50"
          onClick={() => {
            if (confirm(`确定清空「${discipline.name}」的全部学习进度吗？此操作不可撤销。`)) {
              resetDiscipline()
            }
          }}
        >
          清空本专业进度
        </Button>
      </Card>
    </div>
  )
}
