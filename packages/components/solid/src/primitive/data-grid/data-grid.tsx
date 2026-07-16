import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  getDataGridColumnLayout,
  getDataGridHeaderLayout,
  getDataGridRenderedCells,
  getDataGridRenderedRows,
  getDataGridRowLayout,
  getDataGridSizingLayout,
  getDataGridVirtualRows,
  getDataGridVisibleLeafColumnCount,
  getDataGridVisibleLeafColumns,
  type DataGridPinningTableSource,
  type DataGridRenderingTableSource,
  type DataGridRowRenderingSource,
} from '@fex/components-core/data-grid/layout'
import {
  dataGridAlignClassName,
  dataGridBodyClassName,
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridEmptyClassName,
  dataGridGroupedRowClassName,
  dataGridHeaderCellClassName,
  dataGridHeaderClassName,
  dataGridHeaderContentClassName,
  dataGridHeaderRowClassName,
  dataGridHeaderSeparatorClassName,
  dataGridLoadingClassName,
  dataGridPinnedBottomEdgeClassName,
  dataGridPinnedBottomRowClassName,
  dataGridPinnedCellClassName,
  dataGridPinnedEndClassName,
  dataGridPinnedEndEdgeClassName,
  dataGridPinnedHeaderCellClassName,
  dataGridPinnedRowClassName,
  dataGridPinnedStartClassName,
  dataGridPinnedStartEdgeClassName,
  dataGridPinnedTopEdgeClassName,
  dataGridPinnedTopRowClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridResizeHandleClassName,
  dataGridTableClassName,
  dataGridViewportClassName,
  dataGridVirtualSpacerClassName,
} from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Cell, Header, Row, RowData, TableFeatures } from '@tanstack/table-core'
import { For, Show, splitProps, type JSX } from 'solid-js'
import { createVirtualizer } from '@tanstack/solid-virtual'
import type { SolidDataGridTable } from '../../primitives/create-data-grid-table'

