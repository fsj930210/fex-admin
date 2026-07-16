import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  columnOrderingFeature,
  moveDataGridColumn,
} from '@fex/components-core/data-grid/features/column-ordering'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { people5, type Person } from './data'
const modules = { columnOrderingFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-grid-ordering-demo',
  imports: [Card, DataGrid, Button],
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
  protected readonly table = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    initialState: { columnOrder: this.ids },
  })
  protected move() {
    this.table.setColumnOrder((order) => moveDataGridColumn(order, 'status', 'name'))
  }
}
