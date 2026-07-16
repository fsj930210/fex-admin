import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  getDataGridColumnLayout,
  getDataGridColumnSize,
  getDataGridHeaderLayout,
  getDataGridRenderedCells,
  getDataGridRenderedRows,
  getDataGridRowLayout,
  getDataGridSizingLayout,
  getDataGridVirtualRows,
  getDataGridVisibleLeafColumnCount,
  getDataGridVisibleLeafColumns,
  type DataGridLayoutStyle,
  type DataGridColumnLayoutSource,
  type DataGridPinningTableSource,
  type DataGridRenderingTableSource,
  type DataGridRowRenderingSource,
} from '@fex/components-core/data-grid/layout'
import {
  dataGridBodyClassName,
  dataGridAlignClassName,
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridEmptyClassName,
  dataGridHeaderCellClassName,
  dataGridHeaderContentClassName,
  dataGridHeaderClassName,
  dataGridHeaderRowClassName,
  dataGridHeaderSeparatorClassName,
  dataGridLoadingClassName,
  dataGridPinnedCellClassName,
  dataGridPinnedHeaderCellClassName,
  dataGridPinnedEndClassName,
  dataGridPinnedBottomRowClassName,
  dataGridPinnedBottomEdgeClassName,
  dataGridPinnedStartClassName,
  dataGridPinnedStartEdgeClassName,
  dataGridPinnedTopRowClassName,
  dataGridPinnedTopEdgeClassName,
  dataGridPinnedRowClassName,
  dataGridGroupedRowClassName,
  dataGridPinnedEndEdgeClassName,
  dataGridResizeHandleClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridTableClassName,
  dataGridViewportClassName,
  dataGridVirtualSpacerClassName,
} from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Cell, Header, Row, RowData, TableFeatures } from '@tanstack/react-table'
import { useRef, type ComponentProps, type CSSProperties, type MouseEvent, type ReactNode, type TouchEvent } from 'react'
import type { ReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

export interface DataGridClassName {
  root?: string
  viewport?: string
  table?: string
  header?: string
  headerRow?: string
  headerCell?: string
  body?: string
  row?: string
  cell?: string
  empty?: string
  loading?: string
}

export interface DataGridProps<TFeatures extends TableFeatures, TData extends RowData>
  extends Omit<ComponentProps<'div'>, 'children' | 'className'> {
  table: ReactTable<TFeatures, TData, unknown>
  className?: DataGridClassName
  density?: 'compact' | 'default' | 'comfortable'
  striped?: boolean
  /** Draw a full cell grid, including grouped-header separators. */
  border?: boolean
  loading?: boolean
  loadingContent?: ReactNode
  emptyContent?: ReactNode
  renderSubComponent?: (row: ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number]) => ReactNode
  renderGroupRow?: (row: ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number]) => ReactNode
  virtual?: {
    height: number
    estimateRowHeight?: number
    overscan?: number
  }
  getHeaderProps?: (header: Header<TFeatures, TData>) => ComponentProps<'th'>
  getCellProps?: (cell: Cell<TFeatures, TData>) => ComponentProps<'td'>
  getRowProps?: (row: Row<TFeatures, TData>) => ComponentProps<'tr'>
}

type DataGridRenderColumn<TFeatures extends TableFeatures, TData extends RowData> =
  ReturnType<ReactTable<TFeatures, TData, unknown>['getAllLeafColumns']>[number] &
  DataGridColumnLayoutSource & {
    getIsSorted?: () => false | 'asc' | 'desc'
    getCanResize?: () => boolean
    getIsResizing?: () => boolean
    resetSize?: () => void
  }

type DataGridRenderCell<TFeatures extends TableFeatures, TData extends RowData> =
  Cell<TFeatures, TData> & { column: DataGridRenderColumn<TFeatures, TData> }

type DataGridRenderRow<TFeatures extends TableFeatures, TData extends RowData> =
  Row<TFeatures, TData> &
  DataGridRowRenderingSource<DataGridRenderCell<TFeatures, TData>> & {
    getIsPinned?: () => false | 'top' | 'bottom'
    getPinnedIndex?: () => number
    getIsGrouped?: () => boolean
    getIsSelected?: () => boolean
    getIsExpanded?: () => boolean
  }

