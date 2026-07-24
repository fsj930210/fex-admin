import type {
  SelectController,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import type { SelectionValue } from '@fex/components-core/selection/types'
import type { Readable } from 'svelte/store'
export const selectContextKey = Symbol('Select')
export interface SelectContext {
  controller: SelectController
  snapshot: Readable<ReturnType<SelectController['getSnapshot']>>
  options: () => readonly SelectOption[]
  visibleOptions: () => readonly SelectOption[]
  selectedOptions: () => readonly SelectOption[]
  multiple: () => boolean
  showSearch: () => boolean
  disabled: () => boolean
  clearable: () => boolean
  loading: () => boolean
  status: () => 'error' | 'warning' | undefined
  virtual: () => SelectVirtualOptions | undefined
  listId: string
  removeValue: (value: SelectionValue) => void
}
