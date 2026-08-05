---
title: "功能模块 PRD：戒指激活追踪"
version: "1.0.0"
feature_id: "ring-activation-tracking"
last_updated: "2026-07-13"
owner: "Wenzerong / Codex"
status: "草稿"
---

## 1. 目的

追踪戒指激活、访问和使用事件，便于生产戒指交付用户后持续观察使用情况。

## 2. 目标

- 知道首次激活时间。
- 统计网页打开次数。
- 区分生产戒指和测试戒指。
- 保留事件历史，方便未来分析使用行为。

## 3. 范围

### 3.1. 范围内

- 戒指 UUID 校验。
- `rings` 生命周期字段。
- `ring_events` 追加式事件记录。
- 测试戒指区分。

### 3.2. 范围外

- 完整数据分析后台。
- 用户账号体系。
- 推送通知。

## 4. 技术考量

- API：
  - `api/ring-verify.js`
  - `api/ring-events.js`
- 工具：
  - `src/utils/ringAccess.js`
  - 如存在，相关 tracking helper
- Supabase 表：
  - `rings`
  - `ring_events`

## 5. 数据 / 业务规则

建议的 `rings` 字段：

- `uuid`
- `ring_type`：production / test
- `lifecycle_stage`：packed / activated / retired
- `first_activated_at`
- `open_count`
- `created_at`
- `updated_at`

签名校验规则：

- `/r` 链接中的 `uid + sig` 需要通过 HMAC 校验。
- 对已出库生产戒指，`verify-ring` 需要支持“当前 secret + 历史 secret 列表”的兼容校验。
- `sign-ring` 只使用当前主 secret 生成新链接，避免继续扩散旧签名版本。

建议的 `ring_events` 字段：

- `uuid`
- `event_type`
- `session_id`
- `path`
- `extra_json`
- `created_at`

## 6. 待解决问题

- 对 packed 生产戒指来说，哪个事件应标记为正式激活？
- 测试戒指是否应该排除在打开次数和激活指标之外？
