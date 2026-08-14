---
title: "问题抽解牌页阅读体验优化"
id: "QR001"
target_version: "v1.0"
status: "草稿"
owner: "Codex"
story_points: "TBD"
created_date: "2026-07-13"
last_updated: "2026-08-12"
related_prd_feature: "../index.md"
---

## 1. 用户故事

**作为一个** 带着具体问题来抽三张牌的用户
**我想要** 先看到问题的核心答案，再阅读三张牌如何组成完整故事
**以便于** 我不会在长文中迷失，而能快速获得清晰、温柔、有方向感的解读。

## 2. 验收标准

- [ ] AC 1：问题解牌 Hero 采用“问题 → 三张牌 → Three-Card Insight”的顺序，并先给核心答案。
- [ ] AC 2：正文控制为 5 个 Section：Your Heart Today、What's Influencing This、Where To Focus、The Bigger Picture、A Gentle Reminder。
- [ ] AC 3：Section 采用差异化容器策略；前三个单牌解释 Section 使用轻量玻璃卡片，The Bigger Picture 使用总结主卡，A Gentle Reminder 使用独立氛围 guidance 卡，避免整页所有模块都套同一种卡片。
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
- 正文采用分层容器策略：前三个单牌解释 Section 使用轻量玻璃卡片，The Bigger Picture 使用总结主卡，A Gentle Reminder 使用独立的氛围 guidance 卡形成收尾。
- The Bigger Picture 视觉权重高于普通 Section，可采用更厚内边距、更高圆角、弱紫色径向光感、轻描边和模糊背景形成“总结主卡”。
- A Gentle Reminder 允许使用一张独立渐变卡收尾，文案居中、偏斜体、情绪感强，但不能和前三张牌解释卡使用同一种容器语言。

### 4.2. API / Serverless

