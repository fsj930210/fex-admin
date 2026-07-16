import type { ColumnPinningPosition, RowPinningPosition } from '@tanstack/table-core'

/** Framework-neutral style values that every renderer can map to its host element. */
export interface DataGridLayoutStyle {
  position?: 'relative' | 'sticky'
  width?: number | undefined
  insetInlineStart?: number | undefined
  insetInlineEnd?: number | undefined
  top?: string | undefined
  bottom?: string | undefined
  zIndex?: number | undefined
  backgroundColor?: 'background' | 'muted-background' | undefined
  boxShadow?: string | undefined
}

/** The small, optional capability surface used by the renderer. */
export interface DataGridColumnLayoutSource {
  readonly id: string
  getIsPinned?: () => ColumnPinningPosition
  getIsVisible?: () => boolean
  getSize?: () => number
  getStart?: (position?: ColumnPinningPosition | 'center') => number
  getAfter?: (position?: ColumnPinningPosition | 'center') => number
}

export interface DataGridHeaderLayoutSource {
  readonly column: DataGridColumnLayoutSource & {
    getLeafColumns?: () => readonly DataGridColumnLayoutSource[]
  }
}

export interface DataGridRowLayoutSource {
  getIsPinned?: () => RowPinningPosition
  getPinnedIndex?: () => number
}

export interface DataGridPinningTableSource {
  getStartVisibleLeafColumns?: () => readonly DataGridColumnLayoutSource[]
  getEndVisibleLeafColumns?: () => readonly DataGridColumnLayoutSource[]
  getTopRows?: () => readonly DataGridRowLayoutSource[]
  getBottomRows?: () => readonly DataGridRowLayoutSource[]
}

export interface DataGridCellLayoutSource {
  readonly column: DataGridColumnLayoutSource
}

export interface DataGridRowRenderingSource<
  TCell extends DataGridCellLayoutSource = DataGridCellLayoutSource,
> extends DataGridRowLayoutSource {
  getVisibleCells?: () => readonly TCell[]
  getAllCells?: () => readonly TCell[]
  getStartVisibleCells?: () => readonly TCell[]
  getCenterVisibleCells?: () => readonly TCell[]
  getEndVisibleCells?: () => readonly TCell[]
}

export interface DataGridRenderingTableSource<
  TRow extends DataGridRowRenderingSource = DataGridRowRenderingSource,
  TColumn extends DataGridColumnLayoutSource = DataGridColumnLayoutSource,
> extends DataGridPinningTableSource {
  getRowModel: () => { readonly rows: readonly TRow[] }
  getTopRows?: () => readonly TRow[]
  getCenterRows?: () => readonly TRow[]
  getBottomRows?: () => readonly TRow[]
  getVisibleLeafColumns?: () => readonly TColumn[]
  getAllLeafColumns?: () => readonly TColumn[]
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null
}

function readMethod(value: unknown, key: PropertyKey): ((...args: never[]) => unknown) | undefined {
  if (!isRecord(value)) return undefined
  const candidate = value[key]
  return typeof candidate === 'function'
    ? candidate.bind(value) as (...args: never[]) => unknown
    : undefined
}

export function getDataGridColumnSize(column: unknown, fallback = 150): number {
  const size = readMethod(column, 'getSize')?.()
  return typeof size === 'number' && Number.isFinite(size) ? size : fallback
}

/**
 * Column sizing only owns the table's exact pixel width. The root shrinks when
 * that width fits and remains viewport-sized when horizontal scrolling is
 * required, so a resized table never leaves a bordered blank tail.
 */
