import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

type PresentationFeatures = { columnMeta: DataTableColumnMeta<PresentationFeatures, Person> }
const presentationFeatures: PresentationFeatures = tableFeatures({ columnMeta: {} })
const columns: ColumnDef<PresentationFeatures, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]

export function PresentationDataTableDemo() {
  const dataTable = createDataTable({
    features: presentationFeatures,
    data: people.slice(0, 3),
    columns,
    getRowId: (row) => row.id,
  })
  const emptyTable = createDataTable({
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
      <div class="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="Loading overlay">
          <DataTable table={dataTable} loading loadingContent="Refreshing rows…" />
        </DemoBranch>
        <DemoBranch title="Custom empty">
          <DataTable table={emptyTable} emptyContent="No matching members" />
        </DemoBranch>
        <DemoBranch title="Part class customization">
          <DataTable
            table={dataTable}
            class={{ header: 'bg-primary/10', row: 'hover:bg-primary/5', cell: 'font-medium' }}
          />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
