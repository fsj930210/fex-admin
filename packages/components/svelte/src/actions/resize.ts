import { createResizeController } from '@fex/components-core/interactions/create-resize-controller'
import { defaultRect, rectToStyle } from '@fex/components-core/interactions/rect'
import type { Rect, ResizeEdge, ResizeEdges } from '@fex/components-core/interactions/types'

export interface ResizeActionOptions {
  rect?: Rect
  edge: ResizeEdge
  edges?: ResizeEdges
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  bounds?: 'viewport' | 'parent' | HTMLElement | false
  disabled?: boolean
  onResize?: (rect: Rect) => void
  onResizeEnd?: (rect: Rect) => void
}

export function resizeAction(node: HTMLElement, options: ResizeActionOptions) {
  let currentOptions = options
  let cleanupWindow: (() => void) | undefined
  const controller = createResizeController({
    rect: options.rect ?? defaultRect,
    edges: options.edges,
    minWidth: options.minWidth,
    maxWidth: options.maxWidth,
    minHeight: options.minHeight,
    maxHeight: options.maxHeight,
    bounds: options.bounds,
    onResize: options.onResize,
    onResizeEnd: options.onResizeEnd,
  })

  controller.setTarget(node)
  const unsubscribe = controller.subscribe(() => {
    const style = rectToStyle(controller.getSnapshot().rect)
    node.style.transform = style.transform
    node.style.width = style.width
    node.style.height = style.height
    node.style.boxSizing = 'border-box'
  })

  function onPointerDown(event: PointerEvent) {
    if (currentOptions.disabled || !controller.start(toInput(event), currentOptions.edge)) {
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
    update(nextOptions: ResizeActionOptions) {
      currentOptions = nextOptions
      controller.updateOptions({
        rect: nextOptions.rect ?? controller.getSnapshot().rect,
        edges: nextOptions.edges,
        minWidth: nextOptions.minWidth,
        maxWidth: nextOptions.maxWidth,
        minHeight: nextOptions.minHeight,
        maxHeight: nextOptions.maxHeight,
        bounds: nextOptions.bounds,
        onResize: nextOptions.onResize,
        onResizeEnd: nextOptions.onResizeEnd,
      })
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
