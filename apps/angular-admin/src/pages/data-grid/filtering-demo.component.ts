import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  columnFilteringFeature,
  createFilteredRowModel,
  type FilterFn,
} from '@fex/components-core/data-grid/features/column-filtering'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Input } from '@fex/components-angular/primitive/input'
import Card from '@fex/components-angular/ui/card'
import { people, type Person } from './data'
const modules = { columnFilteringFeature, filteredRowModel: createFilteredRowModel() }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, Person> }
interface Grid {
  title: string
  table: ReturnType<typeof createDataGridTable<Features, Person>>
  columns: ColumnDef<Features, Person>[]
}
export
@Component({
  selector: 'fex-data-grid-filtering-demo',
  imports: [Card, DataGrid, Input],
  templateUrl: './filtering-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FilteringDemoComponent {
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly includes: FilterFn<Features, Person> = (row, id, value) =>
    String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase())
  protected readonly grids = [
    this.grid('All local', 'local'),
    this.grid('All server', 'server'),
    this.grid('Mixed per column', 'mixed'),
  ]
  private grid(title: string, kind: 'local' | 'server' | 'mixed'): Grid {
    const columns: ColumnDef<Features, Person>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        meta: kind === 'server' ? {} : { filterFn: this.includes },
      },
      {
        accessorKey: 'department',
        header: 'Department',
        meta: kind === 'local' ? { filterFn: this.includes } : {},
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: kind === 'server' ? {} : { filterFn: this.includes },
      },
    ]
    return {
      title,
      columns,
      table: createDataGridTable({
        features: this.features,
        data: people.slice(0, 8),
        columns,
        getRowId: (r) => r.id,
      }),
    }
  }
  protected filter(grid: Grid, id: string, event: Event) {
    grid.table.getColumn(id)?.setFilterValue((event.target as HTMLInputElement).value)
  }
  protected remote(grid: Grid) {
    return grid.table.store
      .get()
      .columnFilters.filter(
        (term) =>
          !grid.columns.find(
            (column) => ('accessorKey' in column ? column.accessorKey : column.id) === term.id,
          )?.meta?.filterFn,
      )
  }
}
