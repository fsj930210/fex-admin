import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnVisibilityFeature } from '@fex/components-core/data-grid/features/column-visibility'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Checkbox } from '@fex/components-angular/ui/checkbox'
import Card from '@fex/components-angular/ui/card'
import { people5, type Person } from './data'
const modules = { columnVisibilityFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-grid-visibility-demo',
  imports: [Card, DataGrid, Checkbox],
  templateUrl: './visibility-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class VisibilityDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name', enableHiding: false },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  protected readonly table = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (r) => r.id,
    initialState: { columnVisibility: { visits: false } },
  })
  protected toggle(id: string, checked: boolean | 'indeterminate') {
    this.table.getColumn(id)?.toggleVisibility(checked === true)
  }
}
