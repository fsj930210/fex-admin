import {
  getDropPositionAtPoint,
  registerDndDropTarget,
} from '@fex/components-core/interactions/dnd-store'
import type { DndDropArgs } from '@fex/components-core/interactions/dnd-store'
import type { DropEdge, DropPosition, Point } from '@fex/components-core/interactions/types'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

export interface UseDroppableEventArgs<TData extends Record<string, unknown>> extends DndDropArgs {
  target: TData & { id: string }
}

export interface UseDroppableOptions<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
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

export function useDroppable<TData extends Record<string, unknown> = Record<string, unknown>>(
  options: UseDroppableOptions<TData>,
) {
  const targetRef = shallowRef<HTMLElement | null>(null)
  const over = shallowRef(false)
  const canDrop = shallowRef(false)
  const position = shallowRef<DropPosition | null>(null)
  let cleanupTarget: (() => void) | undefined

  const acceptsSource = (source: Record<string, unknown>) => {
    const acceptList =
      options.accept === undefined
        ? []
        : Array.isArray(options.accept)
          ? options.accept
          : [options.accept]
    return (
      (acceptList.length === 0 || acceptList.includes(String(source.type))) &&
      (options.canDrop?.(source) ?? true)
    )
  }

  function setTarget(element: HTMLElement | null) {
    if (targetRef.value === element) return
    cleanupTarget?.()
    targetRef.value = element
    if (!element || options.disabled) {
      cleanupTarget = undefined
      return
    }
    const positions = options.positions ?? options.edges ?? []
    cleanupTarget = registerDndDropTarget({
      id: options.id,
      element,
      data: options.data ?? {},
      canDrop: acceptsSource,
      ...(options.positions
        ? { positions: options.positions }
        : options.edges
          ? { edges: options.edges }
          : {}),
      getPosition: ({ element: target, pointer, source }) =>
        options.getPosition?.({ element: target, pointer, source }) ??
        getDropPositionAtPoint(target, pointer, positions),
      onDragEnter: (args) => {
        over.value = true
        canDrop.value = true
        position.value = args.position
        options.onDragEnter?.({ ...args, target: args.target as TData & { id: string } })
      },
      onDrag: (args) => {
        canDrop.value = true
        position.value = args.position
        options.onDrag?.({ ...args, target: args.target as TData & { id: string } })
      },
      onDragLeave: () => {
        over.value = false
        canDrop.value = false
        position.value = null
        options.onDragLeave?.()
      },
      onDrop: (args) => {
        over.value = false
        canDrop.value = false
        position.value = null
        options.onDrop?.({ ...args, target: args.target as TData & { id: string } })
      },
    })
  }

  onBeforeUnmount(() => cleanupTarget?.())
  const edge = computed<DropEdge | null>(() =>
    position.value === 'inside' ? null : position.value,
  )
  const dataAttributes = computed(() => ({
    'data-droppable-id': options.id,
    'data-over': over.value || undefined,
    'data-can-drop': canDrop.value || undefined,
    'data-drop-edge': canDrop.value ? (edge.value ?? undefined) : undefined,
    'data-drop-position': canDrop.value ? (position.value ?? undefined) : undefined,
  }))
  return { targetRef, setTarget, over, canDrop, edge, position, dataAttributes }
}
