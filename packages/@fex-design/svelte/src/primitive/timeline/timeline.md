# Timeline

Stateless vertical and horizontal ordered-event primitives.

## Import and usage

```svelte
<script lang="ts">
  import Timeline from '@fex-design/svelte/primitive/timeline'
  import Item from '@fex-design/svelte/primitive/timeline-item'
  import Indicator from '@fex-design/svelte/primitive/timeline-indicator'
  import Content from '@fex-design/svelte/primitive/timeline-content'
</script>
<Timeline><Item status="completed"><Indicator /><Content>Completed</Content></Item></Timeline>
```

## Props

| Component | Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| Timeline | `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Axis direction. |
| Timeline | `align` | `'start' \| 'end' \| 'alternate'` | `'end'` | No | Default placement. |
| Timeline | `reverse` | `boolean` | `false` | No | Reverses visual order. |
| Item | `status` | built-in status or any string | `'default'` | No | Open status value. |
| Item | `connectorStatus` | status string | item status | No | Outgoing connector status. |
| Item | `placement` | `'start' \| 'end'` | root alignment | No | Per-item override. |

All parts accept native attributes, snippets, and caller classes. There are no events or controlled/uncontrolled values. Compose icons inside Indicator and arbitrary UI inside Content. Current items expose `aria-current="step"`; local sizing uses `--timeline-item-gap` and `--timeline-indicator-size`.
