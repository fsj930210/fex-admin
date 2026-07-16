<script setup lang="ts">
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import Button from '@fex/components-vue/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-vue/icon/chevron'
import { MinusIcon } from '@fex/components-vue/icon/minus'
import { h, type Component } from 'vue'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { columnPinningFeature, columnSizingFeature }
type F = typeof m & { columnMeta: DataGridColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
interface P {
  pin(value: false | 'start' | 'end'): void
}
const fields = ['name', 'department', 'status', 'age', 'visits', 'progress'] as const
const B = Button as Component
const columns: ColumnDef<F, Person>[] = fields.map((field) => ({
  accessorKey: field,
  size: field === 'name' ? 180 : 130,
  header: ({ column }) => {
    const p = column as unknown as P
    return h('span', { class: 'inline-flex items-center gap-1' }, [
      field,
      h(B, { size: 'icon-xs', variant: 'ghost', onClick: () => p.pin('start') }, () => h(ChevronLeftIcon, { class: 'size-3.5' })),
      h(B, { size: 'icon-xs', variant: 'ghost', onClick: () => p.pin(false) }, () => h(MinusIcon, { class: 'size-3.5' })),
      h(B, { size: 'icon-xs', variant: 'ghost', onClick: () => p.pin('end') }, () => h(ChevronRightIcon, { class: 'size-3.5' })),
    ])
  },
}))
const table = useDataGridTable({
  features: f,
  data: people6,
  columns,
  getRowId: (r) => r.id,
  initialState: { columnPinning: { start: ['name'], end: ['progress'] } },
})
</script>
<template>
  <DemoSection
    title="Column pinning"
    description="TanStack v9 uses logical start/end regions. DataGrid only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Start, center and end regions</h3>
      <DataGrid :table="table" /></section
  ></DemoSection>
</template>
