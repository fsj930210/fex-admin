import { ChangeDetectionStrategy, Component } from '@angular/core'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex-design/core/data-table/features/row-expanding'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableCellTemplate,
  DataTableSubComponentTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type Row,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { MinusIcon } from '@fex-design/angular/icon/minus'
import { PlusIcon } from '@fex-design/angular/icon/plus'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { people4, peopleTree, type Person } from './data'
const modules = {
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  columnSizingFeature,
}
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
export
@Component({
  selector: 'fex-data-table-expansion-demo',
  imports: [
    Card,
    DataTable,
    DataTableCellTemplate,
    DataTableSubComponentTemplate,
    Button,
    MinusIcon,
    PlusIcon,
  ],
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
  protected readonly tree = createDataTable({
    features: this.features,
    data: peopleTree,
    columns: this.treeColumns,
    getRowId: (r) => r.id,
    getSubRows: (r) => r.children,
  })
  protected readonly detail = createDataTable({
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
