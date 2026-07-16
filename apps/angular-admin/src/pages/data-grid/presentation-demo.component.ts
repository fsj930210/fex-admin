import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import Card from '@fex/components-angular/ui/card'
import { people, type Person } from './data'
type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-grid-presentation-demo',
  imports: [Card, DataGrid],
  templateUrl: './presentation-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PresentationDemoComponent {
  private readonly features: Features = tableFeatures({ columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  protected readonly dataTable = createDataGridTable({
    features: this.features,
    data: people.slice(0, 3),
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected readonly emptyTable = createDataGridTable({
    features: this.features,
    data: [],
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected readonly customClass = {
    header: 'bg-primary/10',
    row: 'hover:bg-primary/5',
    cell: 'font-medium',
  }
}
