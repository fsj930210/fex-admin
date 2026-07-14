import {
  getDropPositionAtPoint,
  getCurrentDndSource,
  registerDndDropTarget,
} from '@fex/components-core/interactions/dnd-store'
import { useState } from 'react'
import type { HTMLAttributes, RefCallback } from 'react'
import type { DropEdge, DropPosition, Point, Rect } from '@fex/components-core/interactions/types'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { useMemoizedFn } from './use-memoized-fn'

type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined
}

const EMPTY_DROP_POSITIONS: readonly DropPosition[] = []

export interface UseDroppableEventArgs<TData extends Record<string, unknown>> {
  source: Record<string, unknown>
  target: TData & { id: string }
  edge: DropEdge | null
  position: DropPosition | null
  pointer: Point
  targetRect: Rect
}

export interface UseDroppableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  accept?: string | string[]
  data?: TData
  disabled?: boolean
  edges?: readonly DropEdge[]
  positions?: readonly DropPosition[]
  getPosition?: (args: {
    element: HTMLElement
    pointer: Point
    source: Record<string, unknown>
  }) => DropPosition | null
  canDrop?: (source: Record<string, unknown>) => boolean
  onDragEnter?: (args: UseDroppableEventArgs<TData>) => void
  onDrag?: (args: UseDroppableEventArgs<TData>) => void
  onDragLeave?: () => void
  onDrop?: (args: UseDroppableEventArgs<TData>) => void
}

