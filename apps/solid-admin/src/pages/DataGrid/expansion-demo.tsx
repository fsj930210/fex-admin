import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  createDataGridExpandColumn,
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people4, peopleTree, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const expansionModules = {
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  columnSizingFeature,
}
type ExpansionFeatures = typeof expansionModules & {
  columnMeta: DataGridColumnMeta<ExpansionFeatures, Person>
}
const expansionFeatures: ExpansionFeatures = tableFeatures({ ...expansionModules, columnMeta: {} })

function TreeRowsGrid() {
  const columns: ColumnDef<ExpansionFeatures, Person>[] = [
    createDataGridExpandColumn<ExpansionFeatures, Person>(),
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => (
        <span style={{ 'padding-inline-start': `${row.depth * 16}px` }}>{String(getValue())}</span>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
  ]
  const table = createDataGridTable({
    features: expansionFeatures,
    data: peopleTree,
    columns,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
  })
  return <DataGrid table={table} />
}

function DetailRowsGrid() {
  const columns: ColumnDef<ExpansionFeatures, Person>[] = [
    createDataGridExpandColumn<ExpansionFeatures, Person>(),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = createDataGridTable({
    features: expansionFeatures,
    data: people4,
    columns,
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
  })
  return (
    <DataGrid
      table={table}
      renderSubComponent={(row) => (
        <div class="bg-muted-background p-space-md text-sm">
          {row.original.name}: {row.original.visits} visits, {row.original.progress}% progress.
        </div>
      )}
    />
  )
}

export function ExpansionDataGridDemo() {
  return (
    <DataGridDemoSection
      title="Row expansion"
      description="The same expansion state supports hierarchical subRows and arbitrary detail panels. The expand control is an optional column factory, not a special DataGrid mode."
    >
      <div class="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Hierarchical rows">
          <TreeRowsGrid />
        </DemoBranch>
        <DemoBranch title="Detail panel">
          <DetailRowsGrid />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
