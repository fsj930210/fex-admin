<script setup lang="ts">
import { useCalendarContext } from './context'

const context = useCalendarContext('CalendarGrid')
</script>

<template>
  <div data-slot="calendar-grid">
    <div
      v-for="row in context.grid.value.rows"
      :key="row.map((cell) => cell.key).join('|')"
      data-slot="calendar-row"
    >
      <slot v-for="cell in row" :key="cell.key" :cell="cell" />
    </div>
  </div>
</template>
