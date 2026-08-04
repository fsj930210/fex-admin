<script lang="ts" module>
  export type TimelinePlacement = 'start' | 'end'
  export type TimelineBuiltinStatus =
    | 'default'
    | 'completed'
    | 'current'
    | 'pending'
    | 'error'
    | 'disabled'
  export type TimelineStatus = TimelineBuiltinStatus | (string & {})
</script>

<script lang="ts">
  import { timelineItemClassName } from '@fex-design/styles/timeline'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'class'> {
    status?: TimelineStatus
    connectorStatus?: TimelineStatus
    placement?: TimelinePlacement
    class?: string
    children?: Snippet
  }

  let {
    status = 'default',
    connectorStatus,
    placement,
    class: className,
    children,
    ...rest
  }: TimelineItemProps = $props()

  const classList = $derived(cn(timelineItemClassName, className))
</script>

<li
  {...rest}
  data-slot="timeline-item"
  data-status={status}
  data-connector-status={connectorStatus ?? status}
  data-placement={placement}
  aria-current={status === 'current' ? 'step' : undefined}
  class={classList}
>
  {@render children?.()}
</li>