- 端点：`api/reading.js`
- 请求 / 响应结构：保持 question reading JSON 稳定。
- 错误处理：保留兜底解读，并确保兜底也遵循相同结构。
- 临时调试策略：在问题解牌页 UI 优化阶段，Question Reading 固定走 fallback，不请求 Gemini；即使旧前端请求未显式传 `mode`，服务端也应识别三张牌问题解牌并套用同一策略。

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
- [x] 接入本地批准的 `Mystic Editorial` 牌背与 3 张结果正面图，用于问题解牌页视觉验收。

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
- 风险：如果所有 Section 都使用同一种卡片模板，页面会显得吵且疲劳；Reminder 即使卡片化，也必须与前三张牌解释卡和 Bigger Picture 拉开差异。
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
- 2026-08-09 00:00 - Codex：为支持问题解牌页纯 UI / 布局调试，临时将 Question Reading 服务端逻辑固定为 fallback-only，并兼容旧请求未传 `mode` 的情况，避免 Gemini 配额、延迟和输出波动干扰样式验收。
- 2026-08-09 00:00 - Codex：继续将问题解牌页前三个 section 向 WooMoo 的内容卡风格靠拢：取消显眼的紫色副标题，改为使用 `position_tags` 胶囊标签；将牌名收小并改为更平的标题层；同步压低卡片背景、描边、阴影和内边距，让阅读块更像安静的内容容器而不是厚重玻璃卡。
- 2026-08-09 00:00 - Codex：继续把问题解牌页前三个 section 往 WooMoo 收紧：缩小移动端外层左右留白，让卡片更贴边；将标签胶囊继续做淡做小；将正文亮度再压低一档，减少内容块整体发亮感。
- 2026-08-09 00:00 - Codex：继续细收问题解牌页前三个 section 的容器比例：进一步减小移动端圆角和内边距，并压低 section label 的字号与字距，让卡片更接近 WooMoo 那种紧凑而克制的内容块节奏。
- 2026-08-09 00:00 - Codex：根据最新反馈继续压缩问题解牌页卡片内部文字内容的竖直间距，收紧标题、标签和正文段落之间的留白，让 section 内部节奏更接近 WooMoo。
- 2026-08-09 00:00 - Codex：继续把问题解牌页前三个卡片内标题颜色从偏亮白色压到更柔和的灰白层级，让标题观感更接近 WooMoo，而不再像独立高亮展示标题。
- 2026-08-09 00:00 - Codex：继续将问题解牌页前三个卡片内标题颜色从灰白进一步校正为低饱和淡紫灰，贴近 WooMoo 标题层级，不改卡片结构与间距。
- 2026-08-09 00:00 - Codex：根据最新澄清修正颜色映射错误；WooMoo 式淡紫只保留给 section label，前三个卡片中的牌名颜色改回柔和白，避免把 label 的层级误套到牌名上。
- 2026-08-09 00:00 - Codex：继续按 WooMoo 的第一屏节奏重排问题解牌页 Hero：弱化问题本身的标题权重、在三张牌下补入位置标签、将 `Your Three-Card Insight` 升级为正式标题并把摘要降为正文层，同时压缩三牌区域整体高度，让第一屏更像完整回答封面而不是“问题 + 卡牌列表 + 正文开头”。
- 2026-08-09 00:00 - Codex：继续处理问题解牌页第一屏拥挤感，为 Hero 区三张牌下方单独增加短标签映射与单行显示规则，避免过长位置文案换行占高，并同步下调牌名与 Insight 层级、放宽 Insight 正文宽度。
- 2026-08-09 00:00 - Codex：继续压低问题解牌页第一屏密度：将三张牌再缩小一档、进一步淡化 Insight 正文，并把首个正文 section 往下推，让 Hero 保持更完整的封面感。
- 2026-08-09 00:00 - Codex：根据最新反馈继续修正问题解牌页第一屏与首卡衔接：将 `YOUR QUESTION` 调成淡紫层级、增加 Insight 与首卡的垂直间距、将卡片内首句单独提为淡紫色摘要，并修复卡片正文在只有单句时重复渲染两遍的问题。
- 2026-08-09 00:00 - Codex：继续微调问题解牌页卡片正文的上下留白，收紧首句摘要与正文之间、正文段落之间的垂直间距，让卡片内部节奏更紧凑。
- 2026-08-09 00:00 - Codex：根据用户进一步澄清修正颜色映射：淡紫只保留给 `YOUR QUESTION` 和三个卡片的小节标题层级，卡片内首句摘要恢复为普通正文色，避免误把正文首句当成标签层处理。
- 2026-08-09 00:00 - Codex：继续修正问题解牌页视觉层级：将三个卡片的小节标题颜色改为更明确的淡紫值，避免旧色阶在真机上不明显；同时将 Insight 正文到首张卡片的垂直距离收回到更接近卡片间距 1.5 倍的节奏。
- 2026-08-09 00:00 - Codex：根据最新参考图继续压缩问题解牌卡片正文节奏，将正文块上边距、段落间距与行高进一步收紧，向 WooMoo 卡片正文的紧凑阅读感靠拢。
- 2026-08-09 00:00 - Codex：继续将问题解牌卡片正文颜色压灰一档，降低正文对比度，使其更接近 WooMoo 那种克制的灰白正文层级。
- 2026-08-09 00:00 - Codex：根据真机反馈继续加大问题解牌卡片正文降灰力度，将卡片首句摘要与后续正文都改为更明确的灰白层级，避免只调整次段导致视觉变化不明显。
- 2026-08-09 00:00 - Codex：根据用户最新要求继续压缩问题解牌卡片正文间距，将首句摘要到正文、正文段落之间的留白进一步收缩到上一版约 0.75 倍。
- 2026-08-09 00:00 - Codex：根据最新反馈移除问题解牌卡片中的独立摘要层，将首句并回胶囊下方正文连续展示；同时继续将正文段落间距和行高压到上一版约 0.7 倍，形成更接近 WooMoo 的紧凑正文块。
- 2026-08-09 00:00 - Codex：根据用户提供的 WooMoo 收尾参考图，将问题解牌页最后一屏 `A Gentle Reminder` 从普通去卡片化文本升级为独立 guidance 渐变卡；合并收尾文案为一段居中斜体正文，并通过紫蓝氛围光和更高圆角形成明显的“最后一屏收尾卡”。
- 2026-08-09 00:00 - Codex：继续根据用户对比图优化 `A Gentle Reminder` 的可读性与质感：将卡片整体底色压暗、减弱边框存在感、把光感收束为一条更集中的紫蓝雾带，并将正文从高反差 `Cormorant Garamond` 斜体切换为更稳定易读的 `Lora` 斜体，降低“美但飘”的问题。
- 2026-08-09 00:00 - Codex：根据用户最新真机反馈，继续下调 `A Gentle Reminder` 正文字号并取消斜体，改为更克制的常规 serif 阅读样式，优先解决“字体太大、倾斜太重影响阅读”的问题。
- 2026-08-09 00:00 - Codex：根据用户最新要求，移除问题解牌页底部 CTA 下方的 AI 声明文案，并将 CTA 从“追问 AI”改为固定返回首页按钮，按钮文字更新为 `Back to Home`，点击后直接跳转 `/`。
- 2026-08-09 00:00 - Codex：根据用户对底部按钮“太丑”的反馈，继续将 CTA 从高亮电商式紫色大按钮收敛为更贴近页面氛围的深色导航按钮：降低饱和度和发光感、缩小高度、弱化大面积渐变，并把箭头收进独立的低对比圆形辅助元素。
- 2026-08-09 00:00 - Codex：根据用户对 `THE BIGGER PICTURE` 角色的进一步澄清，将总结主卡从“固定标题 + 整段正文”改成更明确的总结结构：保留 section label，移除重复的 `Putting It All Together` 占位标题，改为一层 lead 结论 + 一层 supporting copy，并同步收窄文本宽度、放大内边距，让它更像三张牌的收束结论而不是第四张普通说明卡。
- 2026-08-09 00:00 - Codex：根据用户对最新真机效果“很突兀、单薄、还没有上面三张卡重要”的反馈，继续为 `THE BIGGER PICTURE` 增加结构厚度：在主结论上方加入三张牌名的弱胶囊行和一个小 kicker，收小 lead 字号、压低 supporting copy 层级，并进一步放大总结卡内边距，让它在不靠大字的前提下更像真正的整组总结主卡。
- 2026-08-09 00:00 - Codex：根据最新真机反馈，继续下调 `THE BIGGER PICTURE` 的正文级字号与行高，将 lead / supporting copy 收到与前三张解释卡正文更接近的阅读层级，保留总结主卡身份但不再靠更大的字体撑视觉。
- 2026-08-09 00:00 - Codex：根据最新真机反馈继续修正 `THE BIGGER PICTURE` 的横向节奏，将总结卡左右内边距收回到与前三张卡正文区一致，并移除正文内部额外收窄，让右侧边距不再明显大于上方卡片。
- 2026-08-10 00:00 - Codex：将问题解牌页的牌背统一切到本地 `Mystic Editorial` 版本，并把三张结果牌 / 结果页 Hero 固定为 3 张本地批准样图；同一组图会同时用于抽牌后的翻牌结果和结果页顶部展示，避免前后视觉不一致。
- 2026-08-10 00:00 - Codex：修复问题抽牌页真机上第一张空牌框看起来比后两张更低的问题；原因是 `CardSlots.vue` 的整行使用了 `items-center`，会按每列含标签后的总高度做垂直居中，现改为 `items-start`，让三张牌框按顶边对齐，不再受下方标签换行差异影响。
- 2026-08-10 00:00 - Codex：优化问题解牌页 Hero 区卡牌上方位置标签的真机展示，取消移动端单行省略号截断，改为最多两行展示，并同步收小字号与字距、补入固定最小高度，避免 `Necessary Preparation` 一类标签在窄屏上显示不全。
- 2026-08-10 00:00 - Codex：继续加固问题抽牌页与解牌页顶部三张牌的顶边对齐规则，在空牌框组件与解牌页 Hero 牌框上都显式增加 `self-start`，确保即使下方动态文案高度继续波动，牌框本身也稳定按顶边对齐。
- 2026-08-10 00:00 - Codex：继续修正问题解牌页结果页第一屏的卡图与下方文字居中关系；在保留整行顶部对齐的前提下，撤回 Hero 结果牌上的 `self-start`，改回由列容器统一居中，让图片与牌名 / 位置文案重新回到同一垂直中心线。同时临时将问题抽牌池限制为已有本地图片资产的牌，避免牌名落到尚未生成图片的牌上。
- 2026-08-12 00:00 - Codex：将问题解牌页的“牌阵标题 / 位置文案 / 解读内容”统一纳入共享 `READING_CONTENT_SOURCE` 规则，不再允许 `spread` 与 `reading` 分别切换来源；牌名与牌图继续保持本地抽牌和本地资源绑定。

