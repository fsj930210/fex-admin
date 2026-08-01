<script setup lang="ts">
import { getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { datePickerPanelsClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { useRangePickerContext } from './context'
import RangePickerPanel from './range-picker-panel.vue'

const props = defineProps<{ class?: string; panelCount?: 1 | 2 }>()
const context = useRangePickerContext('RangePickerPanelGroup')
const dates = computed(() => getRangePanelViewDates(context.viewDate.value, context.panel.value))
const visibleDates = computed(() => (props.panelCount === 1 ? [dates.value[0]] : dates.value))
</script>

<template>
  <div
    :class="cn(datePickerPanelsClassName, props.class)"
    @mouseleave="context.setHoverValue(null)"
  >
    <slot>
      <RangePickerPanel
        v-for="(date, index) in visibleDates"
        :key="`${date.year}-${date.month}-${index}`"
        :panel-view-date="date"
      />
    </slot>
  </div>
</template>
