import {
  dataGridControlsClassName,
  dataGridPaginationClassName,
  dataGridPaginationSummaryClassName,
  dataGridSelectClassName,
  dataGridSrOnlyClassName,
} from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import { For, splitProps, type JSX } from 'solid-js'
import type { SolidDataGridTable } from '../../primitives/create-data-grid-table'
import { Button } from '../../ui/button/button'

interface PaginationTable {
  getRowCount: () => number
  getPageCount: () => number
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  previousPage: () => void
  nextPage: () => void
  setPageSize: (size: number) => void
  getSelectedRowModel?: () => { rows: readonly unknown[] }
}

export interface DataGridPaginationProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends JSX.HTMLAttributes<HTMLDivElement> {
  table: SolidDataGridTable<TFeatures, TData>
  pageSizeOptions?: readonly number[]
  showSelectedCount?: boolean
}

export function DataGridPagination<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataGridPaginationProps<TFeatures, TData>,
) {
  const [local, rest] = splitProps(props, [
    'table',
    'pageSizeOptions',
    'showSelectedCount',
    'class',
  ])
  const table = local.table as unknown as PaginationTable
  const pagination = () =>
    (
      local.table.dataGridSnapshot().state as {
        pagination: { pageIndex: number; pageSize: number }
      }
    ).pagination
  const selectedCount = () => table.getSelectedRowModel?.().rows.length ?? 0
  return (
    <div {...rest} class={cn(dataGridPaginationClassName, local.class)}>
      <span class={dataGridPaginationSummaryClassName}>
        {local.showSelectedCount !== false ? `${selectedCount()} selected · ` : null}
        {table.getRowCount()} rows
      </span>
      <div class={dataGridControlsClassName}>
        <label>
          <span class={dataGridSrOnlyClassName}>Rows per page</span>
          <select
            class={dataGridSelectClassName}
            value={pagination().pageSize}
            onChange={(event) => table.setPageSize(Number(event.currentTarget.value))}
          >
            <For each={local.pageSizeOptions ?? [10, 20, 50]}>
              {(size) => <option value={size}>{size} / page</option>}
            </For>
          </select>
        </label>
        <span>
          Page {pagination().pageIndex + 1} / {Math.max(1, table.getPageCount())}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
