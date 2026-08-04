import {
  dataTableControlsClassName,
  dataTablePaginationClassName,
  dataTablePaginationSummaryClassName,
  dataTableSelectClassName,
  dataTableSrOnlyClassName,
} from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import { For, splitProps, type JSX } from 'solid-js'
import type { SolidDataTable } from '../../primitives/create-data-table'
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

export interface DataTablePaginationProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends JSX.HTMLAttributes<HTMLDivElement> {
  table: SolidDataTable<TFeatures, TData>
  pageSizeOptions?: readonly number[]
  showSelectedCount?: boolean
}

export function DataTablePagination<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataTablePaginationProps<TFeatures, TData>,
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
      local.table.dataTableSnapshot().state as {
        pagination: { pageIndex: number; pageSize: number }
      }
    ).pagination
  const selectedCount = () => table.getSelectedRowModel?.().rows.length ?? 0
  return (
    <div {...rest} class={cn(dataTablePaginationClassName, local.class)}>
      <span class={dataTablePaginationSummaryClassName}>
        {local.showSelectedCount !== false ? `${selectedCount()} selected · ` : null}
        {table.getRowCount()} rows
      </span>
      <div class={dataTableControlsClassName}>
        <label>
          <span class={dataTableSrOnlyClassName}>Rows per page</span>
          <select
            class={dataTableSelectClassName}
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
