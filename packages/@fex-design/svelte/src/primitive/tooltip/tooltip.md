# Tooltip

Tooltip 是基于共享 floating core 的 hover/focus 非交互说明。

## 导入与示例

```svelte
<script lang="ts">
import TooltipRoot from '@fex-design/svelte/primitive/tooltip'
import TooltipTrigger from '@fex-design/svelte/primitive/tooltip-trigger'
import TooltipPortal from '@fex-design/svelte/primitive/tooltip-portal'
import TooltipContent from '@fex-design/svelte/primitive/tooltip-content'
import TooltipArrow from '@fex-design/svelte/primitive/tooltip-arrow'
</script>
<TooltipRoot><TooltipTrigger>{#snippet children(trigger)}<button use:trigger.action {...trigger.props}>Save</button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent>Save changes<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot>
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| Root | `open` / `defaultOpen` | `boolean` | `- / false` | 否 | 受控与非受控状态 |
| Root | `onOpenChange` | `(open, info) => void` | - | 否 | 状态变化 |
| Root | `placement` / `sideOffset` | `FloatingPlacement / number` | `top / 6` | 否 | 定位 |
| Root | `hoverOpenDelay` / `hoverCloseDelay` | `number` | `400 / 100` | 否 | 延迟 |
| Content / Arrow | `class`、`style` | 原生属性 | - | 否 | 样式合并 |

## 说明

Arrow 写入才显示。Content 与 Arrow 共用 `--tooltip-background`。内容不可交互；disabled 控件必须使用可聚焦 wrapper 作为 Trigger。受控模式由调用方回写 `open`。
