import {
  dataGridControlsClassName,
  dataGridPaginationClassName,
  dataGridPaginationSummaryClassName,
  dataGridSelectClassName,
  dataGridSrOnlyClassName,
} from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { RowData, TableFeatures } from '@tanstack/react-table'
import type { HTMLAttributes } from 'react'
import type { ReactTable } from '@tanstack/react-table'
import { Button } from '../../ui/button/button'

export interface DataGridPaginationProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends HTMLAttributes<HTMLDivElement> {
  table: ReactTable<TFeatures, TData, unknown>
  pageSizeOptions?: readonly number[]
  showSelectedCount?: boolean
}

export function DataGridPagination<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 50],
  showSelectedCount = true,
  className,
  ...props
}: DataGridPaginationProps<TFeatures, TData>) {
  const paginationTable = table as unknown as ReactTable<TFeatures, TData, unknown> & {
    state: { pagination: { pageIndex: number; pageSize: number } }
    getSelectedRowModel?: () => { rows: unknown[] }
    getRowCount: () => number
    setPageSize: (size: number) => void
    getPageCount: () => number
    getCanPreviousPage: () => boolean
    getCanNextPage: () => boolean
    previousPage: () => void
    nextPage: () => void
  }
  const pagination = paginationTable.state.pagination
  const selectedCount = paginationTable.getSelectedRowModel?.().rows.length ?? 0
  return (
    <div {...props} className={cn(dataGridPaginationClassName, className)}>
      <span className={dataGridPaginationSummaryClassName}>
        {showSelectedCount ? `${selectedCount} selected · ` : null}
        {paginationTable.getRowCount()} rows
      </span>
      <div className={dataGridControlsClassName}>
        <label>
          <span className={dataGridSrOnlyClassName}>Rows per page</span>
          <select
            className={dataGridSelectClassName}
            value={pagination.pageSize}
            onChange={(event) => paginationTable.setPageSize(Number(event.currentTarget.value))}
          >
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size} / page</option>)}
          </select>
        </label>
        <span>Page {pagination.pageIndex + 1} / {Math.max(1, paginationTable.getPageCount())}</span>
        <Button size="sm" variant="outline" disabled={!paginationTable.getCanPreviousPage()} onClick={() => paginationTable.previousPage()}>
          Previous
        </Button>
        <Button size="sm" variant="outline" disabled={!paginationTable.getCanNextPage()} onClick={() => paginationTable.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
