import { NgStyle, NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  viewChild,
  ElementRef,
  effect,
} from '@angular/core'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  getDataGridColumnLayout,
  getDataGridHeaderLayout,
  getDataGridRenderedCells,
  getDataGridRenderedRows,
  getDataGridRowLayout,
  getDataGridSizingLayout,
  getDataGridVirtualRows,
  getDataGridVisibleLeafColumnCount,
  getDataGridVisibleLeafColumns,
  type DataGridColumnLayoutSource,
  type DataGridPinningTableSource,
  type DataGridRenderingTableSource,
  type DataGridRowRenderingSource,
} from '@fex/components-core/data-grid/layout'
import {
  dataGridAlignClassName,
  dataGridBodyClassName,
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridEmptyClassName,
  dataGridGroupedRowClassName,
  dataGridHeaderCellClassName,
  dataGridHeaderClassName,
  dataGridHeaderContentClassName,
  dataGridHeaderRowClassName,
  dataGridHeaderSeparatorClassName,
  dataGridLoadingClassName,
  dataGridPinnedBottomEdgeClassName,
  dataGridPinnedBottomRowClassName,
  dataGridPinnedCellClassName,
  dataGridPinnedEndClassName,
  dataGridPinnedEndEdgeClassName,
  dataGridPinnedHeaderCellClassName,
  dataGridPinnedRowClassName,
  dataGridPinnedStartClassName,
  dataGridPinnedStartEdgeClassName,
  dataGridPinnedTopEdgeClassName,
  dataGridPinnedTopRowClassName,
  dataGridResizeHandleClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridTableClassName,
  dataGridViewportClassName,
  dataGridVirtualSpacerClassName,
} from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Cell, Header, Row, RowData, TableFeatures } from '@tanstack/table-core'
import { injectVirtualizer } from '@tanstack/angular-virtual'

import { createHostClassName } from '../../signals/host-class'
import type { AngularDataGridTable } from '../../signals/create-data-grid-table'

export { DataGridColumnOverlay } from './data-grid-column-overlay'
export { DataGridRowOverlay } from './data-grid-row-overlay'

type GridFeatures = TableFeatures
type GridData = RowData
type GridCell = Cell<GridFeatures, GridData>
type GridHeader = Header<GridFeatures, GridData>
type GridRow = Row<GridFeatures, GridData>
type DataGridPartCleanup = void | (() => void) | { destroy?: () => void }
export type DataGridPartAction<TItem> = {
  bivarianceHack(element: HTMLElement, item: TItem): DataGridPartCleanup
}['bivarianceHack']

@Directive({ selector: '[fexDataGridPartAction]', standalone: true })
export class DataGridPartActionDirective {
  readonly action = input<DataGridPartAction<never> | undefined>(undefined, { alias: 'fexDataGridPartAction' })
  readonly item = input<unknown>(undefined, { alias: 'fexDataGridPartItem' })
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef)

  constructor() {
    effect((onCleanup) => {
      const action = this.action()
      const item = this.item()
      if (!action || item === undefined) return
      const cleanup = action(this.element.nativeElement, item as never)
      onCleanup(() => typeof cleanup === 'function' ? cleanup() : cleanup?.destroy?.())
    })
  }
}

@Directive({ selector: 'ng-template[fexDataGridHeader]', standalone: true })
export class DataGridHeaderTemplate {
  readonly template = inject<TemplateRef<{ $implicit: GridHeader }>>(TemplateRef)
}

@Directive({ selector: 'ng-template[fexDataGridCell]', standalone: true })
export class DataGridCellTemplate {
  readonly template = inject<TemplateRef<{ $implicit: GridCell }>>(TemplateRef)
}

@Directive({ selector: 'ng-template[fexDataGridGroupRow]', standalone: true })
export class DataGridGroupRowTemplate {
  readonly template = inject<TemplateRef<{ $implicit: GridRow }>>(TemplateRef)
}

@Directive({ selector: 'ng-template[fexDataGridSubComponent]', standalone: true })
export class DataGridSubComponentTemplate {
  readonly template = inject<TemplateRef<{ $implicit: GridRow }>>(TemplateRef)
}

export interface DataGridClass {
  root?: string
  viewport?: string
  table?: string
  header?: string
  headerRow?: string
  headerCell?: string
  body?: string
  row?: string
  cell?: string
  empty?: string
  loading?: string
}

interface VirtualOptions {
  height: number
  estimateRowHeight?: number
  overscan?: number
}

