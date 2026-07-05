import { registerDndDropTarget } from '@fex/components-core/interactions/dnd-store'
import type { DndDropArgs } from '@fex/components-core/interactions/dnd-store'
import type { DropEdge } from '@fex/components-core/interactions/types'
import { createMemo, createSignal, onCleanup } from 'solid-js'

export interface CreateDroppableOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
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

export function createDroppable<TData extends Record<string, unknown> = Record<string, unknown>>(
  options: CreateDroppableOptions<TData>,
) {
  const [over, setOver] = createSignal(false)
  const [canDrop, setCanDrop] = createSignal(false)
  const [edge, setEdge] = createSignal<DropEdge | null>(null)
  let cleanup: (() => void) | undefined

  function acceptsSource(source: Record<string, unknown>) {
    const acceptList = options.accept === undefined ? [] : Array.isArray(options.accept) ? options.accept : [options.accept]
    const accepted = acceptList.length === 0 || acceptList.includes(String(source.type))
    return accepted && (options.canDrop?.(source) ?? true)
  }

  function setTarget(element: HTMLElement | null) {
    cleanup?.()
    cleanup = undefined
    if (!element || options.disabled) {
      return
    }

    const targetOptions = {
      id: options.id,
      element,
      data: options.data ?? {},
      canDrop: acceptsSource,
      onDragEnter: (args: DndDropArgs) => {
        setOver(true)
        setCanDrop(true)
        setEdge(args.edge)
        options.onDragEnter?.({ ...args, target: args.target as TData & { id: string } })
      },
      onDragLeave: () => {
        setOver(false)
        setCanDrop(false)
        setEdge(null)
        options.onDragLeave?.()
      },
      onDrop: (args: DndDropArgs) => {
        setOver(false)
        setCanDrop(false)
        setEdge(null)
        options.onDrop?.({ ...args, target: args.target as TData & { id: string } })
      },
    }
    cleanup = registerDndDropTarget(options.edges ? { ...targetOptions, edges: options.edges } : targetOptions)
  }

  onCleanup(() => cleanup?.())

  const dataAttributes = createMemo(() => ({
    'data-droppable-id': options.id,
    'data-over': over() || undefined,
    'data-can-drop': canDrop() || undefined,
    'data-drop-edge': edge() ?? undefined,
  }))

  return { setTarget, over, canDrop, edge, dataAttributes }
}
