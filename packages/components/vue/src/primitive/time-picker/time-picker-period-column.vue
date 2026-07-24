<script setup lang="ts">
import { createPeriodOptions, getDisplayedPeriod } from '@fex/components-core/time-picker/options'
import type { TimePeriod } from '@fex/components-core/time-picker/types'
import { computed, inject } from 'vue'
import { timePickerContextKey } from './context'
import TimePickerColumn from './time-picker-column.vue'
const props = defineProps<{ disabled?: boolean | undefined; labels?: { am: string; pm: string } | undefined; isItemDisabled?: ((value: TimePeriod) => boolean) | undefined }>()
const context = inject(timePickerContextKey)
if (!context) throw new Error('TimePickerPeriodColumn must be used inside TimePickerRoot.')
const options = computed(() => createPeriodOptions(props.labels).map(item => ({ ...item, disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)) })))
const selected = computed(() => context.snapshot.value.value ? getDisplayedPeriod(context.snapshot.value.value) : undefined)
</script>
<template><TimePickerColumn v-if="context.use12Hours.value" :options="options" :selected-value="selected" :disabled="disabled" @select="value => context.controller.selectPeriod(value as TimePeriod)" /></template>
