<script lang="ts">
  import { columnResizingFeature, columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  const modules = { columnSizingFeature, columnResizingFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 }, { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 }, { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false }, { accessorKey: 'progress', header: 'Progress', size: 140 }]
  const change = createDataTable({ features, data: people5, columns, getRowId: row => row.id, columnResizeMode: 'onChange' })
  const end = createDataTable({ features, data: people5, columns, getRowId: row => row.id, columnResizeMode: 'onEnd' })
</script>
<DemoSection title="Column sizing and resizing" description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement."><div class="grid gap-space-lg xl:grid-cols-2"><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Resize on change</h3><DataTable table={change} /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Resize on end + bordered table</h3><DataTable table={end} border /></section></div></DemoSection>
