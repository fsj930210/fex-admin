# Timeline

Stateless vertical and horizontal ordered-event primitives.

## Import and usage

```ts
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex-design/angular/primitive/timeline'
```

```html
<fex-timeline><fex-timeline-item status="completed"><fex-timeline-indicator /><fex-timeline-content>Completed</fex-timeline-content></fex-timeline-item></fex-timeline>
```

## Inputs

| Component | Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| Timeline | `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Axis direction. |
| Timeline | `align` | `'start' \| 'end' \| 'alternate'` | `'end'` | No | Default placement. |
| Timeline | `reverse` | `boolean` | `false` | No | Reverses visual order. |
| TimelineItem | `status` | built-in status or any string | `'default'` | No | Open status value. |
| TimelineItem | `connectorStatus` | status string | item status | No | Outgoing connector status. |
| TimelineItem | `placement` | `'start' \| 'end'` | root alignment | No | Per-item override. |

There are no outputs or controlled/uncontrolled values. Host classes are merged automatically. Project icons can be projected into the indicator and arbitrary components into content. Current items expose `aria-current="step"`; local sizing uses `--timeline-item-gap` and `--timeline-indicator-size`.
