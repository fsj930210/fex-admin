import { createContext, useContext } from 'solid-js'
import type { SelectionValue } from '@fex/components-core/selection/types'
export type ListboxOrientation = 'vertical' | 'horizontal'
export interface ListboxContextValue { orientation: ListboxOrientation, selectedValues: () => readonly SelectionValue[], isSelected: (value: SelectionValue) => boolean, isDisabled: (value: SelectionValue) => boolean, selectItem: (value: SelectionValue) => void }
export const ListboxContext = createContext<ListboxContextValue>()
export function useListboxContext(component: string) { const context = useContext(ListboxContext); if (!context) throw new Error(`${component} must be used inside ListboxRoot.`); return context }
