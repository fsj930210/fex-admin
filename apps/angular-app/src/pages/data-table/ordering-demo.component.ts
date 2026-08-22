import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  columnOrderingFeature,
  moveDataTableColumn,
} from '@fex-design/core/data-table/features/column-ordering'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { people5, type Person } from './data'
const modules = { columnOrderingFeature }
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-table-ordering-demo',
  imports: [Card, DataTable, Button],
  templateUrl: './ordering-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OrderingDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly ids = ['name', 'department', 'status', 'visits']
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  protected readonly table = createDataTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    initialState: { columnOrder: this.ids },
  })
  protected move() {
    this.table.setColumnOrder((order) => moveDataTableColumn(order, 'status', 'name'))
  }
}
