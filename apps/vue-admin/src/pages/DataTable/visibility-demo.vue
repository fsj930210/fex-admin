<script setup lang="ts">
import { columnVisibilityFeature } from '@fex-design/core/data-table/features/column-visibility'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableColumnVisibility,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { columnVisibilityFeature }
type F = typeof m & { columnMeta: DataTableColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
const columns: ColumnDef<F, Person>[] = [
  { accessorKey: 'name', header: 'Name', enableHiding: false },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'visits', header: 'Visits' },
]
const table = useDataTable({
  features: f,
  data: people5,
  columns,
  getRowId: (r) => r.id,
  initialState: { columnVisibility: { visits: false } },
})
</script>
<template>
  <DemoSection
    title="Column visibility"
    description="Visibility state stays in TanStack. The toggle is a separate primitive and respects per-column enableHiding; Name cannot be hidden and Visits starts hidden."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Toggle visible leaf columns</h3>
      <DataTableColumnVisibility :table="table" /><DataTable :table="table" /></section
  ></DemoSection>
</template>
