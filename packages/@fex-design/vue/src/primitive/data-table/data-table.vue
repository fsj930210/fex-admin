<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
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
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, provide, shallowRef, useAttrs } from 'vue'
import type { VueDataTable } from '../../composables/use-data-table'
import { DataTableTemplate } from './data-table-template'
import { dataTableRevisionKey } from './data-table-context'

defineOptions({ inheritAttrs: false })
interface DataTableClass {
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
type NativePartProps = Record<string, unknown>
const props = withDefaults(
  defineProps<{
    table: VueDataTable<TFeatures, TData>
    partClass?: DataTableClass
    density?: 'compact' | 'default' | 'comfortable'
    striped?: boolean
    border?: boolean
    loading?: boolean
    loadingContent?: string
    emptyContent?: string
    virtual?: { height: number; estimateRowHeight?: number; overscan?: number }
    getHeaderProps?: (header: Header<TFeatures, TData>) => NativePartProps
    getCellProps?: (cell: Cell<TFeatures, TData>) => NativePartProps
    getRowProps?: (row: Row<TFeatures, TData>) => NativePartProps
  }>(),
  {
    density: 'default',
    striped: false,
    border: false,
    loading: false,
    loadingContent: 'Loading…',
    emptyContent: 'No data',
  },
)
const attrs = useAttrs()
type RenderColumn = ReturnType<VueDataTable<TFeatures, TData>['getAllLeafColumns']>[number] &
  DataTableColumnLayoutSource
type RenderCell = Cell<TFeatures, TData> & { column: RenderColumn }
type RenderRow = Row<TFeatures, TData> & DataTableRowRenderingSource<RenderCell>
type RenderTable = VueDataTable<TFeatures, TData> &
  DataTableRenderingTableSource<RenderRow, RenderColumn>
const renderTable = props.table as unknown as RenderTable
const pinningTable = props.table as unknown as DataTablePinningTableSource
const snapshot = computed(() => props.table.dataTableSnapshot.value)
const revision = computed(() => snapshot.value.revision)
provide(dataTableRevisionKey, revision)
const renderedRows = computed(() => {
  void revision.value
  return [...getDataTableRenderedRows(renderTable)]
})
const virtualRows = computed(() => {
  void revision.value
  return [...getDataTableVirtualRows(renderTable)]
})
const viewportElement = shallowRef<HTMLDivElement | null>(null)
const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.virtual ? virtualRows.value.length : 0,
    getScrollElement: () => viewportElement.value,
    estimateSize: () => props.virtual?.estimateRowHeight ?? 40,
    overscan: props.virtual?.overscan ?? 8,
  })),
)
const rows = computed(() =>
  props.virtual
    ? virtualizer.value
        .getVirtualItems()
        .map((item) => virtualRows.value[item.index])
        .filter((row): row is RenderRow => row !== undefined)
    : renderedRows.value,
)
const virtualTop = computed(() => virtualizer.value.getVirtualItems()[0]?.start ?? 0)
const virtualBottom = computed(() => {
  const last = virtualizer.value.getVirtualItems().at(-1)
  return last ? Math.max(0, virtualizer.value.getTotalSize() - last.end) : 0
})
const columns = computed(() => {
  void revision.value
  return [...getDataTableVisibleLeafColumns(renderTable)]
})
const headerGroups = computed(() => {
  void revision.value
  return [...props.table.getHeaderGroups()]
})
const sizingLayout = computed(() => {
  void snapshot.value
  return getDataTableSizingLayout(props.table)
})
const tableWidth = computed(() => sizingLayout.value.tableWidth)
const rootStyle = computed(() => ({
  '--data-table-header-height': 'var(--data-table-row-height)',
  width: sizingLayout.value.rootWidth,
  ...(typeof attrs.style === 'object' && attrs.style !== null ? attrs.style : {}),
}))
const layoutStyle = (style: ReturnType<typeof getDataTableColumnLayout>['style']) => ({
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
})
const metaOf = (column: { columnDef: { meta?: unknown } }) =>
  column.columnDef.meta as DataTableColumnMeta | undefined
const rowSource = (row: RenderRow) => row
const isGrouped = (row: RenderRow) =>
  'getIsGrouped' in row && typeof row.getIsGrouped === 'function' && row.getIsGrouped()
const isExpanded = (row: RenderRow) =>
  'getIsExpanded' in row && typeof row.getIsExpanded === 'function' && row.getIsExpanded()
