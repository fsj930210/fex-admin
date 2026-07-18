<script lang="ts">
  import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
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
  type Features = { columnSizingFeature: typeof columnSizingFeature; columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ columnSizingFeature, columnMeta: {} })
  let rows = $state(people6), draft = $state<Person | null>(null)
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }, { id: '__actions__', header: 'Actions', size: 180 }]
  const table = createDataGridTable({ features, data: untrack(() => rows), columns, getRowId: row => row.id })
  function updateField(fieldName: 'name' | 'department' | 'status', value: string) { if (draft) draft = { ...draft, [fieldName]: value } }
  function save() { if (!draft) return; rows = rows.map(row => row.id === draft!.id ? draft! : row); draft = null; table.setDataGridOptions({ features, data: rows, columns, getRowId: row => row.id }) }
</script>
{#snippet cell(item: Cell<Features, Person>)}{#if item.column.id === '__actions__'}{#if draft?.id === item.row.id}<span class="inline-flex gap-space-sm"><Button size="sm" onclick={save}>Save</Button><Button size="sm" variant="outline" onclick={() => draft = null}>Cancel</Button></span>{:else}<Button size="sm" variant="outline" onclick={() => draft = { ...item.row.original }}>Edit row</Button>{/if}{:else if draft?.id === item.row.id}<InputRoot value={String(draft?.[item.column.id as 'name' | 'department' | 'status'] ?? '')}><InputControl oninput={event => updateField(item.column.id as 'name' | 'department' | 'status', event.currentTarget.value)} /></InputRoot>{:else}{String(item.getValue() ?? '')}{/if}{/snippet}
<DemoSection title="Row editing" description="Edit row creates one application-owned draft. Save replaces that row in the caller data; Cancel discards the draft without touching the table data."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Draft, save and cancel</h3><DataGrid {table} {cell} /></section></DemoSection>
