import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import {
  getCurrentDndSource,
  registerDndDropTarget,
} from '@fex/components-core/interactions/dnd-store'
import { useState } from 'react'
import type { DragEvent, HTMLAttributes, RefCallback } from 'react'
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import type { DropEdge } from '@fex/components-core/interactions/types'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { useMemoizedFn } from './use-memoized-fn'

export interface UseDroppableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  accept?: string | string[]
  data?: TData
  disabled?: boolean
  edges?: DropEdge[]
  canDrop?: (source: Record<string, unknown>) => boolean
  onDragEnter?: (args: {
    source: Record<string, unknown>
    target: TData & { id: string }
    edge: DropEdge | null
  }) => void
  onDragLeave?: () => void
  onDrop?: (args: {
    source: Record<string, unknown>
    target: TData & { id: string }
    edge: DropEdge | null
  }) => void
}

export function useDroppable<TData extends Record<string, unknown> = Record<string, unknown>>({
  id,
  accept,
  data,
  disabled,
  edges,
  canDrop,
  onDragEnter,
  onDragLeave,
  onDrop,
}: UseDroppableOptions<TData>) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [over, setOver] = useState(false)
  const [dropAllowed, setDropAllowed] = useState(false)
  const [edge, setEdge] = useState<DropEdge | null>(null)

  const acceptsSource = useMemoizedFn((source: Record<string, unknown>) => {
    const sourceType = source.type
    const acceptList = accept === undefined ? [] : Array.isArray(accept) ? accept : [accept]
    const accepted = acceptList.length === 0 || acceptList.includes(String(sourceType))
    return accepted && (canDrop?.(source) ?? true)
  })

  useIsomorphicLayoutEffect(() => {
    if (!element || disabled) {
      return
    }

    const cleanupFallback = registerDndDropTarget({
      id,
      element,
      data: data ?? {},
      edges,
      canDrop: acceptsSource,
      onDragEnter: ({ source, target, edge }) => {
        setOver(true)
        setDropAllowed(true)
        setEdge(edge)
        onDragEnter?.({
          source,
          target: target as TData & { id: string },
          edge,
        })
      },
      onDragLeave: () => {
        setOver(false)
        setDropAllowed(false)
        setEdge(null)
        onDragLeave?.()
      },
      onDrop: ({ source, target, edge }) => {
        setOver(false)
        setDropAllowed(false)
        setEdge(null)
        onDrop?.({
          source,
          target: target as TData & { id: string },
          edge,
        })
      },
    })

    function onNativeDragEnter(event: globalThis.DragEvent) {
      const source = getNativeSourceFromDataTransfer(event.dataTransfer)
      if (!source) {
        return
      }
      const nextEdge = edges ? getNativeEdgeFromPoint(element, { x: event.clientX, y: event.clientY }, edges) : null
      setOver(true)
      setDropAllowed(acceptsSource(source))
      setEdge(nextEdge)
      onDragEnter?.({
        source,
        target: { id, ...(data ?? {}) } as TData & { id: string },
        edge: nextEdge,
      })
    }

    function onNativeDragOver(event: globalThis.DragEvent) {
      const source = getNativeSourceFromDataTransfer(event.dataTransfer)
      if (!source || !acceptsSource(source)) {
        return
      }
      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
      setDropAllowed(true)
      setEdge(edges ? getNativeEdgeFromPoint(element, { x: event.clientX, y: event.clientY }, edges) : null)
    }

    function onNativeDrop(event: globalThis.DragEvent) {
      const source = getNativeSourceFromDataTransfer(event.dataTransfer)
      if (!source || !acceptsSource(source)) {
        return
      }
      event.preventDefault()
      const nextEdge = edges ? getNativeEdgeFromPoint(element, { x: event.clientX, y: event.clientY }, edges) : null
      setOver(false)
      setDropAllowed(false)
      setEdge(null)
      onDrop?.({
        source,
        target: { id, ...(data ?? {}) } as TData & { id: string },
        edge: nextEdge,
      })
    }

    element.addEventListener('dragenter', onNativeDragEnter)
    element.addEventListener('dragover', onNativeDragOver)
    element.addEventListener('drop', onNativeDrop)

    const cleanupPragmatic = dropTargetForElements({
      element,
      canDrop: ({ source }) => acceptsSource(source.data),
      getData: ({ input }) => {
        const base = { id, ...(data ?? {}) }
        return edges ? attachClosestEdge(base, { element, input, allowedEdges: toPragmaticEdges(edges) }) : base
      },
      onDragEnter: ({ self, source }) => {
        setOver(true)
        setDropAllowed(acceptsSource(source.data))
        const nextEdge = fromPragmaticEdge(extractClosestEdge(self.data))
        setEdge(nextEdge)
        onDragEnter?.({
          source: source.data,
          target: self.data as TData & { id: string },
          edge: nextEdge,
        })
      },
      onDrag: ({ self, source }) => {
        setDropAllowed(acceptsSource(source.data))
        setEdge(fromPragmaticEdge(extractClosestEdge(self.data)))
      },
      onDragLeave: () => {
        setOver(false)
        setDropAllowed(false)
        setEdge(null)
        onDragLeave?.()
      },
      onDrop: ({ self, source }) => {
        setOver(false)
        setDropAllowed(false)
        const nextEdge = fromPragmaticEdge(extractClosestEdge(self.data))
        setEdge(null)
        onDrop?.({
          source: source.data,
          target: self.data as TData & { id: string },
          edge: nextEdge,
        })
      },
    })

    return () => {
      element.removeEventListener('dragenter', onNativeDragEnter)
      element.removeEventListener('dragover', onNativeDragOver)
      element.removeEventListener('drop', onNativeDrop)
      cleanupFallback()
      cleanupPragmatic()
    }
  }, [acceptsSource, data, disabled, edges, element, id, onDragEnter, onDragLeave, onDrop])

  const getDropProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & { ref: RefCallback<HTMLElement> } => ({
      ref: setElement,
      onDragEnter: (event) => {
        const source = getNativeSource(event)
        if (!source) {
          return
        }
        const nextEdge = edges ? getNativeEdge(event, edges) : null
        setOver(true)
        setDropAllowed(acceptsSource(source))
        setEdge(nextEdge)
        onDragEnter?.({
          source,
          target: { id, ...(data ?? {}) } as TData & { id: string },
          edge: nextEdge,
        })
      },
      onDragOver: (event) => {
        const source = getNativeSource(event)
        if (!source || !acceptsSource(source)) {
          return
        }
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setDropAllowed(true)
        setEdge(edges ? getNativeEdge(event, edges) : null)
      },
      onDragLeave: () => {
        setOver(false)
        setDropAllowed(false)
        setEdge(null)
        onDragLeave?.()
      },
      onDrop: (event) => {
        const source = getNativeSource(event)
        if (!source || !acceptsSource(source)) {
          return
        }
        event.preventDefault()
        const nextEdge = edges ? getNativeEdge(event, edges) : null
        setOver(false)
        setDropAllowed(false)
        setEdge(null)
        onDrop?.({
          source,
          target: { id, ...(data ?? {}) } as TData & { id: string },
          edge: nextEdge,
        })
      },
      'data-droppable-id': id,
      'data-over': over || undefined,
      'data-can-drop': dropAllowed || undefined,
      'data-drop-edge': edge ?? undefined,
    }),
  )

  return {
    over,
    canDrop: dropAllowed,
    edge,
    getDropProps,
  }
}

