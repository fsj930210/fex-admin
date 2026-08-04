import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex-design/core/data-table/features/row-expanding'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  createDataTableExpandColumn,
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people4, peopleTree, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const expansionModules = {
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  columnSizingFeature,
}
type ExpansionFeatures = typeof expansionModules & {
  columnMeta: DataTableColumnMeta<ExpansionFeatures, Person>
}
const expansionFeatures: ExpansionFeatures = tableFeatures({ ...expansionModules, columnMeta: {} })

function TreeRowsGrid() {
  const columns: ColumnDef<ExpansionFeatures, Person>[] = [
    createDataTableExpandColumn<ExpansionFeatures, Person>(),
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => (
        <span style={{ 'padding-inline-start': `${row.depth * 16}px` }}>{String(getValue())}</span>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
  ]
  const table = createDataTable({
    features: expansionFeatures,
    data: peopleTree,
    columns,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
  })
  return <DataTable table={table} />
}

function DetailRowsGrid() {
  const columns: ColumnDef<ExpansionFeatures, Person>[] = [
    createDataTableExpandColumn<ExpansionFeatures, Person>(),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = createDataTable({
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
        <div class="bg-muted-background p-space-md text-sm">
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
      <div class="grid gap-space-lg xl:grid-cols-2">
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
