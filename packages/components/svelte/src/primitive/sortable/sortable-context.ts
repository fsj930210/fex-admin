import type { SortableId } from '@fex/components-core/sortable/types'
import type { createSortableAction } from '../../actions/sortable'

export const sortableContextKey = Symbol('sortable')

export interface SortableContext {
  sortable: ReturnType<typeof createSortableAction<any>>
  snapshot: () => ReturnType<ReturnType<typeof createSortableAction<any>>['controller']['getSnapshot']>
  styleToString: (style: object) => string
}

export type SortableOverlaySnippet = [{ activeId: SortableId; style: string }]
