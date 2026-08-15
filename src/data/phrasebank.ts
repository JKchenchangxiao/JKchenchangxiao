import type { PhraseGroup } from './types'

/** 与专业无关的通用学术句式，任何专业都会与本表合并展示 */
export const generalPhrases: PhraseGroup[] = [
  {
    id: 'gen-1',
    fn: '引出研究背景',
    phrases: [
      { en: 'Over the past decade, there has been growing interest in ...', zh: '过去十年间，……日益受到关注' },
      { en: 'It is widely accepted that ...', zh: '人们普遍认为……' },
      { en: 'A number of studies have investigated ...', zh: '已有若干研究考察了……' },
      { en: 'X plays a crucial role in ...', zh: 'X 在……中起着关键作用' },
    ],
  },
  {
    id: 'gen-2',
    fn: '指出研究缺口（最容易写砸的一段）',
    phrases: [
      { en: 'However, little attention has been paid to ...', zh: '然而，……尚未得到足够关注' },
      { en: 'Previous work has largely overlooked ...', zh: '既有研究在很大程度上忽视了……' },
      { en: 'The evidence remains inconclusive.', zh: '现有证据尚无定论' },
      { en: 'To the best of our knowledge, no study has examined ...', zh: '据我们所知，尚无研究考察过……' },
    ],
  },
  {
    id: 'gen-3',
    fn: '陈述研究目的与贡献',
    phrases: [
      { en: 'This study aims to address this gap by ...', zh: '本研究旨在通过……填补这一空白' },
      { en: 'The main contribution of this paper is threefold.', zh: '本文的主要贡献有三点' },
      { en: 'We propose a novel approach that ...', zh: '我们提出一种新方法，能够……' },
      { en: 'Specifically, we ask whether ...', zh: '具体而言，我们探讨……是否成立' },
    ],
  },
  {
    id: 'gen-4',
    fn: '描述方法',
    phrases: [
      { en: 'Data were collected from ... between 2019 and 2023.', zh: '数据采集自……，时间跨度为 2019 至 2023 年' },
      { en: 'All experiments were repeated three times independently.', zh: '所有实验均独立重复三次' },
      { en: 'Unless otherwise stated, we follow the setting of Smith et al. (2021).', zh: '除非另有说明，我们沿用 Smith 等（2021）的设置' },
      { en: 'Statistical analyses were performed using ...', zh: '统计分析使用……完成' },
    ],
  },
  {
    id: 'gen-5',
    fn: '呈现结果',
    phrases: [
      { en: 'As shown in Table 2, ...', zh: '如表 2 所示，……' },
      { en: 'The results are consistent with our hypothesis.', zh: '结果与我们的假设一致' },
      { en: 'A significant difference was observed between the two groups (p < 0.01).', zh: '两组间存在显著差异（p < 0.01）' },
      { en: 'This pattern held across all subgroups.', zh: '该规律在所有子组中均成立' },
    ],
  },
  {
    id: 'gen-6',
    fn: '讨论与解释（含委婉表达 hedging）',
    phrases: [
      { en: 'One possible explanation is that ...', zh: '一种可能的解释是……' },
      { en: 'These findings suggest, rather than prove, that ...', zh: '这些发现提示而非证明……' },
      { en: 'This may partly account for the discrepancy.', zh: '这或许可以部分解释该差异' },
      { en: 'Our results are broadly in line with those reported by ...', zh: '我们的结果与……报告的结果大体一致' },
    ],
  },
  {
    id: 'gen-7',
    fn: '承认局限与展望',
    phrases: [
      { en: 'Several limitations should be acknowledged.', zh: '本研究存在若干局限' },
      { en: 'The sample size was relatively small, which limits generalisability.', zh: '样本量偏小，限制了结论的推广性' },
      { en: 'Future work should explore ...', zh: '未来研究应探索……' },
      { en: 'Further validation in a larger cohort is warranted.', zh: '有必要在更大样本中进一步验证' },
    ],
  },
  {
    id: 'gen-8',
    fn: '学术汇报与答辩口语',
    phrases: [
      { en: 'Thank you for the question — let me address it in two parts.', zh: '谢谢您的提问，我分两部分回答' },
      { en: 'That is beyond the scope of the present study, but ...', zh: '这超出了本研究的范围，不过……' },
      { en: 'If I understand your question correctly, you are asking whether ...', zh: '如果我理解无误，您想问的是……是否成立' },
      { en: 'I would like to draw your attention to the left panel of this figure.', zh: '请大家看这张图的左半部分' },
    ],
  },
]
