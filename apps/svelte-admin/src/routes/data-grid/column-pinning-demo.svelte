<script lang="ts">
  import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
  import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import Button from '@fex/components-svelte/ui/button'
  import ChevronLeftIcon from '@fex/components-svelte/icon/chevron-left'
  import ChevronRightIcon from '@fex/components-svelte/icon/chevron-right'
  import MinusIcon from '@fex/components-svelte/icon/minus'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people6, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Header } from '@fex/components-svelte/primitive/data-grid'
  const modules = { columnPinningFeature, columnSizingFeature }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const fields = ['name', 'department', 'status', 'age', 'visits', 'progress'] as const
  const columns: ColumnDef<Features, Person>[] = fields.map(field => ({ accessorKey: field, header: field, size: field === 'name' ? 180 : 130 }))
  const table = createDataGridTable({ features, data: people6, columns, getRowId: row => row.id, initialState: { columnPinning: { start: ['name'], end: ['progress'] } } })
</script>
{#snippet header(item: Header<Features, Person>)}
  <span class="inline-flex items-center gap-1">
    {item.column.id}
    <Button size="icon-xs" variant="ghost" aria-label={`Pin ${item.column.id} to start`} onclick={() => item.column.pin('start')}><ChevronLeftIcon class="size-3.5" /></Button>
    <Button size="icon-xs" variant="ghost" aria-label={`Unpin ${item.column.id}`} onclick={() => item.column.pin(false)}><MinusIcon class="size-3.5" /></Button>
    <Button size="icon-xs" variant="ghost" aria-label={`Pin ${item.column.id} to end`} onclick={() => item.column.pin('end')}><ChevronRightIcon class="size-3.5" /></Button>
  </span>
{/snippet}
<DemoSection title="Column pinning" description="TanStack v9 uses logical start/end regions. DataGrid only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Start, center and end regions</h3><DataGrid {table} {header} /></section></DemoSection>
