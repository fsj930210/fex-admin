import { createMoveController } from '@fex/components-core/interactions/create-move-controller'
import type { InteractionAxis, Point } from '@fex/components-core/interactions/types'
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'

export interface CreateMoveOptions {
  position?: Point
  defaultPosition?: Point
  axis?: InteractionAxis
  bounds?: 'viewport' | 'parent' | HTMLElement | false
  disabled?: boolean
  onMove?: (position: Point) => void
  onMoveEnd?: (position: Point) => void
}

export function createMove(options: CreateMoveOptions = {}) {
  const [target, setTarget] = createSignal<HTMLElement | null>(null)
  const [handle, setHandle] = createSignal<HTMLElement | null>(null)
  const [snapshot, setSnapshot] = createSignal({
    moving: false,
    position: options.position ?? options.defaultPosition ?? { x: 0, y: 0 },
  })
  const controller = createMoveController({
    position: snapshot().position,
    axis: options.axis,
    bounds: options.bounds,
    onMove: (position) => {
      options.onMove?.(position)
    },
    onMoveEnd: options.onMoveEnd,
  })

  const unsubscribe = controller.subscribe(() => setSnapshot(controller.getSnapshot()))
  onCleanup(() => {
    unsubscribe()
    controller.cancel()
  })

  createEffect(() => bind())

  function bind() {
    controller.setTarget(target())
    controller.updateOptions({
      position: options.position ?? snapshot().position,
      axis: options.axis,
      bounds: options.bounds,
      onMove: options.onMove,
      onMoveEnd: options.onMoveEnd,
    })

    const element = handle() ?? target()
    if (!element || options.disabled) {
      return
    }

    element.addEventListener('pointerdown', onPointerDown)
    onCleanup(() => element.removeEventListener('pointerdown', onPointerDown))
  }

  function onPointerDown(event: PointerEvent) {
    if (!controller.start(toInput(event))) {
      return
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  function onPointerMove(event: PointerEvent) {
    controller.move(toInput(event))
  }

  function onPointerUp(event: PointerEvent) {
    cleanup()
    controller.end({ pointerId: event.pointerId })
  }

  function cleanup() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }

  const style = createMemo(() => ({
    transform: `translate3d(${snapshot().position.x}px, ${snapshot().position.y}px, 0)`,
    'will-change': snapshot().moving ? 'transform' : undefined,
  }))

  return {
    setTarget,
    setHandle,
    bind,
    moving: () => snapshot().moving,
    position: () => snapshot().position,
    style,
  }
}

function toInput(event: PointerEvent) {
  return {
    button: event.button,
    pointerId: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}
