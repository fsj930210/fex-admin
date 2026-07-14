<script lang="ts">
  import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
  import type { TreeKey, TreeNodeData, TreeVisibleItem } from '@fex/components-core/tree/types'
  import { cn } from '@fex/utils'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { getContext, onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { get } from 'svelte/store'
  import { readableCoreStore } from '../../stores/core-store'
  import { treeContextKey, type TreeContext } from './tree-context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    height: number
    overscan?: number
    children?: Snippet<[TreeVisibleItem<TreeNodeData>]>
  }

  let {
    height,
    overscan = 6,
    children,
    class: className,
    style,
    ...rest
  }: Props = $props()
  const { tree, rowHeight } = getContext<TreeContext>(treeContextKey)
  const items = readableCoreStore({
    getSnapshot: tree.getVisibleItems,
    subscribe: tree.subscribeVisible,
  })
  let element: HTMLDivElement
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: tree.getVisibleCount(),
    getScrollElement: () => element ?? null,
    estimateSize: rowHeight,
    overscan,
    getItemKey: (index) => tree.getVisibleItemAt(index)?.key ?? index,
  })

  // The subscription is the explicit core/TanStack boundary. Calling setOptions from a rune
  // effect would also subscribe to TanStack's writable store and form a feedback loop.
  onMount(() => {
    const updateVirtualizer = () => get(virtualizer).setOptions({
      count: tree.getVisibleCount(),
      overscan,
      getItemKey: (index) => tree.getVisibleItemAt(index)?.key ?? index,
    })
    updateVirtualizer()
    return tree.subscribeVisible(updateVirtualizer)
  })

  export function scrollToKey(
    key: TreeKey,
    options?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean },
  ) {
    if (options?.reveal) tree.getFeature<FocusFeatureApi>('focus')?.reveal(key)
    const index = tree.getVisibleIndex(key)
    if (index === undefined || index < 0) return false
    get(virtualizer).scrollToIndex(index, { align: options?.align ?? 'auto' })
    return true
  }
</script>

<div
  {...rest}
  bind:this={element}
  data-slot="tree-virtual-viewport"
  class={cn('overflow-auto', className)}
  style:height={`${height}px`}
  {style}
>
  <div class="relative w-full" style:height={`${$virtualizer.getTotalSize()}px`}>
    {#each $virtualizer.getVirtualItems() as virtualItem (virtualItem.key)}
      {@const item = $items[virtualItem.index]}
      {#if item}
        <div
          class="absolute left-0 w-full"
          style:height={`${virtualItem.size}px`}
          style:transform={`translateY(${virtualItem.start}px)`}
        >
          {@render children?.(item)}
        </div>
      {/if}
    {/each}
  </div>
</div>
