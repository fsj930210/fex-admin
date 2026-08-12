import type {
  AnchorActiveGroup,
  AnchorActiveMode,
  AnchorFlatItem,
  AnchorItem,
  AnchorTargetPosition,
} from './types'

export { createAnchorController } from './create-anchor-controller'

export function flattenAnchorItems<TTitle>(
  items: readonly AnchorItem<TTitle>[],
  level = 0,
  parentKeys: readonly string[] = [],
): AnchorFlatItem<TTitle>[] {
  const result: AnchorFlatItem<TTitle>[] = []

  for (const item of items) {
    result.push({ item, level, index: result.length, parentKeys })
    const children = flattenAnchorItems(item.children ?? [], level + 1, [...parentKeys, item.key])
    result.push(...children)
  }

  return result.map((entry, index) => ({ ...entry, index }))
}

export function getAnchorActiveKeys<TTitle>({
  positions,
  scrollTop,
  viewportHeight,
  offset = 0,
  activeOffset = 0,
  mode = 'current',
  scrolledToEnd = false,
}: {
  positions: readonly AnchorTargetPosition<TTitle>[]
  scrollTop: number
  viewportHeight: number
  offset?: number
  activeOffset?: number
  mode?: AnchorActiveMode
  scrolledToEnd?: boolean
}): string[] {
  if (positions.length === 0) return []

  const sorted = [...positions].sort((left, right) => left.top - right.top)
  const activeTop = scrollTop + offset + activeOffset
  let currentIndex = 0

  for (const [index, position] of sorted.entries()) {
    if (position.top > activeTop) break
    currentIndex = index
  }

  if (scrolledToEnd) {
    currentIndex = sorted.length - 1
  }

  const current = sorted[currentIndex]
  if (!current) return []

  return mode === 'progress'
    ? sorted.slice(0, currentIndex + 1).map(({ item }) => item.key)
    : [current.item.key]
}

export function groupAnchorActiveKeys(
  activeKeys: readonly string[],
  items: readonly AnchorFlatItem[],
): AnchorActiveGroup[] {
  const activeSet = new Set(activeKeys)
  const entries = items.filter(({ item }) => activeSet.has(item.key))
  const groups: { keys: string[]; level: number; lastIndex: number }[] = []

  for (const entry of entries) {
    const group = groups.at(-1)
    if (group && group.level === entry.level && group.lastIndex + 1 === entry.index) {
      group.keys.push(entry.item.key)
      group.lastIndex = entry.index
    } else {
      groups.push({ keys: [entry.item.key], level: entry.level, lastIndex: entry.index })
    }
  }

  return groups.map(({ keys, level }) => ({ keys, level }))
}

export function getAnchorHighlightedKeys(
  activeKeys: readonly string[],
  items: readonly AnchorFlatItem[],
) {
  const highlighted = new Set(activeKeys)
  for (const entry of items) {
    if (highlighted.has(entry.item.key)) {
      for (const parentKey of entry.parentKeys) highlighted.add(parentKey)
    }
  }
  return highlighted
}
