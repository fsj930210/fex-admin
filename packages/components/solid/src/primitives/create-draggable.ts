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
import { createMemo, createSignal, onCleanup } from 'solid-js'

export interface CreateDraggableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  type?: string
  data?: TData
  disabled?: boolean
  dragPreview?: 'none' | 'clone'
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
  let previewElement: HTMLElement | null = null
  function clearPreview() { previewElement?.remove(); previewElement = null }
  function mountPreview(rect: DOMRect) {
    clearPreview(); const element = target(); if (options.dragPreview !== 'clone' || !element) return
    const preview = element.cloneNode(true) as HTMLElement; preview.removeAttribute('id'); for (const child of preview.querySelectorAll('[id]')) child.removeAttribute('id')
    preview.setAttribute('aria-hidden', 'true'); preview.setAttribute('data-drag-preview', 'true')
    Object.assign(preview.style, { position: 'fixed', top: `${rect.top}px`, left: `${rect.left}px`, width: 'max-content', maxWidth: 'none', height: `${rect.height}px`, marginInlineStart: '0', overflow: 'visible', opacity: '0.45', pointerEvents: 'none', zIndex: '20', willChange: 'left, top' })
    document.body.append(preview); previewElement = preview
  }

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
    const bounds = element.getBoundingClientRect()
    setCurrentDndSource({ ...source(), [DND_DRAG_START_X]: start.x, [DND_DRAG_START_Y]: start.y, [DND_DRAG_START_RECT_X]: bounds.left, [DND_DRAG_START_RECT_Y]: bounds.top, [DND_DRAG_START_RECT_WIDTH]: bounds.width, [DND_DRAG_START_RECT_HEIGHT]: bounds.height })
    moveCurrentDndSource(start)
    setActiveRect(bounds)
    setDragOffset({ x: 0, y: 0 })
    setDragging(true)
    mountPreview(bounds)

    function onPointerMove(pointerEvent: PointerEvent) {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      setDragOffset({ x: point.x - start.x, y: point.y - start.y })
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
      setDragging(false)
      setActiveRect(null)
      setDragOffset({ x: 0, y: 0 })
      clearPreview()
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
    clearPreview()
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
