export type Level = 'basic' | 'intermediate' | 'advanced'

/** 一个专业术语条目：既是词汇卡，也是测验和阅读注释的数据源 */
export interface Term {
  /** 全站唯一，建议 `${disciplineId}-${序号}` */
  id: string
  term: string
  phonetic?: string
  /** 词性，如 n. / v. / adj. */
  pos?: string
  /** 中文释义 */
  zh: string
  /** 英文释义，练习"用英语理解英语" */
  en: string
  /** 专业语境下的例句 */
  example: string
  exampleZh: string
  /** 所属子领域，用于筛选 */
  tags: string[]
  /** 易混词，出选择题时优先作为干扰项 */
  confusable?: string[]
}

export interface ReadingQuestion {
  q: string
  options: string[]
  /** options 的下标 */
  answer: number
  explain: string
}

/** 专业文献选段：模拟真实论文/教材的语言环境 */
export interface Reading {
  id: string
  title: string
  titleZh: string
  level: Level
  /** 体裁，如 论文摘要 / 教材节选 / 病例报告 */
  genre: string
  paragraphs: string[]
  /** 段内高亮的术语，鼠标悬停显示释义 */
  glossary: { term: string; zh: string }[]
  questions: ReadingQuestion[]
}

/** 按写作功能分组的学术句式 */
export interface PhraseGroup {
  id: string
  /** 功能标签，如 "描述研究缺口" */
  fn: string
  phrases: { en: string; zh: string }[]
}

export interface Discipline {
  id: string
  name: string
  nameEn: string
  icon: string
  description: string
  /** 主题色，Tailwind 里以内联 style 使用 */
  color: string
  terms: Term[]
  readings: Reading[]
  /** 本专业特有句式，会与通用学术句式库合并 */
  phrases: PhraseGroup[]
}
