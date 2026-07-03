import { resolveResizeRect } from './bounds'
import { defaultRect, normalizeResizeEdges } from './rect'
import { getBoundsRect } from './create-move-controller'
import type { BoundsRect } from './bounds'
import type { Rect, ResizeEdge, ResizeEdges } from './types'

export interface ResizeControllerOptions {
  rect: Rect
  edges?: ResizeEdges
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  bounds?: 'viewport' | 'parent' | HTMLElement | false
  onResize?: (rect: Rect) => void
  onResizeEnd?: (rect: Rect) => void
}

export interface ResizeControllerSnapshot {
  resizing: boolean
  rect: Rect
}

export interface ResizePointerInput {
  button?: number
  pointerId: number | null
  clientX: number
  clientY: number
  preventDefault?: () => void
}

interface ResizeSession {
  pointerId: number | null
  edge: ResizeEdge
  startPointer: { x: number; y: number }
  startRect: Rect
  targetRect: BoundsRect
  boundsRect: BoundsRect | null
}

type Listener = () => void

export function createResizeController(options: ResizeControllerOptions) {
  let target: HTMLElement | null = null
  let currentOptions = normalizeOptions(options)
  let snapshot: ResizeControllerSnapshot = {
    resizing: false,
    rect: currentOptions.rect,
  }
  let session: ResizeSession | null = null
  let latestPointer: ResizePointerInput | null = null
  let rafId: number | null = null

  const listeners = new Set<Listener>()

  function getSnapshot() {
    return snapshot
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function setSnapshot(next: Partial<ResizeControllerSnapshot>) {
    snapshot = { ...snapshot, ...next }
    for (const listener of listeners) {
      listener()
    }
  }

  function updateOptions(next: ResizeControllerOptions) {
    currentOptions = normalizeOptions(next)
    if (!snapshot.resizing) {
      setSnapshot({ rect: currentOptions.rect })
    }
  }

  function setTarget(element: HTMLElement | null) {
    target = element
  }

  function start(input: ResizePointerInput, edge: ResizeEdge) {
    if (session || !target || !currentOptions.enabledEdges.includes(edge)) {
      return false
    }
    if (input.button !== undefined && input.button !== 0) {
      return false
    }

    input.preventDefault?.()
    session = {
      pointerId: input.pointerId,
      edge,
      startPointer: { x: input.clientX, y: input.clientY },
      startRect: snapshot.rect,
      targetRect: target.getBoundingClientRect(),
      boundsRect: getBoundsRect(target, currentOptions.bounds),
    }
    setSnapshot({ resizing: true })

    return true
  }

  function move(input: ResizePointerInput) {
    if (!session || !isSamePointer(input.pointerId, session.pointerId)) {
      return
    }

    input.preventDefault?.()
    latestPointer = input
    if (rafId === null) {
      rafId = requestAnimationFrame(flush)
    }
  }

  function end(input: { pointerId: number | null }) {
    if (!session || !isSamePointer(input.pointerId, session.pointerId)) {
      return
    }

    clearFrame()
    session = null
    latestPointer = null
    setSnapshot({ resizing: false })
    currentOptions.onResizeEnd?.(snapshot.rect)
  }

  function cancel() {
    clearFrame()
    session = null
    latestPointer = null
    setSnapshot({ resizing: false })
  }

  function flush() {
    rafId = null
    if (!session || !latestPointer) {
      return
    }

    const nextRect = resolveResizeRect({
      edge: session.edge,
      startRect: session.startRect,
      startPointer: session.startPointer,
      currentPointer: { x: latestPointer.clientX, y: latestPointer.clientY },
      targetRect: session.targetRect,
      boundsRect: session.boundsRect,
      minWidth: currentOptions.minWidth,
      maxWidth: currentOptions.maxWidth,
      minHeight: currentOptions.minHeight,
      maxHeight: currentOptions.maxHeight,
    })
    setSnapshot({ rect: nextRect })
    currentOptions.onResize?.(nextRect)
  }

  function clearFrame() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return {
    getSnapshot,
    subscribe,
    updateOptions,
    setTarget,
    start,
    move,
    end,
    cancel,
  }
}

function normalizeOptions(options: ResizeControllerOptions) {
  return {
    rect: options.rect ?? defaultRect,
    enabledEdges: normalizeResizeEdges(options.edges ?? 'all'),
    minWidth: options.minWidth ?? 0,
    maxWidth: options.maxWidth ?? Number.POSITIVE_INFINITY,
    minHeight: options.minHeight ?? 0,
    maxHeight: options.maxHeight ?? Number.POSITIVE_INFINITY,
    bounds: options.bounds,
    onResize: options.onResize,
    onResizeEnd: options.onResizeEnd,
  }
}

function isSamePointer(current: number | null, expected: number | null) {
  return expected === null || current === expected
}
