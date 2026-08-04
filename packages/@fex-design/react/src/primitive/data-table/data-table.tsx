import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  getDataTableColumnLayout,
  getDataTableColumnSize,
  getDataTableHeaderLayout,
  getDataTableRenderedCells,
  getDataTableRenderedRows,
  getDataTableRowLayout,
  getDataTableSizingLayout,
  getDataTableVirtualRows,
  getDataTableVisibleLeafColumnCount,
  getDataTableVisibleLeafColumns,
  type DataTableLayoutStyle,
  type DataTableColumnLayoutSource,
  type DataTablePinningTableSource,
  type DataTableRenderingTableSource,
  type DataTableRowRenderingSource,
} from '@fex-design/core/data-table/layout'
import {
  dataTableBodyClassName,
  dataTableAlignClassName,
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableEmptyClassName,
  dataTableHeaderCellClassName,
  dataTableHeaderContentClassName,
  dataTableHeaderClassName,
  dataTableHeaderRowClassName,
  dataTableHeaderSeparatorClassName,
  dataTableLoadingClassName,
  dataTablePinnedCellClassName,
  dataTablePinnedHeaderCellClassName,
  dataTablePinnedEndClassName,
  dataTablePinnedBottomRowClassName,
  dataTablePinnedBottomEdgeClassName,
  dataTablePinnedStartClassName,
  dataTablePinnedStartEdgeClassName,
  dataTablePinnedTopRowClassName,
  dataTablePinnedTopEdgeClassName,
  dataTablePinnedRowClassName,
  dataTableGroupedRowClassName,
  dataTablePinnedEndEdgeClassName,
  dataTableResizeHandleClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableClassName,
  dataTableViewportClassName,
  dataTableVirtualSpacerClassName,
} from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { Cell, Header, Row, RowData, TableFeatures } from '@tanstack/react-table'
import {
  useRef,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from 'react'
import type { ReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

export interface DataTableClassName {
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

export interface DataTableProps<TFeatures extends TableFeatures, TData extends RowData> extends Omit<
  ComponentProps<'div'>,
  'children' | 'className'
> {
  table: ReactTable<TFeatures, TData, unknown>
  className?: DataTableClassName
  density?: 'compact' | 'default' | 'comfortable'
  striped?: boolean
  /** Draw a full cell grid, including grouped-header separators. */
  border?: boolean
  loading?: boolean
  loadingContent?: ReactNode
  emptyContent?: ReactNode
  renderSubComponent?: (
    row: ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number],
  ) => ReactNode
  renderGroupRow?: (
    row: ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number],
  ) => ReactNode
  virtual?: {
    height: number
    estimateRowHeight?: number
    overscan?: number
  }
  getHeaderProps?: (header: Header<TFeatures, TData>) => ComponentProps<'th'>
  getCellProps?: (cell: Cell<TFeatures, TData>) => ComponentProps<'td'>
  getRowProps?: (row: Row<TFeatures, TData>) => ComponentProps<'tr'>
}

type DataTableRenderColumn<TFeatures extends TableFeatures, TData extends RowData> = ReturnType<
  ReactTable<TFeatures, TData, unknown>['getAllLeafColumns']
>[number] &
  DataTableColumnLayoutSource & {
    getIsSorted?: () => false | 'asc' | 'desc'
    getCanResize?: () => boolean
    getIsResizing?: () => boolean
    resetSize?: () => void
  }

type DataTableRenderCell<TFeatures extends TableFeatures, TData extends RowData> = Cell<
  TFeatures,
  TData
> & { column: DataTableRenderColumn<TFeatures, TData> }

type DataTableRenderRow<TFeatures extends TableFeatures, TData extends RowData> = Row<
  TFeatures,
  TData
> &
  DataTableRowRenderingSource<DataTableRenderCell<TFeatures, TData>> & {
    getIsPinned?: () => false | 'top' | 'bottom'
    getPinnedIndex?: () => number
    getIsGrouped?: () => boolean
    getIsSelected?: () => boolean
    getIsExpanded?: () => boolean
  }

type DataTableRenderHeader<TFeatures extends TableFeatures, TData extends RowData> = Header<
  TFeatures,
  TData
> & {
  column: DataTableRenderColumn<TFeatures, TData>
  getResizeHandler?: () => (
    event: MouseEvent<HTMLSpanElement> | TouchEvent<HTMLSpanElement>,
  ) => void
}

type DataTableRenderTable<TFeatures extends TableFeatures, TData extends RowData> = ReactTable<
  TFeatures,
  TData,
  unknown
> &
  DataTableRenderingTableSource<
    DataTableRenderRow<TFeatures, TData>,
    DataTableRenderColumn<TFeatures, TData>
  > & {
    getTotalSize?: () => number
    getHeaderGroups: () => readonly {
      id: string
      headers: readonly DataTableRenderHeader<TFeatures, TData>[]
    }[]
  }

function getLayoutStyle(style: DataTableLayoutStyle): CSSProperties {
  return {
    ...style,
    backgroundColor: style.backgroundColor ? `var(--${style.backgroundColor})` : undefined,
  }
}

function getAlignClass(align: DataTableColumnMeta['align']) {
  return align ? dataTableAlignClassName[align] : undefined
}

export function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
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
}: DataTableProps<TFeatures, TData>) {
  const renderTable = table as unknown as DataTableRenderTable<TFeatures, TData>
  const pinningTable = table as unknown as DataTablePinningTableSource
  const viewportRef = useRef<HTMLDivElement>(null)
  const renderedRows = getDataTableRenderedRows(renderTable)
  const virtualRows = virtual ? getDataTableVirtualRows(renderTable) : []
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
  const visibleLeafColumnCount = Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))
  const visibleLeafColumns = getDataTableVisibleLeafColumns(renderTable)
  const { tableWidth, rootWidth } = getDataTableSizingLayout(renderTable)
  const hasPinnedColumns = Boolean(
    pinningTable.getStartVisibleLeafColumns?.().length ||
    pinningTable.getEndVisibleLeafColumns?.().length,
  )
  return (
    <div
      {...props}
      data-slot="data-table"
      data-loading={loading || undefined}
      className={cn(dataTableRootClassName({ density, striped, bordered: border }), className?.root)}
      style={
        {
          ...props.style,
          width: rootWidth,
          '--data-table-header-height': 'var(--data-table-row-height)',
        } as CSSProperties
      }
    >
      <div
        ref={virtual ? viewportRef : undefined}
        data-slot="data-table-viewport"
        className={cn(dataTableViewportClassName, className?.viewport)}
        style={virtual ? { height: virtual.height } : undefined}
      >
        <table
          className={cn(dataTableClassName, className?.table)}
          style={{ width: tableWidth === undefined ? '100%' : `${tableWidth}px` }}
        >
          {tableWidth === undefined && !hasPinnedColumns ? null : (
            <colgroup>
              {visibleLeafColumns.map((column) => (
                <col key={column.id} style={{ width: column.getSize?.() }} />
              ))}
            </colgroup>
          )}
          <thead className={cn(dataTableHeaderClassName, className?.header)}>
            {renderTable.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className={cn(
                  dataTableHeaderRowClassName({ bordered: border }),
                  className?.headerRow,
                )}
              >
                {headerGroup.headers.map((header, headerIndex) => {
                  const renderHeader = header as unknown as DataTableRenderHeader<TFeatures, TData>
                  const meta = renderHeader.column.columnDef.meta as DataTableColumnMeta | undefined
                  const pinning = getDataTableHeaderLayout(renderHeader, pinningTable)
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
                      aria-sort={
                        sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                            ? 'descending'
                            : undefined
                      }
                      className={cn(
                        dataTableHeaderCellClassName,
                        pinning.pinned && dataTablePinnedCellClassName,
                        pinning.pinned && dataTablePinnedHeaderCellClassName,
                        pinning.pinned === 'start' && dataTablePinnedStartClassName,
                        pinning.pinned === 'end' && dataTablePinnedEndClassName,
                        pinning.isStartEdge && dataTablePinnedStartEdgeClassName,
                        pinning.isEndEdge && dataTablePinnedEndEdgeClassName,
                        !border && hasFollowingVisibleHeader && dataTableHeaderSeparatorClassName,
                        getAlignClass(meta?.align),
                        meta?.headerClassName,
                        className?.headerCell,
                        externalHeaderProps.className,
                      )}
                      style={{ ...getLayoutStyle(pinning.style), ...externalHeaderProps.style }}
                    >
                      {renderHeader.isPlaceholder ? null : (
                        <div
                          data-slot="data-table-header-content"
                          className={dataTableHeaderContentClassName}
                        >
                          <table.FlexRender header={renderHeader} />
                        </div>
                      )}
                      {renderHeader.colSpan === 1 && renderHeader.column.getCanResize?.() ? (
                        <span
                          role="separator"
                          tabIndex={0}
                          aria-label={`Resize ${renderHeader.column.id}`}
                          data-resizing={renderHeader.column.getIsResizing?.() || undefined}
                          className={dataTableResizeHandleClassName}
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
          <tbody className={cn(dataTableBodyClassName, className?.body)}>
            {(virtual ? virtualRows : renderedRows).length ? (
              virtual ? (
                <>
                  {virtualTop ? (
                    <tr aria-hidden="true">
                      <td
                        colSpan={visibleLeafColumnCount}
                        className={dataTableVirtualSpacerClassName}
                        style={{ height: virtualTop }}
                      />
                    </tr>
                  ) : null}
                  {virtualItems.map((virtualItem) => {
                    const row = virtualRows[virtualItem.index]
                    return row ? (
                      <DataTableRenderedRow
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
                  {virtualBottom ? (
                    <tr aria-hidden="true">
                      <td
                        colSpan={visibleLeafColumnCount}
                        className={dataTableVirtualSpacerClassName}
                        style={{ height: virtualBottom }}
                      />
                    </tr>
                  ) : null}
                </>
              ) : (
                renderedRows.map((row) => (
                  <DataTableRenderedRow
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
              )
            ) : (
              <tr>
                <td
                  colSpan={visibleLeafColumnCount}
                  className={cn(dataTableEmptyClassName, className?.empty)}
                >
                  {emptyContent}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading ? (
        <div className={cn(dataTableLoadingClassName, className?.loading)}>{loadingContent}</div>
      ) : null}
    </div>
  )
}

/**
 * Renders one existing table row in a positioned overlay without duplicating
 * its column definitions, cell renderers, sizing tracks, or pinning styles.
 */
export interface DataTableRowOverlayProps<TFeatures extends TableFeatures, TData extends RowData> {
  table: ReactTable<TFeatures, TData, unknown>
  row: ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number]
  style: CSSProperties
  className?: DataTableClassName
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataTableRowOverlay<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  row,
  style,
  className,
  density = 'default',
}: DataTableRowOverlayProps<TFeatures, TData>) {
  const renderTable = table as unknown as DataTableRenderTable<TFeatures, TData>
  const pinningTable = table as unknown as DataTablePinningTableSource
  const { tableWidth } = getDataTableSizingLayout(renderTable)
  const hasPinnedColumns = Boolean(
    pinningTable.getStartVisibleLeafColumns?.().length ||
    pinningTable.getEndVisibleLeafColumns?.().length,
  )
  const visibleLeafColumns = getDataTableVisibleLeafColumns(renderTable)

  return (
    <div
      data-slot="data-table-row-overlay"
      className={cn(dataTableRootClassName({ density }), className?.root)}
      style={style}
    >
      <table
        className={cn(dataTableClassName, className?.table)}
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
          <DataTableRenderedRow
            row={row as DataTableRenderRow<TFeatures, TData>}
            table={renderTable}
            className={className}
          />
        </tbody>
      </table>
    </div>
  )
}

/** Renders a real header and its cells for column drag previews. */
export interface DataTableColumnOverlayProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: ReactTable<TFeatures, TData, unknown>
  header: Header<TFeatures, TData>
  rows?: readonly ReturnType<ReactTable<TFeatures, TData>['getRowModel']>['rows'][number][]
  style: CSSProperties
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataTableColumnOverlay<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  header,
  rows,
  style,
  density = 'default',
}: DataTableColumnOverlayProps<TFeatures, TData>) {
  const columnId = header.column.id
  const renderedRows = rows ?? table.getRowModel().rows

  return (
    <div
      data-slot="data-table-column-overlay"
      className={dataTableRootClassName({ density })}
      style={{ ...style, height: 'auto' }}
    >
      <table className={dataTableClassName} style={{ width: '100%' }}>
        <colgroup>
          <col style={{ width: getDataTableColumnSize(header.column) }} />
        </colgroup>
        <thead className={dataTableHeaderClassName}>
          <tr className={dataTableHeaderRowClassName()}>
            <th className={dataTableHeaderCellClassName}>
              <div data-slot="data-table-header-content" className={dataTableHeaderContentClassName}>
                <table.FlexRender header={header} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className={dataTableBodyClassName}>
          {renderedRows.map((row) => {
            const cell = getDataTableRenderedCells(row).find((item) => item.column.id === columnId)
            return cell ? (
              <tr key={row.id} className={dataTableRowClassName}>
                <td className={dataTableCellClassName}>
                  <div className={dataTableCellContentClassName}>
                    <table.FlexRender cell={cell} />
                  </div>
                </td>
              </tr>
            ) : null
          })}
        </tbody>
      </table>
    </div>
  )
}

interface DataTableRenderedRowProps<TFeatures extends TableFeatures, TData extends RowData> {
  row: DataTableRenderRow<TFeatures, TData>
  table: DataTableRenderTable<TFeatures, TData>
  className?: DataTableClassName | undefined
  renderSubComponent?: ((row: Row<TFeatures, TData>) => ReactNode) | undefined
  renderGroupRow?: ((row: Row<TFeatures, TData>) => ReactNode) | undefined
  getCellProps?: ((cell: Cell<TFeatures, TData>) => ComponentProps<'td'>) | undefined
  getRowProps?: ((row: Row<TFeatures, TData>) => ComponentProps<'tr'>) | undefined
}

function DataTableRenderedRow<TFeatures extends TableFeatures, TData extends RowData>({
  row,
  table,
  className,
  renderSubComponent,
  renderGroupRow,
  getCellProps,
  getRowProps,
}: DataTableRenderedRowProps<TFeatures, TData>) {
  const pinned = row.getIsPinned?.()
  const rowLayout = getDataTableRowLayout(row, table)
  const grouped = row.getIsGrouped?.()
  const externalRowProps = getRowProps?.(row) ?? {}
  const rowClassName = cn(
    dataTableRowClassName,
    pinned && dataTablePinnedRowClassName,
    pinned === 'top' && dataTablePinnedTopRowClassName,
    pinned === 'bottom' && dataTablePinnedBottomRowClassName,
    rowLayout.edge === 'top' && dataTablePinnedTopEdgeClassName,
    rowLayout.edge === 'bottom' && dataTablePinnedBottomEdgeClassName,
    grouped && dataTableGroupedRowClassName,
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
        <td
          colSpan={Math.max(1, getDataTableVisibleLeafColumnCount(table))}
          className={cn(dataTableCellClassName, className?.cell)}
        >
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
        {getDataTableRenderedCells(row).map((cell) => {
          const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
          const pinning = getDataTableColumnLayout(cell.column, table)
          const externalCellProps = getCellProps?.(cell) ?? {}
          return (
            <td
              {...externalCellProps}
              key={cell.id}
              className={cn(
                dataTableCellClassName,
                pinning.pinned && dataTablePinnedCellClassName,
                pinning.pinned === 'start' && dataTablePinnedStartClassName,
                pinning.pinned === 'end' && dataTablePinnedEndClassName,
                pinning.isStartEdge && dataTablePinnedStartEdgeClassName,
                pinning.isEndEdge && dataTablePinnedEndEdgeClassName,
                getAlignClass(meta?.align),
                meta?.cellClassName,
                className?.cell,
                externalCellProps.className,
              )}
              style={{ ...getLayoutStyle(pinning.style), ...externalCellProps.style }}
            >
              <div className={dataTableCellContentClassName}>
                <table.FlexRender cell={cell} />
              </div>
            </td>
          )
        })}
      </tr>
      {row.getIsExpanded?.() && renderSubComponent ? (
        <tr className={cn(dataTableRowClassName, className?.row)}>
          <td colSpan={getDataTableVisibleLeafColumnCount(table)}>{renderSubComponent(row)}</td>
        </tr>
      ) : null}
    </>
  )
}

export { DataTableColumnVisibility } from './data-table-column-visibility'
export type { DataTableColumnVisibilityProps } from './data-table-column-visibility'
export { DataTableFilterInput } from './data-table-filter-input'
export type { DataTableFilterInputProps } from './data-table-filter-input'
export { DataTablePagination } from './data-table-pagination'
export type { DataTablePaginationProps } from './data-table-pagination'
export { DataTableSortButton } from './data-table-sort-button'
export type { DataTableSortButtonProps } from './data-table-sort-button'
export { createDataTableExpandColumn } from './expand-column'
export type { DataTableExpandColumnOptions } from './expand-column'
export { createDataTableSelectionColumn } from './selection-column'
export type { DataTableSelectionColumnOptions } from './selection-column'
export { useDataTable } from './use-data-table'
export { useStableDataTableColumns } from './use-stable-data-table-columns'
export { flexRender, tableFeatures } from '@tanstack/react-table'
export {
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableRowClassName,
  dataTableClassName,
} from '@fex-design/styles/data-table'
export type { Cell, Column, ColumnDef, Header, Row, TableFeatures } from '@tanstack/react-table'
