---
title: "每日抽解牌页阅读体验优化"
id: "DC001"
target_version: "v1.0"
status: "草稿"
owner: "Codex"
story_points: "TBD"
created_date: "2026-07-13"
last_updated: "2026-08-13"
related_prd_feature: "../index.md"
---

## 1. 用户故事

**作为一个** 每天触碰戒指进入每日陪伴的用户
**我想要** 用很少的阅读成本看到今天的卡牌、核心信息和一个可执行的小行动
**以便于** 我能把每日抽牌当作 20-30 秒的情绪陪伴仪式，而不是读一篇长解读。

## 2. 验收标准

- [ ] AC 1：每日抽牌页第一屏行动清晰，用户知道应该抽一张今日牌。
- [ ] AC 2：每日解牌结果页采用“Card Hero + Core Insight + Glance Row + 3 个主阅读 Section + A Gentle Reminder”的结构。
- [ ] AC 3：Hero 下方使用无边框三列 `TODAY / YOUR HEART / GENTLE STEP` 作为快速预览，而不是按钮式摘要卡。
- [ ] AC 4：三个主阅读 Section 使用统一 glass card，内容分别承载 `WHAT THIS CARD REFLECTS`、`WHERE YOU MAY BE NOW`、`ONE SMALL SHIFT`。
- [ ] AC 5：视觉保持黑紫色高级感，但页面整体更安静、更像 Tarot Journal / emotional companion，而不是传统占卜工具。

## 3. 背景与上下文

每日陪伴的用户没有明确问题，页面不应像传统塔罗百科。它的核心是“今天我该如何陪伴自己”。当前方向进一步明确为：Tarot-inspired Emotional Reflection，也就是用塔罗牌象征帮助用户理解自己的情绪、现实生活处境和一个温和的小调整，而不是提供泛化鸡汤或预测式解读。

## 4. 实现计划

### 4.1. 前端组件

- 页面：`src/pages/DailyCardPage.vue`
- 结果组件：`src/components/draw/DailyReadingPanel.vue`
- 抽牌组件：`src/components/draw/CardFan.vue`、`TarotCardBack.vue`、`TarotCardFace.vue`
- 样式 / 布局：
  - 抽牌前：行动清晰，弱化多余说明。
  - 解牌后：牌面 Hero 更突出，Hero 下保留轻量 glance row；三个主阅读模块使用统一 glass card；最后以 `A Gentle Reminder` 作为情绪收尾。

### 4.2. API / Serverless

- 端点：`api/reading.js`
- 请求 / 响应结构：切换 Daily Reading 到新的 emotional reflection JSON 结构。
- 错误处理：保留兜底解读。
- 当前目标 JSON 结构：
  - `card_name`
  - `core_insight`
  - `sections.what_this_card_reflects`
  - `sections.where_you_may_be_now`
  - `sections.one_small_shift`
  - `sections.gentle_reminder`

### 4.3. Supabase / 数据

- 表：如涉及埋点，继续使用 `ring_events`。
- 字段：无新增预期。
- 事件：`reading_completed`，mode 为 `daily`。
- 迁移 SQL：默认不需要。

### 4.4. Gemini / AI 输出

- Prompt 变更：切换到 `Tarot-inspired emotional reflection companion` 角色。
- JSON 结构：
  - `card_name`
  - `core_insight`
  - `sections.what_this_card_reflects`
  - `sections.where_you_may_be_now`
  - `sections.one_small_shift`
  - `sections.gentle_reminder`
