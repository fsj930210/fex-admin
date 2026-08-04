<script setup lang="ts">
import type {
  CalendarDate,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex-design/core/calendar'
import type {
  DatePickerPicker,
  DatePickerSelectionValue,
} from '@fex-design/vue/primitive/date-picker'
import {
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerContent,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerRoot,
  DatePickerToday,
  DatePickerTrigger,
  RangePickerContent,
  RangePickerPanelGroup,
  RangePickerRoot,
  RangePickerTrigger,
} from '@fex-design/vue/primitive/date-picker'
import { computed, getCurrentInstance } from 'vue'

const props = defineProps<{
  value?: DatePickerSelectionValue | CalendarRange<CalendarValue>
  defaultValue?: DatePickerSelectionValue | CalendarRange<CalendarValue>
  open?: boolean
  defaultOpen?: boolean
  picker?: DatePickerPicker
  status?: 'error' | 'warning'
  multiple?: boolean
  needConfirm?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  allowEmpty?: boolean | { start?: boolean; end?: boolean }
  order?: boolean
  format?: string
  placeholder?: string
  weekStartsOn?: CalendarWeekday
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?:
    | ((date: CalendarDate) => boolean)
    | ((date: CalendarDate, activePart: 'start' | 'end') => boolean)
  range?: boolean
}>()
const emit = defineEmits<{ change: [value: unknown]; openChange: [open: boolean] }>()
const dateValue = computed(() => props.value as DatePickerSelectionValue | undefined)
const dateDefaultValue = computed(() => props.defaultValue as DatePickerSelectionValue | undefined)
const dateDisabledDate = computed(
  () => props.disabledDate as ((date: CalendarDate) => boolean) | undefined,
)
const rangeValue = computed(() => props.value as CalendarRange<CalendarValue> | undefined)
const rangeDefaultValue = computed(
  () => props.defaultValue as CalendarRange<CalendarValue> | undefined,
)
const rangeDisabledDate = computed(
  () =>
    props.disabledDate as
      | ((date: CalendarDate, activePart: 'start' | 'end') => boolean)
      | undefined,
)
const instance = getCurrentInstance()
function hasProp(name: string) {
  const vnodeProps = instance?.vnode.props
  return Boolean(vnodeProps && Object.prototype.hasOwnProperty.call(vnodeProps, name))
}
const openProps = computed(() => (hasProp('open') ? { open: props.open } : {}))
const rangePlaceholder = computed(() => {
  if (props.picker === 'week') return { start: '开始周', end: '结束周' }
  if (props.picker === 'month') return { start: '开始月份', end: '结束月份' }
  if (props.picker === 'quarter') return { start: '开始季度', end: '结束季度' }
  if (props.picker === 'year') return { start: '开始年份', end: '结束年份' }
  return { start: '开始日期', end: '结束日期' }
})
</script>

<template>
  <RangePickerRoot
    v-if="range"
    :value="rangeValue"
    :default-value="rangeDefaultValue"
    v-bind="openProps"
    :default-open="props.defaultOpen"
    :picker="props.picker"
    :status="props.status"
    :need-confirm="props.needConfirm"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :allow-clear="props.allowClear"
    :allow-empty="props.allowEmpty"
    :order="props.order"
    :format="props.format"
    :week-starts-on="props.weekStartsOn"
    :min-date="props.minDate"
    :max-date="props.maxDate"
    :disabled-date="rangeDisabledDate"
    @change="emit('change', $event)"
    @open-change="emit('openChange', $event)"
  >
    <RangePickerTrigger
      class="w-80"
      :start-placeholder="rangePlaceholder.start"
      :end-placeholder="rangePlaceholder.end"
    />
    <RangePickerContent class="overflow-hidden p-0">
      <RangePickerPanelGroup />
      <DatePickerFooter v-if="props.needConfirm">
        <DatePickerCancel>取消</DatePickerCancel>
        <DatePickerConfirm>确定</DatePickerConfirm>
      </DatePickerFooter>
    </RangePickerContent>
  </RangePickerRoot>
  <DatePickerRoot
    v-else
    :value="dateValue"
    :default-value="dateDefaultValue"
    v-bind="openProps"
    :default-open="props.defaultOpen"
    :picker="props.picker"
    :status="props.status"
    :multiple="props.multiple"
    :need-confirm="props.needConfirm"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :allow-clear="props.allowClear"
    :format="props.format"
    :week-starts-on="props.weekStartsOn"
    :min-date="props.minDate"
    :max-date="props.maxDate"
    :disabled-date="dateDisabledDate"
    @change="emit('change', $event)"
    @open-change="emit('openChange', $event)"
  >
    <DatePickerTrigger class="w-56" :placeholder="props.placeholder" />
    <DatePickerContent class="overflow-hidden p-0">
      <DatePickerPanel />
      <DatePickerFooter v-if="props.needConfirm || props.multiple">
        <DatePickerToday>今天</DatePickerToday>
        <DatePickerCancel>取消</DatePickerCancel>
        <DatePickerConfirm>确定</DatePickerConfirm>
      </DatePickerFooter>
    </DatePickerContent>
  </DatePickerRoot>
</template>
