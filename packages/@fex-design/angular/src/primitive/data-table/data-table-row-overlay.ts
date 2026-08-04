import { NgStyle, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, TemplateRef, computed, input } from '@angular/core'
import {
  getDataTableRenderedCells,
  getDataTableSizingLayout,
  getDataTableVisibleLeafColumns,
  type DataTableRenderingTableSource,
} from '@fex-design/core/data-table/layout'
import {
  dataTableBodyClassName,
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableClassName,
} from '@fex-design/styles/data-table'
import type { Cell, Row, RowData, TableFeatures } from '@tanstack/table-core'

import type { AngularDataTable } from '../../signals/create-data-table'

type DataTableRow = Row<TableFeatures, RowData>
type DataTableCell = Cell<TableFeatures, RowData>

@Component({
  selector: 'fex-data-table-row-overlay',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './data-table-row-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableRowOverlay {
  readonly table = input.required<unknown>()
  readonly row = input.required<unknown>()
  readonly style = input<Record<string, string | number | undefined> | null>(null)
  readonly density = input<'compact' | 'default' | 'comfortable'>('default')
  readonly cellTemplate = input<TemplateRef<{ $implicit: DataTableCell }> | null>(null)

  protected readonly rootClassName = computed(() =>
    dataTableRootClassName({ density: this.density() }),
  )
  protected readonly tableClassName = dataTableClassName
  protected readonly bodyClassName = dataTableBodyClassName
  protected readonly rowClassName = dataTableRowClassName
  protected readonly cellClassName = dataTableCellClassName
  protected readonly cellContentClassName = dataTableCellContentClassName
  protected readonly renderTable = computed(
    () => this.table() as AngularDataTable<TableFeatures, RowData>,
  )
  protected readonly renderRow = computed(() => this.row() as DataTableRow)
  protected readonly tableWidth = computed(() => {
    const width = getDataTableSizingLayout(this.renderTable()).tableWidth
    return width === undefined ? '100%' : `${width}px`
  })
  protected readonly columns = computed(() =>
    getDataTableVisibleLeafColumns(this.renderTable() as unknown as DataTableRenderingTableSource),
  )
  protected readonly cells = computed(() => getDataTableRenderedCells(this.renderRow()))

  protected text(value: unknown): string {
    return value === undefined || value === null ? '' : String(value)
  }
}
