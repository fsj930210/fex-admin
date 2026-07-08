import { createStore } from '../store/create-store'
import type { ToggleChangeMeta, ToggleController, ToggleOptions, ToggleSnapshot } from './types'

function createToggleSnapshot(checked: boolean | undefined, disabled: boolean | undefined): ToggleSnapshot {
  return {
    checked: checked === true,
    disabled: disabled === true,
  }
}

export function createToggleController(options: ToggleOptions = {}): ToggleController {
  const isControlled = () => options.checked !== undefined
  const store = createStore(createToggleSnapshot(options.checked ?? options.defaultChecked, options.disabled))
  let controlledSnapshot = store.getSnapshot()

  const getCurrentSnapshot = () => {
    if (!isControlled()) {
      const snapshot = store.getSnapshot()
      if (snapshot.disabled === (options.disabled === true)) {
        return snapshot
      }
      return createToggleSnapshot(snapshot.checked, options.disabled)
    }

    const nextSnapshot = createToggleSnapshot(options.checked, options.disabled)
    if (
      controlledSnapshot.checked === nextSnapshot.checked &&
      controlledSnapshot.disabled === nextSnapshot.disabled
    ) {
      return controlledSnapshot
    }
    controlledSnapshot = nextSnapshot
    return controlledSnapshot
  }

  function commit(checked: boolean) {
    const previousSnapshot = getCurrentSnapshot()
    if (previousSnapshot.disabled || previousSnapshot.checked === checked) {
      return undefined
    }

    const nextSnapshot = createToggleSnapshot(checked, options.disabled)
    const meta: ToggleChangeMeta = {
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
    toggle: () => commit(!getCurrentSnapshot().checked),
  }
}
