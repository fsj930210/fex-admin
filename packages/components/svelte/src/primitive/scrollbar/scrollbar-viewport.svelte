<script lang="ts">
  import { scrollbarViewportClassName } from '@fex/components-styles/scrollbar'; import { cn } from '@fex/utils'; import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends HTMLAttributes<HTMLDivElement> { children?: Snippet; overflowX?: 'auto' | 'hidden'; overflowY?: 'auto' | 'hidden' }
  let { children, overflowX = 'auto', overflowY = 'auto', class: className, ...rest }: Props = $props()
</script>
<div {...rest} data-slot="scrollbar-viewport" class={cn(scrollbarViewportClassName({ overflowX, overflowY }), className)}>{@render children?.()}</div>
