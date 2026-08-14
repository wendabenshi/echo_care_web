---
title: "功能模块 PRD：AI 解读 API"
version: "1.0.0"
feature_id: "gemini-reading-api"
last_updated: "2026-08-12"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

AI 解读 API 通过 Vercel Serverless Function，为每日陪伴和问题解牌生成结构化内容。

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
  - `AI_PROVIDER`：`gemini` 或 `deepseek`，默认 `gemini`
  - Gemini：`GEMINI_API_KEY`、`GOOGLE_API_KEY`、`GEMINI_MODEL`
  - DeepSeek：`DEEPSEEK_API_KEY`、`DEEPSEEK_MODEL`
  - `READING_CONTENT_SOURCE`
- 默认模型：Gemini 使用 `gemini-2.5-flash`，DeepSeek 使用 `deepseek-chat`
- 返回类型：
  - `daily`
  - `question`

## 6. 数据 / 业务规则

共享内容源规则：

- 牌名与牌图始终由本地抽牌逻辑生成并绑定，不依赖 Gemini。
- `牌阵标题 / 位置文案 / 解读内容` 必须使用同一个内容源，不允许局部 Gemini、局部 fallback 的混搭状态。
- `READING_CONTENT_SOURCE` 取值：
  - `local`：`api/spread.js` 与 `api/reading.js` 全部返回本地 fallback。
  - `gemini`：`api/spread.js` 与 `api/reading.js` 全部优先请求 Gemini，失败时再回退到本地 fallback。
  - 当 `READING_CONTENT_SOURCE` 为 `gemini` 且 `AI_PROVIDER=deepseek` 时，`api/spread.js` 与 `api/reading.js` 优先请求 DeepSeek，失败时再回退到本地 fallback；返回 JSON schema 与 Gemini 保持一致。

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
  "card_name": "string",
  "core_insight": "string",
  "sections": {
    "what_this_card_reflects": "string",
    "where_you_may_be_now": "string",
    "one_small_shift": "string",
    "gentle_reminder": "string"
  }
}
```

## 7. 待解决问题

- 是否需要持久化每次生成结果，用于成本追踪？
- 是否需要为生成结果提供稳定 ID 和可分享 URL？
