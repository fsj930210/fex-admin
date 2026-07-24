<script setup lang="ts">
import { createSecondOptions, resolveDisabledTime } from '@fex/components-core/time-picker/options'
import { computed, inject } from 'vue'
import { timePickerContextKey } from './context'
import TimePickerColumn from './time-picker-column.vue'
const props = defineProps<{ step?: number | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: number) => boolean) | undefined }>()
const context = inject(timePickerContextKey)
if (!context) throw new Error('TimePickerSecondColumn must be used inside TimePickerRoot.')
const options = computed(() => createSecondOptions(props.step, resolveDisabledTime(context.disabledTime.value, context.snapshot.value.value).seconds).map(item => ({ ...item, disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)) })))
</script>
<template><TimePickerColumn :options="options" :selected-value="context.snapshot.value.value?.second" :disabled="disabled" @select="value => context.controller.selectSecond(Number(value))" /></template>
