import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridHeaderTemplate,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-angular/icon/chevron'
import { MinusIcon } from '@fex/components-angular/icon/minus'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { people6, type Person } from './data'

const modules = { columnPinningFeature, columnSizingFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }

@Component({
  selector: 'fex-data-grid-column-pinning-demo',
  imports: [Card, DataGrid, DataGridHeaderTemplate, Button, ChevronLeftIcon, ChevronRightIcon, MinusIcon],
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
  protected readonly table = createDataGridTable({
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
