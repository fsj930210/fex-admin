<script setup lang="ts">
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<Features, Person>
}
const features: Features = tableFeatures({ columnSizingFeature, columnMeta: {} })
const columns: ColumnDef<Features, Person>[] = [
  {
    header: 'Identity',
    columns: [
      { accessorKey: 'name', header: 'Name', size: 220 },
      { accessorKey: 'department', header: 'Department', size: 170 },
    ],
  },
  {
    header: 'Work metrics',
    columns: [
      { accessorKey: 'status', header: 'Status', size: 140 },
      { accessorKey: 'visits', header: 'Visits', size: 130, meta: { align: 'right' } },
      {
        accessorKey: 'progress',
        header: 'Progress',
        size: 140,
        meta: { align: 'right' },
        cell: ({ getValue }) => `${getValue()}%`,
      },
    ],
  },
]
const table = useDataGridTable({ features, data: people6, columns, getRowId: (row) => row.id })
</script>
<template>
  <DemoSection
    title="Column header grouping"
    description="Nested column definitions render TanStack's headerGroups as a real multi-row thead. The group headers use colSpan automatically; leaf headers remain the columns that sort, resize and pin."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Identity and Work metrics</h3>
      <DataGrid :table="table" />
    </section>
    <section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Bordered grid (border)</h3>
      <DataGrid :table="table" border /></section
  ></DemoSection>
</template>
