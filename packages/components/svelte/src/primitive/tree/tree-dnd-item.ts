import type {
  DndFeatureApi,
  TreeDropIntent,
} from '@fex/components-core/tree/features/dnd'
import type {
  TreeController,
  TreeKey,
  TreeNodeData,
} from '@fex/components-core/tree/types'
import { DND_DRAG_START_RECT_HEIGHT, DND_DRAG_START_RECT_WIDTH, DND_DRAG_START_RECT_X, DND_DRAG_START_RECT_Y, DND_DRAG_START_X, DND_DRAG_START_Y } from '@fex/components-core/interactions/dnd-store'
import { draggableAction } from '../../actions/draggable'
import {
  droppableAction,
  type DroppableEventArgs,
} from '../../actions/droppable'

export interface TreeDndItemOptions<TNode extends TreeNodeData> {
  tree: TreeController<TNode>
  itemKey: TreeKey
  indent: number
  disabled?: boolean
}

export function treeDndItemAction<TNode extends TreeNodeData>(
  node: HTMLElement,
  options: TreeDndItemOptions<TNode>,
) {
  let current = options
  let drag: ReturnType<typeof draggableAction> | undefined
  let drop: ReturnType<typeof droppableAction> | undefined
  let intent: TreeDropIntent | null = null

  const bind = (nextOptions: TreeDndItemOptions<TNode>) => {
    current = nextOptions
    drag?.destroy()
    drop?.destroy()

    const feature = current.tree.getFeature<DndFeatureApi>('dnd')
    const item = current.tree.getItem(current.itemKey)
    const dropDisabled = current.disabled || item?.disabled === true || !feature
    const dragDisabled = dropDisabled || feature?.canDrag(current.itemKey) !== true

    type Args = DroppableEventArgs<{ treeKey: TreeKey }>

    const resolve = (args: Pick<Args, 'source' | 'pointer' | 'targetRect'>) => {
      const sourceKey = getKey(args.source.treeKey)
      if (sourceKey === undefined) return undefined
      return feature?.resolve({
        sourceKey,
        targetKey: current.itemKey,
        pointer: args.pointer,
        dragRect: getDragRect(args.source, args.pointer),
        targetRect: args.targetRect,
        indent: current.indent,
      })
    }
    const update = (value: TreeDropIntent | null | undefined) => {
      intent = value ?? null
      node.style.setProperty(
        '--tree-drop-inline-start',
        intent ? `${getTreeTitleOffset(node) + intent.indicatorOffset}px` : '',
      )
      node.style.setProperty(
        '--tree-drop-inline-width',
        intent ? `${getDropIndicatorWidth(node, intent.indicatorOffset)}px` : '',
      )
    }

    drag = draggableAction(node, {
      id: `tree:${String(current.itemKey)}`,
      type: 'tree-item',
      data: { treeKey: current.itemKey },
      disabled: dragDisabled,
      dragPreview: 'clone',
    })
    drop = droppableAction(node, {
      id: `tree:${String(current.itemKey)}`,
      accept: 'tree-item',
      data: { treeKey: current.itemKey },
      disabled: dropDisabled,
      getPosition: ({ element, pointer, source }) => {
        const value = resolve({ source, pointer, targetRect: getRect(element) })
        if (!value?.valid) return null
        if (value.position === 'after') return 'bottom'
        return 'inside'
      },
      canDrop: (source) => {
        const key = getKey(source.treeKey)
        return (
          key !== undefined &&
          key !== current.itemKey &&
          !current.tree.getPath(current.itemKey).includes(key)
        )
      },
      onDragEnter: (args) => {
        const value = resolve(args)
        update(value?.valid ? value : null)
      },
      onDrag: (args) => {
        const value = resolve(args)
        update(value?.valid ? value : null)
      },
      onDragLeave: () => update(null),
      onDrop: (args) => {
        const value = resolve(args)
        update(null)
        if (value?.valid) feature?.drop(value)
      },
    })
    node.dataset.dndEnabled = dragDisabled ? '' : 'true'
  }

  bind(options)
  return {
    update: bind,
    destroy() {
      drag?.destroy()
      drop?.destroy()
    },
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

function getTreeTitleOffset(element: HTMLElement) {
  const title = element.querySelector<HTMLElement>('[data-slot="tree-title"]')
  return title ? title.getBoundingClientRect().left - element.getBoundingClientRect().left : 0
}

function getDropIndicatorWidth(element: HTMLElement, indicatorOffset: number) {
  const itemRect = element.getBoundingClientRect()
  const treeRect = element.closest<HTMLElement>('[data-slot="tree"]')?.getBoundingClientRect()
  return Math.max(0, (treeRect?.right ?? itemRect.right) - itemRect.left - getTreeTitleOffset(element) - indicatorOffset)
}
