<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
  import { getDataTableRenderedCells, getDataTableSizingLayout, getDataTableVisibleLeafColumns, type DataTableRenderingTableSource } from '@fex-design/core/data-table/layout'
  import {
    dataTableBodyClassName,
    dataTableCellClassName,
    dataTableCellContentClassName,
    dataTableRootClassName,
    dataTableRowClassName,
    dataTableClassName,
  } from '@fex-design/styles/data-table'
  import type { Cell, Row, RowData, TableFeatures } from '@tanstack/table-core'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { SvelteDataTable } from '../../stores/create-data-table'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    table: SvelteDataTable<TFeatures, TData>
    row: Row<TFeatures, TData>
    density?: 'compact' | 'default' | 'comfortable'
    cellContent?: Snippet<[Cell<TFeatures, TData>, number]>
  }

  let { table, row, density = 'default', cellContent, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- the table controller is intentionally stable for an active overlay.
  const snapshot = table.dataTableSnapshot
  // svelte-ignore state_referenced_locally -- the table controller is intentionally stable for an active overlay.
  const renderTable = table as unknown as DataTableRenderingTableSource
  const sizing = $derived.by(() => {
    void $snapshot
    return getDataTableSizingLayout(table)
  })
  const columns = $derived.by(() => {
    void $snapshot
    return getDataTableVisibleLeafColumns(renderTable)
  })
  const cells = $derived.by(() => {
    void $snapshot
    return getDataTableRenderedCells(row)
  })
  const text = (value: unknown) => value === undefined || value === null ? '' : String(value)
  const renderTemplate = (template: unknown, context: unknown) =>
    typeof template === 'function' ? template(context) : template
</script>

<div data-slot="data-table-row-overlay" class={dataTableRootClassName({ density })} {...rest}>
  <table class={dataTableClassName} style:width={sizing.tableWidth === undefined ? '100%' : `${sizing.tableWidth}px`}>
    <colgroup>{#each columns as column (column.id)}<col style:width={`${column.getSize?.() ?? 150}px`} />{/each}</colgroup>
    <tbody class={dataTableBodyClassName}>
      <tr class={dataTableRowClassName}>
        {#each cells as cell (cell.id)}
          <td class={dataTableCellClassName}>
            <div class={dataTableCellContentClassName}>
              {#if cellContent}{@render cellContent(cell, $snapshot.revision)}{:else}{text(renderTemplate(cell.column.columnDef.cell, cell.getContext()) ?? cell.getValue())}{/if}
            </div>
          </td>
        {/each}
      </tr>
    </tbody>
  </table>
</div>
