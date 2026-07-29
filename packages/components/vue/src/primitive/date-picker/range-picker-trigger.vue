<script setup lang="ts">
import { getRangeInputPreviewValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import { datePickerRangeInputClassName, datePickerRangeInputControlClassName, datePickerRangeSeparatorClassName, datePickerRangeTriggerClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed, ref, watch } from 'vue'
import { CalendarIcon } from '../../icon/calendar'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'
import PopoverTrigger from '../popover/popover-trigger.vue'
import { useRangePickerContext } from './context'

const props = withDefaults(defineProps<{ class?: string; startPlaceholder?: string; endPlaceholder?: string; separator?: string }>(), { startPlaceholder: '开始日期', endPlaceholder: '结束日期', separator: '→' })
const context = useRangePickerContext('RangePickerTrigger')
const startValue = computed(() => formatDatePickerValue(context.rangeValue.value.start ?? null, context))
const endValue = computed(() => formatDatePickerValue(context.rangeValue.value.end ?? null, context))
const startText = ref(startValue.value)
const endText = ref(endValue.value)
const focusedPart = ref<'start' | 'end' | null>(null)
watch(startValue, (next) => { startText.value = next })
watch(endValue, (next) => { endText.value = next })
watch(context.open, (next) => {
  if (!next) focusedPart.value = null
})
const previewStartValue = computed(() => getRangeInputPreviewValue(context.rangeValue.value, context.hoverValue.value, context.activePart.value, 'start'))
const previewEndValue = computed(() => getRangeInputPreviewValue(context.rangeValue.value, context.hoverValue.value, context.activePart.value, 'end'))
const previewStartText = computed(() => context.activePart.value === 'start' && previewStartValue.value ? formatDatePickerValue(previewStartValue.value, context) : startText.value)
const previewEndText = computed(() => context.activePart.value === 'end' && previewEndValue.value ? formatDatePickerValue(previewEndValue.value, context) : endText.value)
function canClear() {
  return context.allowClear !== false && Boolean(previewStartText.value || previewEndText.value)
}
function input(part: 'start' | 'end', text: string) {
  if (part === 'start') startText.value = text
  else endText.value = text
  context.setActivePart(part)
  context.setHoverValue(null)
  const result = parseDatePickerValue(text, context)
  if (result.valid) context.select(result.value)
}
function focus(part: 'start' | 'end') {
  context.setActivePart(part)
  focusedPart.value = part
  context.openPanel(part)
}
function openFromTrigger(event: MouseEvent) {
  if (context.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  const part = (event.target as HTMLElement | null)?.closest('[data-range-part]')?.getAttribute('data-range-part')
  context.openPanel(part === 'start' || part === 'end' ? part : undefined)
}
function clickTrigger(event: MouseEvent, triggerClick?: (event: MouseEvent) => void) {
  if (context.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  openFromTrigger(event)
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
      :class="cn(datePickerRangeTriggerClassName, props.class)"
      value=""
      :disabled="context.disabled"
      :read-only="context.readOnly"
      @value-change="() => undefined"
      @click="(event) => clickTrigger(event, triggerProps.onClick as ((event: MouseEvent) => void) | undefined)"
    >
      <InputRoot data-range-part="start" :data-active="(context.open.value ? context.activePart.value === 'start' : focusedPart === 'start') || undefined" :value="previewStartText" :read-only="context.readOnly" :class="datePickerRangeInputClassName" @value-change="input('start', $event)">
        <InputControl :class="cn(datePickerRangeInputControlClassName, previewStartText !== startText && 'text-muted-foreground')" :placeholder="props.startPlaceholder" @click="focus('start')" @focus="focus('start')" />
      </InputRoot>
      <span aria-hidden="true" :class="datePickerRangeSeparatorClassName">{{ props.separator }}</span>
      <InputRoot data-range-part="end" :data-active="(context.open.value ? context.activePart.value === 'end' : focusedPart === 'end') || undefined" :value="previewEndText" :read-only="context.readOnly" :class="datePickerRangeInputClassName" @value-change="input('end', $event)">
        <InputControl :class="cn(datePickerRangeInputControlClassName, previewEndText !== endText && 'text-muted-foreground')" :placeholder="props.endPlaceholder" @click="focus('end')" @focus="focus('end')" />
      </InputRoot>
      <InputClear
        v-if="canClear()"
        :force-mount="true"
        aria-label="清除日期范围"
        @pointerdown.stop.prevent
        @click.stop.prevent="context.clear()"
      />
      <InputSuffix v-else><slot name="suffix"><CalendarIcon class="size-4" /></slot></InputSuffix>
    </InputRoot>
  </PopoverTrigger>
</template>
