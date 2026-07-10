import type { SortableItems } from '@fex/components-core/sortable/types'
import { inject, type InjectionKey } from 'vue'
import type { useSortable, UseSortableOptions } from '../../composables/use-sortable'
export interface SortableContext { sortable: ReturnType<typeof useSortable<SortableItems>>, syncOptions: () => void }
export const sortableContextKey: InjectionKey<SortableContext> = Symbol('sortable-context')
export function useSortableContext() { const context = inject(sortableContextKey); if (!context) throw new Error('Sortable components must be used inside SortableRoot.'); return context }
export type { UseSortableOptions }
