---
title: "功能模块 PRD：每日陪伴"
version: "1.0.0"
feature_id: "daily-companion"
last_updated: "2026-07-13"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

每日陪伴让用户在触碰 NFC 戒指或进入每日抽牌流程后，获得一张每日卡牌和一段简短情绪陪伴。

## 2. 目标

- 让每日流程像温柔的日常仪式，而不是算命工具。
- 保持结果页简短、易读、移动端优先。
- 保留当前高级黑紫色视觉语言。

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

- 参考 Apple Journal / Calm 的阅读节奏。
- 避免密集段落。
- 避免不必要的图标、分割线、卡片容器。
- 推荐结果页 Section：
  - Today's Energy
  - For Your Heart
  - One Small Action
  - Companion Note

## 6. 技术考量

- 页面：`src/pages/DailyCardPage.vue`
- 结果组件：`src/components/draw/DailyReadingPanel.vue`
- API：`api/reading.js`
- 服务：`src/services/drawSession.js`
- 埋点：`reading_completed`，mode 为 `daily`

## 7. 数据 / 业务规则

- 每日模式使用一张牌。
- 每日解读不应该像预测。
- 用户可见文案应简短、有情绪支持感。
- 每日结果结构以 4 段为准：
  - `todaysEnergy`
  - `forYourHeart`
  - `oneSmallAction`
  - `companionNote`

## 8. 待解决问题

- 生产环境是否限制每日只能抽一次？
- 重复抽取是否需要和首次每日抽取分开统计？
