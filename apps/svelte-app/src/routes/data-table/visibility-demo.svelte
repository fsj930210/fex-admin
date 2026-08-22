<script lang="ts">
  import { columnVisibilityFeature } from '@fex-design/core/data-table/features/column-visibility'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import Checkbox from '@fex-design/svelte/ui/checkbox'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  const modules = { columnVisibilityFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name', enableHiding: false }, { accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }, { accessorKey: 'visits', header: 'Visits' }]
  const table = createDataTable({ features, data: people5, columns, getRowId: row => row.id, initialState: { columnVisibility: { visits: false } } })
  const snapshot = table.dataTableSnapshot
  function isVisible(column: ReturnType<typeof table.getAllLeafColumns>[number]) {
    void $snapshot
    return column.getIsVisible()
  }
</script>
<DemoSection title="Column visibility" description="Visibility state stays in TanStack. The toggle is a separate primitive and respects per-column enableHiding; Name cannot be hidden and Visits starts hidden."><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Toggle visible leaf columns</h3><div class="flex flex-wrap gap-space-sm rounded-md border border-border p-space-sm">{#each table.getAllLeafColumns().filter(column => column.getCanHide()) as column (column.id)}<label class="inline-flex items-center gap-2 text-sm"><Checkbox checked={isVisible(column)} onCheckedChange={checked => column.toggleVisibility(checked === true)} />{column.id}</label>{/each}</div><DataTable {table} /></section></DemoSection>