type ResizableHeader = Header<TFeatures, TData> & {
  column: Header<TFeatures, TData>['column'] & {
    getCanResize?: () => boolean
    getIsResizing?: () => boolean
    resetSize?: () => void
  }
  getResizeHandler?: () => (event: MouseEvent | TouchEvent) => void
}
const resizable = (header: Header<TFeatures, TData>) => header as ResizableHeader
const headerProps = (header: Header<TFeatures, TData>) => props.getHeaderProps?.(header) ?? {}
const cellProps = (cell: Cell<TFeatures, TData>) => props.getCellProps?.(cell) ?? {}
const rowProps = (row: Row<TFeatures, TData>) => props.getRowProps?.(row) ?? {}
const objectStyle = (style: unknown) => (typeof style === 'object' && style !== null ? style : {})
const nativePartClass = (value: unknown) => (typeof value === 'string' ? value : undefined)
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="data-table"
    :data-loading="props.loading || undefined"
    :class="
      cn(
        dataTableRootClassName({
          density: props.density,
          striped: props.striped,
          bordered: props.border,
        }),
        props.partClass?.root,
      )
    "
    :style="rootStyle"
  >
    <div
      ref="viewportElement"
      data-slot="data-table-viewport"
      :class="cn(dataTableViewportClassName, props.partClass?.viewport)"
      :style="props.virtual ? { height: `${props.virtual.height}px` } : undefined"
    >
      <table
        :class="cn(dataTableClassName, props.partClass?.table)"
        :style="{ width: tableWidth === undefined ? '100%' : `${tableWidth}px` }"
      >
        <colgroup v-if="tableWidth !== undefined">
          <col
            v-for="column in columns"
            :key="column.id"
            :style="{
              width: column.getSize?.() === undefined ? undefined : `${column.getSize?.()}px`,
            }"
          />
        </colgroup>
        <thead :class="cn(dataTableHeaderClassName, props.partClass?.header)">
          <tr
            v-for="headerGroup in headerGroups"
            :key="headerGroup.id"
            :class="
              cn(dataTableHeaderRowClassName({ bordered: props.border }), props.partClass?.headerRow)
            "
          >
            <th
              v-for="(header, index) in headerGroup.headers"
              v-bind="headerProps(header)"
              :key="header.id"
              :colspan="header.colSpan"
              :class="
                cn(
                  dataTableHeaderCellClassName,
                  getDataTableHeaderLayout(header, pinningTable).pinned &&
                    dataTablePinnedCellClassName,
                  getDataTableHeaderLayout(header, pinningTable).pinned &&
                    dataTablePinnedHeaderCellClassName,
                  getDataTableHeaderLayout(header, pinningTable).pinned === 'start' &&
                    dataTablePinnedStartClassName,
                  getDataTableHeaderLayout(header, pinningTable).pinned === 'end' &&
                    dataTablePinnedEndClassName,
                  getDataTableHeaderLayout(header, pinningTable).isStartEdge &&
                    dataTablePinnedStartEdgeClassName,
                  getDataTableHeaderLayout(header, pinningTable).isEndEdge &&
                    dataTablePinnedEndEdgeClassName,
                  !props.border &&
                    headerGroup.headers.slice(index + 1).some((item) => !item.isPlaceholder) &&
                    dataTableHeaderSeparatorClassName,
                  metaOf(header.column)?.align &&
                    dataTableAlignClassName[metaOf(header.column)!.align!],
                  metaOf(header.column)?.headerClassName,
                  props.partClass?.headerCell,
                  nativePartClass(headerProps(header).class),
                )
              "
              :style="{
                ...layoutStyle(getDataTableHeaderLayout(header, pinningTable).style),
                ...objectStyle(headerProps(header).style),
              }"
            >
              <div
                v-if="!header.isPlaceholder"
                data-slot="data-table-header-content"
                :class="dataTableHeaderContentClassName"
              >
                <DataTableTemplate
                  :template="header.column.columnDef.header"
                  :context="header.getContext()"
                  :revision="revision"
                />
              </div>
              <span
                v-if="header.colSpan === 1 && resizable(header).column.getCanResize?.()"
                role="separator"
                tabindex="0"
                :aria-label="`Resize ${header.column.id}`"
                :data-resizing="resizable(header).column.getIsResizing?.() || undefined"
                :class="dataTableResizeHandleClassName"
                @dblclick="resizable(header).column.resetSize?.()"
                @mousedown="resizable(header).getResizeHandler?.()($event)"
                @touchstart="resizable(header).getResizeHandler?.()($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody :class="cn(dataTableBodyClassName, props.partClass?.body)">
          <tr v-if="props.virtual && virtualTop > 0" aria-hidden="true">
            <td
              :colspan="Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))"
              :class="dataTableVirtualSpacerClassName"
              :style="{ height: `${virtualTop}px` }"
            />
          </tr>
          <template v-if="rows.length">
            <template v-for="row in rows" :key="row.id">
              <tr
                v-bind="rowProps(row)"
                :data-pinned="row.getIsPinned?.() || undefined"
                :data-grouped="isGrouped(rowSource(row)) || undefined"
                :class="
                  cn(
                    dataTableRowClassName,
                    row.getIsPinned?.() && dataTablePinnedRowClassName,
                    row.getIsPinned?.() === 'top' && dataTablePinnedTopRowClassName,
                    row.getIsPinned?.() === 'bottom' && dataTablePinnedBottomRowClassName,
                    getDataTableRowLayout(row, pinningTable).edge === 'top' &&
                      dataTablePinnedTopEdgeClassName,
                    getDataTableRowLayout(row, pinningTable).edge === 'bottom' &&
                      dataTablePinnedBottomEdgeClassName,
                    isGrouped(rowSource(row)) && dataTableGroupedRowClassName,
                    props.partClass?.row,
                    nativePartClass(rowProps(row).class),
                  )
                "
                :style="{
                  ...layoutStyle(getDataTableRowLayout(row, pinningTable).style),
                  ...objectStyle(rowProps(row).style),
                }"
              >
                <td
                  v-if="isGrouped(rowSource(row)) && $slots.groupRow"
                  :colspan="Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))"
                  :class="cn(dataTableCellClassName, props.partClass?.cell)"
                >
                  <slot name="groupRow" :row="row" />
                </td>
                <td
                  v-for="cell in isGrouped(rowSource(row)) && $slots.groupRow
                    ? []
                    : getDataTableRenderedCells(rowSource(row))"
                  v-bind="cellProps(cell)"
                  :key="cell.id"
                  :class="
                    cn(
                      dataTableCellClassName,
                      getDataTableColumnLayout(cell.column, pinningTable).pinned &&
                        dataTablePinnedCellClassName,
                      getDataTableColumnLayout(cell.column, pinningTable).pinned === 'start' &&
                        dataTablePinnedStartClassName,
                      getDataTableColumnLayout(cell.column, pinningTable).pinned === 'end' &&
                        dataTablePinnedEndClassName,
                      getDataTableColumnLayout(cell.column, pinningTable).isStartEdge &&
                        dataTablePinnedStartEdgeClassName,
                      getDataTableColumnLayout(cell.column, pinningTable).isEndEdge &&
                        dataTablePinnedEndEdgeClassName,
                      metaOf(cell.column)?.align &&
                        dataTableAlignClassName[metaOf(cell.column)!.align!],
                      metaOf(cell.column)?.cellClassName,
                      props.partClass?.cell,
                      nativePartClass(cellProps(cell).class),
                    )
                  "
                  :style="{
                    ...layoutStyle(getDataTableColumnLayout(cell.column, pinningTable).style),
                    ...objectStyle(cellProps(cell).style),
                  }"
                >
                  <div :class="dataTableCellContentClassName">
                    <DataTableTemplate
                      :template="cell.column.columnDef.cell"
                      :context="cell.getContext()"
                      :revision="revision"
                    />
                  </div>
                </td>
              </tr>
              <tr
                v-if="isExpanded(rowSource(row)) && $slots.subComponent"
                :class="dataTableRowClassName"
              >
                <td :colspan="getDataTableVisibleLeafColumnCount(renderTable)">
                  <slot name="subComponent" :row="row" />
                </td>
              </tr>
            </template>
          </template>
          <tr v-else>
            <td
              :colspan="Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))"
              :class="cn(dataTableEmptyClassName, props.partClass?.empty)"
            >
              {{ props.emptyContent }}
            </td>
          </tr>
          <tr v-if="props.virtual && virtualBottom > 0" aria-hidden="true">
            <td
              :colspan="Math.max(1, getDataTableVisibleLeafColumnCount(renderTable))"
              :class="dataTableVirtualSpacerClassName"
              :style="{ height: `${virtualBottom}px` }"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="props.loading" :class="cn(dataTableLoadingClassName, props.partClass?.loading)">
      {{ props.loadingContent }}
    </div>
  </div>
</template>
