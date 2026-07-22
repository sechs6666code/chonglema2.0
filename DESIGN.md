---
name: "冲了吗 · 双轨飞行记录器"
description: "面向手机的私密二元打卡界面，以黑匣子、双轨写入和记录带表达诚实、连续与恢复。"
colors:
  night-canvas: "#080907"
  night-deep: "#040504"
  night-surface: "#11130F"
  night-raised: "#181B15"
  night-strong: "#20251B"
  text-primary: "#F3F6E9"
  text-soft: "#D6DBC9"
  text-muted: "#969E89"
  steady-lime: "#D8FF3E"
  release-orange: "#FF6047"
  channel-blue: "#6ACBFF"
  day-canvas: "#EEF0E8"
  day-surface: "#F9FAF5"
  day-raised: "#E8ECE1"
  day-text: "#151810"
  day-muted: "#56604C"
  day-steady: "#587900"
  day-release: "#B83A2A"
  day-channel: "#006C9E"
typography:
  display:
    fontFamily: "Avenir Next, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(3.65rem, 17vw, 5.55rem)"
    fontWeight: 780
    lineHeight: 0.9
    letterSpacing: "-0.038em"
  body:
    fontFamily: "Avenir Next, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "15px"
    fontWeight: 520
    lineHeight: 1.6
  telemetry:
    fontFamily: "SFMono-Regular, JetBrains Mono, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "0.05em"
rounded:
  control: "8px"
  inner: "10px"
  surface: "12px"
  dock: "14px"
  status: "999px"
spacing:
  xs: "5px"
  sm: "9px"
  md: "14px"
  lg: "22px"
  xl: "40px"
---

# Design System: 双轨飞行记录器

## Creative North Star

**“每天三秒，向自己的黑匣子写入一条真实记录。”**

产品的独特机制不是统计，而是把一个私密的二元选择写成可回看的时间轨迹。典型场景是用户单手拿着手机，在不想被打扰的私人环境里完成一次快速记录。因此界面必须像可靠的随身记录装置：没有审判，没有虚假的健康承诺，没有营销页式解释；先写入，再读取。

这一方向避开两条惯常路径：不做柔和健康 App 的玻璃卡片仪表盘，也不做霓虹赌场式的戒断游戏。它的文化来源是飞行数据记录器、磁带时间码、双路音轨和便携测试仪，但所有符号都必须服务于真实操作。

## Mode

Operate。第一成功标准是几秒内完成打卡；第二是快速理解趋势；第三才是深入查看排行榜、恢复估算与历史。

## Visual Grammar

- 页面是一条垂直记录带，内容不是等权卡片集合。
- “没冲”与“冲了”共享一个双轨操作板，绿色轨与橙红轨对向写入。
- 趋势是一个完整读数舱，次级数据用分隔线组织，不再各自套卡。
- 排行榜和提醒是操作信道；恢复仓是独立物理舱；历史是可拖动回放带。
- 背景只有真实的时码横线、三条信号轨和稀疏标记，不使用泛科技网格或渐变光球。

## Color

### Night

- **Night Canvas `#080907`**：夜间主背景。
- **Night Surface `#11130F`**：主要功能表面。
- **Night Raised `#181B15`**：输入、日历单元与局部选中区。
- **Signal White `#F3F6E9`**：正文与大数字。
- **Muted `#969E89`**：非关键说明。
- **Steady Lime `#D8FF3E`**：没冲、连续、确认、焦点与当前路由。
- **Release Orange `#FF6047`**：冲了、错误、危险操作。
- **Channel Blue `#6ACBFF`**：提醒、隐私和辅助信道，不承担二元状态。

### Day

- **Day Canvas `#EEF0E8`**：低眩光浅色背景。
- **Day Surface `#F9FAF5`**：主要表面。
- **Day Ink `#151810`**：主文字。
- **Day Steady `#587900`** 与 **Day Release `#B83A2A`**：为白天可读性专门校准，不能直接沿用夜间荧光色。
- **Day Channel `#006C9E`**：辅助信道。

### State Lock

绿色只表示“没冲/稳住/连续”，橙红只表示“冲了/错误/危险”。冷蓝只表示系统与辅助信息。任何装饰不得破坏这三种语义。

## Typography

- 主问题使用 Avenir Next / 苹方的超紧凑大字，最多两行，字距不低于 `-0.04em`。
- 正文保持自然中文阅读节奏，不做全大写，不把等宽字体当“科技感”服装。
- 等宽字体仅用于日期、百分比、时长、月份和真实测量读数。
- 最小可见标签 10px；正文默认 15px；弹层输入与错误说明满足 AA 对比度。

