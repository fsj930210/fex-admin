import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people6, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

type HeaderGroupingFeatures = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<HeaderGroupingFeatures, Person>
}
const headerGroupingFeatures: HeaderGroupingFeatures = tableFeatures({
  columnSizingFeature,
  columnMeta: {},
})

export function HeaderGroupingDataTableDemo() {
  const columns: ColumnDef<typeof headerGroupingFeatures, Person>[] = [
    {
      header: 'Identity',
      columns: [
        { accessorKey: 'name', header: 'Name', size: 220 },
        { accessorKey: 'department', header: 'Department', size: 170 },
      ],
    },
    {
      header: 'Work metrics',
      columns: [
        { accessorKey: 'status', header: 'Status', size: 140 },
        { accessorKey: 'visits', header: 'Visits', size: 130, meta: { align: 'right' } },
        {
          accessorKey: 'progress',
          header: 'Progress',
          size: 140,
          meta: { align: 'right' },
          cell: ({ getValue }) => `${getValue()}%`,
        },
      ],
    },
  ]
  const table = createDataTable({
    features: headerGroupingFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
  })
  return (
    <DataTableDemoSection
      title="Column header grouping"
      description="Nested column definitions render TanStack's headerGroups as a real multi-row thead. The group headers use colSpan automatically; leaf headers remain the columns that sort, resize and pin."
    >
      <DemoBranch title="Identity and Work metrics">
        <DataTable table={table} />
      </DemoBranch>
      <DemoBranch title="Bordered table (border)">
        <DataTable table={table} border />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
