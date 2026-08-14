---
title: "功能模块 PRD：问题解牌"
version: "1.0.0"
feature_id: "question-reading"
last_updated: "2026-08-12"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

问题解牌让用户提出一个个人问题，并获得三张牌回答。页面应先回答问题，再用简短、连贯的情绪故事解释原因。

## 2. 目标

- 用户在第一屏就能理解核心答案。
- 解读像一页个人日记，而不是塔罗百科。
- 保持结构清晰、篇幅短、适合手机阅读。

## 3. 范围

### 3.1. 范围内

- 爱情 / 问题抽牌页。
- 三张牌抽取流程。
- 问题解牌结果页 / 面板。
- 追问 CTA。

### 3.2. 范围外

- 每日一张牌解读。
- 完整聊天界面。
- 基于账号的历史解读记录。

## 4. 用户故事

用户故事放在 `./stories/` 下。

### 4.1. QR001 - 问题抽解牌页阅读体验优化

- 描述：优化问题抽牌与解牌结果页，让用户先看到答案，再阅读三张牌如何组成完整故事。
- 状态：草稿
- 目标版本：v1.0
- 用户故事文档：[./stories/QR001-question-reading-layout-v1.0.md](./stories/QR001-question-reading-layout-v1.0.md)

## 5. UX 原则

核心结构：

```text
Question
↓
Three Cards
↓
Three-Card Insight
↓
Your Heart Today
↓
What's Influencing This
↓
Where To Focus
↓
The Bigger Picture
↓
A Gentle Reminder
```

规则：

- Hero 要短，并且先给答案。
- The Bigger Picture 应成为页面高潮。
- 避免所有 Section 使用同一种正文卡片模板，防止整页变得厚重和重复。
- 主要依赖字体层级、留白和少量高权重容器来组织页面。
- `A Gentle Reminder` 允许使用独立的氛围渐变收尾卡，但应明显区别于前三个单牌解释卡与 `The Bigger Picture` 总结主卡。

## 6. 技术考量

- 页面：`src/pages/LoveEnergyPage.vue`
- 结果组件：`src/components/draw/LoveReadingPanel.vue`
- API：`api/reading.js`

## 7. 内容来源规则

- 红框内的页面骨架文案（`Your Question`、顶部三个牌位标签、`Your Three-Card Insight`、三个详细 Section label、`The Bigger Picture`、`A Gentle Reminder`）由前端本地固定，保证 UI 结构稳定。
- 用户问题、牌名和牌图始终由本地流程抽取并绑定。
- 红框以外的动态内容（spread 胶囊标签、Three-Card Insight 正文、三个卡片正文、Bigger Picture 正文、Reminder 正文）通过 Gemini 返回。
- 当前本地调试环境通过 `QUESTION_READING_CONTENT_SOURCE="gemini"` 仅将 Question Reading 的动态内容切换为 Gemini；Daily Reading 继续使用 `READING_CONTENT_SOURCE="local"`。
- 服务：`src/services/drawSession.js`
- 埋点：`reading_completed`，mode 为 `love-energy`

## 7. 数据 / 业务规则

- 三张牌分别映射为：
  - 第一张：用户当前情绪状态
  - 第二张：正在影响局面的原因
  - 第三张：下一步关注方向
- `combined` 应提供主要答案。
- `gentleReminder` 应是陪伴式收尾，而不是继续解释牌。
- 临时调试策略：在问题解牌页 UI / 布局优化阶段，Question Reading 服务端逻辑可临时固定为 fallback-only，不请求 Gemini，避免配额、延迟和输出波动干扰样式验收。
- 为兼容历史调用，若问题解牌请求未显式传入 `mode`，服务端仍应基于三张牌请求识别为问题解牌流程，并套用相同的临时 fallback 策略。
- 当前视觉调试阶段，Question Reading 的牌背统一使用本地 `Mystic Editorial` 牌背图；三张结果牌与结果页 Hero 应展示与真实抽中牌名一致的本地卡面图，且当前网页抽牌牌池限制为 22 张大阿卡纳。
- 当前统一规则：牌名与牌图始终由本地抽牌逻辑生成并绑定，不依赖 Gemini。`牌阵标题 / 位置文案 / 解读内容` 必须使用同一个内容源，不允许混搭。
- 共享内容源由环境变量 `READING_CONTENT_SOURCE` 控制：
  - `local`：`/api/spread` 与 `/api/reading` 都返回本地 fallback。
  - `gemini`：`/api/spread` 与 `/api/reading` 都优先请求 Gemini，失败时再分别回退到本地 fallback。

## 8. 待解决问题

- 问题结果页是否应从 overlay 面板改成独立路由？
- 追问是否应进入聊天式延续页面？
