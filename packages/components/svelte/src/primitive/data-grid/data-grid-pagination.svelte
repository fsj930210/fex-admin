<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
  import {
    dataGridControlsClassName,
    dataGridPaginationClassName,
    dataGridPaginationSummaryClassName,
    dataGridSelectClassName,
    dataGridSrOnlyClassName,
  } from '@fex/components-styles/data-grid'
  import { cn } from '@fex/utils'
  import type { RowData, TableFeatures } from '@tanstack/table-core'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { SvelteDataGridTable } from '../../stores/create-data-grid-table'
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
    table: SvelteDataGridTable<TFeatures, TData>
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
  const snapshot = $derived(table.dataGridSnapshot)
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

<div {...rest} class={cn(dataGridPaginationClassName, className)}>
  <span class={dataGridPaginationSummaryClassName}>
    {showSelectedCount ? `${selectedCount} selected · ` : ''}{rowCount} rows
  </span>
  <div class={dataGridControlsClassName}>
    <label>
      <span class={dataGridSrOnlyClassName}>Rows per page</span>
      <select class={dataGridSelectClassName} value={pagination.pageSize} onchange={(event) => paginationTable.setPageSize(Number(event.currentTarget.value))}>
        {#each pageSizeOptions as size (size)}<option value={size}>{size} / page</option>{/each}
      </select>
    </label>
    <span>Page {pagination.pageIndex + 1} / {pageCount}</span>
    <Button size="sm" variant="outline" disabled={!canPrevious} onclick={() => paginationTable.previousPage()}>Previous</Button>
    <Button size="sm" variant="outline" disabled={!canNext} onclick={() => paginationTable.nextPage()}>Next</Button>
  </div>
</div>
