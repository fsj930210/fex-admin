import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridCellTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Input } from '@fex/components-angular/primitive/input'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { people6, type Person } from './data'
type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
type Field = 'name' | 'status' | 'visits'
export
@Component({
  selector: 'fex-data-grid-cell-editing-demo',
  imports: [Card, DataGrid, DataGridCellTemplate, Input, Button],
  templateUrl: './cell-editing-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CellEditingDemoComponent {
  private readonly features: Features = tableFeatures({ columnMeta: {} })
  private rows = people6
  protected readonly editing = signal<{ rowId: string; field: Field } | null>(null)
  private readonly columns: ColumnDef<Features, Person>[] = (
    ['name', 'status', 'visits'] as const
  ).map((field) => ({
    accessorKey: field,
    header: field[0]!.toUpperCase() + field.slice(1),
    ...(field === 'visits' ? { meta: { align: 'right' as const } } : {}),
  }))
  protected readonly table = createDataGridTable({
    features: this.features,
    data: this.rows,
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected value(cell: Cell<Features, Person>) {
    return cell.getValue()
  }
  protected edit(cell: Cell<Features, Person>) {
    this.editing.set({ rowId: cell.row.id, field: cell.column.id as Field })
  }
  protected commit(cell: Cell<Features, Person>, event: Event) {
    const field = cell.column.id as Field,
      value = (event.target as HTMLInputElement).value
    this.rows = this.rows.map((row) =>
      row.id === cell.row.id
        ? ({ ...row, [field]: field === 'visits' ? Number(value) || 0 : value } as Person)
        : row,
    )
    this.editing.set(null)
    this.table.setDataGridOptions({
      features: this.features,
      data: this.rows,
      columns: this.columns,
      getRowId: (r) => r.id,
    })
  }
}
