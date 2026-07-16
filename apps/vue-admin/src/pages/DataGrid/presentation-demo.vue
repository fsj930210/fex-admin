<script setup lang="ts">
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'

import { people, type Person } from './data'
import DemoSection from './demo-section.vue'

type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
const features: Features = tableFeatures({ columnMeta: {} })
const columns: ColumnDef<Features, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]
const dataTable = useDataGridTable({
  features,
  data: people.slice(0, 3),
  columns,
  getRowId: (row) => row.id,
})
const emptyTable = useDataGridTable({
  features,
  data: [],
  columns,
  getRowId: (row) => row.id,
})
</script>

<template>
  <DemoSection
    title="Loading, empty and customization states"
    description="Presentation states are primitive props and structured part classes; they do not change table state or start requests."
  >
    <div class="grid gap-space-lg xl:grid-cols-3">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Loading overlay</h3>
        <DataGrid :table="dataTable" loading loading-content="Refreshing rows…" />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Custom empty</h3>
        <DataGrid :table="emptyTable" empty-content="No matching members" />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Part class customization</h3>
        <DataGrid
          :table="dataTable"
          :part-class="{
            header: 'bg-primary/10',
            row: 'hover:bg-primary/5',
            cell: 'font-medium',
          }"
        />
      </section>
    </div>
  </DemoSection>
</template>
