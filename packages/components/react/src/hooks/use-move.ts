import { createMoveController } from '@fex/components-core/interactions/create-move-controller'
import type { InteractionAxis, Point } from '@fex/components-core/interactions/types'
import { shallowEqualObject } from '@fex/utils'
import { useRef, useSyncExternalStore } from 'react'
import type { CSSProperties, HTMLAttributes, PointerEvent, RefCallback } from 'react'
import { useControllableState } from './use-controllable-state'
import { useMemoizedFn } from './use-memoized-fn'
import { useLazyRef } from './use-lazy-ref'

type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined
}

export interface UseMoveOptions {
  position?: Point
  defaultPosition?: Point
  axis?: InteractionAxis
  bounds?: 'viewport' | 'parent' | HTMLElement | false
  disabled?: boolean
  onMove?: (position: Point) => void
  onMoveEnd?: (position: Point) => void
}

export function useMove({
  position,
  defaultPosition = { x: 0, y: 0 },
  axis,
  bounds,
  disabled,
  onMove,
  onMoveEnd,
}: UseMoveOptions = {}) {
  const [currentPosition, setCurrentPosition] = useControllableState<Point>({
    value: position,
    defaultValue: defaultPosition,
    onChange: onMove,
  })
  const controllerOptions = {
    position: currentPosition,
    axis,
    bounds,
    onMove: setCurrentPosition,
    onMoveEnd,
  }
  const latestControllerOptionsRef = useRef(controllerOptions)
  const controller = useLazyRef(() => createMoveController(controllerOptions)).current
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )
  const handleUsedRef = useRef(false)

  if (!shallowEqualObject(latestControllerOptionsRef.current, controllerOptions)) {
    latestControllerOptionsRef.current = controllerOptions
    controller.updateOptions(controllerOptions)
  }

  const startMove = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    if (disabled || !controller.start(pointerEventToInput(event.nativeEvent))) {
      return
    }

    function onPointerMove(pointerEvent: globalThis.PointerEvent) {
      controller.move(pointerEventToInput(pointerEvent))
    }

    function onPointerUp(pointerEvent: globalThis.PointerEvent) {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      controller.end({ pointerId: pointerEvent.pointerId })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  })

  const getTargetProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement>; style: CSSProperties } => ({
      ref: controller.setTarget,
      style: getStyle(snapshot.position, snapshot.moving),
      'data-moving': snapshot.moving || undefined,
      onPointerDown: (event) => {
        if (!handleUsedRef.current) {
          startMove(event)
        }
      },
    }),
  )

  const getHandleProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => {
      handleUsedRef.current = true

      return {
        ref: () => {},
        onPointerDown: startMove,
        style: { touchAction: 'none', userSelect: 'none' },
        'data-move-handle': '',
      }
    },
  )

  return {
    moving: snapshot.moving,
    position: snapshot.position,
    style: getStyle(snapshot.position, snapshot.moving),
    getTargetProps,
    getHandleProps,
  }
}

function getStyle(position: Point, moving: boolean): CSSProperties {
  return {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    willChange: moving ? 'transform' : undefined,
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
