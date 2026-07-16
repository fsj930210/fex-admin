import { ChangeDetectionStrategy, Component } from '@angular/core'
import { rowPinningFeature } from '@fex/components-core/data-grid/features/row-pinning'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridCellTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type DataGridClass,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Badge } from '@fex/components-angular/ui/badge'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { people7, type Person } from './data'

const modules = { rowPinningFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
type PinRow = Cell<Features, Person>['row'] & {
  pin(value: false | 'top' | 'bottom'): void
  getIsPinned(): false | 'top' | 'bottom'
}

@Component({
  selector: 'fex-data-grid-row-pinning-demo',
  imports: [Card, DataGrid, DataGridCellTemplate, Badge, Button],
  templateUrl: './row-pinning-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowPinningDemoComponent {
  protected readonly gridClass: DataGridClass = { viewport: 'max-h-56' }
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { id: 'pin', header: 'Pin row' },
  ]
  protected readonly table = createDataGridTable({
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
