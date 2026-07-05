import { registerDndDropTarget } from '@fex/components-core/interactions/dnd-store'
import type { DndDropArgs } from '@fex/components-core/interactions/dnd-store'
import type { DropEdge } from '@fex/components-core/interactions/types'

export interface DroppableActionOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
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

export function droppableAction<TData extends Record<string, unknown> = Record<string, unknown>>(
  node: HTMLElement,
  options: DroppableActionOptions<TData>,
) {
  let cleanup: (() => void) | undefined

  function bind(currentOptions: DroppableActionOptions<TData>) {
    cleanup?.()
    node.dataset.droppableId = currentOptions.id
    if (currentOptions.disabled) {
      return
    }

    const acceptsSource = (source: Record<string, unknown>) => {
      const acceptList = currentOptions.accept === undefined ? [] : Array.isArray(currentOptions.accept) ? currentOptions.accept : [currentOptions.accept]
      const accepted = acceptList.length === 0 || acceptList.includes(String(source.type))
      return accepted && (currentOptions.canDrop?.(source) ?? true)
    }

    const targetOptions = {
      id: currentOptions.id,
      element: node,
      data: currentOptions.data ?? {},
      canDrop: acceptsSource,
      onDragEnter: (args: DndDropArgs) => {
        node.dataset.over = 'true'
        node.dataset.canDrop = 'true'
        node.dataset.dropEdge = args.edge ?? ''
        currentOptions.onDragEnter?.({ ...args, target: args.target as TData & { id: string } })
      },
      onDragLeave: () => {
        node.dataset.over = ''
        node.dataset.canDrop = ''
        node.dataset.dropEdge = ''
        currentOptions.onDragLeave?.()
      },
      onDrop: (args: DndDropArgs) => {
        node.dataset.over = ''
        node.dataset.canDrop = ''
        node.dataset.dropEdge = ''
        currentOptions.onDrop?.({ ...args, target: args.target as TData & { id: string } })
      },
    }
    cleanup = registerDndDropTarget(
      currentOptions.edges ? { ...targetOptions, edges: currentOptions.edges } : targetOptions,
    )
  }

  bind(options)

  return {
    update(nextOptions: DroppableActionOptions<TData>) {
      bind(nextOptions)
    },
    destroy() {
      cleanup?.()
    },
  }
}
