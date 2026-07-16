import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  createSortedRowModel,
  rowSortingFeature,
  type SortFn,
  type SortingState,
} from '@fex/components-core/data-grid/features/row-sorting'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridHeaderTemplate,
  tableFeatures,
  type ColumnDef,
  type Header,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { ChevronDownIcon, ChevronUpIcon } from '@fex/components-angular/icon/chevron'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { dataGridSortButtonClassName } from '@fex/components-styles/data-grid'
import { people, type Person } from './data'
const modules = { rowSortingFeature, sortedRowModel: createSortedRowModel() }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
interface Grid {
  title: string
  table: ReturnType<typeof createDataGridTable<Features, Person>>
  columns: ColumnDef<Features, Person>[]
}
export
@Component({
  selector: 'fex-data-grid-sorting-demo',
  imports: [Card, DataGrid, DataGridHeaderTemplate, Button, ChevronDownIcon, ChevronUpIcon],
  templateUrl: './sorting-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SortingDemoComponent {
  protected readonly sortButtonClassName = dataGridSortButtonClassName
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly textSort: SortFn<Features, Person> = (a, b, id) =>
    String(a.getValue(id)).localeCompare(String(b.getValue(id)))
  private readonly numberSort: SortFn<Features, Person> = (a, b, id) =>
    Number(a.getValue(id)) - Number(b.getValue(id))
  protected readonly grids: Grid[] = [
    this.grid('All local multi-sort', 'local', [
      { id: 'status', desc: false },
      { id: 'visits', desc: true },
    ]),
    this.grid('All server', 'server'),
    this.grid('Mixed per column', 'mixed'),
    this.grid('Remote multi-sort: Status asc, Visits desc', 'server', [
      { id: 'status', desc: false },
      { id: 'visits', desc: true },
    ]),
  ]
  private grid(
    title: string,
    kind: 'local' | 'server' | 'mixed',
    sorting: SortingState = [],
  ): Grid {
    const columns: ColumnDef<Features, Person>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        meta: kind === 'server' ? {} : { sortFn: this.textSort },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: kind === 'local' ? { sortFn: this.textSort } : {},
      },
      {
        accessorKey: 'visits',
        header: 'Visits',
        meta: kind === 'server' ? {} : { sortFn: this.numberSort, align: 'right' },
      },
    ]
    return {
      title,
      columns,
      table: createDataGridTable({
        features: this.features,
        data: people.slice(0, 7),
        columns,
        getRowId: (r) => r.id,
        enableMultiSort: true,
        isMultiSortEvent: () => true,
        initialState: { sorting },
      }),
    }
  }
  protected sort(header: Header<Features, Person>, event: Event) {
    const column = header.column as Header<Features, Person>['column'] & {
      getToggleSortingHandler: () => ((event: Event) => void) | undefined
    }
    column.getToggleSortingHandler()?.(event)
  }
  protected direction(header: Header<Features, Person>) {
    return (
      header.column as Header<Features, Person>['column'] & {
        getIsSorted: () => false | 'asc' | 'desc'
      }
    ).getIsSorted()
  }
  protected sortIndex(header: Header<Features, Person>) {
    return (
      header.column as Header<Features, Person>['column'] & {
        getSortIndex: () => number
      }
    ).getSortIndex()
  }
  protected remote(grid: Grid) {
    return grid.table.store
      .get()
      .sorting.filter(
        (term) =>
          !grid.columns.find(
            (column) => ('accessorKey' in column ? column.accessorKey : column.id) === term.id,
          )?.meta?.sortFn,
      )
  }
}
