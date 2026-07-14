<script lang="ts">
  import type { TreeNodeData, TreeVisibleItem } from '@fex/components-core/tree/types'
  import { treeViewportClassName } from '@fex/components-styles/tree'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { treeContextKey, type TreeContext } from './tree-context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet<[TreeVisibleItem<TreeNodeData>]>
  }

  let { children, class: className, ...rest }: Props = $props()
  const { tree } = getContext<TreeContext>(treeContextKey)
  const items = readableCoreStore({
    getSnapshot: tree.getVisibleItems,
    subscribe: tree.subscribeVisible,
  })
</script>

<div {...rest} data-slot="tree-viewport" class={cn(treeViewportClassName, className)}>
  {#each $items as item (item.key)}
    {@render children?.(item)}
  {/each}
</div>
