<script setup lang="ts" generic="TFeatures extends TableFeatures, TData extends RowData">
import { dataGridSortButtonClassName } from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
import { computed, inject } from 'vue'

import { ChevronDownIcon, ChevronUpIcon } from '../../icon/chevron'
import Button from '../../ui/button/button.vue'
import { dataGridRevisionKey } from './data-grid-context'

interface SortableColumn {
  getCanSort(): boolean
  getIsSorted(): false | 'asc' | 'desc'
  getSortIndex(): number
  getToggleSortingHandler(): ((event: MouseEvent) => void) | undefined
}

const props = defineProps<{ column: Column<TFeatures, TData>; class?: string }>()
const column = props.column as unknown as SortableColumn
const revision = inject(dataGridRevisionKey)
const direction = computed(() => {
  void revision?.value
  return column.getIsSorted()
})
const sortIndex = computed(() => {
  void revision?.value
  return column.getSortIndex()
})
</script>

<template>
    <Button
      type="button"
      variant="ghost"
      :disabled="!column.getCanSort()"
    :aria-pressed="Boolean(direction)"
    :class="cn(dataGridSortButtonClassName, props.class)"
    @click="column.getToggleSortingHandler()?.($event)"
  >
    <span><slot /></span>
    <span class="inline-flex items-center" aria-hidden>
      <ChevronUpIcon v-if="direction === 'asc'" class="size-3.5" />
      <ChevronDownIcon v-else-if="direction === 'desc'" class="size-3.5" />
      <span v-else class="relative inline-block size-3.5"><ChevronUpIcon class="absolute inset-x-0 top-0 size-3" /><ChevronDownIcon class="absolute inset-x-0 bottom-0 size-3" /></span>
      <sup v-if="direction && sortIndex >= 0">{{ sortIndex + 1 }}</sup>
    </span>
  </Button>
</template>
