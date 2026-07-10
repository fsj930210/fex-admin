import type { SelectionValue } from '@fex/components-core/selection/types'
import { inject, type ComputedRef, type InjectionKey } from 'vue'
export type ListboxOrientation = 'vertical' | 'horizontal'
export interface ListboxContext {
  orientation: () => ListboxOrientation
  selectedValues: ComputedRef<SelectionValue[]>
  isDisabled: (value: SelectionValue) => boolean
  selectItem: (value: SelectionValue) => void
}
export const listboxContextKey: InjectionKey<ListboxContext> = Symbol('listbox-context')
export function useListboxContext(component: string) {
  const context = inject(listboxContextKey)
  if (!context) throw new Error(`${component} must be used inside ListboxRoot.`)
  return context
}
