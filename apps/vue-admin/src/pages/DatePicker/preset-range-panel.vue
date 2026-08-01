<script setup lang="ts">
import {
  getCalendarToday,
  type CalendarDate,
  type CalendarRange,
} from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import { endOfDate } from '@fex/components-core/date/utils'
import {
  DatePickerPreset,
  RangePickerPanelGroup,
  useRangePickerContext,
} from '@fex/components-vue/primitive/date-picker'
import { computed } from 'vue'

const emit = defineEmits<{ select: [value: CalendarRange] }>()
const today = getCalendarToday()
const rangePicker = useRangePickerContext('PresetRangePanel')
const presets: Array<[string, CalendarRange]> = [
  ['最近 7 天', lastDays(7)],
  ['最近 30 天', lastDays(30)],
  ['本月', thisMonth()],
  ['上月', previousMonth()],
]
const activeKey = computed(() => getRangeKey(rangePicker.rangeValue.value))

function select(value: CalendarRange) {
  emit('select', value)
  if (value.start) rangePicker.setViewDate(value.start as CalendarDate)
}

function lastDays(days: number): CalendarRange {
  return { start: today.subtract({ days: days - 1 }), end: today }
}

function thisMonth(): CalendarRange {
  return { start: today.with({ day: 1 }), end: endOfDate(today, 'month') }
}

function previousMonth(): CalendarRange {
  const end = today.with({ day: 1 }).subtract({ days: 1 })
  return { start: end.with({ day: 1 }), end }
}

function getRangeKey(value: CalendarRange) {
  return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : ''}~${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : ''}`
}
</script>

<template>
  <div class="flex">
    <div class="flex w-32 shrink-0 flex-col gap-1 border-r border-border p-2">
      <DatePickerPreset
        v-for="[label, value] in presets"
        :key="label"
        :data-selected="activeKey === getRangeKey(value)"
        class="justify-start"
        @click="select(value)"
      >
        {{ label }}
      </DatePickerPreset>
    </div>
    <RangePickerPanelGroup />
  </div>
</template>
