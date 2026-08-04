<script setup lang="ts">
import { datePickerCancelClassName } from '@fex-design/styles/date-picker'
import Button from '../button/button.vue'
import { createDatePickerFooterActions } from './date-picker-footer.vue'

const owner = createDatePickerFooterActions()
</script>

<template>
  <Button data-slot="date-picker-cancel" :class="datePickerCancelClassName" @click="owner.cancel()">
    <slot>取消</slot>
  </Button>
</template>
