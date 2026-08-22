import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableCellTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { InputControl, InputRoot } from '@fex-design/angular/primitive/input'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { people6, type Person } from './data'
type Features = { columnMeta: DataTableColumnMeta<Features, Person> }
type Field = 'name' | 'status' | 'visits'
export
@Component({
  selector: 'fex-data-table-cell-editing-demo',
  imports: [Card, DataTable, DataTableCellTemplate, InputRoot, InputControl, Button],
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
  protected readonly table = createDataTable({
    features: this.features,
    data: this.rows,
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected value(cell: Cell<Features, Person>) {
    return String(cell.getValue() ?? '')
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
    this.table.setDataTableOptions({
      features: this.features,
      data: this.rows,
      columns: this.columns,
      getRowId: (r) => r.id,
    })
  }
}
