---
title: "功能模块 PRD：每日陪伴"
version: "1.0.0"
feature_id: "daily-companion"
last_updated: "2026-08-12"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

每日陪伴让用户在触碰 NFC 戒指或进入每日抽牌流程后，获得一张每日卡牌，并通过塔罗象征进入一段简短但具体的情绪反思与现实生活陪伴。

## 2. 目标

- 让每日流程像温柔的日常仪式，而不是算命工具。
- 保持结果页简短、易读、移动端优先。
- 保留当前高级黑紫色视觉语言。
- 让 Daily Reading 更像 Tarot Journal，而不是只给一句 AI 鸡汤。

## 3. 范围

### 3.1. 范围内

- 每日抽牌页。
- 单张牌揭示动画。
- 每日解读结果结构。
- Gemini 每日解读字段。

### 3.2. 范围外

- 三张牌问题解读。
- 回忆戒指内容。
- 长期个性化记忆。

## 4. 用户故事

用户故事放在 `./stories/` 下。

### 4.1. DC001 - 每日抽解牌页阅读体验优化

- 描述：优化每日抽牌与解牌结果页，让它更像 Apple Journal / Calm 的每日情绪陪伴页。
- 状态：草稿
- 目标版本：v1.0
- 用户故事文档：[./stories/DC001-daily-draw-reading-layout-v1.0.md](./stories/DC001-daily-draw-reading-layout-v1.0.md)

## 5. UX 原则

- 参考 Apple Journal / Calm 与 WooMoo 的阅读节奏。
- 避免密集段落。
- 避免不必要的图标、分割线、按钮式摘要卡。
- 结果页应强调 Tarot symbolism + self reflection + emotional companion。
- 推荐结果页结构：
  - Card Hero
  - Core Insight
  - Glance Row：`TODAY / YOU / TRY`
  - Reading Sections：
    - `WHAT THIS CARD REFLECTS`
    - `WHERE YOU MAY BE NOW`
    - `ONE SMALL SHIFT`
  - `A GENTLE REMINDER`
- 当前视觉调试阶段，Daily Reading 牌背统一使用本地 `Mystic Editorial` 牌背图；抽牌牌池限制为本地 22 张大阿卡纳，翻牌结果与结果页 Hero 应展示与真实抽中牌名一致的本地卡面图。

## 6. 技术考量

- 页面：`src/pages/DailyCardPage.vue`
- 结果组件：`src/components/draw/DailyReadingPanel.vue`
- API：`api/reading.js`
- 服务：`src/services/drawSession.js`
- 埋点：`reading_completed`，mode 为 `daily`

## 7. 数据 / 业务规则

- 每日模式使用一张牌。
- 当前网页每日抽牌仅从 22 张大阿卡纳中抽取，不包含小阿卡纳。
- 每日解读不应该像预测，而应借塔罗象征帮助用户理解情绪、现实情境和小幅调整方向。
- 用户可见文案应简短、有情绪支持感，同时必须和现实生活场景有关联。
- Daily Reading 的目标 JSON 结构为：
  - `card_name`
  - `core_insight`
  - `sections.what_this_card_reflects`
  - `sections.where_you_may_be_now`
  - `sections.one_small_shift`
  - `sections.gentle_reminder`
- 服务端应对 Daily Reading 增加内容护栏：
  - 若输出包含旧模板高频禁用词（如 `emotional pattern`、`nervous system`、`healing journey`、`inner journey`），则拒绝该结果并回退到新的 grounded fallback。
  - `sections.where_you_may_be_now` 必须包含至少一个现实生活场景线索。
  - `The Magician` 的结果必须明确提到 initiative / 现有技能或资源 / 真实情境中的行动。
- Glance Row 不由 AI 自由生成，改为本地塔罗牌数据映射：
  - `today`
  - `heart`
  - `step`
- Daily Reading 内容长度目标应控制在约 180-220 词，避免写成心理疗愈文章。
- 当前统一规则：牌名与牌图始终由本地抽牌逻辑生成并绑定，不依赖 Gemini。`牌阵标题 / 位置文案 / 解读内容` 必须使用同一个内容源，不允许混搭。
- 共享内容源由环境变量 `READING_CONTENT_SOURCE` 控制：
  - `local`：`/api/spread` 与 `/api/reading` 都返回本地 fallback。
  - `gemini`：`/api/spread` 与 `/api/reading` 都优先请求 Gemini，失败时再分别回退到本地 fallback。

## 8. 待解决问题

- 生产环境是否限制每日只能抽一次？
- 重复抽取是否需要和首次每日抽取分开统计？
