<script setup lang="ts">
import type { CalendarDate, CalendarValue, CalendarWeekday } from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { getCurrentInstance, provide } from 'vue'
import PopoverRoot from '../popover/popover-root.vue'
import { datePickerContextKey, type DatePickerSelectionValue } from './context'
import { useDatePicker } from './use-date-picker'

const props = withDefaults(defineProps<{
  value?: DatePickerSelectionValue
  defaultValue?: DatePickerSelectionValue
  open?: boolean
  defaultOpen?: boolean
  picker?: DatePickerPicker
  status?: 'error' | 'warning'
  multiple?: boolean
  needConfirm?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  format?: string
  weekStartsOn?: CalendarWeekday
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate) => boolean
}>(), { open: undefined, defaultOpen: false, picker: 'date', multiple: false, disabled: false, readOnly: false, allowClear: true, weekStartsOn: 0 })
const emit = defineEmits<{ change: [value: DatePickerSelectionValue]; openChange: [open: boolean] }>()
const instance = getCurrentInstance()
function hasProp(name: string) {
  const vnodeProps = instance?.vnode.props
  return Boolean(vnodeProps && Object.prototype.hasOwnProperty.call(vnodeProps, name))
}
function isExplicitFalseProp(name: string) {
  const vnodeProps = instance?.vnode.props as Record<string, unknown> | null | undefined
  return Boolean(vnodeProps && Object.prototype.hasOwnProperty.call(vnodeProps, name) && vnodeProps[name] === false)
}
const datePicker = useDatePicker<CalendarValue>({
  get value() { return props.value },
  get defaultValue() { return props.defaultValue },
  get open() { return hasProp('open') ? props.open : undefined },
  get defaultOpen() { return props.defaultOpen },
  get picker() { return props.picker },
  get status() { return props.status },
  get multiple() { return props.multiple },
  get needConfirm() { return props.needConfirm },
  get disabled() { return props.disabled },
  get readOnly() { return props.readOnly },
  get allowClear() { return !isExplicitFalseProp('allowClear') },
  get format() { return props.format },
  get weekStartsOn() { return props.weekStartsOn },
  get minDate() { return props.minDate },
  get maxDate() { return props.maxDate },
  get disabledDate() { return props.disabledDate },
  onChange: (value) => emit('change', value),
  onOpenChange: (open) => emit('openChange', open),
})
provide(datePickerContextKey, datePicker)
</script>

<template>
  <PopoverRoot :open="datePicker.open.value" :trigger="datePicker.disabled ? [] : ['focus', 'click']" placement="bottom" :side-offset="6" @open-change="datePicker.setOpen">
    <slot />
  </PopoverRoot>
</template>
