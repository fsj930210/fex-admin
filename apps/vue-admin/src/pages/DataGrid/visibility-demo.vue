<script setup lang="ts">
import { columnVisibilityFeature } from '@fex/components-core/data-grid/features/column-visibility'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridColumnVisibility,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { columnVisibilityFeature }
type F = typeof m & { columnMeta: DataGridColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
const columns: ColumnDef<F, Person>[] = [
  { accessorKey: 'name', header: 'Name', enableHiding: false },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'visits', header: 'Visits' },
]
const table = useDataGridTable({
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
      <DataGridColumnVisibility :table="table" /><DataGrid :table="table" /></section
  ></DemoSection>
</template>
