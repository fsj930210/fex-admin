import { createMoveController } from '@fex/components-core/interactions/create-move-controller'
import type { InteractionAxis, Point } from '@fex/components-core/interactions/types'
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import type { CSSProperties } from 'vue'

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

  function updateController() {
    controller.setTarget(targetRef.value)
    controller.updateOptions({
      position: options.position ?? controller.getSnapshot().position,
      axis: options.axis,
      bounds: options.bounds,
      onMove: (nextPosition) => {
        position.value = nextPosition
        options.onMove?.(nextPosition)
      },
      onMoveEnd: options.onMoveEnd,
    })
  }

  function setTarget(element: HTMLElement | null) {
    if (targetRef.value === element) {
      return
    }

    targetRef.value = element
    updateController()
  }

  function setHandle(element: HTMLElement | null) {
    if (handleRef.value === element) {
      return
    }

    handleRef.value = element
    updateController()
  }

  function onPointerDown(event: PointerEvent) {
    const handle = handleRef.value
    if (handle && event.target instanceof Node && !handle.contains(event.target)) {
      return
    }
    updateController()
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

  onBeforeUnmount(() => {
    cleanup()
    unsubscribe()
    controller.cancel()
  })

  const style = computed<CSSProperties>(() => ({
    transform: `translate3d(${snapshot.value.position.x}px, ${snapshot.value.position.y}px, 0)`,
    willChange: snapshot.value.moving ? 'transform' : undefined,
  }))

  return {
    targetRef,
    handleRef,
    setTarget,
    setHandle,
    onPointerDown,
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
