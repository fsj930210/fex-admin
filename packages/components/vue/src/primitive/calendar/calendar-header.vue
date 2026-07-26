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

function previous() {
  const panel = context.panel.value
  context.setViewDate(subtractDate(context.viewDate.value, panel === 'date' ? { months: 1 } : panel === 'year' || panel === 'decade' ? { years: 10 } : { years: 1 }))
}

function next() {
  const panel = context.panel.value
  context.setViewDate(addDate(context.viewDate.value, panel === 'date' ? { months: 1 } : panel === 'year' || panel === 'decade' ? { years: 10 } : { years: 1 }))
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
      :previous="previous"
      :next="next"
      :set-panel="context.setPanel"
    />
  </div>
</template>
