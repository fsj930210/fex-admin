<script setup lang="ts">
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<Features, Person>
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
const table = useDataTable({ features, data: people6, columns, getRowId: (row) => row.id })
</script>
<template>
  <DemoSection
    title="Column header grouping"
    description="Nested column definitions render TanStack's headerGroups as a real multi-row thead. The group headers use colSpan automatically; leaf headers remain the columns that sort, resize and pin."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Identity and Work metrics</h3>
      <DataTable :table="table" />
    </section>
    <section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Bordered table (border)</h3>
      <DataTable :table="table" border /></section
  ></DemoSection>
</template>
