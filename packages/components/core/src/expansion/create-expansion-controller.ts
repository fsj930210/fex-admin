import { createStore } from '../store/create-store'
import type { ExpansionController, ExpansionKey, ExpansionOptions } from './types'
import {
  createExpansionSnapshot,
  diffExpansionKeys,
  expansionKeysEqual,
  normalizeExpansionKeys,
} from './utils'

function toDisabledSet(keys: readonly ExpansionKey[] | undefined) {
  return new Set(keys ?? [])
}

export function createExpansionController(options: ExpansionOptions = {}): ExpansionController {
  const getMultiple = () => options.multiple !== false
  const getDisabledKeys = () => toDisabledSet(options.disabledKeys)
  const isControlled = () => options.expandedKeys !== undefined

  const store = createStore(
    createExpansionSnapshot(
      normalizeExpansionKeys(options.expandedKeys ?? options.defaultExpandedKeys, getMultiple()),
      getMultiple(),
    ),
  )
  let controlledSnapshot = store.getSnapshot()

  const getCurrentSnapshot = () => {
    if (isControlled()) {
      const nextSnapshot = createExpansionSnapshot(
        normalizeExpansionKeys(options.expandedKeys, getMultiple()),
        getMultiple(),
      )

      if (
        controlledSnapshot.multiple === nextSnapshot.multiple &&
        expansionKeysEqual(controlledSnapshot.expandedKeys, nextSnapshot.expandedKeys)
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

    return createExpansionSnapshot(snapshot.expandedKeys, getMultiple())
  }

  function withoutDisabledChanges(nextKeys: readonly ExpansionKey[]) {
    const disabledKeys = getDisabledKeys()
    const previousKeys = getCurrentSnapshot().expandedKeys
    const previousDisabledKeys = previousKeys.filter((key) => disabledKeys.has(key))
    const nextEnabledKeys = nextKeys.filter((key) => !disabledKeys.has(key))

    return [...previousDisabledKeys, ...nextEnabledKeys]
  }

  function commit(nextKeys: readonly ExpansionKey[]) {
    const previousSnapshot = getCurrentSnapshot()
    const nextSnapshot = createExpansionSnapshot(withoutDisabledChanges(nextKeys), getMultiple())

    if (expansionKeysEqual(previousSnapshot.expandedKeys, nextSnapshot.expandedKeys)) {
      return
    }

    if (!isControlled()) {
      store.setSnapshot(nextSnapshot)
    }

    options.onChange?.(nextSnapshot.expandedKeys, {
      previousKeys: previousSnapshot.expandedKeys,
      changedKeys: diffExpansionKeys(previousSnapshot.expandedKeys, nextSnapshot.expandedKeys),
    })
  }

  const controller: ExpansionController = {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    isExpanded: (key) => getCurrentSnapshot().expandedKeys.includes(key),
    isDisabled: (key) => getDisabledKeys().has(key),
    expand: (key) => {
      if (controller.isDisabled(key) || controller.isExpanded(key)) {
        return
      }

      const currentKeys = getCurrentSnapshot().expandedKeys
      controller.setExpandedKeys(getMultiple() ? [...currentKeys, key] : [key])
    },
    collapse: (key) => {
      if (controller.isDisabled(key) || !controller.isExpanded(key)) {
        return
      }

      controller.setExpandedKeys(getCurrentSnapshot().expandedKeys.filter((item) => item !== key))
    },
    toggle: (key) => {
      if (controller.isExpanded(key)) {
        controller.collapse(key)
        return
      }

      controller.expand(key)
    },
    setExpandedKeys: (keys) => {
      commit(keys)
    },
    clear: () => {
      commit([])
    },
  }

  return controller
}
