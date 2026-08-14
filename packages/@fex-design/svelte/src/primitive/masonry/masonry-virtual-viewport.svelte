<script lang="ts" generics="T">
  import type { MasonryKey } from '@fex-design/core/masonry/types'
  import { resolveMasonryColumns, resolveMasonryGap } from '@fex-design/core/masonry/layout'
  import { masonryVirtualViewportClassName } from '@fex-design/styles/masonry'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { cn } from '@fex/utils'
  import { getContext, onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { get } from 'svelte/store'
  import { readableCoreStore } from '../../stores/core-store'
  import { masonryContextKey, type MasonryContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { items: readonly T[]; getItemKey: (item: T, index: number) => MasonryKey; estimateSize: (item: T, index: number) => number; height: number; overscan?: number; children?: Snippet<[T, number]> }
  let { items, getItemKey, estimateSize, height, overscan = 4, children, class: className, style, ...rest }: Props = $props()
  const context = getContext<MasonryContext>(masonryContextKey), snapshot = readableCoreStore(context.controller)
  let element = $state<HTMLDivElement>(), gap = $derived(resolveMasonryGap(context.options().gap)), columns = $derived(resolveMasonryColumns(context.options().columns, $snapshot.width, gap.column)), columnWidth = $derived(Math.max(0, ($snapshot.width - gap.column * (columns - 1)) / columns)), directionSign = $derived(context.options().direction === 'rtl' ? -1 : 1)
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({ count: items.length, getScrollElement: () => element ?? null, getItemKey: index => getItemKey(items[index] as T, index), estimateSize: index => estimateSize(items[index] as T, index), overscan, gap: gap.row, lanes: columns, laneAssignmentMode: 'measured' })
  function measure(node: HTMLDivElement) {
    get(virtualizer).measureElement(node)
    return { destroy: () => get(virtualizer).measureElement(null) }
  }
  onMount(() => { const update = () => get(virtualizer).setOptions({ count: items.length, getItemKey: index => getItemKey(items[index] as T, index), estimateSize: index => estimateSize(items[index] as T, index), overscan, gap: gap.row, lanes: columns, laneAssignmentMode: 'measured' }); update(); return context.controller.subscribe(update) })
</script>
<div {...rest} bind:this={element} data-slot="masonry-virtual-viewport" class={cn(masonryVirtualViewportClassName, className)} style:height={`${height}px`} {style}><div class="relative w-full" style:height={`${$virtualizer.getTotalSize()}px`}>{#each $virtualizer.getVirtualItems() as virtualItem (virtualItem.key)}<div use:measure data-index={virtualItem.index} data-column={virtualItem.lane} class="absolute start-0 top-0 min-w-0" style:width={`${columnWidth}px`} style:transform={`translate3d(${directionSign * (virtualItem.lane ?? 0) * (columnWidth + gap.column)}px, ${virtualItem.start}px, 0)`}>{@render children?.(items[virtualItem.index] as T, virtualItem.index)}</div>{/each}</div></div>
