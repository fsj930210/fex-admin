# Fex Components Token Design

## 1. 目标

Fex 的五个框架实现必须共享同一套视觉规格。Token 用于表达稳定、可复用、用户确实希望修改的设计决策，而不是把组件中的每个数值都变成 CSS Variable。

设计目标：

- React、Vue、Solid、Svelte、Angular 共享同一套系统 Token 和组件样式事实源。
- 用户修改 CSS Variable 后，无需修改组件 API。
- 源码交付、内网二次封装为 npm 包、局部业务覆盖三种场景都可用。
- `size="xs | sm | default | lg | xl"` 等公共 API 保持稳定，实际数值由 Token 决定。
- 用户仍可通过 `class`、`style` 和 UI 层结构化部件样式直接覆盖默认设计。
- 只沉淀有明确复用事实的 Token，避免 Token 数量失控。

## 2. Token 分层

采用三层覆盖模型：

```text
系统 Token
→ 组件规格 Token
→ 当前实例 Token / class / style
```

以 Button 的 `sm` 高度为例：

```text
--control-height-sm
→ --button-height-sm（可选覆盖）
→ --button-height（当前实例最终值）
→ height
```

系统 Token 必须声明默认值。组件规格 Token 通过 fallback 存在，不必全部重复声明：

```css
:root {
  --control-height-sm: 28px;
}
```

```ts
size: {
  sm: '[--button-height:var(--button-height-sm,var(--control-height-sm))]',
}
```

```ts
base: 'h-[var(--button-height)]'
```

这允许用户在不同范围覆盖：

```css
/* 所有同尺寸控件 */
:root {
  --control-height-sm: 30px;
}

/* 只修改所有 Button */
:root {
  --button-height-sm: 26px;
}

/* 只修改某个区域的 Button */
.compact-toolbar {
  --button-height-sm: 24px;
}
```

```tsx
/* 只修改当前实例 */
<Button
  size="sm"
  style={{ '--button-height': '42px' } as CSSProperties}
/>
```

## 3. 用户覆盖优先级

统一规定：

```text
系统 Token
< size/variant 默认样式
< 用户 class
< 用户 CSS Variable style
< 用户原生 inline style
```

框架组件必须将用户 class 放在默认样式之后：

```ts
cn(buttonClassName({ size, variant }), userClass)
```

`cn` 使用 `clsx + tailwind-merge`。标准 Tailwind 冲突 utility 由用户版本覆盖：

```tsx
<Button size="sm" className="h-12 px-8 rounded-none" />
```

`size-5` 同时设置宽高，适合 Icon Button、Avatar、Checkbox 等正方形组件；普通文本 Button 应优先使用 `h-*` 和 `px-*`。

复杂 UI 的内部部件由结构化 API 覆盖：

```tsx
<Dialog
  className={{
    content: 'max-w-3xl',
    header: 'border-b',
    body: 'p-8',
    footer: 'justify-start',
  }}
/>
```

Primitive 的部件本身直接接受原生 `class` / `className` 和 `style`。

## 4. 第一批系统 Token

第一阶段仅稳定以下类别。

### 4.1 语义颜色

```text
--background
--foreground
--secondary-background
--muted-background
--hover-background
--selected-background
--disabled-background
--secondary-foreground
--muted-foreground
--disabled-foreground
--placeholder-foreground
--primary
--primary-foreground
--border
--hover-border
--focus-border
--disabled-border
--danger
--danger-foreground
--success
--warning
--info
--focus-ring
```

### 4.2 Control Size

```css
:root {
  --control-height-xs: 24px;
  --control-height-sm: 28px;
  --control-height-default: 32px;
  --control-height-lg: 36px;
  --control-height-xl: 40px;

  --control-font-size-xs: 12px;
  --control-font-size-sm: 13px;
  --control-font-size-default: 14px;
  --control-font-size-lg: 14px;
  --control-font-size-xl: 16px;

  --control-icon-size-xs: 12px;
  --control-icon-size-sm: 14px;
  --control-icon-size-default: 16px;
  --control-icon-size-lg: 16px;
  --control-icon-size-xl: 18px;
}
```

适用组件：

```text
Button
Input
InputNumber
InputOTP
Select Trigger
AutoComplete Trigger
Cascader Trigger
TreeSelect Trigger
DatePicker Trigger
TimePicker Trigger
Pagination Button
Toggle
RadioButton
```

同一个 size 的表单控件高度必须一致。Padding 和 Gap 是否共用需在逐组件审查后决定，不因数值相同就自动抽取。

### 4.3 Radius

```css
:root {
  --radius-none: 0;
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```

组件的 `variant`、`size`、`shape`、`status` 是独立维度：

```text
variant = 视觉意图
size    = 规格大小
shape   = 几何形态
status  = 状态语义
```

不允许组合成 `outline-xl-rounded` 这类爆炸式枚举。

### 4.4 Typography

