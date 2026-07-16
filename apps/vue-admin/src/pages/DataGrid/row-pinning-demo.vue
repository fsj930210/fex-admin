<script setup lang="ts">
import { rowPinningFeature } from '@fex/components-core/data-grid/features/row-pinning'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { Badge } from '@fex/components-vue/ui/badge'
import Button from '@fex/components-vue/ui/button'
import { h, type Component } from 'vue'
import { people, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = { rowPinningFeature }
type F = typeof m & { columnMeta: DataGridColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
interface P {
  getIsPinned(): false | 'top' | 'bottom'
  pin(value: false | 'top' | 'bottom'): void
}
const B = Button as Component,
  Tag = Badge as Component
const columns: ColumnDef<F, Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, getValue }) => {
      const p = row as unknown as P
      return h('span', { class: 'inline-flex items-center gap-2' }, [
        p.getIsPinned() ? h(Tag, { variant: 'outline' }, () => `Pinned ${p.getIsPinned()}`) : null,
        String(getValue()),
      ])
    },
  },
  { accessorKey: 'status', header: 'Status' },
  {
    id: 'pin',
    header: 'Pin row',
    cell: ({ row }) => {
      const p = row as unknown as P
      return h('span', { class: 'inline-flex gap-1' }, [
        h(B, { size: 'sm', variant: 'outline', onClick: () => p.pin('top') }, () => 'Top'),
        h(B, { size: 'sm', variant: 'outline', onClick: () => p.pin(false) }, () => 'Center'),
        h(B, { size: 'sm', variant: 'outline', onClick: () => p.pin('bottom') }, () => 'Bottom'),
      ])
    },
  },
]
const table = useDataGridTable({
  features: f,
  data: people.slice(0, 7),
  columns,
  getRowId: (r) => r.id,
  initialState: { rowPinning: { top: ['u-006'], bottom: ['u-002'] } },
})
</script>
<template>
  <DemoSection
    title="Row pinning"
    description="Pinned rows are opaque layers above the scrollable center region. Their edge shadow appears only at the boundary, and the controls can add more rows to either region."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Top, scrollable center and bottom</h3>
      <DataGrid :table="table" :part-class="{ viewport: 'max-h-56' }" /></section
  ></DemoSection>
</template>
