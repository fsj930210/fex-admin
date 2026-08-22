<script lang="ts">
  import { columnPinningFeature } from '@fex-design/core/data-table/features/column-pinning'
  import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import Button from '@fex-design/svelte/ui/button'
  import ChevronLeftIcon from '@fex-design/svelte/icon/chevron-left'
  import ChevronRightIcon from '@fex-design/svelte/icon/chevron-right'
  import MinusIcon from '@fex-design/svelte/icon/minus'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people6, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Header } from '@fex-design/svelte/primitive/data-table'
  const modules = { columnPinningFeature, columnSizingFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const fields = ['name', 'department', 'status', 'age', 'visits', 'progress'] as const
  const columns: ColumnDef<Features, Person>[] = fields.map(field => ({ accessorKey: field, header: field, size: field === 'name' ? 180 : 130 }))
  const table = createDataTable({ features, data: people6, columns, getRowId: row => row.id, initialState: { columnPinning: { start: ['name'], end: ['progress'] } } })
</script>
{#snippet header(item: Header<Features, Person>)}
  <span class="inline-flex items-center gap-1">
    {item.column.id}
    <Button size="icon-xs" variant="ghost" aria-label={`Pin ${item.column.id} to start`} onclick={() => item.column.pin('start')}><ChevronLeftIcon class="size-3.5" /></Button>
    <Button size="icon-xs" variant="ghost" aria-label={`Unpin ${item.column.id}`} onclick={() => item.column.pin(false)}><MinusIcon class="size-3.5" /></Button>
    <Button size="icon-xs" variant="ghost" aria-label={`Pin ${item.column.id} to end`} onclick={() => item.column.pin('end')}><ChevronRightIcon class="size-3.5" /></Button>
  </span>
{/snippet}
<DemoSection title="Column pinning" description="TanStack v9 uses logical start/end regions. DataTable only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Start, center and end regions</h3><DataTable {table} {header} /></section></DemoSection>
