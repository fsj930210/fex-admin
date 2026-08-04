# Timeline

Timeline presents ordered events on a vertical or horizontal axis. It is a stateless primitive: callers own ordering and business state.

## Import

```tsx
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex-design/react/primitive/timeline'
```

## Usage

```tsx
<Timeline orientation="vertical" align="alternate" aria-label="Release history">
  <TimelineItem status="completed">
    <TimelineOpposite>09:00</TimelineOpposite>
    <TimelineIndicator />
    <TimelineContent>Build completed</TimelineContent>
  </TimelineItem>
</Timeline>
```

## Props

### Timeline

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Axis direction. |
| `align` | `'start' \| 'end' \| 'alternate'` | `'end'` | No | Default content placement. |
| `reverse` | `boolean` | `false` | No | Reverses visual order. |

### TimelineItem

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | built-in status or any string | `'default'` | No | Sets the open `data-status` contract. |
| `connectorStatus` | built-in status or any string | item status | No | Styles the outgoing connector independently. |
| `placement` | `'start' \| 'end'` | root alignment | No | Overrides placement for one item. |

All primitives accept their native element attributes and merge caller classes. `TimelineIndicator`, `TimelineContent`, and `TimelineOpposite` have no component-specific props.

## Events and state

Timeline has no component events, controlled state, or uncontrolled state. Update the rendered items directly when application data changes.

## Custom composition

Place project icons inside `TimelineIndicator`, and compose cards, badges, links, or other content inside `TimelineContent`. Built-in statuses are `default`, `completed`, `current`, `pending`, `error`, and `disabled`; custom strings are forwarded unchanged. Decorative indicators are hidden from assistive technology, while a current item receives `aria-current="step"`.

## Notes

- Use `aria-label` when surrounding content does not name the timeline.
- Horizontal timelines may scroll when their minimum item widths exceed the container.
- Item spacing and indicator size can be customized with `--timeline-item-gap` and `--timeline-indicator-size`.
