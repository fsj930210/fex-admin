<script lang="ts">
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { sortableContextKey, type SortableContext, type SortableOverlaySnippet } from './sortable-context'

  interface SortableOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
    class?: string
    children?: Snippet<SortableOverlaySnippet>
  }

  let { class: className, children, ...rest }: SortableOverlayProps = $props()
  const { sortable, snapshot, styleToString } = getContext<SortableContext>(sortableContextKey)
  const overlayStyle = $derived(styleToString((snapshot().motionVersion, sortable.getOverlayStyle())))
  const activeId = $derived(snapshot().activeId)
</script>

{#if activeId}
  <div
    {...rest}
    data-sortable-overlay
    class={cn(
      'rounded-md border border-border bg-card text-foreground opacity-100 shadow-xl ring-1 ring-border/70',
      className,
    )}
    style={overlayStyle}
  >
    {@render children?.({ activeId, style: overlayStyle })}
  </div>
{/if}
