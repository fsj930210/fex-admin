<script setup lang="ts">
import type { CalendarValue } from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerMultipleTagsClassName,
  datePickerTagClassName,
  datePickerTagOverflowClassName,
  datePickerTagRemoveClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { CloseIcon } from '../../icon/close'
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
    <span
      v-for="value in visibleValues"
      :key="label(value)"
      data-slot="date-picker-tag"
      :class="datePickerTagClassName"
    >
      {{ label(value) }}
      <button
        type="button"
        :aria-label="`移除 ${label(value)}`"
        :class="datePickerTagRemoveClassName"
        @pointerdown.stop
        @click="remove(value, $event)"
      >
        <CloseIcon />
      </button>
    </span>
    <span
      v-if="overflowCount > 0"
      data-slot="date-picker-tag-overflow"
      :class="datePickerTagOverflowClassName"
      >+{{ overflowCount }}</span
    >
  </div>
</template>
