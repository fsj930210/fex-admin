import type { SelectionValue } from '@fex/components-core/selection/types'
import { inject } from 'vue'
import { selectKey } from './context'

export function useSelect(component = 'useSelect') {
  const context = inject(selectKey)
  if (!context) throw new Error(`${component} must be used inside SelectRoot.`)
  return context
}

export function useSelectOption(value: SelectionValue) {
  const select = useSelect('useSelectOption')
  return {
    select,
    activate: () => select.controller.setActiveValue(value, 'pointer'),
    choose: () => select.controller.selectValue(value),
  }
}

export type { SelectFilterOption, SelectOption } from '@fex/components-core/select/types'
