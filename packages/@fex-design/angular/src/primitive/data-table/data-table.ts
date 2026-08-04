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
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  getDataTableColumnLayout,
  getDataTableHeaderLayout,
  getDataTableRenderedCells,
  getDataTableRenderedRows,
  getDataTableRowLayout,
  getDataTableSizingLayout,
  getDataTableVirtualRows,
  getDataTableVisibleLeafColumnCount,
  getDataTableVisibleLeafColumns,
  type DataTableColumnLayoutSource,
  type DataTablePinningTableSource,
  type DataTableRenderingTableSource,
  type DataTableRowRenderingSource,
} from '@fex-design/core/data-table/layout'
import {
  dataTableAlignClassName,
  dataTableBodyClassName,
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableEmptyClassName,
  dataTableGroupedRowClassName,
  dataTableHeaderCellClassName,
  dataTableHeaderClassName,
  dataTableHeaderContentClassName,
  dataTableHeaderRowClassName,
  dataTableHeaderSeparatorClassName,
  dataTableLoadingClassName,
  dataTablePinnedBottomEdgeClassName,
  dataTablePinnedBottomRowClassName,
  dataTablePinnedCellClassName,
  dataTablePinnedEndClassName,
  dataTablePinnedEndEdgeClassName,
  dataTablePinnedHeaderCellClassName,
  dataTablePinnedRowClassName,
  dataTablePinnedStartClassName,
  dataTablePinnedStartEdgeClassName,
  dataTablePinnedTopEdgeClassName,
  dataTablePinnedTopRowClassName,
  dataTableResizeHandleClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableClassName,
  dataTableViewportClassName,
  dataTableVirtualSpacerClassName,
} from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { Cell, Header, Row, RowData, TableFeatures } from '@tanstack/table-core'
import { injectVirtualizer } from '@tanstack/angular-virtual'

import { createHostClassName } from '../../signals/host-class'
import type { AngularDataTable } from '../../signals/create-data-table'

export { DataTableColumnOverlay } from './data-table-column-overlay'
export { DataTableRowOverlay } from './data-table-row-overlay'

type DataTableFeatures = TableFeatures
type DataTableData = RowData
type DataTableCell = Cell<DataTableFeatures, DataTableData>
type DataTableHeader = Header<DataTableFeatures, DataTableData>
type DataTableRow = Row<DataTableFeatures, DataTableData>
type VirtualRowItem = { readonly index: number }
type DataTablePartCleanup = void | (() => void) | { destroy?: () => void }
export type DataTablePartAction<TItem> = {
  bivarianceHack(element: HTMLElement, item: TItem): DataTablePartCleanup
}['bivarianceHack']

@Directive({ selector: '[fexDataTablePartAction]', standalone: true })
export class DataTablePartActionDirective {
  readonly action = input<DataTablePartAction<never> | undefined>(undefined, {
    alias: 'fexDataTablePartAction',
  })
  readonly item = input<unknown>(undefined, { alias: 'fexDataTablePartItem' })
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef)

  constructor() {
    effect((onCleanup) => {
      const action = this.action()
      const item = this.item()
      if (!action || item === undefined) return
      const cleanup = action(this.element.nativeElement, item as never)
      onCleanup(() => (typeof cleanup === 'function' ? cleanup() : cleanup?.destroy?.()))
    })
  }
}

@Directive({ selector: 'ng-template[fexDataTableHeader]', standalone: true })
export class DataTableHeaderTemplate {
  readonly template = inject<TemplateRef<{ $implicit: DataTableHeader }>>(TemplateRef)
}

@Directive({ selector: 'ng-template[fexDataTableCell]', standalone: true })
export class DataTableCellTemplate {
  readonly template = inject<TemplateRef<{ $implicit: DataTableCell }>>(TemplateRef)
}

@Directive({ selector: 'ng-template[fexDataTableGroupRow]', standalone: true })
export class DataTableGroupRowTemplate {
  readonly template = inject<TemplateRef<{ $implicit: DataTableRow }>>(TemplateRef)
}

@Directive({ selector: 'ng-template[fexDataTableSubComponent]', standalone: true })
export class DataTableSubComponentTemplate {
  readonly template = inject<TemplateRef<{ $implicit: DataTableRow }>>(TemplateRef)
}

export interface DataTableClass {
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
  selector: 'fex-data-table',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet, DataTablePartActionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'data-table',
    '[attr.data-loading]': 'loading() || null',
    '[style.--data-table-header-height]': '"var(--data-table-row-height)"',
    '[style.width]': 'sizingLayout().rootWidth',
  },
  templateUrl: './data-table.html',
})
export class DataTable {
  readonly table = input.required<unknown>()
  readonly density = input<'compact' | 'default' | 'comfortable'>('default')
  readonly striped = input(false)
  readonly border = input(false)
  readonly loading = input(false)
  readonly loadingContent = input('Loading…')
  readonly emptyContent = input('No data')
  readonly virtual = input<VirtualOptions | undefined>()
  readonly partClass = input<DataTableClass>({})
  readonly headerAction = input<DataTablePartAction<never> | undefined>()
  readonly cellAction = input<DataTablePartAction<never> | undefined>()
  readonly rowAction = input<DataTablePartAction<never> | undefined>()

