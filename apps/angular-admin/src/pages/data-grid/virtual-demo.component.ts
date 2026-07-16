import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import Card from '@fex/components-angular/ui/card'
import { virtualPeople, type Person } from './data'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<Features, Person>
}
export
@Component({
  selector: 'fex-data-grid-virtual-demo',
  imports: [Card, DataGrid],
  templateUrl: './virtual-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class VirtualDemoComponent {
  private readonly features: Features = tableFeatures({ columnSizingFeature, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 280 },
    { accessorKey: 'department', header: 'Department', size: 180 },
    { accessorKey: 'status', header: 'Status', size: 150 },
    { accessorKey: 'visits', header: 'Visits', size: 140, meta: { align: 'right' } },
    {
      accessorKey: 'progress',
      header: 'Progress',
      size: 140,
      meta: { align: 'right' },
      cell: ({ getValue }) => `${getValue()}%`,
    },
  ]
  protected readonly table = createDataGridTable({
    features: this.features,
    data: virtualPeople,
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected readonly virtual = { height: 320, estimateRowHeight: 40, overscan: 10 }
}
