# Tooltip

Tooltip 是 hover/focus 触发的非交互说明浮层，定位、翻转和箭头坐标来自共享 core。

## 导入与示例

```vue
<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-vue/primitive/tooltip'
</script>
<template><TooltipRoot><TooltipTrigger v-slot="trigger"><button v-bind="trigger.props" :ref="trigger.ref">Save</button></TooltipTrigger><TooltipPortal><TooltipContent>Save changes<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></template>
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| Root | `open` / `defaultOpen` | `boolean` | `- / false` | 否 | 受控状态与非受控初值 |
| Root | `placement` | `FloatingPlacement` | `top` | 否 | Floating 方位 |
| Root | `sideOffset` | `number` | `6` | 否 | 浮层距离 |
| Root | `hoverOpenDelay` / `hoverCloseDelay` | `number` | `400 / 100` | 否 | hover 延迟 |
| Root | `disabled` | `boolean` | `false` | 否 | 禁止触发 |
| Content / Arrow | `class`、`style` | 原生属性 | - | 否 | 合并用户样式 |

## 事件、状态与注意事项

`open-change` 返回下一状态和原因；传入 `open` 后由调用方回写。`TooltipArrow` 写入才显示，省略即无箭头。两者共用 `--tooltip-background`，例如 `class="[--tooltip-background:#2563eb]"`。Tooltip 内容不可交互；复杂内容使用 Popover。disabled 控件应放入可聚焦 wrapper，并把 slot props/ref 绑定到 wrapper。
