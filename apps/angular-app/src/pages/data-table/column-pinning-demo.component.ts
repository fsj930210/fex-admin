import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnPinningFeature } from '@fex-design/core/data-table/features/column-pinning'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableHeaderTemplate,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { MinusIcon } from '@fex-design/angular/icon/minus'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { people6, type Person } from './data'

const modules = { columnPinningFeature, columnSizingFeature }
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }

@Component({
  selector: 'fex-data-table-column-pinning-demo',
  imports: [
    Card,
    DataTable,
    DataTableHeaderTemplate,
    Button,
    ChevronLeftIcon,
    ChevronRightIcon,
    MinusIcon,
  ],
  templateUrl: './column-pinning-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnPinningDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  protected readonly fields = ['name', 'department', 'status', 'age', 'visits', 'progress']
  private readonly columns: ColumnDef<Features, Person>[] = this.fields.map(
    (field) =>
      ({ accessorKey: field, size: field === 'name' ? 180 : 130, header: field }) as ColumnDef<
        Features,
        Person
      >,
  )
  protected readonly table = createDataTable({
    features: this.features,
    data: people6,
    columns: this.columns,
    getRowId: (row) => row.id,
    initialState: { columnPinning: { start: ['name'], end: ['progress'] } },
  })
  protected pin(id: string, value: false | 'start' | 'end') {
    this.table.getColumn(id)?.pin(value)
  }
}
