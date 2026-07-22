---
name: "冲了吗 · 生物荧光夜间记录仪"
description: "面向手机的私密自律记录界面，以冷青生命信号和深海墨色表达诚实、连续与恢复。"
colors:
  night-ink: "#061210"
  night-deep: "#030B0A"
  night-surface: "#0D211D"
  night-raised: "#122A25"
  night-strong: "#17342D"
  text-primary: "#EAFFF7"
  text-soft: "#C6DED5"
  text-muted: "#8EAAA1"
  text-muted-strong: "#A9C1B9"
  line: "rgba(178, 236, 214, 0.14)"
  line-strong: "rgba(178, 236, 214, 0.24)"
  bio-mint: "#42F5B3"
  bio-mint-soft: "rgba(66, 245, 179, 0.15)"
  coral-alert: "#FF746C"
  coral-soft: "rgba(255, 116, 108, 0.14)"
typography:
  display:
    fontFamily: "Avenir Next, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(3.15rem, 15.2vw, 4.8rem)"
    fontWeight: 750
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Avenir Next, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "15px"
    fontWeight: 520
    lineHeight: 1.6
  label:
    fontFamily: "SFMono-Regular, JetBrains Mono, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "0.06em"
rounded:
  control: "12px"
  inner: "14px"
  surface: "16px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "34px"
components:
  action-no:
    backgroundColor: "{colors.bio-mint-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.inner}"
    padding: "18px"
    height: "104px"
  action-yes:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.inner}"
    padding: "18px"
    height: "104px"
  surface:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.surface}"
    padding: "22px"
---

# Design System: 生物荧光夜间记录仪

## Overview

**Creative North Star: “掌心里的生命信号舱”**

这是一个人在夜间或私人环境中快速完成记录的操作界面，不是宣传页，也不是道德审判台。深海墨绿是安静的环境，冷青像持续但克制的生命信号；珊瑚红只承担“冲了”和错误状态，不作为装饰。页面始终先让用户完成今天的动作，再逐层看到统计、榜单、恢复与历史。

它拒绝旧版的奶油色健康卡片，也拒绝霓虹赌场式游戏化。动效可以强烈，但每一次运动都必须对应进入、确认、连续、展开、切换或滚动深度。

**Key Characteristics:**

- 单列、拇指优先、首屏完成打卡。
- 深色单主题，冷青为唯一品牌强调色。
- 大数字、细网格、环形扫描和点场构成“活体仪器”语言。
- 面板少而完整，避免卡片套卡片。
- 高动效强度，所有关键效果支持减少动态设置。

## Colors

冷青生命信号从偏蓝的墨绿夜色中浮出；红色严格绑定失败/“冲了”状态。

### Primary

- **Bio Mint** (`#42F5B3`): 主操作确认、连续进度、当前状态、焦点环和稀疏光迹。

### Secondary

- **Coral Alert** (`#FF746C`): “冲了”、错误、危险操作；不得用于普通装饰或标题渐变。

### Neutral

- **Night Ink** (`#061210`): 全页背景。
- **Night Surface** (`#0D211D`): 主要功能面板。
- **Night Raised** (`#122A25`): 选中、展开和临时浮层。
- **Night Strong** (`#17342D`): 当前状态与局部高亮表面。
- **Signal White** (`#EAFFF7`): 主文字与关键数字。
- **Mist Green** (`#8EAAA1`): 次级说明与标签。

### Named Rules

**The Signal Rarity Rule.** 冷青实色只占每屏约 10%，其余通过透明度、描边和光晕表达层级。

**The State Lock Rule.** 绿色只表示稳住/进展，红色只表示冲了/错误；同一状态在按钮、日历、环形图和榜单中保持一致。

## Typography

**Display Font:** Avenir Next + PingFang SC fallback
**Body Font:** Avenir Next + PingFang SC fallback
**Label/Mono Font:** SF Mono / JetBrains Mono fallback

**Character:** 中文以清晰、紧凑的现代无衬线呈现；数字与小标签带仪器读数感，但正文不做全大写或过度字距。

### Hierarchy

- **Display** (750, `clamp(3.15rem, 15.2vw, 4.8rem)`, 0.98): 今日问题与完成状态，只允许两行以内。
- **Headline** (720, 25–32px, 1.08): 面板标题和关键统计。
- **Title** (680, 17–20px, 1.2): 子模块标题。
- **Body** (520, 15px, 1.6): 状态解释与帮助文本，单段不超过 65 个汉字。
- **Label** (650, 10–11px, 0.06em): 日期、百分比、读数与短标签。

