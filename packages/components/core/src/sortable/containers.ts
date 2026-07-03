import type { SortableId, SortableItems, SortableLocation } from './types'
import { arrayMove } from './array-move'

export const DEFAULT_SORTABLE_CONTAINER_ID = 'default'

export function normalizeSortableItems(items: SortableItems): Record<string, SortableId[]> {
  if (Array.isArray(items)) {
    return { [DEFAULT_SORTABLE_CONTAINER_ID]: [...items] }
  }

  return Object.fromEntries(Object.entries(items).map(([containerId, value]) => [containerId, [...value]]))
}

export function restoreSortableItems<TItems extends SortableItems>(
  original: TItems,
  normalized: Record<string, SortableId[]>,
): TItems {
  if (Array.isArray(original)) {
    return [...(normalized[DEFAULT_SORTABLE_CONTAINER_ID] ?? [])] as TItems
  }

  return Object.fromEntries(
    Object.keys(original).map((containerId) => [containerId, [...(normalized[containerId] ?? [])]]),
  ) as TItems
}

export function findSortableLocation(
  items: Record<string, SortableId[]>,
  itemId: SortableId,
): SortableLocation | null {
  for (const [containerId, containerItems] of Object.entries(items)) {
    const index = containerItems.indexOf(itemId)
    if (index >= 0) {
      return { containerId, index }
    }
  }

  return null
}

export function moveSortableItem(
  items: Record<string, SortableId[]>,
  from: SortableLocation,
  to: SortableLocation,
): Record<string, SortableId[]> {
  const next = Object.fromEntries(
    Object.entries(items).map(([containerId, containerItems]) => [containerId, [...containerItems]]),
  )

  const sourceItems = next[from.containerId]
  const targetItems = next[to.containerId]
  if (!sourceItems || !targetItems) {
    return items
  }

  if (from.containerId === to.containerId) {
    next[from.containerId] = arrayMove(sourceItems, from.index, to.index)
    return next
  }

  const [moved] = sourceItems.splice(from.index, 1)
  if (!moved) {
    return items
  }

  targetItems.splice(Math.max(0, Math.min(to.index, targetItems.length)), 0, moved)

  return next
}
