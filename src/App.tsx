import type { CSSProperties } from 'react'
import { useRoute, type Route } from './lib/router'
import { useStore } from './store'
import { disciplines } from './data'
import Dashboard from './pages/Dashboard'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import ReadingPage from './pages/Reading'
import Phrases from './pages/Phrases'
import Glossary from './pages/Glossary'

const NAV: { id: Route; label: string; icon: string; desc: string }[] = [
  { id: 'dashboard', label: '学习总览', icon: '◎', desc: '今日计划与进度' },
  { id: 'flashcards', label: '术语闪卡', icon: '❐', desc: '间隔重复记忆' },
  { id: 'quiz', label: '术语测验', icon: '✓', desc: '释义与拼写检测' },
  { id: 'reading', label: '专业阅读', icon: '❡', desc: '文献选段精读' },
  { id: 'phrases', label: '学术句式', icon: '❝', desc: '论文与口语表达' },
  { id: 'glossary', label: '全部词库', icon: '☰', desc: '检索与收藏' },
]

export default function App() {
  const [route, navigate] = useRoute()
  const { discipline, setDiscipline, dueCards, newCards } = useStore()

  const badge = (id: Route) =>
    id === 'flashcards' && dueCards.length + newCards.length > 0
      ? dueCards.length + newCards.length
      : null

  return (
    <div
      className="min-h-screen"
      style={{ '--accent': discipline.color } as CSSProperties}
    >
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 lg:pb-10">
        <aside className="sticky top-6 hidden h-fit w-64 shrink-0 lg:block">
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-lg text-white">
              英
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">专业英语学习站</div>
              <div className="text-xs text-slate-400">English for Your Major</div>
            </div>
          </div>

          <label className="mb-1 block px-2 text-xs font-medium text-slate-400">当前专业</label>
          <select
            value={discipline.id}
            onChange={(e) => setDiscipline(e.target.value)}
            className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[var(--accent)]"
          >
            {disciplines.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.name}
              </option>
            ))}
          </select>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = route === item.id
              const count = badge(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    active
                      ? 'bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                      : 'text-slate-500 hover:bg-white/60'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-lg text-sm ${
                      active ? 'bg-[var(--accent)] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.label}</span>
                    <span className="block truncate text-xs text-slate-400">{item.desc}</span>
                  </span>
                  {count && (
                    <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-white">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold text-slate-900">专业英语学习站</div>
              <select
                value={discipline.id}
                onChange={(e) => setDiscipline(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none"
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.icon} {d.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {route === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {route === 'flashcards' && <Flashcards />}
          {route === 'quiz' && <Quiz />}
          {route === 'reading' && <ReadingPage />}
          {route === 'phrases' && <Phrases />}
          {route === 'glossary' && <Glossary />}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
              route === item.id ? 'text-[var(--accent)]' : 'text-slate-400'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label.replace('学习', '').replace('术语', '').replace('专业', '').replace('全部', '')}
          </button>
        ))}
      </nav>
    </div>
  )
}
