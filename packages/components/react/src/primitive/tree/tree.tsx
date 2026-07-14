import type {
  TreeController,
  TreeItem as CoreTreeItem,
  TreeKey,
  TreeNodeData,
  TreeOptions,
  TreeVisibleItem,
} from '@fex/components-core/tree/types'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { TreeDropIntent } from '@fex/components-core/tree/features/dnd'
import {
  treeItemClassName,
  treeDropIndicatorClassName,
  treeRootClassName,
  treeTitleClassName,
  treeTriggerClassName,
  treeViewportClassName,
} from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { ChevronDownIcon } from '../../icon/chevron'
import { TreeContext, useTreeContext, type TreeContextValue } from './tree-context'
import { useTreeController } from './use-tree'
import { useTreeItem, type TreeItemState } from './use-tree-item'
import { useTreeVisibleItems } from './use-tree-visible-items'
import {
  useRef,
  useImperativeHandle,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export type { TreeController, TreeKey, TreeNodeData, TreeOptions, TreeVisibleItem } from '@fex/components-core/tree/types'
export { useTreeContext } from './tree-context'
export { useTree } from './use-tree'
export { useTreeItem, type TreeItemState } from './use-tree-item'
export { useTreeVisibleItems } from './use-tree-visible-items'

export interface TreeRootProps<TNode extends TreeNodeData>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  controller?: TreeController<TNode> | undefined
  options?: TreeOptions<TNode> | undefined
  indent?: number | undefined
  rowHeight?: number | undefined
  ref?: Ref<HTMLDivElement> | undefined
  children: ReactNode | ((tree: TreeController<TNode>) => ReactNode)
}

function TreeRootWithController<TNode extends TreeNodeData>({
  controller,
  indent = 16,
  rowHeight = 32,
  className,
  style,
  ref,
  children,
  onKeyDown,
  ...props
}: Omit<TreeRootProps<TNode>, 'options'> & { controller: TreeController<TNode> }) {
  const selection = controller.getFeature<SelectionFeatureApi>('selection')
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing || !controller.hasFeature('keyboard')) return
    const target = event.target
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
    const visibleItems = controller.getVisibleItems()
    const expansion = controller.getFeature<ExpansionFeatureApi>('expansion')
    const check = controller.getFeature<CheckFeatureApi>('check')
    const focus = controller.getFeature<FocusFeatureApi>('focus')
    const focusedIndex = visibleItems.findIndex((item) => item.key === controller.getSnapshot().focusedKey)
    const focusedItem = focusedIndex >= 0 ? visibleItems[focusedIndex] : undefined
    const focusAt = (index: number) => focus?.focus(visibleItems[index]?.key ?? null)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusAt(Math.min(focusedIndex + 1, visibleItems.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusAt(Math.max(focusedIndex - 1, 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusAt(visibleItems.length - 1)
    } else if (event.key === 'ArrowRight' && focusedItem) {
      event.preventDefault()
      if (!focusedItem.isLeaf && !controller.getSnapshot().expandedKeys.includes(focusedItem.key)) {
        expansion?.expand(focusedItem.key)
      } else {
        focus?.focus(controller.getVisibleItemAt(focusedIndex + 1)?.key ?? focusedItem.key)
      }
    } else if (event.key === 'ArrowLeft' && focusedItem) {
      event.preventDefault()
      if (controller.getSnapshot().expandedKeys.includes(focusedItem.key)) {
        expansion?.collapse(focusedItem.key)
      } else {
        focus?.focus(focusedItem.parentKey)
      }
    } else if (event.key === 'Enter' && focusedItem) {
      selection?.toggle(focusedItem.key)
    } else if (event.key === ' ' && focusedItem) {
      event.preventDefault()
      check?.check(focusedItem.key, !controller.getSnapshot().checkedKeys.includes(focusedItem.key))
    }
  }

  return (
    <TreeContext value={{ tree: controller, indent, rowHeight } as TreeContextValue}>
      <div
        {...props}
        ref={ref}
        data-slot="tree"
        role="tree"
        tabIndex={0}
        aria-multiselectable={selection?.isMultiple() || undefined}
        className={cn(treeRootClassName, className)}
        style={{ ...style, '--tree-indent': `${indent}px` } as CSSProperties}
        onKeyDown={handleKeyDown}
      >
        {typeof children === 'function' ? children(controller) : children}
      </div>
    </TreeContext>
  )
}

export function TreeRoot<TNode extends TreeNodeData>(props: TreeRootProps<TNode>) {
  const controller = useTreeController(
    props.options ?? (props.controller ? undefined : ({ treeData: [] } as TreeOptions<TNode>)),
    props.controller,
  )
  const { options: _options, controller: _controller, ...rootProps } = props
  return <TreeRootWithController {...rootProps} controller={controller} />
}

export interface TreeViewportProps<TNode extends TreeNodeData>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (item: TreeVisibleItem<TNode>) => ReactNode
}

