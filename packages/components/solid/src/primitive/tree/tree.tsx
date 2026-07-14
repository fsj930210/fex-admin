import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
import type {
  TreeController,
  TreeItem as CoreTreeItem,
  TreeKey,
  TreeNodeData,
  TreeOptions,
  TreeVisibleItem,
} from '@fex/components-core/tree/types'
import {
  treeItemClassName,
  treeRootClassName,
  treeTitleClassName,
  treeTriggerClassName,
  treeViewportClassName,
} from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { createVirtualizer } from '@tanstack/solid-virtual'
import {
  createMemo,
  For,
  Show,
  splitProps,
  type Accessor,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { createTreeAdapter } from './create-tree'
import { createTreeItem } from './create-tree-item'
import { createTreeVisibleItems } from './create-tree-visible-items'
import { TreeContext, useTreeContext, type TreeContextValue } from './tree-context'

export interface TreeRootProps<TNode extends TreeNodeData>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  controller?: TreeController<TNode>
  options?: TreeOptions<TNode> | Accessor<TreeOptions<TNode>>
  indent?: number
  rowHeight?: number
  style?: JSX.CSSProperties
  children: JSX.Element | ((tree: TreeController<TNode>) => JSX.Element)
}

export function TreeRoot<TNode extends TreeNodeData>(props: TreeRootProps<TNode>) {
  const getOptions = () =>
    typeof props.options === 'function' ? props.options() : props.options
  const tree = createTreeAdapter(
    () => getOptions() ?? (props.controller ? undefined : { treeData: [] }),
    props.controller,
  )
  const [local, rootProps] = splitProps(props, [
    'controller',
    'options',
    'indent',
    'rowHeight',
    'class',
    'style',
    'children',
    'onKeyDown',
  ])
  const selection = () => tree.getFeature<SelectionFeatureApi>('selection')
  const indent = () => local.indent ?? 16
  const rowHeight = () => local.rowHeight ?? 32

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
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

  return (
    <TreeContext.Provider
      value={{ tree, indent, rowHeight } as TreeContextValue<TreeNodeData>}
    >
      <div
        {...rootProps}
        role="tree"
        data-slot="tree"
        tabIndex={0}
        aria-multiselectable={selection()?.isMultiple() || undefined}
        class={cn(treeRootClassName, local.class)}
        style={{ ...local.style, '--tree-indent': `${indent()}px` }}
        onKeyDown={handleKeyDown}
      >
        {typeof local.children === 'function' ? local.children(tree) : local.children}
      </div>
    </TreeContext.Provider>
  )
}

export interface TreeViewportProps<TNode extends TreeNodeData>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (item: TreeVisibleItem<TNode>) => JSX.Element
}

export function TreeViewport<TNode extends TreeNodeData>(
  props: TreeViewportProps<TNode>,
) {
  const [local, attrs] = splitProps(props, ['children', 'class'])
  const { tree } = useTreeContext<TNode>('TreeViewport')
  const items = createTreeVisibleItems(tree)

  return (
    <div {...attrs} data-slot="tree-viewport" class={cn(treeViewportClassName, local.class)}>
      <For each={items()}>{local.children}</For>
    </div>
  )
}

export interface TreeVirtualViewportHandle {
  scrollToKey(
    key: TreeKey,
    options?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean },
  ): boolean
}

export interface TreeVirtualViewportProps<TNode extends TreeNodeData>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'style' | 'ref'> {
  height: number
  overscan?: number
  style?: JSX.CSSProperties
  ref?: (handle: TreeVirtualViewportHandle) => void
  children: (item: TreeVisibleItem<TNode>) => JSX.Element
}

