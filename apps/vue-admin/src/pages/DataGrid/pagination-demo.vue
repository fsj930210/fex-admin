<script setup lang="ts">
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  type PaginationState,
} from '@fex/components-core/data-grid/features/client-pagination'
import { rowPaginationFeature as serverFeature } from '@fex/components-core/data-grid/features/server-pagination'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridPagination,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { ref } from 'vue'
import { people, type Person } from './data'
import DemoSection from './demo-section.vue'

const clientModules = { rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }
type ClientFeatures = typeof clientModules & {
  columnMeta: DataGridColumnMeta<ClientFeatures, Person>
}
const clientFeatures: ClientFeatures = tableFeatures({ ...clientModules, columnMeta: {} })
const serverModules = { rowPaginationFeature: serverFeature }
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
const client = useDataGridTable({
  features: clientFeatures,
  data: people,
  columns: clientColumns,
  getRowId: (row) => row.id,
  initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
})

const serverPagination = ref<PaginationState>({ pageIndex: 0, pageSize: 5 })
const serverOptions = () => ({
  features: serverFeatures,
  data: people.slice(
    serverPagination.value.pageIndex * serverPagination.value.pageSize,
    (serverPagination.value.pageIndex + 1) * serverPagination.value.pageSize,
  ),
  columns: serverColumns,
  getRowId: (row: Person) => row.id,
  manualPagination: true,
  rowCount: people.length,
  state: { pagination: serverPagination.value },
  onPaginationChange: updateServerPagination,
})
const server = useDataGridTable(serverOptions())

function updateServerPagination(
  updater: PaginationState | ((previous: PaginationState) => PaginationState),
) {
  serverPagination.value = typeof updater === 'function' ? updater(serverPagination.value) : updater
  server.setDataGridOptions(serverOptions())
}
</script>

<template>
  <DemoSection
    title="Pagination"
    description="Pagination is a core feature with two mutually exclusive registrations: client includes the paginated row model; server only owns pagination state/APIs and receives already-paged data."
  >
    <div class="grid gap-space-lg xl:grid-cols-2">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Client pagination</h3>
        <div>
          <DataGrid :table="client" /><DataGridPagination
            :table="client"
            :page-size-options="[3, 5, 10]"
          />
        </div>
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Server pagination</h3>
        <div>
          <DataGrid :table="server" />
          <DataGridPagination :table="server" :page-size-options="[3, 5, 10]" />
          <p class="px-space-sm pb-space-sm text-xs text-muted-foreground">
            Request: page={{ serverPagination.pageIndex + 1 }}&amp;pageSize={{
              serverPagination.pageSize
            }}
          </p>
        </div>
      </section>
    </div>
  </DemoSection>
</template>
