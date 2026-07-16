<script setup lang="ts">
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  createDataGridSelectionColumn,
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
const modules = { rowSelectionFeature, columnSizingFeature }
type F = typeof modules & { columnMeta: DataGridColumnMeta<F, Person> }
const features: F = tableFeatures({ ...modules, columnMeta: {} })
function grid(mode: 'multiple' | 'single', disabled = false) {
  const columns: ColumnDef<F, Person>[] = [
    createDataGridSelectionColumn<F, Person>({ mode }),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  return useDataGridTable({
    features,
    data: people6,
    columns,
    getRowId: (r) => r.id,
    enableMultiRowSelection: mode === 'multiple',
    enableRowSelection: disabled ? (row) => row.original.status !== 'paused' : true,
  })
}
const grids = [
  { title: 'Multiple + select all', table: grid('multiple') },
  { title: 'Single', table: grid('single') },
  { title: 'Conditional disabled rows', table: grid('multiple', true) },
]
</script>
<template>
  <DemoSection
    title="Row selection"
    description="The selection feature is headless; the reusable selection-column factory only supplies the conventional control column. Stable getRowId keeps selection independent from sorting and pagination."
    ><div class="grid gap-space-lg xl:grid-cols-3">
      <section v-for="item in grids" :key="item.title" class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">{{ item.title }}</h3>
        <DataGrid :table="item.table" />
        <p class="text-xs text-muted-foreground">
          Selected:
          {{
            Object.keys(item.table.dataGridSnapshot.value.state.rowSelection).join(', ') || 'none'
          }}
        </p>
      </section>
    </div></DemoSection
  >
</template>
