---
title: "Echo Care Web PRD 总索引"
version: "1.0.0"
last_updated: "2026-07-13"
status: "草稿"
---

## 1. 引言

Echo Care Web 是一个面向 NFC 戒指的移动端 H5 体验。用户用手机触碰戒指后，会进入一个私密的情绪陪伴空间，可包含每日抽牌、问题式塔罗解读、使用追踪，以及未来的回忆戒指礼物体验。

本文档是所有产品需求、功能模块 PRD 和实现用户故事的总入口。

## 2. 核心文档

- 整体愿景：[./APP-Overall-Vision.md](./APP-Overall-Vision.md)
- 架构概览：[../architecture/arch-overview.md](../architecture/arch-overview.md)

## 3. 当前项目焦点

- 稳定 NFC 戒指入口与访问校验流程。
- 优化每日陪伴与问题解牌的移动端阅读体验。
- 让 Gemini 输出更简短、更有情绪陪伴感、更适合手机阅读。
- 可靠记录戒指激活时间、打开次数和未来使用行为。
- 为未来轻量版回忆戒指 MVP 预留方向。

## 4. 功能模块概览

### 4.1. 每日陪伴

- 描述：每日一张牌的情绪陪伴体验。
- 状态：草稿
- PRD：[./features/daily-companion/index.md](./features/daily-companion/index.md)

### 4.2. 问题解牌

- 描述：用户提问后三张牌回答，先给结论，再用简短故事解释。
- 状态：草稿
- PRD：[./features/question-reading/index.md](./features/question-reading/index.md)

### 4.3. 首页入口

- 描述：NFC 戒指打开后的首页入口体验，负责建立情绪氛围并引导用户进入每日陪伴或问题解牌。
- 状态：草稿
- PRD：[./features/home-entry/index.md](./features/home-entry/index.md)

### 4.4. Gemini 解读 API

- 描述：为每日陪伴和问题解牌生成结构化内容的 Serverless API。
- 状态：草稿
- PRD：[./features/gemini-reading-api/index.md](./features/gemini-reading-api/index.md)

### 4.5. 戒指激活追踪

- 描述：基于 Supabase 记录戒指生命周期、首次激活、打开次数和行为事件。
- 状态：草稿
- PRD：[./features/ring-activation-tracking/index.md](./features/ring-activation-tracking/index.md)

### 4.6. 戒指管理工具

- 描述：用于生成和管理戒指链接的后台/工具流程。
- 状态：草稿
- PRD：[./features/ring-admin/index.md](./features/ring-admin/index.md)

### 4.7. 回忆戒指 MVP

- 描述：未来面向礼物场景的 NFC 回忆戒指 MVP，支持语音、文字、照片。
- 状态：草稿
- PRD：[./features/memory-ring-mvp/index.md](./features/memory-ring-mvp/index.md)

## 5. 干系人

- 产品负责人：Wenzerong
- 工程协作：Codex
- UX 方向：高级、情绪化、移动端优先，参考 Apple Journal / Calm

## 6. 文档规则

- 保持功能模块和用户故事的 `status` 最新。
- 当实现改变产品行为、数据规则或 UX 结构时，必须更新相关文档。
- 优先记录清晰的决策和变更原因，而不是粘贴长篇聊天记录。
