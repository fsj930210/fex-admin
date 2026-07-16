import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
} from '@fex/components-core/data-grid/features/client-pagination'
import { rowPaginationFeature as serverPaginationFeature } from '@fex/components-core/data-grid/features/server-pagination'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import {
  dataGridControlsClassName,
  dataGridPaginationClassName,
  dataGridPaginationSummaryClassName,
  dataGridSelectClassName,
  dataGridSrOnlyClassName,
} from '@fex/components-styles/data-grid'
import { people, type Person } from './data'
const cm = { rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }
type CF = typeof cm & { columnMeta: DataGridColumnMeta<CF, Person> }
const sm = { rowPaginationFeature: serverPaginationFeature }
type SF = typeof sm & { columnMeta: DataGridColumnMeta<SF, Person> }
export
@Component({
  selector: 'fex-data-grid-pagination-demo',
  imports: [Card, DataGrid, Button],
  templateUrl: './pagination-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PaginationDemoComponent {
  protected readonly paginationClassName = dataGridPaginationClassName
  protected readonly paginationSummaryClassName = dataGridPaginationSummaryClassName
  protected readonly controlsClassName = dataGridControlsClassName
  protected readonly selectClassName = dataGridSelectClassName
  protected readonly srOnlyClassName = dataGridSrOnlyClassName
  protected readonly pageSizes = [3, 5, 10]
  private readonly cf: CF = tableFeatures({ ...cm, columnMeta: {} })
  private readonly sf: SF = tableFeatures({ ...sm, columnMeta: {} })
  private readonly cc: ColumnDef<CF, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
  ]
  private readonly sc: ColumnDef<SF, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
  ]
  protected readonly client = createDataGridTable({
    features: this.cf,
    data: people,
    columns: this.cc,
    getRowId: (r) => r.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })
  protected readonly server = createDataGridTable({
    features: this.sf,
    data: people.slice(0, 5),
    columns: this.sc,
    getRowId: (r) => r.id,
    manualPagination: true,
    rowCount: people.length,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })
  protected clientPageSize(event: Event) {
    this.client.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
  protected serverPageSize(event: Event) {
    this.updateServerPage(0, Number((event.target as HTMLSelectElement).value))
  }
  protected serverPrevious() {
    this.updateServerPage(this.server.store.get().pagination.pageIndex - 1)
  }
  protected serverNext() {
    this.updateServerPage(this.server.store.get().pagination.pageIndex + 1)
  }
  private updateServerPage(page: number, pageSize = this.server.store.get().pagination.pageSize) {
    this.server.setPageSize(pageSize)
    this.server.setPageIndex(page)
    this.server.setDataGridOptions({
      features: this.sf,
      data: people.slice(page * pageSize, page * pageSize + pageSize),
      columns: this.sc,
      getRowId: (r) => r.id,
      manualPagination: true,
      rowCount: people.length,
    })
  }
}
