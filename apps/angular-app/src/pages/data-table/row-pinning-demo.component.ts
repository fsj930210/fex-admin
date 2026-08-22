import { ChangeDetectionStrategy, Component } from '@angular/core'
import { rowPinningFeature } from '@fex-design/core/data-table/features/row-pinning'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableCellTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type DataTableClass,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { Badge } from '@fex-design/angular/primitive/badge'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { people7, type Person } from './data'

const modules = { rowPinningFeature }
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
type PinRow = Cell<Features, Person>['row'] & {
  pin(value: false | 'top' | 'bottom'): void
  getIsPinned(): false | 'top' | 'bottom'
}

@Component({
  selector: 'fex-data-table-row-pinning-demo',
  imports: [Card, DataTable, DataTableCellTemplate, Badge, Button],
  templateUrl: './row-pinning-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowPinningDemoComponent {
  protected readonly gridClass: DataTableClass = { viewport: 'max-h-56' }
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { id: 'pin', header: 'Pin row' },
  ]
  protected readonly table = createDataTable({
    features: this.features,
    data: people7,
    columns: this.columns,
    getRowId: (row) => row.id,
    initialState: { rowPinning: { top: ['u-006'], bottom: ['u-002'] } },
  })

  protected pinned(cell: Cell<Features, Person>) {
    return (cell.row as PinRow).getIsPinned()
  }

  protected pin(cell: Cell<Features, Person>, value: false | 'top' | 'bottom') {
    ;(cell.row as PinRow).pin(value)
  }
}
