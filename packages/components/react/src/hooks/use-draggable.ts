import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
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
import { useRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, RefCallback } from 'react'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { useMemoizedFn } from './use-memoized-fn'

type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined
}

export interface UseDraggableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  type?: string
  data?: TData
  disabled?: boolean
  dragPreview?: 'none' | 'clone'
}

interface DraggableRect {
  top: number
  left: number
  width: number
  height: number
}

export function useDraggable<TData extends Record<string, unknown> = Record<string, unknown>>({
  id,
  type,
  data,
  disabled,
  dragPreview = 'none',
}: UseDraggableOptions<TData>) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [handle, setHandle] = useState<Element | null>(null)
  const [dragging, setDragging] = useState(false)
  const [activeRect, setActiveRect] = useState<DraggableRect | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const previewElementRef = useRef<HTMLElement | null>(null)

  const clearDragPreview = useMemoizedFn(() => {
    previewElementRef.current?.remove()
    previewElementRef.current = null
  })

  const mountDragPreview = useMemoizedFn((rect: DraggableRect) => {
    clearDragPreview()
    if (dragPreview !== 'clone' || !element) return

    const previewElement = element.cloneNode(true) as HTMLElement
    previewElement.removeAttribute('id')
    for (const descendant of previewElement.querySelectorAll('[id]')) descendant.removeAttribute('id')
    previewElement.setAttribute('aria-hidden', 'true')
    previewElement.setAttribute('data-drag-preview', 'true')
    Object.assign(previewElement.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: 'max-content',
      maxWidth: 'none',
      height: `${rect.height}px`,
      marginInlineStart: '0',
      overflow: 'visible',
      opacity: '0.45',
      pointerEvents: 'none',
      zIndex: '20',
      willChange: 'left, top',
    })
    document.body.append(previewElement)
    previewElementRef.current = previewElement
  })

  const getInitialData = useMemoizedFn(() => ({
    id,
    type,
    ...(data ?? {}),
  }))

  const startFallbackDrag = useMemoizedFn((event: globalThis.PointerEvent | MouseEvent) => {
    if (disabled || event.button !== 0 || !element) {
      return
    }

    event.preventDefault()
    const rect = element.getBoundingClientRect()
    const source = {
      ...getInitialData(),
      [DND_DRAG_START_X]: event.clientX,
      [DND_DRAG_START_Y]: event.clientY,
      [DND_DRAG_START_RECT_X]: rect.left,
      [DND_DRAG_START_RECT_Y]: rect.top,
      [DND_DRAG_START_RECT_WIDTH]: rect.width,
      [DND_DRAG_START_RECT_HEIGHT]: rect.height,
    }
    const startPoint = { x: event.clientX, y: event.clientY }

    setCurrentDndSource(source)
    moveCurrentDndSource(startPoint)
    setActiveRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    setDragOffset({ x: 0, y: 0 })
    setDragging(true)
    mountDragPreview({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })

    function onPointerMove(pointerEvent: globalThis.PointerEvent) {
      const nextPoint = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      setDragOffset({ x: nextPoint.x - startPoint.x, y: nextPoint.y - startPoint.y })
      if (previewElementRef.current) {
        previewElementRef.current.style.left = `${rect.left + nextPoint.x - startPoint.x}px`
        previewElementRef.current.style.top = `${rect.top + nextPoint.y - startPoint.y}px`
      }
      moveCurrentDndSource(nextPoint)
    }

    function onPointerUp(pointerEvent: globalThis.PointerEvent) {
      cleanupPointer()
      finishDrag({ x: pointerEvent.clientX, y: pointerEvent.clientY })
    }

    function cleanupPointer() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  })

  const finishDrag = useMemoizedFn((point: { x: number; y: number }) => {
    dropCurrentDndSource(point)
    setDragging(false)
    setActiveRect(null)
    setDragOffset({ x: 0, y: 0 })
    clearDragPreview()
  })

  useIsomorphicLayoutEffect(() => {
    if (!element || disabled) {
      return
    }

    function onPointerDown(event: globalThis.PointerEvent) {
      const target = event.target
      if (handle && target instanceof Node && !handle.contains(target)) {
        return
      }
      startFallbackDrag(event)
    }

    function onDragStart(event: DragEvent) {
      const source = { ...getInitialData(), [DND_DRAG_START_X]: event.clientX }
      setCurrentDndSource(source)
      event.dataTransfer?.setData('application/x-fex-dnd', JSON.stringify(source))
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
      }
      setDragging(true)
    }

    function onDragEnd() {
      clearCurrentDndSource()
      setDragging(false)
      setActiveRect(null)
      setDragOffset({ x: 0, y: 0 })
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('dragstart', onDragStart)
    element.addEventListener('dragend', onDragEnd)

    const draggableOptions = {
      element,
      getInitialData,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      ...(handle ? { dragHandle: handle } : {}),
    }
    const cleanupPragmatic = draggable(draggableOptions)

    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('dragstart', onDragStart)
      element.removeEventListener('dragend', onDragEnd)
      cleanupPragmatic()
      clearDragPreview()
    }
  }, [clearDragPreview, disabled, element, getInitialData, handle, startFallbackDrag])

  const getDragProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => ({
      ref: setElement,
      draggable: false,
      'data-dragging': dragging || undefined,
      'data-draggable-id': id,
    }),
  )

  const getHandleProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => ({
      ref: setHandle,
      'data-drag-handle': '',
    }),
  )

  function getOverlayStyle(): CSSProperties {
    if (!activeRect || !dragging) {
      return { display: 'none' }
    }

    return {
      position: 'fixed',
      top: activeRect.top,
      left: activeRect.left,
      width: activeRect.width,
      height: activeRect.height,
      transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
      pointerEvents: 'none',
      zIndex: 2147483647,
      opacity: 1,
      willChange: 'transform',
    }
  }

  return {
    dragging,
    getDragProps,
    getHandleProps,
    getOverlayStyle,
  }
}
