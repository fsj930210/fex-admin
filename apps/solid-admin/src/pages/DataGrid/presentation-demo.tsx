import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

type PresentationFeatures = { columnMeta: DataGridColumnMeta<PresentationFeatures, Person> }
const presentationFeatures: PresentationFeatures = tableFeatures({ columnMeta: {} })
const columns: ColumnDef<PresentationFeatures, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]

export function PresentationDataGridDemo() {
  const dataTable = createDataGridTable({
    features: presentationFeatures,
    data: people.slice(0, 3),
    columns,
    getRowId: (row) => row.id,
  })
  const emptyTable = createDataGridTable({
    features: presentationFeatures,
    data: [],
    columns,
    getRowId: (row) => row.id,
  })
  return (
    <DataGridDemoSection
      title="Loading, empty and customization states"
      description="Presentation states are primitive props and structured part classes; they do not change table state or start requests."
    >
      <div class="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="Loading overlay">
          <DataGrid table={dataTable} loading loadingContent="Refreshing rows…" />
        </DemoBranch>
        <DemoBranch title="Custom empty">
          <DataGrid table={emptyTable} emptyContent="No matching members" />
        </DemoBranch>
        <DemoBranch title="Part class customization">
          <DataGrid
            table={dataTable}
            class={{ header: 'bg-primary/10', row: 'hover:bg-primary/5', cell: 'font-medium' }}
          />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
