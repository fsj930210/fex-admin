<script setup lang="ts">
import type { CalendarValue } from '@fex-design/core/calendar'
import { formatDatePickerValue } from '@fex-design/core/date-picker/value'
import {
  datePickerMultipleTagsClassName,
} from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import Tag from '../tag/tag.vue'
import { useDatePickerContext } from './context'

const props = withDefaults(defineProps<{ class?: string; maxTagCount?: number }>(), {
  maxTagCount: 1,
})
const context = useDatePickerContext('DatePickerTags')
const className = computed(() => cn(datePickerMultipleTagsClassName, props.class))
const visibleValues = computed(() => context.calendarValues.value.slice(0, props.maxTagCount))
const overflowCount = computed(() =>
  Math.max(context.calendarValues.value.length - props.maxTagCount, 0),
)
function label(value: CalendarValue) {
  return formatDatePickerValue(value, context)
}
function remove(value: CalendarValue, event: Event) {
  event.preventDefault()
  event.stopPropagation()
  context.select(value)
}
</script>

<template>
  <div data-slot="date-picker-tags" :class="className">
    <Tag
      v-for="value in visibleValues"
      :key="label(value)"
      data-slot="date-picker-tag"
      size="sm"
      closable
      @pointerdown.stop
      @close="remove(value, $event)"
    >
      {{ label(value) }}
    </Tag>
    <Tag
      v-if="overflowCount > 0"
      data-slot="date-picker-tag-overflow"
      size="sm"
      >+{{ overflowCount }}</Tag
    >
  </div>
</template>
