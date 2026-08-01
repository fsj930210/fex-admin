# Tooltip

Tooltip 提供 hover/focus 说明，并复用共享 floating core。

## 导入与示例

```tsx
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-solid/primitive/tooltip'
<TooltipRoot><TooltipTrigger>{(trigger) => <button ref={trigger.ref} {...trigger.props}>Save</button>}</TooltipTrigger><TooltipPortal><TooltipContent>Save changes<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot>
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| Root | `open` / `defaultOpen` | `boolean` | `- / false` | 否 | 受控与非受控状态 |
| Root | `onOpenChange` | `(open, info) => void` | - | 否 | 状态请求 |
| Root | `placement` / `sideOffset` | `FloatingPlacement / number` | `top / 6` | 否 | 定位 |
| Root | `hoverOpenDelay` / `hoverCloseDelay` | `number` | `400 / 100` | 否 | 延迟 |
| Content / Arrow | `class` | `string` | - | 否 | 样式合并 |

## 说明

Arrow 是显式组合，Content 与 Arrow 共用 `--tooltip-background`。内容不可交互。disabled 控件使用带 `tabIndex={0}` 的 wrapper 作为 Trigger；受控模式必须在 `onOpenChange` 中回写状态。
