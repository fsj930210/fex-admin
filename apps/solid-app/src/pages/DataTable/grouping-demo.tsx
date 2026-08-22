import {
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
} from '@fex-design/core/data-table/features/column-grouping'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex-design/core/data-table/features/row-expanding'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { Button } from '@fex-design/solid/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from '@fex-design/solid/icon/chevron'
import { For } from 'solid-js'
import { people9, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const groupingModules = {
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
}
type GroupingFeatures = typeof groupingModules & {
  columnMeta: DataTableColumnMeta<GroupingFeatures, Person>
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
  const table = createDataTable({
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
      <DataTable
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
                {row.getIsExpanded() ? (
                  <ChevronDownIcon class="size-3.5" />
                ) : (
                  <ChevronRightIcon class="size-3.5" />
                )}
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

export function GroupingDataTableDemo() {
  return (
    <DataTableDemoSection
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
    </DataTableDemoSection>
  )
}
