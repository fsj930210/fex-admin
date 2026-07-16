<script lang="ts">
  import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
  import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import Checkbox from '@fex/components-svelte/ui/checkbox'
  import Radio from '@fex/components-svelte/primitive/radio'
  import RadioGroup from '@fex/components-svelte/primitive/radio-group'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people6, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import ReactiveTableText from './reactive-table-text.svelte'
  import type { Cell, Header } from '@fex/components-svelte/primitive/data-grid'
  const modules = { rowSelectionFeature, columnSizingFeature }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  function grid(mode: 'multiple' | 'single', disabled = false) {
    const columns: ColumnDef<Features, Person>[] = [{ id: mode === 'multiple' ? '__select__' : '__radio__', header: mode === 'multiple' ? 'Select all' : '', size: 44 }, { accessorKey: 'name', header: 'Name' }, { accessorKey: 'status', header: 'Status' }]
    return { mode, table: createDataGridTable({ features, data: people6, columns, getRowId: row => row.id, enableMultiRowSelection: mode === 'multiple', enableRowSelection: disabled ? row => row.original.status !== 'paused' : true }) }
  }
  const grids = [{ title: 'Multiple + select all', ...grid('multiple') }, { title: 'Single', ...grid('single') }, { title: 'Conditional disabled rows', ...grid('multiple', true) }]
  const selectedText = (item: (typeof grids)[number], revision: number) => {
    void revision
    return `Selected: ${Object.keys(item.table.store.get().rowSelection).join(', ') || 'none'}`
  }
</script>
{#snippet header(item: Header<Features, Person>, revision: number)}<span data-revision={revision}>{#if item.column.id === '__select__'}<Checkbox checked={item.table.getIsAllRowsSelected() ? true : item.table.getIsSomeRowsSelected() ? 'indeterminate' : false} onCheckedChange={checked => item.table.toggleAllRowsSelected(checked === true)} />{:else}{String(item.column.columnDef.header ?? '')}{/if}</span>{/snippet}
{#snippet cell(item: Cell<Features, Person>, revision: number)}<span data-revision={revision}>{#if item.column.id === '__select__'}<Checkbox checked={item.row.getIsSelected()} disabled={!item.row.getCanSelect()} onCheckedChange={checked => item.row.toggleSelected(checked === true)} />{:else if item.column.id === '__radio__'}<RadioGroup orientation="horizontal" value={item.row.getIsSelected() ? item.row.id : ''} onValueChange={() => item.row.toggleSelected(true)}><Radio value={item.row.id} disabled={!item.row.getCanSelect()} aria-label={`Select row ${item.row.id}`} /></RadioGroup>{:else}{String(item.getValue() ?? '')}{/if}</span>{/snippet}
<DemoSection title="Row selection" description="The selection feature is headless; the reusable selection-column factory only supplies the conventional control column. Stable getRowId keeps selection independent from sorting and pagination."><div class="grid gap-space-lg xl:grid-cols-3">{#each grids as item (item.title)}<section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">{item.title}</h3><DataGrid table={item.table} {header} {cell} /><ReactiveTableText snapshot={item.table.dataGridSnapshot} text={revision => selectedText(item, revision)} /></section>{/each}</div></DemoSection>
