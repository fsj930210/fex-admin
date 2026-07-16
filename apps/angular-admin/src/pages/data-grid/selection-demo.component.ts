import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridCellTemplate,
  DataGridHeaderTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type Header,
} from '@fex/components-angular/primitive/data-grid'
import { Radio, RadioGroup, type RadioValue } from '@fex/components-angular/primitive/radio'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Checkbox } from '@fex/components-angular/ui/checkbox'
import Card from '@fex/components-angular/ui/card'
import { people6, type Person } from './data'

const modules = { rowSelectionFeature, columnSizingFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
type GridTable = ReturnType<typeof createDataGridTable<Features, Person>>
interface Grid {
  title: string
  mode: 'multiple' | 'single'
  table: GridTable
}
interface SelectionTable extends GridTable {
  getIsAllRowsSelected: () => boolean
  getIsSomeRowsSelected: () => boolean
  toggleAllRowsSelected: (value?: boolean) => void
}

@Component({
  selector: 'fex-data-grid-selection-demo',
  imports: [
    Card,
    DataGrid,
    DataGridCellTemplate,
    DataGridHeaderTemplate,
    Checkbox,
    RadioGroup,
    Radio,
  ],
  templateUrl: './selection-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  protected readonly grids = [
    this.grid('Multiple + select all', 'multiple'),
    this.grid('Single', 'single'),
    this.grid('Conditional disabled rows', 'multiple', true),
  ]

  private grid(title: string, mode: Grid['mode'], disabled = false): Grid {
    const columns: ColumnDef<Features, Person>[] = [
      { id: '__select__', header: 'Select', size: 44 },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'status', header: 'Status' },
    ]
    return {
      title,
      mode,
      table: createDataGridTable({
        features: this.features,
        data: people6,
        columns,
        getRowId: (row) => row.id,
        enableMultiRowSelection: mode === 'multiple',
        enableRowSelection: disabled ? (row) => row.original.status !== 'paused' : true,
      }),
    }
  }

  protected headerLabel(header: Header<Features, Person>) {
    return header.column.columnDef.header
  }
  protected value(cell: Cell<Features, Person>) {
    return cell.getValue()
  }
  protected selected(cell: Cell<Features, Person>) {
    return cell.row.getIsSelected()
  }
  protected disabled(cell: Cell<Features, Person>) {
    return !cell.row.getCanSelect()
  }
  protected toggle(cell: Cell<Features, Person>, checked: boolean | 'indeterminate') {
    cell.row.toggleSelected(checked === true)
  }
  protected headerChecked(grid: Grid) {
    const table = grid.table as SelectionTable
    return table.getIsAllRowsSelected()
      ? true
      : table.getIsSomeRowsSelected()
        ? 'indeterminate'
        : false
  }
  protected toggleAll(grid: Grid, checked: boolean | 'indeterminate') {
    ;(grid.table as SelectionTable).toggleAllRowsSelected(checked === true)
  }
  protected selectedId(grid: Grid) {
    return grid.table.getSelectedRowModel().rows[0]?.id ?? ''
  }
  protected selectedText(grid: Grid) {
    const ids = grid.table.getSelectedRowModel().rows.map((row) => row.id)
    return ids.length === 0 ? 'none' : ids.join(', ')
  }
  protected selectSingle(grid: Grid, value: RadioValue) {
    for (const row of grid.table.getRowModel().rows) row.toggleSelected(row.id === value)
  }
}
