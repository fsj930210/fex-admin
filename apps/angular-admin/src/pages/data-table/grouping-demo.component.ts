import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
} from '@fex-design/core/data-table/features/column-grouping'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex-design/core/data-table/features/row-expanding'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  DataTableGroupRowTemplate,
  tableFeatures,
  type ColumnDef,
  type Row,
} from '@fex-design/angular/primitive/data-table'
import {
  createDataTable,
  type AngularDataTable,
} from '@fex-design/angular/signals/create-data-table'
import { Button } from '@fex-design/angular/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import Card from '@fex-design/angular/ui/card'
import { people9, type Person } from './data'

const modules = {
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
}
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, Person> }
type GroupRow = Row<Features, Person> & { groupingColumnId?: string; groupingValue?: unknown }

@Component({
  selector: 'fex-data-table-grouping-demo',
  imports: [Card, DataTable, DataTableGroupRowTemplate, Button, ChevronDownIcon, ChevronRightIcon],
  templateUrl: './grouping-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupingDemoComponent {
  protected readonly groupingColumns = ['department', 'status'] as const
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly columns: ColumnDef<Features, Person>[] = [
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'name', header: 'Name', enableGrouping: false },
    { accessorKey: 'visits', header: 'Visits', aggregationFn: 'sum', enableGrouping: false },
  ]
  protected readonly grids = [
    {
      title: 'Keep Department and Status columns',
      table: this.createGrid('reorder'),
    },
    {
      title: 'Hide grouped columns; retain summaries',
      table: this.createGrid('remove'),
    },
  ]

  protected group(row: Row<Features, Person>) {
    return row as GroupRow
  }

  protected groupLabel(table: AngularDataTable<Features, Person>, row: Row<Features, Person>) {
    const id = this.group(row).groupingColumnId ?? ''
    const header = id ? table.getColumn(id)?.columnDef.header : undefined
    return typeof header === 'string' ? header : id
  }

  private createGrid(mode: 'reorder' | 'remove') {
    return createDataTable({
      features: this.features,
      data: people9,
      columns: this.columns,
      getRowId: (row) => row.id,
      groupedColumnMode: mode,
      initialState: { grouping: ['department', 'status'], expanded: true },
    })
  }
}
