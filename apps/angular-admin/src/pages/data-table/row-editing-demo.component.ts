import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
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
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<Features, Person>
}
type Field = 'name' | 'department' | 'status'
export
@Component({
  selector: 'fex-data-table-row-editing-demo',
  imports: [Card, DataTable, DataTableCellTemplate, InputRoot, InputControl, Button],
  templateUrl: './row-editing-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RowEditingDemoComponent {
  private readonly features: Features = tableFeatures({ columnSizingFeature, columnMeta: {} })
  private rows = people6
  protected readonly draft = signal<Person | null>(null)
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { id: '__actions__', header: 'Actions', size: 180 },
  ]
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
    this.draft.set({ ...cell.row.original })
  }
  protected field(cell: Cell<Features, Person>, event: Event) {
    const draft = this.draft()
    if (draft)
      this.draft.set({
        ...draft,
        [cell.column.id as Field]: (event.target as HTMLInputElement).value,
      })
  }
  protected save() {
    const draft = this.draft()
    if (!draft) return
    this.rows = this.rows.map((row) => (row.id === draft.id ? draft : row))
    this.draft.set(null)
    this.table.setDataTableOptions({
      features: this.features,
      data: this.rows,
      columns: this.columns,
      getRowId: (r) => r.id,
    })
  }
}
