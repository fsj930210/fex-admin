import { createContext, use } from 'react'
import type { SelectionValue } from '@fex/components-core/selection/types'
import type { ListboxOrientation } from './listbox'
export interface ListboxContextValue { multiple: boolean, orientation: ListboxOrientation, isSelected: (value: SelectionValue) => boolean, isDisabled: (value: SelectionValue) => boolean, selectItem: (value: SelectionValue) => void }
export const ListboxContext = createContext<ListboxContextValue | null>(null)
export function useListboxContext(component: string) { const context = use(ListboxContext); if (!context) throw new Error(`${component} must be used inside ListboxRoot.`); return context }
