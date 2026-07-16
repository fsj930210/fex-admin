<script lang="ts">
  import { aggregationFn_sum, columnGroupingFeature, createGroupedRowModel } from '@fex/components-core/data-grid/features/column-grouping'
  import { createExpandedRowModel, rowExpandingFeature } from '@fex/components-core/data-grid/features/row-expanding'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import Button from '@fex/components-svelte/ui/button'
  import ChevronRightIcon from '@fex/components-svelte/icon/chevron-right'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { people9, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Row } from '@fex/components-svelte/primitive/data-grid'
  const modules = { columnGroupingFeature, groupedRowModel: createGroupedRowModel(), rowExpandingFeature, expandedRowModel: createExpandedRowModel(), aggregationFns: { sum: aggregationFn_sum } }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const columns: ColumnDef<Features, Person>[] = [{ accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }, { accessorKey: 'name', header: 'Name', enableGrouping: false }, { accessorKey: 'visits', header: 'Visits', aggregationFn: 'sum', aggregatedCell: ({ getValue }) => `${getValue()} total`, enableGrouping: false }]
  const reorder = createDataGridTable({ features, data: people9, columns, getRowId: row => row.id, groupedColumnMode: 'reorder', initialState: { grouping: ['department', 'status'], expanded: true } })
  const remove = createDataGridTable({ features, data: people9, columns, getRowId: row => row.id, groupedColumnMode: 'remove', initialState: { grouping: ['department', 'status'], expanded: true } })
  const grids = [{ title: 'Keep Department and Status columns', table: reorder }, { title: 'Hide grouped columns; retain summaries', table: remove }]
</script>
{#snippet groupRow(row: Row<Features, Person>)}<div class="flex min-h-11 items-center gap-space-sm px-space-md" style:padding-inline-start={`${row.depth * 20 + 12}px`}><Button size="icon-xs" variant="ghost" onclick={() => row.toggleExpanded()}><ChevronRightIcon class={`size-3.5 ${row.getIsExpanded() ? 'rotate-90' : ''}`} /></Button><span class="font-semibold">{row.groupingColumnId}</span><span>=</span><span>{String(row.groupingValue)}</span><span class="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">{row.getLeafRows().length} rows</span><span class="ml-auto text-xs text-muted-foreground">Total visits: {String(row.getValue('visits'))}</span></div>{/snippet}
<DemoSection title="Row grouping and aggregation" description="Each group is a full-width summary row above its members. Department is the outer level; Status is nested inside it. The chevron expands only that group, and the right side displays the aggregated visits."><div class="grid gap-space-lg xl:grid-cols-2">{#each grids as item (item.title)}<section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">{item.title}</h3><div class="flex gap-space-sm">{#each ['department', 'status'] as id (id)}<Button size="sm" variant={item.table.getColumn(id)?.getIsGrouped() ? 'default' : 'outline'} onclick={() => item.table.getColumn(id)?.toggleGrouping()}>{item.table.getColumn(id)?.getIsGrouped() ? 'Ungroup' : 'Group'} {id}</Button>{/each}</div><DataGrid table={item.table} {groupRow} /></section>{/each}</div></DemoSection>
