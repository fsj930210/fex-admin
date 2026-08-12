import { createStore } from '../store/create-store'
import type {
  AnchorController,
  AnchorControllerOptions,
  AnchorItem,
  AnchorSnapshot,
} from './types'

function equalKeys(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((key, index) => key === right[index])
}

export function createAnchorController<TTitle = unknown>(
  initialOptions: AnchorControllerOptions<TTitle> = {},
): AnchorController<TTitle> {
  let options = initialOptions
  let defaultApplied = initialOptions.defaultActiveKeys !== undefined
  const store = createStore<AnchorSnapshot>({
    activeKeys: options.activeKeys ?? options.defaultActiveKeys ?? [],
  })
  let controlledSnapshot: AnchorSnapshot = { activeKeys: options.activeKeys ?? [] }
  const isControlled = () => options.activeKeys !== undefined
  const snapshot = () => (isControlled() ? controlledSnapshot : store.getSnapshot())

  return {
    getSnapshot: snapshot,
    subscribe: store.subscribe,
    updateOptions(nextOptions) {
      options = nextOptions
      if (isControlled() && !equalKeys(controlledSnapshot.activeKeys, options.activeKeys!)) {
        controlledSnapshot = { activeKeys: options.activeKeys! }
      }
      if (!defaultApplied && !isControlled() && options.defaultActiveKeys !== undefined) {
        defaultApplied = true
        store.setSnapshot({ activeKeys: options.defaultActiveKeys })
      }
    },
    change(activeKeys: readonly string[], items: readonly AnchorItem<TTitle>[]) {
      if (equalKeys(snapshot().activeKeys, activeKeys)) return
      if (!isControlled()) store.setSnapshot({ activeKeys })
      options.onChange?.(activeKeys, items)
    },
  }
}
