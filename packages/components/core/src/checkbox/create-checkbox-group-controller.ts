import { createStore } from '../store/create-store'
import type {
  CheckboxCheckedState,
  CheckboxGroupChangeMeta,
  CheckboxGroupController,
  CheckboxGroupOptions,
  CheckboxGroupSnapshot,
  CheckboxValue,
} from './types'
import { checkboxValuesEqual, normalizeCheckboxValue } from './utils'

function createCheckboxGroupSnapshot(
  value: readonly CheckboxValue[] | undefined,
  disabled: boolean | undefined,
): CheckboxGroupSnapshot {
  return {
    value: normalizeCheckboxValue(value),
    disabled: disabled === true,
  }
}

function toDisabledSet(values: readonly CheckboxValue[] | undefined) {
  return new Set(values ?? [])
}

function changedValueFrom(
  previousValue: readonly CheckboxValue[],
  value: readonly CheckboxValue[],
): CheckboxValue | undefined {
  const previousSet = new Set(previousValue)
  const nextSet = new Set(value)

  for (const item of previousValue) {
    if (!nextSet.has(item)) {
      return item
    }
  }

  for (const item of value) {
    if (!previousSet.has(item)) {
      return item
    }
  }

  return undefined
}

export function createCheckboxGroupController(
  options: CheckboxGroupOptions = {},
): CheckboxGroupController {
  const isControlled = () => options.value !== undefined
  const getDisabledValues = () => toDisabledSet(options.disabledValues)
  const store = createStore(createCheckboxGroupSnapshot(options.value ?? options.defaultValue, options.disabled))
  let controlledSnapshot = store.getSnapshot()

  const getCurrentSnapshot = () => {
    if (!isControlled()) {
      const snapshot = store.getSnapshot()
      if (snapshot.disabled === (options.disabled === true)) {
        return snapshot
      }
      return createCheckboxGroupSnapshot(snapshot.value, options.disabled)
    }

    const nextSnapshot = createCheckboxGroupSnapshot(options.value, options.disabled)
    if (
      controlledSnapshot.disabled === nextSnapshot.disabled &&
      checkboxValuesEqual(controlledSnapshot.value, nextSnapshot.value)
    ) {
      return controlledSnapshot
    }
    controlledSnapshot = nextSnapshot
    return controlledSnapshot
  }

  function withoutDisabledChanges(nextValue: readonly CheckboxValue[]) {
    const disabledValues = getDisabledValues()
    const previousValue = getCurrentSnapshot().value
    const previousDisabledValue = previousValue.filter((value) => disabledValues.has(value))
    const nextEnabledValue = nextValue.filter((value) => !disabledValues.has(value))

    return normalizeCheckboxValue([...previousDisabledValue, ...nextEnabledValue])
  }

  function commit(nextValue: readonly CheckboxValue[]) {
    const previousSnapshot = getCurrentSnapshot()
    if (previousSnapshot.disabled) {
      return undefined
    }

    const snapshot = createCheckboxGroupSnapshot(withoutDisabledChanges(nextValue), options.disabled)
    if (checkboxValuesEqual(previousSnapshot.value, snapshot.value)) {
      return undefined
    }

    const changedValue = changedValueFrom(previousSnapshot.value, snapshot.value)
    const meta: CheckboxGroupChangeMeta = {
      previousValue: previousSnapshot.value,
      value: snapshot.value,
      changedValue,
      checked: changedValue === undefined ? undefined : snapshot.value.includes(changedValue),
    }

    if (!isControlled()) {
      store.setSnapshot(snapshot)
    }

    options.onChange?.(snapshot.value, meta)
    return meta
  }

  const controller: CheckboxGroupController = {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    isChecked: (value) => getCurrentSnapshot().value.includes(value),
    isDisabled: (value) => getCurrentSnapshot().disabled || getDisabledValues().has(value),
    check: (value) => {
      if (controller.isDisabled(value) || controller.isChecked(value)) {
        return undefined
      }
      return commit([...getCurrentSnapshot().value, value])
    },
    uncheck: (value) => {
      if (controller.isDisabled(value) || !controller.isChecked(value)) {
        return undefined
      }
      return commit(getCurrentSnapshot().value.filter((item) => item !== value))
    },
    toggle: (value) => (controller.isChecked(value) ? controller.uncheck(value) : controller.check(value)),
    setValue: commit,
    clear: () => commit([]),
    checkAll: (values) => commit([...getCurrentSnapshot().value, ...values]),
    uncheckAll: (values) => {
      const valueSet = new Set(values)
      return commit(getCurrentSnapshot().value.filter((value) => !valueSet.has(value)))
    },
    toggleAll: (values) => {
      const enabledValues = values.filter((value) => !controller.isDisabled(value))
      const selectedValues = new Set(getCurrentSnapshot().value)
      const shouldCheck = enabledValues.some((value) => !selectedValues.has(value))
      return shouldCheck ? controller.checkAll(enabledValues) : controller.uncheckAll(enabledValues)
    },
    getCheckedState: (values) => {
      const enabledValues = values.filter((value) => !controller.isDisabled(value))
      if (enabledValues.length === 0) {
        return false
      }

      const checkedCount = enabledValues.filter((value) => controller.isChecked(value)).length
      if (checkedCount === 0) {
        return false
      }
      if (checkedCount === enabledValues.length) {
        return true
      }
      return 'indeterminate' satisfies CheckboxCheckedState
    },
  }

  return controller
}
