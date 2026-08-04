<script setup lang="ts">
import {
  columnOrderingFeature,
  moveDataTableColumn,
} from '@fex-design/core/data-table/features/column-ordering'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import Button from '@fex-design/vue/ui/button'
import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { columnOrderingFeature }
type F = typeof m & { columnMeta: DataTableColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
const ids = ['name', 'department', 'status', 'visits']
const columns: ColumnDef<F, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'visits', header: 'Visits' },
]
const table = useDataTable({
  features: f,
  data: people5,
  columns,
  getRowId: (r) => r.id,
  initialState: { columnOrder: ids },
})
</script>
<template>
  <DemoSection
    title="Column ordering"
    description="The feature only owns columnOrder and actions. These buttons are one possible UI; DnD is demonstrated separately as caller-owned behavior."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Programmatic reorder</h3>
      <div class="flex gap-space-sm">
        <Button
          size="sm"
          variant="outline"
          @click="table.setColumnOrder((order) => moveDataTableColumn(order, 'status', 'name'))"
          >Move Status first</Button
        ><Button size="sm" variant="outline" @click="table.resetColumnOrder()">Reset</Button>
      </div>
      <DataTable :table="table" /></section
  ></DemoSection>
</template>
