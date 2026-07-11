<script setup lang="ts">
import { addDate, subtractDate } from '@fex/components-core/calendar'
import { useCalendarContext } from './context'

const props = defineProps<{
  action:
    | 'previous-year'
    | 'previous-month'
    | 'next-month'
    | 'next-year'
    | 'previous-panel'
    | 'next-panel'
}>()

const context = useCalendarContext('CalendarNavigationButton')

function runAction() {
  if (props.action === 'previous-year')
    context.setViewDate(subtractDate(context.viewDate.value, { years: 1 }))
  if (props.action === 'previous-month')
    context.setViewDate(subtractDate(context.viewDate.value, { months: 1 }))
  if (props.action === 'next-month')
    context.setViewDate(addDate(context.viewDate.value, { months: 1 }))
  if (props.action === 'next-year')
    context.setViewDate(addDate(context.viewDate.value, { years: 1 }))
  if (props.action === 'previous-panel') {
    context.setViewDate(
      context.panel.value === 'date'
        ? subtractDate(context.viewDate.value, { months: 1 })
        : subtractDate(context.viewDate.value, { years: 1 }),
    )
  }
  if (props.action === 'next-panel') {
    context.setViewDate(
      context.panel.value === 'date'
        ? addDate(context.viewDate.value, { months: 1 })
        : addDate(context.viewDate.value, { years: 1 }),
    )
  }
}
</script>

<template>
  <button
    type="button"
    data-slot="calendar-navigation-button"
    :data-action="action"
    @click="runAction"
  >
    <slot />
  </button>
</template>
