<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
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
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { SvelteDataGridTable } from '../../stores/create-data-grid-table'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    table: SvelteDataGridTable<TFeatures, TData>
    header: Header<TFeatures, TData>
    density?: 'compact' | 'default' | 'comfortable'
    headerContent?: Snippet<[Header<TFeatures, TData>, number]>
    cellContent?: Snippet<[Cell<TFeatures, TData>, number]>
  }

  let { table, header, density = 'default', headerContent, cellContent, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- the table controller is intentionally stable for an active overlay.
  const snapshot = table.dataGridSnapshot
  const rows = $derived.by(() => {
    void $snapshot
    return table.getRowModel().rows
  })
  const cellFor = (row: (typeof rows)[number]) =>
    getDataGridRenderedCells(row).find(item => item.column.id === header.column.id)
  const text = (value: unknown) => value === undefined || value === null ? '' : String(value)
  const renderTemplate = (template: unknown, context: unknown) =>
    typeof template === 'function' ? template(context) : template
</script>

<div data-slot="data-grid-column-overlay" class={dataGridRootClassName({ density })} {...rest}>
  <table class={dataGridTableClassName} style:width="100%">
    <colgroup><col style:width={`${getDataGridColumnSize(header.column)}px`} /></colgroup>
    <thead class={dataGridHeaderClassName}>
      <tr class={dataGridHeaderRowClassName()}>
        <th class={dataGridHeaderCellClassName}>
          <div data-slot="data-grid-header-content" class={dataGridHeaderContentClassName}>
            {#if headerContent}{@render headerContent(header, $snapshot.revision)}{:else}{text(renderTemplate(header.column.columnDef.header, header.getContext()))}{/if}
          </div>
        </th>
      </tr>
    </thead>
    <tbody class={dataGridBodyClassName}>
      {#each rows as row (row.id)}
        {@const cell = cellFor(row)}
        {#if cell}
          <tr class={dataGridRowClassName}>
            <td class={dataGridCellClassName}>
              <div class={dataGridCellContentClassName}>
                {#if cellContent}{@render cellContent(cell, $snapshot.revision)}{:else}{text(renderTemplate(cell.column.columnDef.cell, cell.getContext()) ?? cell.getValue())}{/if}
              </div>
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
