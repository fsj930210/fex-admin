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
import { people6, type Person } from './data'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<Features, Person>
}
@Component({
  selector: 'fex-data-grid-header-grouping-demo',
  imports: [Card, DataGrid],
  templateUrl: './header-grouping-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderGroupingDemoComponent {
  private readonly features: Features = tableFeatures({ columnSizingFeature, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    {
      header: 'Identity',
      columns: [
        { accessorKey: 'name', header: 'Name', size: 220 },
        { accessorKey: 'department', header: 'Department', size: 170 },
      ],
    },
    {
      header: 'Work metrics',
      columns: [
        { accessorKey: 'status', header: 'Status', size: 140 },
        { accessorKey: 'visits', header: 'Visits', size: 130, meta: { align: 'right' } },
        {
          accessorKey: 'progress',
          header: 'Progress',
          size: 140,
          meta: { align: 'right' },
          cell: ({ getValue }) => `${getValue()}%`,
        },
      ],
    },
  ]
  protected readonly table = createDataGridTable({
    features: this.features,
    data: people6,
    columns: this.columns,
    getRowId: (row) => row.id,
  })
}
