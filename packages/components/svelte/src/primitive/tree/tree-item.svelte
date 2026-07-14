<script lang="ts">
  import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
  import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
  import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
  import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
  import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
  import type {
    TreeItem as CoreTreeItem,
    TreeKey,
    TreeNodeData,
  } from '@fex/components-core/tree/types'
  import { treeItemClassName } from '@fex/components-styles/tree'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { styleToString, treeContextKey, type TreeContext } from './tree-context'

  interface TreeItemState {
    item: CoreTreeItem<TreeNodeData>
    itemProps: HTMLAttributes<HTMLDivElement>
    expanded: boolean
    selected: boolean
    checked: boolean
    checkedState: boolean | 'indeterminate'
    focused: boolean
    loadState: string
    loadError: unknown
    actions: {
      expand(): void
      collapse(): void
      toggleExpanded(): void
      toggleSelected(): void
      toggleChecked(): void
    }
  }

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    itemKey: TreeKey
    block?: boolean
    children?: Snippet<[TreeItemState]>
  }

  let {
    itemKey,
    block = false,
    children,
    class: className,
    style,
    onclick,
    onfocus,
    ...rest
  }: Props = $props()

  const { tree, indent, rowHeight } = getContext<TreeContext>(treeContextKey)
  const snapshot = readableCoreStore({
    getSnapshot: tree.getSnapshot,
    subscribe: (listener) => tree.subscribeNode(itemKey, listener),
  })
  const actions = {
    expand: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.expand(itemKey),
    collapse: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.collapse(itemKey),
    toggleExpanded: () =>
      tree.getFeature<ExpansionFeatureApi>('expansion')?.toggle(itemKey),
    toggleSelected: () =>
      tree.getFeature<SelectionFeatureApi>('selection')?.toggle(itemKey),
    toggleChecked: () =>
      tree
        .getFeature<CheckFeatureApi>('check')
        ?.check(itemKey, !$snapshot.checkedKeys.includes(itemKey)),
  }

  const state = $derived.by(() => {
    const item = tree.getItem(itemKey)
    if (!item) return null

    const checkedState =
      tree.getFeature<CheckFeatureApi>('check')?.getState(itemKey) ?? false
    const asyncLoad = tree.getFeature<AsyncLoadFeatureApi>('async-load')
    const expanded = $snapshot.expandedKeys.includes(itemKey)
    const selected = $snapshot.selectedKeys.includes(itemKey)
    const checked = $snapshot.checkedKeys.includes(itemKey)
    const focused = $snapshot.focusedKey === itemKey
    const itemProps: HTMLAttributes<HTMLDivElement> = {
      ...rest,
      role: 'treeitem',
      tabindex: focused ? 0 : -1,
      'aria-level': item.depth + 1,
      'aria-expanded': item.isLeaf ? undefined : expanded,
      'aria-selected': selected || undefined,
      'aria-checked': checkedState === 'indeterminate' ? 'mixed' : checked || undefined,
      'aria-disabled': item.disabled || undefined,
      'aria-posinset': item.index + 1,
      'data-key': String(item.key),
      'data-selected': selected || undefined,
      'data-expanded': expanded || undefined,
      'data-checked': checked || undefined,
      'data-disabled': item.disabled || undefined,
      'data-leaf': item.isLeaf || undefined,
      'data-block': block || undefined,
      class: cn(treeItemClassName(), className),
      style:
        styleToString({
          height: `${rowHeight()}px`,
          marginInlineStart: `${item.depth * indent()}px`,
          paddingInlineStart: '4px',
          '--tree-item-inline-start': '4px',
        }) + (style ? `;${style}` : ''),
      onfocus: (event) => {
        onfocus?.(event)
        tree.getFeature<FocusFeatureApi>('focus')?.focus(item.key)
      },
      onclick: (event) => {
        onclick?.(event)
        if (!event.defaultPrevented && !item.disabled) actions.toggleSelected()
      },
    }

    return {
      item,
      itemProps,
      expanded,
      selected,
      checked,
      checkedState,
      focused,
      loadState: asyncLoad?.getState(itemKey) ?? 'unloaded',
      loadError: asyncLoad?.getError(itemKey),
      actions,
    }
  })
</script>

{#if state}
  {@render children?.(state)}
{/if}
