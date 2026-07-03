import type { DropEdge } from './types'

export type DndSourceData = Record<string, unknown>

export interface DndDropTarget {
  id: string
  element: HTMLElement
  data: Record<string, unknown>
  edges?: DropEdge[]
  canDrop?: (source: DndSourceData) => boolean
  onDragEnter?: (args: DndDropArgs) => void
  onDragLeave?: () => void
  onDrop?: (args: DndDropArgs) => void
}

export interface DndDropArgs {
  source: DndSourceData
  target: Record<string, unknown> & { id: string }
  edge: DropEdge | null
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
  let matchedArea = Number.POSITIVE_INFINITY

  for (const target of targets) {
    if (target.canDrop && !target.canDrop(source)) {
      continue
    }

    const rect = target.element.getBoundingClientRect()
    const inside =
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom

    if (!inside) {
      continue
    }

    const area = rect.width * rect.height
    if (area < matchedArea) {
      matched = target
      matchedArea = area
    }
  }

  return matched
}

function getDropArgs(target: DndDropTarget, point: { x: number; y: number }, source: DndSourceData): DndDropArgs {
  return {
    source,
    target: { id: target.id, ...target.data },
    edge: target.edges ? getClosestEdge(target.element, point, target.edges) : null,
  }
}

function getClosestEdge(element: HTMLElement, point: { x: number; y: number }, edges: DropEdge[]) {
  const rect = element.getBoundingClientRect()
  const distances: Array<[DropEdge, number]> = [
    ['top', Math.abs(point.y - rect.top)],
    ['right', Math.abs(point.x - rect.right)],
    ['bottom', Math.abs(point.y - rect.bottom)],
    ['left', Math.abs(point.x - rect.left)],
  ]
  const allowed = distances.filter(([edge]) => edges.includes(edge))
  allowed.sort((left, right) => left[1] - right[1])

  return allowed[0]?.[0] ?? null
}
