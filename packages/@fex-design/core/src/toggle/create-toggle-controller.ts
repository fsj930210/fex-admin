import { createStore } from '../store/create-store'
import type { ToggleChangeMeta, ToggleController, ToggleOptions, ToggleSnapshot } from './types'

function createToggleSnapshot(
  pressed: boolean | undefined,
  disabled: boolean | undefined,
): ToggleSnapshot {
  return {
    pressed: pressed === true,
    checked: pressed === true,
    disabled: disabled === true,
  }
}

export function createToggleController(options: ToggleOptions = {}): ToggleController {
  const isControlled = () => options.pressed !== undefined || options.checked !== undefined
  const getPressed = () => options.pressed ?? options.checked
  const getDefaultPressed = () => options.defaultPressed ?? options.defaultChecked
  const store = createStore(
    createToggleSnapshot(getPressed() ?? getDefaultPressed(), options.disabled),
  )
  let controlledSnapshot = store.getSnapshot()

  const getCurrentSnapshot = () => {
    if (!isControlled()) {
      const snapshot = store.getSnapshot()
      if (snapshot.disabled === (options.disabled === true)) {
        return snapshot
      }
      return createToggleSnapshot(snapshot.pressed, options.disabled)
    }

    const nextSnapshot = createToggleSnapshot(getPressed(), options.disabled)
    if (
      controlledSnapshot.pressed === nextSnapshot.pressed &&
      controlledSnapshot.disabled === nextSnapshot.disabled
    ) {
      return controlledSnapshot
    }
    controlledSnapshot = nextSnapshot
    return controlledSnapshot
  }

  function commit(pressed: boolean) {
    const previousSnapshot = getCurrentSnapshot()
    if (previousSnapshot.disabled || previousSnapshot.pressed === pressed) {
      return undefined
    }

    const nextSnapshot = createToggleSnapshot(pressed, options.disabled)
    const meta: ToggleChangeMeta = {
      previousPressed: previousSnapshot.pressed,
      pressed: nextSnapshot.pressed,
      previousChecked: previousSnapshot.pressed,
      checked: nextSnapshot.pressed,
    }

    if (!isControlled()) {
      store.setSnapshot(nextSnapshot)
    }

    options.onChange?.(nextSnapshot.pressed, meta)
    return meta
  }

  return {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    setPressed: commit,
    setChecked: commit,
    toggle: () => commit(!getCurrentSnapshot().pressed),
  }
}
