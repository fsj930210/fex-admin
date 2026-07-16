<script setup lang="ts">
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { virtualPeople, type Person } from './data'
import DemoSection from './demo-section.vue'
type F = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<F, Person>
}
const f: F = tableFeatures({ columnSizingFeature, columnMeta: {} })
const columns: ColumnDef<F, Person>[] = [
  { accessorKey: 'name', header: 'Name', size: 280 },
  { accessorKey: 'department', header: 'Department', size: 180 },
  { accessorKey: 'status', header: 'Status', size: 150 },
  { accessorKey: 'visits', header: 'Visits', size: 140, meta: { align: 'right' } },
  {
    accessorKey: 'progress',
    header: 'Progress',
    size: 140,
    meta: { align: 'right' },
    cell: ({ getValue }) => `${getValue()}%`,
  },
]
const table = useDataGridTable({ features: f, data: virtualPeople, columns, getRowId: (r) => r.id })
</script>
<template>
  <DemoSection
    title="Virtual scrolling"
    description="This table has 10,000 rows, while the DOM mounts only the viewport rows plus overscan. The primitive keeps TanStack Table's row model and uses @tanstack/react-virtual only for rendering."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">10,000 fixed-height rows</h3>
      <DataGrid
        :table="table"
        :virtual="{ height: 320, estimateRowHeight: 40, overscan: 10 }"
      /></section
  ></DemoSection>
</template>