export function getDataGridSizingLayout(table: unknown): {
  tableWidth: number | undefined
  rootWidth: string | undefined
} {
  const headers = readMethod(table, 'getFlatHeaders')?.()
  const resizable = Array.isArray(headers)
    && headers.some(header => readMethod(header, 'getResizeHandler') !== undefined)
  const totalSize = resizable ? readMethod(table, 'getTotalSize')?.() : undefined
  const tableWidth = typeof totalSize === 'number' && Number.isFinite(totalSize)
    ? totalSize
    : undefined
  return {
    tableWidth,
    rootWidth: tableWidth === undefined ? undefined : `min(100%, ${tableWidth}px)`,
  }
}

export interface DataGridColumnLayout {
  pinned: ColumnPinningPosition
  isStartEdge: boolean
  isEndEdge: boolean
  style: DataGridLayoutStyle
}

export interface DataGridRowLayout {
  style: DataGridLayoutStyle
  /** The single boundary between a pinned region and scrollable rows. */
  edge: 'top' | 'bottom' | false
}

/** Returns start/center/end cells in the visual order prescribed by pinning. */
export function getDataGridRenderedCells<TCell extends DataGridCellLayoutSource>(
  row: DataGridRowRenderingSource<TCell>,
): readonly TCell[] {
  if (row.getStartVisibleCells && row.getCenterVisibleCells && row.getEndVisibleCells) {
    return [
      ...row.getStartVisibleCells(),
      ...row.getCenterVisibleCells(),
      ...row.getEndVisibleCells(),
    ]
  }
  return row.getVisibleCells?.() ?? row.getAllCells?.() ?? []
}

/** Returns top/center/bottom rows in the visual order prescribed by row pinning. */
export function getDataGridRenderedRows<TRow extends DataGridRowRenderingSource>(
  table: DataGridRenderingTableSource<TRow>,
): readonly TRow[] {
  if (table.getTopRows && table.getCenterRows && table.getBottomRows) {
    return [...table.getTopRows(), ...table.getCenterRows(), ...table.getBottomRows()]
  }
  return table.getRowModel().rows
}

export function getDataGridVirtualRows<TRow extends DataGridRowRenderingSource>(
  table: DataGridRenderingTableSource<TRow>,
): readonly TRow[] {
  return table.getCenterRows?.() ?? table.getRowModel().rows
}

export function getDataGridVisibleLeafColumnCount(table: DataGridRenderingTableSource): number {
  return (table.getVisibleLeafColumns?.() ?? table.getAllLeafColumns?.() ?? []).length
}

/** Leaf columns are the single sizing source for colgroup and every adapter. */
export function getDataGridVisibleLeafColumns<TColumn extends DataGridColumnLayoutSource>(
  table: DataGridRenderingTableSource<DataGridRowRenderingSource, TColumn>,
): readonly TColumn[] {
  return table.getVisibleLeafColumns?.() ?? table.getAllLeafColumns?.() ?? []
}

function getPinnedColumns(table: DataGridPinningTableSource, position: 'start' | 'end') {
  return position === 'start'
    ? table.getStartVisibleLeafColumns?.() ?? []
    : table.getEndVisibleLeafColumns?.() ?? []
}

/**
 * Resolves column offsets and stacking without relying on optional ordering APIs.
 * Column ordering is intentionally not required: the pinning feature itself owns
 * the ordered start/end leaf collections, which also makes edge shadows reliable.
 */
export function getDataGridColumnLayout(
  column: DataGridColumnLayoutSource,
  table: DataGridPinningTableSource,
  layer: 'body' | 'header' = 'body',
): DataGridColumnLayout {
  const pinned = column.getIsPinned?.() ?? false
  if (!pinned) {
    return {
      pinned,
      isStartEdge: false,
      isEndEdge: false,
      style: {
        position: 'relative',
        width: column.getSize?.(),
        zIndex: 1,
        // A draggable header becomes a composited layer while its neighbours
        // animate. Give every header cell an explicit surface so the layer
        // never paints differently from the static table header.
        ...(layer === 'header' ? { backgroundColor: 'muted-background' } : {}),
      },
    }
  }

  const pinnedColumns = getPinnedColumns(table, pinned)
  const index = pinnedColumns.findIndex((item) => item.id === column.id)
  const isStartEdge = pinned === 'start' && index === pinnedColumns.length - 1
  const isEndEdge = pinned === 'end' && index === 0
  const baseZIndex = pinned === 'start' ? 20 : 19

  return {
    pinned,
    isStartEdge,
    isEndEdge,
    style: {
      position: 'sticky',
      width: column.getSize?.(),
      insetInlineStart: pinned === 'start' ? column.getStart?.('start') : undefined,
      insetInlineEnd: pinned === 'end' ? column.getAfter?.('end') : undefined,
      zIndex: baseZIndex + (layer === 'header' ? 10 : 0),
      backgroundColor: layer === 'header' ? 'muted-background' : 'background',
    },
  }
}

