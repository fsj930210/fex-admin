import { NgStyle, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, TemplateRef, computed, input } from '@angular/core'
import {
  getDataTableColumnSize,
  getDataTableRenderedCells,
} from '@fex-design/core/data-table/layout'
import {
  dataTableBodyClassName,
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableHeaderCellClassName,
  dataTableHeaderClassName,
  dataTableHeaderContentClassName,
  dataTableHeaderRowClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableClassName,
} from '@fex-design/styles/data-table'
import type { Cell, Header, RowData, TableFeatures } from '@tanstack/table-core'

import type { AngularDataTable } from '../../signals/create-data-table'

type DataTableHeader = Header<TableFeatures, RowData>
type DataTableCell = Cell<TableFeatures, RowData>

@Component({
  selector: 'fex-data-table-column-overlay',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './data-table-column-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableColumnOverlay {
  readonly table = input.required<unknown>()
  readonly header = input.required<unknown>()
  readonly style = input<Record<string, string | number | undefined> | null>(null)
  readonly density = input<'compact' | 'default' | 'comfortable'>('default')
  readonly headerTemplate = input<TemplateRef<{ $implicit: DataTableHeader }> | null>(null)
  readonly cellTemplate = input<TemplateRef<{ $implicit: DataTableCell }> | null>(null)

  protected readonly rootClassName = computed(() =>
    dataTableRootClassName({ density: this.density() }),
  )
  // Sortable measures the source header (one row high). A column preview also
  // renders its cells, therefore it must deliberately release that measured
  // height instead of clipping its body inside the table root.
  protected readonly overlayStyle = computed(() => ({ ...this.style(), height: 'auto' }))
  protected readonly tableClassName = dataTableClassName
  protected readonly headerClassName = dataTableHeaderClassName
  protected readonly headerRowClassName = dataTableHeaderRowClassName()
  protected readonly headerCellClassName = dataTableHeaderCellClassName
  protected readonly headerContentClassName = dataTableHeaderContentClassName
  protected readonly bodyClassName = dataTableBodyClassName
  protected readonly rowClassName = dataTableRowClassName
  protected readonly cellClassName = dataTableCellClassName
  protected readonly cellContentClassName = dataTableCellContentClassName
  protected readonly renderTable = computed(
    () => this.table() as AngularDataTable<TableFeatures, RowData>,
  )
  protected readonly renderHeader = computed(() => this.header() as DataTableHeader)
  protected readonly columnWidth = computed(
    () => `${getDataTableColumnSize(this.renderHeader().column)}px`,
  )
  protected readonly rows = computed(() => this.renderTable().getRowModel().rows)

  protected cell(
    row: ReturnType<AngularDataTable<TableFeatures, RowData>['getRowModel']>['rows'][number],
  ) {
    return getDataTableRenderedCells(row).find(
      (item) => item.column.id === this.renderHeader().column.id,
    )
  }

  protected text(value: unknown): string {
    return value === undefined || value === null ? '' : String(value)
  }
}
