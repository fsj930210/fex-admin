<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import {
  dataGridVisibilityItemClassName,
  dataGridVisibilityPanelClassName,
} from '@fex/components-styles/data-grid'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import { computed } from 'vue'

import type { VueDataGridTable } from '../../composables/use-data-grid-table'
import DataGridCheckbox from './data-grid-checkbox.vue'

interface VisibilityColumn {
  id: string
  getCanHide(): boolean
  getIsVisible(): boolean
  toggleVisibility(value: boolean): void
}
interface VisibilityTable {
  getAllLeafColumns(): readonly VisibilityColumn[]
}

const props = defineProps<{ table: VueDataGridTable<TFeatures, TData> }>()
const visibilityTable = props.table as unknown as VisibilityTable
const columns = computed(() => {
  void props.table.dataGridSnapshot.value.revision
  return visibilityTable.getAllLeafColumns().filter((item) => item.getCanHide())
})
const checked = (column: VisibilityColumn) => {
  void props.table.dataGridSnapshot.value.revision
  return column.getIsVisible()
}
</script>

<template>
  <div :class="dataGridVisibilityPanelClassName">
    <label v-for="column in columns" :key="column.id" :class="dataGridVisibilityItemClassName">
      <DataGridCheckbox
        :checked="checked(column)"
        @change="column.toggleVisibility($event === true)"
      />
      <span>{{ column.id }}</span>
    </label>
  </div>
</template>
