import type { DndFeatureApi, TreeDropIntent } from '@fex/components-core/tree/features/dnd'
import type {
  TreeController,
  TreeKey,
  TreeNodeData,
} from '@fex/components-core/tree/types'
import { DND_DRAG_START_RECT_HEIGHT, DND_DRAG_START_RECT_WIDTH, DND_DRAG_START_RECT_X, DND_DRAG_START_RECT_Y, DND_DRAG_START_X, DND_DRAG_START_Y } from '@fex/components-core/interactions/dnd-store'
import { createMemo } from 'solid-js'
import { createDraggable } from '../../primitives/create-draggable'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import {
  createDroppable,
  type CreateDroppableEventArgs,
} from '../../primitives/create-droppable'
import { useTreeContext } from './tree-context'

export interface CreateTreeDndItemOptions<TNode extends TreeNodeData> {
  tree: TreeController<TNode>
  itemKey: TreeKey
  disabled?: boolean
}

export function createTreeDndItem<TNode extends TreeNodeData>({
  tree,
  itemKey,
  disabled = false,
}: CreateTreeDndItemOptions<TNode>) {
  const { indent } = useTreeContext<TNode>('createTreeDndItem')
  const feature = tree.getFeature<DndFeatureApi>('dnd')
  const activeIntent = feature
    ? createCoreStoreSignal<TreeDropIntent | null>({
      getSnapshot: feature.getActiveIntent,
      subscribe: feature.subscribeActiveIntent,
    })
    : () => null
  const item = tree.getItem(itemKey)
  const dropDisabled = disabled || item?.disabled === true || !feature
  const dragDisabled = dropDisabled || feature?.canDrag(itemKey) !== true
  let itemElement: HTMLElement | null = null

  type Args = CreateDroppableEventArgs<{ treeKey: TreeKey }>

  const resolve = (args: Pick<Args, 'source' | 'pointer' | 'targetRect'>) => {
    const sourceKey = getKey(args.source.treeKey)
    if (sourceKey === undefined) return undefined
    return feature?.resolve({
      sourceKey,
      targetKey: itemKey,
      pointer: args.pointer,
      dragRect: getDragRect(args.source, args.pointer),
      targetRect: args.targetRect,
      indent: indent(),
    })
  }
  const intent = () => {
    const next = activeIntent()
    return next?.targetKey === itemKey ? next : null
  }

  const drag = createDraggable({
    id: `tree:${String(itemKey)}`,
    type: 'tree-item',
    data: { treeKey: itemKey },
    disabled: dragDisabled,
    dragPreview: 'clone',
  })
  const drop = createDroppable<{ treeKey: TreeKey }>({
    id: `tree:${String(itemKey)}`,
    accept: 'tree-item',
    data: { treeKey: itemKey },
    disabled: dropDisabled,
    getPosition: ({ element, pointer, source }) => {
      const next = resolve({ source, pointer, targetRect: getRect(element) })
      if (!next?.valid) return null
      if (next.position === 'after') return 'bottom'
      return 'inside'
    },
    canDrop: (source) => {
      const key = getKey(source.treeKey)
      return key !== undefined && key !== itemKey && !tree.getPath(itemKey).includes(key)
    },
    onDragEnter: (args) => {
      const next = resolve(args)
      feature?.setActiveIntent(next?.valid ? next : null)
    },
    onDrag: (args) => {
      const next = resolve(args)
      feature?.setActiveIntent(next?.valid ? next : null)
    },
    onDragLeave: () => feature?.clearActiveIntent(itemKey),
    onDrop: (args) => {
      const next = resolve(args)
      feature?.clearActiveIntent(itemKey)
      if (next?.valid) feature?.drop(next)
    },
  })

  const setItemRef = (element: HTMLElement) => {
    itemElement = element
    drag.setTarget(element)
    drop.setTarget(element)
  }
  const itemProps = createMemo(() => ({
    ...drop.dataAttributes(),
    'data-dragging': drag.dragging() || undefined,
    'data-dnd-enabled': !dragDisabled || undefined,
    'data-drop-position': intent() ? (intent()!.position === 'after' ? 'bottom' : 'inside') : undefined,
    onPointerDown: drag.onPointerDown,
    style: intent() ? getDropIndicatorStyle(itemElement, intent()!.indicatorOffset) : undefined,
  }))

  return {
    dragging: drag.dragging,
    over: drop.over,
    edge: drop.edge,
    position: drop.position,
    intent,
    itemProps,
    setItemRef,
  }
}

function getKey(value: unknown): TreeKey | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

function getDragRect(source: Record<string, unknown>, pointer: { x: number; y: number }) {
  const startX = source[DND_DRAG_START_X]; const startY = source[DND_DRAG_START_Y]
  const x = source[DND_DRAG_START_RECT_X]; const y = source[DND_DRAG_START_RECT_Y]
  const width = source[DND_DRAG_START_RECT_WIDTH]; const height = source[DND_DRAG_START_RECT_HEIGHT]
  if (typeof startX !== 'number' || typeof startY !== 'number' || typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') return undefined
  return { x: x + pointer.x - startX, y: y + pointer.y - startY, width, height }
}

function getRect(element: HTMLElement) {
  const value = element.getBoundingClientRect()
  return {
    x: value.left,
    y: value.top,
    width: value.width,
    height: value.height,
  }
}

function getTreeTitleOffset(element: HTMLElement | null) {
  if (!element) return 0
  const title = element.querySelector<HTMLElement>('[data-slot="tree-title"]')
  return title ? title.getBoundingClientRect().left - element.getBoundingClientRect().left : 0
}

function getDropIndicatorStyle(element: HTMLElement | null, indicatorOffset: number) {
  if (!element) return undefined
  const itemRect = element.getBoundingClientRect()
  const treeRect = element.closest<HTMLElement>('[data-slot="tree"]')?.getBoundingClientRect()
  const left = getTreeTitleOffset(element) + indicatorOffset
  return {
    '--tree-drop-inline-start': `${left}px`,
    '--tree-drop-inline-width': `${Math.max(0, (treeRect?.right ?? itemRect.right) - itemRect.left - left)}px`,
  }
}
