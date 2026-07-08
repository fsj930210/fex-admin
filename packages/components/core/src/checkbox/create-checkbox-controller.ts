import { createStore } from '../store/create-store'
import type {
  CheckboxChangeMeta,
  CheckboxController,
  CheckboxOptions,
  CheckboxSnapshot,
  CheckboxCheckedState,
} from './types'
import { getToggledChecked, normalizeChecked } from './utils'

function createCheckboxSnapshot(
  checked: CheckboxCheckedState | undefined,
  disabled: boolean | undefined,
): CheckboxSnapshot {
  return {
    checked: normalizeChecked(checked),
    disabled: disabled === true,
  }
}

export function createCheckboxController(options: CheckboxOptions = {}): CheckboxController {
  const isControlled = () => options.checked !== undefined
  const store = createStore(createCheckboxSnapshot(options.checked ?? options.defaultChecked, options.disabled))
  let controlledSnapshot = store.getSnapshot()

  const getCurrentSnapshot = () => {
    if (!isControlled()) {
      const snapshot = store.getSnapshot()
      if (snapshot.disabled === (options.disabled === true)) {
        return snapshot
      }
      return createCheckboxSnapshot(snapshot.checked, options.disabled)
    }

    const nextSnapshot = createCheckboxSnapshot(options.checked, options.disabled)
    if (
      controlledSnapshot.checked === nextSnapshot.checked &&
      controlledSnapshot.disabled === nextSnapshot.disabled
    ) {
      return controlledSnapshot
    }
    controlledSnapshot = nextSnapshot
    return controlledSnapshot
  }

  function commit(checked: CheckboxCheckedState) {
    const previousSnapshot = getCurrentSnapshot()
    if (previousSnapshot.disabled || previousSnapshot.checked === checked) {
      return undefined
    }

    const nextSnapshot = createCheckboxSnapshot(checked, options.disabled)
    const meta: CheckboxChangeMeta = {
      previousChecked: previousSnapshot.checked,
      checked: nextSnapshot.checked,
    }

    if (!isControlled()) {
      store.setSnapshot(nextSnapshot)
    }

    options.onChange?.(nextSnapshot.checked, meta)
    return meta
  }

  return {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    setChecked: commit,
    toggle: () => commit(getToggledChecked(getCurrentSnapshot().checked)),
  }
}
