---
title: "功能模块 PRD：问题解牌"
version: "1.0.0"
feature_id: "question-reading"
last_updated: "2026-07-13"
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
- 避免正文卡片容器、分割线、图标、正文插画和视觉噪音。
- 主要依赖字体层级和留白来组织页面。

## 6. 技术考量

- 页面：`src/pages/LoveEnergyPage.vue`
- 结果组件：`src/components/draw/LoveReadingPanel.vue`
- API：`api/reading.js`
- 服务：`src/services/drawSession.js`
- 埋点：`reading_completed`，mode 为 `love-energy`

## 7. 数据 / 业务规则

- 三张牌分别映射为：
  - 第一张：用户当前情绪状态
  - 第二张：正在影响局面的原因
  - 第三张：下一步关注方向
- `combined` 应提供主要答案。
- `gentleReminder` 应是陪伴式收尾，而不是继续解释牌。

## 8. 待解决问题

- 问题结果页是否应从 overlay 面板改成独立路由？
- 追问是否应进入聊天式延续页面？
