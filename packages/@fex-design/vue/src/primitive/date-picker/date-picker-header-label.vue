<script setup lang="ts">
import {
  getDatePickerHeaderLabelParts,
  getNextPanelByHeaderLabel,
} from '@fex-design/core/date-picker/panel'
import type { DatePickerHeaderLabelPart } from '@fex-design/core/date-picker/types'
import { datePickerHeaderLabelClassName } from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { computed, ref } from 'vue'
import Button from '../button/button.vue'
import { useCalendarContext } from '../calendar/context'
import { useHeaderOwner } from './date-picker-header-owner'

const props = defineProps<{ part: DatePickerHeaderLabelPart; class?: string }>()
const owner = useHeaderOwner('DatePickerHeaderLabel')
const calendar = useCalendarContext('DatePickerHeaderLabel')
const hovered = ref(false)
const visible = computed(() =>
  getDatePickerHeaderLabelParts(owner.picker, calendar.panel.value).includes(props.part),
)
const label = computed(() => {
  if (props.part === 'month') return `${calendar.viewDate.value.month}月`
  const decadeStart = Math.floor(calendar.viewDate.value.year / 10) * 10
  return calendar.panel.value === 'decade'
    ? `${decadeStart}-${decadeStart + 9}年`
    : `${calendar.viewDate.value.year}年`
})

function selectPanel(event: Event) {
  if (event.defaultPrevented) return
  const nextPanel = getNextPanelByHeaderLabel(props.part)
  calendar.setPanel(nextPanel)
  owner.setPanel(nextPanel)
}
</script>

<template>
  <Button
    v-if="visible"
    data-slot="date-picker-header-label"
    :data-part="props.part"
    :data-hovered="hovered ? 'true' : undefined"
    :class="cn(datePickerHeaderLabelClassName, props.class)"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="selectPanel"
  >
    <slot>{{ label }}</slot>
  </Button>
</template>
