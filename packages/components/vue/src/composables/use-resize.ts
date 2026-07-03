import { createResizeController } from '@fex/components-core/interactions/create-resize-controller'
import { defaultRect, rectToStyle } from '@fex/components-core/interactions/rect'
import type { Rect, ResizeEdge, ResizeEdges } from '@fex/components-core/interactions/types'
import { computed, onBeforeUnmount, ref, shallowRef, watchEffect } from 'vue'

export interface UseResizeOptions {
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

export function useResize(options: UseResizeOptions = {}) {
  const rect = ref(options.rect ?? options.defaultRect ?? defaultRect)
  const targetRef = shallowRef<HTMLElement | null>(null)
  const snapshot = ref({ resizing: false, rect: rect.value })
  const controller = createResizeController({
    rect: rect.value,
    edges: options.edges,
    minWidth: options.minWidth,
    maxWidth: options.maxWidth,
    minHeight: options.minHeight,
    maxHeight: options.maxHeight,
    bounds: options.bounds,
    onResize: (nextRect) => {
      rect.value = nextRect
      options.onResize?.(nextRect)
    },
    onResizeEnd: options.onResizeEnd,
  })

  const unsubscribe = controller.subscribe(() => {
    snapshot.value = controller.getSnapshot()
  })

  watchEffect(() => {
    controller.setTarget(targetRef.value)
    controller.updateOptions({
      rect: options.rect ?? rect.value,
      edges: options.edges,
      minWidth: options.minWidth,
      maxWidth: options.maxWidth,
      minHeight: options.minHeight,
      maxHeight: options.maxHeight,
      bounds: options.bounds,
      onResize: (nextRect) => {
        rect.value = nextRect
        options.onResize?.(nextRect)
      },
      onResizeEnd: options.onResizeEnd,
    })
  })

  onBeforeUnmount(() => {
    unsubscribe()
    controller.cancel()
  })

  function getHandleProps(edge: ResizeEdge) {
    return {
      onPointerdown: (event: PointerEvent) => start(event, edge),
      onMousedown: (event: MouseEvent) => startMouse(event, edge),
      style: { touchAction: 'none', userSelect: 'none' },
      'data-resize-handle': edge,
    }
  }

  function start(event: PointerEvent, edge: ResizeEdge) {
    if (options.disabled || !controller.start(toPointerInput(event), edge)) {
      return
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  function startMouse(event: MouseEvent, edge: ResizeEdge) {
    if (options.disabled || !controller.start(toMouseInput(event), edge)) {
      return
    }

    window.addEventListener('mousemove', onMouseMove, { passive: false })
    window.addEventListener('mouseup', onMouseUp)
  }

  function onPointerMove(event: PointerEvent) {
    controller.move(toPointerInput(event))
  }

  function onPointerUp(event: PointerEvent) {
    cleanupPointer()
    controller.end({ pointerId: event.pointerId })
  }

  function onMouseMove(event: MouseEvent) {
    controller.move(toMouseInput(event))
  }

  function onMouseUp() {
    cleanupMouse()
    controller.end({ pointerId: null })
  }

  function cleanupPointer() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }

  function cleanupMouse() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  const style = computed(() => ({
    ...rectToStyle(snapshot.value.rect),
    boxSizing: 'border-box',
    willChange: snapshot.value.resizing ? 'width, height, transform' : undefined,
  }))

  return {
    targetRef,
    resizing: computed(() => snapshot.value.resizing),
    rect: computed(() => snapshot.value.rect),
    style,
    getHandleProps,
  }
}

function toPointerInput(event: PointerEvent) {
  return {
    button: event.button,
    pointerId: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}

function toMouseInput(event: MouseEvent) {
  return {
    button: event.button,
    pointerId: null,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}
