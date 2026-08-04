<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import {
  dataTableVisibilityItemClassName,
  dataTableVisibilityPanelClassName,
} from '@fex-design/styles/data-table'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import { computed } from 'vue'

import type { VueDataTable } from '../../composables/use-data-table'
import DataTableCheckbox from './data-table-checkbox.vue'

interface VisibilityColumn {
  id: string
  getCanHide(): boolean
  getIsVisible(): boolean
  toggleVisibility(value: boolean): void
}
interface VisibilityTable {
  getAllLeafColumns(): readonly VisibilityColumn[]
}

const props = defineProps<{ table: VueDataTable<TFeatures, TData> }>()
const visibilityTable = props.table as unknown as VisibilityTable
const columns = computed(() => {
  void props.table.dataTableSnapshot.value.revision
  return visibilityTable.getAllLeafColumns().filter((item) => item.getCanHide())
})
const checked = (column: VisibilityColumn) => {
  void props.table.dataTableSnapshot.value.revision
  return column.getIsVisible()
}
</script>

<template>
  <div :class="dataTableVisibilityPanelClassName">
    <label v-for="column in columns" :key="column.id" :class="dataTableVisibilityItemClassName">
      <DataTableCheckbox
        :checked="checked(column)"
        @change="column.toggleVisibility($event === true)"
      />
      <span>{{ column.id }}</span>
    </label>
  </div>
</template>
