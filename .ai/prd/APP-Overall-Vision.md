---
title: "Echo Care Web 整体愿景"
version: "1.0.0"
last_updated: "2026-07-13"
status: "草稿"
---

## 1. 产品愿景

Echo Care Web 希望把 NFC 戒指变成一个安静的日常陪伴入口。戒指不只是打开链接的工具，而是一个实体仪式：用户触碰戒指后，进入属于自己的情绪空间。

产品方向：

```text
NFC 戒指
↓
移动端 H5
↓
每日陪伴 / 问题解牌
↓
Gemini 情绪化解读
↓
使用记忆与未来个性化
```

## 2. 产品定位

产品应该像：

- 每日情绪陪伴，而不是冰冷的塔罗工具。
- 私密日记页，而不是塔罗百科。
- 高级移动端仪式，而不是普通网页表单。

参考设计语言：

- Apple Journal
- Calm
- Headspace
- 高级黑紫色 Spiritual Wellness

避免：

- 过度装饰的塔罗 UI
- 密集的 AI 长文
- 过多图标、分割线、卡片容器和发光效果
- 强预测式表达

## 3. 核心用户体验

### 每日陪伴

用户抽取每日一张牌，并收到一段简短的情绪陪伴解读。

目标阅读节奏：

```text
牌面 Hero
↓
Today's Energy
↓
For Your Heart
↓
One Small Action
↓
Companion Note
```

### 问题解牌

用户输入一个问题，并收到三张牌解读。

目标阅读节奏：

```text
Question
↓
Three Cards
↓
Three-Card Insight
↓
Your Heart Today
↓
What's Influencing This
↓
Where To Focus
↓
The Bigger Picture
↓
A Gentle Reminder
```

核心原则：先回答问题，再解释原因。

### 戒指追踪

系统应该知道：

- 首次激活时间
- 打开次数
- 戒指类型：production / test
- 生命周期阶段：packed / activated / retired
- 关键使用事件

### 未来 Memory Ring

未来戒指可以支持回忆页面：

- 语音留言
- 文字信件
- 照片
- 远程持续更新

## 4. 成功标准

- 用户在 3 秒内理解下一步要做什么。
- 解读页在手机上安静、清晰、容易读完。
- 戒指打开和激活数据能被可靠记录。
- 产品架构可以同时支持塔罗陪伴和未来 Memory Ring 实验，不需要重写。

