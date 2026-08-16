export interface OverflowItems<T> {
  visibleItems: readonly T[]
  overflowItems: readonly T[]
  overflowCount: number
}

export function splitOverflowItems<T>(
  items: readonly T[],
  maxCount?: number,
): OverflowItems<T> {
  if (maxCount === undefined || maxCount >= items.length) {
    return { visibleItems: items, overflowItems: [], overflowCount: 0 }
  }
  const visibleCount = Math.max(0, Math.trunc(maxCount))
  const visibleItems = items.slice(0, visibleCount)
  const overflowItems = items.slice(visibleCount)
  return { visibleItems, overflowItems, overflowCount: overflowItems.length }
}
