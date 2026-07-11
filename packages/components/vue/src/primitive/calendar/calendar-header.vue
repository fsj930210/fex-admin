<script setup lang="ts">
import { addDate, subtractDate } from '@fex/components-core/calendar'
import { useCalendarContext } from './context'

const context = useCalendarContext('CalendarHeader')

function previousYear() {
  context.setViewDate(subtractDate(context.viewDate.value, { years: 1 }))
}

function previousMonth() {
  context.setViewDate(subtractDate(context.viewDate.value, { months: 1 }))
}

function nextMonth() {
  context.setViewDate(addDate(context.viewDate.value, { months: 1 }))
}

function nextYear() {
  context.setViewDate(addDate(context.viewDate.value, { years: 1 }))
}
</script>

<template>
  <div data-slot="calendar-header">
    <slot
      :view-date="context.viewDate.value"
      :panel="context.panel.value"
      :granularity="context.granularity.value"
      :previous-year="previousYear"
      :previous-month="previousMonth"
      :next-month="nextMonth"
      :next-year="nextYear"
      :set-panel="context.setPanel"
    />
  </div>
</template>
