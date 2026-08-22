<script lang="ts">
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  type Features = { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'status', header: 'Status' }]
  const dataTable = createDataTable({ features, data: people.slice(0, 3), columns, getRowId: row => row.id })
  const emptyTable = createDataTable({ features, data: [], columns, getRowId: row => row.id })
</script>
<DemoSection title="Loading, empty and customization states" description="Presentation states are primitive props and structured part classes; they do not change table state or start requests."><div class="grid gap-space-lg xl:grid-cols-3"><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Loading overlay</h3><DataTable table={dataTable} loading loadingContent="Refreshing rows…" /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Custom empty</h3><DataTable table={emptyTable} emptyContent="No matching members" /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Part class customization</h3><DataTable table={dataTable} class={{ header: 'bg-primary/10', row: 'hover:bg-primary/5', cell: 'font-medium' }} /></section></div></DemoSection>
