<script lang="ts">
  import { timelineClassName } from '@fex/components-styles/timeline'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type TimelineOrientation = 'vertical' | 'horizontal'
  export type TimelineAlign = 'start' | 'end' | 'alternate'

  interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'class'> {
    orientation?: TimelineOrientation
    align?: TimelineAlign
    reverse?: boolean
    class?: string
    children?: Snippet
  }

  let {
    orientation = 'vertical',
    align = 'end',
    reverse = false,
    class: className,
    children,
    ...rest
  }: TimelineProps = $props()

  const classList = $derived(cn(timelineClassName({ orientation, align, reverse }), className))
</script>

<ol
  {...rest}
  data-slot="timeline"
  data-orientation={orientation}
  data-align={align}
  data-reverse={reverse || undefined}
  class={classList}
>
  {@render children?.()}
</ol>
