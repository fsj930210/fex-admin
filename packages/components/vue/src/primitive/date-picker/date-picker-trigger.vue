<script setup lang="ts">
import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import { datePickerMultipleInputClassName, datePickerTriggerClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed, ref, watch } from 'vue'
import { CalendarIcon } from '../../icon/calendar'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import PopoverTrigger from '../popover/popover-trigger.vue'
import { useDatePickerContext } from './context'
import DatePickerTags from './date-picker-tags.vue'

const props = defineProps<{ class?: string; displayValue?: string; placeholder?: string; prefix?: unknown; suffix?: unknown }>()
const context = useDatePickerContext('DatePickerTrigger')
const inputRef = ref<HTMLInputElement | null>(null)
const pickerDisplayValue = computed(() => Array.isArray(context.value.value)
  ? context.value.value.map((item) => formatDatePickerValue(item, context)).join(', ')
  : formatDatePickerValue(context.value.value ?? null, context))
const displayValue = computed(() => props.displayValue ?? pickerDisplayValue.value)
const text = ref(displayValue.value)
watch(displayValue, (next) => { text.value = next })
function canClear() {
  return context.allowClear !== false && Boolean(displayValue.value || text.value)
}
function input(nextText: string) {
  text.value = nextText
  if (context.multiple) return
  const result = parseDatePickerValue(nextText, context)
  if (result.valid) context.select(result.value)
}
function openPanel(event?: Event) {
  if (context.disabled) {
    event?.preventDefault()
    event?.stopPropagation()
    return
  }
  inputRef.value?.focus()
  context.openPanel()
}
function clickTrigger(event: MouseEvent, triggerClick?: (event: MouseEvent) => void) {
  if (context.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  inputRef.value?.focus()
  triggerClick?.(event)
}
function getPickerTriggerProps(triggerProps: Record<string, unknown>) {
  const { onClick: _onClick, onFocus: _onFocus, onBlur: _onBlur, ...rest } = triggerProps
  return rest
}
</script>

<template>
  <PopoverTrigger v-slot="{ props: triggerProps, ref: triggerRef }">
    <InputRoot
      v-bind="getPickerTriggerProps(triggerProps)"
      :ref="triggerRef"
      :class="cn(datePickerTriggerClassName, props.class)"
      :value="context.multiple ? '' : text"
      :disabled="context.disabled"
      :read-only="context.readOnly"
      @value-change="input"
      @clear="canClear() && context.clear()"
      @click="(event) => clickTrigger(event, triggerProps.onClick as ((event: MouseEvent) => void) | undefined)"
    >
      <InputPrefix v-if="$slots.prefix"><slot name="prefix" /></InputPrefix>
      <DatePickerTags v-if="context.multiple && displayValue" />
      <InputControl ref="inputRef" :class="context.multiple && displayValue ? datePickerMultipleInputClassName : undefined" :placeholder="context.multiple && displayValue ? '' : props.placeholder ?? context.format" @click="openPanel" @focus="openPanel" />
      <InputClear v-if="canClear()" @pointerdown.stop.prevent @click.stop.prevent="context.clear()" />
      <InputSuffix v-if="!canClear()"><slot name="suffix"><CalendarIcon class="size-4" /></slot></InputSuffix>
    </InputRoot>
  </PopoverTrigger>
</template>