export function TreeVirtualViewport<TNode extends TreeNodeData>(
  props: TreeVirtualViewportProps<TNode>,
) {
  const [local, attrs] = splitProps(props, [
    'height',
    'overscan',
    'style',
    'ref',
    'children',
    'class',
  ])
  const { tree, rowHeight } = useTreeContext<TNode>('TreeVirtualViewport')
  const items = createTreeVisibleItems(tree)
  let scrollElement: HTMLDivElement | undefined
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    get count() {
      return items().length
    },
    getScrollElement: () => scrollElement ?? null,
    estimateSize: rowHeight,
    get overscan() {
      return local.overscan ?? 6
    },
    getItemKey: (index) => items()[index]?.key ?? index,
  })
  const handle: TreeVirtualViewportHandle = {
    scrollToKey(key, options) {
      if (options?.reveal) tree.getFeature<FocusFeatureApi>('focus')?.reveal(key)
      const index = tree.getVisibleIndex(key)
      if (index === undefined || index < 0) return false
      virtualizer.scrollToIndex(index, { align: options?.align ?? 'auto' })
      return true
    },
  }
  local.ref?.(handle)

  return (
    <div
      {...attrs}
      ref={scrollElement}
      data-slot="tree-virtual-viewport"
      class={cn('overflow-auto', local.class)}
      style={{ ...local.style, height: `${local.height}px` }}
    >
      <div class="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <For each={virtualizer.getVirtualItems()}>
          {(virtualItem) => {
            const item = () => items()[virtualItem.index]
            return (
              <Show when={item()}>
                {(current) => (
                  <div
                    class="absolute left-0 w-full"
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    {local.children(current())}
                  </div>
                )}
              </Show>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export interface TreeItemState<TNode extends TreeNodeData> {
  item: CoreTreeItem<TNode>
  itemProps: JSX.HTMLAttributes<HTMLDivElement>
  expanded: boolean
  selected: boolean
  checked: boolean
  checkedState: boolean | 'indeterminate'
  focused: boolean
  loadState: 'unloaded' | 'loading' | 'loaded' | 'error'
  loadError: unknown
  actions: {
    expand(): void
    collapse(): void
    toggleExpanded(): void
    toggleSelected(): void
    toggleChecked(): void
  }
}

export interface TreeItemProps<TNode extends TreeNodeData>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  itemKey: TreeKey
  block?: boolean
  style?: JSX.CSSProperties
  children: JSX.Element | ((state: TreeItemState<TNode>) => JSX.Element)
}

export function TreeItem<TNode extends TreeNodeData>(props: TreeItemProps<TNode>) {
  const [local, attrs] = splitProps(props, [
    'itemKey',
    'block',
    'children',
    'class',
    'style',
    'onClick',
    'onFocus',
  ])
  const { tree, indent, rowHeight } = useTreeContext<TNode>('TreeItem')
  const state = createTreeItem(tree, local.itemKey)
  const actions = {
    expand: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.expand(local.itemKey),
    collapse: () =>
      tree.getFeature<ExpansionFeatureApi>('expansion')?.collapse(local.itemKey),
    toggleExpanded: () =>
      tree.getFeature<ExpansionFeatureApi>('expansion')?.toggle(local.itemKey),
    toggleSelected: () =>
      tree.getFeature<SelectionFeatureApi>('selection')?.toggle(local.itemKey),
    toggleChecked: () =>
      tree
        .getFeature<CheckFeatureApi>('check')
        ?.check(local.itemKey, !state().checked),
  }
  const renderState = createMemo<TreeItemState<TNode> | undefined>(() => {
    const item = state().item
    if (!item) return undefined
    const itemProps: JSX.HTMLAttributes<HTMLDivElement> = {
      ...attrs,
      role: 'treeitem',
      tabIndex: state().focused ? 0 : -1,
      'aria-level': item.depth + 1,
      'aria-expanded': item.isLeaf ? undefined : state().expanded,
      'aria-selected': state().selected || undefined,
      'aria-checked':
        state().checkedState === 'indeterminate' ? 'mixed' : state().checked || undefined,
      'aria-disabled': item.disabled || undefined,
      'aria-posinset': item.index + 1,
      'data-key': String(item.key),
      'data-selected': state().selected || undefined,
      'data-expanded': state().expanded || undefined,
      'data-checked': state().checked || undefined,
      'data-disabled': item.disabled || undefined,
      'data-leaf': item.isLeaf || undefined,
      'data-block': local.block || undefined,
      class: cn(treeItemClassName(), local.class),
      style: {
        ...local.style,
        height: `${rowHeight()}px`,
        'margin-inline-start': `${item.depth * indent()}px`,
        'padding-inline-start': '4px',
        '--tree-item-inline-start': '4px',
      },
      onFocus: (event) => {
        if (typeof local.onFocus === 'function') local.onFocus(event)
        tree.getFeature<FocusFeatureApi>('focus')?.focus(item.key)
      },
      onClick: (event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (!event.defaultPrevented && !item.disabled) actions.toggleSelected()
      },
    }
    return { ...state(), item, itemProps, actions }
  })

  return (
    <Show when={renderState()} keyed>
      {(current) =>
        typeof local.children === 'function' ? (
          local.children(current)
        ) : (
          <div {...current.itemProps}>{local.children}</div>
        )
      }
    </Show>
  )
}

export interface TreeTriggerProps<TNode extends TreeNodeData>
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  itemKey: TreeKey
}

export function TreeTrigger<TNode extends TreeNodeData>(
  props: TreeTriggerProps<TNode>,
) {
  const [local, attrs] = splitProps(props, ['itemKey', 'class', 'children', 'onClick'])
  const { tree } = useTreeContext<TNode>('TreeTrigger')
  const state = createTreeItem(tree, local.itemKey)
  const expansion = () => tree.getFeature<ExpansionFeatureApi>('expansion')
  const click: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    event.stopPropagation()
    if (typeof local.onClick === 'function') local.onClick(event)
    if (event.defaultPrevented) return
    if (state().expanded) {
      expansion()?.collapse(local.itemKey)
      return
    }
    const loading = tree.getFeature<AsyncLoadFeatureApi>('async-load')?.load(local.itemKey)
    if (!loading) {
      expansion()?.expand(local.itemKey)
      return
    }
    void loading.then((result) => {
      if ((result as { ok?: boolean } | undefined)?.ok) expansion()?.expand(local.itemKey)
    })
  }

  return (
    <Show
      when={state().item && !state().item?.isLeaf && expansion()}
      fallback={<span aria-hidden="true" data-slot="tree-trigger-placeholder" class="size-5 shrink-0" />}
    >
      <button
        {...attrs}
        type="button"
        data-slot="tree-trigger"
        aria-expanded={state().expanded}
        class={cn(treeTriggerClassName, local.class)}
        onClick={click}
      >
        {local.children ?? (
          <svg
            aria-hidden="true"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </button>
    </Show>
  )
}

export function TreeTitle(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  const [local, attrs] = splitProps(props, ['class', 'children'])
  return (
    <span {...attrs} data-slot="tree-title" class={cn(treeTitleClassName, local.class)}>
      {local.children}
    </span>
  )
}

export { createTree } from './create-tree'
export { createTreeItem } from './create-tree-item'
export { createTreeVisibleItems } from './create-tree-visible-items'
export { useTreeContext } from './tree-context'
export type {
  TreeController,
  TreeKey,
  TreeNodeData,
  TreeOptions,
  TreeVisibleItem,
} from '@fex/components-core/tree/types'
