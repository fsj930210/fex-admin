<script setup lang="ts">
import { getCalendarToday } from '@fex-design/core/calendar'
import { getDefaultPanelByPicker } from '@fex-design/core/date-picker/panel'
import { datePickerFooterClassName } from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { computed, inject } from 'vue'
import Button from '../button/button.vue'
import { datePickerContextKey, rangePickerContextKey } from './context'

const props = defineProps<{ class?: string }>()
const datePicker = inject(datePickerContextKey, null)
const rangePicker = inject(rangePickerContextKey, null)
const owner = computed(() => {
  const context = datePicker ?? rangePicker
  if (!context)
    throw new Error('DatePickerFooter must be used within DatePickerRoot or RangePickerRoot')
  return context
})
defineExpose({ owner })
</script>

<template>
  <div data-slot="date-picker-footer" :class="cn(datePickerFooterClassName, props.class)">
    <slot
      :close="owner.close"
      :clear="owner.clear"
      :confirm="owner.confirm"
      :cancel="owner.cancel"
    />
  </div>
</template>

<script lang="ts">
export function createDatePickerFooterActions() {
  const datePicker = inject(datePickerContextKey, null)
  const rangePicker = inject(rangePickerContextKey, null)
  const owner = datePicker ?? rangePicker
  if (!owner)
    throw new Error(
      'DatePicker footer action must be used within DatePickerRoot or RangePickerRoot',
    )
  return owner
}
</script>
