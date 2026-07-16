import type { DndFeatureApi, TreeDropIntent } from '@fex/components-core/tree/features/dnd'
import type { TreeController, TreeKey, TreeNodeData } from '@fex/components-core/tree/types'
import {
  DND_DRAG_START_RECT_HEIGHT,
  DND_DRAG_START_RECT_WIDTH,
  DND_DRAG_START_RECT_X,
  DND_DRAG_START_RECT_Y,
  DND_DRAG_START_X,
  DND_DRAG_START_Y,
} from '@fex/components-core/interactions/dnd-store'
import { computed } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { useDraggable } from '../../composables/use-draggable'
import { useDroppable, type UseDroppableEventArgs } from '../../composables/use-droppable'
import { useTreeContext } from './context'

export function useTreeDndItem<TNode extends TreeNodeData>({
  tree,
  itemKey,
  disabled = false,
}: {
  tree: TreeController<TNode>
  itemKey: TreeKey
  disabled?: boolean
}) {
  const { indent } = useTreeContext<TNode>('useTreeDndItem')
  const feature = tree.getFeature<DndFeatureApi>('dnd')
  const activeIntentSnapshot = feature
    ? useCoreStore<TreeDropIntent | null>({
        getSnapshot: feature.getActiveIntent,
        subscribe: feature.subscribeActiveIntent,
      })
    : undefined
  const activeIntent = computed(() => {
    const intent = activeIntentSnapshot?.value ?? null
    return intent?.targetKey === itemKey ? intent : null
  })
  const item = tree.getItem(itemKey)
  const dropDisabled = disabled || item?.disabled === true || !feature
  const dragDisabled = dropDisabled || feature?.canDrag(itemKey) !== true
  let itemElement: HTMLElement | null = null
  type DropArgs = UseDroppableEventArgs<{ treeKey: TreeKey }>
  const resolveIntent = (args: Pick<DropArgs, 'source' | 'pointer' | 'targetRect'>) => {
    const sourceKey = getTreeKey(args.source.treeKey)
    if (sourceKey === undefined) return undefined
    return feature?.resolve({
      sourceKey,
      targetKey: itemKey,
      pointer: args.pointer,
      dragRect: getDragRect(args.source, args.pointer),
      targetRect: args.targetRect,
      indent: indent.value,
    })
  }
  const drag = useDraggable({
    id: `tree:${String(itemKey)}`,
    type: 'tree-item',
    data: { treeKey: itemKey },
    disabled: dragDisabled,
    dragPreview: 'clone',
  })
  const drop = useDroppable<{ treeKey: TreeKey }>({
    id: `tree:${String(itemKey)}`,
    accept: 'tree-item',
    data: { treeKey: itemKey },
    disabled: dropDisabled,
    getPosition: ({ element, pointer, source }) => {
      const intent = resolveIntent({ source, pointer, targetRect: getElementRect(element) })
      if (!intent?.valid) return null
      return intent.position === 'after' ? 'bottom' : 'inside'
    },
    canDrop: (source) => {
      const sourceKey = getTreeKey(source.treeKey)
      return (
        sourceKey !== undefined &&
        sourceKey !== itemKey &&
        !tree.getPath(itemKey).includes(sourceKey)
      )
    },
    onDragEnter: (args) => {
      const intent = resolveIntent(args)
      feature?.setActiveIntent(intent?.valid ? intent : null)
    },
    onDrag: (args) => {
      const intent = resolveIntent(args)
      feature?.setActiveIntent(intent?.valid ? intent : null)
    },
    onDragLeave: () => feature?.clearActiveIntent(itemKey),
    onDrop: (args) => {
      const intent = resolveIntent(args)
      feature?.clearActiveIntent(itemKey)
      if (intent?.valid) feature?.drop(intent)
    },
  })
  const setItemRef = (element: Element | null) => {
    const htmlElement = element instanceof HTMLElement ? element : null
    itemElement = htmlElement
    drag.setTarget(htmlElement)
    drop.setTarget(htmlElement)
  }
  const itemProps = computed(() => ({
    ...drop.dataAttributes.value,
    'data-dragging': drag.dragging.value || undefined,
    'data-dnd-enabled': !dragDisabled || undefined,
    'data-drop-position': activeIntent.value
      ? activeIntent.value.position === 'after'
        ? 'bottom'
        : 'inside'
      : undefined,
    style: activeIntent.value
      ? getDropIndicatorStyle(itemElement, activeIntent.value.indicatorOffset)
      : undefined,
  }))
  return {
    dragging: drag.dragging,
    over: drop.over,
    edge: drop.edge,
    position: drop.position,
    intent: activeIntent,
    itemProps,
    setItemRef,
  }
}

function getTreeKey(value: unknown): TreeKey | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}
function getDragRect(source: Record<string, unknown>, pointer: { x: number; y: number }) {
  const startX = source[DND_DRAG_START_X]
  const startY = source[DND_DRAG_START_Y]
  const x = source[DND_DRAG_START_RECT_X]
  const y = source[DND_DRAG_START_RECT_Y]
  const width = source[DND_DRAG_START_RECT_WIDTH]
  const height = source[DND_DRAG_START_RECT_HEIGHT]
  if (
    typeof startX !== 'number' ||
    typeof startY !== 'number' ||
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
  )
    return undefined
  return { x: x + pointer.x - startX, y: y + pointer.y - startY, width, height }
}
function getElementRect(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
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
