<script lang="ts">
  import { columnResizingFeature, columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  const modules = { columnSizingFeature, columnResizingFeature }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 }, { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 }, { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false }, { accessorKey: 'progress', header: 'Progress', size: 140 }]
  const change = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id, columnResizeMode: 'onChange' })
  const end = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id, columnResizeMode: 'onEnd' })
</script>
<DemoSection title="Column sizing and resizing" description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement."><div class="grid gap-space-lg xl:grid-cols-2"><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Resize on change</h3><DataGrid table={change} /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Resize on end + bordered grid</h3><DataGrid table={end} border /></section></div></DemoSection>