- 2026-08-14 00:00 - Codex：与 Daily Reading 共用同一套深黑紫 ambient Reading 背景，降低星点与云雾噪音并加入克制的环境渐变和暗角；不改变 Question Reading 的内容结构、卡片、字体、布局与交互。

- 2026-08-14 00:00 - Codex：Question Reading 继续复用共享 `ReminderNote`，仅同步其深色圆角背景与低饱和环境光；不新增 Question Reading 专属 Reminder 样式。

- 2026-08-14 00:00 - Codex：回退上一轮 Question Reading 页面级背景优化，恢复原始背景视觉；共享 `ReminderNote` 的组件内背景保持不变。

- 2026-08-14 00:00 - Codex：Question Reading 复用共享 Reminder 的内部 ambient light ribbon，不新增页面专属动画或背景效果；支持 `prefers-reduced-motion`。

- 2026-08-14 00:00 - Codex：同步提高共享 Reminder 内部光带亮度，Question Reading 不增加页面专属样式。

- 2026-08-14 00:00 - Codex：将 Question Reading 切换为“固定 UI 文案本地、动态解读内容 Gemini”的来源规则；保留红框内标题与 Section label 本地固定，胶囊标签、Insight、三张卡正文、Bigger Picture 和 Reminder 改由 Gemini 返回，牌名与牌图继续本地绑定。

