/* oxlint-disable react/no-unstable-nested-components -- TanStack cell renderers are configuration callbacks stabilized by useDataTable. */
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex-design/core/data-table/features/row-expanding'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  createDataTableExpandColumn,
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people4, peopleTree, type Person } from './data'

const expansionFeatures = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

function TreeRowsGrid() {
  const columns: ColumnDef<typeof expansionFeatures, Person>[] = [
    createDataTableExpandColumn<typeof expansionFeatures, Person>(),
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => (
        <span style={{ paddingInlineStart: `${row.depth * 16}px` }}>{String(getValue())}</span>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
  ]
  const table = useDataTable({
    features: expansionFeatures,
    data: peopleTree,
    columns,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
  })
  return <DataTable table={table} />
}

function DetailRowsGrid() {
  const columns: ColumnDef<typeof expansionFeatures, Person>[] = [
    createDataTableExpandColumn<typeof expansionFeatures, Person>(),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = useDataTable({
    features: expansionFeatures,
    data: people4,
    columns,
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
  })
  return (
    <DataTable
      table={table}
      renderSubComponent={(row) => (
        <div className="bg-muted-background p-space-md text-sm">
          {row.original.name}: {row.original.visits} visits, {row.original.progress}% progress.
        </div>
      )}
    />
  )
}

export function ExpansionDataTableDemo() {
  return (
    <DataTableDemoSection
      title="Row expansion"
      description="The same expansion state supports hierarchical subRows and arbitrary detail panels. The expand control is an optional column factory, not a special DataTable mode."
    >
      <div className="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Hierarchical rows">
          <TreeRowsGrid />
        </DemoBranch>
        <DemoBranch title="Detail panel">
          <DetailRowsGrid />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
