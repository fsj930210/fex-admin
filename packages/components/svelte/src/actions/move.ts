import { createMoveController } from '@fex/components-core/interactions/create-move-controller'
import type { InteractionAxis, Point } from '@fex/components-core/interactions/types'

export interface MoveActionOptions {
  position?: Point
  axis?: InteractionAxis
  bounds?: 'viewport' | 'parent' | HTMLElement | false
  disabled?: boolean
  onMove?: (position: Point) => void
  onMoveEnd?: (position: Point) => void
}

export function moveAction(node: HTMLElement, options: MoveActionOptions = {}) {
  let currentOptions = options
  let cleanupWindow: (() => void) | undefined
  const controller = createMoveController({
    position: options.position ?? { x: 0, y: 0 },
    axis: options.axis,
    bounds: options.bounds,
    onMove: options.onMove,
    onMoveEnd: options.onMoveEnd,
  })

  controller.setTarget(node)
  function applySnapshot() {
    const snapshot = controller.getSnapshot()
    node.style.transform = `translate3d(${snapshot.position.x}px, ${snapshot.position.y}px, 0)`
    node.style.willChange = snapshot.moving ? 'transform' : ''
  }

  applySnapshot()
  const unsubscribe = controller.subscribe(applySnapshot)

  function onPointerDown(event: PointerEvent) {
    if (currentOptions.disabled || !controller.start(toInput(event))) {
      return
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    cleanupWindow = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }

  function onPointerMove(event: PointerEvent) {
    controller.move(toInput(event))
  }

  function onPointerUp(event: PointerEvent) {
    cleanupWindow?.()
    cleanupWindow = undefined
    controller.end({ pointerId: event.pointerId })
  }

  node.addEventListener('pointerdown', onPointerDown)

  return {
    update(nextOptions: MoveActionOptions = {}) {
      currentOptions = nextOptions
      controller.updateOptions({
        position: nextOptions.position ?? controller.getSnapshot().position,
        axis: nextOptions.axis,
        bounds: nextOptions.bounds,
        onMove: nextOptions.onMove,
        onMoveEnd: nextOptions.onMoveEnd,
      })
      applySnapshot()
    },
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown)
      cleanupWindow?.()
      unsubscribe()
      controller.cancel()
    },
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
