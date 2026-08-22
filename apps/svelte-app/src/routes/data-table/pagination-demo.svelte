<script lang="ts">
  import {
    createPaginatedRowModel,
    rowPaginationFeature,
    type PaginationState,
  } from '@fex-design/core/data-table/features/client-pagination'
  import { rowPaginationFeature as serverPaginationFeature } from '@fex-design/core/data-table/features/server-pagination'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, DataTablePagination, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people, type Person } from './data'
  import DemoSection from './demo-section.svelte'

  const clientModules = { rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }
  type ClientFeatures = typeof clientModules & { columnMeta: DataTableColumnMeta<ClientFeatures, Person> }
  const clientFeatures: ClientFeatures = tableFeatures({ ...clientModules, columnMeta: {} })
  const serverModules = { rowPaginationFeature: serverPaginationFeature }
  type ServerFeatures = typeof serverModules & { columnMeta: DataTableColumnMeta<ServerFeatures, Person> }
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
  const client = createDataTable({
    features: clientFeatures,
    data: people,
    columns: clientColumns,
    getRowId: row => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })

  let serverPagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 })
  const serverOptions = () => ({
    features: serverFeatures,
    data: people.slice(
      serverPagination.pageIndex * serverPagination.pageSize,
      (serverPagination.pageIndex + 1) * serverPagination.pageSize,
    ),
    columns: serverColumns,
    getRowId: (row: Person) => row.id,
    manualPagination: true,
    rowCount: people.length,
    state: { pagination: serverPagination },
    onPaginationChange: updateServerPagination,
  })
  const server = createDataTable(serverOptions())

  function updateServerPagination(updater: PaginationState | ((previous: PaginationState) => PaginationState)) {
    serverPagination = typeof updater === 'function' ? updater(serverPagination) : updater
    server.setDataTableOptions(serverOptions())
  }
</script>

<DemoSection
  title="Pagination"
  description="Pagination is a core feature with two mutually exclusive registrations: client includes the paginated row model; server only owns pagination state/APIs and receives already-paged data."
>
  <div class="grid gap-space-lg xl:grid-cols-2">
    <section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Client pagination</h3>
      <div><DataTable table={client} /><DataTablePagination table={client} pageSizeOptions={[3, 5, 10]} /></div>
    </section>
    <section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Server pagination</h3>
      <div>
        <DataTable table={server} />
        <DataTablePagination table={server} pageSizeOptions={[3, 5, 10]} />
        <p class="px-space-sm pb-space-sm text-xs text-muted-foreground">Request: page={serverPagination.pageIndex + 1}&amp;pageSize={serverPagination.pageSize}</p>
      </div>
    </section>
  </div>
</DemoSection>