- 语气规则：有塔罗关联、有现实生活场景、有具体小幅改变、有情绪陪伴，但避免 fortune telling、空泛激励和 spiritual claims。
- 语气规则：像一个懂用户这一天的 close friend，而不是 therapist、spiritual teacher 或 motivational speaker；优先真实生活观察，弱化心理疗愈文章感。
- 场景规则：不要默认把 `WHERE YOU MAY BE NOW` 写成工作/职业场景；感情、家庭、朋友、居家生活、日常习惯、内心拉扯和个人选择都应与工作场景拥有同等优先级，只有当牌义明显指向责任、推进、结构时才优先落到工作。
- 当前长度约束：
  - `core_insight`：最多 20 词
  - `sections.what_this_card_reflects`：35-50 词
  - `sections.where_you_may_be_now`：50-70 词，且必须包含至少一个具体现实场景
  - `sections.one_small_shift`：30-45 词
  - `sections.gentle_reminder`：15-25 词
- Hero 下方的 `TODAY / YOUR HEART / GENTLE STEP` 不由 AI 自由生成，改为从本地塔罗牌数据读取固定短语，确保不重复、不空泛、且与牌义相关。
- 服务端会对 Daily Reading 增加输出守卫：
  - 若 Gemini 结果出现旧模板禁用词，则拒绝该结果并回退到 grounded fallback。
  - `WHERE YOU MAY BE NOW` 若缺少现实生活场景，也会触发回退。
  - `The Magician` 若未明确体现 initiative、现有技能/资源和真实情境中的行动，也会触发回退。
