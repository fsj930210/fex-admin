<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
  import {
    dataTableControlsClassName,
    dataTablePaginationClassName,
    dataTablePaginationSummaryClassName,
    dataTableSelectClassName,
    dataTableSrOnlyClassName,
  } from '@fex-design/styles/data-table'
  import { cn } from '@fex/utils'
  import type { RowData, TableFeatures } from '@tanstack/table-core'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { SvelteDataTable } from '../../stores/create-data-table'
  import Button from '../../ui/button/button.svelte'

  interface PaginationTable {
    getRowCount(): number
    getPageCount(): number
    getCanPreviousPage(): boolean
    getCanNextPage(): boolean
    previousPage(): void
    nextPage(): void
    setPageSize(size: number): void
    getSelectedRowModel?(): { rows: readonly unknown[] }
  }

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    table: SvelteDataTable<TFeatures, TData>
    pageSizeOptions?: readonly number[]
    showSelectedCount?: boolean
    class?: string
  }

  let {
    table,
    pageSizeOptions = [10, 20, 50],
    showSelectedCount = true,
    class: className,
    ...rest
  }: Props = $props()
  const paginationTable = $derived(table as unknown as PaginationTable)
  const snapshot = $derived(table.dataTableSnapshot)
  const pagination = $derived(($snapshot.state as { pagination: { pageIndex: number; pageSize: number } }).pagination)
  const selectedCount = $derived.by(() => {
    void $snapshot
    return paginationTable.getSelectedRowModel?.().rows.length ?? 0
  })
  const rowCount = $derived.by(() => { void $snapshot; return paginationTable.getRowCount() })
  const pageCount = $derived.by(() => { void $snapshot; return Math.max(1, paginationTable.getPageCount()) })
  const canPrevious = $derived.by(() => { void $snapshot; return paginationTable.getCanPreviousPage() })
  const canNext = $derived.by(() => { void $snapshot; return paginationTable.getCanNextPage() })
</script>

<div {...rest} class={cn(dataTablePaginationClassName, className)}>
  <span class={dataTablePaginationSummaryClassName}>
    {showSelectedCount ? `${selectedCount} selected · ` : ''}{rowCount} rows
  </span>
  <div class={dataTableControlsClassName}>
    <label>
      <span class={dataTableSrOnlyClassName}>Rows per page</span>
      <select class={dataTableSelectClassName} value={pagination.pageSize} onchange={(event) => paginationTable.setPageSize(Number(event.currentTarget.value))}>
        {#each pageSizeOptions as size (size)}<option value={size}>{size} / page</option>{/each}
      </select>
    </label>
    <span>Page {pagination.pageIndex + 1} / {pageCount}</span>
    <Button size="sm" variant="outline" disabled={!canPrevious} onclick={() => paginationTable.previousPage()}>Previous</Button>
    <Button size="sm" variant="outline" disabled={!canNext} onclick={() => paginationTable.nextPage()}>Next</Button>
  </div>
</div>