@Component({
  selector: 'fex-data-grid',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet, DataGridPartActionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'data-grid',
    '[attr.data-loading]': 'loading() || null',
    '[style.--data-grid-header-height]': '"var(--data-grid-row-height)"',
    '[style.width]': 'sizingLayout().rootWidth',
  },
  templateUrl: './data-grid.html',
})
export class DataGrid {
  readonly table = input.required<unknown>()
  readonly density = input<'compact' | 'default' | 'comfortable'>('default')
  readonly striped = input(false)
  readonly border = input(false)
  readonly loading = input(false)
  readonly loadingContent = input('Loading…')
  readonly emptyContent = input('No data')
  readonly virtual = input<VirtualOptions | undefined>()
  readonly partClass = input<DataGridClass>({})
  readonly headerAction = input<DataGridPartAction<never> | undefined>()
  readonly cellAction = input<DataGridPartAction<never> | undefined>()
  readonly rowAction = input<DataGridPartAction<never> | undefined>()

  protected readonly headerTemplate = contentChild(DataGridHeaderTemplate)
  protected readonly cellTemplate = contentChild(DataGridCellTemplate)
  protected readonly groupRowTemplate = contentChild(DataGridGroupRowTemplate)
  protected readonly subComponentTemplate = contentChild(DataGridSubComponentTemplate)
  protected readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport')
  protected readonly hostClassName = createHostClassName(() =>
    cn(
      dataGridRootClassName({
        density: this.density(),
        striped: this.striped(),
        bordered: this.border(),
      }),
      this.partClass().root,
    ),
  )

  private readonly resolvedTable = computed(() => this.table() as AngularDataGridTable)
  private readonly renderTable = computed(
    () => this.resolvedTable() as unknown as DataGridRenderingTableSource,
  )
  private readonly pinningTable = computed(
    () => this.resolvedTable() as unknown as DataGridPinningTableSource,
  )
  protected readonly snapshot = computed(() => this.resolvedTable().dataGridSnapshot())
  protected readonly renderedRows = computed(() => {
    this.snapshot()
    return getDataGridRenderedRows(this.renderTable()) as GridRow[]
  })
  protected readonly virtualRows = computed(() => {
    this.snapshot()
    return getDataGridVirtualRows(this.renderTable()) as GridRow[]
  })
  protected readonly virtualizer = injectVirtualizer<HTMLDivElement, HTMLTableRowElement>(() => ({
    count: this.virtual() ? this.virtualRows().length : 0,
    scrollElement: this.viewport(),
    estimateSize: () => this.virtual()?.estimateRowHeight ?? 40,
    overscan: this.virtual()?.overscan ?? 8,
  }))
  protected readonly rows = computed(() =>
    this.virtual()
      ? this.virtualizer
          .getVirtualItems()
          .map(item => this.virtualRows()[item.index])
          .filter((row): row is GridRow => row !== undefined)
      : this.renderedRows(),
  )
  protected readonly virtualTop = computed(() => this.virtualizer.getVirtualItems()[0]?.start ?? 0)
  protected readonly virtualBottom = computed(() => {
    const last = this.virtualizer.getVirtualItems().at(-1)
    return last ? Math.max(0, this.virtualizer.getTotalSize() - last.end) : 0
  })
  protected readonly columns = computed(() => {
    this.snapshot()
    return getDataGridVisibleLeafColumns(this.renderTable())
  })
  protected readonly headerGroups = computed(() => {
    this.snapshot()
    return this.resolvedTable().getHeaderGroups()
  })
  protected readonly sizingLayout = computed(() => {
    this.snapshot()
    return getDataGridSizingLayout(this.resolvedTable())
  })
  protected readonly tableWidth = computed(() => this.sizingLayout().tableWidth)

  protected readonly viewportClassName = computed(() =>
    cn(dataGridViewportClassName, this.partClass().viewport),
  )
  protected readonly tableClassName = computed(() =>
    cn(dataGridTableClassName, this.partClass().table),
  )
  protected readonly headerClassName = computed(() =>
    cn(dataGridHeaderClassName, this.partClass().header),
  )
  protected readonly bodyClassName = computed(() =>
    cn(dataGridBodyClassName, this.partClass().body),
  )
  protected readonly loadingClassName = computed(() =>
    cn(dataGridLoadingClassName, this.partClass().loading),
  )
  protected readonly emptyClassName = computed(() =>
    cn(dataGridEmptyClassName, this.partClass().empty),
  )

