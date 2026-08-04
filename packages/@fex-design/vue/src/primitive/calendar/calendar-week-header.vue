<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarContext } from './context'

const props = withDefaults(defineProps<{ labels?: readonly string[] }>(), {
  labels: () => ['日', '一', '二', '三', '四', '五', '六'],
})

const context = useCalendarContext('CalendarWeekHeader')

const orderedLabels = computed(() =>
  props.labels.map((_, index) => props.labels[(index + context.weekStartsOn.value) % 7] ?? ''),
)
</script>

<template>
  <div data-slot="calendar-week-header">
    <div v-for="label in orderedLabels" :key="label" data-slot="calendar-week-head">
      {{ label }}
    </div>
  </div>
</template>