## Shape System

- 主表面 12px。
- 内部操作区与分组 10px。
- 按钮、输入和日历选中块 8px。
- 仅状态点、进度节点与真正的短状态标签允许圆形或全圆角。
- 不混用 20/24/30px 的通用大圆角；恢复仓的容器遵循系统，内部液体模型可保持有机形态。

## Layout

- 设计基准宽度 390px，支持 320–680px；宽屏只把产品居中，不扩成桌面仪表盘。
- 页面内容宽度为 `min(100% - 28px, 680px)`。
- 首屏包含顶栏、日期、主问题、双轨选择与结果反馈，常见 390×844 视口无需滚动即可完成打卡。
- 固定底部命令坞提供“今天 / 趋势 / 恢复 / 记录”四个真实跳转，尊重安全区。
- 主要模块之间使用 38–48px 间距；组内使用 8–16px；标题上方留白必须大于下方。

## Components

### Twin-track Check-in

两个按钮位于同一块双轨操作板中，共享边界与中轴线。默认同时清晰；选择后当前轨道写入边缘信号，另一轨降低饱和但仍可点击进入修改。图标和文字共同传达状态，不能只靠颜色。

### Trend Deck

月度分布与连续天数共享一个主读数舱；当月累计和历史最佳是舱下的两个开放读数格。里程碑距离使用文字，不新增装饰性进度环。

### Command Rows

提醒与双榜是两条操作信道，使用紧凑横向布局。加载、未开启、已开启、错误与隐私状态必须在同一行文法中表达。

### Recovery Chamber

折叠态只显示“恢复趋势 + 百分比 + 展开”。展开后才出现液体模型、阶段、数据、动态开关与非医学说明。外壳使用记录器形状系统，液体内部保留陀螺仪反向液面物理。

### Replay Tape

日历使用紧凑方形单元和上下月滑动。未记录、漏打卡、没冲、冲了同时依靠颜色、纹理和文字图例。当天由冷蓝边框标识，选中态使用偏移硬影而不是光晕。

### Sheets

排行榜、提醒、历史编辑和恢复时间编辑共用同一种底部工作舱：14px 顶部圆角、真实背景、不透明回退、固定标题区、可滚动内容区和 44px 以上控件。

## Motion Architecture

动效以 ReactBits 的组件级方法组织，不依赖全局时间线：

- **Track Field**：三条背景信号轨缓慢传送数据包，指针或触控只产生轻微偏移。
- **Title Write**：主问题通过模糊、裁切和位移一次性写入；下方双色轨随后展开。
- **Control Reveal**：两个操作轨按 70ms 差值进入，表达二元选择顺序而非装饰性排队。
- **Click Spark**：打卡产生短促环形射线，绿色/橙红严格跟随状态。
- **Magic Rings**：里程碑使用两次短促扩散，不长期占屏。
- **Dock Cursor**：底部命令坞的实底游标在四个真实区段间移动。
- **Section Reveal**：远端模块进入时使用一次模糊与裁切揭示；首屏内容默认可见，脚本失效时不隐藏。

所有运动优先 transform、opacity、filter、clip-path 与 canvas；不监听每帧滚动改 React 状态，不锁定滚动，不使用弹跳 easing。`prefers-reduced-motion` 下保留全部内容与状态，只移除持续和入场运动。

## Accessibility

- 触控目标至少 44×44px。
- 正文与输入说明达到 4.5:1；大字至少 3:1。
- 键盘焦点使用当前状态色 2px 外环，偏移 3px。
- 所有二元状态都有图标与文字；所有错误提供原因与恢复动作。
- 弹层打开时底部命令坞不可操作；减弱透明度设置下所有玻璃表面改为实底。

## Do / Don’t

### Do

- 让用户先写入今天，再读取趋势。
- 让不同模块拥有不同的信息形态，同时共享同一物理语言。
- 在昼夜主题中分别校准色值和对比度。
- 让动效说明层级、写入、状态转换或完成反馈。

### Don’t

- 不回到奶油色健康卡、玻璃拟态卡片墙或紫蓝 AI 渐变。
- 不把每个数字各自装进圆角卡片。
- 不添加与功能无关的开屏文案、英文编号、假数据或医学承诺。
- 不改变本地存储键、排行榜字段、推送协议与恢复算法含义。
- 不让 canvas、滤镜或持续动画阻塞触控和滚动。
