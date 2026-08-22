<script lang="ts">
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import InputRoot from '@fex-design/svelte/primitive/input'
  import InputControl from '@fex-design/svelte/primitive/input-control'
  import Button from '@fex-design/svelte/ui/button'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people6, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Cell } from '@fex-design/svelte/primitive/data-table'
  import { untrack } from 'svelte'
  type Features = { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ columnMeta: {} })
  type Field = 'name' | 'status' | 'visits'
  let rows = $state(people6)
  let editing = $state<{ rowId: string; field: Field } | null>(null)
  const columns: ColumnDef<Features, Person>[] = (['name', 'status', 'visits'] as const).map(field => ({ accessorKey: field, header: field[0]!.toUpperCase() + field.slice(1), ...(field === 'visits' ? { meta: { align: 'right' as const } } : {}) }))
  const table = createDataTable({ features, data: untrack(() => rows), columns, getRowId: row => row.id })
  function update(id: string, field: Field, value: string) { rows = rows.map(row => row.id === id ? { ...row, [field]: field === 'visits' ? Number(value) || 0 : value } as Person : row); editing = null; table.setDataTableOptions({ features, data: rows, columns, getRowId: row => row.id }) }
</script>
{#snippet cell(item: Cell<Features, Person>)}{#if editing?.rowId === item.row.id && editing?.field === item.column.id}<InputRoot defaultValue={String(item.getValue() ?? '')}><InputControl autofocus type="text" onblur={event => update(item.row.id, item.column.id as Field, event.currentTarget.value)} onkeydown={event => { if (event.key === 'Enter') event.currentTarget.blur(); if (event.key === 'Escape') editing = null }} /></InputRoot>{:else}<Button size="sm" variant="ghost" class="h-auto w-full justify-start px-0 text-inherit" onclick={() => editing = { rowId: item.row.id, field: item.column.id as Field }}>{String(item.getValue() ?? '')}</Button>{/if}{/snippet}
<DemoSection title="Cell editing" description="Editing belongs to application data, not a hidden table copy. Click a value, then press Enter or blur to commit; Escape cancels the current cell."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Editable name, status and visits</h3><DataTable {table} {cell} /></section></DemoSection>
