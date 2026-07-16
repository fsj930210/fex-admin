<script setup lang="ts">
import {
  createSortedRowModel,
  rowSortingFeature,
  type SortFn,
  type SortingState,
} from '@fex/components-core/data-grid/features/row-sorting'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridSortButton,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { h, type Component } from 'vue'
import { people, type Person } from './data'
import DemoSection from './demo-section.vue'
const modules = { rowSortingFeature, sortedRowModel: createSortedRowModel() }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
const features: Features = tableFeatures({ ...modules, columnMeta: {} })
const textSort: SortFn<Features, Person> = (a, b, id) =>
  String(a.getValue(id)).localeCompare(String(b.getValue(id)))
const numberSort: SortFn<Features, Person> = (a, b, id) =>
  Number(a.getValue(id)) - Number(b.getValue(id))
function grid(kind: 'local' | 'server' | 'mixed', initialSorting: SortingState = []) {
  const SortButton = DataGridSortButton as Component
  const columns: ColumnDef<Features, Person>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => h(SortButton, { column }, () => 'Name'),
      meta: kind === 'server' ? {} : { sortFn: textSort },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => h(SortButton, { column }, () => 'Status'),
      meta: kind === 'local' ? { sortFn: textSort } : {},
    },
    {
      accessorKey: 'visits',
      header: ({ column }) => h(SortButton, { column }, () => 'Visits'),
      meta: kind === 'server' ? {} : { sortFn: numberSort, align: 'right' },
    },
  ]
  const table = useDataGridTable({
    features,
    data: people.slice(0, 7),
    columns,
    getRowId: (r) => r.id,
    enableMultiSort: true,
    isMultiSortEvent: () => true,
    initialState: { sorting: initialSorting },
  })
  return {
    table,
    title: '',
    remote: () =>
      table.dataGridSnapshot.value.state.sorting.filter(
        (item) =>
          !columns.find(
            (column) => ('accessorKey' in column ? column.accessorKey : column.id) === item.id,
          )?.meta?.sortFn,
      ),
  }
}
const grids = [
  {
    ...grid('local', [
      { id: 'status', desc: false },
      { id: 'visits', desc: true },
    ]),
    title: 'All local multi-sort',
  },
  { ...grid('server'), title: 'All server' },
  { ...grid('mixed'), title: 'Mixed per column' },
  {
    ...grid('server', [
      { id: 'status', desc: false },
      { id: 'visits', desc: true },
    ]),
    title: 'Remote multi-sort: Status asc, Visits desc',
  },
]
</script>
<template>
  <DemoSection
    title="Column sorting"
    description="Multi-sort is supported for local columns as well: each click adds or changes a priority and the superscript shows that priority. Columns without meta.sortFn remain remote terms in the same sorting state, while their pass-through comparator leaves local row order unchanged."
    ><div class="grid gap-space-lg xl:grid-cols-2">
      <section v-for="item in grids" :key="item.title" class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">{{ item.title }}</h3>
        <DataGrid :table="item.table" />
        <p class="text-xs text-muted-foreground">
          Remote request sorting:
          {{ item.remote().length ? JSON.stringify(item.remote()) : 'none' }}
        </p>
      </section>
    </div></DemoSection
  >
</template>
