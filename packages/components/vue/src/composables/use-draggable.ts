import {
  clearCurrentDndSource,
  DND_DRAG_START_X,
  DND_DRAG_START_Y,
  DND_DRAG_START_RECT_X,
  DND_DRAG_START_RECT_Y,
  DND_DRAG_START_RECT_WIDTH,
  DND_DRAG_START_RECT_HEIGHT,
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
  dragPreview?: 'none' | 'clone'
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
  let previewElement: HTMLElement | null = null

  function clearDragPreview() {
    previewElement?.remove()
    previewElement = null
  }

  function mountDragPreview(rect: DOMRect) {
    clearDragPreview()
    const element = targetRef.value
    if (options.dragPreview !== 'clone' || !element) return
    const preview = element.cloneNode(true) as HTMLElement
    preview.removeAttribute('id')
    for (const descendant of preview.querySelectorAll('[id]')) descendant.removeAttribute('id')
    preview.setAttribute('aria-hidden', 'true')
    preview.setAttribute('data-drag-preview', 'true')
    Object.assign(preview.style, {
      position: 'fixed', top: `${rect.top}px`, left: `${rect.left}px`, width: 'max-content', maxWidth: 'none',
      height: `${rect.height}px`, marginInlineStart: '0', overflow: 'visible', opacity: '0.45', pointerEvents: 'none', zIndex: '20',
      willChange: 'left, top',
    })
    document.body.append(preview)
    previewElement = preview
  }

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
    const bounds = target.getBoundingClientRect()
    setCurrentDndSource({ ...source(), [DND_DRAG_START_X]: start.x, [DND_DRAG_START_Y]: start.y, [DND_DRAG_START_RECT_X]: bounds.left, [DND_DRAG_START_RECT_Y]: bounds.top, [DND_DRAG_START_RECT_WIDTH]: bounds.width, [DND_DRAG_START_RECT_HEIGHT]: bounds.height })
    moveCurrentDndSource(start)
    activeRect.value = bounds
    dragOffset.value = { x: 0, y: 0 }
    dragging.value = true
    mountDragPreview(activeRect.value)

    function onPointerMove(pointerEvent: PointerEvent) {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      dragOffset.value = { x: point.x - start.x, y: point.y - start.y }
      if (previewElement) {
        previewElement.style.left = `${bounds.left + point.x - start.x}px`
        previewElement.style.top = `${bounds.top + point.y - start.y}px`
      }
      moveCurrentDndSource(point)
    }

    function onPointerUp(pointerEvent: PointerEvent) {
      cleanupWindow?.()
      cleanupWindow = undefined
      dropCurrentDndSource({ x: pointerEvent.clientX, y: pointerEvent.clientY })
      dragging.value = false
      activeRect.value = null
      dragOffset.value = { x: 0, y: 0 }
      clearDragPreview()
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
    clearDragPreview()
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
