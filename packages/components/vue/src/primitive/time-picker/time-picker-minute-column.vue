<script setup lang="ts">
import { createMinuteOptions, resolveDisabledTime } from '@fex/components-core/time-picker/options'
import { computed, inject } from 'vue'
import { timePickerContextKey } from './context'
import TimePickerColumn from './time-picker-column.vue'
const props = defineProps<{ step?: number | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: number) => boolean) | undefined }>()
const context = inject(timePickerContextKey)
if (!context) throw new Error('TimePickerMinuteColumn must be used inside TimePickerRoot.')
const options = computed(() => createMinuteOptions(props.step, resolveDisabledTime(context.disabledTime.value, context.snapshot.value.value).minutes).map(item => ({ ...item, disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)) })))
</script>
<template><TimePickerColumn :options="options" :selected-value="context.snapshot.value.value?.minute" :disabled="disabled" @select="value => context.controller.selectMinute(Number(value))" /></template>
