import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { virtualPeople, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

type VirtualFeatures = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<VirtualFeatures, Person>
}
const virtualFeatures: VirtualFeatures = tableFeatures({ columnSizingFeature, columnMeta: {} })

export function VirtualDataTableDemo() {
  const columns: ColumnDef<VirtualFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 280 },
    { accessorKey: 'department', header: 'Department', size: 180 },
    { accessorKey: 'status', header: 'Status', size: 150 },
    { accessorKey: 'visits', header: 'Visits', size: 140, meta: { align: 'right' } },
    {
      accessorKey: 'progress',
      header: 'Progress',
      size: 140,
      meta: { align: 'right' },
      cell: ({ getValue }) => `${getValue()}%`,
    },
  ]
  const table = createDataTable({
    features: virtualFeatures,
    data: virtualPeople,
    columns,
    getRowId: (row) => row.id,
  })
  return (
    <DataTableDemoSection
      title="Virtual scrolling"
      description="This table has 10,000 rows, while the DOM mounts only the viewport rows plus overscan. The primitive keeps TanStack Table's row model and uses @tanstack/react-virtual only for rendering."
    >
      <DemoBranch title="10,000 fixed-height rows">
        <DataTable table={table} virtual={{ height: 320, estimateRowHeight: 40, overscan: 10 }} />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
