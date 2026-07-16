import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people6, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

type HeaderGroupingFeatures = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<HeaderGroupingFeatures, Person>
}
const headerGroupingFeatures: HeaderGroupingFeatures = tableFeatures({
  columnSizingFeature,
  columnMeta: {},
})

export function HeaderGroupingDataGridDemo() {
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
  const table = createDataGridTable({
    features: headerGroupingFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
  })
  return (
    <DataGridDemoSection
      title="Column header grouping"
      description="Nested column definitions render TanStack's headerGroups as a real multi-row thead. The group headers use colSpan automatically; leaf headers remain the columns that sort, resize and pin."
    >
      <DemoBranch title="Identity and Work metrics">
        <DataGrid table={table} />
      </DemoBranch>
      <DemoBranch title="Bordered grid (border)">
        <DataGrid table={table} border />
      </DemoBranch>
    </DataGridDemoSection>
  )
}
