<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
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
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, provide, shallowRef, useAttrs } from 'vue'
import type { VueDataGridTable } from '../../composables/use-data-grid-table'
import { DataGridTemplate } from './data-grid-template'
import { dataGridRevisionKey } from './data-grid-context'

defineOptions({ inheritAttrs: false })
interface DataGridClass {
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
    table: VueDataGridTable<TFeatures, TData>
    partClass?: DataGridClass
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
type RenderColumn = ReturnType<VueDataGridTable<TFeatures, TData>['getAllLeafColumns']>[number] &
  DataGridColumnLayoutSource
type RenderCell = Cell<TFeatures, TData> & { column: RenderColumn }
type RenderRow = Row<TFeatures, TData> & DataGridRowRenderingSource<RenderCell>
type RenderTable = VueDataGridTable<TFeatures, TData> &
  DataGridRenderingTableSource<RenderRow, RenderColumn>
const renderTable = props.table as unknown as RenderTable
const pinningTable = props.table as unknown as DataGridPinningTableSource
const snapshot = computed(() => props.table.dataGridSnapshot.value)
const revision = computed(() => snapshot.value.revision)
provide(dataGridRevisionKey, revision)
const renderedRows = computed(() => {
  void revision.value
  return [...getDataGridRenderedRows(renderTable)]
})
const virtualRows = computed(() => {
  void revision.value
  return [...getDataGridVirtualRows(renderTable)]
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
  return [...getDataGridVisibleLeafColumns(renderTable)]
})
const headerGroups = computed(() => {
  void revision.value
  return [...props.table.getHeaderGroups()]
})
const sizingLayout = computed(() => {
  void snapshot.value
  return getDataGridSizingLayout(props.table)
})
const tableWidth = computed(() => sizingLayout.value.tableWidth)
const rootStyle = computed(() => ({
  '--data-grid-header-height': 'var(--data-grid-row-height)',
  width: sizingLayout.value.rootWidth,
  ...(typeof attrs.style === 'object' && attrs.style !== null ? attrs.style : {}),
}))
const layoutStyle = (style: ReturnType<typeof getDataGridColumnLayout>['style']) => ({
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
  column.columnDef.meta as DataGridColumnMeta | undefined
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
    data-slot="data-grid"
    :data-loading="props.loading || undefined"
    :class="
      cn(
        dataGridRootClassName({
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
      data-slot="data-grid-viewport"
      :class="cn(dataGridViewportClassName, props.partClass?.viewport)"
      :style="props.virtual ? { height: `${props.virtual.height}px` } : undefined"
    >
      <table
        :class="cn(dataGridTableClassName, props.partClass?.table)"
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
        <thead :class="cn(dataGridHeaderClassName, props.partClass?.header)">
          <tr
            v-for="headerGroup in headerGroups"
            :key="headerGroup.id"
            :class="
              cn(dataGridHeaderRowClassName({ bordered: props.border }), props.partClass?.headerRow)
            "
          >
            <th
              v-for="(header, index) in headerGroup.headers"
              v-bind="headerProps(header)"
              :key="header.id"
              :colspan="header.colSpan"
              :class="
                cn(
                  dataGridHeaderCellClassName,
                  getDataGridHeaderLayout(header, pinningTable).pinned &&
                    dataGridPinnedCellClassName,
                  getDataGridHeaderLayout(header, pinningTable).pinned &&
                    dataGridPinnedHeaderCellClassName,
                  getDataGridHeaderLayout(header, pinningTable).pinned === 'start' &&
                    dataGridPinnedStartClassName,
                  getDataGridHeaderLayout(header, pinningTable).pinned === 'end' &&
                    dataGridPinnedEndClassName,
                  getDataGridHeaderLayout(header, pinningTable).isStartEdge &&
                    dataGridPinnedStartEdgeClassName,
                  getDataGridHeaderLayout(header, pinningTable).isEndEdge &&
                    dataGridPinnedEndEdgeClassName,
                  !props.border &&
                    headerGroup.headers.slice(index + 1).some((item) => !item.isPlaceholder) &&
                    dataGridHeaderSeparatorClassName,
                  metaOf(header.column)?.align &&
                    dataGridAlignClassName[metaOf(header.column)!.align!],
                  metaOf(header.column)?.headerClassName,
                  props.partClass?.headerCell,
                  nativePartClass(headerProps(header).class),
                )
              "
              :style="{
                ...layoutStyle(getDataGridHeaderLayout(header, pinningTable).style),
                ...objectStyle(headerProps(header).style),
              }"
            >
              <div
                v-if="!header.isPlaceholder"
                data-slot="data-grid-header-content"
                :class="dataGridHeaderContentClassName"
              >
                <DataGridTemplate
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
                :class="dataGridResizeHandleClassName"
                @dblclick="resizable(header).column.resetSize?.()"
                @mousedown="resizable(header).getResizeHandler?.()($event)"
                @touchstart="resizable(header).getResizeHandler?.()($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody :class="cn(dataGridBodyClassName, props.partClass?.body)">
          <tr v-if="props.virtual && virtualTop > 0" aria-hidden="true">
            <td
              :colspan="Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))"
              :class="dataGridVirtualSpacerClassName"
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
                    dataGridRowClassName,
                    row.getIsPinned?.() && dataGridPinnedRowClassName,
                    row.getIsPinned?.() === 'top' && dataGridPinnedTopRowClassName,
                    row.getIsPinned?.() === 'bottom' && dataGridPinnedBottomRowClassName,
                    getDataGridRowLayout(row, pinningTable).edge === 'top' &&
                      dataGridPinnedTopEdgeClassName,
                    getDataGridRowLayout(row, pinningTable).edge === 'bottom' &&
                      dataGridPinnedBottomEdgeClassName,
                    isGrouped(rowSource(row)) && dataGridGroupedRowClassName,
                    props.partClass?.row,
                    nativePartClass(rowProps(row).class),
                  )
                "
                :style="{
                  ...layoutStyle(getDataGridRowLayout(row, pinningTable).style),
                  ...objectStyle(rowProps(row).style),
                }"
              >
                <td
                  v-if="isGrouped(rowSource(row)) && $slots.groupRow"
                  :colspan="Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))"
                  :class="cn(dataGridCellClassName, props.partClass?.cell)"
                >
                  <slot name="groupRow" :row="row" />
                </td>
                <td
                  v-for="cell in isGrouped(rowSource(row)) && $slots.groupRow
                    ? []
                    : getDataGridRenderedCells(rowSource(row))"
                  v-bind="cellProps(cell)"
                  :key="cell.id"
                  :class="
                    cn(
                      dataGridCellClassName,
                      getDataGridColumnLayout(cell.column, pinningTable).pinned &&
                        dataGridPinnedCellClassName,
                      getDataGridColumnLayout(cell.column, pinningTable).pinned === 'start' &&
                        dataGridPinnedStartClassName,
                      getDataGridColumnLayout(cell.column, pinningTable).pinned === 'end' &&
                        dataGridPinnedEndClassName,
                      getDataGridColumnLayout(cell.column, pinningTable).isStartEdge &&
                        dataGridPinnedStartEdgeClassName,
                      getDataGridColumnLayout(cell.column, pinningTable).isEndEdge &&
                        dataGridPinnedEndEdgeClassName,
                      metaOf(cell.column)?.align &&
                        dataGridAlignClassName[metaOf(cell.column)!.align!],
                      metaOf(cell.column)?.cellClassName,
                      props.partClass?.cell,
                      nativePartClass(cellProps(cell).class),
                    )
                  "
                  :style="{
                    ...layoutStyle(getDataGridColumnLayout(cell.column, pinningTable).style),
                    ...objectStyle(cellProps(cell).style),
                  }"
                >
                  <div :class="dataGridCellContentClassName">
                    <DataGridTemplate
                      :template="cell.column.columnDef.cell"
                      :context="cell.getContext()"
                      :revision="revision"
                    />
                  </div>
                </td>
              </tr>
              <tr
                v-if="isExpanded(rowSource(row)) && $slots.subComponent"
                :class="dataGridRowClassName"
              >
                <td :colspan="getDataGridVisibleLeafColumnCount(renderTable)">
                  <slot name="subComponent" :row="row" />
                </td>
              </tr>
            </template>
          </template>
          <tr v-else>
            <td
              :colspan="Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))"
              :class="cn(dataGridEmptyClassName, props.partClass?.empty)"
            >
              {{ props.emptyContent }}
            </td>
          </tr>
          <tr v-if="props.virtual && virtualBottom > 0" aria-hidden="true">
            <td
              :colspan="Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))"
              :class="dataGridVirtualSpacerClassName"
              :style="{ height: `${virtualBottom}px` }"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="props.loading" :class="cn(dataGridLoadingClassName, props.partClass?.loading)">
      {{ props.loadingContent }}
    </div>
  </div>
</template>