  protected headerRowClass() {
    return cn(dataGridHeaderRowClassName({ bordered: this.border() }), this.partClass().headerRow)
  }
  protected headerClass(header: GridHeader, index: number, headers: GridHeader[]) {
    const layout = getDataGridHeaderLayout(header, this.pinningTable())
    const meta = this.meta(header.column)
    return cn(
      dataGridHeaderCellClassName,
      layout.pinned && dataGridPinnedCellClassName,
      layout.pinned && dataGridPinnedHeaderCellClassName,
      layout.pinned === 'start' && dataGridPinnedStartClassName,
      layout.pinned === 'end' && dataGridPinnedEndClassName,
      layout.isStartEdge && dataGridPinnedStartEdgeClassName,
      layout.isEndEdge && dataGridPinnedEndEdgeClassName,
      !this.border() && headers.slice(index + 1).some(item => !item.isPlaceholder) && dataGridHeaderSeparatorClassName,
      meta?.align && dataGridAlignClassName[meta.align],
      meta?.headerClassName,
      this.partClass().headerCell,
    )
  }
  protected headerStyle(header: GridHeader) {
    return this.layoutStyle(getDataGridHeaderLayout(header, this.pinningTable()).style)
  }
  protected rowClass(row: GridRow) {
    const layout = getDataGridRowLayout(row as unknown as DataGridRowRenderingSource, this.pinningTable())
    const pinned = this.rowPinned(row)
    return cn(dataGridRowClassName, pinned && dataGridPinnedRowClassName, pinned === 'top' && dataGridPinnedTopRowClassName, pinned === 'bottom' && dataGridPinnedBottomRowClassName, layout.edge === 'top' && dataGridPinnedTopEdgeClassName, layout.edge === 'bottom' && dataGridPinnedBottomEdgeClassName, this.isGrouped(row) && dataGridGroupedRowClassName, this.partClass().row)
  }
  protected rowStyle(row: GridRow) {
    return this.layoutStyle(getDataGridRowLayout(row as unknown as DataGridRowRenderingSource, this.pinningTable()).style)
  }
  protected cells(row: GridRow) {
    return getDataGridRenderedCells(row as unknown as DataGridRowRenderingSource) as GridCell[]
  }
  protected cellClass(cell: GridCell) {
    const layout = getDataGridColumnLayout(cell.column as unknown as DataGridColumnLayoutSource, this.pinningTable())
    const meta = this.meta(cell.column)
    return cn(dataGridCellClassName, layout.pinned && dataGridPinnedCellClassName, layout.pinned === 'start' && dataGridPinnedStartClassName, layout.pinned === 'end' && dataGridPinnedEndClassName, layout.isStartEdge && dataGridPinnedStartEdgeClassName, layout.isEndEdge && dataGridPinnedEndEdgeClassName, meta?.align && dataGridAlignClassName[meta.align], meta?.cellClassName, this.partClass().cell)
  }
  protected cellStyle(cell: GridCell) {
    return this.layoutStyle(getDataGridColumnLayout(cell.column as unknown as DataGridColumnLayoutSource, this.pinningTable()).style)
  }
  protected visibleCount() { return Math.max(1, getDataGridVisibleLeafColumnCount(this.renderTable())) }
  protected render(template: unknown, context: unknown) { const value = typeof template === 'function' ? template(context) : template; return value === null || value === undefined ? '' : String(value) }
  protected isGrouped(row: GridRow) { const source = row as GridRow & { getIsGrouped?: () => boolean }; return source.getIsGrouped?.() ?? false }
  protected isExpanded(row: GridRow) { const source = row as GridRow & { getIsExpanded?: () => boolean }; return source.getIsExpanded?.() ?? false }
  protected rowPinned(row: GridRow) { const source = row as GridRow & { getIsPinned?: () => false | 'top' | 'bottom' }; return source.getIsPinned?.() ?? false }
  protected canResize(header: GridHeader) { return (header.column as GridHeader['column'] & { getCanResize?: () => boolean }).getCanResize?.() ?? false }
  protected isResizing(header: GridHeader) { return (header.column as GridHeader['column'] & { getIsResizing?: () => boolean }).getIsResizing?.() ?? false }
  protected resize(header: GridHeader, event: MouseEvent | TouchEvent) { (header as GridHeader & { getResizeHandler?: () => (value: MouseEvent | TouchEvent) => void }).getResizeHandler?.()(event) }
  protected resetSize(header: GridHeader) { (header.column as GridHeader['column'] & { resetSize?: () => void }).resetSize?.() }
  protected readonly headerContentClassName = dataGridHeaderContentClassName
  protected readonly cellContentClassName = dataGridCellContentClassName
  protected readonly resizeHandleClassName = dataGridResizeHandleClassName
  protected readonly virtualSpacerClassName = dataGridVirtualSpacerClassName

  private meta(column: { columnDef: { meta?: unknown } }) { return column.columnDef.meta as DataGridColumnMeta | undefined }
  private layoutStyle(style: ReturnType<typeof getDataGridColumnLayout>['style']) { return { position: style.position, width: style.width === undefined ? undefined : `${style.width}px`, insetInlineStart: style.insetInlineStart === undefined ? undefined : `${style.insetInlineStart}px`, insetInlineEnd: style.insetInlineEnd === undefined ? undefined : `${style.insetInlineEnd}px`, top: style.top, bottom: style.bottom, zIndex: style.zIndex, backgroundColor: style.backgroundColor ? `var(--${style.backgroundColor})` : undefined, boxShadow: style.boxShadow } }
}

export { tableFeatures } from '@tanstack/table-core'
export type { Cell, ColumnDef, Header, Row, TableFeatures } from '@tanstack/table-core'
