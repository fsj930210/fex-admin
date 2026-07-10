import { createContext, useContext } from 'solid-js'
import type { SortableItems } from '@fex/components-core/sortable/types'
import type { createSortable, CreateSortableOptions } from '../../primitives/create-sortable'
type AnySortable = ReturnType<typeof createSortable<SortableItems>>
export type SortableContextValue = Omit<AnySortable, 'previewItems' | 'update'> & { previewItems: () => SortableItems, update: (next: CreateSortableOptions<SortableItems>) => void, syncOptions: () => void }
export const SortableContext = createContext<SortableContextValue>()
export function useSortableContext() { const context = useContext(SortableContext); if (!context) throw new Error('Sortable components must be used inside SortableRoot.'); return context }
