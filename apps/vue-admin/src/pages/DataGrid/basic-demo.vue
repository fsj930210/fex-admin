<script setup lang="ts">
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'
type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
const features: Features = tableFeatures({ columnMeta: {} })
const columns: ColumnDef<Features, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'progress',
    header: 'Progress',
    meta: { align: 'right' },
    cell: ({ getValue }) => `${getValue()}%`,
  },
]
const defaultTable = useDataGridTable({
  features,
  data: people5,
  columns,
  getRowId: (row) => row.id,
})
const compactTable = useDataGridTable({
  features,
  data: people5,
  columns,
  getRowId: (row) => row.id,
})
</script>
<template>
  <DemoSection
    title="Core rendering and stable inline columns"
    description="The caller passes a TanStack v9 table definition. DataGrid stabilizes the structural column tree, so this inline columns array does not require useMemo; getRowId remains mandatory."
    ><div class="space-y-space-lg">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Default density</h3>
        <DataGrid :table="defaultTable" />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Compact + striped</h3>
        <DataGrid :table="compactTable" density="compact" striped />
      </section></div
  ></DemoSection>
</template>
