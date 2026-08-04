import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people5, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

type BasicFeatures = { columnMeta: DataTableColumnMeta<BasicFeatures, Person> }
const basicFeatures: BasicFeatures = tableFeatures({ columnMeta: {} })

export function BasicDataTableDemo() {
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
  const table = createDataTable({
    features: basicFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
  })

  return (
    <DataTableDemoSection
      title="Core rendering and stable inline columns"
      description="The caller passes a TanStack v9 table definition. DataTable stabilizes the structural column tree, so this inline columns array does not require useMemo; getRowId remains mandatory."
    >
      <div class="space-y-space-lg">
        <DemoBranch title="Default density">
          <DataTable table={table} />
        </DemoBranch>
        <DemoBranch title="Compact + striped">
          <DataTable table={table} density="compact" striped />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
