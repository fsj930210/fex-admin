import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const headerGroupingFeatures = tableFeatures({ columnSizingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

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
        { accessorKey: 'progress', header: 'Progress', size: 140, meta: { align: 'right' }, cell: ({ getValue }) => `${getValue()}%` },
      ],
    },
  ]
  const table = useDataGridTable({ features: headerGroupingFeatures, data: people6, columns, getRowId: (row) => row.id })
  return (
    <DataGridDemoSection title="Column header grouping" description="Nested column definitions render TanStack's headerGroups as a real multi-row thead. The group headers use colSpan automatically; leaf headers remain the columns that sort, resize and pin.">
      <DemoBranch title="Identity and Work metrics"><DataGrid table={table} /></DemoBranch>
      <DemoBranch title="Bordered grid (border)"><DataGrid table={table} border /></DemoBranch>
    </DataGridDemoSection>
  )
}
