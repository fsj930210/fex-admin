<script lang="ts">
  import { columnOrderingFeature } from '@fex/components-core/data-grid/features/column-ordering'
  import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
  import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
  import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
  import type { SortableControllerSnapshot } from '@fex/components-core/sortable/types'
  import { DataGrid, DataGridColumnOverlay, DataGridRowOverlay, tableFeatures, type ColumnDef } from '@fex/components-svelte/primitive/data-grid'
  import { createSortableAction } from '@fex/components-svelte/actions/sortable'
  import { createDataGridTable } from '@fex/components-svelte/stores/create-data-grid-table'
  import { onDestroy, untrack } from 'svelte'
  import type { Cell, Header } from '@fex/components-svelte/primitive/data-grid'
  import { people5, type Person } from './data'
  import DemoSection from './demo-section.svelte'
  import EllipsisIcon from '@fex/components-svelte/icon/more'

  const modules = { columnOrderingFeature, columnPinningFeature, columnSizingFeature }
  type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
  const features: Features = tableFeatures({ ...modules, columnMeta: {} })
  const initial = ['name', 'department', 'status', 'id', 'age', 'visits', 'progress']
  const groups: Partial<Record<string, 'identity' | 'metrics'>> = { name: 'identity', department: 'identity', status: 'identity', visits: 'metrics', progress: 'metrics' }
  const labels: Record<string, string> = { name: 'Name', department: 'Department', status: 'Status', id: 'ID', age: 'Age', visits: 'Visits', progress: 'Progress' }
  const emptySnapshot: SortableControllerSnapshot = { activeId: null, activeContainerId: null, overId: null, overContainerId: null, dragging: false, activeRect: null, dragOffset: { x: 0, y: 0 }, items: {}, motionVersion: 0 }

  function columnGrid(constrained: boolean) {
    let order = [...initial]
    let snapshot = $state(emptySnapshot)
    let activeId: string | null = null
    let overId: string | null = null
    let message = $state('Drag a header with the project Sortable action.')
    const leaf = (id: string): ColumnDef<Features, Person> => ({ accessorKey: id, size: id === 'name' ? 180 : id === 'department' ? 170 : 140, header: labels[id] }) as unknown as ColumnDef<Features, Person>
    const leaves = initial.map(leaf)
    const columns: ColumnDef<Features, Person>[] = constrained ? [{ id: 'identity', header: 'Identity', columns: leaves.filter(column => 'accessorKey' in column && ['name', 'department', 'status'].includes(String(column.accessorKey))) }, ...leaves.filter(column => 'accessorKey' in column && ['id', 'age'].includes(String(column.accessorKey))), { id: 'metrics', header: 'Metrics', columns: leaves.filter(column => 'accessorKey' in column && ['visits', 'progress'].includes(String(column.accessorKey))) }] : leaves
    const table = createDataGridTable({ features, data: people5, columns, getRowId: row => row.id, initialState: { columnOrder: order, ...(constrained ? { columnPinning: { start: ['name'], end: ['progress'] } } : {}) } })
    const onChange = (next: string[]) => {
      const source = activeId ?? '', target = overId ?? ''
      if (constrained && (['name', 'progress'].includes(source) || ['name', 'progress'].includes(target))) { table.setColumnOrder(order); message = 'Rejected: pinned columns cannot be moved or targeted.'; return }
      if (constrained && groups[source] !== groups[target]) { table.setColumnOrder(order); message = 'Rejected: columns must share a real group, or both be ungrouped.'; return }
      order = [...next]; table.setColumnOrder(order); sortable.updateOptions({ items: order, axis: 'x', onChange, onSnapshot }); message = `Moved ${source} near ${target}.`
    }
    const onSnapshot = (value: SortableControllerSnapshot) => {
      snapshot = value
      if (typeof value.activeId === 'string') activeId = value.activeId
      if (typeof value.overId === 'string') overId = value.overId
      table.setColumnOrder(
        value.activeId === null ? order : (sortable.getPreviewItems() as string[]),
      )
    }
    const sortable = createSortableAction({ items: order, axis: 'x', onChange, onSnapshot })
    return {
      table, constrained,
      message: () => message,
      snapshot: () => snapshot,
      container: (node: HTMLElement) => sortable.container(node),
      headerAction: (node: HTMLElement, header: ReturnType<typeof table.getFlatHeaders>[number]) => header.isPlaceholder || header.column.columns.length || (constrained && ['name', 'progress'].includes(header.column.id)) ? undefined : sortable.item(node, { id: header.column.id }),
      cellAction: (node: HTMLElement, cell: Cell<Features, Person>) => { const cleanup = sortable.controller.registerMotionTarget(cell.column.id, node); return cleanup ? { destroy: cleanup } : undefined },
      activeHeader: () => typeof snapshot.activeId === 'string' ? table.getFlatHeaders().find(header => header.column.id === snapshot.activeId) : undefined,
      overlayStyle: () => {
        // Keep the inline style subscribed to pointer movement, not only the
        // active id that mounts the overlay.
        void snapshot.motionVersion
        return styleToString(sortable.getOverlayStyle())
      },
      motionStyle: (id: string) => {
        void snapshot.motionVersion
        return styleToString(sortable.getMotionStyle(id))
      },
      destroy: () => sortable.destroy(),
    }
  }
  const free = columnGrid(false), locked = columnGrid(true)
  const rowColumns: ColumnDef<Features, Person>[] = [{ id: '__drag__', header: '', size: 44 }, { accessorKey: 'name', header: 'Name' }, { accessorKey: 'department', header: 'Department' }, { accessorKey: 'status', header: 'Status' }]
  let rowOrder = $state(people5.map(person => person.id)), rowSnapshot = $state(emptySnapshot)
  const rowData = (order: readonly string[] = rowOrder) => order.map(id => people5.find(person => person.id === id)).filter((row): row is Person => row !== undefined)
  let committedRows = rowData()
  const rowTable = createDataGridTable({ features, data: committedRows, columns: rowColumns, getRowId: row => row.id })
  const syncRowTable = (order: readonly string[] = rowOrder) => {
    committedRows = rowData(order)
    rowTable.setDataGridOptions({ features, data: committedRows, columns: rowColumns, getRowId: row => row.id })
  }
  const onRowChange = (next: string[]) => {
    rowOrder = [...next]
    rowSortable.updateOptions({ items: rowOrder, axis: 'y', onChange: onRowChange, onSnapshot: updateRowSnapshot })
    syncRowTable()
  }
  const updateRowSnapshot = (value: SortableControllerSnapshot) => {
    rowSnapshot = value
    syncRowTable(value.activeId === null ? rowOrder : (rowSortable.getPreviewItems() as string[]))
  }
  const rowSortable = createSortableAction({ items: untrack(() => rowOrder), axis: 'y', onChange: onRowChange, onSnapshot: updateRowSnapshot })
  const rowContainer = (node: HTMLElement) => rowSortable.container(node)
  const rowAction = (node: HTMLElement, row: ReturnType<typeof rowTable.getRowModel>['rows'][number]) => rowSortable.item(node, { id: row.id })
  const activeRow = () => typeof rowSnapshot.activeId === 'string' ? rowTable.getRowModel().rows.find(row => row.id === rowSnapshot.activeId) : undefined
  const rowOverlayStyle = () => {
    void rowSnapshot.motionVersion
    return styleToString(rowSortable.getOverlayStyle())
  }
  const styleToString = (style: object) => (Object.entries(style) as Array<[string, string | number | undefined]>).filter(([, value]) => value !== undefined).map(([key, value]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${value}`).join(';')
  onDestroy(() => { free.destroy(); locked.destroy(); rowSortable.destroy() })
</script>
{#snippet dndHeader(item: Header<Features, Person>)}
  {#if item.column.columns.length}{String(item.column.columnDef.header ?? '')}{:else}<span class="inline-flex min-w-0 items-center gap-2"><EllipsisIcon class="size-4 rotate-90 text-muted-foreground" /><span class="truncate">{labels[item.column.id]}</span></span>{/if}
{/snippet}
{#snippet rowOverlayCell(item: Cell<Features, Person>)}
  {#if item.column.id === '__drag__'}<EllipsisIcon class="size-4 rotate-90 text-muted-foreground" />{:else}{String(item.getValue() ?? '')}{/if}
{/snippet}
<DemoSection title="Column and row DnD with project Sortable" description="Both axes reuse the existing useSortable controller, overlay and motion registry. DataGrid only exposes native part props so callers can attach the project interaction without binding a policy into the table primitive.">
  <div class="space-y-space-lg">
    {#each [free, locked] as item (String(item.constrained))}<section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">{item.constrained ? 'Column: group boundaries + pinned locked' : 'Column reorder'}</h3><div use:item.container><DataGrid table={item.table} header={dndHeader} headerAction={item.headerAction} cellAction={item.cellAction} getCellProps={cell => ({ style: `${item.motionStyle(cell.column.id)};visibility:${item.snapshot().activeId === cell.column.id ? 'hidden' : 'visible'}` })} /></div><p class="text-xs text-muted-foreground">{item.message()}</p>{#if item.activeHeader()}<DataGridColumnOverlay table={item.table} header={item.activeHeader()!} headerContent={dndHeader} style={`${item.overlayStyle()};height:auto`} />{/if}</section>{/each}
    <section class="space-y-space-sm"><h3 class="text-sm font-medium text-foreground">Row reorder</h3><div use:rowContainer><DataGrid table={rowTable} cell={rowOverlayCell} {rowAction} getRowProps={row => ({ class: rowSnapshot.activeId === row.id ? 'opacity-0' : undefined, style: styleToString(rowSortable.getItemStyle(row.id)) })} /></div><p class="text-xs text-muted-foreground">Current row order: {rowOrder.join(' → ')}</p>{#if activeRow()}<DataGridRowOverlay table={rowTable} row={activeRow()!} cellContent={rowOverlayCell} style={rowOverlayStyle()} />{/if}</section>
  </div>
</DemoSection>
