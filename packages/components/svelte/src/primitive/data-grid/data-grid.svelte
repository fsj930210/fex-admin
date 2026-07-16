<script
  lang="ts"
  generics="TFeatures extends TableFeatures, TData extends RowData"
>
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
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes, HTMLTdAttributes, HTMLThAttributes } from 'svelte/elements'

  import type { SvelteDataGridTable } from '../../stores/create-data-grid-table'

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

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
    table: SvelteDataGridTable<TFeatures, TData>
    class?: DataGridClass
    density?: 'compact' | 'default' | 'comfortable'
    striped?: boolean
    border?: boolean
    loading?: boolean
    loadingContent?: string
    emptyContent?: string
    virtual?: { height: number; estimateRowHeight?: number; overscan?: number }
    header?: Snippet<[Header<TFeatures, TData>, number]>
    cell?: Snippet<[Cell<TFeatures, TData>, number]>
    groupRow?: Snippet<[Row<TFeatures, TData>, number]>
    subComponent?: Snippet<[Row<TFeatures, TData>, number]>
    getHeaderProps?: (header: Header<TFeatures, TData>) => HTMLThAttributes
    getCellProps?: (cell: Cell<TFeatures, TData>) => HTMLTdAttributes
    getRowProps?: (row: Row<TFeatures, TData>) => HTMLAttributes<HTMLTableRowElement>
    headerAction?: PartAction<Header<TFeatures, TData>>
    cellAction?: PartAction<Cell<TFeatures, TData>>
    rowAction?: PartAction<Row<TFeatures, TData>>
  }

  type PartAction<TItem> = (
    node: HTMLElement,
    item: TItem,
  ) => { update?: (item: TItem) => void; destroy?: () => void } | void

  let {
    table,
    class: classes,
    density = 'default',
    striped = false,
    border = false,
    loading = false,
    loadingContent = 'Loading…',
    emptyContent = 'No data',
    virtual,
    header,
    cell,
    groupRow,
    subComponent,
    getHeaderProps,
    getCellProps,
    getRowProps,
    headerAction,
    cellAction,
    rowAction,
    style,
    ...rest
  }: Props = $props()

  type RenderColumn = ReturnType<typeof table.getAllLeafColumns>[number] &
    DataGridColumnLayoutSource
  type RenderCell = Cell<TFeatures, TData> & { column: RenderColumn }
  type RenderRow = Row<TFeatures, TData> & DataGridRowRenderingSource<RenderCell>
  type RenderTable = SvelteDataGridTable<TFeatures, TData> &
    DataGridRenderingTableSource<RenderRow, RenderColumn>

  // svelte-ignore state_referenced_locally -- a DataGrid table/controller is intentionally stable.
  const renderTable = table as unknown as RenderTable
  // svelte-ignore state_referenced_locally -- pinning layout reads the same stable controller.
  const pinningTable = table as unknown as DataGridPinningTableSource
  // svelte-ignore state_referenced_locally -- subscriptions belong to the stable controller.
  const snapshot = table.dataGridSnapshot
  let viewportElement = $state<HTMLDivElement | null>(null)
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: 0,
    getScrollElement: () => viewportElement,
    estimateSize: () => virtual?.estimateRowHeight ?? 40,
    overscan: 8,
  })

  const renderedRows = $derived.by(() => {
    void $snapshot
    return [...getDataGridRenderedRows(renderTable)]
  })
  const virtualRows = $derived.by(() => {
    void $snapshot
    return [...getDataGridVirtualRows(renderTable)]
  })
  $effect(() => {
    // The virtualizer store is both the command target and a notification
    // source. Reading it reactively here would make setOptions retrigger this
    // same effect until Svelte reaches its update-depth guard.
    untrack(() => $virtualizer).setOptions({
      count: virtual ? virtualRows.length : 0,
      getScrollElement: () => viewportElement,
      estimateSize: () => virtual?.estimateRowHeight ?? 40,
      overscan: virtual?.overscan ?? 8,
    })
  })
  const rows = $derived(
    virtual
      ? $virtualizer
          .getVirtualItems()
          .map(item => virtualRows[item.index])
          .filter((row): row is RenderRow => row !== undefined)
      : renderedRows,
  )
  const virtualTop = $derived($virtualizer.getVirtualItems()[0]?.start ?? 0)
  const virtualBottom = $derived.by(() => {
    const last = $virtualizer.getVirtualItems().at(-1)
    return last ? Math.max(0, $virtualizer.getTotalSize() - last.end) : 0
  })
  const columns = $derived.by(() => {
    void $snapshot
    return [...getDataGridVisibleLeafColumns(renderTable)]
  })
  const headerGroups = $derived.by(() => {
    void $snapshot
    return [...table.getHeaderGroups()]
  })
  const sizingLayout = $derived.by(() => {
    void $snapshot
    return getDataGridSizingLayout(table)
  })
  const tableWidth = $derived(sizingLayout.tableWidth)

  function renderTemplate(template: unknown, context: unknown, revision: number) {
    void revision
    return typeof template === 'function' ? template(context) : template
  }
  function text(value: unknown) {
    return value === undefined || value === null ? '' : String(value)
  }
  function metaOf(column: { columnDef: { meta?: unknown } }) {
    return column.columnDef.meta as DataGridColumnMeta | undefined
  }
  function layoutStyle(layout: ReturnType<typeof getDataGridColumnLayout>['style']) {
    return {
      position: layout.position,
      width: layout.width === undefined ? undefined : `${layout.width}px`,
      insetInlineStart:
        layout.insetInlineStart === undefined ? undefined : `${layout.insetInlineStart}px`,
      insetInlineEnd:
        layout.insetInlineEnd === undefined ? undefined : `${layout.insetInlineEnd}px`,
      top: layout.top,
      bottom: layout.bottom,
      zIndex: layout.zIndex,
      backgroundColor: layout.backgroundColor
        ? `var(--${layout.backgroundColor})`
        : undefined,
      boxShadow: layout.boxShadow,
    }
  }
  function styleToString(value: Record<string, string | number | undefined>) {
    return Object.entries(value)
      .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
      .map(([key, item]) => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${item}`)
      .join(';')
  }
  function mergedStyle(
    layout: ReturnType<typeof getDataGridColumnLayout>['style'],
    nativeStyle: string | null | undefined,
  ) {
    const layoutValue = styleToString(layoutStyle(layout))
    return nativeStyle ? `${layoutValue};${nativeStyle}` : layoutValue
  }
  function isGrouped(row: RenderRow) {
    return 'getIsGrouped' in row && typeof row.getIsGrouped === 'function' && row.getIsGrouped()
  }
  function isExpanded(row: RenderRow) {
    return 'getIsExpanded' in row && typeof row.getIsExpanded === 'function' && row.getIsExpanded()
  }
  function headerLayoutOf(item: Header<TFeatures, TData>, revision: number) {
    void revision
    return getDataGridHeaderLayout(item, pinningTable)
  }
  function rowLayoutOf(row: RenderRow, revision: number) {
    void revision
    return getDataGridRowLayout(row, pinningTable)
  }
  function cellsOf(row: RenderRow, revision: number) {
    void revision
    return [...getDataGridRenderedCells(row)]
  }
  function columnSizeOf(column: RenderColumn, revision: number) {
    void revision
    return column.getSize?.()
  }
  function cellLayoutOf(item: Cell<TFeatures, TData>, revision: number) {
    void revision
    return getDataGridColumnLayout(item.column, pinningTable)
  }
  function rowPinned(row: RenderRow, revision: number) {
    void revision
    return row.getIsPinned?.() ?? false
  }
  function headerPropsOf(item: Header<TFeatures, TData>, revision: number) {
    void revision
    return getHeaderProps?.(item) ?? {}
  }
  function cellPropsOf(item: Cell<TFeatures, TData>, revision: number) {
    void revision
    return getCellProps?.(item) ?? {}
  }
  function rowPropsOf(row: Row<TFeatures, TData>, revision: number) {
    void revision
    return getRowProps?.(row) ?? {}
  }
  type ResizableHeader = Header<TFeatures, TData> & {
    column: Header<TFeatures, TData>['column'] & {
      getCanResize?: () => boolean
      getIsResizing?: () => boolean
      resetSize?: () => void
    }
    getResizeHandler?: () => (event: MouseEvent | TouchEvent) => void
  }
  const resizable = (value: Header<TFeatures, TData>) => value as ResizableHeader
  const resizeHandle = (node: HTMLElement, initialHeader: Header<TFeatures, TData>) => {
    let currentHeader = initialHeader
    let cleanupPointerSession: (() => void) | undefined
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      event.preventDefault()
      const ownerDocument = node.ownerDocument
      const onPointerMove = (moveEvent: PointerEvent) => {
        ownerDocument.dispatchEvent(new MouseEvent('mousemove', { clientX: moveEvent.clientX }))
      }
      const onPointerUp = (upEvent: PointerEvent) => {
        cleanupPointerSession?.()
        ownerDocument.dispatchEvent(new MouseEvent('mouseup', { clientX: upEvent.clientX }))
      }
      cleanupPointerSession?.()
      cleanupPointerSession = () => {
        ownerDocument.removeEventListener('pointermove', onPointerMove)
        ownerDocument.removeEventListener('pointerup', onPointerUp)
        ownerDocument.removeEventListener('pointercancel', onPointerUp)
        cleanupPointerSession = undefined
      }
      ownerDocument.addEventListener('pointermove', onPointerMove)
      ownerDocument.addEventListener('pointerup', onPointerUp)
      ownerDocument.addEventListener('pointercancel', onPointerUp)
      resizable(currentHeader).getResizeHandler?.()(event as unknown as MouseEvent)
    }
    node.addEventListener('pointerdown', onPointerDown)
    return {
      update(nextHeader: Header<TFeatures, TData>) {
        currentHeader = nextHeader
      },
      destroy() {
        cleanupPointerSession?.()
        node.removeEventListener('pointerdown', onPointerDown)
      },
    }
  }
  function applyHeaderAction(node: HTMLElement, item: Header<TFeatures, TData>) {
    return headerAction?.(node, item)
  }
  function applyCellAction(node: HTMLElement, item: Cell<TFeatures, TData>) {
    return cellAction?.(node, item)
  }
  function applyRowAction(node: HTMLElement, item: Row<TFeatures, TData>) {
    return rowAction?.(node, item)
  }
</script>

<div
  {...rest}
  data-slot="data-grid"
  data-loading={loading || undefined}
  class={cn(dataGridRootClassName({ density, striped, bordered: border }), classes?.root)}
  style={`--data-grid-header-height:var(--data-grid-row-height);${sizingLayout.rootWidth ? `width:${sizingLayout.rootWidth};` : ''}${style ?? ''}`}
>
  <div
    bind:this={viewportElement}
    data-slot="data-grid-viewport"
    class={cn(dataGridViewportClassName, classes?.viewport)}
    style:height={virtual ? `${virtual.height}px` : undefined}
  >
    <table
      class={cn(dataGridTableClassName, classes?.table)}
      style:width={tableWidth === undefined ? '100%' : `${tableWidth}px`}
    >
      {#if tableWidth !== undefined}
        <colgroup>
          {#each columns as column (column.id)}
            <col style:width={columnSizeOf(column, $snapshot.revision) === undefined ? undefined : `${columnSizeOf(column, $snapshot.revision)}px`} />
          {/each}
        </colgroup>
      {/if}
      <thead class={cn(dataGridHeaderClassName, classes?.header)}>
        {#each headerGroups as headerGroup (headerGroup.id)}
          <tr class={cn(dataGridHeaderRowClassName({ bordered: border }), classes?.headerRow)}>
            {#each headerGroup.headers as item, index (item.id)}
              {@const nativeProps = headerPropsOf(item, $snapshot.revision)}
              {@const layout = headerLayoutOf(item, $snapshot.revision)}
              <th
                {...nativeProps}
                use:applyHeaderAction={item}
                colspan={item.colSpan}
                class={cn(
                  dataGridHeaderCellClassName,
                  layout.pinned && dataGridPinnedCellClassName,
                  layout.pinned && dataGridPinnedHeaderCellClassName,
                  layout.pinned === 'start' && dataGridPinnedStartClassName,
                  layout.pinned === 'end' && dataGridPinnedEndClassName,
                  layout.isStartEdge && dataGridPinnedStartEdgeClassName,
                  layout.isEndEdge && dataGridPinnedEndEdgeClassName,
                  !border && headerGroup.headers.slice(index + 1).some(next => !next.isPlaceholder) && dataGridHeaderSeparatorClassName,
                  metaOf(item.column)?.align && dataGridAlignClassName[metaOf(item.column)!.align!],
                  metaOf(item.column)?.headerClassName,
                  classes?.headerCell,
                  nativeProps.class,
                )}
                style={mergedStyle(layout.style, nativeProps.style)}
              >
                {#if !item.isPlaceholder}
                  <div data-slot="data-grid-header-content" class={dataGridHeaderContentClassName}>
                    {#key $snapshot.revision}
                      {#if header}{@render header(item, $snapshot.revision)}{:else}{text(renderTemplate(item.column.columnDef.header, item.getContext(), $snapshot.revision))}{/if}
                    {/key}
                  </div>
                {/if}
                {#if item.colSpan === 1 && resizable(item).column.getCanResize?.()}
                  <button
                    type="button"
                    use:resizeHandle={item}
                    aria-label={`Resize ${item.column.id}`}
                    data-resizing={resizable(item).column.getIsResizing?.() || undefined}
                    class={dataGridResizeHandleClassName}
                    ondblclick={() => resizable(item).column.resetSize?.()}
                  ></button>
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody class={cn(dataGridBodyClassName, classes?.body)}>
        {#if virtual && virtualTop > 0}
          <tr aria-hidden="true"><td colspan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={dataGridVirtualSpacerClassName} style:height={`${virtualTop}px`}></td></tr>
        {/if}
        {#if rows.length}
          {#each rows as row (row.id)}
            {@const nativeRowProps = rowPropsOf(row, $snapshot.revision)}
            {@const rowLayout = rowLayoutOf(row, $snapshot.revision)}
            {@const pinned = rowPinned(row, $snapshot.revision)}
            <tr
              {...nativeRowProps}
              use:applyRowAction={row}
              data-pinned={pinned || undefined}
              data-grouped={isGrouped(row) || undefined}
              class={cn(
                dataGridRowClassName,
                pinned && dataGridPinnedRowClassName,
                pinned === 'top' && dataGridPinnedTopRowClassName,
                pinned === 'bottom' && dataGridPinnedBottomRowClassName,
                rowLayout.edge === 'top' && dataGridPinnedTopEdgeClassName,
                rowLayout.edge === 'bottom' && dataGridPinnedBottomEdgeClassName,
                isGrouped(row) && dataGridGroupedRowClassName,
                classes?.row,
                nativeRowProps.class,
              )}
              style={mergedStyle(rowLayout.style, nativeRowProps.style)}
            >
              {#if $snapshot.revision >= 0 && isGrouped(row) && groupRow}
                <td colspan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={cn(dataGridCellClassName, classes?.cell)}>
                  {#key $snapshot.revision}{@render groupRow(row, $snapshot.revision)}{/key}
                </td>
              {:else}
                {#each cellsOf(row, $snapshot.revision) as item (item.id)}
                  {@const nativeCellProps = cellPropsOf(item, $snapshot.revision)}
                  {@const cellLayout = cellLayoutOf(item, $snapshot.revision)}
                  <td
                    {...nativeCellProps}
                    use:applyCellAction={item}
                    class={cn(
                      dataGridCellClassName,
                      cellLayout.pinned && dataGridPinnedCellClassName,
                      cellLayout.pinned === 'start' && dataGridPinnedStartClassName,
                      cellLayout.pinned === 'end' && dataGridPinnedEndClassName,
                      cellLayout.isStartEdge && dataGridPinnedStartEdgeClassName,
                      cellLayout.isEndEdge && dataGridPinnedEndEdgeClassName,
                      metaOf(item.column)?.align && dataGridAlignClassName[metaOf(item.column)!.align!],
                      metaOf(item.column)?.cellClassName,
                      classes?.cell,
                      nativeCellProps.class,
                    )}
                    style={mergedStyle(cellLayout.style, nativeCellProps.style)}
                  >
                    <div class={dataGridCellContentClassName}>
                      {#key $snapshot.revision}
                        {#if cell}{@render cell(item, $snapshot.revision)}{:else}{text(renderTemplate(item.column.columnDef.cell, item.getContext(), $snapshot.revision) ?? item.getValue())}{/if}
                      {/key}
                    </div>
                  </td>
                {/each}
              {/if}
            </tr>
            {#if $snapshot.revision >= 0 && isExpanded(row) && subComponent}
              <tr class={dataGridRowClassName}><td colspan={getDataGridVisibleLeafColumnCount(renderTable)}>{#key $snapshot.revision}{@render subComponent(row, $snapshot.revision)}{/key}</td></tr>
            {/if}
          {/each}
        {:else}
          <tr><td colspan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={cn(dataGridEmptyClassName, classes?.empty)}>{emptyContent}</td></tr>
        {/if}
        {#if virtual && virtualBottom > 0}
          <tr aria-hidden="true"><td colspan={Math.max(1, getDataGridVisibleLeafColumnCount(renderTable))} class={dataGridVirtualSpacerClassName} style:height={`${virtualBottom}px`}></td></tr>
        {/if}
      </tbody>
    </table>
  </div>
  {#if loading}<div class={cn(dataGridLoadingClassName, classes?.loading)}>{loadingContent}</div>{/if}
</div>
