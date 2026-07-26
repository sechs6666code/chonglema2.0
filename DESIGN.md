---
name: "冲了吗 · Quiet Continuum"
description: "面向 iPhone 的高端私密记录产品，以连续空间、精确排版和少量液态玻璃建立成熟可信的消费级体验。"
mode: "Operate"
colors:
  light-canvas: "#F4F5F7"
  light-surface: "#FBFBFC"
  light-raised: "#FFFFFF"
  light-ink: "#101114"
  light-muted: "#5F636B"
  dark-canvas: "#0D0E10"
  dark-surface: "#15171A"
  dark-raised: "#1C1F23"
  dark-ink: "#F5F6F8"
  dark-muted: "#A6ABB3"
  accent: "#0A84FF"
  steady: "#24745B"
  release: "#B74E48"
typography:
  family: "Inter, PingFang SC, SF Pro Text, system-ui, sans-serif"
  display: "clamp(2.75rem, 12vw, 3.6rem)"
  title: "clamp(1.55rem, 6vw, 2rem)"
  body: "15px"
  caption: "12px"
shape:
  surface: "22px"
  inset: "16px"
  control: "14px"
  pill: "999px"
spacing:
  unit: "4px"
  page-inline: "20px"
  section-gap: "72px"
---

# Design System: Quiet Continuum

## Product Mechanism

用户每天完成一次二元选择，选择立即成为连续记录的一部分。界面首先证明三件事：能在三秒内完成、完整历史留在本机、一次波动不会让整个过程失去意义。

## Creative North Star

**“一整块会呼吸的系统表面。”**

页面不是卡片堆叠，也不是私密日记的纸张拟物。它更像 Apple、OpenAI、Claude、Linear 与 Raycast 共有的成熟产品界面：内容直接坐在空间里，重要交互拥有精确材质，状态变化通过比例和运动被理解。

旧版的电子手账、温暖纸面、飞行记录器、扫描线、信号轨、霓虹和仪表盘语汇全部退出。新的辨识度来自大面积冷静空间、非对称阅读节奏、一条贯穿页面的“连续线”、少量银灰折射和唯一 Apple Blue 强调色。

## Use Scene

用户常在私人环境中单手打开 PWA，环境可能偏暗，注意力持续时间很短。默认跟随系统明暗模式；两套主题共享相同层级，不做简单反相。390×844 是主验收尺寸，320–680px 必须完整可用。

## Color Strategy

采用 Restrained：中性冷灰加一个蓝色强调。

### Light

- Canvas `#F4F5F7`
- Surface `#FBFBFC`
- Raised `#FFFFFF`
- Ink `#101114`
- Muted `#5F636B`
- Hairline `rgba(17, 19, 24, .08)`

### Dark

- Canvas `#0D0E10`
- Surface `#15171A`
- Raised `#1C1F23`
- Ink `#F5F6F8`
- Muted `#A6ABB3`
- Hairline `rgba(255, 255, 255, .09)`

### Semantic Color

- Accent `#0A84FF`：焦点、当前导航、主要确认。
- Steady `#24745B`：没冲、连续、成功。
- Release `#B74E48`：冲了、错误、危险动作。

绿红只表达业务状态，不参与装饰。禁止彩虹渐变、紫蓝 AI 渐变、金色领奖台、外发光和高饱和背景。

## Typography

- 英文与数字自托管 Inter Variable；中文优先苹方。
- 首屏问题 44–58px，字重 690，字距不小于 `-0.04em`。
- 关键数字 48–72px，使用 `font-variant-numeric: tabular-nums`。
- 模块标题 24–32px，正文 14–15px，辅助文字不低于 12px。
- 层级主要依靠字重、尺寸和留白，不靠多色文字。
- 不使用装饰性英文眉题、全大写标签、章节编号或技术化等宽字体。

## Spatial System

- 页面内容宽度 `min(100% - 40px, 620px)`。
- 首屏最小高度约 `min(720px, 88dvh)`，无需滚动即可打卡。
- 一级模块间距 72–96px，模块内部间距遵循 4px 基准。
- 卡片只在内容需要真实抬升时出现；趋势数字和系统状态直接使用空间与分隔组织。
- 宽屏保持移动产品比例并居中，不扩展成桌面仪表盘。