function toPragmaticEdges(edges: DropEdge[]): Edge[] {
  return edges
}

function fromPragmaticEdge(edge: Edge | null): DropEdge | null {
  return edge
}

function getNativeSource(event: DragEvent<HTMLElement>) {
  const stored = getCurrentDndSource()
  if (stored) {
    return stored
  }

  const raw = event.dataTransfer.getData('application/x-fex-dnd')
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

function getNativeSourceFromDataTransfer(dataTransfer: DataTransfer | null) {
  const stored = getCurrentDndSource()
  if (stored) {
    return stored
  }

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

function getNativeEdge(event: DragEvent<HTMLElement>, edges: DropEdge[]) {
  return getNativeEdgeFromPoint(event.currentTarget, { x: event.clientX, y: event.clientY }, edges)
}

function getNativeEdgeFromPoint(element: HTMLElement, point: { x: number; y: number }, edges: DropEdge[]) {
  const rect = element.getBoundingClientRect()
  const distances: Array<[DropEdge, number]> = [
    ['top', Math.abs(point.y - rect.top)],
    ['right', Math.abs(point.x - rect.right)],
    ['bottom', Math.abs(point.y - rect.bottom)],
    ['left', Math.abs(point.x - rect.left)],
  ]
  const allowed = distances.filter(([edge]) => edges.includes(edge))
  allowed.sort((left, right) => left[1] - right[1])

  return allowed[0]?.[0] ?? null
}
