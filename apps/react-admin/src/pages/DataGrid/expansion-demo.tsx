/* oxlint-disable react/no-unstable-nested-components -- TanStack cell renderers are configuration callbacks stabilized by useDataGridTable. */
import { createExpandedRowModel, rowExpandingFeature } from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { createDataGridExpandColumn, DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people4, peopleTree, type Person } from './data'

const expansionFeatures = tableFeatures({ rowExpandingFeature, expandedRowModel: createExpandedRowModel(), columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

function TreeRowsGrid() {
  const columns: ColumnDef<typeof expansionFeatures, Person>[] = [
    createDataGridExpandColumn<typeof expansionFeatures, Person>(),
    { accessorKey: 'name', header: 'Name', cell: ({ row, getValue }) => <span style={{ paddingInlineStart: `${row.depth * 16}px` }}>{String(getValue())}</span> },
    { accessorKey: 'department', header: 'Department' },
  ]
  const table = useDataGridTable({ features: expansionFeatures, data: peopleTree, columns, getRowId: (row) => row.id, getSubRows: (row) => row.children })
  return <DataGrid table={table} />
}

function DetailRowsGrid() {
  const columns: ColumnDef<typeof expansionFeatures, Person>[] = [
    createDataGridExpandColumn<typeof expansionFeatures, Person>(),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = useDataGridTable({ features: expansionFeatures, data: people4, columns, getRowId: (row) => row.id, getRowCanExpand: () => true })
  return <DataGrid table={table} renderSubComponent={(row) => <div className="bg-muted-background p-space-md text-sm">{row.original.name}: {row.original.visits} visits, {row.original.progress}% progress.</div>} />
}

export function ExpansionDataGridDemo() {
  return (
    <DataGridDemoSection title="Row expansion" description="The same expansion state supports hierarchical subRows and arbitrary detail panels. The expand control is an optional column factory, not a special DataGrid mode.">
      <div className="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Hierarchical rows"><TreeRowsGrid /></DemoBranch>
        <DemoBranch title="Detail panel"><DetailRowsGrid /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
