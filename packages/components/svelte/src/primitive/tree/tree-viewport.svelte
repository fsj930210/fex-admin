<script lang="ts" generics="TNode extends TreeNodeData">
  import type { TreeController, TreeNodeData, TreeVisibleItem } from '@fex/components-core/tree/types'
  import { treeViewportClassName } from '@fex/components-styles/tree'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet, untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { treeContextKey, type TreeContext } from './tree-context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    controller?: TreeController<TNode>
    children?: Snippet<[TreeVisibleItem<TNode>]>
  }

  let { controller, children, class: className, ...rest }: Props = $props()
  const context = getContext<TreeContext<TNode>>(treeContextKey)
  const tree = untrack(() => controller ?? context.tree)
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
