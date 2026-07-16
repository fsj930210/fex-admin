import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import Card from '@fex/components-angular/ui/card'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { people5, type Person } from './data'
type Features = { columnMeta: DataGridColumnMeta<Features, Person> }
@Component({
  selector: 'fex-data-grid-basic-demo',
  imports: [Card, DataGrid],
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
  protected readonly defaultTable = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (row) => row.id,
  })
  protected readonly compactTable = createDataGridTable({
    features: this.features,
    data: people5,
    columns: this.columns,
    getRowId: (row) => row.id,
  })
}
