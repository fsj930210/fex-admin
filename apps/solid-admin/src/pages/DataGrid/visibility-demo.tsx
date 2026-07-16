import { columnVisibilityFeature } from '@fex/components-core/data-grid/features/column-visibility'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridColumnVisibility,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people5, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const visibilityModules = { columnVisibilityFeature }
type VisibilityFeatures = typeof visibilityModules & {
  columnMeta: DataGridColumnMeta<VisibilityFeatures, Person>
}
const visibilityFeatures: VisibilityFeatures = tableFeatures({
  ...visibilityModules,
  columnMeta: {},
})

export function VisibilityDataGridDemo() {
  const columns: ColumnDef<VisibilityFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', enableHiding: false },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  const table = createDataGridTable({
    features: visibilityFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnVisibility: { visits: false } },
  })
  return (
    <DataGridDemoSection
      title="Column visibility"
      description="Visibility state stays in TanStack. The toggle is a separate primitive and respects per-column enableHiding; Name cannot be hidden and Visits starts hidden."
    >
      <DemoBranch title="Toggle visible leaf columns">
        <div class="space-y-space-sm">
          <DataGridColumnVisibility table={table} />
          <DataGrid table={table} />
        </div>
      </DemoBranch>
    </DataGridDemoSection>
  )
}