- 临时调试策略：在每日解牌页 UI 优化阶段，Daily Reading 固定走 fallback，不请求 Gemini，避免模型限额与内容波动干扰布局调试；Question Reading 维持原逻辑。
- 兜底逻辑：兜底内容也应保持相同结构，并包含更现实、更可识别的生活语境。

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
- [ ] 将每日结果结构切换为 emotional reflection 模型。
- [ ] 用新的 reading cards / glance row / gentle reminder 替换旧 daily layout。
- [ ] 调整段落长度、间距、字体层级和 CTA。
- [x] 将 Daily Reading 末屏 CTA 与 Question Reading 统一为 `Back to Home`，并统一 `A Gentle Reminder` 的渐变收尾卡样式。
- [x] 接入本地批准的 `Mystic Editorial` 牌背与结果图资源，用于每日结果页视觉验收。

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
- 2026-08-05 00:00 - Codex：每日抽牌页改为先本地立即创建单张基础牌并开放点击，再异步补全 `/api/spread` 返回的标题与 position 文案，避免用户进入页面后需要空等一段时间才能翻牌。
- 2026-08-06 00:00 - Codex：重排每日解牌页的 Hero 与正文节奏，去掉 Hero 与正文首句重复，收紧 section 间距并提升正文层级，减少“松散但重复”的阅读感。
- 2026-08-06 00:00 - Codex：继续按 `Editorial Calm` 方向收敛每日解牌页，弱化模板感中间层、增强 Hero 海报感，并让摘要优先承接 `For Your Heart` 的情绪语气。
- 2026-08-06 00:00 - Codex：参考用户提供的高质感每日解牌页案例，继续将每日结果页升级为“Hero + 轻量信息条 + 图形化章节 + 底部总结主卡”，重点提升移动端美观性、节奏感与可读性，而不是增加业务字段。
- 2026-08-06 00:00 - Codex：为每日解牌页补入更有高级感的专用字组，改用更具杂志感的标题 serif 与更克制的正文 sans，优化标题、标签、正文与 CTA 的字体气质和字距层级。
- 2026-08-06 00:00 - Codex：根据用户提供的 Woomoo 每日页参考，进一步将每日页 section 字体向其靠拢，采用更接近 `Lora + Red Hat Display + Afacad` 的分层字体策略，主要作用于标签、章节标题、正文与总结卡。
- 2026-08-06 00:00 - Codex：将 section 顶部装饰由抽象渐变圆升级为代码内 SVG icon system，为 `Today's Energy`、`For Your Heart`、`One Small Action`、`Companion Note` 分别提供更具语义感的图标，保持可维护和风格统一。
- 2026-08-06 00:00 - Codex：继续将 section icon system 品牌化，统一笔触、内部细节、发光强度与底色渐变层次，让三个主要 section 的 icon 更接近精致线性图标体系，而非单纯装饰图形。
- 2026-08-06 00:00 - Codex：继续把每日页 section 收向更松弛的阅读节奏，减轻 icon 体量与发光感，同时拉开章节留白、放缓正文行距，让整体更像成熟 editorial 内容页。
- 2026-08-06 00:00 - Codex：根据用户反馈继续压低 section 字级，收小标签、章节标题与正文尺寸，并同步降低正文存在感，让每日页更接近 Woomoo 那种克制型阅读层级。
- 2026-08-06 00:00 - Codex：按用户最终确认，将 Hero 下三块摘要卡改为无边框三列 `TODAY / YOUR HEART / GENTLE STEP` 状态栏，并将三列值约束为 1-3 个单词的快速预览，不扩展到其他版式改造。
- 2026-08-06 00:00 - Codex：移除三列状态栏与正文 section 之间的明显长横线，避免每日页在手机上产生过重的分块感。
- 2026-08-07 00:00 - Codex：根据用户提供的新产品需求，将 Daily Reading 从旧的四段式情绪鸡汤结构切换到 `Card Hero + Core Insight + Glance Row + 3 Reading Sections + A Gentle Reminder`，并同步修改每日 AI prompt、API 结构、fallback 内容与结果页布局。
- 2026-08-07 00:00 - Codex：进一步收紧 Daily Reading 的 AI 输出长度与语气，明确要求像 close friend 一样进行塔罗式生活观察，避免 therapist / spiritual teacher / motivational speaker 语气，并强制 `WHERE YOU MAY BE NOW` 包含至少一个具体现实场景。
- 2026-08-07 00:00 - Codex：将顶部 `TODAY / YOUR HEART / GENTLE STEP` 改为本地塔罗牌数据驱动，避免 AI 自由生成造成重复、抽象和与牌义不匹配的问题。
- 2026-08-07 00:00 - Codex：为 Daily Reading 增加服务端内容护栏；如果 Gemini 仍写回旧的心理疗愈模板或缺少现实场景，会自动回退到 grounded lifestyle fallback，`The Magician` 额外要求必须提到 initiative、已有资源与真实行动。
- 2026-08-07 00:00 - Codex：发现本地 `GEMINI_API_KEY` 为空，Daily Reading 实际持续走 fallback；因此将 fallback 从单一通用模板升级为按牌义 archetype 生成，避免不同卡牌在无 AI 时仍输出几乎相同的段落。
- 2026-08-07 00:00 - Codex：接入新的本地 Gemini key 后，发现 Daily Reading 偶发因“现实场景不够明确”被服务端校验拦回 fallback；因此补充了更完整的现实场景关键词，并为 daily Gemini 输出增加最多 3 次的自动重试与纠偏提示，优先保证页面实际落到 Gemini 输出。
- 2026-08-07 00:00 - Codex：根据用户反馈继续修正 daily prompt 的场景偏置，明确要求 Gemini 不要默认落到工作语境，而要让感情、生活、家庭、朋友、日常习惯与内心状态自然参与生成。
- 2026-08-07 00:00 - Codex：继续压低 fallback archetype 中的工作默认值，把 initiative / pause / truth / change / gentle 五组兜底文案都改成优先落到关系、家庭、个人选择、日常习惯与内心拉扯，避免限流退回 fallback 时又显得过度职业化。
- 2026-08-09 00:00 - Codex：为支持每日解牌页纯 UI 调试，临时将 Daily Reading 服务端逻辑固定为 fallback-only，避免 Gemini 配额、延迟和内容波动影响版式优化与视觉验收。
- 2026-08-09 00:00 - Codex：继续将每日页主 section 向 Woomoo 风格收紧，只下调 label / title / body 的文字层级与宽度，不改结构，使段落更克制、更轻，减少“模块说明文”观感。
- 2026-08-09 00:00 - Codex：继续优化每日解牌页第一屏，在不改内容结构的前提下收小 Hero 牌面与标题、将摘要改为更轻的引言样式、压缩 `TODAY / YOUR HEART / GENTLE STEP` 的视觉重量，并把首个 section 上提，让首屏更接近 Woomoo 的克制阅读节奏。
- 2026-08-09 00:00 - Codex：根据最新视觉反馈撤回 Hero 摘要的 serif/italic 处理，恢复到正文体系，并继续把 Hero 标题、摘要和三列摘要的横向宽度统一对齐到 section body 的边距。
- 2026-08-09 00:00 - Codex：将 Daily Reading 最后一屏改为与 Question Reading 一致的收尾结构，统一 `A Gentle Reminder` 的渐变卡样式、底部 `Back to Home` 按钮和回首页行为，并移除旧版分割线与按钮下辅助文案。
- 2026-08-09 00:00 - Codex：继续收紧 Daily Reading 最后一屏的提醒卡正文节奏，收窄 `A Gentle Reminder` 的移动端列宽并加入最小高度，让短句在手机上稳定呈现为约 3-4 行，而不是显得过短过空。
- 2026-08-10 00:00 - Codex：将每日流程的牌背统一切到本地 `Mystic Editorial` 版本，并为翻牌结果页 / 结果面板接入 3 张本地批准样图；Daily Reading 在每次提交时随机取其中 1 张，并在该次流程内保持预览翻牌与结果页一致，方便先专注验收 UI 与氛围。
- 2026-08-10 00:00 - Codex：修复每日解牌页牌名与图片可能错位的问题；此前每日流程会先本地抽一张牌，再在 spread 请求返回时用另一张随机牌覆盖数据，图片却可能沿用前一张。现改为每日页一旦本地抽到卡牌就整次流程固定该牌，只异步补充 spread 元数据；同时临时将每日抽牌池限制为已有本地图片资产的牌，避免未生成图片的牌落到错误占位图。
- 2026-08-12 00:00 - Codex：将每日解牌页的“牌阵标题 / 位置文案 / 解读内容”统一纳入共享 `READING_CONTENT_SOURCE` 规则，不再允许 `spread` 与 `reading` 分别切换来源；牌名与牌图继续保持本地抽牌和本地资源绑定。
- 2026-08-13 00:00 - Codex：根据用户提供的新视觉图，将每日解牌页第一个 section 顶部的原代码 icon 替换为本地静态图片资源，用于验证更具氛围感的章节头图方案。
- 2026-08-13 00:00 - Codex：继续将用户提供的双 icon 大图切成左右两个独立资源，并分别替换到每日解牌页第 2、3 个 section 顶部，统一三段章节头图的视觉语言。
- 2026-08-13 00:00 - Codex：进一步统一三张 section 头图的源图画布与内容尺度；将三张资源都重整为相同方形画布并按统一边距重新居中，解决仅靠 CSS 缩放仍会造成视觉大小不一致的问题。
- 2026-08-13 00:00 - Codex：根据用户最新反馈，将每日解牌页各 section 之间的垂直间距整体再压缩约 10px，保持 section 内部结构不变，仅收紧段落节奏。
- 2026-08-13 00:00 - Codex：继续根据用户反馈，再次将每日解牌页各 section 之间的垂直间距额外压缩约 10px，进一步收紧长页面的阅读节奏。
- 2026-08-13 00:00 - Codex：根据用户截图反馈，将第一个 section 与上方 Glance Row 之间的起始留白额外压缩约 15px，不改变各 section 内部结构，仅收紧首个 section 入场位置。

