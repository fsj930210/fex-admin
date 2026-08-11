import { createStore } from '../store/create-store'
import type {
  ToggleGroupChangeMeta,
  ToggleGroupController,
  ToggleGroupOptions,
  ToggleGroupSnapshot,
  ToggleGroupValue,
} from './types'

function normalize(value: ToggleGroupValue | undefined, multiple: boolean) {
  const values = Array.isArray(value) ? value : value ? [value] : []
  return [...new Set(multiple ? values : values.slice(0, 1))]
}

function equal(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function createSnapshot(options: ToggleGroupOptions, value: ToggleGroupValue | undefined) {
  const multiple = options.multiple === true
  return {
    value: normalize(value, multiple),
    multiple,
    disabled: options.disabled === true,
  } satisfies ToggleGroupSnapshot
}

export function createToggleGroupController(
  options: ToggleGroupOptions = {},
): ToggleGroupController {
  const isControlled = () => options.value !== undefined
  const store = createStore(createSnapshot(options, options.value ?? options.defaultValue))
  let controlledSnapshot = store.getSnapshot()

  function getSnapshot() {
    if (!isControlled()) {
      const current = store.getSnapshot()
      const next = createSnapshot(options, current.value)
      if (
        current.multiple === next.multiple &&
        current.disabled === next.disabled &&
        equal(current.value, next.value)
      ) return current
      return next
    }
    const next = createSnapshot(options, options.value)
    if (
      controlledSnapshot.multiple === next.multiple &&
      controlledSnapshot.disabled === next.disabled &&
      equal(controlledSnapshot.value, next.value)
    ) return controlledSnapshot
    controlledSnapshot = next
    return next
  }

  function commit(value: ToggleGroupValue) {
    const previous = getSnapshot()
    if (previous.disabled) return undefined
    const next = createSnapshot(options, value)
    if (equal(previous.value, next.value)) return undefined
    const changedValue = previous.value.find((item) => !next.value.includes(item))
      ?? next.value.find((item) => !previous.value.includes(item))
    if (changedValue === undefined) return undefined
    const meta: ToggleGroupChangeMeta = {
      previousValue: previous.value,
      value: next.value,
      changedValue,
      pressed: next.value.includes(changedValue),
    }
    if (!isControlled()) store.setSnapshot(next)
    options.onChange?.(next.multiple ? next.value : (next.value[0] ?? ''), meta)
    return meta
  }

  return {
    getSnapshot,
    subscribe: store.subscribe,
    isPressed: (value) => getSnapshot().value.includes(value),
    toggle: (value) => {
      const snapshot = getSnapshot()
      const pressed = snapshot.value.includes(value)
      if (snapshot.multiple) {
        return commit(pressed ? snapshot.value.filter((item) => item !== value) : [...snapshot.value, value])
      }
      return commit(pressed ? '' : value)
    },
    setValue: commit,
  }
}
