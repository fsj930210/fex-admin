<script lang="ts">
  import { columnFilteringFeature, createFilteredRowModel, type FilterFn } from '@fex/components-core/data-grid/features/column-filtering'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import Input from '@fex/components-svelte/primitive/input'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import ReactiveTableText from './reactive-table-text.svelte'
  const modules = { columnFilteringFeature, filteredRowModel: createFilteredRowModel() }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const includes: FilterFn<Features, Person> = (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase())
  function grid(kind: 'local' | 'server' | 'mixed') {
    const columns: ColumnDef<Features, Person>[] = [
      { accessorKey: 'name', header: 'Name', meta: kind === 'server' ? {} : { filterFn: includes } },
      { accessorKey: 'department', header: 'Department', meta: kind === 'local' ? { filterFn: includes } : {} },
      { accessorKey: 'status', header: 'Status', meta: kind === 'server' ? {} : { filterFn: includes } },
    ]
    return { table: createDataGridTable({ features, data: people.slice(0, 8), columns, getRowId: row => row.id }), columns }
  }
  const grids = [{ ...grid('local'), title: 'All local' }, { ...grid('server'), title: 'All server' }, { ...grid('mixed'), title: 'Mixed per column' }]
  function remote(item: (typeof grids)[number]) { return item.table.store.get().columnFilters.filter(term => !item.columns.find(column => ('accessorKey' in column ? column.accessorKey : column.id) === term.id)?.meta?.filterFn) }
  function remoteText(item: (typeof grids)[number], revision: number) {
    void revision
    const terms = remote(item)
    return `Remote request filters: ${terms.length ? JSON.stringify(terms) : 'none'}`
  }
</script>
<DemoSection title="Column filtering" description="meta.filterFn opts a column into local filtering. Missing filterFn means remote, while onColumnFiltersChange still receives the complete filter list.">
  <div class="grid gap-space-lg xl:grid-cols-3">{#each grids as item (item.title)}<section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">{item.title}</h3><div class="flex flex-wrap gap-space-sm">{#each item.table.getAllLeafColumns() as column (column.id)}<Input class="h-8 w-auto min-w-0 flex-1" placeholder={`Filter ${column.id}`} oninput={event => column.setFilterValue(event.currentTarget.value)} />{/each}</div><DataGrid table={item.table} /><ReactiveTableText snapshot={item.table.dataGridSnapshot} text={revision => remoteText(item, revision)} /></section>{/each}</div>
</DemoSection>
