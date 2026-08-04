import { columnVisibilityFeature } from '@fex-design/core/data-table/features/column-visibility'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  DataTableColumnVisibility,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const visibilityFeatures = tableFeatures({
  columnVisibilityFeature,
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

export function VisibilityDataTableDemo() {
  const columns: ColumnDef<typeof visibilityFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', enableHiding: false },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  const table = useDataTable({
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
        <div className="space-y-space-sm">
          <DataTableColumnVisibility table={table} />
          <DataTable table={table} />
        </div>
      </DemoBranch>
    </DataTableDemoSection>
  )
}
