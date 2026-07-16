import {
  columnFilteringFeature,
  createFilteredRowModel,
  type FilterFn,
} from '@fex/components-core/data-grid/features/column-filtering'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridFilterInput,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { For, Show } from 'solid-js'
import { people, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const filteringModules = { columnFilteringFeature, filteredRowModel: createFilteredRowModel() }
type FilteringFeatures = typeof filteringModules & {
  columnMeta: DataGridColumnMeta<FilteringFeatures, Person>
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
  const table = createDataGridTable({
    features: filteringFeatures,
    data: people.slice(0, 8),
    columns,
    getRowId: (row) => row.id,
  })
  const remote = () =>
    table
      .dataGridSnapshot()
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
          {(column) => <DataGridFilterInput column={column} placeholder={`Filter ${column.id}`} />}
        </For>
      </div>
      <DataGrid table={table} />
      <p class="text-xs text-muted-foreground">
        Remote request filters:{' '}
        <Show when={remote().length} fallback="none">
          {JSON.stringify(remote())}
        </Show>
      </p>
    </div>
  )
}

export function FilteringDataGridDemo() {
  return (
    <DataGridDemoSection
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
    </DataGridDemoSection>
  )
}
