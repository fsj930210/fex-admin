import type {
  SelectController,
  SelectFilterOption,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { createContext, use } from 'react'

export interface SelectContextValue {
  controller: SelectController
  options: readonly SelectOption[]
  visibleOptions: readonly SelectOption[]
  filterOption?: SelectFilterOption | undefined
  multiple: boolean
  tags: boolean
  showSearch: boolean
  disabled: boolean
  clearable: boolean
  loading: boolean
  status?: 'error' | 'warning' | undefined
  placeholder?: string | undefined
  virtual?: SelectVirtualOptions | undefined
  listId: string
  selectedOptions: readonly SelectOption[]
  removeValue: (value: SelectionValue) => void
}

export const SelectContext = createContext<SelectContextValue | null>(null)

export function useSelectContext(component: string) {
  const context = use(SelectContext)
  if (!context) throw new Error(`${component} must be used inside SelectRoot.`)
  return context
}
