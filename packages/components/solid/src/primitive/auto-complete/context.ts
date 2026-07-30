import type {
  AutoCompleteController,
  ResolvedAutoCompleteItem,
} from '@fex/components-core/auto-complete/types'
import { createContext, useContext, type Accessor } from 'solid-js'

type Item = Record<string, unknown>
export interface AutoCompleteContextValue {
  controller: AutoCompleteController<Item>
  snapshot: Accessor<ReturnType<AutoCompleteController['getSnapshot']>>
  items: Accessor<readonly ResolvedAutoCompleteItem<Item>[]>
  loading: Accessor<boolean>
  disabled: Accessor<boolean>
  readOnly: Accessor<boolean>
  listId: string
}
export const AutoCompleteContext = createContext<AutoCompleteContextValue>()
export function useAutoComplete(component = 'useAutoComplete') {
  const value = useContext(AutoCompleteContext)
  if (!value) throw new Error(`${component} must be used inside AutoCompleteRoot.`)
  return value
}
