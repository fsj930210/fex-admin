export type SelectionValue = string | number

export type CheckedState = 'checked' | 'unchecked'

export type GroupCheckedState = CheckedState | 'indeterminate'

export interface SelectionChangeMeta {
  previousValues: SelectionValue[]
  changedValues: SelectionValue[]
}

export interface SelectionOptions {
  value?: SelectionValue | SelectionValue[] | undefined
  defaultValue?: SelectionValue | SelectionValue[] | undefined
  multiple?: boolean | undefined
  disabledValues?: readonly SelectionValue[] | undefined
  onChange?: (values: SelectionValue[], meta: SelectionChangeMeta) => void
}

export interface SelectionSnapshot {
  values: SelectionValue[]
  value: SelectionValue | undefined
  multiple: boolean
}

export interface SelectionController {
  getSnapshot: () => SelectionSnapshot
  subscribe: (listener: () => void) => () => void
  isSelected: (value: SelectionValue) => boolean
  isDisabled: (value: SelectionValue) => boolean
  getCheckedState: (value: SelectionValue) => CheckedState
  getGroupCheckedState: (values: readonly SelectionValue[]) => GroupCheckedState
  select: (value: SelectionValue) => void
  unselect: (value: SelectionValue) => void
  toggle: (value: SelectionValue) => void
  replace: (value: SelectionValue) => void
  setValues: (values: readonly SelectionValue[]) => void
  clear: () => void
  selectAll: (values: readonly SelectionValue[]) => void
  unselectAll: (values: readonly SelectionValue[]) => void
  toggleAll: (values: readonly SelectionValue[]) => void
}
