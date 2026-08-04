import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import Card from '@fex-design/angular/ui/card'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { people5, type Person } from './data'
type Features = { columnMeta: DataTableColumnMeta<Features, Person> }
@Component({
  selector: 'fex-data-table-basic-demo',
  imports: [Card, DataTable],
  templateUrl: './basic-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDemoComponent {
  private readonly features: Features = tableFeatures({ columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    {
      accessorKey: 'progress',
      header: 'Progress',
      meta: { align: 'right' },
      cell: ({ getValue }) => `${getValue()}%`,
    },
  ]
  protected readonly defaultTable = createDataTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (row) => row.id,
  })
  protected readonly compactTable = createDataTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (row) => row.id,
  })
}
