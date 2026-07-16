<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
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
import type { Header, RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { CSSProperties } from 'vue'
import { DataGridTemplate } from './data-grid-template'
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
  getDataGridRenderedCells(row).find((item) => item.column.id === props.header.column.id)
</script>
<template>
  <div
    data-slot="data-grid-column-overlay"
    :class="dataGridRootClassName({ density: props.density })"
    :style="{ ...props.style, height: 'auto' }"
  >
    <table :class="dataGridTableClassName" style="width: 100%">
      <colgroup>
        <col :style="{ width: `${getDataGridColumnSize(props.header.column)}px` }" />
      </colgroup>
      <thead :class="dataGridHeaderClassName">
        <tr :class="dataGridHeaderRowClassName()">
          <th :class="dataGridHeaderCellClassName">
            <div :class="dataGridHeaderContentClassName">
              <DataGridTemplate
                :template="props.header.column.columnDef.header"
                :context="props.header.getContext()"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody :class="dataGridBodyClassName">
        <tr v-for="row in rows()" :key="row.id" :class="dataGridRowClassName">
          <td v-if="cell(row)" :class="dataGridCellClassName">
            <div :class="dataGridCellContentClassName">
              <DataGridTemplate
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
