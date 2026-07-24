import type { SelectionValue } from '@fex/components-core/selection/types'
import { useCoreStore } from '../../hooks/use-core-store'
import { useSelectContext } from './select-context'

export function useSelect() {
  const context = useSelectContext('useSelect')
  const snapshot = useCoreStore(context.controller)
  const selection = context.controller.selection.getSnapshot()
  return { ...context, snapshot, selection }
}

export function useSelectOption(value: SelectionValue) {
  const select = useSelect()
  const option = select.options.find((item) => item.value === value)
  return {
    option,
    active: select.snapshot.activeValue === value,
    selected: select.controller.selection.isSelected(value),
    disabled: option?.disabled === true || select.controller.selection.isDisabled(value),
    select: () => select.controller.selectValue(value),
    activate: () => select.controller.setActiveValue(value, 'pointer'),
  }
}

export type { SelectFilterOption, SelectOption } from '@fex/components-core/select/types'
