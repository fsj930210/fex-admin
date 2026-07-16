import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people5, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

type BasicFeatures = { columnMeta: DataGridColumnMeta<BasicFeatures, Person> }
const basicFeatures: BasicFeatures = tableFeatures({ columnMeta: {} })

export function BasicDataGridDemo() {
  const columns: ColumnDef<typeof basicFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    {
      accessorKey: 'progress',
      header: 'Progress',
      meta: { align: 'right' },
      cell: ({ getValue }) => `${getValue()}%`,
    },
  ]
  const table = createDataGridTable({
    features: basicFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
  })

  return (
    <DataGridDemoSection
      title="Core rendering and stable inline columns"
      description="The caller passes a TanStack v9 table definition. DataGrid stabilizes the structural column tree, so this inline columns array does not require useMemo; getRowId remains mandatory."
    >
      <div class="space-y-space-lg">
        <DemoBranch title="Default density">
          <DataGrid table={table} />
        </DemoBranch>
        <DemoBranch title="Compact + striped">
          <DataGrid table={table} density="compact" striped />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
