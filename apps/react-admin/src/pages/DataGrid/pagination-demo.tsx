import { createPaginatedRowModel, rowPaginationFeature, type PaginationState } from '@fex/components-core/data-grid/features/client-pagination'
import { rowPaginationFeature as serverRowPaginationFeature } from '@fex/components-core/data-grid/features/server-pagination'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, DataGridPagination, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { useMemo, useState } from 'react'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people, resolveUpdater, type Person } from './data'

const clientFeatures = tableFeatures({ rowPaginationFeature, paginatedRowModel: createPaginatedRowModel(), columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })
const serverFeatures = tableFeatures({ rowPaginationFeature: serverRowPaginationFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
] as ColumnDef<TableFeatures, Person>[]

function ClientPaginationGrid() {
  const table = useDataGridTable({ features: clientFeatures, data: people, columns, getRowId: (row) => row.id, initialState: { pagination: { pageIndex: 0, pageSize: 5 } } })
  return <div><DataGrid table={table} /><DataGridPagination table={table} pageSizeOptions={[3, 5, 10]} /></div>
}

function ServerPaginationGrid() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })
  // TanStack uses the data reference as a row-model boundary; keep a server page stable until pagination changes.
  const page = useMemo(
    () => people.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [pagination.pageIndex, pagination.pageSize],
  )
  const table = useDataGridTable({
    features: serverFeatures,
    data: page,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    rowCount: people.length,
    state: { pagination },
    onPaginationChange: (updater) => setPagination((previous) => resolveUpdater(updater, previous)),
  })
  return <div><DataGrid table={table} /><DataGridPagination table={table} pageSizeOptions={[3, 5, 10]} /><p className="px-space-sm pb-space-sm text-xs text-muted-foreground">Request: page={pagination.pageIndex + 1}&amp;pageSize={pagination.pageSize}</p></div>
}

export function PaginationDataGridDemo() {
  return (
    <DataGridDemoSection title="Pagination" description="Pagination is a core feature with two mutually exclusive registrations: client includes the paginated row model; server only owns pagination state/APIs and receives already-paged data.">
      <div className="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Client pagination"><ClientPaginationGrid /></DemoBranch>
        <DemoBranch title="Server pagination"><ServerPaginationGrid /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
