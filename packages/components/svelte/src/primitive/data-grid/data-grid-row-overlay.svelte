<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
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
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { SvelteDataGridTable } from '../../stores/create-data-grid-table'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    table: SvelteDataGridTable<TFeatures, TData>
    row: Row<TFeatures, TData>
    density?: 'compact' | 'default' | 'comfortable'
    cellContent?: Snippet<[Cell<TFeatures, TData>, number]>
  }

  let { table, row, density = 'default', cellContent, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- the table controller is intentionally stable for an active overlay.
  const snapshot = table.dataGridSnapshot
  // svelte-ignore state_referenced_locally -- the table controller is intentionally stable for an active overlay.
  const renderTable = table as unknown as DataGridRenderingTableSource
  const sizing = $derived.by(() => {
    void $snapshot
    return getDataGridSizingLayout(table)
  })
  const columns = $derived.by(() => {
    void $snapshot
    return getDataGridVisibleLeafColumns(renderTable)
  })
  const cells = $derived.by(() => {
    void $snapshot
    return getDataGridRenderedCells(row)
  })
  const text = (value: unknown) => value === undefined || value === null ? '' : String(value)
  const renderTemplate = (template: unknown, context: unknown) =>
    typeof template === 'function' ? template(context) : template
</script>

<div data-slot="data-grid-row-overlay" class={dataGridRootClassName({ density })} {...rest}>
  <table class={dataGridTableClassName} style:width={sizing.tableWidth === undefined ? '100%' : `${sizing.tableWidth}px`}>
    <colgroup>{#each columns as column (column.id)}<col style:width={`${column.getSize?.() ?? 150}px`} />{/each}</colgroup>
    <tbody class={dataGridBodyClassName}>
      <tr class={dataGridRowClassName}>
        {#each cells as cell (cell.id)}
          <td class={dataGridCellClassName}>
            <div class={dataGridCellContentClassName}>
              {#if cellContent}{@render cellContent(cell, $snapshot.revision)}{:else}{text(renderTemplate(cell.column.columnDef.cell, cell.getContext()) ?? cell.getValue())}{/if}
            </div>
          </td>
        {/each}
      </tr>
    </tbody>
  </table>
</div>
