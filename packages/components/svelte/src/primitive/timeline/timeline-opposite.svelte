<script lang="ts">
  import { timelineOppositeClassName } from '@fex/components-styles/timeline'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(timelineOppositeClassName, className))
</script>

<div {...rest} data-slot="timeline-opposite" class={classList}>{@render children?.()}</div>
