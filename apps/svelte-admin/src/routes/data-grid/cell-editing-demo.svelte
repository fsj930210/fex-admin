<script lang="ts">
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import InputRoot from '@fex/components-svelte/primitive/input'
  import InputControl from '@fex/components-svelte/primitive/input-control'
  import Button from '@fex/components-svelte/ui/button'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people6, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Cell } from '@fex/components-svelte/primitive/data-grid'
  import { untrack } from 'svelte'
  type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ columnMeta: {} })
  type Field = 'name' | 'status' | 'visits'
  let rows = $state(people6)
  let editing = $state<{ rowId: string; field: Field } | null>(null)
  const columns: ColumnDef<Features, Person>[] = (['name', 'status', 'visits'] as const).map(field => ({ accessorKey: field, header: field[0]!.toUpperCase() + field.slice(1), ...(field === 'visits' ? { meta: { align: 'right' as const } } : {}) }))
  const table = createDataGridTable({ features, data: untrack(() => rows), columns, getRowId: row => row.id })
  function update(id: string, field: Field, value: string) { rows = rows.map(row => row.id === id ? { ...row, [field]: field === 'visits' ? Number(value) || 0 : value } as Person : row); editing = null; table.setDataGridOptions({ features, data: rows, columns, getRowId: row => row.id }) }
</script>
{#snippet cell(item: Cell<Features, Person>)}{#if editing?.rowId === item.row.id && editing?.field === item.column.id}<InputRoot defaultValue={String(item.getValue() ?? '')}><InputControl autofocus type="text" onblur={event => update(item.row.id, item.column.id as Field, event.currentTarget.value)} onkeydown={event => { if (event.key === 'Enter') event.currentTarget.blur(); if (event.key === 'Escape') editing = null }} /></InputRoot>{:else}<Button size="sm" variant="ghost" class="h-auto w-full justify-start px-0 text-inherit" onclick={() => editing = { rowId: item.row.id, field: item.column.id as Field }}>{String(item.getValue() ?? '')}</Button>{/if}{/snippet}
<DemoSection title="Cell editing" description="Editing belongs to application data, not a hidden table copy. Click a value, then press Enter or blur to commit; Escape cancels the current cell."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Editable name, status and visits</h3><DataGrid {table} {cell} /></section></DemoSection>
