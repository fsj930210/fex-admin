<script setup lang="ts">
import { columnPinningFeature } from '@fex-design/core/data-table/features/column-pinning'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import Button from '@fex-design/vue/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/vue/icon/chevron'
import { MinusIcon } from '@fex-design/vue/icon/minus'
import { h, type Component } from 'vue'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { columnPinningFeature, columnSizingFeature }
type F = typeof m & { columnMeta: DataTableColumnMeta<F, Person> }
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
      h(B, { size: 'icon-xs', variant: 'ghost', onClick: () => p.pin('start') }, () =>
        h(ChevronLeftIcon, { class: 'size-3.5' }),
      ),
      h(B, { size: 'icon-xs', variant: 'ghost', onClick: () => p.pin(false) }, () =>
        h(MinusIcon, { class: 'size-3.5' }),
      ),
      h(B, { size: 'icon-xs', variant: 'ghost', onClick: () => p.pin('end') }, () =>
        h(ChevronRightIcon, { class: 'size-3.5' }),
      ),
    ])
  },
}))
const table = useDataTable({
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
    description="TanStack v9 uses logical start/end regions. DataTable only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Start, center and end regions</h3>
      <DataTable :table="table" /></section
  ></DemoSection>
</template>