export function TreeViewport<TNode extends TreeNodeData>({ children, className, ...props }: TreeViewportProps<TNode>) {
  const { tree } = useTreeContext<TNode>()
  const items = useTreeVisibleItems(tree)
  return (
    <div {...props} data-slot="tree-viewport" className={cn(treeViewportClassName, className)}>
      {items.map((item) => children(item))}
    </div>
  )
}

export interface TreeVirtualViewportProps<TNode extends TreeNodeData>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  height: number
  overscan?: number | undefined
  ref?: Ref<TreeVirtualViewportHandle> | undefined
  children: (item: TreeVisibleItem<TNode>) => ReactNode
}

export interface TreeVirtualViewportHandle {
  scrollToKey(
    key: TreeKey,
    options?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean },
  ): boolean
}

export function TreeVirtualViewport<TNode extends TreeNodeData>({
  height,
  overscan = 6,
  children,
  className,
  style,
  ref,
  ...props
}: TreeVirtualViewportProps<TNode>) {
  const { tree, rowHeight } = useTreeContext<TNode>()
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const items = useTreeVisibleItems(tree)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => rowHeight,
    overscan,
  })

  useImperativeHandle(ref, () => ({
    scrollToKey(key, options) {
      if (options?.reveal) tree.getFeature<FocusFeatureApi>('focus')?.reveal(key)
      const visibleIndex = tree.getVisibleIndex(key)
      if (visibleIndex === undefined || visibleIndex < 0) return false
      virtualizer.scrollToIndex(visibleIndex, { align: options?.align ?? 'auto' })
      return true
    },
  }), [tree, virtualizer])

  return (
    <div
      {...props}
      ref={scrollElementRef}
      data-slot="tree-virtual-viewport"
      className={cn('overflow-auto', className)}
      style={{ ...style, height }}
    >
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
          if (!item) return null
          return (
            <div
              key={item.key}
              className="absolute left-0 w-full"
              style={{ height: virtualItem.size, transform: `translateY(${virtualItem.start}px)` }}
            >
              {children(item)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type TreeItemDomProps = HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string | boolean | undefined>

export interface TreeItemRenderState<TNode extends TreeNodeData> extends TreeItemState<TNode> {
  item: CoreTreeItem<TNode>
  itemProps: TreeItemDomProps
  actions: {
    expand(): void
    collapse(): void
    toggleExpanded(): void
    toggleSelected(): void
    toggleChecked(): void
  }
}

export interface TreeItemProps<TNode extends TreeNodeData>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  itemKey: TreeKey
  /** Makes the selectable title fill the remaining row after leading tree controls. */
  block?: boolean | undefined
  children: ReactNode | ((state: TreeItemRenderState<TNode>) => ReactNode)
}

export function TreeItem<TNode extends TreeNodeData>({
  itemKey,
  block = false,
  children,
  className,
  style,
  onClick,
  ...props
}: TreeItemProps<TNode>) {
  const { tree, indent, rowHeight } = useTreeContext<TNode>()
  const state = useTreeItem(tree, itemKey)
  if (!state.item) return null
  const item = state.item
  const itemProps: TreeItemDomProps = {
    ...props,
    role: 'treeitem',
    tabIndex: state.focused ? 0 : -1,
    'aria-level': item.depth + 1,
    'aria-expanded': item.isLeaf ? undefined : state.expanded,
    'aria-selected': state.selected || undefined,
    'aria-checked': state.checked || undefined,
    'aria-disabled': item.disabled || undefined,
    'aria-posinset': item.index + 1,
    'data-key': String(item.key),
    'data-selected': state.selected || undefined,
    'data-expanded': state.expanded || undefined,
    'data-checked': state.checked || undefined,
    'data-disabled': item.disabled || undefined,
    'data-leaf': item.isLeaf || undefined,
    'data-block': block || undefined,
    className: cn(treeItemClassName(), className),
    style: {
      ...style,
      height: rowHeight,
      marginInlineStart: item.depth * indent,
      paddingInlineStart: 4,
      '--tree-item-inline-start': '4px',
    } as CSSProperties,
    onFocus: () => tree.getFeature<FocusFeatureApi>('focus')?.focus(item.key),
    onClick: (event) => {
      onClick?.(event)
      if (!event.defaultPrevented && !item.disabled) tree.getFeature<SelectionFeatureApi>('selection')?.toggle(item.key)
    },
  }
  const renderState: TreeItemRenderState<TNode> = {
    ...state,
    item,
    itemProps,
    actions: {
      expand: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.expand(item.key),
      collapse: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.collapse(item.key),
      toggleExpanded: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.toggle(item.key),
      toggleSelected: () => tree.getFeature<SelectionFeatureApi>('selection')?.toggle(item.key),
      toggleChecked: () => tree.getFeature<CheckFeatureApi>('check')?.check(item.key, !state.checked),
    },
  }
  return typeof children === 'function' ? children(renderState) : <div {...itemProps}>{children}</div>
}

export interface TreeTriggerProps<TNode extends TreeNodeData> extends ButtonHTMLAttributes<HTMLButtonElement> {
  itemKey: TreeKey
}

export function TreeTrigger<TNode extends TreeNodeData>({ itemKey, className, onClick, children, ...props }: TreeTriggerProps<TNode>) {
  const { tree } = useTreeContext<TNode>()
  const state = useTreeItem(tree, itemKey)
  const expansion = tree.getFeature<ExpansionFeatureApi>('expansion')
  if (!state.item || state.item.isLeaf || !expansion) {
    return <span aria-hidden="true" data-slot="tree-trigger-placeholder" className="size-5 shrink-0" />
  }
  return (
    <button
      {...props}
      type="button"
      data-slot="tree-trigger"
      aria-expanded={state.expanded}
      className={cn(treeTriggerClassName, className)}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(event)
        if (!event.defaultPrevented) {
          if (state.expanded) {
            expansion.collapse(itemKey)
            return
          }
          const loading = tree.getFeature<AsyncLoadFeatureApi>('async-load')?.load(itemKey)
          if (!loading) {
            expansion.expand(itemKey)
            return
          }
          void loading.then((result) => {
            if ((result as { ok?: boolean } | undefined)?.ok) expansion.expand(itemKey)
          })
        }
      }}
    >
      {children ?? <ChevronDownIcon className="size-4" />}
    </button>
  )
}

export interface TreeTitleProps extends HTMLAttributes<HTMLSpanElement> {}

export function TreeTitle({ className, ...props }: TreeTitleProps) {
  return <span {...props} data-slot="tree-title" className={cn(treeTitleClassName, className)} />
}

export interface TreeDropIndicatorProps<TNode extends TreeNodeData>
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  item?: CoreTreeItem<TNode> | undefined
  intent?: TreeDropIntent | null | undefined
}

/** Renders the single active DnD insertion line for a custom tree row. */
export function TreeDropIndicator<TNode extends TreeNodeData>({
  item,
  intent,
  className,
  style,
  ...props
}: TreeDropIndicatorProps<TNode>) {
  const { indent } = useTreeContext<TNode>()
  if (!intent?.valid || (item && intent.targetKey !== item.key)) return null
  return (
    <span
      {...props}
      data-slot="tree-drop-indicator"
      data-position={intent.position}
      className={cn(treeDropIndicatorClassName, className)}
      style={{ left: intent.position === 'inside' ? indent : 4, bottom: 0, transform: 'translateY(1px)', ...style }}
    />
  )
}
