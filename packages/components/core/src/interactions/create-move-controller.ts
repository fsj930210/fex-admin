import { resolveMoveRect } from './bounds'
import type { BoundsRect } from './bounds'
import type { InteractionAxis, Point } from './types'

export interface MoveControllerOptions {
  position: Point
  axis?: InteractionAxis | undefined
  bounds?: 'viewport' | 'parent' | HTMLElement | false | undefined
  onMove?: ((position: Point) => void) | undefined
  onMoveEnd?: ((position: Point) => void) | undefined
}

export interface MoveControllerSnapshot {
  moving: boolean
  position: Point
}

export interface MovePointerInput {
  button: number
  pointerId: number
  clientX: number
  clientY: number
  preventDefault?: () => void
}

interface MoveSession {
  pointerId: number
  startPointer: Point
  startPosition: Point
  targetRect: BoundsRect
  boundsRect: BoundsRect | null
}

type Listener = () => void

export function createMoveController(options: MoveControllerOptions) {
  let target: HTMLElement | null = null
  let currentOptions = options
  let snapshot: MoveControllerSnapshot = {
    moving: false,
    position: options.position,
  }
  let session: MoveSession | null = null
  let latestPointer: MovePointerInput | null = null
  let rafId: number | null = null

  const listeners = new Set<Listener>()

  function getSnapshot() {
    return snapshot
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function setSnapshot(next: Partial<MoveControllerSnapshot>) {
    snapshot = { ...snapshot, ...next }
    for (const listener of listeners) {
      listener()
    }
  }

  function updateOptions(next: MoveControllerOptions) {
    currentOptions = next
    if (!snapshot.moving) {
      setSnapshot({ position: next.position })
    }
  }

  function setTarget(element: HTMLElement | null) {
    target = element
  }

  function start(input: MovePointerInput) {
    if (session || input.button !== 0 || !target) {
      return false
    }

    input.preventDefault?.()
    session = {
      pointerId: input.pointerId,
      startPointer: { x: input.clientX, y: input.clientY },
      startPosition: snapshot.position,
      targetRect: target.getBoundingClientRect(),
      boundsRect: getBoundsRect(target, currentOptions.bounds),
    }
    setSnapshot({ moving: true })

    return true
  }

  function move(input: MovePointerInput) {
    if (input.pointerId !== session?.pointerId) {
      return
    }

    input.preventDefault?.()
    latestPointer = input
    if (rafId === null) {
      rafId = requestAnimationFrame(flush)
    }
  }

  function end(input: { pointerId: number }) {
    if (input.pointerId !== session?.pointerId) {
      return
    }

    clearFrame()
    session = null
    latestPointer = null
    setSnapshot({ moving: false })
    currentOptions.onMoveEnd?.(snapshot.position)
  }

  function cancel() {
    clearFrame()
    session = null
    latestPointer = null
    setSnapshot({ moving: false })
  }

  function flush() {
    rafId = null
    if (!session || !latestPointer) {
      return
    }

    const moveInput = {
      startPosition: session.startPosition,
      startPointer: session.startPointer,
      currentPointer: { x: latestPointer.clientX, y: latestPointer.clientY },
      targetRect: session.targetRect,
      boundsRect: session.boundsRect,
    }
    const nextPosition = resolveMoveRect(currentOptions.axis ? { ...moveInput, axis: currentOptions.axis } : moveInput)
    setSnapshot({ position: nextPosition })
    currentOptions.onMove?.(nextPosition)
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

export function getBoundsRect(target: HTMLElement, bounds: MoveControllerOptions['bounds']) {
  if (bounds === false) {
    return null
  }
  if (bounds instanceof HTMLElement) {
    return targetToBoundsRect(bounds)
  }
  if (bounds === 'parent') {
    return target.parentElement ? targetToBoundsRect(target.parentElement) : null
  }
  return {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  }
}

function targetToBoundsRect(element: HTMLElement): BoundsRect {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  }
}
