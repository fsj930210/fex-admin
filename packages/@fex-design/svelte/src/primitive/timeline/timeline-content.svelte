<script lang="ts">
  import { timelineContentClassName } from '@fex-design/styles/timeline'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(timelineContentClassName, className))
</script>

<div {...rest} data-slot="timeline-content" class={classList}>{@render children?.()}</div>
