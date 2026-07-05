import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import {
  clearCurrentDndSource,
  dropCurrentDndSource,
  moveCurrentDndSource,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'
import { useState } from 'react'
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
}: UseDraggableOptions<TData>) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [handle, setHandle] = useState<Element | null>(null)
  const [dragging, setDragging] = useState(false)
  const [activeRect, setActiveRect] = useState<DraggableRect | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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
    const source = getInitialData()
    const rect = element.getBoundingClientRect()
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

    function onPointerMove(pointerEvent: globalThis.PointerEvent) {
      const nextPoint = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      setDragOffset({ x: nextPoint.x - startPoint.x, y: nextPoint.y - startPoint.y })
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
      const source = getInitialData()
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
    }
  }, [disabled, element, getInitialData, handle, startFallbackDrag])

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
