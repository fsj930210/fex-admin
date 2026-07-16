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
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { Button } from '@fex/components-solid/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from '@fex/components-solid/icon/chevron'
import { For } from 'solid-js'
import { people9, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const groupingModules = {
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
}
type GroupingFeatures = typeof groupingModules & {
  columnMeta: DataGridColumnMeta<GroupingFeatures, Person>
}
const groupingFeatures: GroupingFeatures = tableFeatures({ ...groupingModules, columnMeta: {} })

function GroupingGrid(props: { mode: 'reorder' | 'remove' }) {
  const columns: ColumnDef<GroupingFeatures, Person>[] = [
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
  const table = createDataGridTable({
    features: groupingFeatures,
    data: people9,
    columns,
    getRowId: (row) => row.id,
    groupedColumnMode: props.mode,
    initialState: { grouping: ['department', 'status'], expanded: true },
  })
  return (
    <div class="space-y-space-sm">
      <div class="flex flex-wrap gap-space-sm">
        <For each={['department', 'status']}>
          {(columnId) => {
            const column = table.getColumn(columnId)
            const grouped = () => column?.getIsGrouped() ?? false
            return (
              <Button
                size="sm"
                variant={grouped() ? 'default' : 'outline'}
                onClick={() => column?.toggleGrouping()}
              >
                {' '}
                {grouped() ? 'Ungroup' : 'Group'} {columnId}
              </Button>
            )
          }}
        </For>
      </div>
      <DataGrid
        table={table}
        renderGroupRow={(row) => {
          const columnId = row.groupingColumnId ?? ''
          const column = table.getColumn(columnId)
          const label =
            typeof column?.columnDef.header === 'string' ? column.columnDef.header : columnId
          return (
            <div
              class="flex min-h-11 items-center gap-space-sm px-space-md"
              style={{ 'padding-inline-start': `${row.depth * 20 + 12}px` }}
            >
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={`${row.getIsExpanded() ? 'Collapse' : 'Expand'} ${label} ${String(row.groupingValue)}`}
                aria-expanded={row.getIsExpanded()}
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? <ChevronDownIcon class="size-3.5" /> : <ChevronRightIcon class="size-3.5" />}
              </Button>
              <span class="text-sm font-semibold">{label}</span>
              <span class="text-sm text-muted-foreground">=</span>
              <span class="text-sm font-medium">{String(row.groupingValue)}</span>
              <span class="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-muted-foreground">
                {row.getLeafRows().length} rows
              </span>
              <span class="ml-auto text-xs text-muted-foreground">
                Total visits: {String(row.getValue('visits'))}
              </span>
            </div>
          )
        }}
      />
    </div>
  )
}

export function GroupingDataGridDemo() {
  return (
    <DataGridDemoSection
      title="Row grouping and aggregation"
      description="Each group is a full-width summary row above its members. Department is the outer level; Status is nested inside it. The chevron expands only that group, and the right side displays the aggregated visits."
    >
      <div class="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Keep Department and Status columns">
          <GroupingGrid mode="reorder" />
        </DemoBranch>
        <DemoBranch title="Hide grouped columns; retain summaries">
          <GroupingGrid mode="remove" />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
