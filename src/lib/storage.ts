import type { CardState } from './srs'

export interface DisciplineProgress {
  cards: Record<string, CardState>
  /** 日期(YYYY-MM-DD) -> 当天复习卡片数 */
  reviewsByDay: Record<string, number>
  /** 已完成的阅读 id */
  readingsDone: string[]
  /** 测验历史，用于展示正确率走势 */
  quizHistory: { at: number; correct: number; total: number }[]
  starred: string[]
}

export interface AppState {
  activeDiscipline: string
  dailyGoal: number
  progress: Record<string, DisciplineProgress>
}

const KEY = 'esp-english:v1'

export const emptyProgress = (): DisciplineProgress => ({
  cards: {},
  reviewsByDay: {},
  readingsDone: [],
  quizHistory: [],
  starred: [],
})

export const defaultState = (): AppState => ({
  activeDiscipline: 'cs',
  dailyGoal: 20,
  progress: {},
})

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return { ...defaultState(), ...parsed, progress: parsed.progress ?? {} }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // 隐私模式下 localStorage 可能不可写，静默降级为不保存
  }
}

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** 连续打卡天数：从今天（或昨天）往前数有复习记录的连续天数 */
export function streakOf(reviewsByDay: Record<string, number>): number {
  const day = new Date()
  if (!reviewsByDay[todayKey(day)]) day.setDate(day.getDate() - 1)
  let streak = 0
  while (reviewsByDay[todayKey(day)]) {
    streak += 1
    day.setDate(day.getDate() - 1)
  }
  return streak
}

/** 最近 n 天的复习量，用于仪表盘柱状图 */
export function lastDays(reviewsByDay: Record<string, number>, n: number) {
  const out: { key: string; label: string; count: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = todayKey(d)
    out.push({ key, label: `${d.getMonth() + 1}/${d.getDate()}`, count: reviewsByDay[key] ?? 0 })
  }
  return out
}
