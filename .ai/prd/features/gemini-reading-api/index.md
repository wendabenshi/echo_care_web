---
title: "功能模块 PRD：Gemini 解读 API"
version: "1.0.0"
feature_id: "gemini-reading-api"
last_updated: "2026-07-13"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

Gemini 解读 API 通过 Vercel Serverless Function，为每日陪伴和问题解牌生成结构化内容。

## 2. 目标

- 让 Gemini prompt 与产品语气一致。
- 为前端返回稳定 JSON。
- 当 Gemini 失败时提供兜底解读。

## 3. 范围

### 3.1. 范围内

- `api/reading.js`
- Prompt 设计
- JSON 整形
- 兜底解读逻辑

### 3.2. 范围外

- Gemini Key 管理界面。
- 完整 AI 聊天记忆。
- 用户级长期个性化。

## 4. UX / 语气规则

- 温暖、简短、有情绪理解力。
- 避免强预测。
- 避免普通星座运势语气。
- 优先使用短句和清晰结构。

## 5. 技术考量

- 环境变量：
  - `GEMINI_API_KEY`
  - `GOOGLE_API_KEY`
  - `GEMINI_MODEL`
- 默认模型：`gemini-2.5-flash`
- 返回类型：
  - `daily`
  - `question`

## 6. 数据 / 业务规则

问题解牌 JSON：

```json
{
  "reflection": "string",
  "cardReadings": [
    { "position": "string", "card": "string", "message": "string" }
  ],
  "combined": "string",
  "gentleReminder": "string",
  "followUps": ["string", "string", "string"]
}
```

每日解读 JSON：

```json
{
  "kind": "daily",
  "cardReadings": [
    { "position": "string", "card": "string", "message": "string" }
  ],
  "guidance": "string",
  "love": "string",
  "career": "string",
  "wealth": "string",
  "needToday": "string",
  "smallAction": "string",
  "companionNote": "string"
}
```

## 7. 待解决问题

- 是否需要持久化每次生成结果，用于成本追踪？
- 是否需要为生成结果提供稳定 ID 和可分享 URL？
