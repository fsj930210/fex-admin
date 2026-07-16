import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  columnResizingFeature,
  columnSizingFeature,
} from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import Card from '@fex/components-angular/ui/card'
import { people5, type Person } from './data'
const modules = { columnSizingFeature, columnResizingFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-grid-sizing-demo',
  imports: [Card, DataGrid],
  templateUrl: './sizing-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SizingDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 },
    { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 },
    { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false },
    { accessorKey: 'progress', header: 'Progress', size: 140 },
  ]
  protected readonly change = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    columnResizeMode: 'onChange',
  })
  protected readonly end = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    columnResizeMode: 'onEnd',
  })
}
