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
import { people6, type Person } from './data'
type Features = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<Features, Person>
}
@Component({
  selector: 'fex-data-table-header-grouping-demo',
  imports: [Card, DataTable],
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
  protected readonly table = createDataTable({
    features: this.features,
    data: people6,
    columns: this.columns,
    getRowId: (row) => row.id,
  })
}
