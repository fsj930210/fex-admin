import { createResizeController } from '@fex/components-core/interactions/create-resize-controller'
import { defaultRect, rectToStyle } from '@fex/components-core/interactions/rect'
import type { Rect, ResizeEdge, ResizeEdges } from '@fex/components-core/interactions/types'
import { createMemo, createSignal, onCleanup, untrack } from 'solid-js'
import type { JSX } from 'solid-js'

export interface CreateResizeOptions {
  rect?: Rect
  defaultRect?: Rect
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

export function createResize(options: CreateResizeOptions = {}) {
  const [snapshot, setSnapshot] = createSignal({
    resizing: false,
    rect: options.rect ?? options.defaultRect ?? defaultRect,
  })
  const controller = createResizeController({
    rect: snapshot().rect,
    edges: options.edges,
    minWidth: options.minWidth,
    maxWidth: options.maxWidth,
    minHeight: options.minHeight,
    maxHeight: options.maxHeight,
    bounds: options.bounds,
    onResize: options.onResize,
    onResizeEnd: options.onResizeEnd,
  })

  const unsubscribe = controller.subscribe(() => setSnapshot(controller.getSnapshot()))
  onCleanup(() => {
    unsubscribe()
    controller.cancel()
  })

  function updateController() {
    controller.updateOptions({
      rect: options.rect ?? untrack(() => snapshot().rect),
      edges: options.edges,
      minWidth: options.minWidth,
      maxWidth: options.maxWidth,
      minHeight: options.minHeight,
      maxHeight: options.maxHeight,
      bounds: options.bounds,
      onResize: options.onResize,
      onResizeEnd: options.onResizeEnd,
    })
  }

  function setTargetElement(element: HTMLElement | null) {
    controller.setTarget(element)
    updateController()
  }

  function getHandleProps(edge: ResizeEdge) {
    return {
      onPointerDown: (event: PointerEvent) => start(event, edge),
      style: { 'touch-action': 'none', 'user-select': 'none' } as JSX.CSSProperties,
      'data-resize-handle': edge,
    }
  }

  function start(event: PointerEvent, edge: ResizeEdge) {
    updateController()
    if (options.disabled || !controller.start(toInput(event), edge)) {
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
    ...rectToStyle(snapshot().rect),
    'box-sizing': 'border-box',
    'will-change': snapshot().resizing ? 'width, height, transform' : undefined,
  }))

  return {
    setTarget: setTargetElement,
    resizing: () => snapshot().resizing,
    rect: () => snapshot().rect,
    style,
    getHandleProps,
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
