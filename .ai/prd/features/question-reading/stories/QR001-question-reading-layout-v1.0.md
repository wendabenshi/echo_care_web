---
title: "问题抽解牌页阅读体验优化"
id: "QR001"
target_version: "v1.0"
status: "草稿"
owner: "Codex"
story_points: "TBD"
created_date: "2026-07-13"
last_updated: "2026-07-13"
related_prd_feature: "../index.md"
---

## 1. 用户故事

**作为一个** 带着具体问题来抽三张牌的用户
**我想要** 先看到问题的核心答案，再阅读三张牌如何组成完整故事
**以便于** 我不会在长文中迷失，而能快速获得清晰、温柔、有方向感的解读。

## 2. 验收标准

- [ ] AC 1：问题解牌 Hero 采用“问题 → 三张牌 → Three-Card Insight”的顺序，并先给核心答案。
- [ ] AC 2：正文控制为 5 个 Section：Your Heart Today、What's Influencing This、Where To Focus、The Bigger Picture、A Gentle Reminder。
- [ ] AC 3：Section 采用差异化容器策略；前三个单牌解释 Section 可使用轻量玻璃卡片承载，The Bigger Picture / A Gentle Reminder 保持去卡片化，避免整页所有模块都套同一种卡片。
- [ ] AC 4：不同 Section 的内容重量不同，避免所有模块都像同一个模板。
- [ ] AC 5：The Bigger Picture 是页面高潮，负责把三张牌串成完整答案，并以高于单牌解释卡的“总结主卡”样式呈现。
- [ ] AC 6：移动端正文不拥挤，Hero 后和 Section 之间保留充足留白。

## 3. 背景与上下文

用户进入问题解牌时已经带着明确问题，最关心的是“答案是什么”。因此问题解牌不应像每日陪伴那样泛化，也不应像传统塔罗网站一样逐张解释牌。最终方向是：先回答问题，再解释原因；三张牌共同构成一个关于用户自己的故事。

最近设计结论：

- Hero 要短，Three-Card Insight 不要变成正文。
- 页面视觉如果“吵”，往往不是颜色问题，而是每个 Section 重量相同、紫色过多、内容没有停顿。
- 应控制每个 Section 的“重量”：Heart 较短，Influence 稍长，Focus 很短，Bigger Picture 最重，Reminder 一句话收尾。

## 4. 实现计划

### 4.1. 前端组件

- 页面：`src/pages/LoveEnergyPage.vue`
- 结果组件：`src/components/draw/LoveReadingPanel.vue`
- 抽牌组件：`src/components/draw/CardFan.vue`、`CardSlots.vue`
- 样式 / 布局：
- Hero 负责回答问题，不承载长正文。
- 正文采用分层容器策略：前三个单牌解释 Section 可使用轻量玻璃卡片，后两段总结型 Section 以去卡片化排版形成节奏变化。
- The Bigger Picture 视觉权重高于普通 Section，可采用更厚内边距、更高圆角、弱紫色径向光感、轻描边和模糊背景形成“总结主卡”。

### 4.2. API / Serverless

- 端点：`api/reading.js`
- 请求 / 响应结构：保持 question reading JSON 稳定。
- 错误处理：保留兜底解读，并确保兜底也遵循相同结构。

### 4.3. Supabase / 数据

- 表：如涉及埋点，继续使用 `ring_events`。
- 字段：无新增预期。
- 事件：`reading_completed`，mode 为 `love-energy`。
- 迁移 SQL：默认不需要。

### 4.4. Gemini / AI 输出

- Prompt 变更：需要强调 Answer First，Explanation Second。
- JSON 结构：
  - `reflection` / Hero Insight：只保留 1-2 句。
  - `cardReadings`：三张牌分别承担情绪、原因、方向。
  - `combined`：The Bigger Picture，作为主要答案。
  - `gentleReminder`：一句陪伴式收尾。
- 语气规则：像个人日记和情绪陪伴，不像塔罗百科。
- 兜底逻辑：兜底内容同样需要控制长度和 Section 重量。

### 4.5. 路由 / NFC

- 路由：`/draw/love-energy`
- Query 参数：默认不新增。
- 签名 / UUID 行为：不在本用户故事中修改。

## 5. 任务分解

### 5.1. 实现

- [ ] 检查问题抽牌页当前结构。
- [x] 优化问题抽牌页下方洗牌组件的弹出节奏和悬浮感。
- [ ] 优化 Hero 的问题、三张牌和核心答案展示。
- [ ] 优化正文 5 个 Section 的排版与权重。
- [ ] 强化 The Bigger Picture 的页面高潮感。
- [ ] 调整 Gemini prompt / fallback，使内容更短、更有职责区分。
- [ ] 检查 CTA 文案和位置。

### 5.2. 验证

- [ ] 运行 `npm run build`
- [ ] 本地验证 `/draw/love-energy` 移动端流程。
- [ ] 验证问题解读 API 成功和失败兜底。
- [ ] 检查真机宽度下是否仍显得拥挤或视觉吵。
- [ ] 如用户要求，部署到线上。

