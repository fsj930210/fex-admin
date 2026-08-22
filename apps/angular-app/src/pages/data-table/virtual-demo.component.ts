import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import Card from '@fex-design/angular/ui/card'
import { virtualPeople, type Person } from './data'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<Features, Person>
}
export
@Component({
  selector: 'fex-data-table-virtual-demo',
  imports: [Card, DataTable],
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
  protected readonly table = createDataTable({
    features: this.features,
    data: virtualPeople,
    columns: this.columns,
    getRowId: (r) => r.id,
  })
  protected readonly virtual = { height: 320, estimateRowHeight: 40, overscan: 10 }
}
