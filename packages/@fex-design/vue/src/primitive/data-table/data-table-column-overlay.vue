<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import {
  getDataTableColumnSize,
  getDataTableRenderedCells,
} from '@fex-design/core/data-table/layout'
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
import type { Header, RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { CSSProperties } from 'vue'
import { DataTableTemplate } from './data-table-template'
const props = withDefaults(
  defineProps<{
    table: Table<TFeatures, TData>
    header: Header<TFeatures, TData>
    style: CSSProperties
    density?: 'compact' | 'default' | 'comfortable'
  }>(),
  { density: 'default' },
)
const rows = () => props.table.getRowModel().rows
const cell = (row: ReturnType<typeof rows>[number]) =>
  getDataTableRenderedCells(row).find((item) => item.column.id === props.header.column.id)
</script>
<template>
  <div
    data-slot="data-table-column-overlay"
    :class="dataTableRootClassName({ density: props.density })"
    :style="{ ...props.style, height: 'auto' }"
  >
    <table :class="dataTableClassName" style="width: 100%">
      <colgroup>
        <col :style="{ width: `${getDataTableColumnSize(props.header.column)}px` }" />
      </colgroup>
      <thead :class="dataTableHeaderClassName">
        <tr :class="dataTableHeaderRowClassName()">
          <th :class="dataTableHeaderCellClassName">
            <div :class="dataTableHeaderContentClassName">
              <DataTableTemplate
                :template="props.header.column.columnDef.header"
                :context="props.header.getContext()"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody :class="dataTableBodyClassName">
        <tr v-for="row in rows()" :key="row.id" :class="dataTableRowClassName">
          <td v-if="cell(row)" :class="dataTableCellClassName">
            <div :class="dataTableCellContentClassName">
              <DataTableTemplate
                :template="cell(row)!.column.columnDef.cell"
                :context="cell(row)!.getContext()"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
