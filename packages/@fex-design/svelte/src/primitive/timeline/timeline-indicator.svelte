<script lang="ts">
  import { timelineIndicatorClassName } from '@fex-design/styles/timeline'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(timelineIndicatorClassName, className))
</script>

<span {...rest} aria-hidden="true" data-slot="timeline-indicator" class={classList}>
  {@render children?.()}
</span>
