<script lang="ts">
  import { rowPinningFeature } from '@fex-design/core/data-table/features/row-pinning'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import Button from '@fex-design/svelte/ui/button'
  import Badge from '@fex-design/svelte/ui/badge'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people7, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Cell } from '@fex-design/svelte/primitive/data-table'
  const modules = { rowPinningFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'status', header: 'Status' }, { id: 'pin', header: 'Pin row' }]
  const table = createDataTable({ features, data: people7, columns, getRowId: row => row.id, initialState: { rowPinning: { top: ['u-006'], bottom: ['u-002'] } } })
</script>
{#snippet cell(item: Cell<Features, Person>)}
  {#if item.column.id === 'name'}<span class="inline-flex items-center gap-2">{#if item.row.getIsPinned()}<Badge variant="outline">Pinned {item.row.getIsPinned()}</Badge>{/if}{item.row.original.name}</span>{:else if item.column.id === 'pin'}<span class="inline-flex gap-1"><Button size="sm" variant="outline" onclick={() => item.row.pin('top')}>Top</Button><Button size="sm" variant="outline" onclick={() => item.row.pin(false)}>Center</Button><Button size="sm" variant="outline" onclick={() => item.row.pin('bottom')}>Bottom</Button></span>{:else}{item.row.original.status}{/if}
{/snippet}
<DemoSection title="Row pinning" description="Pinned rows are opaque layers above the scrollable center region. Their edge shadow appears only at the boundary, and the controls can add more rows to either region."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Top, scrollable center and bottom</h3><DataTable {table} {cell} class={{ viewport: 'max-h-56' }} /></section></DemoSection>
