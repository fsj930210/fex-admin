# Timeline

Stateless vertical and horizontal ordered-event primitives.

## Import and usage

```vue
<script setup lang="ts">
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex-design/vue/primitive/timeline'
</script>
<template><Timeline align="alternate"><TimelineItem status="completed"><TimelineOpposite>09:00</TimelineOpposite><TimelineIndicator /><TimelineContent>Completed</TimelineContent></TimelineItem></Timeline></template>
```

## Props

| Component | Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| Timeline | `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Axis direction. |
| Timeline | `align` | `'start' \| 'end' \| 'alternate'` | `'end'` | No | Default placement. |
| Timeline | `reverse` | `boolean` | `false` | No | Reverses visual order. |
| TimelineItem | `status` | built-in status or any string | `'default'` | No | Open status value. |
| TimelineItem | `connectorStatus` | status string | item status | No | Outgoing connector status. |
| TimelineItem | `placement` | `'start' \| 'end'` | root alignment | No | Per-item override. |

All parts accept native attributes, slots, and caller classes. There are no emitted events or controlled/uncontrolled values. Place project icons in `TimelineIndicator` and arbitrary UI in `TimelineContent`. Current items expose `aria-current="step"`; local sizing uses `--timeline-item-gap` and `--timeline-indicator-size`.