  protected readonly headerTemplate = contentChild(DataTableHeaderTemplate)
  protected readonly cellTemplate = contentChild(DataTableCellTemplate)
  protected readonly groupRowTemplate = contentChild(DataTableGroupRowTemplate)
  protected readonly subComponentTemplate = contentChild(DataTableSubComponentTemplate)
  protected readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport')
  protected readonly hostClassName = createHostClassName(() =>
    cn(
      dataTableRootClassName({
        density: this.density(),
        striped: this.striped(),
        bordered: this.border(),
      }),
      this.partClass().root,
    ),
  )

  private readonly resolvedTable = computed(() => this.table() as AngularDataTable)
  private readonly renderTable = computed(
    () => this.resolvedTable() as unknown as DataTableRenderingTableSource,
  )
  private readonly pinningTable = computed(
    () => this.resolvedTable() as unknown as DataTablePinningTableSource,
  )
  protected readonly snapshot = computed(() => this.resolvedTable().dataTableSnapshot())
  protected readonly renderedRows = computed(() => {
    this.snapshot()
    return getDataTableRenderedRows(this.renderTable()) as DataTableRow[]
  })
  protected readonly virtualRows = computed(() => {
    this.snapshot()
    return getDataTableVirtualRows(this.renderTable()) as DataTableRow[]
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
          .map((item: VirtualRowItem) => this.virtualRows()[item.index])
          .filter((row: DataTableRow | undefined): row is DataTableRow => row !== undefined)
      : this.renderedRows(),
  )
  protected readonly virtualTop = computed(() => this.virtualizer.getVirtualItems()[0]?.start ?? 0)
  protected readonly virtualBottom = computed(() => {
    const last = this.virtualizer.getVirtualItems().at(-1)
    return last ? Math.max(0, this.virtualizer.getTotalSize() - last.end) : 0
  })
  protected readonly columns = computed(() => {
    this.snapshot()
    return getDataTableVisibleLeafColumns(this.renderTable())
  })
  protected readonly headerGroups = computed(() => {
    this.snapshot()
    return this.resolvedTable().getHeaderGroups()
  })
  protected readonly sizingLayout = computed(() => {
    this.snapshot()
    return getDataTableSizingLayout(this.resolvedTable())
  })
  protected readonly tableWidth = computed(() => this.sizingLayout().tableWidth)

  protected readonly viewportClassName = computed(() =>
    cn(dataTableViewportClassName, this.partClass().viewport),
  )
  protected readonly tableClassName = computed(() =>
    cn(dataTableClassName, this.partClass().table),
  )
  protected readonly headerClassName = computed(() =>
    cn(dataTableHeaderClassName, this.partClass().header),
  )
  protected readonly bodyClassName = computed(() =>
    cn(dataTableBodyClassName, this.partClass().body),
  )
  protected readonly loadingClassName = computed(() =>
    cn(dataTableLoadingClassName, this.partClass().loading),
  )
  protected readonly emptyClassName = computed(() =>
    cn(dataTableEmptyClassName, this.partClass().empty),
  )

  protected headerRowClass() {
    return cn(dataTableHeaderRowClassName({ bordered: this.border() }), this.partClass().headerRow)
  }
  protected headerClass(header: DataTableHeader, index: number, headers: DataTableHeader[]) {
    const layout = getDataTableHeaderLayout(header, this.pinningTable())
    const meta = this.meta(header.column)
    return cn(
      dataTableHeaderCellClassName,
      layout.pinned && dataTablePinnedCellClassName,
      layout.pinned && dataTablePinnedHeaderCellClassName,
      layout.pinned === 'start' && dataTablePinnedStartClassName,
      layout.pinned === 'end' && dataTablePinnedEndClassName,
      layout.isStartEdge && dataTablePinnedStartEdgeClassName,
      layout.isEndEdge && dataTablePinnedEndEdgeClassName,
      !this.border() &&
        headers.slice(index + 1).some((item) => !item.isPlaceholder) &&
        dataTableHeaderSeparatorClassName,
      meta?.align && dataTableAlignClassName[meta.align],
      meta?.headerClassName,
      this.partClass().headerCell,
    )
  }
  protected headerStyle(header: DataTableHeader) {
    return this.layoutStyle(getDataTableHeaderLayout(header, this.pinningTable()).style)
  }
  protected rowClass(row: DataTableRow) {
    const layout = getDataTableRowLayout(
      row as unknown as DataTableRowRenderingSource,
      this.pinningTable(),
    )
    const pinned = this.rowPinned(row)
    return cn(
      dataTableRowClassName,
      pinned && dataTablePinnedRowClassName,
      pinned === 'top' && dataTablePinnedTopRowClassName,
      pinned === 'bottom' && dataTablePinnedBottomRowClassName,
      layout.edge === 'top' && dataTablePinnedTopEdgeClassName,
      layout.edge === 'bottom' && dataTablePinnedBottomEdgeClassName,
      this.isGrouped(row) && dataTableGroupedRowClassName,
      this.partClass().row,
    )
  }
  protected rowStyle(row: DataTableRow) {
    return this.layoutStyle(
      getDataTableRowLayout(row as unknown as DataTableRowRenderingSource, this.pinningTable()).style,
    )
  }
  protected cells(row: DataTableRow) {
    return getDataTableRenderedCells(row as unknown as DataTableRowRenderingSource) as DataTableCell[]
  }
  protected cellClass(cell: DataTableCell) {
    const layout = getDataTableColumnLayout(
      cell.column as unknown as DataTableColumnLayoutSource,
      this.pinningTable(),
    )
    const meta = this.meta(cell.column)
    return cn(
      dataTableCellClassName,
      layout.pinned && dataTablePinnedCellClassName,
      layout.pinned === 'start' && dataTablePinnedStartClassName,
      layout.pinned === 'end' && dataTablePinnedEndClassName,
      layout.isStartEdge && dataTablePinnedStartEdgeClassName,
      layout.isEndEdge && dataTablePinnedEndEdgeClassName,
      meta?.align && dataTableAlignClassName[meta.align],
      meta?.cellClassName,
      this.partClass().cell,
    )
  }
  protected cellStyle(cell: DataTableCell) {
    return this.layoutStyle(
      getDataTableColumnLayout(
        cell.column as unknown as DataTableColumnLayoutSource,
        this.pinningTable(),
      ).style,
    )
  }
  protected visibleCount() {
    return Math.max(1, getDataTableVisibleLeafColumnCount(this.renderTable()))
  }
  protected render(template: unknown, context: unknown) {
    const value = typeof template === 'function' ? template(context) : template
    return value === null || value === undefined ? '' : String(value)
  }
  protected isGrouped(row: DataTableRow) {
    const source = row as DataTableRow & { getIsGrouped?: () => boolean }
    return source.getIsGrouped?.() ?? false
  }
  protected isExpanded(row: DataTableRow) {
    const source = row as DataTableRow & { getIsExpanded?: () => boolean }
    return source.getIsExpanded?.() ?? false
  }
  protected rowPinned(row: DataTableRow) {
    const source = row as DataTableRow & { getIsPinned?: () => false | 'top' | 'bottom' }
    return source.getIsPinned?.() ?? false
  }
  protected canResize(header: DataTableHeader) {
    return (
      (header.column as DataTableHeader['column'] & { getCanResize?: () => boolean }).getCanResize?.() ??
      false
    )
  }
  protected isResizing(header: DataTableHeader) {
    return (
      (
        header.column as DataTableHeader['column'] & { getIsResizing?: () => boolean }
      ).getIsResizing?.() ?? false
    )
  }
  protected resize(header: DataTableHeader, event: MouseEvent | TouchEvent) {
    ;(
      header as DataTableHeader & { getResizeHandler?: () => (value: MouseEvent | TouchEvent) => void }
    ).getResizeHandler?.()(event)
  }
  protected resetSize(header: DataTableHeader) {
    ;(header.column as DataTableHeader['column'] & { resetSize?: () => void }).resetSize?.()
  }
  protected readonly headerContentClassName = dataTableHeaderContentClassName
  protected readonly cellContentClassName = dataTableCellContentClassName
  protected readonly resizeHandleClassName = dataTableResizeHandleClassName
  protected readonly virtualSpacerClassName = dataTableVirtualSpacerClassName

  private meta(column: { columnDef: { meta?: unknown } }) {
    return column.columnDef.meta as DataTableColumnMeta | undefined
  }
  private layoutStyle(style: ReturnType<typeof getDataTableColumnLayout>['style']) {
    return {
      position: style.position,
      width: style.width === undefined ? undefined : `${style.width}px`,
      insetInlineStart:
        style.insetInlineStart === undefined ? undefined : `${style.insetInlineStart}px`,
      insetInlineEnd: style.insetInlineEnd === undefined ? undefined : `${style.insetInlineEnd}px`,
      top: style.top,
      bottom: style.bottom,
      zIndex: style.zIndex,
      backgroundColor: style.backgroundColor ? `var(--${style.backgroundColor})` : undefined,
      boxShadow: style.boxShadow,
    }
  }
}

export { tableFeatures } from '@tanstack/table-core'
export type { Cell, ColumnDef, Header, Row, TableFeatures } from '@tanstack/table-core'
