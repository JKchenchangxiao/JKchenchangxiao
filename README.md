# 专业英语学习站 · English for Your Major

把英语学习和自己的专业绑在一起：背的是专业课上真会遇到的术语，读的是本领域真实体裁的英文材料，练的是写论文和开会时真要用的句子。

纯前端项目，没有后端和账号，学习进度存在浏览器 localStorage 里。

## 功能

| 模块 | 说明 |
| --- | --- |
| 学习总览 | 今日目标、待复习数量、连续打卡、近 14 天复习柱状图、每日一词与每日一句 |
| 术语闪卡 | SM-2 简化版间隔重复；四档评分（重来/困难/记得/简单）并预告下次复习时间；支持空格翻卡、数字键评分 |
| 术语测验 | 英译中、中译英、例句填空、拼写四种题型混合；干扰项优先取易混词；答错的词自动回到闪卡队列前面 |
| 专业阅读 | 论文摘要、教材节选、病例报告、财报电话会等真实体裁；生词行内标注，悬停看释义；配理解检测题 |
| 学术句式 | 按写作功能分组（研究缺口、方法、结果、局限、答辩口语……），通用句式 + 本专业专用句式，点击复制 |
| 全部词库 | 中英文检索、按子领域筛选、收藏、掌握状态一览 |

所有英文内容都能用浏览器自带的语音合成朗读（Web Speech API），不需要任何音频文件或第三方服务。

## 内置专业

- 计算机科学与技术（算法、系统、数据库、人工智能、软件工程）
- 临床医学（病史书写、医患沟通、循证医学、文献阅读）
- 经济与商科（财报、投融资、宏观经济、商务沟通）

每个专业各 30 个高频术语、2 篇阅读、若干专用句式，另有一份跨专业通用的学术句式库。

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/，可直接部署到任意静态托管
```

## 换成你自己的专业

内容和代码是分开的，加一个专业不需要动任何界面代码：

1. 复制 `src/data/disciplines/cs.ts`，重命名为你的专业，例如 `civil.ts`。
2. 改掉 `id`、`name`、`nameEn`、`icon`、`color`、`description`，然后替换 `terms` / `readings` / `phrases` 三块内容。字段含义见 `src/data/types.ts`，每个字段都有注释。
3. 在 `src/data/index.ts` 里导入并加进 `disciplines` 数组。

```ts
import { civil } from './disciplines/civil'
export const disciplines: Discipline[] = [cs, med, biz, civil]
```

刷新页面，左上角的专业下拉框里就会出现新专业，进度按专业独立统计。

写术语时的几个经验：

- `example` 尽量抄自你真正读过的教材或论文，专业语境比孤立词条好记得多。
- `confusable` 填上易混词（比如 incidence / prevalence），出选择题时会被优先当作干扰项，逼你分清。
- `tags` 用子领域划分，闪卡和测验都能按它筛选，考前突击某一章很方便。

## 目录结构

```
src/
  data/
    types.ts            数据模型（术语 / 阅读 / 句式 / 专业）
    index.ts            专业注册表
    phrasebank.ts       通用学术句式
    disciplines/        各专业语料
  lib/
    srs.ts              间隔重复算法
    quiz.ts             出题与判题
    storage.ts          localStorage 读写、打卡统计
    speech.ts           语音合成
    router.ts           极简 hash 路由
  pages/                六个页面
  components/ui.tsx     通用 UI 组件
  store.tsx             全局状态与学习动作
```

## 技术栈

React 19 + TypeScript + Vite 7 + Tailwind CSS 4，零运行时依赖（除 React 本身）。
