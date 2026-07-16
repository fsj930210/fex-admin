<script lang="ts" generics="TNode extends TreeNodeData">
  import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
  import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
  import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
  import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
  import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
  import type {
    TreeController,
    TreeNodeData,
    TreeOptions,
  } from '@fex/components-core/tree/types'
  import { treeRootClassName } from '@fex/components-styles/tree'
  import { cn } from '@fex/utils'
  import { setContext, type Snippet, untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { treeContextKey, type TreeContext } from './tree-context'

  interface Props<TNode extends TreeNodeData>
    extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    controller?: TreeController<TNode>
    options?: TreeOptions<TNode>
    indent?: number
    rowHeight?: number
    children?: Snippet<[TreeController<TNode>]>
  }

  let {
    controller: externalController,
    options,
    indent = 16,
    rowHeight = 32,
    children,
    class: className,
    style,
    onkeydown,
    ...rest
  }: Props<TNode> = $props()

  const tree = untrack(() => externalController ?? createTreeController(options ?? { treeData: [] }))

  // This effect only synchronizes component inputs to the external core controller.
  // User interactions call controller actions directly instead of watching state changes.
  $effect(() => {
    if (options) tree.updateOptions(options)
  })

  setContext<TreeContext<TNode>>(treeContextKey, {
    tree,
    indent: () => indent,
    rowHeight: () => rowHeight,
  })

  const selection = () => tree.getFeature<SelectionFeatureApi>('selection')

  function keydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    onkeydown?.(event)
    if (event.defaultPrevented || event.isComposing || !tree.hasFeature('keyboard')) return
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    const items = tree.getVisibleItems()
    const expansion = tree.getFeature<ExpansionFeatureApi>('expansion')
    const check = tree.getFeature<CheckFeatureApi>('check')
    const focus = tree.getFeature<FocusFeatureApi>('focus')
    const index = items.findIndex((item) => item.key === tree.getSnapshot().focusedKey)
    const item = index >= 0 ? items[index] : undefined
    const focusAt = (next: number) => focus?.focus(items[next]?.key ?? null)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusAt(Math.min(index + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusAt(Math.max(index - 1, 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusAt(items.length - 1)
    } else if (event.key === 'ArrowRight' && item) {
      event.preventDefault()
      if (!item.isLeaf && !tree.getSnapshot().expandedKeys.includes(item.key)) {
        expansion?.expand(item.key)
      } else {
        focus?.focus(tree.getVisibleItemAt(index + 1)?.key ?? item.key)
      }
    } else if (event.key === 'ArrowLeft' && item) {
      event.preventDefault()
      if (tree.getSnapshot().expandedKeys.includes(item.key)) {
        expansion?.collapse(item.key)
      } else {
        focus?.focus(item.parentKey)
      }
    } else if (event.key === 'Enter' && item) {
      selection()?.toggle(item.key)
    } else if (event.key === ' ' && item) {
      event.preventDefault()
      check?.check(item.key, !tree.getSnapshot().checkedKeys.includes(item.key))
    }
  }
</script>

<div
  {...rest}
  role="tree"
  data-slot="tree"
  tabindex="0"
  aria-multiselectable={selection()?.isMultiple() || undefined}
  class={cn(treeRootClassName, className)}
  style={`--tree-indent:${indent}px;${style ?? ''}`}
  onkeydown={keydown}
>
  {@render children?.(tree)}
</div>
