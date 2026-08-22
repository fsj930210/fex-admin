import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
} from '@fex-design/core/data-table/features/client-pagination'
import { rowPaginationFeature as serverPaginationFeature } from '@fex-design/core/data-table/features/server-pagination'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import {
  dataTableControlsClassName,
  dataTablePaginationClassName,
  dataTablePaginationSummaryClassName,
  dataTableSelectClassName,
  dataTableSrOnlyClassName,
} from '@fex-design/styles/data-table'
import { people, type Person } from './data'
const cm = { rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }
type CF = typeof cm & { columnMeta: DataTableColumnMeta<CF, Person> }
const sm = { rowPaginationFeature: serverPaginationFeature }
type SF = typeof sm & { columnMeta: DataTableColumnMeta<SF, Person> }
export
@Component({
  selector: 'fex-data-table-pagination-demo',
  imports: [Card, DataTable, Button],
  templateUrl: './pagination-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PaginationDemoComponent {
  protected readonly paginationClassName = dataTablePaginationClassName
  protected readonly paginationSummaryClassName = dataTablePaginationSummaryClassName
  protected readonly controlsClassName = dataTableControlsClassName
  protected readonly selectClassName = dataTableSelectClassName
  protected readonly srOnlyClassName = dataTableSrOnlyClassName
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
  protected readonly client = createDataTable({
    features: this.cf,
    data: people,
    columns: this.cc,
    getRowId: (r) => r.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })
  protected readonly server = createDataTable({
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
    this.server.setDataTableOptions({
      features: this.sf,
      data: people.slice(page * pageSize, page * pageSize + pageSize),
      columns: this.sc,
      getRowId: (r) => r.id,
      manualPagination: true,
      rowCount: people.length,
    })
  }
}
