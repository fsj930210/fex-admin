import type {
  SelectController,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface SelectContextValue {
  controller: SelectController
  snapshot: Accessor<ReturnType<SelectController['getSnapshot']>>
  options: Accessor<readonly SelectOption[]>
  visibleOptions: Accessor<readonly SelectOption[]>
  selectedOptions: Accessor<readonly SelectOption[]>
  multiple: Accessor<boolean>
  tags: Accessor<boolean>
  showSearch: Accessor<boolean>
  disabled: Accessor<boolean>
  clearable: Accessor<boolean>
  loading: Accessor<boolean>
  status: Accessor<'error' | 'warning' | undefined>
  virtual: Accessor<SelectVirtualOptions | undefined>
  listId: string
  removeValue: (value: SelectionValue) => void
}
export const SelectContext = createContext<SelectContextValue>()
export function useSelect(component = 'useSelect') {
  const value = useContext(SelectContext)
  if (!value) throw new Error(`${component} must be used inside SelectRoot.`)
  return value
}
