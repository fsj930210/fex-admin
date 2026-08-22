<script lang="ts">
  import { columnOrderingFeature, moveDataTableColumn } from '@fex-design/core/data-table/features/column-ordering'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import Button from '@fex-design/svelte/ui/button'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  const modules = { columnOrderingFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const ids = ['name', 'department', 'status', 'visits']
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }, { accessorKey: 'visits', header: 'Visits' }]
  const table = createDataTable({ features, data: people5, columns, getRowId: row => row.id, initialState: { columnOrder: ids } })
</script>
<DemoSection title="Column ordering" description="The feature only owns columnOrder and actions. These buttons are one possible UI; DnD is demonstrated separately as caller-owned behavior."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Programmatic reorder</h3><div class="flex gap-space-sm"><Button size="sm" variant="outline" onclick={() => table.setColumnOrder(order => moveDataTableColumn(order, 'status', 'name'))}>Move Status first</Button><Button size="sm" variant="outline" onclick={() => table.resetColumnOrder()}>Reset</Button></div><DataTable {table} /></section></DemoSection>
