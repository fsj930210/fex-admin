<script lang="ts">
  import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
  import { createExpandedRowModel, rowExpandingFeature } from '@fex-design/core/data-table/features/row-expanding'
  import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
  import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import Button from '@fex-design/svelte/ui/button'
  import MinusIcon from '@fex-design/svelte/icon/minus'
  import PlusIcon from '@fex-design/svelte/icon/plus'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  import { people4, peopleTree, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import type { Cell, Row } from '@fex-design/svelte/primitive/data-table'
  const modules = { rowExpandingFeature, expandedRowModel: createExpandedRowModel(), columnSizingFeature }
  type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const treeColumns: ColumnDef<Features, Person>[] = [{ id: '__expand__', header: '', size: 44 }, { accessorKey: 'name', header: 'Name' }, { accessorKey: 'department', header: 'Department' }]
  const detailColumns: ColumnDef<Features, Person>[] = [{ id: '__expand__', header: '', size: 44 }, { accessorKey: 'name', header: 'Name' }, { accessorKey: 'status', header: 'Status' }]
  const tree = createDataTable({ features, data: peopleTree, columns: treeColumns, getRowId: row => row.id, getSubRows: row => row.children })
  const detail = createDataTable({ features, data: people4, columns: detailColumns, getRowId: row => row.id, getRowCanExpand: () => true })
</script>
{#snippet cell(item: Cell<Features, Person>, revision: number)}<span data-revision={revision}>{#if item.column.id === '__expand__'}<Button size="icon-sm" variant="outline" disabled={!item.row.getCanExpand()} aria-expanded={item.row.getIsExpanded()} onclick={() => item.row.toggleExpanded()}>{#if item.row.getIsExpanded()}<MinusIcon class="size-4" />{:else}<PlusIcon class="size-4" />{/if}</Button>{:else if item.column.id === 'name'}<span style:padding-inline-start={`${item.row.depth * 16}px`}>{String(item.getValue() ?? '')}</span>{:else}{String(item.getValue() ?? '')}{/if}</span>{/snippet}
{#snippet subComponent(row: Row<Features, Person>)}<div class="bg-muted-background p-space-md text-sm">{row.original.name}: {row.original.visits} visits, {row.original.progress}% progress.</div>{/snippet}
<DemoSection title="Row expansion" description="The same expansion state supports hierarchical subRows and arbitrary detail panels. The expand control is an optional column factory, not a special DataTable mode."><div class="grid gap-space-lg xl:grid-cols-2"><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Hierarchical rows</h3><DataTable table={tree} {cell} /></section><section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Detail panel</h3><DataTable table={detail} {cell} {subComponent} /></section></div></DemoSection>
