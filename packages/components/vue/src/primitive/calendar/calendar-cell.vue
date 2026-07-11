<script setup lang="ts">
import type { CalendarCell } from '@fex/components-core/calendar'
import { useCalendarContext } from './context'

const props = defineProps<{ cell: CalendarCell }>()
const context = useCalendarContext('CalendarCell')
</script>

<template>
  <button
    type="button"
    data-slot="calendar-cell"
    :data-today="cell.state.today ? 'true' : undefined"
    :data-outside="cell.state.outside ? 'true' : undefined"
    :data-selected="cell.state.selected ? 'true' : undefined"
    :data-disabled="cell.state.disabled ? 'true' : undefined"
    :disabled="cell.state.disabled"
    @click="context.selectCell(props.cell)"
  >
    <slot :cell="cell">{{ cell.label }}</slot>
  </button>
</template>
