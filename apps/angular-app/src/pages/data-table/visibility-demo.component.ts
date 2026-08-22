import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnVisibilityFeature } from '@fex-design/core/data-table/features/column-visibility'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { Checkbox } from '@fex-design/angular/ui/checkbox'
import Card from '@fex-design/angular/ui/card'
import { people5, type Person } from './data'
const modules = { columnVisibilityFeature }
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-table-visibility-demo',
  imports: [Card, DataTable, Checkbox],
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
  protected readonly table = createDataTable({
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