### 5.3. 文档

- [ ] 如果行为变化，更新功能模块 PRD。
- [ ] 如有需要，更新架构文档。
- [ ] 更新本用户故事的开发日志。

## 6. 风险与依赖

- 风险：如果 Three-Card Insight 过长，Hero 会再次变成正文。
- 风险：如果所有 Section 都使用同一种卡片模板，页面会显得吵且疲劳。
- 依赖：Gemini 输出质量、当前三张牌视觉资产、移动端真实截图反馈。

## 7. 开发笔记与日志

- 2026-07-13 00:00 - Codex：初始化用户故事。
- 2026-07-13 00:00 - Codex：根据用户反馈，优化问题抽牌页下方洗牌组件弹出效果；牌组从下方慢速淡入上浮，完成后再允许交互，并保持轻微悬浮动效。
- 2026-07-13 00:00 - Codex：修复牌组上升显示时中途卡顿；原因是同一层同时承担入场 transition 和悬浮 keyframes，且外层 filter 包裹大量牌面导致移动端合成压力较高。现拆成外层入场、内层悬浮，并移除入场 blur/filter。
- 2026-07-13 00:00 - Codex：将牌组入场从单一 transition 改为分段 keyframes，形成“前段快速上升、后段慢慢停住”的节奏。
- 2026-07-13 00:00 - Codex：根据用户反馈，分段 keyframes 后段减速会产生卡顿感；改回连续 ease-out transition，保留由快到慢但取消中间速度断点。
- 2026-07-13 00:00 - Codex：根据用户最终反馈，取消曲线变速上升，改为约 1.5 秒线性匀速上升，减少节奏感带来的不稳定观感。
- 2026-07-13 00:00 - Codex：根据用户反馈，将问题抽牌页牌组匀速上升时间从约 1.5 秒缩短为约 1.2 秒。
- 2026-07-13 00:00 - Codex：根据用户反馈，将牌组可点击时间从等待完整上升结束改为浮现后约 0.28 秒即可选择，减少“看得到但不能点”的违和感。
- 2026-07-14 00:00 - Codex：根据用户提供的间距表，压缩问题解牌结果页 Section 间距；Insight 到单牌卡片组约 64px，普通 Section 间距约 56-64px，Reminder 到 CTA 约 48-64px。
- 2026-07-15 00:00 - Codex：将 Three-Card Insight 内容限制为第一句并截断到约 96 字符，视觉层最多显示两行，避免 Hero Insight 撑高页面。
- 2026-07-15 00:00 - Codex：根据用户提供的三张牌解释卡片参数，为前三个牌意 Section 增加玻璃卡片样式：右边距 24px、圆角 24px、内边距 28/24/30、卡片间距 24px、低透明背景、5.5% 描边、8px blur、弱阴影和 2.5% 内高光。
- 2026-07-15 00:00 - Codex：根据用户进一步澄清，确认问题解牌页并非“所有 Section 都去卡片化”；当前规则更新为：前三个单牌解释 Section 使用轻量玻璃卡片，The Bigger Picture 与 A Gentle Reminder 保持去卡片化，以拉开信息层次。
- 2026-07-15 00:00 - Codex：根据用户提供的 Bigger Picture 参考图，将 The Bigger Picture 升级为总结主卡样式：约 28px 圆角、34/26/36 内边距、弱紫色顶部径向光、浅描边、10px blur 和更亮 headline，用来承接三张牌综合结论。
- 2026-07-16 00:00 - Codex：修复问题抽牌页发送问题后的两处闪烁。空白牌框此前带有按 80ms 递增的逐个入场延迟，导致用户先看到 1 号框，再看到 2、3 号框；现改为整组同步出现。下方牌组此前在长距离上浮时同时做 opacity 与 transform 混合入场，且带轻微 scale，移动端容易在中途出现一次合成抖动；现取消入场 scale，缩短 opacity 过渡，仅保留线性位移作为主动画。
- 2026-07-16 00:00 - Codex：继续收敛问题抽牌页入场闪烁。此前虽然已简化动画参数，但 `submitted` 一旦切为 `true`，空牌框和下方牌组仍会先挂载到 DOM，再等待抽牌数据与后续帧稳定，仍可能露出一拍空白。现新增 `slotsVisible` / `fanVisible`，改为等待 `simulateDraw()` 返回后，再分帧显示空牌框与牌组，减少空白组件先露出的闪烁感。
- 2026-07-16 00:00 - Codex：根据用户继续反馈，确认上一版分帧显示虽然减少了空白挂载，但会拖慢整体节奏，且没有解决下方牌组上浮时的真实闪烁。现改为仅以 `drawReady` 控制显示，不再额外分帧延后；同时移除 `TarotCardBack.vue` 中每张牌背的 `drop-shadow` 滤镜、将牌背图片改为 eager 加载，并去掉 `CardFan.vue` 中所有牌实例的动态 `filter` / `filter transition`，优先降低大牌组上浮时的合成压力。
- 2026-07-16 00:00 - Codex：根据用户反馈“发送问题后页面在牌框和牌组出现前空白太久”，调整问题抽牌页首屏策略：`LoveEnergyPage.vue` 在提交问题后立即用本地同步生成的三张牌渲染牌框和下方牌组，不再等待 `/api/spread` 返回；待 Gemini spread 元数据返回后，只补充更新 `spread_name` 和 `position_meanings`，避免首屏因接口等待而显得空。

