import {
  columnFilteringFeature,
  createFilteredRowModel,
  type FilterFn,
} from '@fex-design/core/data-table/features/column-filtering'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableFilterInput,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { For, Show } from 'solid-js'
import { people, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const filteringModules = { columnFilteringFeature, filteredRowModel: createFilteredRowModel() }
type FilteringFeatures = typeof filteringModules & {
  columnMeta: DataTableColumnMeta<FilteringFeatures, Person>
}
const filteringFeatures: FilteringFeatures = tableFeatures({ ...filteringModules, columnMeta: {} })
const includes: FilterFn<FilteringFeatures, Person> = (row, id, value) =>
  String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase())

function FilteringGrid(props: { kind: 'local' | 'server' | 'mixed' }) {
  const columns: ColumnDef<FilteringFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: props.kind === 'server' ? {} : { filterFn: includes },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      meta: props.kind === 'local' ? { filterFn: includes } : {},
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: props.kind === 'server' ? {} : { filterFn: includes },
    },
  ]
  const table = createDataTable({
    features: filteringFeatures,
    data: people.slice(0, 8),
    columns,
    getRowId: (row) => row.id,
  })
  const remote = () =>
    table
      .dataTableSnapshot()
      .state.columnFilters.filter(
        (item) =>
          !columns.find(
            (column) => ('accessorKey' in column ? column.accessorKey : column.id) === item.id,
          )?.meta?.filterFn,
      )
  return (
    <div class="space-y-space-sm">
      <div class="flex flex-wrap gap-space-sm">
        <For each={table.getAllLeafColumns()}>
          {(column) => <DataTableFilterInput column={column} placeholder={`Filter ${column.id}`} />}
        </For>
      </div>
      <DataTable table={table} />
      <p class="text-xs text-muted-foreground">
        Remote request filters:{' '}
        <Show when={remote().length} fallback="none">
          {JSON.stringify(remote())}
        </Show>
      </p>
    </div>
  )
}

export function FilteringDataTableDemo() {
  return (
    <DataTableDemoSection
      title="Column filtering"
      description="meta.filterFn opts a column into local filtering. Missing filterFn means remote, while onColumnFiltersChange still receives the complete filter list."
    >
      <div class="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="All local">
          <FilteringGrid kind="local" />
        </DemoBranch>
        <DemoBranch title="All server">
          <FilteringGrid kind="server" />
        </DemoBranch>
        <DemoBranch title="Mixed per column">
          <FilteringGrid kind="mixed" />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