## Shape and Depth

- 大型交互表面 22px。
- 内嵌分组 16px。
- 按钮与输入 14px。
- 短状态与导航背景允许全圆角。
- 每个元素只选择一种主要抬升方式：色阶、阴影或描边，不三者叠加。
- 阴影必须有方向和柔和扩散，颜色跟随背景，不使用黑色大投影。

## Liquid Glass

网页 Liquid Glass 仅是近似材质，不是 Apple 原生实现。它只用于：

1. 底部导航坞。
2. 首屏二元选择的活动层。
3. 底部抽屉顶部区域。

材质由背景模糊、饱和度、细内高光、边缘折射和轻阴影共同形成。减少透明度时回退为实色表面。禁止给所有卡片加磨砂。

## Information Architecture

### Today

顶栏只保留品牌、排行榜与更多。日期融入首屏阅读流。主问题左对齐，下面是一个完整的二元选择表面；两个选项拥有图标、动作和说明，选择后活动层平滑迁移。补打卡入口位于首屏尾部，不与主操作争夺视觉重量。

### Continuity

趋势模块以一条连续的空间叙事呈现：本月比例为主数字，当前连续天数成为右侧或下一行的第二阅读点，累计与历史最佳组成轻量读数。禁止饼图、进度环和三张等权统计卡。

### Recovery

折叠态是一条高价值状态摘要；展开后才出现液体容器、阶段时间轴和设置。液体视觉是产品中唯一允许持续物理感的区域，所有医学相关文案必须明确为 120 小时时间估算。

### History

历史使用独立的月度表面。日历格最小触控尺寸 44px；当天、没冲、冲了、漏打卡同时依靠形状、图标或纹理与颜色表达。

### System Actions

提醒和排行榜使用两条高质量系统行，不做嵌套卡片。状态在原位更新。所有抽屉沿用同一标题区、输入、操作和关闭规则。

## Icons

统一使用 Lucide 静态图标，视觉尺寸 18–22px，描边 1.75–2px。禁止混入手绘 SVG、emoji、填充图标或不同图标家族。

## Motion Contract

使用 GSAP，动效只解释层级、反馈和状态。

- **Opening Resolve**：首屏在 760ms 内从轻微模糊、裁切和深度差中稳定下来。
- **Choice Morph**：二元选择活动层在 520ms 内迁移；文本与图标随后完成 80ms 错峰。
- **Continuity Reveal**：关键数字首次进入视口时计数，连续线与内容按阅读顺序出现。
- **Depth Scroll**：背景光场以页面滚动速度的约 0.08 倍移动；模块只做 8–16px 深度分离。
- **Sheet Lift**：抽屉抬升、背景减焦、底部导航退场形成一个完整时间线。
- **Milestone**：里程碑只在真实达成时触发一次克制的径向亮度与轻弹，不出现纸屑和粒子爆炸。

所有 GSAP 动画只修改 transform、opacity、filter、clip-path 与 CSS 变量；必须清理实例并用 `gsap.matchMedia()`处理 `prefers-reduced-motion`。禁止滚动锁定、持续光轨和无意义循环。

## Interaction States

- 触控目标至少 44×44px。
- `:active` 使用 0.98–0.99 缩放和轻微阴影收束。
- 焦点为 2px 蓝色外环，偏移 3px。
- 加载使用与最终布局同形的骨架。
- 空状态提供下一步，不用装饰插画。
- 错误在当前模块解释问题与恢复动作。

## Accessibility

- 正文、占位符与状态色达到 WCAG AA。
- “没冲 / 冲了”不只靠颜色区分。
- 系统减少动态效果时保留内容和状态，去除自动动效。
- 系统减少透明度时所有玻璃回退为不透明表面。
- 安全区、单手触控与中文文本换行必须在 320px 宽度验收。

## Absolute Bans

- 不做仪表盘模板、后台管理、等权卡片墙或嵌套卡片。
- 不使用纯黑纯白、暖米黄、金色、霓虹或游戏 UI。
- 不使用渐变文字、厚边框、巨型阴影、发光按钮或装饰性状态点。
- 不修改存储键、排行榜协议、推送接口、恢复算法、URL 或核心中文操作名称。
- 不虚构用户数量、医学结论、效果数据、客户评价或商业背书。
