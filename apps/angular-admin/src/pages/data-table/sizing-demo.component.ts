import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  columnResizingFeature,
  columnSizingFeature,
} from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import Card from '@fex-design/angular/ui/card'
import { people5, type Person } from './data'
const modules = { columnSizingFeature, columnResizingFeature }
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-table-sizing-demo',
  imports: [Card, DataTable],
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
  protected readonly change = createDataTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    columnResizeMode: 'onChange',
  })
  protected readonly end = createDataTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    columnResizeMode: 'onEnd',
  })
}
