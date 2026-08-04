import {
  getDataTableColumnSize,
  getDataTableRenderedCells,
  getDataTableVisibleLeafColumns,
  type DataTableRenderingTableSource,
} from '@fex-design/core/data-table/layout'
import {
  dataTableBodyClassName,
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableHeaderCellClassName,
  dataTableHeaderClassName,
  dataTableHeaderContentClassName,
  dataTableHeaderRowClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableClassName,
} from '@fex-design/styles/data-table'
import type { Header, Row, RowData, Table, TableFeatures } from '@tanstack/table-core'
import { For, type JSX } from 'solid-js'

function renderTemplate(template: unknown, context: unknown): JSX.Element {
  return typeof template === 'function'
    ? (template(context) as JSX.Element)
    : (template as JSX.Element)
}

export interface DataTableColumnOverlayProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TFeatures, TData>
  header: Header<TFeatures, TData>
  style: JSX.CSSProperties
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataTableColumnOverlay<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataTableColumnOverlayProps<TFeatures, TData>,
) {
  const rows = () => props.table.getRowModel().rows
  return (
    <div
      data-slot="data-table-column-overlay"
      class={dataTableRootClassName({ density: props.density ?? 'default' })}
      style={{ ...props.style, height: 'auto' }}
    >
      <table class={dataTableClassName} style={{ width: '100%' }}>
        <colgroup>
          <col style={{ width: `${getDataTableColumnSize(props.header.column)}px` }} />
        </colgroup>
        <thead class={dataTableHeaderClassName}>
          <tr class={dataTableHeaderRowClassName()}>
            <th class={dataTableHeaderCellClassName}>
              <div class={dataTableHeaderContentClassName}>
                {renderTemplate(props.header.column.columnDef.header, props.header.getContext())}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class={dataTableBodyClassName}>
          <For each={rows()}>
            {(row) => {
              const cell = getDataTableRenderedCells(row).find(
                (item) => item.column.id === props.header.column.id,
              )
              return cell ? (
                <tr class={dataTableRowClassName}>
                  <td class={dataTableCellClassName}>
                    <div class={dataTableCellContentClassName}>
                      {renderTemplate(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                </tr>
              ) : null
            }}
          </For>
        </tbody>
      </table>
    </div>
  )
}

export interface DataTableRowOverlayProps<TFeatures extends TableFeatures, TData extends RowData> {
  table: Table<TFeatures, TData>
  row: Row<TFeatures, TData>
  style: JSX.CSSProperties
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataTableRowOverlay<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataTableRowOverlayProps<TFeatures, TData>,
) {
  const source = props.table as unknown as DataTableRenderingTableSource
  const columns = () => getDataTableVisibleLeafColumns(source)
  return (
    <div
      data-slot="data-table-row-overlay"
      class={dataTableRootClassName({ density: props.density ?? 'default' })}
      style={props.style}
    >
      <table class={dataTableClassName}>
        <colgroup>
          <For each={columns()}>
            {(column) => (
              <col
                style={{
                  width: column.getSize?.() === undefined ? undefined : `${column.getSize?.()}px`,
                }}
              />
            )}
          </For>
        </colgroup>
        <tbody>
          <tr class={dataTableRowClassName}>
            <For each={getDataTableRenderedCells(props.row)}>
              {(cell) => (
                <td class={dataTableCellClassName}>
                  <div class={dataTableCellContentClassName}>
                    {renderTemplate(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              )}
            </For>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
