import type { Term } from '../data/types'

export type QuizKind = 'en2zh' | 'zh2en' | 'cloze' | 'spell'

interface Base {
  id: string
  termId: string
  kind: QuizKind
  prompt: string
  sub?: string
  explain: string
}

export interface ChoiceQuestion extends Base {
  kind: 'en2zh' | 'zh2en' | 'cloze'
  options: string[]
  answer: number
}

export interface SpellQuestion extends Base {
  kind: 'spell'
  answer: string
}

export type Question = ChoiceQuestion | SpellQuestion

export const isChoice = (q: Question): q is ChoiceQuestion => q.kind !== 'spell'

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 干扰项优先取易混词，其次同子领域，最后随机，保证足够有区分度 */
function distractors(target: Term, pool: Term[], n: number): Term[] {
  const byName = new Map(pool.map((t) => [t.term.toLowerCase(), t]))
  const picked: Term[] = []
  const push = (t?: Term) => {
    if (t && t.id !== target.id && !picked.some((p) => p.id === t.id)) picked.push(t)
  }

  target.confusable?.forEach((c) => push(byName.get(c.toLowerCase())))
  shuffle(pool.filter((t) => t.tags.some((tag) => target.tags.includes(tag)))).forEach(push)
  shuffle(pool).forEach(push)

  return picked.slice(0, n)
}

/** 用 ____ 挖掉例句里的目标词（含复数/时态等简单变形） */
function blank(example: string, term: string): string | null {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`\\b${escaped}(s|es|ed|ing)?\\b`, 'i')
  if (!re.test(example)) return null
  return example.replace(re, '______')
}

export function generateQuiz(terms: Term[], count = 10, kinds?: QuizKind[]): Question[] {
  const allowed = kinds && kinds.length > 0 ? kinds : (['en2zh', 'zh2en', 'cloze', 'spell'] as QuizKind[])
  const picked = shuffle(terms).slice(0, count)

  return picked.map((term, i) => {
    let kind = allowed[i % allowed.length]
    const others = distractors(term, terms, 3)
    const cloze = blank(term.example, term.term)
    if (kind === 'cloze' && !cloze) kind = 'en2zh'

    if (kind === 'spell') {
      return {
        id: `${term.id}-${i}`,
        termId: term.id,
        kind,
        prompt: term.zh,
        sub: term.en,
        answer: term.term,
        explain: `${term.term} — ${term.zh}`,
      }
    }

    const correct =
      kind === 'en2zh' ? term.zh : kind === 'zh2en' ? term.term : term.term
    const wrong = others.map((t) => (kind === 'en2zh' ? t.zh : t.term))
    const options = shuffle([correct, ...wrong])

    return {
      id: `${term.id}-${i}`,
      termId: term.id,
      kind,
      prompt:
        kind === 'en2zh' ? term.term : kind === 'zh2en' ? term.zh : (cloze as string),
      sub:
        kind === 'en2zh'
          ? term.phonetic
          : kind === 'zh2en'
            ? term.en
            : '选出最合适的术语填入空格',
      options,
      answer: options.indexOf(correct),
      explain: `${term.term}（${term.zh}）：${term.en}`,
    }
  })
}

/** 拼写题判定：忽略大小写、多余空格和连字符差异 */
export const spellMatches = (input: string, answer: string) =>
  input.trim().toLowerCase().replace(/[\s-]+/g, ' ') ===
  answer.trim().toLowerCase().replace(/[\s-]+/g, ' ')
