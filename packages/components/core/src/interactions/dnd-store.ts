import type { DropEdge, DropPosition, Point, Rect } from './types'

export type DndSourceData = Record<string, unknown>

/** Reserved metadata captured by adapters; tree DnD uses it for rc-tree nesting math. */
export const DND_DRAG_START_X = '__fexDndDragStartX'
export const DND_DRAG_START_Y = '__fexDndDragStartY'
export const DND_DRAG_START_RECT_X = '__fexDndDragStartRectX'
export const DND_DRAG_START_RECT_Y = '__fexDndDragStartRectY'
export const DND_DRAG_START_RECT_WIDTH = '__fexDndDragStartRectWidth'
export const DND_DRAG_START_RECT_HEIGHT = '__fexDndDragStartRectHeight'

export interface DndDropTarget {
  id: string
  element: HTMLElement
  data: Record<string, unknown>
  edges?: readonly DropEdge[] | undefined
  positions?: readonly DropPosition[] | undefined
  getPosition?: ((args: DndDropPositionArgs) => DropPosition | null) | undefined
  canDrop?: ((source: DndSourceData) => boolean) | undefined
  onDragEnter?: ((args: DndDropArgs) => void) | undefined
  onDrag?: ((args: DndDropArgs) => void) | undefined
  onDragLeave?: (() => void) | undefined
  onDrop?: ((args: DndDropArgs) => void) | undefined
}

export interface DndDropPositionArgs {
  element: HTMLElement
  pointer: Point
  source: DndSourceData
}

export interface DndDropArgs {
  source: DndSourceData
  target: Record<string, unknown> & { id: string }
  edge: DropEdge | null
  position: DropPosition | null
  pointer: Point
  targetRect: Rect
}

let currentSource: DndSourceData | null = null
let currentTarget: DndDropTarget | null = null
const targets = new Set<DndDropTarget>()

export function setCurrentDndSource(source: DndSourceData) {
  currentSource = source
}

export function getCurrentDndSource() {
  return currentSource
}

export function clearCurrentDndSource() {
  currentSource = null
  currentTarget?.onDragLeave?.()
  currentTarget = null
}

export function registerDndDropTarget(target: DndDropTarget) {
  targets.add(target)
  return () => {
    targets.delete(target)
    if (currentTarget === target) {
      currentTarget = null
    }
  }
}

export function moveCurrentDndSource(point: { x: number; y: number }) {
  if (!currentSource) {
    return
  }

  const target = getTargetAtPoint(point, currentSource)
  if (target !== currentTarget) {
    currentTarget?.onDragLeave?.()
    currentTarget = target
    if (target) {
      target.onDragEnter?.(getDropArgs(target, point, currentSource))
    }
  }
  if (target) {
    target.onDrag?.(getDropArgs(target, point, currentSource))
  }
}

export function dropCurrentDndSource(point: { x: number; y: number }) {
  if (!currentSource) {
    return false
  }

  const target = getTargetAtPoint(point, currentSource)
  if (!target) {
    clearCurrentDndSource()
    return false
  }

  target.onDrop?.(getDropArgs(target, point, currentSource))
  currentSource = null
  currentTarget = null
  return true
}

function getTargetAtPoint(point: { x: number; y: number }, source: DndSourceData) {
  let matched: DndDropTarget | null = null
  let largestOverlap = -1
  let matchedArea = Number.POSITIVE_INFINITY
  const dragRect = getCurrentDragRect(source, point)

  for (const target of targets) {
    if (target.canDrop && !target.canDrop(source)) {
      continue
    }

    const rect = target.element.getBoundingClientRect()
    const overlap = dragRect ? getOverlapArea(dragRect, rect) : 0
    const inside = dragRect
      ? overlap > 0
      : point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom

    if (!inside) {
      continue
    }

    const area = rect.width * rect.height
    if (
      (dragRect && overlap > largestOverlap)
      || (dragRect && overlap === largestOverlap && area < matchedArea)
      || (!dragRect && area < matchedArea)
    ) {
      matched = target
      largestOverlap = overlap
      matchedArea = area
    }
  }

  return matched
}

function getDropArgs(target: DndDropTarget, point: Point, source: DndSourceData): DndDropArgs {
  const position = target.getPosition?.({ element: target.element, pointer: point, source })
    ?? getDropPositionAtPoint(target.element, point, target.positions ?? target.edges ?? [])
  const rect = target.element.getBoundingClientRect()
  return {
    source,
    target: { id: target.id, ...target.data },
    edge: isDropEdge(position) ? position : null,
    position,
    pointer: point,
    targetRect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
  }
}

function getCurrentDragRect(source: DndSourceData, point: Point): Rect | undefined {
  const startX = source[DND_DRAG_START_X]
  const startY = source[DND_DRAG_START_Y]
  const x = source[DND_DRAG_START_RECT_X]
  const y = source[DND_DRAG_START_RECT_Y]
  const width = source[DND_DRAG_START_RECT_WIDTH]
  const height = source[DND_DRAG_START_RECT_HEIGHT]
  if (
    typeof startX !== 'number' || typeof startY !== 'number' || typeof x !== 'number'
    || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number'
  ) return undefined
  return { x: x + point.x - startX, y: y + point.y - startY, width, height }
}

function getOverlapArea(left: Rect, right: DOMRect): number {
  const width = Math.max(0, Math.min(left.x + left.width, right.right) - Math.max(left.x, right.left))
  const height = Math.max(0, Math.min(left.y + left.height, right.bottom) - Math.max(left.y, right.top))
  return width * height
}

export function getDropPositionAtPoint(
  element: HTMLElement,
  point: Point,
  positions: readonly DropPosition[],
): DropPosition | null {
  if (positions.length === 0) return null
  const rect = element.getBoundingClientRect()
  if (positions.includes('inside')) {
    const verticalRatio = rect.height === 0 ? 0.5 : (point.y - rect.top) / rect.height
    if (positions.includes('top') && verticalRatio <= 0.25) return 'top'
    if (positions.includes('bottom') && verticalRatio >= 0.75) return 'bottom'
    return 'inside'
  }
  const distances: Array<[DropEdge, number]> = [
    ['top', Math.abs(point.y - rect.top)],
    ['right', Math.abs(point.x - rect.right)],
    ['bottom', Math.abs(point.y - rect.bottom)],
    ['left', Math.abs(point.x - rect.left)],
  ]
  const allowed = distances.filter(([edge]) => positions.includes(edge))
  allowed.sort((left, right) => left[1] - right[1])

  return allowed[0]?.[0] ?? null
}

function isDropEdge(position: DropPosition | null): position is DropEdge {
  return position !== null && position !== 'inside'
}
