import {
  clearCurrentDndSource,
  dropCurrentDndSource,
  moveCurrentDndSource,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

export interface UseDraggableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  type?: string
  data?: TData
  disabled?: boolean
}

export function useDraggable<TData extends Record<string, unknown> = Record<string, unknown>>(
  options: UseDraggableOptions<TData>,
) {
  const targetRef = shallowRef<HTMLElement | null>(null)
  const handleRef = shallowRef<HTMLElement | null>(null)
  const dragging = shallowRef(false)
  const activeRect = shallowRef<DOMRect | null>(null)
  const dragOffset = shallowRef({ x: 0, y: 0 })
  let cleanupWindow: (() => void) | undefined
  let cleanupTarget: (() => void) | undefined

  const source = () => ({ id: options.id, type: options.type, ...(options.data ?? {}) })

  function setTarget(element: HTMLElement | null) {
    if (targetRef.value === element) {
      return
    }

    cleanupTarget?.()
    targetRef.value = element
    if (!element) {
      cleanupTarget = undefined
      return
    }

    element.addEventListener('pointerdown', onPointerDown)
    cleanupTarget = () => {
      element.removeEventListener('pointerdown', onPointerDown)
      cleanupWindow?.()
    }
  }

  function setHandle(element: HTMLElement | null) {
    if (handleRef.value === element) {
      return
    }

    handleRef.value = element
  }

  function onPointerDown(event: PointerEvent) {
    const target = targetRef.value
    const handle = handleRef.value
    if (!target || options.disabled || event.button !== 0) {
      return
    }
    if (handle && event.target instanceof Node && !handle.contains(event.target)) {
      return
    }

    event.preventDefault()
    const start = { x: event.clientX, y: event.clientY }
    setCurrentDndSource(source())
    moveCurrentDndSource(start)
    activeRect.value = target.getBoundingClientRect()
    dragOffset.value = { x: 0, y: 0 }
    dragging.value = true

    function onPointerMove(pointerEvent: PointerEvent) {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      dragOffset.value = { x: point.x - start.x, y: point.y - start.y }
      moveCurrentDndSource(point)
    }

    function onPointerUp(pointerEvent: PointerEvent) {
      cleanupWindow?.()
      cleanupWindow = undefined
      dropCurrentDndSource({ x: pointerEvent.clientX, y: pointerEvent.clientY })
      dragging.value = false
      activeRect.value = null
      dragOffset.value = { x: 0, y: 0 }
    }

    cleanupWindow = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  onBeforeUnmount(() => {
    clearCurrentDndSource()
    cleanupTarget?.()
    cleanupWindow?.()
  })

  const overlayStyle = computed(() => {
    const rect = activeRect.value
    if (!rect || !dragging.value) {
      return { display: 'none' }
    }

    return {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translate3d(${dragOffset.value.x}px, ${dragOffset.value.y}px, 0)`,
      pointerEvents: 'none',
      zIndex: '2147483647',
      opacity: '1',
      willChange: 'transform',
    }
  })

  return { targetRef, handleRef, setTarget, setHandle, dragging, overlayStyle }
}
