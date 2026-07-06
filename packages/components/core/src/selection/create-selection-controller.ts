import { createStore } from '../store/create-store'
import type {
  CheckedState,
  GroupCheckedState,
  SelectionController,
  SelectionOptions,
  SelectionValue,
} from './types'
import {
  createSelectionSnapshot,
  diffSelectionValues,
  normalizeSelectionValues,
  valuesEqual,
} from './utils'

function toDisabledSet(values: readonly SelectionValue[] | undefined) {
  return new Set(values ?? [])
}

export function createSelectionController(options: SelectionOptions = {}): SelectionController {
  const getMultiple = () => options.multiple === true
  const getDisabledValues = () => toDisabledSet(options.disabledValues)
  const isControlled = () => options.value !== undefined

  const store = createStore(
    createSelectionSnapshot(
      normalizeSelectionValues(options.value ?? options.defaultValue, getMultiple()),
      getMultiple(),
    ),
  )
  let controlledSnapshot = store.getSnapshot()

  const getCurrentSnapshot = () => {
    if (isControlled()) {
      const nextSnapshot = createSelectionSnapshot(normalizeSelectionValues(options.value, getMultiple()), getMultiple())
      if (
        controlledSnapshot.multiple === nextSnapshot.multiple &&
        valuesEqual(controlledSnapshot.values, nextSnapshot.values)
      ) {
        return controlledSnapshot
      }
      controlledSnapshot = nextSnapshot
      return controlledSnapshot
    }

    const snapshot = store.getSnapshot()
    if (snapshot.multiple === getMultiple()) {
      return snapshot
    }

    return createSelectionSnapshot(snapshot.values, getMultiple())
  }

  function commit(nextValues: readonly SelectionValue[]) {
    const previousSnapshot = getCurrentSnapshot()
    const nextSnapshot = createSelectionSnapshot(nextValues, getMultiple())

    if (valuesEqual(previousSnapshot.values, nextSnapshot.values)) {
      return
    }

    if (!isControlled()) {
      store.setSnapshot(nextSnapshot)
    }

    options.onChange?.(nextSnapshot.values, {
      previousValues: previousSnapshot.values,
      changedValues: diffSelectionValues(previousSnapshot.values, nextSnapshot.values),
    })
  }

  function withoutDisabledChanges(nextValues: readonly SelectionValue[]) {
    const disabledValues = getDisabledValues()
    const previousValues = getCurrentSnapshot().values
    const previousDisabledValues = previousValues.filter((value) => disabledValues.has(value))
    const nextEnabledValues = nextValues.filter((value) => !disabledValues.has(value))

    return [...previousDisabledValues, ...nextEnabledValues]
  }

  const controller: SelectionController = {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    isSelected: (value) => getCurrentSnapshot().values.includes(value),
    isDisabled: (value) => getDisabledValues().has(value),
    getCheckedState: (value): CheckedState =>
      getCurrentSnapshot().values.includes(value) ? 'checked' : 'unchecked',
    getGroupCheckedState: (values): GroupCheckedState => {
      const enabledValues = values.filter((value) => !getDisabledValues().has(value))

      if (enabledValues.length === 0) {
        return 'unchecked'
      }

      const selectedValues = new Set(getCurrentSnapshot().values)
      const selectedCount = enabledValues.filter((value) => selectedValues.has(value)).length

      if (selectedCount === 0) {
        return 'unchecked'
      }

      return selectedCount === enabledValues.length ? 'checked' : 'indeterminate'
    },
    select: (value) => {
      if (controller.isDisabled(value)) {
        return
      }

      controller.setValues(getMultiple() ? [...getCurrentSnapshot().values, value] : [value])
    },
    unselect: (value) => {
      if (controller.isDisabled(value)) {
        return
      }

      controller.setValues(getCurrentSnapshot().values.filter((item) => item !== value))
    },
    toggle: (value) => {
      if (controller.isSelected(value)) {
        controller.unselect(value)
        return
      }

      controller.select(value)
    },
    replace: (value) => {
      if (controller.isDisabled(value)) {
        return
      }

      controller.setValues([value])
    },
    setValues: (values) => {
      commit(withoutDisabledChanges(values))
    },
    clear: () => {
      commit(withoutDisabledChanges([]))
    },
    selectAll: (values) => {
      const currentValues = getCurrentSnapshot().values
      controller.setValues(getMultiple() ? [...currentValues, ...values] : values.slice(0, 1))
    },
    unselectAll: (values) => {
      const valueSet = new Set(values)
      controller.setValues(getCurrentSnapshot().values.filter((value) => !valueSet.has(value)))
    },
    toggleAll: (values) => {
      const enabledValues = values.filter((value) => !controller.isDisabled(value))
      const selectedValues = new Set(getCurrentSnapshot().values)
      const shouldSelect = enabledValues.some((value) => !selectedValues.has(value))

      if (shouldSelect) {
        controller.selectAll(enabledValues)
        return
      }

      controller.unselectAll(enabledValues)
    },
  }

  return controller
}
