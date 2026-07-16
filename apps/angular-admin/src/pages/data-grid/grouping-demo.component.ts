import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  aggregationFn_sum,
  columnGroupingFeature,
  createGroupedRowModel,
} from '@fex/components-core/data-grid/features/column-grouping'
import {
  createExpandedRowModel,
  rowExpandingFeature,
} from '@fex/components-core/data-grid/features/row-expanding'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridGroupRowTemplate,
  tableFeatures,
  type ColumnDef,
  type Row,
} from '@fex/components-angular/primitive/data-grid'
import {
  createDataGridTable,
  type AngularDataGridTable,
} from '@fex/components-angular/signals/create-data-grid-table'
import { Button } from '@fex/components-angular/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from '@fex/components-angular/icon/chevron'
import Card from '@fex/components-angular/ui/card'
import { people9, type Person } from './data'

const modules = {
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  aggregationFns: { sum: aggregationFn_sum },
}
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
type GroupRow = Row<Features, Person> & { groupingColumnId?: string; groupingValue?: unknown }

@Component({
  selector: 'fex-data-grid-grouping-demo',
  imports: [Card, DataGrid, DataGridGroupRowTemplate, Button, ChevronDownIcon, ChevronRightIcon],
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

  protected groupLabel(table: AngularDataGridTable<Features, Person>, row: Row<Features, Person>) {
    const id = this.group(row).groupingColumnId ?? ''
    const header = id ? table.getColumn(id)?.columnDef.header : undefined
    return typeof header === 'string' ? header : id
  }

  private createGrid(mode: 'reorder' | 'remove') {
    return createDataGridTable({
      features: this.features,
      data: people9,
      columns: this.columns,
      getRowId: (row) => row.id,
      groupedColumnMode: mode,
      initialState: { grouping: ['department', 'status'], expanded: true },
    })
  }
}
