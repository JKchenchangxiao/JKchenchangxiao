# 陈长霄

13710376709 ｜ fuli82311744@gmail.com  
求职意向：Java

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
- 企业官网内容管理后台：负责 Vue 3 管理端与 Spring Boot / Spring Security 后端，实现角色权限、草稿与发布快照分离、版本冲突检测和操作审计
  - Redis 缓存已发布内容，发布或撤下时切换版本键；缓存异常回源数据库，并提供命中率与故障统计
- 多语言外贸官网与管理系统：独立开发 Nuxt 前台、Vue 管理端与 Java 后端，支持中日英三语内容、产品与 SEO
  - 实现询盘、报价跟进、邮件通知和角色权限；以 PostgreSQL / Flyway 管理迁移，Redis 缓存公开内容
- AI 咨询与会员平台：基于 Nuxt / TypeScript 完成前后台与多厂商模型接入，实现私有资料引用、会员权益、账号数据隔离和 PDF 导出
  - RabbitMQ 承接耗时任务，结合发布确认、消费 ACK 与 Redis 原子认领控制重复调用；Redis Lua 原子限流，会员额度成功后幂等扣次，支持进度恢复与失败释放
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

技术栈：Spring Boot · Spring Security · Redis · Elasticsearch · Vue 3

代码：github.com/JKchenchangxiao/blog

- 认证与缓存：JWT 双 Token 无感续期，Redis 黑名单支持登出失效；Cache-Aside 配合空值缓存、互斥锁与 TTL 抖动
- 搜索：Elasticsearch + IK 中文分词；完成 Docker / Nginx 部署

### 全栈电商系统「旗舰手机精品店」

2025.04-2025.07

技术栈：Java 21 · Spring Boot 4 · MyBatis-Plus · MySQL 8 · Vue 3

代码：github.com/JKchenchangxiao/mall

- 库存与支付：悲观锁与 CAS 两套方案，200 并发压测零超卖；支付宝回调验签，支付流水唯一索引与订单状态 CAS 双层幂等
- 订单闭环：超时关单回滚库存，处理迟到支付竞态；WebSocket 按用户推送支付结果

### 「声临其境」AI Agent 全栈音响测评平台

2025.07-至今

技术栈：Spring Boot · Spring Data JPA · MySQL 8 · Vue 3

代码：github.com/JKchenchangxiao/audio

- 建模与推荐：MySQL JSON 存储测评参数和评分，按预算、房间面积及用途推荐器材；完成筛选、评论与 Docker / Nginx 部署

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
