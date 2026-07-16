import {
  createPaginatedRowModel,
  rowPaginationFeature,
  type PaginationState,
} from '@fex/components-core/data-grid/features/client-pagination'
import { rowPaginationFeature as serverRowPaginationFeature } from '@fex/components-core/data-grid/features/server-pagination'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridPagination,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { createSignal } from 'solid-js'
import { people, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const clientModules = { rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }
type ClientFeatures = typeof clientModules & {
  columnMeta: DataGridColumnMeta<ClientFeatures, Person>
}
const clientFeatures: ClientFeatures = tableFeatures({ ...clientModules, columnMeta: {} })
const serverModules = { rowPaginationFeature: serverRowPaginationFeature }
type ServerFeatures = typeof serverModules & {
  columnMeta: DataGridColumnMeta<ServerFeatures, Person>
}
const serverFeatures: ServerFeatures = tableFeatures({ ...serverModules, columnMeta: {} })

const clientColumns: ColumnDef<ClientFeatures, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
]
const serverColumns: ColumnDef<ServerFeatures, Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
]

function ClientPaginationGrid() {
  const table = createDataGridTable({
    features: clientFeatures,
    data: people,
    columns: clientColumns,
    getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })
  return (
    <div>
      <DataGrid table={table} />
      <DataGridPagination table={table} pageSizeOptions={[3, 5, 10]} />
    </div>
  )
}

function ServerPaginationGrid() {
  const [pagination, setPagination] = createSignal<PaginationState>({ pageIndex: 0, pageSize: 5 })
  const options = () => ({
    features: serverFeatures,
    data: people.slice(
      pagination().pageIndex * pagination().pageSize,
      (pagination().pageIndex + 1) * pagination().pageSize,
    ),
    columns: serverColumns,
    getRowId: (row: Person) => row.id,
    manualPagination: true,
    rowCount: people.length,
    state: { pagination: pagination() },
    onPaginationChange: updatePagination,
  })
  const table = createDataGridTable(options())

  function updatePagination(updater: PaginationState | ((previous: PaginationState) => PaginationState)) {
    setPagination(previous => typeof updater === 'function' ? updater(previous) : updater)
    table.setDataGridOptions(options())
  }

  return (
    <div>
      <DataGrid table={table} />
      <DataGridPagination table={table} pageSizeOptions={[3, 5, 10]} />
      <p class="px-space-sm pb-space-sm text-xs text-muted-foreground">
        Request: page={pagination().pageIndex + 1}&amp;pageSize={pagination().pageSize}
      </p>
    </div>
  )
}

export function PaginationDataGridDemo() {
  return (
    <DataGridDemoSection
      title="Pagination"
      description="Pagination is a core feature with two mutually exclusive registrations: client includes the paginated row model; server only owns pagination state/APIs and receives already-paged data."
    >
      <div class="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Client pagination">
          <ClientPaginationGrid />
        </DemoBranch>
        <DemoBranch title="Server pagination">
          <ServerPaginationGrid />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
