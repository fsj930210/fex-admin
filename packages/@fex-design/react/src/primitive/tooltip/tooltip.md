# Tooltip

Tooltip 为元素提供简短、非交互式说明，定位能力复用 floating core，默认通过 hover 和 focus 打开。

## 导入

```tsx
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex-design/react/primitive/tooltip'
```

## 基础用法

```tsx
<TooltipRoot>
  <TooltipTrigger>{(props) => <button {...props}>Save</button>}</TooltipTrigger>
  <TooltipPortal><TooltipContent>Save changes<TooltipArrow /></TooltipContent></TooltipPortal>
</TooltipRoot>
```

`TooltipArrow` 是显式组合：写入时显示，省略时不显示。Content 和 Arrow 同时读取 `--tooltip-background`；自定义整体颜色可使用 `className="[--tooltip-background:#db2777]"`。

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| Root | `open` | `boolean` | - | 否 | 受控打开状态 |
| Root | `defaultOpen` | `boolean` | `false` | 否 | 非受控初始状态 |
| Root | `onOpenChange` | `(open, info) => void` | - | 否 | 状态变化回调 |
| Root | `disabled` | `boolean` | `false` | 否 | 禁止触发 |
| Root | `placement` | `FloatingPlacement` | `top` | 否 | 复用 floating 方位 |
| Root | `sideOffset` | `number` | `6` | 否 | 与 trigger 的距离 |
| Root | `alignOffset` | `number` | `0` | 否 | 对齐轴偏移 |
| Root | `hoverOpenDelay` | `number` | `400` | 否 | hover 打开延迟 |
| Root | `hoverCloseDelay` | `number` | `100` | 否 | hover 关闭延迟 |
| Content | 原生 div 属性 | `HTMLAttributes` | - | 否 | class、style 和原生属性透传 |
| Arrow | 原生 div 属性 | `HTMLAttributes` | - | 否 | 显式箭头及 class 合并 |

## 受控与事件

非受控模式由 Root 保存状态；传入 `open` 后，Root 只通过 `onOpenChange` 请求外部更新。回调的 `info.reason` 可区分 hover、focus、Escape 等来源。

## 注意事项与组合

- Tooltip 使用 `role="tooltip"` 和 `aria-describedby`，不设置 `aria-haspopup`。
- 内容不可交互；需要按钮、链接或表单时使用 Popover。
- 原生 disabled 元素无法获得焦点。请把 Trigger props 绑定到 `tabIndex={0}` 的 `inline-flex` wrapper，并让内部 disabled 控件使用 `pointer-events-none`。
- Trigger 必须把 render prop 中的全部 props 和 ref 绑定到真实 DOM。
- 可在 Content 内组合 Kbd、图标和简短文本，但不要放交互控件。
