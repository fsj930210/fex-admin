import { NgStyle, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, TemplateRef, computed, input } from '@angular/core'
import { getDataGridColumnSize, getDataGridRenderedCells } from '@fex/components-core/data-grid/layout'
import {
  dataGridBodyClassName,
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridHeaderCellClassName,
  dataGridHeaderClassName,
  dataGridHeaderContentClassName,
  dataGridHeaderRowClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridTableClassName,
} from '@fex/components-styles/data-grid'
import type { Cell, Header, RowData, TableFeatures } from '@tanstack/table-core'

import type { AngularDataGridTable } from '../../signals/create-data-grid-table'

type GridHeader = Header<TableFeatures, RowData>
type GridCell = Cell<TableFeatures, RowData>

@Component({
  selector: 'fex-data-grid-column-overlay',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './data-grid-column-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridColumnOverlay {
  readonly table = input.required<unknown>()
  readonly header = input.required<unknown>()
  readonly style = input<Record<string, string | number | undefined> | null>(null)
  readonly density = input<'compact' | 'default' | 'comfortable'>('default')
  readonly headerTemplate = input<TemplateRef<{ $implicit: GridHeader }> | null>(null)
  readonly cellTemplate = input<TemplateRef<{ $implicit: GridCell }> | null>(null)

  protected readonly rootClassName = computed(() => dataGridRootClassName({ density: this.density() }))
  // Sortable measures the source header (one row high). A column preview also
  // renders its cells, therefore it must deliberately release that measured
  // height instead of clipping its body inside the grid root.
  protected readonly overlayStyle = computed(() => ({ ...this.style(), height: 'auto' }))
  protected readonly tableClassName = dataGridTableClassName
  protected readonly headerClassName = dataGridHeaderClassName
  protected readonly headerRowClassName = dataGridHeaderRowClassName()
  protected readonly headerCellClassName = dataGridHeaderCellClassName
  protected readonly headerContentClassName = dataGridHeaderContentClassName
  protected readonly bodyClassName = dataGridBodyClassName
  protected readonly rowClassName = dataGridRowClassName
  protected readonly cellClassName = dataGridCellClassName
  protected readonly cellContentClassName = dataGridCellContentClassName
  protected readonly renderTable = computed(() => this.table() as AngularDataGridTable<TableFeatures, RowData>)
  protected readonly renderHeader = computed(() => this.header() as GridHeader)
  protected readonly columnWidth = computed(() => `${getDataGridColumnSize(this.renderHeader().column)}px`)
  protected readonly rows = computed(() => this.renderTable().getRowModel().rows)

  protected cell(row: ReturnType<AngularDataGridTable<TableFeatures, RowData>['getRowModel']>['rows'][number]) {
    return getDataGridRenderedCells(row).find(item => item.column.id === this.renderHeader().column.id)
  }

  protected text(value: unknown): string {
    return value === undefined || value === null ? '' : String(value)
  }
}
