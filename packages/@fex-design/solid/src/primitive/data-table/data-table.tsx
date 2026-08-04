import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  getDataTableColumnLayout,
  getDataTableHeaderLayout,
  getDataTableRenderedCells,
  getDataTableRenderedRows,
  getDataTableRowLayout,
  getDataTableSizingLayout,
  getDataTableVirtualRows,
  getDataTableVisibleLeafColumnCount,
  getDataTableVisibleLeafColumns,
  type DataTablePinningTableSource,
  type DataTableRenderingTableSource,
  type DataTableRowRenderingSource,
} from '@fex-design/core/data-table/layout'
import {
  dataTableAlignClassName,
  dataTableBodyClassName,
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableEmptyClassName,
  dataTableGroupedRowClassName,
  dataTableHeaderCellClassName,
  dataTableHeaderClassName,
  dataTableHeaderContentClassName,
  dataTableHeaderRowClassName,
  dataTableHeaderSeparatorClassName,
  dataTableLoadingClassName,
  dataTablePinnedBottomEdgeClassName,
  dataTablePinnedBottomRowClassName,
  dataTablePinnedCellClassName,
  dataTablePinnedEndClassName,
  dataTablePinnedEndEdgeClassName,
  dataTablePinnedHeaderCellClassName,
  dataTablePinnedRowClassName,
  dataTablePinnedStartClassName,
  dataTablePinnedStartEdgeClassName,
  dataTablePinnedTopEdgeClassName,
  dataTablePinnedTopRowClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableResizeHandleClassName,
  dataTableClassName,
  dataTableViewportClassName,
  dataTableVirtualSpacerClassName,
} from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { Cell, Header, Row, RowData, TableFeatures } from '@tanstack/table-core'
import { For, Show, splitProps, type JSX } from 'solid-js'
import { createVirtualizer } from '@tanstack/solid-virtual'
import type { SolidDataTable } from '../../primitives/create-data-table'

