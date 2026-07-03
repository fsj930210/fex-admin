import { createMoveController } from '@fex/components-core/interactions/create-move-controller'
import type { InteractionAxis, Point } from '@fex/components-core/interactions/types'
import { computed, onBeforeUnmount, ref, shallowRef, watchEffect } from 'vue'

export interface UseMoveOptions {
  position?: Point
  defaultPosition?: Point
  axis?: InteractionAxis
  bounds?: 'viewport' | 'parent' | HTMLElement | false
  disabled?: boolean
  onMove?: (position: Point) => void
  onMoveEnd?: (position: Point) => void
}

export function useMove(options: UseMoveOptions = {}) {
  const position = ref(options.position ?? options.defaultPosition ?? { x: 0, y: 0 })
  const targetRef = shallowRef<HTMLElement | null>(null)
  const handleRef = shallowRef<HTMLElement | null>(null)
  const snapshot = ref({ moving: false, position: position.value })
  const controller = createMoveController({
    position: position.value,
    axis: options.axis,
    bounds: options.bounds,
    onMove: (nextPosition) => {
      position.value = nextPosition
      options.onMove?.(nextPosition)
    },
    onMoveEnd: options.onMoveEnd,
  })

  const unsubscribe = controller.subscribe(() => {
    snapshot.value = controller.getSnapshot()
  })

  watchEffect((onCleanup) => {
    const target = targetRef.value
    const handle = handleRef.value ?? target
    controller.setTarget(target)
    controller.updateOptions({
      position: options.position ?? position.value,
      axis: options.axis,
      bounds: options.bounds,
      onMove: (nextPosition) => {
        position.value = nextPosition
        options.onMove?.(nextPosition)
      },
      onMoveEnd: options.onMoveEnd,
    })

    if (!handle || options.disabled) {
      return
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

    handle.addEventListener('pointerdown', onPointerDown)
    onCleanup(() => {
      handle.removeEventListener('pointerdown', onPointerDown)
      cleanup()
    })
  })

  onBeforeUnmount(() => {
    unsubscribe()
    controller.cancel()
  })

  const style = computed(() => ({
    transform: `translate3d(${snapshot.value.position.x}px, ${snapshot.value.position.y}px, 0)`,
    willChange: snapshot.value.moving ? 'transform' : undefined,
  }))

  return {
    targetRef,
    handleRef,
    moving: computed(() => snapshot.value.moving),
    position: computed(() => snapshot.value.position),
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
