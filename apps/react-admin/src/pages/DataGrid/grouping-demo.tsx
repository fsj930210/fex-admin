import { aggregationFn_sum, columnGroupingFeature, createGroupedRowModel } from '@fex/components-core/data-grid/features/column-grouping'
import { createExpandedRowModel, rowExpandingFeature } from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef, type Row } from '@fex/components-react/primitive/data-grid'
import { Button } from '@fex/components-react/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from '@fex/components-react/icon/chevron'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people9, type Person } from './data'

const groupingFeatures = tableFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
  columnMeta: {} as DataGridColumnMeta<TableFeatures, Person>,
})

function GroupingGrid({ mode }: { mode: 'reorder' | 'remove' }) {
  const columns: ColumnDef<typeof groupingFeatures, Person>[] = [
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
  const table = useDataGridTable({
    features: groupingFeatures,
    data: people9,
    columns,
    getRowId: (row) => row.id,
    groupedColumnMode: mode,
    initialState: { grouping: ['department', 'status'], expanded: true },
  })

  return (
    <div className="space-y-space-sm">
      <div className="flex flex-wrap gap-space-sm">
        {(['department', 'status'] as const).map((columnId) => {
          const column = table.getColumn(columnId)
          if (!column) return null
          return <Button key={columnId} size="sm" variant={column.getIsGrouped() ? 'default' : 'outline'} onClick={column.getToggleGroupingHandler()}>{column.getIsGrouped() ? 'Ungroup' : 'Group'} {columnId}</Button>
        })}
      </div>
      <DataGrid
        table={table}
        renderGroupRow={(row: Row<typeof groupingFeatures, Person>) => {
          const groupingColumnId = row.groupingColumnId ?? ''
          const column = groupingColumnId ? table.getColumn(groupingColumnId) : undefined
          const label = typeof column?.columnDef.header === 'string' ? column.columnDef.header : groupingColumnId
          return (
            <div className="flex min-h-11 items-center gap-space-sm px-space-md" style={{ paddingInlineStart: `${row.depth * 20 + 12}px` }}>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={`${row.getIsExpanded() ? 'Collapse' : 'Expand'} ${label} ${String(row.groupingValue)}`}
                aria-expanded={row.getIsExpanded()}
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? <ChevronDownIcon className="size-3.5" /> : <ChevronRightIcon className="size-3.5" />}
              </Button>
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-sm text-muted-foreground">=</span>
              <span className="text-sm font-medium">{String(row.groupingValue)}</span>
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-muted-foreground">{row.getLeafRows().length} rows</span>
              <span className="ml-auto text-xs text-muted-foreground">Total visits: {row.getValue('visits')}</span>
            </div>
          )
        }}
      />
    </div>
  )
}

export function GroupingDataGridDemo() {
  return (
    <DataGridDemoSection title="Row grouping and aggregation" description="Each group is a full-width summary row above its members. Department is the outer level; Status is nested inside it. The chevron expands only that group, and the right side displays the aggregated visits.">
      <div className="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Keep Department and Status columns"><GroupingGrid mode="reorder" /></DemoBranch>
        <DemoBranch title="Hide grouped columns; retain summaries"><GroupingGrid mode="remove" /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
