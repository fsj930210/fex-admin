<script setup lang="ts">
import { getCalendarToday } from '@fex/components-core/calendar'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { datePickerTodayClassName } from '@fex/components-styles/date-picker'
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
