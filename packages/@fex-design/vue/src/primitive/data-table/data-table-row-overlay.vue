<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import {
  getDataTableRenderedCells,
  getDataTableVisibleLeafColumns,
  type DataTableRenderingTableSource,
} from '@fex-design/core/data-table/layout'
import {
  dataTableCellClassName,
  dataTableCellContentClassName,
  dataTableRootClassName,
  dataTableRowClassName,
  dataTableClassName,
} from '@fex-design/styles/data-table'
import type { Row, RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { CSSProperties } from 'vue'
import { DataTableTemplate } from './data-table-template'
const props = withDefaults(
  defineProps<{
    table: Table<TFeatures, TData>
    row: Row<TFeatures, TData>
    style: CSSProperties
    density?: 'compact' | 'default' | 'comfortable'
  }>(),
  { density: 'default' },
)
const source = props.table as unknown as DataTableRenderingTableSource
const columns = () => getDataTableVisibleLeafColumns(source)
</script>
<template>
  <div
    data-slot="data-table-row-overlay"
    :class="dataTableRootClassName({ density: props.density })"
    :style="props.style"
  >
    <table :class="dataTableClassName">
      <colgroup>
        <col
          v-for="column in columns()"
          :key="column.id"
          :style="{
            width: column.getSize?.() === undefined ? undefined : `${column.getSize?.()}px`,
          }"
        />
      </colgroup>
      <tbody>
        <tr :class="dataTableRowClassName">
          <td
            v-for="cell in getDataTableRenderedCells(props.row)"
            :key="cell.id"
            :class="dataTableCellClassName"
          >
            <div :class="dataTableCellContentClassName">
              <DataTableTemplate
                :template="cell.column.columnDef.cell"
                :context="cell.getContext()"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
