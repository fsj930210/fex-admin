<script lang="ts">
  import { columnOrderingFeature, moveDataGridColumn } from '@fex/components-core/data-grid/features/column-ordering'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import Button from '@fex/components-svelte/ui/button'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  const modules = { columnOrderingFeature }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const ids = ['name', 'department', 'status', 'visits']
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }, { accessorKey: 'visits', header: 'Visits' }]
  const table = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id, initialState: { columnOrder: ids } })
</script>
<DemoSection title="Column ordering" description="The feature only owns columnOrder and actions. These buttons are one possible UI; DnD is demonstrated separately as caller-owned behavior."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Programmatic reorder</h3><div class="flex gap-space-sm"><Button size="sm" variant="outline" onclick={() => table.setColumnOrder(order => moveDataGridColumn(order, 'status', 'name'))}>Move Status first</Button><Button size="sm" variant="outline" onclick={() => table.resetColumnOrder()}>Reset</Button></div><DataGrid {table} /></section></DemoSection>
