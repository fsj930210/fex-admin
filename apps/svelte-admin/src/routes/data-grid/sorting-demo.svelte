<script lang="ts">
  import { createSortedRowModel, rowSortingFeature, type SortFn, type SortingState } from '@fex/components-core/data-grid/features/row-sorting'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, DataGridSortButton, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import ReactiveTableText from './reactive-table-text.svelte'
  import type { Header } from '@fex/components-svelte/primitive/data-grid'
  const modules = { rowSortingFeature, sortedRowModel: createSortedRowModel() }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const textSort: SortFn<Features, Person> = (a, b, id) => String(a.getValue(id)).localeCompare(String(b.getValue(id)))
  const numberSort: SortFn<Features, Person> = (a, b, id) => Number(a.getValue(id)) - Number(b.getValue(id))
  function grid(kind: 'local' | 'server' | 'mixed', initialSorting: SortingState = []) {
    const columns: ColumnDef<Features, Person>[] = [
      { accessorKey: 'name', header: 'Name', meta: kind === 'server' ? {} : { sortFn: textSort } },
      { accessorKey: 'status', header: 'Status', meta: kind === 'local' ? { sortFn: textSort } : {} },
      { accessorKey: 'visits', header: 'Visits', meta: kind === 'server' ? {} : { sortFn: numberSort, align: 'right' } },
    ]
    const table = createDataGridTable({ features, data: people.slice(0, 7), columns, getRowId: row => row.id, enableMultiSort: true, isMultiSortEvent: () => true, initialState: { sorting: initialSorting } })
    return { table, columns }
  }
  const grids = [
    { ...grid('local', [{ id: 'status', desc: false }, { id: 'visits', desc: true }]), title: 'All local multi-sort' },
    { ...grid('server'), title: 'All server' },
    { ...grid('mixed'), title: 'Mixed per column' },
    { ...grid('server', [{ id: 'status', desc: false }, { id: 'visits', desc: true }]), title: 'Remote multi-sort: Status asc, Visits desc' },
  ]
  function remote(item: (typeof grids)[number]) {
    return item.table.store.get().sorting.filter(term => !item.columns.find(column => ('accessorKey' in column ? column.accessorKey : column.id) === term.id)?.meta?.sortFn)
  }
  function remoteText(item: (typeof grids)[number], revision: number) {
    void revision
    const terms = remote(item)
    return `Remote request sorting: ${terms.length ? JSON.stringify(terms) : 'none'}`
  }
</script>

{#snippet header(item: Header<Features, Person>, revision: number)}
  {@const _revision = revision}
  <DataGridSortButton column={item.column}>{String(item.column.columnDef.header)}</DataGridSortButton>
{/snippet}

<DemoSection title="Column sorting" description="Multi-sort is supported for local columns as well: each click adds or changes a priority and the superscript shows that priority. Columns without meta.sortFn remain remote terms in the same sorting state, while their pass-through comparator leaves local row order unchanged.">
  <div class="grid gap-space-lg xl:grid-cols-2">
    {#each grids as item (item.title)}<section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">{item.title}</h3><DataGrid table={item.table} {header} /><ReactiveTableText snapshot={item.table.dataGridSnapshot} text={revision => remoteText(item, revision)} /></section>{/each}
  </div>
</DemoSection>
