<script lang="ts">
  import { createMasonryController } from '@fex-design/core/masonry/create-masonry-controller'
  import type { MasonryControllerOptions } from '@fex-design/core/masonry/types'
  import { masonryRootClassName } from '@fex-design/styles/masonry'
  import { cn } from '@fex/utils'
  import { onMount, setContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { masonryContextKey, type MasonryContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dir'>, MasonryControllerOptions { children?: Snippet }
  let { columns, gap, placement, direction = 'ltr', onLayoutChange, children, class: className, ...rest }: Props = $props()
  const controller = createMasonryController({ columns, gap, placement, direction, onLayoutChange })
  let element = $state<HTMLDivElement>()
  $effect(() => controller.setOptions({ columns, gap, placement, direction, onLayoutChange }))
  setContext<MasonryContext>(masonryContextKey, { controller, options: () => ({ columns, gap, placement, direction, onLayoutChange }) })
  onMount(() => { const observer = new ResizeObserver(([entry]) => controller.setWidth(entry?.contentRect.width ?? 0)); if (element) observer.observe(element); return () => { observer.disconnect(); controller.destroy() } })
</script>
<div {...rest} bind:this={element} dir={direction} data-slot="masonry" class={cn(masonryRootClassName, className)}>{@render children?.()}</div>
