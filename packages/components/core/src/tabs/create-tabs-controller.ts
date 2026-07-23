import { createStore } from '../store/create-store'
import type {
  TabsActivationMode,
  TabsChangeMeta,
  TabsController,
  TabsControllerOptions,
  TabsItemRecord,
  TabsSnapshot,
  TabsValue,
} from './types'

function createSnapshot(value: TabsValue | undefined): TabsSnapshot {
  return { value, focusedValue: value, visitedValues: value === undefined ? new Set() : new Set([value]) }
}

/**
 * Tabs keeps only selection, focus and visited panel identities. Item labels and panel nodes stay
 * in framework adapters so the controller remains reusable across all renderers.
 */
export function createTabsController(initialOptions: TabsControllerOptions = {}): TabsController {
  let options = initialOptions
  const items = new Map<TabsValue, TabsItemRecord>()
  const store = createStore(createSnapshot(options.value ?? options.defaultValue))

  const isControlled = () => options.value !== undefined
  const activationMode = (): TabsActivationMode => options.activationMode ?? 'automatic'

  function currentSnapshot() {
    const snapshot = store.getSnapshot()
    if (!isControlled() || snapshot.value === options.value) return snapshot
    return { ...snapshot, value: options.value }
  }

  function commit(nextValue: TabsValue | undefined, cause: TabsChangeMeta['cause'] = 'programmatic') {
    const previous = currentSnapshot()
    if (previous.value === nextValue) return
    const nextSnapshot: TabsSnapshot = {
      value: nextValue,
      focusedValue: nextValue ?? previous.focusedValue,
      visitedValues: nextValue === undefined ? previous.visitedValues : new Set([...previous.visitedValues, nextValue]),
    }
    if (!isControlled()) store.setSnapshot(nextSnapshot)
    options.onChange?.(nextValue, { previousValue: previous.value, cause })
  }

  function availableItems() {
    return [...items.values()].filter((item) => !item.disabled)
  }

  function moveFocus(direction: 'next' | 'previous' | 'first' | 'last') {
    const available = availableItems()
    if (available.length === 0) return undefined
    const snapshot = currentSnapshot()
    const index = available.findIndex((item) => item.value === snapshot.focusedValue)
    const loop = options.loop ?? true
    const first = 0
    const last = available.length - 1
    let nextIndex = index < 0 ? first : index
    if (direction === 'next') nextIndex = index >= last ? (loop ? first : last) : index + 1
    if (direction === 'previous') nextIndex = index <= first ? (loop ? last : first) : index - 1
    if (direction === 'first') nextIndex = first
    if (direction === 'last') nextIndex = last
    const nextValue = available[nextIndex]?.value
    focus(nextValue, 'keyboard')
    return nextValue
  }

  function focus(value: TabsValue | undefined, cause: TabsChangeMeta['cause'] = 'programmatic') {
    const previous = currentSnapshot()
    if (previous.focusedValue === value) return
    const next = {
      ...previous,
      focusedValue: value,
      visitedValues: value === undefined ? previous.visitedValues : new Set([...previous.visitedValues, value]),
    }
    if (!isControlled()) store.setSnapshot(next)
    if (activationMode() === 'automatic' && value !== undefined) commit(value, cause)
  }

  return {
    getSnapshot: currentSnapshot,
    subscribe: store.subscribe,
    updateOptions(nextOptions) {
      options = nextOptions
      if (isControlled() && store.getSnapshot().value !== options.value) {
        const snapshot = store.getSnapshot()
        store.setSnapshot({
          ...snapshot,
          value: options.value,
          focusedValue: options.value ?? snapshot.focusedValue,
          visitedValues:
            options.value === undefined
              ? snapshot.visitedValues
              : new Set([...snapshot.visitedValues, options.value]),
        })
      }
    },
    registerItem(item) {
      items.set(item.value, item)
    },
    selectFirstAvailable() {
      const current = currentSnapshot()
      if (current.value !== undefined) return current.value
      const firstValue = availableItems()[0]?.value
      if (firstValue !== undefined) store.setSnapshot(createSnapshot(firstValue))
      return firstValue
    },
    unregisterItem(value) {
      const orderedItems = [...items.values()]
      const removedIndex = orderedItems.findIndex((item) => item.value === value)
      items.delete(value)
      if (currentSnapshot().value !== value) return
      const remainingItems = availableItems()
      const fallback = remainingItems[Math.min(Math.max(removedIndex, 0), remainingItems.length - 1)]
      commit(fallback?.value, 'programmatic')
    },
    select: commit,
    focus,
    moveFocus,
    isContentMounted(value) {
      return currentSnapshot().visitedValues.has(value)
    },
  }
}