## Layout

页面以 430px 为主要设计宽度，内容宽度为 `min(100% - 28px, 720px)`；手机端左右安全边距 14px，模块垂直节奏为 24/34px。首屏是状态问题、双按钮和即时反馈；统计以一个主连续面板加两个轻量读数组成；榜单、恢复仓和日历各自拥有完整连续表面，不再嵌套多层白卡。

小于 680px 时所有多列模块显式收成两列或单列；最小触控目标 44px。使用 `min-height: 100dvh`，底部按钮尊重安全区。宽屏仅居中呈现手机产品，不扩展成桌面仪表盘。

## Elevation & Depth

深度主要依靠色层、1px 冷青透明描边、内高光和局部光场，不使用纯黑重阴影。静止表面近乎平；选中、展开和拖动时才出现更亮边缘与外部辉光。

### Shadow Vocabulary

- **Ambient Surface** (`0 24px 80px rgba(0, 8, 6, 0.42)`): 大型面板与底部抽屉。
- **Signal Glow** (`0 0 36px rgba(66, 245, 179, 0.16)`): 只用于当前进展和选中状态。
- **Alert Glow** (`0 0 30px rgba(255, 116, 108, 0.14)`): 只用于红色状态确认。

## Shapes

大型连续表面统一 16px 圆角，内部可点击块统一 14px，普通按钮与输入统一 12px，短状态标签和图例允许全圆角。圆形只用于进度、头像/排名标记、菜单和真正的仪器节点；不能把所有图标都装进圆角方块。

## Components

### Buttons

- **Primary pair:** 两个同权的大触控区，绿色与红色由透明色层区分，文字和图标共同表达状态。
- **Active:** 缩放至 0.98，边缘扫描一次，数字/状态文字完成一次定向揭示。
- **Focus:** 2px 冷青或红色外环，偏移 3px。
- **Ghost:** 墨绿透明底 + 1px 线框，不使用灰色药丸堆叠。

### Cards / Containers

- **Corner Style:** 16px 主表面，14px 内部操作区。
- **Background:** 墨绿透明层，允许非常轻的 `backdrop-filter`，但必须有不透明回退。
- **Shadow Strategy:** 默认依靠色层，浮层才使用 Ambient Surface。
- **Border:** `rgba(178, 236, 214, 0.14)`；选中状态转为对应状态色。

### Inputs / Fields

- 深色实底、12px 圆角、最小高度 48px。
- 聚焦时边框与外环变成冷青；错误使用珊瑚红并显示文字，不只变色。

### Navigation

顶部只保留一个圆形更多按钮；页面不新增底栏或营销导航。固定“回到今天”按钮使用深色实底与冷青细线，并避开底部安全区。

### Signature Component: Signal Field

页面背景由稀疏点场、缓慢轨道线和跟随滚动深度的光晕组成；只在页面空白与主表面边缘可见，不能降低文字对比。主操作触发一次向外扩散的脉冲，里程碑触发更大但短促的环形庆祝。

### Motion Architecture

动效采用 ReactBits 的组件级思路：Dot Field 负责背景反馈，Spotlight Card 负责局部触点光场，Blur Reveal 负责内容进入，Click Spark 与 Magic Rings 负责打卡和里程碑。实现使用 Canvas、Web Animations/CSS 与观察器按组件独立启停，不依赖全局 GSAP 时间线；所有效果均保留静态可用状态并响应 `prefers-reduced-motion`。

## Do's and Don'ts

### Do:

- **Do** 让首屏在常见手机高度内完整展示问题、两个动作和反馈。
- **Do** 用运动表现状态迁移、确认、展开和连续增长。
- **Do** 保留所有隐私与非医学说明，并使其在深色主题下清晰可读。
- **Do** 在 60fps 与视觉强度冲突时优先使用 transform、opacity 和 CSS 变量。

### Don't:

- **Don't** 回到米白、奶油、黄铜或通用健康 App 玻璃卡片风格。
- **Don't** 使用紫蓝 AI 渐变、弹跳 easing、无限跑马灯或无意义开屏文案。
- **Don't** 把每个统计数字各自包进同样的卡片。
- **Don't** 让 WebGL、粒子或指针效果阻塞打卡、滚动或低端手机。
- **Don't** 修改现有数据键、排行榜字段、推送协议或恢复算法含义。
