import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnOrderingFeature } from '@fex/components-core/data-grid/features/column-ordering'
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import type { SortableControllerSnapshot } from '@fex/components-core/sortable/types'
import {
  DataGrid,
  DataGridCellTemplate,
  DataGridColumnOverlay,
  DataGridHeaderTemplate,
  DataGridRowOverlay,
  type DataGridPartAction,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type Header,
  type Row,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { EllipsisIcon } from '@fex/components-angular/icon/more'
import { bindSortableItem, FexSortable } from '@fex/components-angular/primitive/sortable'
import Card from '@fex/components-angular/ui/card'
import { people5, type Person } from './data'

const modules = { columnOrderingFeature, columnPinningFeature, columnSizingFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
type GridTable = ReturnType<typeof createDataGridTable<Features, Person>>
interface Grid {
  title: string
  constrained: boolean
  order: string[]
  table: GridTable
  message: string
}
const initial = ['name', 'department', 'status', 'id', 'age', 'visits', 'progress']
const labels: Record<string, string> = {
  name: 'Name',
  department: 'Department',
  status: 'Status',
  id: 'ID',
  age: 'Age',
  visits: 'Visits',
  progress: 'Progress',
}
const groups: Partial<Record<string, 'identity' | 'metrics'>> = {
  name: 'identity',
  department: 'identity',
  status: 'identity',
  visits: 'metrics',
  progress: 'metrics',
}

@Component({
  selector: 'fex-data-grid-dnd-demo',
  imports: [Card, DataGrid, DataGridCellTemplate, DataGridColumnOverlay, DataGridHeaderTemplate, DataGridRowOverlay, FexSortable, EllipsisIcon],
  templateUrl: './dnd-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  protected readonly grids = [
    this.grid('Column reorder', false),
    this.grid('Column: group boundaries + pinned locked', true),
  ]
  private readonly rowColumns: ColumnDef<Features, Person>[] = [
    { id: '__drag__', header: '', size: 44 },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
  ]
  protected rowOrder = people5.map((person) => person.id)
  protected readonly rowTable = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.rowColumns,
    getRowId: (row) => row.id,
  })
  private readonly headerActions = new WeakMap<
    FexSortable<string[]>,
    DataGridPartAction<Header<Features, Person>>
  >()
  private readonly cellActions = new WeakMap<
    FexSortable<string[]>,
    DataGridPartAction<Cell<Features, Person>>
  >()
  private readonly rowActions = new WeakMap<
    FexSortable<string[]>,
    DataGridPartAction<Row<Features, Person>>
  >()

  private grid(title: string, constrained: boolean): Grid {
    const leaves: ColumnDef<Features, Person>[] = initial.map(
      (id) =>
        ({
          accessorKey: id,
          header: labels[id],
          size: id === 'name' ? 180 : id === 'department' ? 170 : 140,
        }) as ColumnDef<Features, Person>,
    )
    const columns: ColumnDef<Features, Person>[] = constrained
      ? [
          {
            id: 'identity',
            header: 'Identity',
            columns: leaves.filter(
              (column) =>
                'accessorKey' in column &&
                ['name', 'department', 'status'].includes(String(column.accessorKey)),
            ),
          },
          ...leaves.filter(
            (column) =>
              'accessorKey' in column && ['id', 'age'].includes(String(column.accessorKey)),
          ),
          {
            id: 'metrics',
            header: 'Metrics',
            columns: leaves.filter(
              (column) =>
                'accessorKey' in column &&
                ['visits', 'progress'].includes(String(column.accessorKey)),
            ),
          },
        ]
      : leaves
    return {
      title,
      constrained,
      order: [...initial],
      message: 'Drag a header with the project Sortable primitive.',
      table: createDataGridTable({
        features: this.features,
        data: people5,
        columns,
        getRowId: (row) => row.id,
        initialState: {
          columnOrder: initial,
          ...(constrained ? { columnPinning: { start: ['name'], end: ['progress'] } } : {}),
        },
      }),
    }
  }

  protected columnsChanged(grid: Grid, next: string[]) {
    const source = grid.order.find((id) => next.indexOf(id) !== grid.order.indexOf(id))
    const target = source ? grid.order[next.indexOf(source)] : undefined
    if (
      grid.constrained &&
      source &&
      target &&
      (['name', 'progress'].includes(source) ||
        ['name', 'progress'].includes(target) ||
        groups[source] !== groups[target])
    ) {
      grid.message =
        'Rejected: columns must share a real group, or both be ungrouped; pinned columns are locked.'
      return
    }
    grid.order = [...next]
    grid.table.setColumnOrder(next)
    grid.message = source && target ? `Moved ${source} near ${target}.` : 'Column order updated.'
  }

  protected columnsPreviewChanged(grid: Grid, snapshot: SortableControllerSnapshot) {
    if (!snapshot.dragging) {
      return
    }
    grid.table.setColumnOrder(restoreSortableItems(grid.order, snapshot.items))
  }

  protected rowsChanged(next: string[]) {
    this.rowOrder = [...next]
    const data = this.rowOrder
      .map((id) => people5.find((person) => person.id === id))
      .filter((row): row is Person => row !== undefined)
    this.rowTable.setDataGridOptions({
      features: this.features,
      data,
      columns: this.rowColumns,
      getRowId: (row) => row.id,
    })
  }

  protected rowsPreviewChanged(snapshot: SortableControllerSnapshot) {
    if (!snapshot.dragging) {
      return
    }
    const previewOrder = restoreSortableItems(this.rowOrder, snapshot.items)
    const data = previewOrder
      .map((id) => people5.find((person) => person.id === id))
      .filter((row): row is Person => row !== undefined)
    this.rowTable.setDataGridOptions({
      features: this.features,
      data,
      columns: this.rowColumns,
      getRowId: (row) => row.id,
    })
  }

  protected headerAction(sortable: FexSortable<string[]>, grid: Grid) {
    let action = this.headerActions.get(sortable)
    if (!action) {
      action = (node, header) => {
        if (
          header.isPlaceholder ||
          header.column.columns.length > 0 ||
          (grid.constrained && ['name', 'progress'].includes(header.column.id))
        )
          return
        node.classList.add('cursor-grab', 'touch-none', 'select-none')
        const cleanup = bindSortableItem(sortable, node, header.column.id)
        return () => {
          cleanup()
          node.classList.remove('cursor-grab', 'touch-none', 'select-none')
        }
      }
      this.headerActions.set(sortable, action)
    }
    return action
  }

  protected cellAction(sortable: FexSortable<string[]>) {
    let action = this.cellActions.get(sortable)
    if (!action) {
      action = (node, cell) => {
        const cleanupTarget = sortable.registerMotionTarget(cell.column.id, node)
        const apply = () => {
          const style = sortable.getMotionStyle(cell.column.id)
          node.style.transform = style.transform === undefined ? '' : String(style.transform)
          node.style.transition = style.transition === undefined ? '' : String(style.transition)
          node.style.visibility = sortable.activeId() === cell.column.id ? 'hidden' : ''
        }
        const unsubscribe = sortable.controller.subscribe(apply)
        apply()
        return () => {
          cleanupTarget?.()
          unsubscribe()
        }
      }
      this.cellActions.set(sortable, action)
    }
    return action
  }

  protected rowAction(sortable: FexSortable<string[]>) {
    let action = this.rowActions.get(sortable)
    if (!action) {
      action = (node, row) => {
        node.classList.add('cursor-grab', 'touch-none', 'select-none')
        const cleanup = bindSortableItem(sortable, node, row.id)
        return () => {
          cleanup()
          node.classList.remove('cursor-grab', 'touch-none', 'select-none')
        }
      }
      this.rowActions.set(sortable, action)
    }
    return action
  }

  protected label(id: string) {
    return labels[id] ?? id
  }
  protected activeRow(id: string | number | null) {
    return typeof id === 'string'
      ? this.rowTable.getRowModel().rows.find((row) => row.id === id)
      : undefined
  }
  protected activeHeader(grid: Grid, id: string | number) {
    const columnId = String(id)
    return grid.table.getFlatHeaders().find((header) => header.column.id === columnId)
  }
}