/** Applies fixed layout to a grouped header only when every leaf shares one zone. */
export function getDataGridHeaderLayout(
  header: DataGridHeaderLayoutSource,
  table: DataGridPinningTableSource,
): DataGridColumnLayout {
  const leaves = header.column.getLeafColumns?.().filter((column) => column.getIsVisible?.() !== false) ?? [header.column]
  const first = leaves[0]
  const pinned = first?.getIsPinned?.() ?? false
  if (leaves.length > 1 && (!pinned || leaves.some((column) => column.getIsPinned?.() !== pinned))) {
    // A mixed or unpinned group must keep the browser's colSpan sizing. Applying
    // the group column's single-leaf size here collapses the real header group.
    return {
      pinned: false,
      isStartEdge: false,
      isEndEdge: false,
      style: { position: 'relative', zIndex: 1, backgroundColor: 'muted-background' },
    }
  }
  if (!first || !pinned) {
    return getDataGridColumnLayout(header.column, table, 'header')
  }

  const layout = getDataGridColumnLayout(first, table, 'header')
  const offsets = leaves.map((column) =>
    pinned === 'start' ? column.getStart?.('start') ?? 0 : column.getAfter?.('end') ?? 0,
  )
  const edgeColumn = pinned === 'start' ? leaves.at(-1) : leaves[0]
  const pinnedColumns = getPinnedColumns(table, pinned)
  const edgeIndex = pinnedColumns.findIndex((column) => column.id === edgeColumn?.id)

  return {
    pinned,
    isStartEdge: pinned === 'start' && edgeIndex === pinnedColumns.length - 1,
    isEndEdge: pinned === 'end' && edgeIndex === 0,
    style: {
      ...layout.style,
      width: leaves.reduce((total, column) => total + (column.getSize?.() ?? 0), 0),
      insetInlineStart: pinned === 'start' ? Math.min(...offsets) : undefined,
      insetInlineEnd: pinned === 'end' ? Math.min(...offsets) : undefined,
    },
  }
}

export function getDataGridRowLayout(
  row: DataGridRowLayoutSource,
  table: DataGridPinningTableSource,
  rowHeightVariable = '--data-grid-row-height',
): DataGridRowLayout {
  const pinned = row.getIsPinned?.() ?? false
  const index = row.getPinnedIndex?.() ?? -1
  if (!pinned || index < 0) return { style: {}, edge: false }

  if (pinned === 'top') {
    const topCount = table.getTopRows?.().length ?? 0
    return {
      style: {
        position: 'sticky',
        top: `calc(var(--data-grid-header-height, 0px) + ${index} * var(${rowHeightVariable}))`,
        zIndex: 20,
        backgroundColor: 'background',
      },
      edge: index === topCount - 1 ? 'top' : false,
    }
  }

  const bottomCount = table.getBottomRows?.().length ?? 0
  return {
    style: {
      position: 'sticky',
      bottom: `calc(${Math.max(bottomCount - index - 1, 0)} * var(${rowHeightVariable}))`,
      zIndex: 20,
      backgroundColor: 'background',
    },
    edge: index === 0 ? 'bottom' : false,
  }
}