第一阶段至少公开：

```text
--font-family
--font-size-xs
--font-size-sm
--font-size-default
--font-size-lg
--font-size-xl
--font-weight-normal
--font-weight-medium
--font-weight-semibold
```

Line Height 只有确认需要随 size 统一变化时再加入。

### 4.5 Focus 和状态

```text
--focus-ring-width
--focus-ring-color
--disabled-opacity
--loading-opacity
```

Pointer、cursor、data-state 选择器属于组件实现，不是 Token。

### 4.6 Motion

第一阶段只提供少量稳定档位：

```text
--motion-duration-fast
--motion-duration-default
--motion-duration-slow
--motion-easing-standard
```

### 4.7 Elevation 和 Layer

```text
--shadow-control
--shadow-popup
--shadow-dialog
--shadow-toast

--z-sticky
--z-dropdown
--z-drawer
--z-dialog
--z-toast
--z-tooltip
--z-tour
```

弹层不再各自使用无语义的 `50`、`1000`、`1001`。

### 4.8 Layout Spacing

保留现有：

```text
--space-2xs
--space-xs
--space-sm
--space-md
--space-lg
--space-xl
--space-2xl
--space-3xl
```

主要用于页面布局、组件间距、Card 列表、Form Field 间距和 Density。组件内部规格不要求全部绑定 Layout Spacing。

## 5. 第二批候选 Token

只有逐组件审查确认存在共享语义后再增加：

```text
Indicator size：Checkbox、Radio
Avatar size
Item height：Menu、Listbox、Select、Tree、Cascader
Data row height 和 cell padding：Table、DataGrid
Control padding 和 gap
```

Switch 的轨道宽高、Slider 的轨道和 Thumb、Progress 的厚度属于组件族规格，不直接套 Control Height。

## 6. 组件级公开 Token

组件只公开高价值、稳定、用户经常调整的规格。

示例：

```text
Button/Input/Select
- 当前 height、font-size、icon-size、radius
- 各 size 的可选组件覆盖

Dialog/Drawer
- width/size、max-height、radius、overlay、shadow、motion、z-index

Popover/Tooltip
- min/max width、background、foreground、radius、shadow、motion

Tree
- indent、item height、line color、drop indicator color

Slider
- track size、thumb size、track/range background

Progress
- track size、track/value background、radius

Table/DataGrid
- row height、cell padding、header background、border、sticky shadow

Avatar
- current size、radius、各 size 的可选组件覆盖
```

组件变量默认使用系统 Token fallback，不在 `:root` 中重复声明全部默认值。

## 7. 不公开的内容

以下不作为稳定 CSS Variable：

- `display`、`position`、flex/grid 结构、overflow、pointer-events。
- data-state、focus、keyboard、Portal、拖拽 transform 等交互实现。
- 每一个内部 margin、padding、gap。
- Dialog 标题 margin、Select 箭头 margin 等微小 DOM 细节。
- Slider offset、Tree line position 等计算中间值。
- 仅属于一个组件的一次性布局数字。

内部计算确实需要 CSS Variable 时使用私有命名，例如：

```text
--_dialog-content-offset
--_slider-thumb-offset
```

私有变量不进入 API JSON 和正式文档，不保证稳定。

## 8. Token 提取标准

候选值必须满足以下判断：

1. 是否至少被两个不同组件族使用？
2. 是否表达同一种设计语义，而非数字恰好相同？
3. 用户修改后是否希望相关组件共同变化？
4. 是否可能只修改某一组件族？
5. 修改后是否不破坏组件行为和可访问性？
6. 名称能否长期稳定？
7. 普通 `class/style` 是否已经足够？

结论规则：

```text
跨组件共享且希望共同变化 → 系统 Token
组件族高频独立定制       → 组件 Token
单实例偶尔修改           → class/style
内部结构与计算           → 私有变量或硬编码
```

## 9. 文档要求

API JSON 应记录公开 CSS Variable：

```json
{
  "name": "--button-height",
  "description": "当前 Button 实例的最终高度。",
  "fallback": "对应 size 的 Button Token 或 Control Token",
  "scope": "instance",
  "part": "root"
}
```

每个公开 Token 文档必须说明：

- 默认值或 fallback。
- 影响的组件或部件。
- 系统级、组件级还是实例级。
- 全局覆盖、作用域覆盖和实例覆盖示例。
- 是否属于稳定公开契约。

## 10. 后续审查流程

逐组件重构时执行：

1. 搜索硬编码尺寸、字号、图标、圆角、阴影、动画和 z-index。
2. 判断它是系统 Token、组件 Token、私有变量还是应继续保留的 class。
3. 对齐五框架最终 class、CSS Variable 名称和 fallback。
4. 验证用户 class 在默认样式之后进入 `cn`。
5. 验证 `style` 可以覆盖组件当前变量。
6. 在文档 Demo 中展示系统、组件和单实例三种覆盖方式。

