import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const basicFeatures = tableFeatures({
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

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
  const table = useDataTable({
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
      <div className="space-y-space-lg">
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
