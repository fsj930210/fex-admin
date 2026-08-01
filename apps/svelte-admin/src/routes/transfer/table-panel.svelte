<script lang="ts">
  import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
  import {
    DataGrid,
    tableFeatures,
    type Cell,
    type ColumnDef,
    type Header,
    type SvelteDataGridTable,
    type TableOptions,
  } from '@fex/components-svelte/primitive/data-grid'
  import type { TransferPanelApi } from '@fex/components-svelte/primitive/transfer'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import Checkbox from '@fex/components-svelte/ui/checkbox'
  import type { Member } from './data'

  let { api }: { api: TransferPanelApi<Member> } = $props()
  const features = tableFeatures({ rowSelectionFeature })
  type Features = typeof features
  const columns: ColumnDef<Features, Member>[] = [
    { id: '__select__', header: '' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
  ]
  const options = (): TableOptions<Features, Member> => ({
    features,
    data: [...api.items],
    columns,
    getRowId: (row: Member) => row.id,
    enableRowSelection: (row: { original: Member }) => row.original.disabled !== true,
    state: { rowSelection: Object.fromEntries(api.checkedKeys.map((key) => [String(key), true])) },
    onRowSelectionChange: (updater: unknown) => {
      const current = Object.fromEntries(api.checkedKeys.map((key) => [String(key), true]))
      const next = typeof updater === 'function'
        ? (updater as (value: Record<string, boolean>) => Record<string, boolean>)(current)
        : updater as Record<string, boolean>
      api.setCheckedKeys(Object.keys(next).filter((key) => next[key]))
    },
  })
  const table = createDataGridTable(options()) as unknown as SvelteDataGridTable<Features, Member>
  $effect(() => table.setDataGridOptions(options()))
</script>

{#snippet header(item: Header<Features, Member>, _index: number)}
  {#if item.column.id === '__select__'}
    <Checkbox
      checked={item.table.getIsAllRowsSelected() ? true : item.table.getIsSomeRowsSelected() ? 'indeterminate' : false}
      onCheckedChange={(checked) => item.table.toggleAllRowsSelected(checked === true)}
    />
  {:else}
    {String(item.column.columnDef.header ?? '')}
  {/if}
{/snippet}

{#snippet cell(item: Cell<Features, Member>, _index: number)}
  {#if item.column.id === '__select__'}
    <Checkbox
      checked={item.row.getIsSelected()}
      disabled={!item.row.getCanSelect()}
      onCheckedChange={(checked) => item.row.toggleSelected(checked === true)}
    />
  {:else}
    {String(item.getValue() ?? '')}
  {/if}
{/snippet}

<DataGrid {table} {header} {cell} />
