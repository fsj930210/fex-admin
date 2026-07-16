<script lang="ts">
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'status', header: 'Status' }]
  const dataTable = createDataGridTable({ features, data: people.slice(0, 3), columns, getRowId: row => row.id })
  const emptyTable = createDataGridTable({ features, data: [], columns, getRowId: row => row.id })
</script>
<DemoSection title="Loading, empty and customization states" description="Presentation states are primitive props and structured part classes; they do not change table state or start requests."><div class="grid gap-space-lg xl:grid-cols-3"><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Loading overlay</h3><DataGrid table={dataTable} loading loadingContent="Refreshing rows…" /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Custom empty</h3><DataGrid table={emptyTable} emptyContent="No matching members" /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Part class customization</h3><DataGrid table={dataTable} class={{ header: 'bg-primary/10', row: 'hover:bg-primary/5', cell: 'font-medium' }} /></section></div></DemoSection>
