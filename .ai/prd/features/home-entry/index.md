---
title: "功能模块 PRD：首页入口"
version: "1.0.0"
feature_id: "home-entry"
last_updated: "2026-07-13"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

首页入口负责承接 NFC 戒指打开后的第一屏体验，让用户快速理解这是一个私密、安静的情绪陪伴空间，并自然进入每日陪伴或问题解牌。

## 2. 目标

- 用户在 3 秒内理解页面氛围和下一步行动。
- 首页视觉保持高级黑紫色、克制、有仪式感。
- 首页不是功能菜单，而是进入陪伴体验的“入口封面”。

## 3. 范围

### 3.1. 范围内

- `/` 首页入口。
- 首页 Hero、CTA 和主要路径入口。
- 每日陪伴与问题解牌的入口引导。
- NFC 戒指打开后的首页承接体验。

### 3.2. 范围外

- 每日抽牌结果页。
- 问题解牌结果页。
- 戒指后台管理。
- 回忆戒指 MVP。

## 4. 用户故事

用户故事放在 `./stories/` 下。

### 4.1. HOME001 - 首页入口体验优化

- 描述：优化首页的信息层级、视觉焦点和入口路径，让首页从“功能导航”变成“情绪陪伴入口”。
- 状态：草稿
- 目标版本：v1.0
- 用户故事文档：[./stories/HOME001-home-entry-layout-v1.0.md](./stories/HOME001-home-entry-layout-v1.0.md)

## 5. UX 原则

- 首页应像一个安静的封面，而不是功能列表。
- 第一屏只保留一个明确视觉焦点和 1-2 个主要行动。
- 避免过多按钮、图标、卡片、分割线和说明文字。
- 保持黑紫色 Spiritual Wellness 方向，但控制发光和装饰比例。

## 6. 技术考量

- 路由：`/`
- 页面组件：`src/components/HeroPage.vue`
- 相关组件：
  - `src/components/CompanionText.vue`
  - `src/components/OrbitParticles.vue`
  - `src/components/SiteHeader.vue`
- 戒指入口：
  - `src/pages/RingEntryPage.vue`
  - `api/ring-verify.js`
  - `api/ring-events.js`

## 7. 数据 / 业务规则

- 首页打开可记录 `home_opened` 事件。
- 首页入口应保留每日陪伴和问题解牌两条主要路径。
- 任何路由、NFC 参数或追踪事件变化，都应同步更新架构文档。

## 8. 待解决问题

- 首页是否需要显示戒指绑定状态？
- 首页是否需要根据来源区分 NFC 入口、直接访问和测试访问？
