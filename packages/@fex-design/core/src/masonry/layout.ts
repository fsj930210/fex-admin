import type {
  MasonryColumns,
  MasonryGap,
  MasonryItemInput,
  MasonryLayoutDetail,
  MasonryPlacement,
} from './types'

export function resolveMasonryGap(gap: number | Partial<MasonryGap> | undefined): MasonryGap {
  if (typeof gap === 'number') return { column: gap, row: gap }
  return { column: gap?.column ?? 0, row: gap?.row ?? gap?.column ?? 0 }
}

export function resolveMasonryColumns(columns: MasonryColumns | undefined, width: number, columnGap = 0): number {
  if (typeof columns === 'number') return Math.max(1, Math.floor(columns))
  if (Array.isArray(columns)) {
    return Math.max(
      1,
      [...columns]
        .sort((a, b) => a.minWidth - b.minWidth)
        .reduce((result, breakpoint) =>
          width >= breakpoint.minWidth ? Math.floor(breakpoint.columns) : result, 1),
    )
  }
  if (columns && 'minColumnWidth' in columns) {
    const minimum = Math.max(1, columns.minColumnWidth)
    const count = Math.max(1, Math.floor((width + columnGap) / (minimum + columnGap)))
    return columns.max === undefined ? count : Math.min(count, Math.max(1, columns.max))
  }
  return 3
}

export function createMasonryLayout(
  width: number,
  items: readonly MasonryItemInput[],
  columns: MasonryColumns | undefined,
  gapInput: number | Partial<MasonryGap> | undefined,
  placement: MasonryPlacement = 'shortest',
  direction: 'ltr' | 'rtl' = 'ltr',
): MasonryLayoutDetail {
  const gap = resolveMasonryGap(gapInput)
  const columnCount = resolveMasonryColumns(columns, width, gap.column)
  const columnWidth = Math.max(0, (width - gap.column * (columnCount - 1)) / columnCount)
  const columnHeights = Array.from({ length: columnCount }, () => 0)
  const positions = [...items]
    .sort((a, b) => a.index - b.index)
    .map((item) => {
      const shortest = columnHeights.indexOf(Math.min(...columnHeights))
      const requested = item.column === undefined ? undefined : Math.max(0, item.column)
      const column = Math.min(
        columnCount - 1,
        requested ?? (placement === 'ordered' ? item.index % columnCount : shortest),
      )
      const top = columnHeights[column] ?? 0
      columnHeights[column] = top + Math.max(0, item.height) + gap.row
      return {
        ...item,
        column,
        top,
        inlineStart: column * (columnWidth + gap.column) * (direction === 'rtl' ? -1 : 1),
        width: columnWidth,
      }
    })

  return {
    width,
    height: Math.max(0, ...columnHeights.map((height) => height - gap.row)),
    columnCount,
    columnWidth,
    items: positions,
  }
}
