# 陈长霄

13710376709 ｜ fuli82311744@gmail.com  
5年工作经验 ｜ 求职意向：Java

## 个人优势

- AI 业务落地：把大模型接入企业 GEO 业务全流程，提示词约束结论出处，生成后自动校验
- 平台化与工程治理：抽出可复用平台模块，Flyway 管理迁移，清理废弃实现；累计发起 50+ 合并请求
- 多项目全栈交付：并行负责 GEO、协会网站、写作与新闻发布平台，完成 IdP 单点登录等账号体系建设
- 银行对账/清算业务背景+独立实现支付全链路（回调验签、双层幂等、超时关单、状态机仲裁），业务与技术互相印证，适配支付、交易、金融科技方向
- 具备 AI Agent 协同研发能力：能主导技术选型、架构设计与各模块实现方案，把控代码质量，并借助 AI Agent（Claude Code）高效交付并部署全栈项目，贴合 AI 原生研发趋势
- 三个从 0 到 1 独立开发并上线的全栈项目，覆盖高并发防超卖（200 并发压测）、支付宝支付、WebSocket 推送、Redis 缓存、Elasticsearch 全文搜索；线上可访问，代码开源
- 注重工程规范：多环境配置与密钥外置、统一响应与全局异常处理，技术选型能讲清权衡
- 线上演示：AI 音响测评 http://43.139.188.114:8890 ｜ 电商 http://43.139.188.114:8888 ｜ 博客 http://43.139.188.114

## 工作经历

### 广州麦媒信息科技有限公司

Java 工程师 ｜ 2025.11-2026.11

受保密协议约束，不展示实际上线项目名称。

技术栈：Spring Boot 3 · MyBatis-Plus · PostgreSQL · PDFBox · Apache POI ｜ Vue 3 · React · Next.js

- GEO 项目：负责整体搭建与优化。按 10 个模块完成整体搭建，并优化大数据提示词生成
  - 业务流程：建档、资料收集、AI 生成报告、客户确认、审核发布与留档；状态机控制推进，保留历史版本
  - 提示词与报告：结论必须标注出处，材料不足进入待确认；生成后自动检查，确认版导出 PDF / Word
  - 平台能力：抽出文件处理模块（按页提取 PDF / Word / PPT 文字，图片和扫描件由大模型转写）与网络获取模块（网页抓取、联网搜索、海外英文资料），耗时任务后台执行
  - 账号与权限：邮箱验证码注册登录，按统一子系统契约接入 IdP 单点登录；自助注册与实名审核门禁
- 协会网站：负责多个协会网站全栈项目的前台与后台搭建
  - Next.js 构建期静态生成，标题、描述与 JSON-LD 直出 HTML，便于 AI 爬虫读取；配图接入对象存储
- 写作服务平台：负责创作纪实、作家标签与运营后台用户管理的前后端开发；后台只向运营账号签发登录令牌
- 新闻发布平台：补齐发稿目录筛选、上传成稿确认与运营报价回显，沿用已有表结构，不新增表
- 大模型收费定价：负责搭建

### 中国银行白云支行

清算 ｜ 2022.06-2024.09

- 负责对账与清算工作：日常账务核对、差错排查与调账处理，保障资金账务一致
- 担任业务与科技条线联络人：需求收集与转译、系统问题跟进、新系统上线验证

### 广东轩辕网络科技股份有限公司

Java ｜ 2021.06-2022.03

- 参与业务系统后端开发与国产数据库迁移工作

## 个人项目经历

### 个人博客系统

2025.01-2025.03

技术栈：Spring Boot · Spring Security · JPA · PostgreSQL · Redis · Elasticsearch · Vue 3 · TypeScript · Docker · Nginx  
线上：http://43.139.188.114 ｜ 代码：github.com/JKchenchangxiao/blog（后端）· github.com/JKchenchangxiao/vue-project-blog（前端）

- 认证：JWT 双 Token（access 15 分钟 + refresh 7 天），前端无感续期；Redis 黑名单实现登出即时失效，改密后令牌立即失效
- 缓存：Redis Cache-Aside，空值缓存、互斥锁、TTL 随机抖动，应对穿透、击穿、雪崩
- 搜索：Elasticsearch + IK 中文分词，按相关度排序，替代 LIKE 模糊查询
- 工程：DTO / VO / Entity 分层，统一响应与全局异常处理；图片经 COS + CDN 分发；Docker + Nginx 上线

### 全栈电商系统「旗舰手机精品店」

2025.04-2025.07

技术栈：Java 21 · Spring Boot 4 · MyBatis-Plus · MySQL 8 · JWT · WebSocket · 支付宝 · Docker · Nginx ｜ Vue 3 · TypeScript · Vite · Element Plus · Pinia  
线上：http://43.139.188.114:8888（可自行注册体验）｜ 代码：github.com/JKchenchangxiao/mall（后端）

前后端分离电商。C 端覆盖浏览、购物车、下单、支付、订单；B 端覆盖角色权限、商品、订单。独立完成设计、开发、压测与部署上线。

- 防超卖：悲观锁与乐观锁（CAS）两套方案，200 并发压测均零超卖，并给出吞吐对比与选型结论
- 支付：接入支付宝，完成创建支付、异步回调验签、订单状态流转；支付流水唯一索引 + 订单状态 CAS 双层幂等；定时任务关闭超时订单并回滚库存，处理关单与迟到支付的并发竞态
- 推送与权限：WebSocket 定向推送支付结果（JWT 握手鉴权、用户级会话），前端免刷新更新订单；B 端按角色控制权限
- 部署：多环境配置分离、密钥外置，MySQL 容器化，Nginx 反向代理，腾讯云运行

### 「声临其境」AI Agent 全栈音响测评平台

2025.07-至今

技术栈：Java 21 · Spring Boot · Spring Data JPA · MySQL 8 · Vue 3 · TypeScript · Vite · Vue Router · Docker · Nginx ｜ AI 工具：Claude Code  
线上：http://43.139.188.114:8890 ｜ 代码：github.com/JKchenchangxiao/audio

独立主导的前后端分离音响测评平台，涵盖 8 大测评系列、100+ 产品。完成需求分析、技术选型、架构设计与各模块方案，借助 AI Agent（Claude Code）完成编码、联调与部署上线。

- 架构：确定分层架构、数据模型与接口；优缺点、参数、评分等测评数据使用 MySQL JSON 字段存储，避免过度拆表
- 后端：Spring Boot + Spring Data JPA 构建 REST 接口；种子数据按名称去重，兼容增量与全新库；按预算、房间面积、用途分档推荐多声道器材，并完成评论模块
- 前端：Vue 3 + TypeScript + Vite 组件化开发；品牌、价格、分类筛选与实时搜索；自研中英文切换、明暗主题与可复用评论组件
- 部署：local / prod 双 Profile、密钥外置；Docker 化 MySQL，Nginx 托管前端静态资源并反向代理 /api，一键脚本上线腾讯云

## 教育经历

北京师范大学珠海分校 ｜ 本科 ｜ 计算机科学与技术 ｜ 2018-2022

## 资格证书

大学英语四级（CET-4）

## 专业技能

- 语言：Java、TypeScript、SQL
- 后端：Spring Boot、MyBatis-Plus、Spring Security、Spring Data JPA
- 数据：MySQL、PostgreSQL、Redis、Elasticsearch
- 前端：Vue 3（Composition API）、Pinia、Vite、Element Plus
- 运维：Docker、Nginx、Linux（Ubuntu）、Maven、Git
- AI 协作研发：Claude Code（AI Agent）、AI 辅助开发与调试、AI Agent 协同的架构设计与全栈交付
