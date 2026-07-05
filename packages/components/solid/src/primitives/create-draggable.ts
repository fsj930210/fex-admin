import {
  clearCurrentDndSource,
  dropCurrentDndSource,
  moveCurrentDndSource,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'
import { createMemo, createSignal, onCleanup } from 'solid-js'

export interface CreateDraggableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  type?: string
  data?: TData
  disabled?: boolean
}

export function createDraggable<TData extends Record<string, unknown> = Record<string, unknown>>(
  options: CreateDraggableOptions<TData>,
) {
  const [target, setTarget] = createSignal<HTMLElement | null>(null)
  const [handle, setHandle] = createSignal<HTMLElement | null>(null)
  const [dragging, setDragging] = createSignal(false)
  const [activeRect, setActiveRect] = createSignal<DOMRect | null>(null)
  const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 })
  let cleanupWindow: (() => void) | undefined

  function source() {
    return { id: options.id, type: options.type, ...options.data }
  }

  function onPointerDown(event: PointerEvent) {
    const element = target()
    const dragHandle = handle()
    if (!element || options.disabled || event.button !== 0) {
      return
    }
    if (dragHandle && event.target instanceof Node && !dragHandle.contains(event.target)) {
      return
    }

    event.preventDefault()
    const start = { x: event.clientX, y: event.clientY }
    setCurrentDndSource(source())
    moveCurrentDndSource(start)
    setActiveRect(element.getBoundingClientRect())
    setDragOffset({ x: 0, y: 0 })
    setDragging(true)

    function onPointerMove(pointerEvent: PointerEvent) {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      setDragOffset({ x: point.x - start.x, y: point.y - start.y })
      moveCurrentDndSource(point)
    }

    function onPointerUp(pointerEvent: PointerEvent) {
      cleanupWindow?.()
      cleanupWindow = undefined
      dropCurrentDndSource({ x: pointerEvent.clientX, y: pointerEvent.clientY })
      setDragging(false)
      setActiveRect(null)
      setDragOffset({ x: 0, y: 0 })
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

  onCleanup(() => {
    clearCurrentDndSource()
    cleanupWindow?.()
  })

  const overlayStyle = createMemo(() => {
    const rect = activeRect()
    if (!rect || !dragging()) {
      return { display: 'none' }
    }

    return {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translate3d(${dragOffset().x}px, ${dragOffset().y}px, 0)`,
      'pointer-events': 'none',
      'z-index': 2147483647,
      opacity: 1,
      'will-change': 'transform',
    }
  })

  return { setTarget, setHandle, dragging, overlayStyle, onPointerDown }
}
