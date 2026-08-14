import { createMasonryLayout } from './layout'
import type {
  MasonryControllerOptions,
  MasonryItemInput,
  MasonryKey,
  MasonryLayoutDetail,
} from './types'

export interface MasonryController {
  getSnapshot(): MasonryLayoutDetail
  subscribe(listener: () => void): () => void
  setWidth(width: number): void
  setOptions(options: MasonryControllerOptions): void
  setItem(item: MasonryItemInput): void
  removeItem(key: MasonryKey): void
  destroy(): void
}

export function createMasonryController(initial: MasonryControllerOptions = {}): MasonryController {
  let width = 0
  let options = initial
  const items = new Map<MasonryKey, MasonryItemInput>()
  const listeners = new Set<() => void>()
  let snapshot = createMasonryLayout(width, [], options.columns, options.gap, options.placement, options.direction)
  let scheduled = false

  const isEqual = (left: MasonryLayoutDetail, right: MasonryLayoutDetail) =>
    left.width === right.width &&
    left.height === right.height &&
    left.columnCount === right.columnCount &&
    left.columnWidth === right.columnWidth &&
    left.items.length === right.items.length &&
    left.items.every((item, index) => {
      const other = right.items[index]
      return other !== undefined && item.key === other.key && item.index === other.index &&
        item.height === other.height && item.column === other.column && item.top === other.top &&
        item.inlineStart === other.inlineStart && item.width === other.width
    })

  const publish = () => {
    scheduled = false
    const next = createMasonryLayout(
      width,
      [...items.values()],
      options.columns,
      options.gap,
      options.placement,
      options.direction,
    )
    if (isEqual(next, snapshot)) return
    snapshot = next
    for (const listener of listeners) listener()
    options.onLayoutChange?.(snapshot)
  }

  const schedulePublish = () => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(publish)
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setWidth(next) {
      if (width === next) return
      width = Math.max(0, next)
      schedulePublish()
    },
    setOptions(next) {
      options = next
      schedulePublish()
    },
    setItem(item) {
      const previous = items.get(item.key)
      if (
        previous?.height === item.height &&
        previous.index === item.index &&
        previous.column === item.column
      ) return
      items.set(item.key, item)
      schedulePublish()
    },
    removeItem(key) {
      if (items.delete(key)) schedulePublish()
    },
    destroy() {
      items.clear()
      listeners.clear()
    },
  }
}
