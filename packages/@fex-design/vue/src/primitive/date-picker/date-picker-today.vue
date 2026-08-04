<script setup lang="ts">
import { getCalendarToday } from '@fex-design/core/calendar'
import { getDefaultPanelByPicker } from '@fex-design/core/date-picker/panel'
import { datePickerTodayClassName } from '@fex-design/styles/date-picker'
import Button from '../button/button.vue'
import { createDatePickerFooterActions } from './date-picker-footer.vue'

const owner = createDatePickerFooterActions()
function today() {
  owner.setViewDate(getCalendarToday())
  owner.setPanel(getDefaultPanelByPicker(owner.picker))
}
</script>

<template>
  <Button data-slot="date-picker-today" :class="datePickerTodayClassName" @click="today">
    <slot>今天</slot>
  </Button>
</template>
