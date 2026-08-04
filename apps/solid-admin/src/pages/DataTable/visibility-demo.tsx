import { columnVisibilityFeature } from '@fex-design/core/data-table/features/column-visibility'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableColumnVisibility,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people5, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const visibilityModules = { columnVisibilityFeature }
type VisibilityFeatures = typeof visibilityModules & {
  columnMeta: DataTableColumnMeta<VisibilityFeatures, Person>
}
const visibilityFeatures: VisibilityFeatures = tableFeatures({
  ...visibilityModules,
  columnMeta: {},
})

export function VisibilityDataTableDemo() {
  const columns: ColumnDef<VisibilityFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', enableHiding: false },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  const table = createDataTable({
    features: visibilityFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnVisibility: { visits: false } },
  })
  return (
    <DataTableDemoSection
      title="Column visibility"
      description="Visibility state stays in TanStack. The toggle is a separate primitive and respects per-column enableHiding; Name cannot be hidden and Visits starts hidden."
    >
      <DemoBranch title="Toggle visible leaf columns">
        <div class="space-y-space-sm">
          <DataTableColumnVisibility table={table} />
          <DataTable table={table} />
        </div>
      </DemoBranch>
    </DataTableDemoSection>
  )
}
