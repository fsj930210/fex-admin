<script setup lang="ts">
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'
type Features = { columnMeta: DataTableColumnMeta<Features, Person> }
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
const defaultTable = useDataTable({
  features,
  data: people5,
  columns,
  getRowId: (row) => row.id,
})
const compactTable = useDataTable({
  features,
  data: people5,
  columns,
  getRowId: (row) => row.id,
})
</script>
<template>
  <DemoSection
    title="Core rendering and stable inline columns"
    description="The caller passes a TanStack v9 table definition. DataTable stabilizes the structural column tree, so this inline columns array does not require useMemo; getRowId remains mandatory."
    ><div class="space-y-space-lg">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Default density</h3>
        <DataTable :table="defaultTable" />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Compact + striped</h3>
        <DataTable :table="compactTable" density="compact" striped />
      </section></div
  ></DemoSection>
</template>
