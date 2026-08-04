<script lang="ts">
  import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
  import { rowSelectionFeature } from '@fex-design/core/data-table/features/row-selection'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import Checkbox from '@fex-design/svelte/ui/checkbox'
  import Radio from '@fex-design/svelte/primitive/radio'
  import RadioGroup from '@fex-design/svelte/primitive/radio-group'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people6, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import ReactiveTableText from './reactive-table-text.svelte'
  import type { Cell, Header } from '@fex-design/svelte/primitive/data-table'
  const modules = { rowSelectionFeature, columnSizingFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  function grid(mode: 'multiple' | 'single', disabled = false) {
    const columns: ColumnDef<Features, Person>[] = [{ id: mode === 'multiple' ? '__select__' : '__radio__', header: mode === 'multiple' ? 'Select all' : '', size: 44 }, { accessorKey: 'name', header: 'Name' }, { accessorKey: 'status', header: 'Status' }]
    return { mode, table: createDataTable({ features, data: people6, columns, getRowId: row => row.id, enableMultiRowSelection: mode === 'multiple', enableRowSelection: disabled ? row => row.original.status !== 'paused' : true }) }
  }
  const grids = [{ title: 'Multiple + select all', ...grid('multiple') }, { title: 'Single', ...grid('single') }, { title: 'Conditional disabled rows', ...grid('multiple', true) }]
  const selectedText = (item: (typeof grids)[number], revision: number) => {
    void revision
    return `Selected: ${Object.keys(item.table.store.get().rowSelection).join(', ') || 'none'}`
  }
</script>
{#snippet header(item: Header<Features, Person>, revision: number)}<span data-revision={revision}>{#if item.column.id === '__select__'}<Checkbox checked={item.table.getIsAllRowsSelected() ? true : item.table.getIsSomeRowsSelected() ? 'indeterminate' : false} onCheckedChange={checked => item.table.toggleAllRowsSelected(checked === true)} />{:else}{String(item.column.columnDef.header ?? '')}{/if}</span>{/snippet}
{#snippet cell(item: Cell<Features, Person>, revision: number)}<span data-revision={revision}>{#if item.column.id === '__select__'}<Checkbox checked={item.row.getIsSelected()} disabled={!item.row.getCanSelect()} onCheckedChange={checked => item.row.toggleSelected(checked === true)} />{:else if item.column.id === '__radio__'}<RadioGroup orientation="horizontal" value={item.row.getIsSelected() ? item.row.id : ''} onValueChange={() => item.row.toggleSelected(true)}><Radio value={item.row.id} disabled={!item.row.getCanSelect()} aria-label={`Select row ${item.row.id}`} /></RadioGroup>{:else}{String(item.getValue() ?? '')}{/if}</span>{/snippet}
<DemoSection title="Row selection" description="The selection feature is headless; the reusable selection-column factory only supplies the conventional control column. Stable getRowId keeps selection independent from sorting and pagination."><div class="grid gap-space-lg xl:grid-cols-3">{#each grids as item (item.title)}<section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">{item.title}</h3><DataTable table={item.table} {header} {cell} /><ReactiveTableText snapshot={item.table.dataTableSnapshot} text={revision => selectedText(item, revision)} /></section>{/each}</div></DemoSection>
