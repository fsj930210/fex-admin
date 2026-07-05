import { registerDndDropTarget } from '@fex/components-core/interactions/dnd-store'
import type { DndDropArgs } from '@fex/components-core/interactions/dnd-store'
import type { DropEdge } from '@fex/components-core/interactions/types'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

export interface UseDroppableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  accept?: string | string[]
  data?: TData
  disabled?: boolean
  edges?: DropEdge[]
  canDrop?: (source: Record<string, unknown>) => boolean
  onDragEnter?: (args: { source: Record<string, unknown>; target: TData & { id: string }; edge: DropEdge | null }) => void
  onDragLeave?: () => void
  onDrop?: (args: { source: Record<string, unknown>; target: TData & { id: string }; edge: DropEdge | null }) => void
}

export function useDroppable<TData extends Record<string, unknown> = Record<string, unknown>>(
  options: UseDroppableOptions<TData>,
) {
  const targetRef = shallowRef<HTMLElement | null>(null)
  const over = shallowRef(false)
  const canDrop = shallowRef(false)
  const edge = shallowRef<DropEdge | null>(null)
  let cleanupTarget: (() => void) | undefined

  const acceptsSource = (source: Record<string, unknown>) => {
    const acceptList = options.accept === undefined ? [] : Array.isArray(options.accept) ? options.accept : [options.accept]
    const accepted = acceptList.length === 0 || acceptList.includes(String(source.type))
    return accepted && (options.canDrop?.(source) ?? true)
  }

  function setTarget(element: HTMLElement | null) {
    if (targetRef.value === element) {
      return
    }

    cleanupTarget?.()
    targetRef.value = element
    if (!element || options.disabled) {
      cleanupTarget = undefined
      return
    }

    const targetOptions = {
      id: options.id,
      element,
      data: options.data ?? {},
      canDrop: acceptsSource,
      onDragEnter: (args: DndDropArgs) => {
        over.value = true
        canDrop.value = true
        edge.value = args.edge
        options.onDragEnter?.({ ...args, target: args.target as TData & { id: string } })
      },
      onDragLeave: () => {
        over.value = false
        canDrop.value = false
        edge.value = null
        options.onDragLeave?.()
      },
      onDrop: (args: DndDropArgs) => {
        over.value = false
        canDrop.value = false
        edge.value = null
        options.onDrop?.({ ...args, target: args.target as TData & { id: string } })
      },
    }
    cleanupTarget = registerDndDropTarget(options.edges ? { ...targetOptions, edges: options.edges } : targetOptions)
  }

  onBeforeUnmount(() => cleanupTarget?.())

  const dataAttributes = computed(() => ({
    'data-droppable-id': options.id,
    'data-over': over.value || undefined,
    'data-can-drop': canDrop.value || undefined,
    'data-drop-edge': edge.value ?? undefined,
  }))

  return { targetRef, setTarget, over, canDrop, edge, dataAttributes }
}