export interface DataGridClass {
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
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
  table: SolidDataGridTable<TFeatures, TData>
  class?: DataGridClass
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

type RenderTable<TFeatures extends TableFeatures, TData extends RowData> =
  SolidDataGridTable<TFeatures, TData> & DataGridRenderingTableSource

function renderTemplate(template: unknown, context: unknown): JSX.Element {
  if (typeof template === 'function') return template(context) as JSX.Element
  return template as JSX.Element
}

function layoutStyle(style: ReturnType<typeof getDataGridColumnLayout>['style']): JSX.CSSProperties {
  return {
    position: style.position,
    width: style.width === undefined ? undefined : `${style.width}px`,
    'inset-inline-start': style.insetInlineStart === undefined ? undefined : `${style.insetInlineStart}px`,
    'inset-inline-end': style.insetInlineEnd === undefined ? undefined : `${style.insetInlineEnd}px`,
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

export function DataGrid<TFeatures extends TableFeatures, TData extends RowData>(props: DataGridProps<TFeatures, TData>) {
  const [local, rest] = splitProps(props, [
    'table', 'class', 'density', 'striped', 'border', 'loading', 'loadingContent',
    'emptyContent', 'renderSubComponent', 'renderGroupRow', 'virtual', 'getRowProps', 'getCellProps', 'getHeaderProps',
  ])
  const renderTable = local.table as unknown as RenderTable<TFeatures, TData>
  const pinningTable = local.table as unknown as DataGridPinningTableSource
  const snapshot = () => local.table.dataGridSnapshot()
  const renderReactiveTemplate = (template: unknown, context: unknown) => {
    snapshot()
    return renderTemplate(template, context)
  }
  let viewportElement: HTMLDivElement | undefined = undefined
  const renderedRows = () => {
    snapshot()
    return getDataGridRenderedRows(renderTable)
  }
  const virtualRows = () => {
    snapshot()
    return getDataGridVirtualRows(renderTable)
  }
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    get count() { return local.virtual ? virtualRows().length : 0 },
    getScrollElement: () => viewportElement ?? null,
    estimateSize: () => local.virtual?.estimateRowHeight ?? 40,
    get overscan() { return local.virtual?.overscan ?? 8 },
  })
  const rows = () => local.virtual
    ? virtualizer.getVirtualItems().map((item) => virtualRows()[item.index]).filter((row) => row !== undefined)
    : renderedRows()
  const virtualTop = () => virtualizer.getVirtualItems()[0]?.start ?? 0
  const virtualBottom = () => { const items = virtualizer.getVirtualItems(); const last = items.at(-1); return last ? Math.max(0, virtualizer.getTotalSize() - last.end) : 0 }
  const columns = () => {
    snapshot()
    return getDataGridVisibleLeafColumns(renderTable)
  }
  const headerGroups = () => {
    snapshot()
    return local.table.getHeaderGroups()
  }
  const sizingLayout = () => {
    snapshot()
    return getDataGridSizingLayout(local.table)
  }
  const tableWidth = () => sizingLayout().tableWidth

  return (
    <div
      {...rest}
      data-slot="data-grid"
      data-loading={local.loading || undefined}
      class={cn(dataGridRootClassName({
        density: local.density ?? 'default',
        striped: local.striped ?? false,
        bordered: local.border ?? false,
      }), local.class?.root)}
      style={{ '--data-grid-header-height': 'var(--data-grid-row-height)', width: sizingLayout().rootWidth, ...objectStyle(rest.style) }}
    >
      <div ref={viewportElement} data-slot="data-grid-viewport" class={cn(dataGridViewportClassName, local.class?.viewport)} style={local.virtual ? { height: `${local.virtual.height}px` } : undefined}>
        <table
          class={cn(dataGridTableClassName, local.class?.table)}
          style={{ width: tableWidth() === undefined ? '100%' : `${tableWidth()}px` }}
        >
          <Show when={tableWidth() !== undefined}>
            <colgroup>
              <For each={columns()}>{(column) => <col style={{ width: column.getSize?.() === undefined ? undefined : `${column.getSize?.()}px` }} />}</For>
            </colgroup>
          </Show>
          <thead class={cn(dataGridHeaderClassName, local.class?.header)}>
            <For each={headerGroups()}>{(headerGroup) => (
              <tr class={cn(dataGridHeaderRowClassName({ bordered: local.border ?? false }), local.class?.headerRow)}>
                <For each={headerGroup.headers}>{(header, index) => {
                  const resizable = header as typeof header & {
                    getResizeHandler?: () => (event: MouseEvent | TouchEvent) => void
                    column: typeof header.column & {
                      getCanResize?: () => boolean
                      getIsResizing?: () => boolean
                      resetSize?: () => void
                    }
                  }
                  const layout = () => getDataGridHeaderLayout(header, pinningTable)
                  const meta = () => header.column.columnDef.meta as DataGridColumnMeta | undefined
                  const hasNext = () => headerGroup.headers.slice(index() + 1).some((item) => !item.isPlaceholder)
                  const headerProps = () => local.getHeaderProps?.(header) ?? {}
                  return (
                    <th
                      {...headerProps()}
                      colSpan={header.colSpan}
                      class={cn(
                        dataGridHeaderCellClassName,
                        layout().pinned && dataGridPinnedCellClassName,
                        layout().pinned && dataGridPinnedHeaderCellClassName,
                        layout().pinned === 'start' && dataGridPinnedStartClassName,
                        layout().pinned === 'end' && dataGridPinnedEndClassName,
                        layout().isStartEdge && dataGridPinnedStartEdgeClassName,
                        layout().isEndEdge && dataGridPinnedEndEdgeClassName,
                        !local.border && hasNext() && dataGridHeaderSeparatorClassName,
                        meta()?.align && dataGridAlignClassName[meta()!.align!],
                        meta()?.headerClassName,
                        local.class?.headerCell,
                        headerProps().class,
                      )}
                      style={{ ...layoutStyle(layout().style), ...objectStyle(headerProps().style) }}
                    >
                      <Show when={!header.isPlaceholder}>
                        <div data-slot="data-grid-header-content" class={dataGridHeaderContentClassName}>
                          {renderReactiveTemplate(header.column.columnDef.header, header.getContext())}
                        </div>
                      </Show>
                      <Show when={header.colSpan === 1 && resizable.column.getCanResize?.()}>
                        <span role="separator" tabIndex={0} aria-label={`Resize ${header.column.id}`} data-resizing={resizable.column.getIsResizing?.() || undefined} class={dataGridResizeHandleClassName} onDblClick={() => resizable.column.resetSize?.()} onMouseDown={(event) => resizable.getResizeHandler?.()(event)} onTouchStart={(event) => resizable.getResizeHandler?.()(event)} />
                      </Show>
                    </th>
                  )
                }}</For>
              </tr>
            )}</For>
          </thead>
          <tbody class={cn(dataGridBodyClassName, local.class?.body)}>
            <Show when={local.virtual && virtualTop() > 0}><tr aria-hidden="true"><td colSpan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={dataGridVirtualSpacerClassName} style={{ height: `${virtualTop()}px` }} /></tr></Show>
            <Show
              when={rows().length > 0}
              fallback={<tr><td colSpan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={cn(dataGridEmptyClassName, local.class?.empty)}>{local.emptyContent ?? 'No data'}</td></tr>}
            >
              <For each={rows()}>{(sourceRow) => {
                const row = sourceRow as Row<TFeatures, TData> & DataGridRowRenderingSource
                const rowLayout = () => {
                  snapshot()
                  return getDataGridRowLayout(row, pinningTable)
                }
                const rowProps = () => local.getRowProps?.(row) ?? {}
                const pinned = () => {
                  snapshot()
                  return row.getIsPinned?.()
                }
                const grouped = () => {
                  snapshot()
                  return 'getIsGrouped' in row && typeof row.getIsGrouped === 'function' && row.getIsGrouped()
                }
                const expanded = () => {
                  snapshot()
                  return 'getIsExpanded' in row && typeof row.getIsExpanded === 'function' && row.getIsExpanded()
                }
                const cells = () => {
                  snapshot()
                  return [...getDataGridRenderedCells(row)]
                }
                return (
                  <>
                    <tr
                      {...rowProps()}
                      data-pinned={pinned() || undefined}
                      data-grouped={grouped() || undefined}
                      class={cn(
                        dataGridRowClassName,
                        pinned() && dataGridPinnedRowClassName,
                        pinned() === 'top' && dataGridPinnedTopRowClassName,
                        pinned() === 'bottom' && dataGridPinnedBottomRowClassName,
                        rowLayout().edge === 'top' && dataGridPinnedTopEdgeClassName,
                        rowLayout().edge === 'bottom' && dataGridPinnedBottomEdgeClassName,
                        grouped() && dataGridGroupedRowClassName,
                        local.class?.row,
                        rowProps().class,
                      )}
                      style={{ ...layoutStyle(rowLayout().style), ...objectStyle(rowProps().style) }}
                    >
                      <Show
                        when={!grouped() || !local.renderGroupRow}
                        fallback={<td colSpan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))}>{local.renderGroupRow?.(row)}</td>}
                      >
                        <For each={cells()}>{(sourceCell) => {
                          const cell = sourceCell as Cell<TFeatures, TData>
                          const cellLayout = () => {
                            snapshot()
                            return getDataGridColumnLayout(sourceCell.column, pinningTable)
                          }
                          const cellMeta = () => cell.column.columnDef.meta as DataGridColumnMeta | undefined
                          const cellProps = () => local.getCellProps?.(cell) ?? {}
                          return (
                            <td
                              {...cellProps()}
                              class={cn(
                                dataGridCellClassName,
                                cellLayout().pinned && dataGridPinnedCellClassName,
                                cellLayout().pinned === 'start' && dataGridPinnedStartClassName,
                                cellLayout().pinned === 'end' && dataGridPinnedEndClassName,
                                cellLayout().isStartEdge && dataGridPinnedStartEdgeClassName,
                                cellLayout().isEndEdge && dataGridPinnedEndEdgeClassName,
                                cellMeta()?.align && dataGridAlignClassName[cellMeta()!.align!],
                                cellMeta()?.cellClassName,
                                local.class?.cell,
                                cellProps().class,
                              )}
                              style={{ ...layoutStyle(cellLayout().style), ...objectStyle(cellProps().style) }}
                            >
                              <div class={dataGridCellContentClassName}>
                                {renderReactiveTemplate(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </td>
                          )
                        }}</For>
                      </Show>
                    </tr>
                    <Show when={expanded() && local.renderSubComponent}>
                      <tr class={dataGridRowClassName}><td colSpan={getDataGridVisibleLeafColumnCount(renderTable)}>{local.renderSubComponent?.(row)}</td></tr>
                    </Show>
                  </>
                )
              }}</For>
            </Show>
            <Show when={local.virtual && virtualBottom() > 0}><tr aria-hidden="true"><td colSpan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={dataGridVirtualSpacerClassName} style={{ height: `${virtualBottom()}px` }} /></tr></Show>
          </tbody>
        </table>
      </div>
      <Show when={local.loading}><div class={cn(dataGridLoadingClassName, local.class?.loading)}>{local.loadingContent ?? 'Loading…'}</div></Show>
    </div>
  )
}

export { tableFeatures } from '@tanstack/table-core'
export type { ColumnDef, TableFeatures } from '@tanstack/table-core'
export { DataGridSortButton } from './data-grid-sort-button'
export type { DataGridSortButtonProps } from './data-grid-sort-button'
export { DataGridFilterInput } from './data-grid-filter-input'
export type { DataGridFilterInputProps } from './data-grid-filter-input'
export { DataGridPagination } from './data-grid-pagination'
export type { DataGridPaginationProps } from './data-grid-pagination'
export { createDataGridSelectionColumn } from './selection-column'
export type { DataGridSelectionColumnOptions } from './selection-column'
export { createDataGridExpandColumn } from './expand-column'
export type { DataGridExpandColumnOptions } from './expand-column'
export { DataGridColumnVisibility } from './data-grid-column-visibility'
export type { DataGridColumnVisibilityProps } from './data-grid-column-visibility'
export { DataGridColumnOverlay, DataGridRowOverlay } from './data-grid-overlays'
export type { DataGridColumnOverlayProps, DataGridRowOverlayProps } from './data-grid-overlays'
