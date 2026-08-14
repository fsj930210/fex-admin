<script lang="ts">
  import type { MasonryKey } from '@fex-design/core/masonry/types'
  import { masonryItemClassName } from '@fex-design/styles/masonry'
  import { cn } from '@fex/utils'
  import { getContext, onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { masonryContextKey, type MasonryContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { itemKey: MasonryKey; index: number; column?: number; children?: Snippet }
  let { itemKey, index, column, children, class: className, style, ...rest }: Props = $props()
  const { controller } = getContext<MasonryContext>(masonryContextKey), snapshot = readableCoreStore(controller)
  let element = $state<HTMLDivElement>(), position = $derived($snapshot.items.find(item => item.key === itemKey))
  function commit(height: number) { controller.setItem({ key: itemKey, index, column, height }) }
  $effect(() => { index; column; if (element) commit(element.getBoundingClientRect().height) })
  onMount(() => { const observer = new ResizeObserver(([entry]) => commit(entry?.borderBoxSize[0]?.blockSize ?? entry?.contentRect.height ?? 0)); if (element) { observer.observe(element); commit(element.getBoundingClientRect().height) } return () => { observer.disconnect(); controller.removeItem(itemKey) } })
</script>
<div {...rest} bind:this={element} data-slot="masonry-item" data-column={position?.column} class={cn(masonryItemClassName, className)} style:visibility={position ? undefined : 'hidden'} style:--masonry-inline-start={`${position?.inlineStart ?? 0}px`} style:--masonry-top={`${position?.top ?? 0}px`} style:--masonry-item-width={`${position?.width ?? $snapshot.columnWidth}px`} {style}>{@render children?.()}</div>
