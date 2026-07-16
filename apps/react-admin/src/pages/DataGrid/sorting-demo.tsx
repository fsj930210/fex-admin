/* oxlint-disable react/no-unstable-nested-components -- TanStack header renderers are configuration callbacks stabilized by useDataGridTable. */
import { createSortedRowModel, rowSortingFeature, type SortFn, type SortingState } from '@fex/components-core/data-grid/features/row-sorting'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, DataGridSortButton, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { useState } from 'react'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people7, resolveUpdater, type Person } from './data'

const sortingFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnMeta: {} as DataGridColumnMeta<TableFeatures, Person>,
})

const textSort: SortFn<TableFeatures, Person> = (rowA, rowB, id) => String(rowA.getValue(id)).localeCompare(String(rowB.getValue(id)))
const numberSort: SortFn<TableFeatures, Person> = (rowA, rowB, id) => Number(rowA.getValue(id)) - Number(rowB.getValue(id))

function SortingGrid({ kind, allowMulti = true, initialSorting = [] }: { kind: 'local' | 'server' | 'mixed'; allowMulti?: boolean; initialSorting?: SortingState }) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const columns: ColumnDef<typeof sortingFeatures, Person>[] = [
    { accessorKey: 'name', header: ({ column }) => <DataGridSortButton column={column}>Name</DataGridSortButton>, meta: kind === 'server' ? {} : { sortFn: textSort } },
    { accessorKey: 'status', header: ({ column }) => <DataGridSortButton column={column}>Status</DataGridSortButton>, meta: kind === 'local' ? { sortFn: textSort } : {} },
    { accessorKey: 'visits', header: ({ column }) => <DataGridSortButton column={column}>Visits</DataGridSortButton>, meta: kind === 'server' ? {} : { sortFn: numberSort, align: 'right' } },
  ]
  const table = useDataGridTable({
    features: sortingFeatures,
    data: people7,
    columns,
    getRowId: (row) => row.id,
    state: { sorting },
    enableMultiSort: allowMulti,
    isMultiSortEvent: () => allowMulti,
    onSortingChange: (updater) => setSorting((previous) => resolveUpdater(updater, previous)),
  })
  const remote = sorting.filter((item) => !columns.find((column) => ('accessorKey' in column ? column.accessorKey : column.id) === item.id)?.meta?.sortFn)
  return <div className="space-y-space-sm"><DataGrid table={table} /><p className="text-xs text-muted-foreground">Remote request sorting: {remote.length ? JSON.stringify(remote) : 'none'}</p></div>
}

export function SortingDataGridDemo() {
  return (
    <DataGridDemoSection title="Column sorting" description="Multi-sort is supported for local columns as well: each click adds or changes a priority and the superscript shows that priority. Columns without meta.sortFn remain remote terms in the same sorting state, while their pass-through comparator leaves local row order unchanged.">
      <div className="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="All local multi-sort"><SortingGrid kind="local" initialSorting={[{ id: 'status', desc: false }, { id: 'visits', desc: true }]} /></DemoBranch>
        <DemoBranch title="All server"><SortingGrid kind="server" /></DemoBranch>
        <DemoBranch title="Mixed per column"><SortingGrid kind="mixed" /></DemoBranch>
        <DemoBranch title="Remote multi-sort: Status asc, Visits desc"><SortingGrid kind="server" allowMulti initialSorting={[{ id: 'status', desc: false }, { id: 'visits', desc: true }]} /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
