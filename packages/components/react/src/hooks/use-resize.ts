import { createResizeController } from '@fex/components-core/interactions/create-resize-controller'
import { defaultRect as defaultCoreRect, rectToStyle } from '@fex/components-core/interactions/rect'
import type { Rect, ResizeEdge, ResizeEdges } from '@fex/components-core/interactions/types'
import { shallowEqualObject } from '@fex/utils'
import { useRef, useSyncExternalStore } from 'react'
import type { CSSProperties, HTMLAttributes, RefCallback } from 'react'
import { useControllableState } from './use-controllable-state'
import { useMemoizedFn } from './use-memoized-fn'
import { useLazyRef } from './use-lazy-ref'

type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined
}

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

export function useResize({
  rect,
  defaultRect = defaultCoreRect,
  edges = 'all',
  minWidth = 0,
  maxWidth = Number.POSITIVE_INFINITY,
  minHeight = 0,
  maxHeight = Number.POSITIVE_INFINITY,
  bounds,
  disabled,
  onResize,
  onResizeEnd,
}: UseResizeOptions = {}) {
  const [currentRect, setCurrentRect] = useControllableState<Rect>({
    value: rect,
    defaultValue: defaultRect,
    onChange: onResize,
  })
  const controllerOptions = {
    rect: currentRect,
    edges,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    bounds,
    onResize: setCurrentRect,
    onResizeEnd,
  }
  const latestControllerOptionsRef = useRef(controllerOptions)
  const controller = useLazyRef(() => createResizeController(controllerOptions)).current
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )

  if (!shallowEqualObject(latestControllerOptionsRef.current, controllerOptions)) {
    latestControllerOptionsRef.current = controllerOptions
    controller.updateOptions(controllerOptions)
  }

  const getTargetProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement>; style: CSSProperties } => ({
      ref: controller.setTarget,
      style: getStyle(snapshot.rect, snapshot.resizing),
      'data-resizing': snapshot.resizing || undefined,
    }),
  )

  const getHandleProps = useMemoizedFn(
    (edge: ResizeEdge): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => ({
      ref: () => {},
      onPointerDown: (event) => {
        if (disabled || !controller.start(pointerEventToInput(event.nativeEvent), edge)) {
          return
        }

        function onPointerMove(pointerEvent: globalThis.PointerEvent) {
          controller.move(pointerEventToInput(pointerEvent))
        }

        function onPointerUp(pointerEvent: globalThis.PointerEvent) {
          cleanupPointerListeners(onPointerMove, onPointerUp)
          controller.end({ pointerId: pointerEvent.pointerId })
        }

        window.addEventListener('pointermove', onPointerMove, { passive: false })
        window.addEventListener('pointerup', onPointerUp)
        window.addEventListener('pointercancel', onPointerUp)
      },
      onMouseDown: (event) => {
        if (disabled || !controller.start(mouseEventToInput(event.nativeEvent), edge)) {
          return
        }

        function onMouseMove(mouseEvent: MouseEvent) {
          controller.move(mouseEventToInput(mouseEvent))
        }

        function onMouseUp() {
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('mouseup', onMouseUp)
          controller.end({ pointerId: null })
        }

        window.addEventListener('mousemove', onMouseMove, { passive: false })
        window.addEventListener('mouseup', onMouseUp)
      },
      style: { touchAction: 'none', userSelect: 'none' },
      'data-resize-handle': edge,
    }),
  )

  return {
    resizing: snapshot.resizing,
    rect: snapshot.rect,
    style: getStyle(snapshot.rect, snapshot.resizing),
    getTargetProps,
    getHandleProps,
  }
}

function getStyle(rect: Rect, resizing: boolean): CSSProperties {
  return {
    ...rectToStyle(rect),
    boxSizing: 'border-box',
    willChange: resizing ? 'width, height, transform' : undefined,
  }
}

function pointerEventToInput(event: globalThis.PointerEvent) {
  return {
    button: event.button,
    pointerId: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}

function mouseEventToInput(event: MouseEvent) {
  return {
    button: event.button,
    pointerId: null,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}

function cleanupPointerListeners(
  onPointerMove: (event: globalThis.PointerEvent) => void,
  onPointerUp: (event: globalThis.PointerEvent) => void,
) {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}
