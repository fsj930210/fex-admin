import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridCellTemplate,
  DataGridSubComponentTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type Row,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { MinusIcon } from '@fex/components-angular/icon/minus'
import { PlusIcon } from '@fex/components-angular/icon/plus'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { people4, peopleTree, type Person } from './data'
const modules = {
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  columnSizingFeature,
}
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-grid-expansion-demo',
  imports: [Card, DataGrid, DataGridCellTemplate, DataGridSubComponentTemplate, Button, MinusIcon, PlusIcon],
  templateUrl: './expansion-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ExpansionDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly treeColumns: ColumnDef<Features, Person>[] = [
    { id: '__expand__', header: '', size: 44 },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
  ]
  private readonly detailColumns: ColumnDef<Features, Person>[] = [
    { id: '__expand__', header: '', size: 44 },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  protected readonly tree = createDataGridTable({
    features: this.features,
    data: peopleTree,
    columns: this.treeColumns,
    getRowId: (r) => r.id,
    getSubRows: (r) => r.children,
  })
  protected readonly detail = createDataGridTable({
    features: this.features,
    data: people4,
    columns: this.detailColumns,
    getRowId: (r) => r.id,
    getRowCanExpand: () => true,
  })
  protected value(cell: Cell<Features, Person>) {
    return cell.getValue()
  }
  protected toggle(cell: Cell<Features, Person>) {
    cell.row.toggleExpanded()
  }
  protected can(cell: Cell<Features, Person>) {
    return cell.row.getCanExpand()
  }
  protected expanded(cell: Cell<Features, Person>) {
    return cell.row.getIsExpanded()
  }
  protected person(row: Row<Features, Person>) {
    return row.original
  }
}
