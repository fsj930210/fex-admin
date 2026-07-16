<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import { dataGridInputClassName } from '@fex/components-styles/data-grid'
import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
import { Input } from '../input/input'
interface FilterableColumn {
  getFilterValue(): unknown
  setFilterValue(value: unknown): void
}
const props = defineProps<{ column: Column<TFeatures, TData>; placeholder?: string }>()
const column = props.column as unknown as FilterableColumn
</script>
<template>
  <Input
    :value="String(column.getFilterValue() ?? '')"
    :placeholder="props.placeholder"
    :class="dataGridInputClassName"
    @input="column.setFilterValue(($event.target as HTMLInputElement).value)"
  />
</template>
