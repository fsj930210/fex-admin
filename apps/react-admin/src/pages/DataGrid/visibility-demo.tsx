import { columnVisibilityFeature } from '@fex/components-core/data-grid/features/column-visibility'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, DataGridColumnVisibility, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const visibilityFeatures = tableFeatures({ columnVisibilityFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

export function VisibilityDataGridDemo() {
  const columns: ColumnDef<typeof visibilityFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', enableHiding: false },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  const table = useDataGridTable({ features: visibilityFeatures, data: people5, columns, getRowId: (row) => row.id, initialState: { columnVisibility: { visits: false } } })
  return (
    <DataGridDemoSection title="Column visibility" description="Visibility state stays in TanStack. The toggle is a separate primitive and respects per-column enableHiding; Name cannot be hidden and Visits starts hidden.">
      <DemoBranch title="Toggle visible leaf columns"><div className="space-y-space-sm"><DataGridColumnVisibility table={table} /><DataGrid table={table} /></div></DemoBranch>
    </DataGridDemoSection>
  )
}
