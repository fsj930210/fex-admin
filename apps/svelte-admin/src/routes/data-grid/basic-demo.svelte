<script lang="ts">
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'

  type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'progress', header: 'Progress', meta: { align: 'right' }, cell: ({ getValue }) => `${getValue()}%` },
  ]
  const defaultTable = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id })
  const compactTable = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id })
</script>

<DemoSection title="Core rendering and stable inline columns" description="The caller passes a TanStack v9 table definition. DataGrid stabilizes the structural column tree, so this inline columns array does not require useMemo; getRowId remains mandatory.">
  <section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Default density</h3><DataGrid table={defaultTable} /></section>
  <section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Compact + striped</h3><DataGrid table={compactTable} density="compact" striped /></section>
</DemoSection>
