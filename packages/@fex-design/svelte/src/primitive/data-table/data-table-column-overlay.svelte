<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
  import { getDataTableColumnSize, getDataTableRenderedCells } from '@fex-design/core/data-table/layout'
  import {
    dataTableBodyClassName,
    dataTableCellClassName,
    dataTableCellContentClassName,
    dataTableHeaderCellClassName,
    dataTableHeaderClassName,
    dataTableHeaderContentClassName,
    dataTableHeaderRowClassName,
    dataTableRootClassName,
    dataTableRowClassName,
    dataTableClassName,
  } from '@fex-design/styles/data-table'
  import type { Cell, Header, RowData, TableFeatures } from '@tanstack/table-core'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { SvelteDataTable } from '../../stores/create-data-table'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    table: SvelteDataTable<TFeatures, TData>
    header: Header<TFeatures, TData>
    density?: 'compact' | 'default' | 'comfortable'
    headerContent?: Snippet<[Header<TFeatures, TData>, number]>
    cellContent?: Snippet<[Cell<TFeatures, TData>, number]>
  }

  let { table, header, density = 'default', headerContent, cellContent, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- the table controller is intentionally stable for an active overlay.
  const snapshot = table.dataTableSnapshot
  const rows = $derived.by(() => {
    void $snapshot
    return table.getRowModel().rows
  })
  const cellFor = (row: (typeof rows)[number]) =>
    getDataTableRenderedCells(row).find(item => item.column.id === header.column.id)
  const text = (value: unknown) => value === undefined || value === null ? '' : String(value)
  const renderTemplate = (template: unknown, context: unknown) =>
    typeof template === 'function' ? template(context) : template
</script>

<div data-slot="data-table-column-overlay" class={dataTableRootClassName({ density })} {...rest}>
  <table class={dataTableClassName} style:width="100%">
    <colgroup><col style:width={`${getDataTableColumnSize(header.column)}px`} /></colgroup>
    <thead class={dataTableHeaderClassName}>
      <tr class={dataTableHeaderRowClassName()}>
        <th class={dataTableHeaderCellClassName}>
          <div data-slot="data-table-header-content" class={dataTableHeaderContentClassName}>
            {#if headerContent}{@render headerContent(header, $snapshot.revision)}{:else}{text(renderTemplate(header.column.columnDef.header, header.getContext()))}{/if}
          </div>
        </th>
      </tr>
    </thead>
    <tbody class={dataTableBodyClassName}>
      {#each rows as row (row.id)}
        {@const cell = cellFor(row)}
        {#if cell}
          <tr class={dataTableRowClassName}>
            <td class={dataTableCellClassName}>
              <div class={dataTableCellContentClassName}>
                {#if cellContent}{@render cellContent(cell, $snapshot.revision)}{:else}{text(renderTemplate(cell.column.columnDef.cell, cell.getContext()) ?? cell.getValue())}{/if}
              </div>
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
