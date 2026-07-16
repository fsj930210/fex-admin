<script setup lang="ts">
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  createDataGridExpandColumn,
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { h } from 'vue'
import { people4, peopleTree, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { rowExpandingFeature, expandedRowModel: createExpandedRowModel(), columnSizingFeature }
type F = typeof m & { columnMeta: DataGridColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
const tc: ColumnDef<F, Person>[] = [
  createDataGridExpandColumn<F, Person>(),
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, getValue }) =>
      h('span', { style: { paddingInlineStart: `${row.depth * 16}px` } }, String(getValue())),
  },
  { accessorKey: 'department', header: 'Department' },
]
const dc: ColumnDef<F, Person>[] = [
  createDataGridExpandColumn<F, Person>(),
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]
const tree = useDataGridTable({
  features: f,
  data: peopleTree,
  columns: tc,
  getRowId: (r) => r.id,
  getSubRows: (r) => r.children,
})
const detail = useDataGridTable({
  features: f,
  data: people4,
  columns: dc,
  getRowId: (r) => r.id,
  getRowCanExpand: () => true,
})
</script>
<template>
  <DemoSection
    title="Row expansion"
    description="The same expansion state supports hierarchical subRows and arbitrary detail panels. The expand control is an optional column factory, not a special DataGrid mode."
    ><div class="grid gap-space-lg xl:grid-cols-2">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Hierarchical rows</h3>
        <DataGrid :table="tree" />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Detail panel</h3>
        <DataGrid :table="detail"
          ><template #subComponent="{ row }"
            ><div class="bg-muted-background p-space-md text-sm">
              {{ row.original.name }}: {{ row.original.visits }} visits,
              {{ row.original.progress }}% progress.
            </div></template
          ></DataGrid
        >
      </section>
    </div></DemoSection
  >
</template>
