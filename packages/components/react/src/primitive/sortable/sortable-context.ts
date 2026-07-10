import { createContext, use } from 'react'
import type { SortableId } from '@fex/components-core/sortable/types'
import type { useSortable } from '../../hooks/use-sortable'

export interface SortableContextValue {
  activeId: SortableId | null
  getContainerProps: ReturnType<typeof useSortable>['getContainerProps']
  getHandleProps: ReturnType<typeof useSortable>['getHandleProps']
  getItemProps: ReturnType<typeof useSortable>['getItemProps']
  getOverlayStyle: ReturnType<typeof useSortable>['getOverlayStyle']
}
export const SortableContext = createContext<SortableContextValue | null>(null)
export function useSortableContext() { const context = use(SortableContext); if (!context) throw new Error('Sortable components must be used inside SortableRoot.'); return context }
