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
    :data-range-start="cell.granularity !== 'week' && cell.state.rangeStart ? 'true' : undefined"
    :data-range-end="cell.granularity !== 'week' && cell.state.rangeEnd ? 'true' : undefined"
    :data-in-range="cell.granularity !== 'week' && cell.state.inRange ? 'true' : undefined"
    :data-week-selected="cell.granularity === 'week' && cell.state.selected ? 'true' : undefined"
    :data-week-hover="cell.granularity === 'week' && context.hoveredRowIndex.value === cell.rowIndex ? 'true' : undefined"
    :data-week-row-start="cell.granularity === 'week' && cell.columnIndex === 0 ? 'true' : undefined"
    :data-week-row-end="cell.granularity === 'week' && cell.columnIndex === 6 ? 'true' : undefined"
    :data-week-start="cell.granularity === 'week' && cell.state.selected && cell.columnIndex === 0 ? 'true' : undefined"
    :data-week-end="cell.granularity === 'week' && cell.state.selected && cell.columnIndex === 6 ? 'true' : undefined"
    :data-week-range-start="cell.granularity === 'week' && cell.state.rangeStart && !cell.state.rangeEnd ? 'true' : undefined"
    :data-week-range-end="cell.granularity === 'week' && cell.state.rangeEnd && !cell.state.rangeStart ? 'true' : undefined"
    :data-week-range-single="cell.granularity === 'week' && cell.state.rangeStart && cell.state.rangeEnd ? 'true' : undefined"
    :data-week-in-range="cell.granularity === 'week' && cell.state.inRange ? 'true' : undefined"
    :data-week-range="cell.granularity === 'week' && (cell.state.rangeStart || cell.state.rangeEnd || cell.state.inRange) ? 'true' : undefined"
    :data-disabled="cell.state.disabled ? 'true' : undefined"
    :disabled="cell.state.disabled"
    @click="context.selectCell(props.cell)"
    @mouseenter="context.hoverCell(props.cell)"
  >
    <slot :cell="cell">{{ cell.label }}</slot>
  </button>
</template>