export function useDroppable<TData extends Record<string, unknown> = Record<string, unknown>>({
  id,
  accept,
  data,
  disabled,
  edges,
  positions,
  getPosition,
  canDrop,
  onDragEnter,
  onDrag,
  onDragLeave,
  onDrop,
}: UseDroppableOptions<TData>) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [over, setOver] = useState(false)
  const [dropAllowed, setDropAllowed] = useState(false)
  const [position, setPosition] = useState<DropPosition | null>(null)
  const allowedPositions = positions ?? edges ?? EMPTY_DROP_POSITIONS

  const acceptsSource = useMemoizedFn((source: Record<string, unknown>) => {
    const sourceType = source.type
    const acceptList = accept === undefined ? [] : Array.isArray(accept) ? accept : [accept]
    const accepted = acceptList.length === 0 || acceptList.includes(String(sourceType))
    return accepted && (canDrop?.(source) ?? true)
  })

  const resolvePosition = useMemoizedFn((
    targetElement: HTMLElement,
    pointer: Point,
    source: Record<string, unknown>,
  ) => getPosition?.({ element: targetElement, pointer, source })
    ?? getDropPositionAtPoint(targetElement, pointer, allowedPositions))

  useIsomorphicLayoutEffect(() => {
    if (!element || disabled) {
      return
    }
    const targetElement: HTMLElement = element

    const cleanupFallback = registerDndDropTarget({
      id,
      element: targetElement,
      data: data ?? {},
      canDrop: acceptsSource,
      ...(positions ? { positions } : edges ? { edges } : {}),
      getPosition: ({ element: dropElement, pointer, source }) => resolvePosition(dropElement, pointer, source),
      onDragEnter: ({ source, target, edge: nextEdge, position: nextPosition, pointer, targetRect }) => {
        setOver(true)
        setDropAllowed(true)
        setPosition(nextPosition)
        onDragEnter?.({
          source,
          target: target as TData & { id: string },
          edge: nextEdge,
          position: nextPosition,
          pointer,
          targetRect,
        })
      },
      onDrag: ({ source, target, edge: nextEdge, position: nextPosition, pointer, targetRect }) => {
        setDropAllowed(true)
        setPosition(nextPosition)
        onDrag?.({
          source,
          target: target as TData & { id: string },
          edge: nextEdge,
          position: nextPosition,
          pointer,
          targetRect,
        })
      },
      onDragLeave: () => {
        setOver(false)
        setDropAllowed(false)
        setPosition(null)
        onDragLeave?.()
      },
      onDrop: ({ source, target, edge: nextEdge, position: nextPosition, pointer, targetRect }) => {
        setOver(false)
        setDropAllowed(false)
        setPosition(null)
        onDrop?.({
          source,
          target: target as TData & { id: string },
          edge: nextEdge,
          position: nextPosition,
          pointer,
          targetRect,
        })
      },
    })

    function onNativeDragEnter(event: globalThis.DragEvent) {
      if (getCurrentDndSource()) return
      const source = getNativeSourceFromDataTransfer(event.dataTransfer)
      if (!source) {
        return
      }
      const pointer = { x: event.clientX, y: event.clientY }
      const nextPosition = resolvePosition(targetElement, pointer, source)
      setOver(true)
      setDropAllowed(acceptsSource(source))
      setPosition(nextPosition)
      onDragEnter?.({
        source,
        target: { id, ...(data ?? {}) } as TData & { id: string },
        edge: toDropEdge(nextPosition),
        position: nextPosition,
        pointer,
        targetRect: getElementRect(targetElement),
      })
    }

    function onNativeDragOver(event: globalThis.DragEvent) {
      if (getCurrentDndSource()) return
      const source = getNativeSourceFromDataTransfer(event.dataTransfer)
      if (!source || !acceptsSource(source)) {
        return
      }
      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
      const pointer = { x: event.clientX, y: event.clientY }
      const nextPosition = resolvePosition(targetElement, pointer, source)
      setDropAllowed(true)
      setPosition(nextPosition)
      onDrag?.({
        source,
        target: { id, ...(data ?? {}) } as TData & { id: string },
        edge: toDropEdge(nextPosition),
        position: nextPosition,
        pointer,
        targetRect: getElementRect(targetElement),
      })
    }

    function onNativeDrop(event: globalThis.DragEvent) {
      if (getCurrentDndSource()) return
      const source = getNativeSourceFromDataTransfer(event.dataTransfer)
      if (!source || !acceptsSource(source)) {
        return
      }
      event.preventDefault()
      const pointer = { x: event.clientX, y: event.clientY }
      const nextPosition = resolvePosition(targetElement, pointer, source)
      setOver(false)
      setDropAllowed(false)
      setPosition(null)
      onDrop?.({
        source,
        target: { id, ...(data ?? {}) } as TData & { id: string },
        edge: toDropEdge(nextPosition),
        position: nextPosition,
        pointer,
        targetRect: getElementRect(targetElement),
      })
    }

    function onNativeDragLeave(event: globalThis.DragEvent) {
      if (getCurrentDndSource()) return
      const nextTarget = event.relatedTarget
      if (nextTarget instanceof Node && targetElement.contains(nextTarget)) return
      setOver(false)
      setDropAllowed(false)
      setPosition(null)
      onDragLeave?.()
    }

    targetElement.addEventListener('dragenter', onNativeDragEnter)
    targetElement.addEventListener('dragover', onNativeDragOver)
    targetElement.addEventListener('dragleave', onNativeDragLeave)
    targetElement.addEventListener('drop', onNativeDrop)

    return () => {
      targetElement.removeEventListener('dragenter', onNativeDragEnter)
      targetElement.removeEventListener('dragover', onNativeDragOver)
      targetElement.removeEventListener('dragleave', onNativeDragLeave)
      targetElement.removeEventListener('drop', onNativeDrop)
      cleanupFallback()
    }
  }, [acceptsSource, allowedPositions, data, disabled, element, id, onDrag, onDragEnter, onDragLeave, onDrop, positions, resolvePosition])

  const getDropProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => ({
      ref: setElement,
      'data-droppable-id': id,
      'data-over': over || undefined,
      'data-can-drop': dropAllowed || undefined,
      'data-drop-edge': dropAllowed ? toDropEdge(position) ?? undefined : undefined,
      'data-drop-position': dropAllowed ? position ?? undefined : undefined,
    }),
  )

  return {
    over,
    canDrop: dropAllowed,
    edge: toDropEdge(position),
    position,
    getDropProps,
  }
}

function toDropEdge(position: DropPosition | null): DropEdge | null {
  return position === 'inside' ? null : position
}

function getElementRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect()
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
}

function getNativeSourceFromDataTransfer(dataTransfer: DataTransfer | null) {
  const raw = dataTransfer?.getData('application/x-fex-dnd')
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}
