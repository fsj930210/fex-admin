<script setup lang="ts">
import {
  columnFilteringFeature,
  createFilteredRowModel,
  type FilterFn,
} from '@fex/components-core/data-grid/features/column-filtering'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridFilterInput,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { people, type Person } from './data'
import DemoSection from './demo-section.vue'
const modules = { columnFilteringFeature, filteredRowModel: createFilteredRowModel() }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
const features: Features = tableFeatures({ ...modules, columnMeta: {} })
const includes: FilterFn<Features, Person> = (row, id, value) =>
  String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase())
function grid(kind: 'local' | 'server' | 'mixed') {
  const columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name', meta: kind === 'server' ? {} : { filterFn: includes } },
    {
      accessorKey: 'department',
      header: 'Department',
      meta: kind === 'local' ? { filterFn: includes } : {},
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: kind === 'server' ? {} : { filterFn: includes },
    },
  ]
  const table = useDataGridTable({
    features,
    data: people.slice(0, 8),
    columns,
    getRowId: (r) => r.id,
  })
  return {
    table,
    remote: () =>
      table.dataGridSnapshot.value.state.columnFilters.filter(
        (item) =>
          !columns.find(
            (column) => ('accessorKey' in column ? column.accessorKey : column.id) === item.id,
          )?.meta?.filterFn,
      ),
  }
}
const grids = [
  { ...grid('local'), title: 'All local' },
  { ...grid('server'), title: 'All server' },
  { ...grid('mixed'), title: 'Mixed per column' },
]
</script>
<template>
  <DemoSection
    title="Column filtering"
    description="meta.filterFn opts a column into local filtering. Missing filterFn means remote, while onColumnFiltersChange still receives the complete filter list."
    ><div class="grid gap-space-lg xl:grid-cols-3">
      <section v-for="item in grids" :key="item.title" class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">{{ item.title }}</h3>
        <div class="flex flex-wrap gap-space-sm">
          <DataGridFilterInput
            v-for="column in item.table.getAllLeafColumns()"
            :key="column.id"
            :column="column"
            :placeholder="`Filter ${column.id}`"
          />
        </div>
        <DataGrid :table="item.table" />
        <p class="text-xs text-muted-foreground">
          Remote request filters:
          {{ item.remote().length ? JSON.stringify(item.remote()) : 'none' }}
        </p>
      </section>
    </div></DemoSection
  >
</template>
