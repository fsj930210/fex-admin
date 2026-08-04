import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people3, type Person } from './data'

const presentationFeatures = tableFeatures({
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})
const columns: ColumnDef<typeof presentationFeatures, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]

export function PresentationDataTableDemo() {
  const dataTable = useDataTable({
    features: presentationFeatures,
    data: people3,
    columns,
    getRowId: (row) => row.id,
  })
  const emptyTable = useDataTable({
    features: presentationFeatures,
    data: [],
    columns,
    getRowId: (row) => row.id,
  })
  return (
    <DataTableDemoSection
      title="Loading, empty and customization states"
      description="Presentation states are primitive props and structured part classes; they do not change table state or start requests."
    >
      <div className="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="Loading overlay">
          <DataTable table={dataTable} loading loadingContent="Refreshing rows…" />
        </DemoBranch>
        <DemoBranch title="Custom empty">
          <DataTable table={emptyTable} emptyContent="No matching members" />
        </DemoBranch>
        <DemoBranch title="Part class customization">
          <DataTable
            table={dataTable}
            className={{ header: 'bg-primary/10', row: 'hover:bg-primary/5', cell: 'font-medium' }}
          />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
