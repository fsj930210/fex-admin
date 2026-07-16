import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people3, type Person } from './data'

const presentationFeatures = tableFeatures({ columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })
const columns: ColumnDef<typeof presentationFeatures, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]

export function PresentationDataGridDemo() {
  const dataTable = useDataGridTable({ features: presentationFeatures, data: people3, columns, getRowId: (row) => row.id })
  const emptyTable = useDataGridTable({ features: presentationFeatures, data: [], columns, getRowId: (row) => row.id })
  return (
    <DataGridDemoSection title="Loading, empty and customization states" description="Presentation states are primitive props and structured part classes; they do not change table state or start requests.">
      <div className="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="Loading overlay"><DataGrid table={dataTable} loading loadingContent="Refreshing rows…" /></DemoBranch>
        <DemoBranch title="Custom empty"><DataGrid table={emptyTable} emptyContent="No matching members" /></DemoBranch>
        <DemoBranch title="Part class customization"><DataGrid table={dataTable} className={{ header: 'bg-primary/10', row: 'hover:bg-primary/5', cell: 'font-medium' }} /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
