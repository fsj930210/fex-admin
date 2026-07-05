import {
  clearCurrentDndSource,
  dropCurrentDndSource,
  moveCurrentDndSource,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'

export interface DraggableActionOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  type?: string
  data?: TData
  disabled?: boolean
  handle?: HTMLElement | null
  onDraggingChange?: (dragging: boolean) => void
  onOverlayStyleChange?: (style: Partial<CSSStyleDeclaration>) => void
}

export function draggableAction<TData extends Record<string, unknown> = Record<string, unknown>>(
  node: HTMLElement,
  options: DraggableActionOptions<TData>,
) {
  let currentOptions = options
  let cleanupWindow: (() => void) | undefined

  function source() {
    return { id: currentOptions.id, type: currentOptions.type, ...currentOptions.data }
  }

  function setDragging(dragging: boolean) {
    node.dataset.dragging = dragging ? 'true' : ''
    currentOptions.onDraggingChange?.(dragging)
  }

  function setOverlayStyle(rect: DOMRect | null, offset = { x: 0, y: 0 }) {
    if (!rect) {
      currentOptions.onOverlayStyleChange?.({ display: 'none' })
      return
    }
    currentOptions.onOverlayStyleChange?.({
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      pointerEvents: 'none',
      zIndex: '2147483647',
      opacity: '1',
      willChange: 'transform',
    })
  }

  function onPointerDown(event: PointerEvent) {
    if (currentOptions.disabled || event.button !== 0) {
      return
    }
    const handle = currentOptions.handle
    if (handle && event.target instanceof Node && !handle.contains(event.target)) {
      return
    }

    event.preventDefault()
    const start = { x: event.clientX, y: event.clientY }
    const rect = node.getBoundingClientRect()
    setCurrentDndSource(source())
    moveCurrentDndSource(start)
    setDragging(true)
    setOverlayStyle(rect)

    function onPointerMove(pointerEvent: PointerEvent) {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      moveCurrentDndSource(point)
      setOverlayStyle(rect, { x: point.x - start.x, y: point.y - start.y })
    }

    function onPointerUp(pointerEvent: PointerEvent) {
      cleanupWindow?.()
      cleanupWindow = undefined
      dropCurrentDndSource({ x: pointerEvent.clientX, y: pointerEvent.clientY })
      setDragging(false)
      setOverlayStyle(null)
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

  node.addEventListener('pointerdown', onPointerDown)

  return {
    update(nextOptions: DraggableActionOptions<TData>) {
      currentOptions = nextOptions
    },
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown)
      cleanupWindow?.()
      clearCurrentDndSource()
    },
  }
}
