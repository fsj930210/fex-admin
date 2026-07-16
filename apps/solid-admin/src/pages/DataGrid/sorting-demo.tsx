import {
  createSortedRowModel,
  rowSortingFeature,
  type SortFn,
  type SortingState,
} from '@fex/components-core/data-grid/features/row-sorting'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridSortButton,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { Show } from 'solid-js'
import { people, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const sortingModules = {
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
}
type SortingFeatures = typeof sortingModules & {
  columnMeta: DataGridColumnMeta<SortingFeatures, Person>
}
const sortingFeatures: SortingFeatures = tableFeatures({ ...sortingModules, columnMeta: {} })

const textSort: SortFn<typeof sortingFeatures, Person> = (rowA, rowB, id) =>
  String(rowA.getValue(id)).localeCompare(String(rowB.getValue(id)))
const numberSort: SortFn<typeof sortingFeatures, Person> = (rowA, rowB, id) =>
  Number(rowA.getValue(id)) - Number(rowB.getValue(id))

function SortingGrid(props: { kind: 'local' | 'server' | 'mixed'; initialSorting?: SortingState }) {
  const columns: ColumnDef<typeof sortingFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataGridSortButton column={column}>Name</DataGridSortButton>,
      meta: props.kind === 'server' ? {} : { sortFn: textSort },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataGridSortButton column={column}>Status</DataGridSortButton>,
      meta: props.kind === 'local' ? { sortFn: textSort } : {},
    },
    {
      accessorKey: 'visits',
      header: ({ column }) => <DataGridSortButton column={column}>Visits</DataGridSortButton>,
      meta: props.kind === 'server' ? {} : { sortFn: numberSort, align: 'right' },
    },
  ]
  const table = createDataGridTable({
    features: sortingFeatures,
    data: people.slice(0, 7),
    columns,
    getRowId: (row) => row.id,
    enableMultiSort: true,
    isMultiSortEvent: () => true,
    initialState: { sorting: props.initialSorting ?? [] },
  })
  const remote = () =>
    table
      .dataGridSnapshot()
      .state.sorting.filter(
        (item) =>
          !columns.find(
            (column) => ('accessorKey' in column ? column.accessorKey : column.id) === item.id,
          )?.meta?.sortFn,
      )
  return (
    <div class="space-y-space-sm">
      <DataGrid table={table} />
      <p class="text-xs text-muted-foreground">
        Remote request sorting:{' '}
        <Show when={remote().length} fallback="none">
          {JSON.stringify(remote())}
        </Show>
      </p>
    </div>
  )
}

export function SortingDataGridDemo() {
  return (
    <DataGridDemoSection
      title="Column sorting"
      description="Multi-sort is supported for local columns as well: each click adds or changes a priority and the superscript shows that priority. Columns without meta.sortFn remain remote terms in the same sorting state, while their pass-through comparator leaves local row order unchanged."
    >
      <div class="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="All local multi-sort">
          <SortingGrid
            kind="local"
            initialSorting={[
              { id: 'status', desc: false },
              { id: 'visits', desc: true },
            ]}
          />
        </DemoBranch>
        <DemoBranch title="All server">
          <SortingGrid kind="server" />
        </DemoBranch>
        <DemoBranch title="Mixed per column">
          <SortingGrid kind="mixed" />
        </DemoBranch>
        <DemoBranch title="Remote multi-sort: Status asc, Visits desc">
          <SortingGrid
            kind="server"
            initialSorting={[
              { id: 'status', desc: false },
              { id: 'visits', desc: true },
            ]}
          />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
