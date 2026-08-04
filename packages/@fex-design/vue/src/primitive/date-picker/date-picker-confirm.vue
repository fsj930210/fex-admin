<script setup lang="ts">
import { datePickerConfirmClassName } from '@fex-design/styles/date-picker'
import Button from '../button/button.vue'
import { createDatePickerFooterActions } from './date-picker-footer.vue'

const owner = createDatePickerFooterActions()
</script>

<template>
  <Button
    data-slot="date-picker-confirm"
    :class="datePickerConfirmClassName"
    @click="owner.confirm()"
  >
    <slot>确定</slot>
  </Button>
</template>
