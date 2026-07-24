import type {
  SelectController,
  SelectFilterOption,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import type { SelectionValue } from '@fex/components-core/selection/types'
import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'

export interface SelectContextValue {
  controller: SelectController
  snapshot: ShallowRef<ReturnType<SelectController['getSnapshot']>>
  options: ComputedRef<readonly SelectOption[]>
  visibleOptions: ComputedRef<readonly SelectOption[]>
  selectedOptions: ComputedRef<readonly SelectOption[]>
  multiple: ComputedRef<boolean>
  tags: ComputedRef<boolean>
  showSearch: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  clearable: ComputedRef<boolean>
  loading: ComputedRef<boolean>
  status: ComputedRef<'error' | 'warning' | undefined>
  virtual: ComputedRef<SelectVirtualOptions | undefined>
  listId: string
  removeValue: (value: SelectionValue) => void
}

export const selectKey: InjectionKey<SelectContextValue> = Symbol('Select')
