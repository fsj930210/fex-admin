<script setup lang="ts">
import type { CalendarDate } from '@fex/components-core/calendar'
import DatePickerPanel from './date-picker-panel.vue'

defineProps<{ class?: string; panelViewDate?: CalendarDate }>()
</script>

<template>
  <DatePickerPanel v-if="$slots.default" range :class="class" :panel-view-date="panelViewDate">
    <slot />
  </DatePickerPanel>
  <DatePickerPanel v-else range :class="class" :panel-view-date="panelViewDate" />
</template>
