import type { Discipline } from './types'
import { cs } from './disciplines/cs'
import { med } from './disciplines/med'
import { biz } from './disciplines/biz'

/**
 * 想加入自己的专业？复制 src/data/disciplines/ 下任意一个文件，
 * 改掉 id / name / terms / readings / phrases，然后在这里导入并加进数组即可。
 */
export const disciplines: Discipline[] = [cs, med, biz]

export const getDiscipline = (id: string): Discipline =>
  disciplines.find((d) => d.id === id) ?? disciplines[0]

export const allTags = (d: Discipline): string[] =>
  [...new Set(d.terms.flatMap((t) => t.tags))].sort()