type DataGridRenderHeader<TFeatures extends TableFeatures, TData extends RowData> =
  Header<TFeatures, TData> & {
    column: DataGridRenderColumn<TFeatures, TData>
    getResizeHandler?: () => ((event: MouseEvent<HTMLSpanElement> | TouchEvent<HTMLSpanElement>) => void)
  }

type DataGridRenderTable<TFeatures extends TableFeatures, TData extends RowData> =
  ReactTable<TFeatures, TData, unknown> &
  DataGridRenderingTableSource<
    DataGridRenderRow<TFeatures, TData>,
    DataGridRenderColumn<TFeatures, TData>
  > & {
    getTotalSize?: () => number
    getHeaderGroups: () => readonly {
      id: string
      headers: readonly DataGridRenderHeader<TFeatures, TData>[]
    }[]
  }

function getLayoutStyle(style: DataGridLayoutStyle): CSSProperties {
  return {
    ...style,
    backgroundColor: style.backgroundColor ? `var(--${style.backgroundColor})` : undefined,
  }
}

function getAlignClass(align: DataGridColumnMeta['align']) {
  return align ? dataGridAlignClassName[align] : undefined
}

export function DataGrid<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  className,
  density = 'default',
  striped = false,
  border = false,
  loading = false,
  loadingContent = 'Loading…',
  emptyContent = 'No data',
  renderSubComponent,
  renderGroupRow,
  virtual,
  getHeaderProps,
  getCellProps,
  getRowProps,
  ...props
}: DataGridProps<TFeatures, TData>) {
  const renderTable = table as unknown as DataGridRenderTable<TFeatures, TData>
  const pinningTable = table as unknown as DataGridPinningTableSource
  const viewportRef = useRef<HTMLDivElement>(null)
  const renderedRows = getDataGridRenderedRows(renderTable)
  const virtualRows = virtual ? getDataGridVirtualRows(renderTable) : []
  const virtualizer = useVirtualizer({
    count: virtualRows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => virtual?.estimateRowHeight ?? 40,
    overscan: virtual?.overscan ?? 8,
    enabled: Boolean(virtual),
  })
  const virtualItems = virtual ? virtualizer.getVirtualItems() : []
  const virtualTop = virtualItems[0]?.start ?? 0
  const virtualBottom = virtualItems.length
    ? Math.max(0, virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1]!.end)
    : 0
  const visibleLeafColumnCount = Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))
  const visibleLeafColumns = getDataGridVisibleLeafColumns(renderTable)
  const { tableWidth, rootWidth } = getDataGridSizingLayout(renderTable)
  const hasPinnedColumns = Boolean(
    pinningTable.getStartVisibleLeafColumns?.().length || pinningTable.getEndVisibleLeafColumns?.().length,
  )
  return (
    <div
      {...props}
      data-slot="data-grid"
      data-loading={loading || undefined}
      className={cn(dataGridRootClassName({ density, striped, bordered: border }), className?.root)}
      style={{ ...props.style, width: rootWidth, '--data-grid-header-height': 'var(--data-grid-row-height)' } as CSSProperties}
    >
      <div
        ref={virtual ? viewportRef : undefined}
        data-slot="data-grid-viewport"
        className={cn(dataGridViewportClassName, className?.viewport)}
        style={virtual ? { height: virtual.height } : undefined}
      >
        <table
          className={cn(dataGridTableClassName, className?.table)}
          style={{ width: tableWidth === undefined ? '100%' : `${tableWidth}px` }}
        >
          {tableWidth === undefined && !hasPinnedColumns ? null : (
            <colgroup>
              {visibleLeafColumns.map((column) => (
                <col key={column.id} style={{ width: column.getSize?.() }} />
              ))}
            </colgroup>
          )}
          <thead className={cn(dataGridHeaderClassName, className?.header)}>
            {renderTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={cn(dataGridHeaderRowClassName({ bordered: border }), className?.headerRow)}>
                {headerGroup.headers.map((header, headerIndex) => {
                  const renderHeader = header as unknown as DataGridRenderHeader<TFeatures, TData>
                  const meta = renderHeader.column.columnDef.meta as DataGridColumnMeta | undefined
                  const pinning = getDataGridHeaderLayout(renderHeader, pinningTable)
                  const sorted = renderHeader.column.getIsSorted?.()
                  const externalHeaderProps = getHeaderProps?.(header) ?? {}
                  const hasFollowingVisibleHeader = headerGroup.headers
                    .slice(headerIndex + 1)
                    .some((item) => !item.isPlaceholder)
                  return (
                    <th
                      {...externalHeaderProps}
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                      className={cn(
                        dataGridHeaderCellClassName,
                        pinning.pinned && dataGridPinnedCellClassName,
                        pinning.pinned && dataGridPinnedHeaderCellClassName,
                        pinning.pinned === 'start' && dataGridPinnedStartClassName,
                        pinning.pinned === 'end' && dataGridPinnedEndClassName,
                        pinning.isStartEdge && dataGridPinnedStartEdgeClassName,
                        pinning.isEndEdge && dataGridPinnedEndEdgeClassName,
                        !border && hasFollowingVisibleHeader && dataGridHeaderSeparatorClassName,
                        getAlignClass(meta?.align),
                        meta?.headerClassName,
                        className?.headerCell,
                        externalHeaderProps.className,
                      )}
                      style={{ ...getLayoutStyle(pinning.style), ...externalHeaderProps.style }}
                    >
                      {renderHeader.isPlaceholder ? null : (
                        <div data-slot="data-grid-header-content" className={dataGridHeaderContentClassName}>
                          <table.FlexRender header={renderHeader} />
                        </div>
                      )}
                      {renderHeader.colSpan === 1 && renderHeader.column.getCanResize?.() ? (
                        <span
                          role="separator"
                          tabIndex={0}
                          aria-label={`Resize ${renderHeader.column.id}`}
                          data-resizing={renderHeader.column.getIsResizing?.() || undefined}
                          className={dataGridResizeHandleClassName}
                          onDoubleClick={() => renderHeader.column.resetSize?.()}
                          onMouseDown={(event) => renderHeader.getResizeHandler?.()?.(event)}
                          onTouchStart={(event) => renderHeader.getResizeHandler?.()?.(event)}
                        />
                      ) : null}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className={cn(dataGridBodyClassName, className?.body)}>
            {(virtual ? virtualRows : renderedRows).length ? (
              virtual ? (
                <>
                  {virtualTop ? <tr aria-hidden="true"><td colSpan={visibleLeafColumnCount} className={dataGridVirtualSpacerClassName} style={{ height: virtualTop }} /></tr> : null}
                  {virtualItems.map((virtualItem) => {
                    const row = virtualRows[virtualItem.index]
                    return row ? (
                      <DataGridRenderedRow
                        key={row.id}
                        row={row}
                        table={renderTable}
                        className={className}
                        renderSubComponent={renderSubComponent}
                        renderGroupRow={renderGroupRow}
                        getCellProps={getCellProps}
                        getRowProps={getRowProps}
                      />
                    ) : null
                  })}
                  {virtualBottom ? <tr aria-hidden="true"><td colSpan={visibleLeafColumnCount} className={dataGridVirtualSpacerClassName} style={{ height: virtualBottom }} /></tr> : null}
                </>
              ) : renderedRows.map((row) => (
                <DataGridRenderedRow
                  key={row.id}
                  row={row}
                  table={renderTable}
                  className={className}
                  renderSubComponent={renderSubComponent}
                  renderGroupRow={renderGroupRow}
                  getCellProps={getCellProps}
                  getRowProps={getRowProps}
                />
              ))
            ) : (
              <tr>
                <td colSpan={visibleLeafColumnCount} className={cn(dataGridEmptyClassName, className?.empty)}>
                  {emptyContent}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading ? <div className={cn(dataGridLoadingClassName, className?.loading)}>{loadingContent}</div> : null}
    </div>
  )
}

/**
 * Renders one existing table row in a positioned overlay without duplicating
 * its column definitions, cell renderers, sizing tracks, or pinning styles.
 */
export interface DataGridRowOverlayProps<TFeatures extends TableFeatures, TData extends RowData> {
  table: ReactTable<TFeatures, TData, unknown>
  row: ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number]
  style: CSSProperties
  className?: DataGridClassName
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataGridRowOverlay<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  row,
  style,
  className,
  density = 'default',
}: DataGridRowOverlayProps<TFeatures, TData>) {
  const renderTable = table as unknown as DataGridRenderTable<TFeatures, TData>
  const pinningTable = table as unknown as DataGridPinningTableSource
  const { tableWidth } = getDataGridSizingLayout(renderTable)
  const hasPinnedColumns = Boolean(
    pinningTable.getStartVisibleLeafColumns?.().length || pinningTable.getEndVisibleLeafColumns?.().length,
  )
  const visibleLeafColumns = getDataGridVisibleLeafColumns(renderTable)

  return (
    <div
      data-slot="data-grid-row-overlay"
      className={cn(dataGridRootClassName({ density }), className?.root)}
      style={style}
    >
      <table
        className={cn(dataGridTableClassName, className?.table)}
        style={{ width: tableWidth === undefined ? '100%' : `${tableWidth}px` }}
      >
        {tableWidth === undefined && !hasPinnedColumns ? null : (
          <colgroup>
            {visibleLeafColumns.map((column) => (
              <col key={column.id} style={{ width: column.getSize?.() }} />
            ))}
          </colgroup>
        )}
        <tbody>
          <DataGridRenderedRow row={row as DataGridRenderRow<TFeatures, TData>} table={renderTable} className={className} />
        </tbody>
      </table>
    </div>
  )
}

/** Renders a real header and its cells for column drag previews. */
export interface DataGridColumnOverlayProps<TFeatures extends TableFeatures, TData extends RowData> {
  table: ReactTable<TFeatures, TData, unknown>
  header: Header<TFeatures, TData>
  rows?: readonly ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number][]
  style: CSSProperties
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataGridColumnOverlay<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  header,
  rows,
  style,
  density = 'default',
}: DataGridColumnOverlayProps<TFeatures, TData>) {
  const columnId = header.column.id
  const renderedRows = rows ?? table.getRowModel().rows

  return (
    <div
      data-slot="data-grid-column-overlay"
      className={dataGridRootClassName({ density })}
      style={{ ...style, height: 'auto' }}
    >
      <table className={dataGridTableClassName} style={{ width: '100%' }}>
        <colgroup><col style={{ width: getDataGridColumnSize(header.column) }} /></colgroup>
        <thead className={dataGridHeaderClassName}>
          <tr className={dataGridHeaderRowClassName()}>
            <th className={dataGridHeaderCellClassName}>
              <div data-slot="data-grid-header-content" className={dataGridHeaderContentClassName}>
                <table.FlexRender header={header} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className={dataGridBodyClassName}>
          {renderedRows.map((row) => {
            const cell = getDataGridRenderedCells(row).find((item) => item.column.id === columnId)
            return cell ? (
              <tr key={row.id} className={dataGridRowClassName}>
                <td className={dataGridCellClassName}>
                  <div className={dataGridCellContentClassName}><table.FlexRender cell={cell} /></div>
                </td>
              </tr>
            ) : null
          })}
        </tbody>
      </table>
    </div>
  )
}

interface DataGridRenderedRowProps<TFeatures extends TableFeatures, TData extends RowData> {
  row: DataGridRenderRow<TFeatures, TData>
  table: DataGridRenderTable<TFeatures, TData>
  className?: DataGridClassName | undefined
  renderSubComponent?: ((row: Row<TFeatures, TData>) => ReactNode) | undefined
  renderGroupRow?: ((row: Row<TFeatures, TData>) => ReactNode) | undefined
  getCellProps?: ((cell: Cell<TFeatures, TData>) => ComponentProps<'td'>) | undefined
  getRowProps?: ((row: Row<TFeatures, TData>) => ComponentProps<'tr'>) | undefined
}

function DataGridRenderedRow<TFeatures extends TableFeatures, TData extends RowData>({
  row,
  table,
  className,
  renderSubComponent,
  renderGroupRow,
  getCellProps,
  getRowProps,
}: DataGridRenderedRowProps<TFeatures, TData>) {
  const pinned = row.getIsPinned?.()
  const rowLayout = getDataGridRowLayout(row, table)
  const grouped = row.getIsGrouped?.()
  const externalRowProps = getRowProps?.(row) ?? {}
  const rowClassName = cn(
    dataGridRowClassName,
    pinned && dataGridPinnedRowClassName,
    pinned === 'top' && dataGridPinnedTopRowClassName,
    pinned === 'bottom' && dataGridPinnedBottomRowClassName,
    rowLayout.edge === 'top' && dataGridPinnedTopEdgeClassName,
    rowLayout.edge === 'bottom' && dataGridPinnedBottomEdgeClassName,
    grouped && dataGridGroupedRowClassName,
    className?.row,
    externalRowProps.className,
  )
  const rowStyle = { ...getLayoutStyle(rowLayout.style), ...externalRowProps.style }

  if (grouped && renderGroupRow) {
    return (
      <tr
        {...externalRowProps}
        data-state={row.getIsSelected?.() ? 'selected' : undefined}
        data-pinned={pinned || undefined}
        data-grouped="true"
        className={rowClassName}
        style={rowStyle}
      >
        <td colSpan={Math.max(1, getDataGridVisibleLeafColumnCount(table))} className={cn(dataGridCellClassName, className?.cell)}>
          {renderGroupRow(row)}
        </td>
      </tr>
    )
  }
  return (
    <>
      <tr
        {...externalRowProps}
        data-state={row.getIsSelected?.() ? 'selected' : undefined}
        data-pinned={pinned || undefined}
        data-grouped={grouped || undefined}
        className={rowClassName}
        style={rowStyle}
      >
        {getDataGridRenderedCells(row).map((cell) => {
          const meta = cell.column.columnDef.meta as DataGridColumnMeta | undefined
          const pinning = getDataGridColumnLayout(cell.column, table)
          const externalCellProps = getCellProps?.(cell) ?? {}
          return (
            <td
              {...externalCellProps}
              key={cell.id}
              className={cn(
                dataGridCellClassName,
                pinning.pinned && dataGridPinnedCellClassName,
                pinning.pinned === 'start' && dataGridPinnedStartClassName,
                pinning.pinned === 'end' && dataGridPinnedEndClassName,
                pinning.isStartEdge && dataGridPinnedStartEdgeClassName,
                pinning.isEndEdge && dataGridPinnedEndEdgeClassName,
                getAlignClass(meta?.align),
                meta?.cellClassName,
                className?.cell,
                externalCellProps.className,
              )}
              style={{ ...getLayoutStyle(pinning.style), ...externalCellProps.style }}
            >
              <div className={dataGridCellContentClassName}><table.FlexRender cell={cell} /></div>
            </td>
          )
        })}
      </tr>
      {row.getIsExpanded?.() && renderSubComponent ? (
        <tr className={cn(dataGridRowClassName, className?.row)}>
          <td colSpan={getDataGridVisibleLeafColumnCount(table)}>{renderSubComponent(row)}</td>
        </tr>
      ) : null}
    </>
  )
}

export { DataGridColumnVisibility } from './data-grid-column-visibility'
export type { DataGridColumnVisibilityProps } from './data-grid-column-visibility'
export { DataGridFilterInput } from './data-grid-filter-input'
export type { DataGridFilterInputProps } from './data-grid-filter-input'
export { DataGridPagination } from './data-grid-pagination'
export type { DataGridPaginationProps } from './data-grid-pagination'
export { DataGridSortButton } from './data-grid-sort-button'
export type { DataGridSortButtonProps } from './data-grid-sort-button'
export { createDataGridExpandColumn } from './expand-column'
export type { DataGridExpandColumnOptions } from './expand-column'
export { createDataGridSelectionColumn } from './selection-column'
export type { DataGridSelectionColumnOptions } from './selection-column'
export { useDataGridTable } from './use-data-grid-table'
export { useStableDataGridColumns } from './use-stable-data-grid-columns'
export { flexRender, tableFeatures } from '@tanstack/react-table'
export {
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridRowClassName,
  dataGridTableClassName,
} from '@fex/components-styles/data-grid'
export type {
  Cell,
  Column,
  ColumnDef,
  Header,
  Row,
  TableFeatures,
} from '@tanstack/react-table'
