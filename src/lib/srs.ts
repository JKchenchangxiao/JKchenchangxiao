export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface CardState {
  id: string
  /** 难度系数，越小复习越频繁 */
  ease: number
  /** 当前间隔（天） */
  interval: number
  /** 连续答对次数 */
  reps: number
  /** 遗忘次数 */
  lapses: number
  /** 下次复习时间戳 */
  due: number
  last: number
}

export const DAY = 86_400_000
const MIN_EASE = 1.3
/** "重来"的卡片十分钟后再出现，同一场次内还能再练一次 */
const RELEARN_DELAY = 10 * 60 * 1000

export const newCard = (id: string, now = Date.now()): CardState => ({
  id,
  ease: 2.5,
  interval: 0,
  reps: 0,
  lapses: 0,
  due: now,
  last: 0,
})

/** SM-2 的简化版：够用、可解释，不引入额外依赖 */
export function schedule(card: CardState, rating: Rating, now = Date.now()): CardState {
  let { ease, interval, reps, lapses } = card

  switch (rating) {
    case 'again':
      ease = Math.max(MIN_EASE, ease - 0.2)
      reps = 0
      lapses += 1
      return { ...card, ease, interval: 0, reps, lapses, due: now + RELEARN_DELAY, last: now }
    case 'hard':
      ease = Math.max(MIN_EASE, ease - 0.15)
      interval = interval === 0 ? 1 : Math.max(1, interval * 1.2)
      reps += 1
      break
    case 'good':
      interval = reps === 0 ? 1 : reps === 1 ? 3 : interval * ease
      reps += 1
      break
    case 'easy':
      ease = ease + 0.15
      interval = reps === 0 ? 3 : interval * ease * 1.3
      reps += 1
      break
  }

  interval = Math.round(Math.min(interval, 365) * 100) / 100
  return { ...card, ease, interval, reps, lapses, due: now + interval * DAY, last: now }
}

export const isDue = (card: CardState, now = Date.now()) => card.due <= now

/** 已掌握：连续答对 3 次以上且间隔超过 7 天 */
export const isMastered = (card: CardState) => card.reps >= 3 && card.interval >= 7

export function nextIntervalLabel(card: CardState, rating: Rating): string {
  const next = schedule(card, rating)
  if (rating === 'again') return '10 分钟'
  if (next.interval < 1) return '不到 1 天'
  if (next.interval < 30) return `${Math.round(next.interval)} 天`
  return `${(next.interval / 30).toFixed(1)} 个月`
}
