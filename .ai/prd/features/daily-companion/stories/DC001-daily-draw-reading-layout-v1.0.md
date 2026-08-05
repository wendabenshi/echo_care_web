---
title: "每日抽解牌页阅读体验优化"
id: "DC001"
target_version: "v1.0"
status: "草稿"
owner: "Codex"
story_points: "TBD"
created_date: "2026-07-13"
last_updated: "2026-07-13"
related_prd_feature: "../index.md"
---

## 1. 用户故事

**作为一个** 每天触碰戒指进入每日陪伴的用户
**我想要** 用很少的阅读成本看到今天的卡牌、核心信息和一个可执行的小行动
**以便于** 我能把每日抽牌当作 20-30 秒的情绪陪伴仪式，而不是读一篇长解读。

## 2. 验收标准

- [ ] AC 1：每日抽牌页第一屏行动清晰，用户知道应该抽一张今日牌。
- [ ] AC 2：每日解牌结果页采用“Hero + 4 个短 Section”的结构。
- [ ] AC 3：结果页避免正文卡片容器、过多图标、分割线和密集长文。
- [ ] AC 4：每个 Section 的正文适合手机阅读，单段不超过 3-4 行。
- [ ] AC 5：视觉保持黑紫色高级感，但页面整体更安静、更像 Apple Journal / Calm。

## 3. 背景与上下文

每日陪伴的用户没有明确问题，页面不应像传统塔罗百科。它的核心是“今天我该如何陪伴自己”。我们之前确定的方向是：少解释、多陪伴；少视觉装饰、多留白；让用户愿意每天读完。

## 4. 实现计划

### 4.1. 前端组件

- 页面：`src/pages/DailyCardPage.vue`
- 结果组件：`src/components/draw/DailyReadingPanel.vue`
- 抽牌组件：`src/components/draw/CardFan.vue`、`TarotCardBack.vue`、`TarotCardFace.vue`
- 样式 / 布局：
  - 抽牌前：行动清晰，弱化多余说明。
  - 解牌后：牌面 Hero 更突出，正文去卡片化，依靠字体层级和留白。

### 4.2. API / Serverless

- 端点：`api/reading.js`
- 请求 / 响应结构：保持每日模式结构稳定。
- 错误处理：保留兜底解读。
- 当前目标 JSON 结构：
  - `todaysEnergy`
  - `forYourHeart`
  - `oneSmallAction`
  - `companionNote`

### 4.3. Supabase / 数据

- 表：如涉及埋点，继续使用 `ring_events`。
- 字段：无新增预期。
- 事件：`reading_completed`，mode 为 `daily`。
- 迁移 SQL：默认不需要。

### 4.4. Gemini / AI 输出

- Prompt 变更：如结果结构调整，需同步每日解读 prompt。
- JSON 结构：建议稳定映射到四段：
  - `todaysEnergy`
  - `forYourHeart`
  - `oneSmallAction`
  - `companionNote`
- 语气规则：简短、温柔、可执行，避免预测。
- 兜底逻辑：兜底内容也应保持相同阅读结构。

### 4.5. 路由 / NFC

- 路由：`/draw/daily-card`
- Query 参数：默认不新增。
- 签名 / UUID 行为：不在本用户故事中修改。

## 5. 任务分解

### 5.1. 实现

- [x] 检查每日抽牌页当前结构。
- [x] 优化抽牌前页面的信息层级。
- [x] 优化每日解牌结果页 Hero。
- [x] 将结果内容控制为 4 个核心 Section。
- [ ] 调整段落长度、间距、字体层级和 CTA。

### 5.2. 验证

- [ ] 运行 `npm run build`
- [ ] 本地验证 `/draw/daily-card` 移动端流程。
- [ ] 验证每日解读 API 成功和失败兜底。
- [ ] 如用户要求，部署到线上。

### 5.3. 文档

- [ ] 如果行为变化，更新功能模块 PRD。
- [ ] 如有需要，更新架构文档。
- [ ] 更新本用户故事的开发日志。

## 6. 风险与依赖

- 风险：如果删减过度，用户可能觉得内容不够“值”。
- 依赖：Gemini 返回内容质量、当前卡牌视觉资产、移动端阅读测试。

## 7. 开发笔记与日志

- 2026-07-13 00:00 - Codex：初始化用户故事。
- 2026-07-13 00:00 - Codex：根据用户要求，将每日陪伴页从底部滑动洗牌改为中间单张大牌背抽牌；用户点击牌背后停顿约 1.5 秒，再翻牌并进入解牌面板。
- 2026-07-13 00:00 - Codex：修复每日牌点击翻转瞬间闪烁的问题；原因是点击时从牌背 button 切换到新的翻牌 DOM，现改为同一个翻牌容器常驻，仅切换旋转状态。
- 2026-07-15 00:00 - Codex：将每日解读 API 和结果页统一收束为四段式结构：`todaysEnergy`、`forYourHeart`、`oneSmallAction`、`companionNote`；前端继续兼容旧字段，避免本地旧返回结构直接失效。

## 8. AI 交互日志

- 用户：希望为每日抽解牌页单独创建用户故事，用于后续页面优化。
- Codex：创建 DC001，聚焦每日抽牌和每日结果页的阅读体验。
- 用户：希望每日陪伴页进入后不显示下方滑动洗牌组件，只显示一张更大的牌背，点击后停顿 1-2 秒再翻牌并显示解牌页。
- Codex：移除每日页的 `CardFan` 渲染，改为单张牌背按钮和翻牌停顿流程。
- 用户：询问为什么每日抽牌页中间这张牌点击翻转时会闪一下。
- Codex：解释为 `v-if / v-else` 造成 DOM 替换和图片重绘，并改为常驻翻牌容器避免闪烁。
- 用户：继续 Echo Care Web 项目，当前重点是问题解牌页 / 每日抽牌页优化。
- Codex：将每日解读的 prompt、fallback 和结果页继续收束到 Hero + 4 sections，并同步 `.ai` 文档中的 JSON 结构约定。
