import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import Card from '@fex-design/angular/ui/card'
import { people, type Person } from './data'
type Features = { columnMeta: DataTableColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-table-presentation-demo',
  imports: [Card, DataTable],
  templateUrl: './presentation-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PresentationDemoComponent {
  private readonly features: Features = tableFeatures({ columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  protected readonly dataTable = createDataTable({
    features: this.features,
    data: people.slice(0, 3),
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected readonly emptyTable = createDataTable({
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
