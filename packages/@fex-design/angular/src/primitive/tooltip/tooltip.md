# Tooltip

Tooltip 是 hover/focus 触发的非交互说明组件，复用共享 floating core。

## 导入与示例

```ts
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger } from '@fex-design/angular/primitive/tooltip'
```

```html
<fex-tooltip><button fexTooltipTrigger>Save</button><fex-tooltip-portal><fex-tooltip-content>Save changes<fex-tooltip-arrow /></fex-tooltip-content></fex-tooltip-portal></fex-tooltip>
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| Tooltip | `open` / `defaultOpen` | `boolean` | `- / false` | 否 | 受控与非受控状态 |
| Tooltip | `placement` / `sideOffset` | `FloatingPlacement / number` | `top / 6` | 否 | 定位 |
| Tooltip | `hoverOpenDelay` / `hoverCloseDelay` | `number` | `400 / 100` | 否 | 延迟 |
| Tooltip | `disabled` | `boolean` | `false` | 否 | 禁止触发 |
| Content / Arrow | `class` | 原生 class | - | 否 | 自动与默认 class 合并 |

## 事件、状态与注意事项

`(openChange)` 发出下一状态；传入 `[open]` 时由调用方回写。Arrow 是显式组件，Content 与 Arrow 共用 `--tooltip-background`。内容不可交互。disabled 按钮外层使用 `tabindex="0"` wrapper 和 `fexTooltipTrigger`，内部按钮保持原生 disabled。
