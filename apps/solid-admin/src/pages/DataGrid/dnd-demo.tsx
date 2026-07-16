import { columnOrderingFeature } from '@fex/components-core/data-grid/features/column-ordering'
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridColumnOverlay,
  DataGridRowOverlay,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { createSortable } from '@fex/components-solid/primitives/create-sortable'
import { cn } from '@fex/utils'
import { EllipsisIcon } from '@fex/components-solid/icon/more'
import { createEffect, createSignal, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import { people5, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const columnModules = { columnOrderingFeature, columnPinningFeature, columnSizingFeature }
type ColumnDndFeatures = typeof columnModules & {
  columnMeta: DataGridColumnMeta<ColumnDndFeatures, Person>
}
const columnDndFeatures: ColumnDndFeatures = tableFeatures({ ...columnModules, columnMeta: {} })
type RowDndFeatures = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<RowDndFeatures, Person>
}
const rowDndFeatures: RowDndFeatures = tableFeatures({ columnSizingFeature, columnMeta: {} })
const initialColumnOrder = ['name', 'department', 'status', 'id', 'age', 'visits', 'progress']
const groupById: Partial<Record<string, 'identity' | 'metrics'>> = {
  name: 'identity',
  department: 'identity',
  status: 'identity',
  visits: 'metrics',
  progress: 'metrics',
}
const labels: Record<string, string> = {
  name: 'Name',
  department: 'Department',
  status: 'Status',
  id: 'ID',
  age: 'Age',
  visits: 'Visits',
  progress: 'Progress',
}

const isPinnedDndColumn = (id: string) => id === 'name' || id === 'progress'
const rowsForOrder = (order: readonly string[]) =>
  order
    .map((id) => people5.find((person) => person.id === id))
    .filter((row): row is Person => row !== undefined)

function ColumnDndGrid(props: { constrained: boolean }) {
  const [columnOrder, setColumnOrder] = createSignal([...initialColumnOrder])
  const [message, setMessage] = createSignal(
    'Drag a header with the project createSortable primitive.',
  )
  const leaf = (id: string): ColumnDef<ColumnDndFeatures, Person> =>
    ({
      accessorKey: id,
      size: id === 'name' ? 180 : id === 'department' ? 170 : 140,
      header: () => (
        <span class="inline-flex min-w-0 items-center gap-2">
          <EllipsisIcon class="size-4 rotate-90 text-muted-foreground" />
          <span class="truncate">{labels[id]}</span>
        </span>
      ),
    }) as unknown as ColumnDef<ColumnDndFeatures, Person>
  const leafColumns = initialColumnOrder.map(leaf)
  const columns: ColumnDef<ColumnDndFeatures, Person>[] = props.constrained
    ? [
        {
          id: 'identity',
          header: 'Identity',
          columns: leafColumns.filter(
            (column) =>
              'accessorKey' in column &&
              ['name', 'department', 'status'].includes(String(column.accessorKey)),
          ),
        },
        ...leafColumns.filter(
          (column) => 'accessorKey' in column && ['id', 'age'].includes(String(column.accessorKey)),
        ),
        {
          id: 'metrics',
          header: 'Metrics',
          columns: leafColumns.filter(
            (column) =>
              'accessorKey' in column &&
              ['visits', 'progress'].includes(String(column.accessorKey)),
          ),
        },
      ]
    : leafColumns
  const table = createDataGridTable({
    features: columnDndFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: {
      columnOrder: columnOrder(),
      ...(props.constrained ? { columnPinning: { start: ['name'], end: ['progress'] } } : {}),
    },
  })
  let activeColumnId: string | null = null
  let overColumnId: string | null = null
  const handleChange = (next: string[]) => {
    const source = activeColumnId ?? ''
    const target = overColumnId ?? ''
    if (props.constrained && (isPinnedDndColumn(source) || isPinnedDndColumn(target))) {
      setMessage('Rejected: pinned columns cannot be moved or targeted.')
      table.setColumnOrder(columnOrder())
      return
    }
    if (props.constrained && groupById[source] !== groupById[target]) {
      setMessage('Rejected: columns must be in the same group, or both ungrouped.')
      table.setColumnOrder(columnOrder())
      return
    }
    setColumnOrder([...next])
    table.setColumnOrder([...next])
    sortable.update({ items: [...next], axis: 'x', onChange: handleChange })
    setMessage(`Moved ${source} near ${target}.`)
  }
  const sortable = createSortable({ items: columnOrder(), axis: 'x', onChange: handleChange })
  // The sortable controller is an external interaction system. Mirror only its
  // preview order into TanStack so headers and cells animate together during drag.
  createEffect(() => {
    const current = sortable.snapshot()
    if (typeof current.activeId === 'string') activeColumnId = current.activeId
    if (typeof current.overId === 'string') overColumnId = current.overId
    table.setColumnOrder(
      current.activeId === null ? columnOrder() : (sortable.previewItems() as string[]),
    )
  })
  const start = (event: PointerEvent, id: string) => {
    activeColumnId = id
    overColumnId = null
    sortable.update({ items: columnOrder(), axis: 'x', onChange: handleChange })
    sortable.onPointerDown(event, id)
  }
  const activeHeader = () =>
    typeof sortable.snapshot().activeId === 'string'
      ? table.getFlatHeaders().find((header) => header.column.id === sortable.snapshot().activeId)
      : undefined
  return (
    <div class="space-y-space-sm">
      <DataGrid
        table={table}
        ref={sortable.setContainer()}
        getHeaderProps={(header) =>
          header.isPlaceholder ||
          header.column.columns.length > 0 ||
          (props.constrained && ['name', 'progress'].includes(header.column.id))
            ? {}
            : {
                ref: sortable.setItem(header.column.id),
                'data-sortable-id': header.column.id,
                class: 'cursor-grab touch-none select-none active:cursor-grabbing',
                onPointerDown: (event) => start(event, header.column.id),
                style: sortable.getItemStyle(header.column.id),
              }
        }
        getCellProps={(cell) => ({
          ref: (element) => sortable.registerMotionTarget(cell.column.id, element),
          style: {
            ...sortable.getMotionStyle(cell.column.id),
            visibility: sortable.snapshot().activeId === cell.column.id ? 'hidden' : undefined,
          },
        })}
      />
      <p class="text-xs text-muted-foreground">{message()}</p>
      <Show when={activeHeader()}>
        {(header) => (
          <Portal>
            <DataGridColumnOverlay
              header={header()}
              table={table}
              style={{ ...sortable.getOverlayStyle(), height: 'auto' }}
            />
          </Portal>
        )}
      </Show>
    </div>
  )
}

function RowDndGrid() {
  const [rowOrder, setRowOrder] = createSignal(people5.map((person) => person.id))
  const columns: ColumnDef<RowDndFeatures, Person>[] = [
    {
      id: '__drag__',
      header: '',
      cell: () => (
        <span class="cursor-grab text-muted-foreground" aria-hidden>
          <EllipsisIcon class="size-4 rotate-90 text-muted-foreground" />
        </span>
      ),
      size: 44,
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const rows = () => rowsForOrder(rowOrder())
  const table = createDataGridTable({
    features: rowDndFeatures,
    data: rows(),
    columns,
    getRowId: (row) => row.id,
  })
  const commitRowOrder = (next: string[]) => {
    setRowOrder([...next])
    sortable.update({ items: [...next], axis: 'y', onChange: commitRowOrder })
    table.setDataGridOptions({
      features: rowDndFeatures,
      data: rowsForOrder(next),
      columns,
      getRowId: (row) => row.id,
    })
  }
  const sortable = createSortable({
    items: rowOrder(),
    axis: 'y',
    onChange: commitRowOrder,
  })
  // Match the React adapter: the table consumes the controller preview while
  // dragging, so the drop target and the overlay always use the same row order.
  createEffect(() => {
    const preview = sortable.snapshot().activeId === null
      ? rowOrder()
      : (sortable.previewItems() as string[])
    table.setDataGridOptions({
      features: rowDndFeatures,
      data: rowsForOrder(preview),
      columns,
      getRowId: (row) => row.id,
    })
  })
  const start = (event: PointerEvent, id: string) => {
    sortable.update({
      items: rowOrder(),
      axis: 'y',
      onChange: commitRowOrder,
    })
    sortable.onPointerDown(event, id)
  }
  const activeRow = () =>
    typeof sortable.snapshot().activeId === 'string'
      ? table.getRowModel().rows.find((row) => row.id === sortable.snapshot().activeId)
      : undefined
  return (
    <div class="space-y-space-sm">
      <DataGrid
        table={table}
        ref={sortable.setContainer()}
        getRowProps={(row) => ({
          ref: sortable.setItem(row.id),
          'data-sortable-id': row.id,
          onPointerDown: (event) => start(event, row.id),
          class: cn(
            'cursor-grab touch-none select-none active:cursor-grabbing',
            sortable.snapshot().activeId === row.id && 'opacity-0',
          ),
          style: sortable.getItemStyle(row.id),
        })}
      />
      <p class="text-xs text-muted-foreground">Current row order: {rowOrder().join(' → ')}</p>
      <Show when={activeRow()}>
        {(row) => (
          <Portal>
            <DataGridRowOverlay
              row={row()}
              table={table}
              style={sortable.getOverlayStyle() as JSX.CSSProperties}
            />
          </Portal>
        )}
      </Show>
    </div>
  )
}

export function DndDataGridDemo() {
  return (
    <DataGridDemoSection
      title="Column and row DnD with project Sortable"
      description="Both axes reuse the existing useSortable controller, overlay and motion registry. DataGrid only exposes native part props so callers can attach the project interaction without binding a policy into the table primitive."
    >
      <div class="space-y-space-lg">
        <DemoBranch title="Column reorder">
          <ColumnDndGrid constrained={false} />
        </DemoBranch>
        <DemoBranch title="Column: group boundaries + pinned locked">
          <ColumnDndGrid constrained />
        </DemoBranch>
        <DemoBranch title="Row reorder">
          <RowDndGrid />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
