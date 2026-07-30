import type {
  AutoCompleteController,
  AutoCompleteFieldNames,
  ResolvedAutoCompleteItem,
} from '@fex/components-core/auto-complete/types'
import { createContext, use } from 'react'

export interface AutoCompleteContextValue<TItem = object> {
  controller: AutoCompleteController<TItem>
  items: readonly ResolvedAutoCompleteItem<TItem>[]
  fieldNames?: Partial<AutoCompleteFieldNames<TItem>>
  loading: boolean
  disabled: boolean
  readOnly: boolean
  listId: string
}

export const AutoCompleteContext = createContext<AutoCompleteContextValue | null>(null)

export function useAutoCompleteContext(component: string) {
  const context = use(AutoCompleteContext)
  if (!context) throw new Error(`${component} must be used inside AutoCompleteRoot.`)
  return context
}
