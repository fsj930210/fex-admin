import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const basicFeatures = tableFeatures({
  columnMeta: {} as DataGridColumnMeta<TableFeatures, Person>,
})

export function BasicDataGridDemo() {
  const columns: ColumnDef<typeof basicFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'progress', header: 'Progress', meta: { align: 'right' }, cell: ({ getValue }) => `${getValue()}%` },
  ]
  const table = useDataGridTable({ features: basicFeatures, data: people5, columns, getRowId: (row) => row.id })

  return (
    <DataGridDemoSection title="Core rendering and stable inline columns" description="The caller passes a TanStack v9 table definition. DataGrid stabilizes the structural column tree, so this inline columns array does not require useMemo; getRowId remains mandatory.">
      <div className="space-y-space-lg">
        <DemoBranch title="Default density"><DataGrid table={table} /></DemoBranch>
        <DemoBranch title="Compact + striped"><DataGrid table={table} density="compact" striped /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
