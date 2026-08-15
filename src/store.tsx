import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getDiscipline } from './data'
import type { Discipline } from './data/types'
import { isDue, isMastered, newCard, schedule, type CardState, type Rating } from './lib/srs'
import {
  emptyProgress,
  loadState,
  saveState,
  streakOf,
  todayKey,
  type AppState,
  type DisciplineProgress,
} from './lib/storage'

interface Store {
  state: AppState
  discipline: Discipline
  progress: DisciplineProgress
  /** 今天已复习的卡片数 */
  reviewedToday: number
  streak: number
  dueCards: string[]
  newCards: string[]
  masteredCount: number
  setDiscipline: (id: string) => void
  setDailyGoal: (n: number) => void
  cardOf: (termId: string) => CardState
  review: (termId: string, rating: Rating) => void
  toggleStar: (termId: string) => void
  markReading: (readingId: string) => void
  recordQuiz: (correct: number, total: number) => void
  resetDiscipline: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => saveState(state), [state])

  const discipline = getDiscipline(state.activeDiscipline)
  const progress = state.progress[discipline.id] ?? emptyProgress()

  const mutate = useCallback(
    (fn: (p: DisciplineProgress) => DisciplineProgress) => {
      setState((s) => {
        const id = s.activeDiscipline
        const current = s.progress[id] ?? emptyProgress()
        return { ...s, progress: { ...s.progress, [id]: fn(current) } }
      })
    },
    [],
  )

  const cardOf = useCallback(
    (termId: string) => progress.cards[termId] ?? newCard(termId),
    [progress.cards],
  )

  const review = useCallback(
    (termId: string, rating: Rating) => {
      const now = Date.now()
      mutate((p) => {
        const card = p.cards[termId] ?? newCard(termId, now)
        const key = todayKey()
        return {
          ...p,
          cards: { ...p.cards, [termId]: schedule(card, rating, now) },
          reviewsByDay: { ...p.reviewsByDay, [key]: (p.reviewsByDay[key] ?? 0) + 1 },
        }
      })
    },
    [mutate],
  )

  const toggleStar = useCallback(
    (termId: string) =>
      mutate((p) => ({
        ...p,
        starred: p.starred.includes(termId)
          ? p.starred.filter((x) => x !== termId)
          : [...p.starred, termId],
      })),
    [mutate],
  )

  const markReading = useCallback(
    (readingId: string) =>
      mutate((p) =>
        p.readingsDone.includes(readingId)
          ? p
          : { ...p, readingsDone: [...p.readingsDone, readingId] },
      ),
    [mutate],
  )

  const recordQuiz = useCallback(
    (correct: number, total: number) =>
      mutate((p) => ({
        ...p,
        quizHistory: [...p.quizHistory, { at: Date.now(), correct, total }].slice(-50),
      })),
    [mutate],
  )

  const resetDiscipline = useCallback(
    () => mutate(() => emptyProgress()),
    [mutate],
  )

  const value = useMemo<Store>(() => {
    const now = Date.now()
    const seen = progress.cards
    const dueCards = discipline.terms
      .filter((t) => seen[t.id] && isDue(seen[t.id], now))
      .map((t) => t.id)
    const newCards = discipline.terms.filter((t) => !seen[t.id]).map((t) => t.id)
    return {
      state,
      discipline,
      progress,
      reviewedToday: progress.reviewsByDay[todayKey()] ?? 0,
      streak: streakOf(progress.reviewsByDay),
      dueCards,
      newCards,
      masteredCount: Object.values(seen).filter(isMastered).length,
      setDiscipline: (id) => setState((s) => ({ ...s, activeDiscipline: id })),
      setDailyGoal: (n) => setState((s) => ({ ...s, dailyGoal: n })),
      cardOf,
      review,
      toggleStar,
      markReading,
      recordQuiz,
      resetDiscipline,
    }
  }, [state, discipline, progress, cardOf, review, toggleStar, markReading, recordQuiz, resetDiscipline])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore 必须在 StoreProvider 内部使用')
  return ctx
}
