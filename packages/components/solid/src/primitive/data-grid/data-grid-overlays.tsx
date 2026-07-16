import {
  getDataGridColumnSize,
  getDataGridRenderedCells,
  getDataGridVisibleLeafColumns,
  type DataGridRenderingTableSource,
} from '@fex/components-core/data-grid/layout'
import {
  dataGridBodyClassName,
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridHeaderCellClassName,
  dataGridHeaderClassName,
  dataGridHeaderContentClassName,
  dataGridHeaderRowClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridTableClassName,
} from '@fex/components-styles/data-grid'
import type { Header, Row, RowData, Table, TableFeatures } from '@tanstack/table-core'
import { For, type JSX } from 'solid-js'

function renderTemplate(template: unknown, context: unknown): JSX.Element {
  return typeof template === 'function'
    ? (template(context) as JSX.Element)
    : (template as JSX.Element)
}

export interface DataGridColumnOverlayProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TFeatures, TData>
  header: Header<TFeatures, TData>
  style: JSX.CSSProperties
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataGridColumnOverlay<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataGridColumnOverlayProps<TFeatures, TData>,
) {
  const rows = () => props.table.getRowModel().rows
  return (
    <div
      data-slot="data-grid-column-overlay"
      class={dataGridRootClassName({ density: props.density ?? 'default' })}
      style={{ ...props.style, height: 'auto' }}
    >
      <table class={dataGridTableClassName} style={{ width: '100%' }}>
        <colgroup>
          <col style={{ width: `${getDataGridColumnSize(props.header.column)}px` }} />
        </colgroup>
        <thead class={dataGridHeaderClassName}>
          <tr class={dataGridHeaderRowClassName()}>
            <th class={dataGridHeaderCellClassName}>
              <div class={dataGridHeaderContentClassName}>
                {renderTemplate(props.header.column.columnDef.header, props.header.getContext())}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class={dataGridBodyClassName}>
          <For each={rows()}>
            {(row) => {
              const cell = getDataGridRenderedCells(row).find(
                (item) => item.column.id === props.header.column.id,
              )
              return cell ? (
                <tr class={dataGridRowClassName}>
                  <td class={dataGridCellClassName}>
                    <div class={dataGridCellContentClassName}>
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

export interface DataGridRowOverlayProps<TFeatures extends TableFeatures, TData extends RowData> {
  table: Table<TFeatures, TData>
  row: Row<TFeatures, TData>
  style: JSX.CSSProperties
  density?: 'compact' | 'default' | 'comfortable'
}

export function DataGridRowOverlay<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataGridRowOverlayProps<TFeatures, TData>,
) {
  const source = props.table as unknown as DataGridRenderingTableSource
  const columns = () => getDataGridVisibleLeafColumns(source)
  return (
    <div
      data-slot="data-grid-row-overlay"
      class={dataGridRootClassName({ density: props.density ?? 'default' })}
      style={props.style}
    >
      <table class={dataGridTableClassName}>
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
          <tr class={dataGridRowClassName}>
            <For each={getDataGridRenderedCells(props.row)}>
              {(cell) => (
                <td class={dataGridCellClassName}>
                  <div class={dataGridCellContentClassName}>
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
