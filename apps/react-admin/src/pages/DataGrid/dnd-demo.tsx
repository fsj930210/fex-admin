/* oxlint-disable react/no-unstable-nested-components -- TanStack column renderers are configuration callbacks; useDataGridTable stabilizes them and reads their latest implementation. */
import { columnOrderingFeature } from '@fex/components-core/data-grid/features/column-ordering'
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { useSortable } from '@fex/components-react/hooks/use-sortable'
import {
  DataGrid,
  DataGridColumnOverlay,
  DataGridRowOverlay,
  tableFeatures,
  useDataGridTable,
  type ColumnDef,
} from '@fex/components-react/primitive/data-grid'
import { cn } from '@fex/utils'
import { EllipsisIcon } from '@fex/components-react/icon/more'
import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const columnDndFeatures = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnMeta: {} as DataGridColumnMeta<TableFeatures, Person>,
})
const rowDndFeatures = tableFeatures({ columnSizingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })
const initialColumnOrder = ['name', 'department', 'status', 'id', 'age', 'visits', 'progress']
const groupById: Partial<Record<string, string>> = {
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

function ColumnDndGrid({ constrained }: { constrained: boolean }) {
  const [columnOrder, setColumnOrder] = useState(initialColumnOrder)
  const [message, setMessage] = useState('Drag a header with the project useSortable hook.')
  const activeColumnRef = useRef<string | null>(null)
  const overColumnRef = useRef<string | null>(null)
  const columnOrderRef = useRef(columnOrder)
  const tableRef = useRef<{ getColumn: (id: string) => { getIsPinned?: () => false | 'start' | 'end' } | undefined } | null>(null)
  columnOrderRef.current = columnOrder
  // useSortable owns a long-lived controller, so keep its change callback stable while reading the latest table/order through refs.
  const handleOrderChange = useCallback((nextOrder: string[]) => {
    const sourceId = activeColumnRef.current
    const currentOrder = columnOrderRef.current
    const targetId = overColumnRef.current
    const pinnedZone = (id: string) => tableRef.current?.getColumn(id)?.getIsPinned?.() || 'center'
    const sourcePinned = sourceId ? pinnedZone(sourceId) !== 'center' : false
    const targetPinned = targetId ? pinnedZone(targetId) !== 'center' : false
    if (constrained && sourceId && targetId && (sourcePinned || targetPinned)) {
      setColumnOrder([...currentOrder])
      setMessage('Rejected: pinned columns cannot be moved or targeted.')
      return
    }
    if (constrained && sourceId && targetId && groupById[sourceId] !== groupById[targetId]) {
      setColumnOrder([...currentOrder])
      setMessage('Rejected: columns must be in the same group, or both ungrouped.')
      return
    }
    setColumnOrder(nextOrder)
    setMessage(sourceId && targetId ? `Moved ${sourceId} near ${targetId}.` : 'Column order updated.')
  }, [constrained])
  const sortable = useSortable({ items: columnOrder, axis: 'x', onChange: handleOrderChange })
  overColumnRef.current = typeof sortable.overId === 'string' ? sortable.overId : null
  const previewOrder = sortable.previewItems as string[]
  const createLeafColumn = (id: string) => ({
    accessorKey: id,
    size: id === 'name' ? 180 : id === 'department' ? 170 : 140,
    header: () => <span className="inline-flex min-w-0 items-center gap-2"><EllipsisIcon className="size-4 rotate-90 text-muted-foreground" /><span className="truncate">{labels[id]}</span></span>,
  } as ColumnDef<typeof columnDndFeatures, Person>)
  const leafColumns = initialColumnOrder.map(createLeafColumn)
  const getAccessorKey = (column: ColumnDef<typeof columnDndFeatures, Person>) =>
    'accessorKey' in column && typeof column.accessorKey === 'string' ? column.accessorKey : ''
  const columns = constrained
    ? [
        {
          id: 'identity',
          header: 'Identity',
          columns: leafColumns.filter((column) =>
            ['name', 'department', 'status'].includes(getAccessorKey(column)),
          ),
        },
        ...leafColumns.filter((column) =>
          ['id', 'age'].includes(getAccessorKey(column)),
        ),
        {
          id: 'metrics',
          header: 'Metrics',
          columns: leafColumns.filter((column) =>
            ['visits', 'progress'].includes(getAccessorKey(column)),
          ),
        },
      ]
    : leafColumns
  const table = useDataGridTable({
    features: columnDndFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    state: { columnOrder: previewOrder },
    ...(constrained ? { initialState: { columnPinning: { start: ['name'], end: ['progress'] } } } : {}),
  })
  tableRef.current = table
  const containerProps = sortable.getContainerProps()
  const { className: containerClassName, ...containerNativeProps } = containerProps
  const activeHeader = typeof sortable.activeId === 'string'
    ? table.getFlatHeaders().find((header) => header.column.id === sortable.activeId)
    : undefined

  return (
    <div className="space-y-space-sm">
      <DataGrid
        {...containerNativeProps}
        {...(containerClassName ? { className: { root: containerClassName } } : {})}
        table={table}
        getHeaderProps={(header) => {
          if (
            header.isPlaceholder ||
            header.column.columns.length > 0 ||
            (constrained && header.column.getIsPinned?.())
          ) return {}
          const itemProps = sortable.getItemProps(header.column.id)
          return {
            ...itemProps,
            className: 'cursor-grab touch-none select-none active:cursor-grabbing',
            onPointerDown: (event) => {
              activeColumnRef.current = header.column.id
              itemProps.onPointerDown?.(event)
            },
          }
        }}
        getCellProps={(cell) => ({
          ref: (element) => sortable.registerMotionTarget(cell.column.id, element),
          style: {
            ...sortable.getMotionStyle(cell.column.id),
            visibility: sortable.activeId === cell.column.id ? 'hidden' : undefined,
          },
        })}
      />
      <p className="text-xs text-muted-foreground">{message}</p>
      {activeHeader && createPortal(
        <DataGridColumnOverlay
          header={activeHeader}
          style={{ ...sortable.getOverlayStyle(), height: 'auto' }}
          table={table}
        />,
        document.body,
      )}
    </div>
  )
}

function RowDndGrid() {
  const [rowOrder, setRowOrder] = useState(people5.map((person) => person.id))
  const sortable = useSortable({ items: rowOrder, axis: 'y', onChange: setRowOrder })
  const previewOrder = sortable.previewItems as string[]
  const rowById = new Map(people5.map((person) => [person.id, person]))
  const rows = previewOrder.map((id) => rowById.get(id)).filter((row): row is Person => Boolean(row))
  const columns: ColumnDef<typeof rowDndFeatures, Person>[] = [
    { id: '__drag__', header: '', cell: () => <EllipsisIcon className="size-4 rotate-90 cursor-grab text-muted-foreground" />, size: 44 },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = useDataGridTable({ features: rowDndFeatures, data: rows, columns, getRowId: (row) => row.id })
  const activeRow = typeof sortable.activeId === 'string'
    ? table.getRowModel().rows.find((row) => row.id === sortable.activeId)
    : undefined
  const containerProps = sortable.getContainerProps()
  const { className: containerClassName, ...containerNativeProps } = containerProps

  return (
    <div className="space-y-space-sm">
      <DataGrid
        {...containerNativeProps}
        {...(containerClassName ? { className: { root: containerClassName } } : {})}
        table={table}
        getRowProps={(row) => {
          const itemProps = sortable.getItemProps(row.id)
          return {
            ...itemProps,
            className: cn('cursor-grab touch-none select-none active:cursor-grabbing', sortable.activeId === row.id && 'opacity-0'),
            style: itemProps.style,
          }
        }}
      />
      <p className="text-xs text-muted-foreground">Current row order: {previewOrder.join(' → ')}</p>
      {activeRow && createPortal(
        <DataGridRowOverlay
          className={{ root: 'shadow-xl ring-1 ring-border/70' }}
          row={activeRow}
          table={table}
          style={sortable.getOverlayStyle()}
        />,
        document.body,
      )}
    </div>
  )
}

export function DndDataGridDemo() {
  return (
    <DataGridDemoSection title="Column and row DnD with project Sortable" description="Both axes reuse the existing useSortable controller, overlay and motion registry. DataGrid only exposes native part props so callers can attach the project interaction without binding a policy into the table primitive.">
      <div className="space-y-space-lg">
        <DemoBranch title="Column reorder"><ColumnDndGrid constrained={false} /></DemoBranch>
        <DemoBranch title="Column: group boundaries + pinned locked"><ColumnDndGrid constrained /></DemoBranch>
        <DemoBranch title="Row reorder"><RowDndGrid /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
