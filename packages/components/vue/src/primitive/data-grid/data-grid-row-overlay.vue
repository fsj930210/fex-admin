<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import {
  getDataGridRenderedCells,
  getDataGridVisibleLeafColumns,
  type DataGridRenderingTableSource,
} from '@fex/components-core/data-grid/layout'
import {
  dataGridCellClassName,
  dataGridCellContentClassName,
  dataGridRootClassName,
  dataGridRowClassName,
  dataGridTableClassName,
} from '@fex/components-styles/data-grid'
import type { Row, RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { CSSProperties } from 'vue'
import { DataGridTemplate } from './data-grid-template'
const props = withDefaults(
  defineProps<{
    table: Table<TFeatures, TData>
    row: Row<TFeatures, TData>
    style: CSSProperties
    density?: 'compact' | 'default' | 'comfortable'
  }>(),
  { density: 'default' },
)
const source = props.table as unknown as DataGridRenderingTableSource
const columns = () => getDataGridVisibleLeafColumns(source)
</script>
<template>
  <div
    data-slot="data-grid-row-overlay"
    :class="dataGridRootClassName({ density: props.density })"
    :style="props.style"
  >
    <table :class="dataGridTableClassName">
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
        <tr :class="dataGridRowClassName">
          <td
            v-for="cell in getDataGridRenderedCells(props.row)"
            :key="cell.id"
            :class="dataGridCellClassName"
          >
            <div :class="dataGridCellContentClassName">
              <DataGridTemplate
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
