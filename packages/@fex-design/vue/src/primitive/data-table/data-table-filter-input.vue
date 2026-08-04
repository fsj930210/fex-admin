<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import { dataTableInputRootClassName } from '@fex-design/styles/data-table'
import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
import { InputControl, InputRoot } from '../input/input'
interface FilterableColumn {
  getFilterValue(): unknown
  setFilterValue(value: unknown): void
}
const props = defineProps<{ column: Column<TFeatures, TData>; placeholder?: string }>()
const column = props.column as unknown as FilterableColumn
</script>
<template>
  <InputRoot :value="String(column.getFilterValue() ?? '')" :class="dataTableInputRootClassName"
    ><InputControl
      :placeholder="props.placeholder"
      @input="column.setFilterValue(($event.target as HTMLInputElement).value)"
  /></InputRoot>
</template>
