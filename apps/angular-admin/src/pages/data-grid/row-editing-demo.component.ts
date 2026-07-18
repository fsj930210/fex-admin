import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridCellTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { InputControl, InputRoot } from '@fex/components-angular/primitive/input'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { people6, type Person } from './data'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<Features, Person>
}
type Field = 'name' | 'department' | 'status'
export
@Component({
  selector: 'fex-data-grid-row-editing-demo',
  imports: [Card, DataGrid, DataGridCellTemplate, InputRoot, InputControl, Button],
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
  protected readonly table = createDataGridTable({
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
    this.table.setDataGridOptions({
      features: this.features,
      data: this.rows,
      columns: this.columns,
      getRowId: (r) => r.id,
    })
  }
}
