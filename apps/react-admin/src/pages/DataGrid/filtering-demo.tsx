import { columnFilteringFeature, createFilteredRowModel, type ColumnFiltersState, type FilterFn } from '@fex/components-core/data-grid/features/column-filtering'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, DataGridFilterInput, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { useState } from 'react'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people8, resolveUpdater, type Person } from './data'

const filteringFeatures = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  columnMeta: {} as DataGridColumnMeta<TableFeatures, Person>,
})

const includes: FilterFn<TableFeatures, Person> = (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase())

function FilteringGrid({ kind }: { kind: 'local' | 'server' | 'mixed' }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns: ColumnDef<typeof filteringFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', meta: kind === 'server' ? {} : { filterFn: includes } },
    { accessorKey: 'department', header: 'Department', meta: kind === 'local' ? { filterFn: includes } : {} },
    { accessorKey: 'status', header: 'Status', meta: kind === 'server' ? {} : { filterFn: includes } },
  ]
  const table = useDataGridTable({
    features: filteringFeatures,
    data: people8,
    columns,
    getRowId: (row) => row.id,
    state: { columnFilters },
    onColumnFiltersChange: (updater) => setColumnFilters((previous) => resolveUpdater(updater, previous)),
  })
  const remote = columnFilters.filter((item) => !columns.find((column) => ('accessorKey' in column ? column.accessorKey : column.id) === item.id)?.meta?.filterFn)
  return (
    <div className="space-y-space-sm">
      <div className="flex flex-wrap gap-space-sm">
        {table.getAllLeafColumns().map((column) => <DataGridFilterInput key={column.id} column={column} placeholder={`Filter ${column.id}`} />)}
      </div>
      <DataGrid table={table} />
      <p className="text-xs text-muted-foreground">Remote request filters: {remote.length ? JSON.stringify(remote) : 'none'}</p>
    </div>
  )
}

export function FilteringDataGridDemo() {
  return (
    <DataGridDemoSection title="Column filtering" description="meta.filterFn opts a column into local filtering. Missing filterFn means remote, while onColumnFiltersChange still receives the complete filter list.">
      <div className="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="All local"><FilteringGrid kind="local" /></DemoBranch>
        <DemoBranch title="All server"><FilteringGrid kind="server" /></DemoBranch>
        <DemoBranch title="Mixed per column"><FilteringGrid kind="mixed" /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