- 2026-08-14 00:00 - Codex：将来源开关细化为 Question Reading 专属 `QUESTION_READING_CONTENT_SOURCE="gemini"`，避免切换问题解牌页时意外改变 Daily Reading；Question Reading 的牌名和牌图仍由本地流程绑定。

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
- 用户：当前需要调试问题解牌页样式，希望问题解牌页临时走 fallback。
- Codex：将 `api/reading.js` 的问题解牌分支临时切到 fallback-only，并同步 `question-reading` PRD 与 `QR001` 用户故事，确保旧请求不传 `mode` 时也能稳定命中 fallback。
- 用户：提供当前问题解牌页与 WooMoo 的 section 对比图，希望前三个 section 更贴近 WooMoo 的内容块风格。
- Codex：在 `LoveReadingPanel.vue` 中把紫色副标题收回正文，并利用已有 `position_tags` 渲染小标签胶囊，同时收平标题和卡片容器层级，让 section 视觉更接近 WooMoo。
- 用户：确认继续往 WooMoo 靠，希望进一步收窄外边距、收淡标签并压低正文灰度。
- Codex：继续调窄 `LoveReadingPanel.vue` 的移动端横向留白，扩大 section 卡片占宽，并同步收轻标签与正文层级。
- 用户：继续确认往 WooMoo 靠，希望把卡片圆角、内边距和 section label 再收一点。
- Codex：继续缩小 `LoveReadingPanel.vue` 中前三个 section 的圆角和 padding，并收紧 label 字距与大小。
- 用户：要求把卡片内文字内容的竖直间距继续调小。
- Codex：继续收紧 `LoveReadingPanel.vue` 中标题、标签和正文之间的垂直留白，只调整卡片内部节奏，不改内容结构。
- 用户：要求卡片内标题颜色也需要继续对齐 WooMoo。
- Codex：将 `LoveReadingPanel.vue` 中前三个卡片标题颜色从高亮白调整为更柔和的灰白层级。
- 用户：进一步指出 WooMoo 卡片标题更像淡紫色，希望继续对齐。
- Codex：将 `LoveReadingPanel.vue` 中前三个卡片标题颜色从灰白进一步调成低饱和淡紫灰。
- 用户：指出当前被改成淡紫的是牌名，而不是上方 section label，希望修正。
- Codex：将 `LoveReadingPanel.vue` 中前三个卡片牌名颜色恢复为柔和白，只保留 section label 使用淡紫层级。
- 用户：提供当前问题解牌页第一屏与 WooMoo 第一屏对比，希望知道如何改得更接近。
- Codex：在 `LoveReadingPanel.vue` 中重排第一屏层级，弱化问题、补入卡牌位置标签、提升 `Your Three-Card Insight` 为正式标题，并压缩三张牌区域高度。
- 用户：指出当前第一屏仍然显得拥挤，希望继续收小文字并减少密度。
- Codex：在 `LoveEnergyPage.vue` / `LoveReadingPanel.vue` 中为 Hero 区三张牌下方引入短标签映射，确保首屏标签尽量单行显示，并同步收小牌名与 Insight 层级。
- 用户：要求先继续优化第一屏，再部署。
- Codex：继续在 `LoveReadingPanel.vue` 中收小三张牌、推迟首个正文 section 进入首屏，并降低 Insight 正文存在感，然后再验证与部署。
- 用户：指出当前顶端 label 颜色、Insight 到首卡间距、卡片内首句颜色和正文重复显示仍有问题。
- Codex：在 `LoveReadingPanel.vue` 中分别调整顶端 label 颜色、增大 Hero 到首卡间距、将卡片首句改为淡紫独立摘要，并修复 `headline` 在单句情况下被重复灌回正文的问题。
- 用户：要求卡片正文上下间距进一步微调减小。
- Codex：继续收紧 `LoveReadingPanel.vue` 中卡片首句与正文、正文段落与段落之间的垂直留白。
- 用户：指出线上看起来像“没变化”，实际是卡片正文首句仍保留了淡紫色，希望恢复。
- Codex：将 `LoveReadingPanel.vue` 中卡片首句摘要从淡紫恢复为普通正文色，并重新部署。
- 用户：指出三个卡片的小节标题淡紫色仍不明显，且 insight 正文到第一张卡片距离仍过大。
- Codex：将 `LoveReadingPanel.vue` 中三个卡片的小节标题改为更明确的淡紫色值，并显著缩短 Insight 正文到首张卡片的距离。
- 用户：要求问题解牌卡片内正文间距继续缩小，参考 WooMoo 的正文节奏。
- Codex：继续收紧 `LoveReadingPanel.vue` 中卡片正文的顶部间距、段落间距和行高，只调整正文阅读密度。
- 用户：要求正文颜色稍微再调灰一点。
- Codex：将 `LoveReadingPanel.vue` 中问题解牌卡片正文颜色从当前灰白继续压低一档，不改字号与间距。
- 用户：反馈线上看起来几乎没变化，说明之前降灰幅度太小。
- Codex：继续把 `LoveReadingPanel.vue` 中卡片首句摘要和后续正文同时降灰，确保真机上能明显看出对比度降低。
- 用户：确认颜色已达到预期，但要求把卡片正文间距进一步收缩到当前的约 0.75 倍。
- Codex：继续将 `LoveReadingPanel.vue` 中卡片正文相关留白压缩到上一版约 0.75 倍，不再改颜色。
- 用户：指出摘要仍然单独显示，希望直接并入正文，且正文行距继续缩小到当前约 0.7 倍。
- Codex：将 `LoveReadingPanel.vue` 中卡片摘要层移除，改为胶囊下方直接显示整段正文，并继续显著压缩正文行高与段落间距。
- 用户：提供 WooMoo 每日解牌页最后一屏参考图，希望 1:1 借鉴其 `Today’s Guidance` 卡片样式，用于问题解牌页最后一屏的 `A Gentle Reminder`。
- Codex：将 `LoveReadingPanel.vue` 中的 `A Gentle Reminder` 改为独立 guidance 渐变卡，合并收尾文案为单段居中斜体正文，并同步修正文档中“Reminder 去卡片化”的旧规则。
- 用户：进一步指出对比 WooMoo 后，自己的 reminder 卡在背景颜色和字体样式上仍然不够美观、可读性也偏弱。
- Codex：继续调整 `LoveReadingPanel.vue` 中的 reminder 卡，将背景改为更深的黑紫底并收束中间光带，同时把正文改成更克制的 `Lora` 斜体，优先提升手机端阅读稳定性。
- 用户：指出 reminder 卡正文仍然字体过大、倾斜过重，严重影响阅读。
- Codex：继续收小 `LoveReadingPanel.vue` 中 reminder 卡正文，并取消斜体，改为更稳定的常规 serif 排版。
- 用户：要求移除页面最下方的 AI 声明，并将底部按钮改成跳转首页的 `Back to Home`。
- Codex：将 `LoveReadingPanel.vue` 底部 CTA 改为固定 `Back to Home`，删除下方 AI 声明；同时在 `LoveEnergyPage.vue` 中将按钮事件改为重置状态后跳转首页 `/`。
- 用户：指出新的 `Back to Home` 按钮太丑，希望优化。
- Codex：将 `LoveReadingPanel.vue` 底部 CTA 改为更低饱和的深色氛围导航按钮，取消强电商感的亮紫整块渐变，并增加更克制的圆形箭头辅助元素。
- 用户：指出 `THE BIGGER PICTURE` 是上面三张牌的总结，希望结合当前页面整体布局进一步优化。
- Codex：将 `LoveReadingPanel.vue` 中 `THE BIGGER PICTURE` 改成 lead + supporting copy 的总结主卡结构，去掉重复的固定标题，并通过更窄的文字列宽与更宽松的卡片内边距强化“总结收束”角色。
- 用户：反馈新版本的 `THE BIGGER PICTURE` 仍然突兀、单薄，整体甚至没有上面三张解释卡重要。
- Codex：继续调整 `LoveReadingPanel.vue` 中 `THE BIGGER PICTURE`，在总结正文前增加三张牌名的弱胶囊行与小 kicker，压小 lead 字号并补强卡片结构层级，让它更像三张牌的总括结论而不是单独一段大字正文。
- 用户：指出问题解牌页 `THE BIGGER PICTURE` 的正文字体仍然比上面三张卡正文大，希望调成一致。
- Codex：继续压低 `LoveReadingPanel.vue` 中 `THE BIGGER PICTURE` 的 lead / supporting copy 正文字号与行高，把总结卡阅读感收回到与前三张卡正文同一层级。
- 用户：指出 `THE BIGGER PICTURE` 的正文右边距仍明显大于上面三张卡，希望和上方卡片正文右边距一致。
- Codex：将 `LoveReadingPanel.vue` 中 `THE BIGGER PICTURE` 的卡片左右 padding 收回到与前三张卡相同的正文节奏，并取消正文内部额外的 `max-width` 收窄。
- 用户：反馈问题抽牌页发送问题后，空白牌框会先出现 1 号框再闪出 2、3 号框，下方选牌组件上浮时中间也会闪一下。
- Codex：定位到 `CardSlots.vue` 的逐个延迟入场和 `LoveEnergyPage.vue` 中牌组入场的 opacity/transform/scale 混合动画，改为牌框整组同步出现，并收束牌组入场动画以减少中途闪烁。
- 用户：继续反馈下方选牌组件入场仍会闪烁，并且会闪出空白牌框。
- Codex：进一步定位到 `submitted` 切换后组件提前挂载的问题，在 `LoveEnergyPage.vue` 中增加 `slotsVisible` / `fanVisible`，改为抽牌数据就绪后再分帧挂载牌框与牌组，减少空白 DOM 先出现的一拍闪烁。
- 用户：反馈最新版本中，下方牌组上升闪烁仍未解决，而且下方牌组与上方空牌框都变慢了。
- Codex：判断上一版的分帧延后属于误修，撤回额外延时；转而处理真实性能瓶颈，去掉牌背 `drop-shadow`、取消牌组动态 `filter` 与其过渡，并改为仅在 `drawReady` 时显示组件。
- 用户：希望以后可以统一控制来源；如果说“全部走 Gemini”，则牌阵标题、位置文案、解读内容都走 Gemini；如果说“走本地”，则这些都走本地，但牌名和牌图始终本地抽取和对应。
- Codex：实现共享内容源开关 `READING_CONTENT_SOURCE`，让 Question Reading 的 `api/spread` 与 `api/reading` 保持同源切换；本地调试默认值保持 `local`。
- 用户：说明当前更明显的问题是发送问题后，牌框和下方牌出现前等待太久，导致页面中间空了一大段时间。
- Codex：改为提交后立即使用本地同步抽出的三张牌渲染牌框和牌组，把 `/api/spread` 变成后台补全文案的异步步骤，不再阻塞首屏出现。
- 用户：要求移除问题解牌抽牌页红框中的 `or receive today's companion` 辅助入口文案。
- Codex：删除该辅助按钮及其折叠容器，保留问题输入、示例问题和抽牌流程不变。
- 用户：要求将问题抽牌输入页从 Love Energy / 爱情专属入口调整为通用 Question Reading 入口，保持暗色背景与既有流程。
- Codex：更新入口标题、辅助文案、placeholder、发送按钮和推荐问题；发送按钮改为仅保留图标的小圆按钮，新增无容器的 `Not sure what to ask? / Today's Companion →` secondary path，并保留原发送、示例问题与每日入口行为。
- 用户：要求进入三张牌抽取阶段后只调整文字，不改变 UI 样式、位置、卡牌尺寸和交互；采用极简的通用牌位文案。
- Codex：提交后将顶部文案切换为 `THREE-CARD REFLECTION / Choose three cards. / Tap one card at a time.`，三个牌位固定显示 `THE SITUATION`、`WHAT'S SHAPING IT`、`WHAT TO CONSIDER`，输入阶段文案保持不变。
- 用户：要求顶部牌位与下方详细解读使用对应但不重复的文字层级。
- Codex：顶部固定使用 `THE SITUATION`、`WHAT'S SHAPING IT`、`WHAT TO CONSIDER`；下方三个详细 Section 改为 `WHERE THINGS STAND`、`WHAT MAY BE AFFECTING THIS`、`WHAT TO KEEP IN MIND`，牌名和 UI 保持不变。
- 用户：要求只优化 Question Reading 结果页最后一屏的 UI 层级，不修改任何文案内容或数据逻辑。
- Codex：保留 Bigger Picture 为唯一主卡片，降低 Reminder 卡片的背景、边框和光效强度，并将 Back to Home 改为轻量次级导航；分别设置详细卡片到总结、总结到 Reminder、Reminder 到按钮的独立间距，并保留底部 safe-area。
- 用户：要求 Daily Reading 与 Question Reading 的 Reminder 使用同一个共享视觉组件，内容可不同但样式必须完全一致。
- Codex：Question Reading 改为复用共享 `ReminderNote.vue`，移除本页所有 Reminder 卡片专属背景、边框、圆角、padding、字体和光效样式；Daily Reading 的共享样式作为唯一来源。
- 用户：要求 Daily Reading 与 Question Reading 的 `Back to Home` 统一为更圆润的 secondary pill。
- Codex：将 Question Reading CTA 统一为 `190px × 42px`、`21px` 圆角，保留原有颜色、字号和回首页行为。
- 用户：已获取 DeepSeek API key，希望将项目 AI provider 从 Gemini 切换为 DeepSeek。
- Codex：新增 `api/_ai-provider.js` 统一适配 Gemini 与 DeepSeek；通过 `AI_PROVIDER=deepseek` 切换，`/api/spread` 与 `/api/reading` 共享同一 provider，保留原 JSON schema、本地牌名/牌图绑定和 fallback 行为。
- 用户：要求重构 Question Reading 的 DeepSeek prompt；动态 chips、三张牌正文、Three-Card Insight、Bigger Picture 和 Reminder 必须在一次请求中生成，并移除旧的 love / generic tarot prompt 偏置。
- Codex：将问题解牌的动态内容合并到一次 `/api/reading` 请求，移除请求 payload 中的 `loveMeaning`，新增每张卡片 3 个 1-2 词 chips 的 JSON 校验，并在 JSON 解析失败时按同一语义重试一次；固定牌位与牌名仍由本地绑定。
- 用户：反馈顶部 Three-Card Insight 正文过长，要求移动端两行内完整显示且不能出现省略号；下方卡片、Bigger Picture 与 Reminder 的正文长度保持不变。
- Codex：让 DeepSeek 在同一次 JSON 请求中单独返回 12–18 词的 `reflection`，前端优先展示该字段并移除 Insight 的 CSS 两行省略截断；补充空 Insight 校验和本地短 fallback。
- 用户：反馈问题解牌页前三张 Section 的正文行距过小，影响手机端阅读。
- Codex：仅将前三张 Section 正文的 line-height 从 `1.14` 调整为 `1.42`，不改变字体大小、文案、卡片结构或其他区域样式。
