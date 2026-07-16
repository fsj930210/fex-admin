<script lang="ts">
  import { columnVisibilityFeature } from '@fex/components-core/data-grid/features/column-visibility'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import Checkbox from '@fex/components-svelte/ui/checkbox'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  const modules = { columnVisibilityFeature }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name', enableHiding: false }, { accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }, { accessorKey: 'visits', header: 'Visits' }]
  const table = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id, initialState: { columnVisibility: { visits: false } } })
  const snapshot = table.dataGridSnapshot
  function isVisible(column: ReturnType<typeof table.getAllLeafColumns>[number]) {
    void $snapshot
    return column.getIsVisible()
  }
</script>
<DemoSection title="Column visibility" description="Visibility state stays in TanStack. The toggle is a separate primitive and respects per-column enableHiding; Name cannot be hidden and Visits starts hidden."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Toggle visible leaf columns</h3><div class="flex flex-wrap gap-space-sm rounded-md border border-border p-space-sm">{#each table.getAllLeafColumns().filter(column => column.getCanHide()) as column (column.id)}<label class="inline-flex items-center gap-2 text-sm"><Checkbox checked={isVisible(column)} onCheckedChange={checked => column.toggleVisibility(checked === true)} />{column.id}</label>{/each}</div><DataGrid {table} /></section></DemoSection>
