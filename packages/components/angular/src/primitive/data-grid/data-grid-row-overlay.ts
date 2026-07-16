import { NgStyle, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, TemplateRef, computed, input } from '@angular/core'
import { getDataGridRenderedCells, getDataGridSizingLayout, getDataGridVisibleLeafColumns, type DataGridRenderingTableSource } from '@fex/components-core/data-grid/layout'
import {
  dataGridBodyClassName,
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridTableClassName,
} from '@fex/components-styles/data-grid'
import type { Cell, Row, RowData, TableFeatures } from '@tanstack/table-core'

import type { AngularDataGridTable } from '../../signals/create-data-grid-table'

type GridRow = Row<TableFeatures, RowData>
type GridCell = Cell<TableFeatures, RowData>

@Component({
  selector: 'fex-data-grid-row-overlay',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './data-grid-row-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridRowOverlay {
  readonly table = input.required<unknown>()
  readonly row = input.required<unknown>()
  readonly style = input<Record<string, string | number | undefined> | null>(null)
  readonly density = input<'compact' | 'default' | 'comfortable'>('default')
  readonly cellTemplate = input<TemplateRef<{ $implicit: GridCell }> | null>(null)

  protected readonly rootClassName = computed(() => dataGridRootClassName({ density: this.density() }))
  protected readonly tableClassName = dataGridTableClassName
  protected readonly bodyClassName = dataGridBodyClassName
  protected readonly rowClassName = dataGridRowClassName
  protected readonly cellClassName = dataGridCellClassName
  protected readonly cellContentClassName = dataGridCellContentClassName
  protected readonly renderTable = computed(() => this.table() as AngularDataGridTable<TableFeatures, RowData>)
  protected readonly renderRow = computed(() => this.row() as GridRow)
  protected readonly tableWidth = computed(() => {
    const width = getDataGridSizingLayout(this.renderTable()).tableWidth
    return width === undefined ? '100%' : `${width}px`
  })
  protected readonly columns = computed(() =>
    getDataGridVisibleLeafColumns(this.renderTable() as unknown as DataGridRenderingTableSource),
  )
  protected readonly cells = computed(() => getDataGridRenderedCells(this.renderRow()))

  protected text(value: unknown): string {
    return value === undefined || value === null ? '' : String(value)
  }
}