## 8. AI 交互日志

- 用户：希望为每日抽解牌页单独创建用户故事，用于后续页面优化。
- Codex：创建 DC001，聚焦每日抽牌和每日结果页的阅读体验。
- 用户：希望每日陪伴页进入后不显示下方滑动洗牌组件，只显示一张更大的牌背，点击后停顿 1-2 秒再翻牌并显示解牌页。
- Codex：移除每日页的 `CardFan` 渲染，改为单张牌背按钮和翻牌停顿流程。
- 用户：询问为什么每日抽牌页中间这张牌点击翻转时会闪一下。
- Codex：解释为 `v-if / v-else` 造成 DOM 替换和图片重绘，并改为常驻翻牌容器避免闪烁。
- 用户：继续 Echo Care Web 项目，当前重点是问题解牌页 / 每日抽牌页优化。
- Codex：将每日解读的 prompt、fallback 和结果页继续收束到 Hero + 4 sections，并同步 `.ai` 文档中的 JSON 结构约定。
- 用户：发现每日抽牌页进去后需要加载一会儿才能翻牌，希望优化这一等待感。
- Codex：将每日流程调整为本地即时出牌、后台异步补全 spread 元数据，并同步到 DC001 用户故事。
- 用户：反馈当前每日解牌页排版不自然，希望按更好的网页设计方式优化。
- Codex：调整 `DailyReadingPanel` 的 Hero、段落节奏和 section 重复关系，并同步到 DC001 用户故事。
- 用户：希望按更优秀的网页平面设计方式继续检查当前页面美观性和可读性。
- Codex：沿 `Editorial Calm` 方向继续压 Hero、重组正文节奏，并把摘要改为优先承接情绪层文案。
- 用户：给出 Woomoo 的每日解牌页截图，希望当前页面进一步往“更高级的作品感”靠拢。
- Codex：在不引入新业务结构的前提下，为每日结果页补充轻量 metadata、图形化段落节点和底部总结主卡，继续优化黑紫视觉中的层次与阅读引导。
- 用户：反馈当前页面文字字体还没有高级感。
- Codex：为每日页引入更精致的标题与正文专用字体，并重新调整标签、正文、总结卡和按钮的字重、字距与行高。
- 用户：提供 `https://woomoo.app/free-daily-tarot-reading`，希望 section 各板块字体直接参考它。
- Codex：检查页面源码后确认其实际混用 `Red Hat Display`、`Lora`、`Afacad`，并将我们每日页的 section 标签、标题、正文与辅助文案分别向这三组字体映射靠拢。
- 用户：希望三个 section 上方的 icon 用更专业的设计方式处理。
- Codex：评估后未使用 `imagegen`，因为项目内小型 icon system 更适合 code-native SVG；因此直接在 `DailyReadingPanel` 中实现统一风格的语义化 section icon。
- 用户：愿意继续把这套 icon 往更精致、更品牌化的方向收。
- Codex：进一步细化 icon 的线条、比例和光感，并统一 icon 容器的高光与渐变策略，让 section 视觉更接近成套设计资产。
- 用户：愿意继续往更轻、更松弛的方向优化。
- Codex：缩轻 section icon 的存在感，并同步放松 section 间距与正文节奏，让视觉重心更多回到标题和内容本身。
- 用户：指出 section 中字体仍偏大，希望更接近 Woomoo 的克制感。
- Codex：进一步收小 section 标签、标题和正文的字号与层级，减少内容块的视觉膨胀感。
- 用户：给出最终方向，要求只执行两项：采用 `TODAY / YOUR HEART / GENTLE STEP`，并将三列值控制在 1-3 个词。
- Codex：将 Hero 下摘要层替换为开放式三列状态栏，并在本地摘要逻辑中加入 1-3 词约束与安全 fallback。
- 用户：指出三列下方那根明显横线也需要去掉。
- Codex：删除 section 容器顶部的分割线，仅保留留白衔接，减轻页面断裂感。
- 用户：提供新的 Daily Reading 产品需求，明确要求改成 `Tarot-inspired Emotional Reflection`，并重构页面结构、字段结构和 AI prompt。
- Codex：开始将 Daily Reading 的前端布局、API 结构、fallback 生成和 prompt 共同切换到新的 emotional reflection 模型，仅影响 Daily Reading，不扩展到 Question Reading。
- 用户：要求只保留当前组件结构，进一步只修改 AI Prompt 和字段长度限制，让内容从“心理疗愈文章”变成“基于塔罗的生活观察”。
- Codex：收紧 daily prompt 的写作角色、禁用词和现实场景要求，并在服务端对各字段做更严格的长度裁切。
- 用户：继续要求顶部三个快速信息不要由 AI 随机发挥，而要和具体牌义直接匹配。
- Codex：将三列 glance 文案切换为本地塔罗牌数据表映射，保证 1-3 词、具体、且与牌义相关。
- 用户：指出最新输出仍沿用旧 AI 写作模板，希望彻底移除旧 tarot interpretation prompt，并用 `The Magician` 验证新 grounded lifestyle reflection 输出。
- Codex：移除旧 daily prompt 语气残留，强化禁用词和 `The Magician` 规则，并在服务端增加 daily 输出校验，避免 Gemini 偶发漂回旧模板。
- 用户：发现多张牌的 Daily Reading 正文几乎完全一样。
- Codex：定位到本地未配置可用 Gemini key，页面实际一直展示 fallback；因此继续把 fallback 升级为按牌义 archetype 的多模板输出，减少无 AI 时的重复感。
- 用户：提供新的 Gemini key，并希望页面真正走 Gemini。
- Codex：完成本地 key 替换后继续验证，发现 key 已可用，但 daily 输出偶发未通过现实场景校验；于是继续收紧纠偏策略，让 Gemini 失败时优先自动重试而不是立即退回 fallback。
- 用户：指出当前 AI 提示词导致回复总是关联工作，希望不要局限于工作，感情 / 生活 / 内心都可以关联。
- Codex：继续调整 daily prompt 与重试纠偏文案，明确禁止默认工作化表达，并把 relationship / home / family / personal life / inner tension 抬到与 work 同等优先级。
- 用户：愿意继续把 fallback 里的工作痕迹也压低。
- Codex：收缩 fallback archetype 默认示例中的工作场景，让 Daily Reading 即使因限流退回 fallback，也更自然地围绕感情、生活和内心展开。
- 用户：当前需要优化每日解牌页 UI 布局，不需要 Gemini 真实解读，希望临时固定走 fallback 并部署。
- Codex：将 Daily Reading API 临时切到 fallback-only，并同步 story 文档，确保后续 UI 调试不再受 Gemini 限额和输出波动影响。
- 用户：希望以后可以统一控制来源；如果说“全部走 Gemini”，则牌阵标题、位置文案、解读内容都走 Gemini；如果说“走本地”，则这些都走本地，但牌名和牌图始终本地抽取和对应。
- Codex：实现共享内容源开关 `READING_CONTENT_SOURCE`，让 Daily Reading 的 `api/spread` 与 `api/reading` 保持同源切换；本地调试默认值保持 `local`。
- 用户：在 section 已经去卡片化后，选择继续执行第 2 项，即再压一档标题和正文。
- Codex：继续下调 section 的文字尺寸、透明度、列宽和字距，保持结构不变，只收紧阅读层级。
- 用户：要求把每日解牌页最后一屏的 `A GENTLE REMINDER`、按钮样式和点击事件与问题解牌页统一，并去掉横线和按钮下无关文字。
- Codex：将 Daily Reading 的末屏收尾改为与 Question Reading 共用同类视觉语言和交互逻辑，CTA 改为回首页，移除旧 `draw again` 的分割线和辅助文案。
- 用户：指出每日解牌页最后一屏的 `A GENTLE REMINDER` 内容显得太少，希望固定在 3-4 行，并参考问题解牌页的字体气质。
- Codex：在 `DailyReadingPanel.vue` 中将提醒卡正文显式对齐到问题解牌页使用的 serif 文本体系，同时收窄正文列宽并补入最小高度，让短句在真机上更稳定地落到 3-4 行。
