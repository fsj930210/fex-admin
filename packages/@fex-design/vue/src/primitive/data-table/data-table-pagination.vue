<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import {
  dataTableControlsClassName,
  dataTablePaginationClassName,
  dataTablePaginationSummaryClassName,
  dataTableSelectClassName,
  dataTableSrOnlyClassName,
} from '@fex-design/styles/data-table'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import type { VueDataTable } from '../../composables/use-data-table'
import Button from '../../ui/button/button.vue'
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
const props = withDefaults(
  defineProps<{
    table: VueDataTable<TFeatures, TData>
    pageSizeOptions?: readonly number[]
    showSelectedCount?: boolean
  }>(),
  { pageSizeOptions: () => [10, 20, 50], showSelectedCount: true },
)
const table = props.table as unknown as PaginationTable
const pagination = () =>
  (
    props.table.dataTableSnapshot.value.state as {
      pagination: { pageIndex: number; pageSize: number }
    }
  ).pagination
</script>
<template>
  <div :class="dataTablePaginationClassName">
    <span :class="dataTablePaginationSummaryClassName"
      >{{
        props.showSelectedCount
          ? `${table.getSelectedRowModel?.().rows.length ?? 0} selected · `
          : ''
      }}{{ table.getRowCount() }} rows</span
    >
    <div :class="dataTableControlsClassName">
      <label
        ><span :class="dataTableSrOnlyClassName">Rows per page</span
        ><select
          :class="dataTableSelectClassName"
          :value="pagination().pageSize"
          @change="table.setPageSize(Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="size in props.pageSizeOptions" :key="size" :value="size">
            {{ size }} / page
          </option>
        </select></label
      ><span>Page {{ pagination().pageIndex + 1 }} / {{ Math.max(1, table.getPageCount()) }}</span
      ><Button
        size="sm"
        variant="outline"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
        >Previous</Button
      ><Button
        size="sm"
        variant="outline"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
        >Next</Button
      >
    </div>
  </div>
</template>
