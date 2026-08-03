# Timeline

Stateless vertical and horizontal ordered-event primitives.

## Import and usage

```tsx
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex/components-solid/primitive/timeline'

<Timeline align="alternate" aria-label="History"><TimelineItem status="completed"><TimelineOpposite>09:00</TimelineOpposite><TimelineIndicator /><TimelineContent>Completed</TimelineContent></TimelineItem></Timeline>
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

All parts accept native attributes and caller classes. There are no events or controlled/uncontrolled values. Icons and arbitrary nodes belong inside `TimelineIndicator`; arbitrary UI belongs inside `TimelineContent`. Current items expose `aria-current="step"`. Use `--timeline-item-gap` and `--timeline-indicator-size` for local sizing.
