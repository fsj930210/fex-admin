<script setup lang="ts">
import {
  columnResizingFeature,
  columnSizingFeature,
} from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { columnSizingFeature, columnResizingFeature }
type F = typeof m & { columnMeta: DataGridColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
const columns: ColumnDef<F, Person>[] = [
  { accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 },
  { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 },
  { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false },
  { accessorKey: 'progress', header: 'Progress', size: 140 },
]
const change = useDataGridTable({
  features: f,
  data: people5,
  columns,
  getRowId: (r) => r.id,
  columnResizeMode: 'onChange',
})
const end = useDataGridTable({
  features: f,
  data: people5,
  columns,
  getRowId: (r) => r.id,
  columnResizeMode: 'onEnd',
})
</script>
<template>
  <DemoSection
    title="Column sizing and resizing"
    description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement."
    ><div class="grid gap-space-lg xl:grid-cols-2">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Resize on change</h3>
        <DataGrid :table="change" />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Resize on end + bordered grid</h3>
        <DataGrid :table="end" border />
      </section></div
  ></DemoSection>
</template>