## 8. AI 交互日志

- 用户：希望为问题抽解牌页单独创建用户故事，用于后续页面优化。
- Codex：创建 QR001，聚焦 Answer First、Section 权重和移动端阅读节奏。
- 用户：当前问题抽牌页下方洗牌组件显示太快、没有节奏，希望延长弹出时间并营造悬浮在此处的效果。
- Codex：为 `LoveEnergyPage.vue` 中的 `CardFan` 增加外层舞台动画，延长弹出时间，并把交互开启延后到动画完成后。
- 用户：询问问题抽牌页下方牌组上升显示时为什么会在中间卡顿一下。
- Codex：解释为 transform 动画接管冲突和 filter 合成压力，并将入场动画与悬浮动画拆层处理。
- 用户：希望上升淡入增加由快到慢的节奏感。
- Codex：改为 `question-card-fan-rise` 分段关键帧，并略微延后悬浮动画与可交互时机。
- 用户：反馈后面变慢时有卡顿感，效果不行。
- Codex：删除分段关键帧，改为单条连续 cubic-bezier 入场曲线，缩短总时长并避免后段停顿感。
- 用户：不需要曲线变速上升，要求约 1.5 秒匀速上升。
- Codex：将牌组入场改为 `transform 1500ms linear`，交互开启时间同步为 1500ms。
- 用户：反馈 1.5 秒太慢，要求改成约 1.2 秒。
- Codex：将牌组入场改为 `transform 1200ms linear`，交互开启时间同步为 1200ms。
- 用户：询问为什么三张空牌框下面的牌组没完全出来前不能点击下方牌进行选择。
- Codex：解释为此前将 `pickingEnabled` 延后到完整入场结束，并改为约 0.28 秒后即可点击。
- 用户：要求按截图表格调整问题解牌页各组件间距，减少卡片化后不需要的大空白。
- Codex：调整 `LoveReadingPanel.vue` 的 Insight、正文 Section、Bigger Picture、Reminder 和 CTA 间距。
- 用户：询问如何把 Insight 内容限制在一行左右，最多两行。
- Codex：在 `LoveReadingPanel.vue` 中增加 `hero-insight-copy` 两行裁切，并将 `heroInsight` 改为只取第一句和长度限制。
- 用户：提供三张牌解释卡片样式参数，要求按图片修改。
- Codex：为 `cardSections` 外层增加卡片组，只影响前三张牌解释，不影响 Bigger Picture / Reminder。
- 用户：说明问题解牌页只有部分 section 需要使用卡片，并要求后续改代码时及时同步 story 文档。
- Codex：更新 `QR001` 验收标准与实现说明，明确“前三个单牌解释 section 使用轻量卡片，后两个总结 section 去卡片化”的规则。
- 用户：提供 Bigger Picture 推荐样式，要求做成更高权重的总结主卡。
- Codex：将 `LoveReadingPanel.vue` 的 The Bigger Picture 升级为独立总结主卡，并同步 `QR001` 对该 section 的视觉要求。
- 用户：反馈问题抽牌页发送问题后，空白牌框会先出现 1 号框再闪出 2、3 号框，下方选牌组件上浮时中间也会闪一下。
- Codex：定位到 `CardSlots.vue` 的逐个延迟入场和 `LoveEnergyPage.vue` 中牌组入场的 opacity/transform/scale 混合动画，改为牌框整组同步出现，并收束牌组入场动画以减少中途闪烁。
- 用户：继续反馈下方选牌组件入场仍会闪烁，并且会闪出空白牌框。
- Codex：进一步定位到 `submitted` 切换后组件提前挂载的问题，在 `LoveEnergyPage.vue` 中增加 `slotsVisible` / `fanVisible`，改为抽牌数据就绪后再分帧挂载牌框与牌组，减少空白 DOM 先出现的一拍闪烁。
- 用户：反馈最新版本中，下方牌组上升闪烁仍未解决，而且下方牌组与上方空牌框都变慢了。
- Codex：判断上一版的分帧延后属于误修，撤回额外延时；转而处理真实性能瓶颈，去掉牌背 `drop-shadow`、取消牌组动态 `filter` 与其过渡，并改为仅在 `drawReady` 时显示组件。
- 用户：说明当前更明显的问题是发送问题后，牌框和下方牌出现前等待太久，导致页面中间空了一大段时间。
- Codex：改为提交后立即使用本地同步抽出的三张牌渲染牌框和牌组，把 `/api/spread` 变成后台补全文案的异步步骤，不再阻塞首屏出现。