export interface DataTableClass {
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
  JSX.HTMLAttributes<HTMLDivElement>,
  'class' | 'children'
> {
  table: SolidDataTable<TFeatures, TData>
  class?: DataTableClass
  density?: 'compact' | 'default' | 'comfortable'
  striped?: boolean
  border?: boolean
  loading?: boolean
  loadingContent?: JSX.Element
  emptyContent?: JSX.Element
  renderSubComponent?: (row: Row<TFeatures, TData>) => JSX.Element
  renderGroupRow?: (row: Row<TFeatures, TData>) => JSX.Element
  virtual?: { height: number; estimateRowHeight?: number; overscan?: number }
  getRowProps?: (row: Row<TFeatures, TData>) => JSX.HTMLAttributes<HTMLTableRowElement>
  getCellProps?: (cell: Cell<TFeatures, TData>) => JSX.TdHTMLAttributes<HTMLTableCellElement>
  getHeaderProps?: (header: Header<TFeatures, TData>) => JSX.ThHTMLAttributes<HTMLTableCellElement>
}

type RenderTable<TFeatures extends TableFeatures, TData extends RowData> = SolidDataTable<
  TFeatures,
  TData
> &
  DataTableRenderingTableSource

function renderTemplate(template: unknown, context: unknown): JSX.Element {
  if (typeof template === 'function') return template(context) as JSX.Element
  return template as JSX.Element
}

function layoutStyle(
  style: ReturnType<typeof getDataTableColumnLayout>['style'],
): JSX.CSSProperties {
  return {
    position: style.position,
    width: style.width === undefined ? undefined : `${style.width}px`,
    'inset-inline-start':
      style.insetInlineStart === undefined ? undefined : `${style.insetInlineStart}px`,
    'inset-inline-end':
      style.insetInlineEnd === undefined ? undefined : `${style.insetInlineEnd}px`,
    top: style.top,
    bottom: style.bottom,
    'z-index': style.zIndex,
    'background-color': style.backgroundColor ? `var(--${style.backgroundColor})` : undefined,
    'box-shadow': style.boxShadow,
  }
}

function objectStyle(style: JSX.CSSProperties | string | undefined): JSX.CSSProperties {
  return typeof style === 'object' && style !== null ? style : {}
}

export function DataTable<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataTableProps<TFeatures, TData>,
) {
  const [local, rest] = splitProps(props, [
    'table',
    'class',
    'density',
    'striped',
    'border',
    'loading',
    'loadingContent',
    'emptyContent',
    'renderSubComponent',
    'renderGroupRow',
    'virtual',
    'getRowProps',
    'getCellProps',
    'getHeaderProps',
  ])
  const renderTable = local.table as unknown as RenderTable<TFeatures, TData>
  const pinningTable = local.table as unknown as DataTablePinningTableSource
  const snapshot = () => local.table.dataTableSnapshot()
  const renderReactiveTemplate = (template: unknown, context: unknown) => {
    snapshot()
    return renderTemplate(template, context)
  }
  let viewportElement: HTMLDivElement | undefined = undefined
  const renderedRows = () => {
    snapshot()
    return getDataTableRenderedRows(renderTable)
  }
  const virtualRows = () => {
    snapshot()
    return getDataTableVirtualRows(renderTable)
  }
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    get count() {
      return local.virtual ? virtualRows().length : 0
    },
    getScrollElement: () => viewportElement ?? null,
    estimateSize: () => local.virtual?.estimateRowHeight ?? 40,
    get overscan() {
      return local.virtual?.overscan ?? 8
    },
  })
  const rows = () =>
    local.virtual
      ? virtualizer
          .getVirtualItems()
          .map((item) => virtualRows()[item.index])
          .filter((row) => row !== undefined)
      : renderedRows()
  const virtualTop = () => virtualizer.getVirtualItems()[0]?.start ?? 0
  const virtualBottom = () => {
    const items = virtualizer.getVirtualItems()
    const last = items.at(-1)
    return last ? Math.max(0, virtualizer.getTotalSize() - last.end) : 0
  }
  const columns = () => {
    snapshot()
    return getDataTableVisibleLeafColumns(renderTable)
  }
  const headerGroups = () => {
    snapshot()
    return local.table.getHeaderGroups()
  }
  const sizingLayout = () => {
    snapshot()
    return getDataTableSizingLayout(local.table)
  }
  const tableWidth = () => sizingLayout().tableWidth

  return (
    <div
      {...rest}
      data-slot="data-table"
      data-loading={local.loading || undefined}
      class={cn(
        dataTableRootClassName({
          density: local.density ?? 'default',
          striped: local.striped ?? false,
          bordered: local.border ?? false,
        }),
        local.class?.root,
      )}
      style={{
        '--data-table-header-height': 'var(--data-table-row-height)',
        width: sizingLayout().rootWidth,
        ...objectStyle(rest.style),
      }}
    >
      <div
        ref={viewportElement}
        data-slot="data-table-viewport"
        class={cn(dataTableViewportClassName, local.class?.viewport)}
        style={local.virtual ? { height: `${local.virtual.height}px` } : undefined}
      >
        <table
          class={cn(dataTableClassName, local.class?.table)}
          style={{ width: tableWidth() === undefined ? '100%' : `${tableWidth()}px` }}
        >
          <Show when={tableWidth() !== undefined}>
            <colgroup>
              <For each={columns()}>
                {(column) => (
                  <col
                    style={{
                      width:
                        column.getSize?.() === undefined ? undefined : `${column.getSize?.()}px`,
                    }}
                  />
                )}
              </For>
            </colgroup>
          </Show>
          <thead class={cn(dataTableHeaderClassName, local.class?.header)}>
            <For each={headerGroups()}>
              {(headerGroup) => (
                <tr
                  class={cn(
                    dataTableHeaderRowClassName({ bordered: local.border ?? false }),
                    local.class?.headerRow,
                  )}
                >
                  <For each={headerGroup.headers}>
                    {(header, index) => {
                      const resizable = header as typeof header & {
                        getResizeHandler?: () => (event: MouseEvent | TouchEvent) => void
                        column: typeof header.column & {
                          getCanResize?: () => boolean
                          getIsResizing?: () => boolean
                          resetSize?: () => void
                        }
                      }
                      const layout = () => getDataTableHeaderLayout(header, pinningTable)
                      const meta = () =>
                        header.column.columnDef.meta as DataTableColumnMeta | undefined
                      const hasNext = () =>
                        headerGroup.headers.slice(index() + 1).some((item) => !item.isPlaceholder)
                      const headerProps = () => local.getHeaderProps?.(header) ?? {}
                      return (
                        <th
                          {...headerProps()}
                          colSpan={header.colSpan}
                          class={cn(
                            dataTableHeaderCellClassName,
                            layout().pinned && dataTablePinnedCellClassName,
                            layout().pinned && dataTablePinnedHeaderCellClassName,
                            layout().pinned === 'start' && dataTablePinnedStartClassName,
                            layout().pinned === 'end' && dataTablePinnedEndClassName,
                            layout().isStartEdge && dataTablePinnedStartEdgeClassName,
                            layout().isEndEdge && dataTablePinnedEndEdgeClassName,
                            !local.border && hasNext() && dataTableHeaderSeparatorClassName,
                            meta()?.align && dataTableAlignClassName[meta()!.align!],
                            meta()?.headerClassName,
                            local.class?.headerCell,
                            headerProps().class,
                          )}
                          style={{
                            ...layoutStyle(layout().style),
                            ...objectStyle(headerProps().style),
                          }}
                        >
                          <Show when={!header.isPlaceholder}>
                            <div
                              data-slot="data-table-header-content"
                              class={dataTableHeaderContentClassName}
                            >
                              {renderReactiveTemplate(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                          </Show>
                          <Show when={header.colSpan === 1 && resizable.column.getCanResize?.()}>
                            <span
                              role="separator"
                              tabIndex={0}
                              aria-label={`Resize ${header.column.id}`}
                              data-resizing={resizable.column.getIsResizing?.() || undefined}
                              class={dataTableResizeHandleClassName}
                              onDblClick={() => resizable.column.resetSize?.()}
                              onMouseDown={(event) => resizable.getResizeHandler?.()(event)}
                              onTouchStart={(event) => resizable.getResizeHandler?.()(event)}
                            />
                          </Show>
                        </th>
                      )
                    }}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody class={cn(dataTableBodyClassName, local.class?.body)}>
            <Show when={local.virtual && virtualTop() > 0}>
              <tr aria-hidden="true">
                <td
                  colSpan={Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))}
                  class={dataTableVirtualSpacerClassName}
                  style={{ height: `${virtualTop()}px` }}
                />
              </tr>
            </Show>
            <Show
              when={rows().length > 0}
              fallback={
                <tr>
                  <td
                    colSpan={Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))}
                    class={cn(dataTableEmptyClassName, local.class?.empty)}
                  >
                    {local.emptyContent ?? 'No data'}
                  </td>
                </tr>
              }
            >
              <For each={rows()}>
                {(sourceRow) => {
                  const row = sourceRow as Row<TFeatures, TData> & DataTableRowRenderingSource
                  const rowLayout = () => {
                    snapshot()
                    return getDataTableRowLayout(row, pinningTable)
                  }
                  const rowProps = () => local.getRowProps?.(row) ?? {}
                  const pinned = () => {
                    snapshot()
                    return row.getIsPinned?.()
                  }
                  const grouped = () => {
                    snapshot()
                    return (
                      'getIsGrouped' in row &&
                      typeof row.getIsGrouped === 'function' &&
                      row.getIsGrouped()
                    )
                  }
                  const expanded = () => {
                    snapshot()
                    return (
                      'getIsExpanded' in row &&
                      typeof row.getIsExpanded === 'function' &&
                      row.getIsExpanded()
                    )
                  }
                  const cells = () => {
                    snapshot()
                    return [...getDataTableRenderedCells(row)]
                  }
                  return (
                    <>
                      <tr
                        {...rowProps()}
                        data-pinned={pinned() || undefined}
                        data-grouped={grouped() || undefined}
                        class={cn(
                          dataTableRowClassName,
                          pinned() && dataTablePinnedRowClassName,
                          pinned() === 'top' && dataTablePinnedTopRowClassName,
                          pinned() === 'bottom' && dataTablePinnedBottomRowClassName,
                          rowLayout().edge === 'top' && dataTablePinnedTopEdgeClassName,
                          rowLayout().edge === 'bottom' && dataTablePinnedBottomEdgeClassName,
                          grouped() && dataTableGroupedRowClassName,
                          local.class?.row,
                          rowProps().class,
                        )}
                        style={{
                          ...layoutStyle(rowLayout().style),
                          ...objectStyle(rowProps().style),
                        }}
                      >
                        <Show
                          when={!grouped() || !local.renderGroupRow}
                          fallback={
                            <td
                              colSpan={Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))}
                            >
                              {local.renderGroupRow?.(row)}
                            </td>
                          }
                        >
                          <For each={cells()}>
                            {(sourceCell) => {
                              const cell = sourceCell as Cell<TFeatures, TData>
                              const cellLayout = () => {
                                snapshot()
                                return getDataTableColumnLayout(sourceCell.column, pinningTable)
                              }
                              const cellMeta = () =>
                                cell.column.columnDef.meta as DataTableColumnMeta | undefined
                              const cellProps = () => local.getCellProps?.(cell) ?? {}
                              return (
                                <td
                                  {...cellProps()}
                                  class={cn(
                                    dataTableCellClassName,
                                    cellLayout().pinned && dataTablePinnedCellClassName,
                                    cellLayout().pinned === 'start' && dataTablePinnedStartClassName,
                                    cellLayout().pinned === 'end' && dataTablePinnedEndClassName,
                                    cellLayout().isStartEdge && dataTablePinnedStartEdgeClassName,
                                    cellLayout().isEndEdge && dataTablePinnedEndEdgeClassName,
                                    cellMeta()?.align && dataTableAlignClassName[cellMeta()!.align!],
                                    cellMeta()?.cellClassName,
                                    local.class?.cell,
                                    cellProps().class,
                                  )}
                                  style={{
                                    ...layoutStyle(cellLayout().style),
                                    ...objectStyle(cellProps().style),
                                  }}
                                >
                                  <div class={dataTableCellContentClassName}>
                                    {renderReactiveTemplate(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </div>
                                </td>
                              )
                            }}
                          </For>
                        </Show>
                      </tr>
                      <Show when={expanded() && local.renderSubComponent}>
                        <tr class={dataTableRowClassName}>
                          <td colSpan={getDataTableVisibleLeafColumnCount(renderTable)}>
                            {local.renderSubComponent?.(row)}
                          </td>
                        </tr>
                      </Show>
                    </>
                  )
                }}
              </For>
            </Show>
            <Show when={local.virtual && virtualBottom() > 0}>
              <tr aria-hidden="true">
                <td
                  colSpan={Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))}
                  class={dataTableVirtualSpacerClassName}
                  style={{ height: `${virtualBottom()}px` }}
                />
              </tr>
            </Show>
          </tbody>
        </table>
      </div>
      <Show when={local.loading}>
        <div class={cn(dataTableLoadingClassName, local.class?.loading)}>
          {local.loadingContent ?? 'Loading…'}
        </div>
      </Show>
    </div>
  )
}

export { tableFeatures } from '@tanstack/table-core'
export type { ColumnDef, TableFeatures } from '@tanstack/table-core'
export { DataTableSortButton } from './data-table-sort-button'
export type { DataTableSortButtonProps } from './data-table-sort-button'
export { DataTableFilterInput } from './data-table-filter-input'
export type { DataTableFilterInputProps } from './data-table-filter-input'
export { DataTablePagination } from './data-table-pagination'
export type { DataTablePaginationProps } from './data-table-pagination'
export { createDataTableSelectionColumn } from './selection-column'
export type { DataTableSelectionColumnOptions } from './selection-column'
export { createDataTableExpandColumn } from './expand-column'
export type { DataTableExpandColumnOptions } from './expand-column'
export { DataTableColumnVisibility } from './data-table-column-visibility'
export type { DataTableColumnVisibilityProps } from './data-table-column-visibility'
export { DataTableColumnOverlay, DataTableRowOverlay } from './data-table-overlays'
export type { DataTableColumnOverlayProps, DataTableRowOverlayProps } from './data-table-overlays'
