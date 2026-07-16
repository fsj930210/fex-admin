<script setup lang="ts">
import {
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
} from '@fex/components-core/data-grid/features/column-grouping'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import Button from '@fex/components-vue/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from '@fex/components-vue/icon/chevron'
import { people9, type Person } from './data'
import DemoSection from './demo-section.vue'
const m = {
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
}
type F = typeof m & { columnMeta: DataGridColumnMeta<F, Person> }
const f: F = tableFeatures({ ...m, columnMeta: {} })
const columns: ColumnDef<F, Person>[] = [
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'name', header: 'Name', enableGrouping: false },
  {
    accessorKey: 'visits',
    header: 'Visits',
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => `${getValue()} total`,
    enableGrouping: false,
  },
]
const reorder = useDataGridTable({
  features: f,
  data: people9,
  columns,
  getRowId: (r) => r.id,
  groupedColumnMode: 'reorder',
  initialState: { grouping: ['department', 'status'], expanded: true },
})
const remove = useDataGridTable({
  features: f,
  data: people9,
  columns,
  getRowId: (r) => r.id,
  groupedColumnMode: 'remove',
  initialState: { grouping: ['department', 'status'], expanded: true },
})
const grids = [
  { title: 'Keep Department and Status columns', table: reorder },
  { title: 'Hide grouped columns; retain summaries', table: remove },
]
</script>
<template>
  <DemoSection
    title="Row grouping and aggregation"
    description="Each group is a full-width summary row above its members. Department is the outer level; Status is nested inside it. The chevron expands only that group, and the right side displays the aggregated visits."
    ><div class="grid gap-space-lg xl:grid-cols-2">
      <section v-for="item in grids" :key="item.title" class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">{{ item.title }}</h3>
        <div class="flex gap-space-sm">
          <Button
            v-for="id in ['department', 'status']"
            :key="id"
            size="sm"
            :variant="item.table.getColumn(id)?.getIsGrouped() ? 'default' : 'outline'"
            @click="item.table.getColumn(id)?.toggleGrouping()"
            >{{ item.table.getColumn(id)?.getIsGrouped() ? 'Ungroup' : 'Group' }} {{ id }}</Button
          >
        </div>
        <DataGrid :table="item.table"
          ><template #groupRow="{ row }"
            ><div
              class="flex min-h-11 items-center gap-space-sm px-space-md"
              :style="{ paddingInlineStart: `${row.depth * 20 + 12}px` }"
            >
              <Button size="icon-xs" variant="ghost" @click="row.toggleExpanded()">
                <ChevronDownIcon v-if="row.getIsExpanded()" class="size-3.5" />
                <ChevronRightIcon v-else class="size-3.5" />
              </Button
              ><span class="font-semibold">{{ row.groupingColumnId }}</span
              ><span>=</span><span>{{ String(row.groupingValue) }}</span
              ><span class="rounded-full bg-foreground/10 px-2 py-0.5 text-xs"
                >{{ row.getLeafRows().length }} rows</span
              ><span class="ml-auto text-xs text-muted-foreground"
                >Total visits: {{ String(row.getValue('visits')) }}</span
              >
            </div></template
          ></DataGrid
        >
      </section>
    </div></DemoSection
  >
</template>
