# Echo Care Web — Codex 开发工作流

本项目在 Codex 中开发时，默认使用 `.ai/` 作为产品记忆系统。

## 0. 核心规则

- **不要猜产品意图**：当需求范围、状态、数据规则或 UX 方向不清楚时，先读取相关 `.ai/` 文档；只有在合理假设风险较高时再向用户确认。
- **以 `.ai/` 为事实来源**：所有“已计划 / 已批准 / 已实现 / 已变更”的产品行为，都应沉淀到 `.ai/` 下的 PRD、功能模块、用户故事或架构文档中。
- **业务规则变更必须同步文档**：任何涉及业务规则、路由行为、Supabase 表结构假设、Gemini 返回结构、戒指生命周期、埋点事件、核心 UX 流程的变化，都必须同步到对应 PRD / 用户故事。
- **先看 YAML 头信息**：尤其是 `status` 字段。实现功能模块或用户故事前，必须确认状态是否允许推进。
- **优先小用户故事**：优先把需求拆成小而可验证的用户故事，避免一次性做过大的模糊改动。

## 1. PRD 基础文档

实现功能前，先检查：

- `.ai/prd/index.md`
- `.ai/prd/APP-Overall-Vision.md`
- `.ai/architecture/arch-overview.md`

如果缺失，应从 `.ai/template/` 中创建。

## 2. 功能模块 PRD

每个主要产品模块都应有：

```text
.ai/prd/features/<feature-name>/index.md
```

功能模块 PRD 使用模板：

```text
.ai/template/template-prd-feature.md
```

只有当功能模块 PRD 的状态为：

```yaml
status: "已批准"
```

才进入用户故事实现阶段。

## 3. 用户故事

用户故事存放位置：

```text
.ai/prd/features/<feature-name>/stories/
```

用户故事文件使用模板：

```text
.ai/template/template-story.md
```

推荐命名：

```text
<用户故事ID>-<简短描述>-<目标版本>.md
```

示例：

```text
QR001-question-reading-layout-v1.0.md
```

只有当用户故事状态为：

```yaml
status: "已批准"
```

才开始编码实现。

## 4. 开发流程

对于已批准的用户故事：

1. 读取对应功能模块 PRD 和用户故事。
2. 确认验收标准。
3. 先检查相关代码，再做修改。
4. 实现最小但完整的变更。
5. 运行相关验证，通常至少执行 `npm run build`。
6. 更新用户故事的任务勾选、开发日志、AI 交互日志。
7. 如果行为或业务规则发生变化，同步更新功能模块 PRD 和架构文档。

## 5. 当前技术栈

- 前端：Vue 3 + Vite
- 样式：Tailwind CSS / utility classes
- 部署：Vercel
- 数据库与存储：Supabase
- AI：通过 Vercel Serverless Function 调用 Gemini API
- 核心流程：
  - NFC 戒指入口
  - 每日陪伴抽牌
  - 问题式三张牌解读
  - 戒指激活与使用追踪
  - 戒指管理工具 / 链接生成

## 6. 项目专属规则

- 默认以移动端 H5 体验优先。
- 除非用户故事明确要求改变，否则保留当前高级黑紫色视觉语言。
- 解读页应遵循产品方向：情绪陪伴优先，塔罗工具其次。
- 修改 Gemini 相关逻辑时，必须同步记录预期 JSON 结构和语气规则。
- 修改 Supabase 相关逻辑时，必须记录受影响表、字段、生命周期规则和迁移 SQL。
- 修改埋点时，必须记录 `ring_events` 中新增或变更的事件，以及这些事件如何解释。
- 部署到 Vercel 前，除非用户明确要求跳过，否则先运行 `npm run build`。

## 7. 当前功能模块区域

建议的功能模块目录：

- `daily-companion`
- `question-reading`
- `home-entry`
- `ring-activation-tracking`
- `ring-admin`
- `gemini-reading-api`
- `memory-ring-mvp`

## 8. 用户引用规则

当用户引用某个文件、功能模块、用户故事或设计讨论时：

- 优先视为项目内资料。
- 先搜索本地文件，再依赖记忆。
- 如果引用来自粘贴的 ChatGPT 对话，应视为背景上下文；当其中决策影响产品行为时，应先沉淀到 `.ai/` 再编码。
