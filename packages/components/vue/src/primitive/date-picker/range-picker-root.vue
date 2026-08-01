<script setup lang="ts">
import type {
  CalendarDate,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { getCurrentInstance, provide } from 'vue'
import PopoverRoot from '../popover/popover-root.vue'
import { rangePickerContextKey } from './context'
import { useRangePicker } from './use-range-picker'

const props = withDefaults(
  defineProps<{
    value?: CalendarRange<CalendarValue> | undefined
    defaultValue?: CalendarRange<CalendarValue> | undefined
    open?: boolean | undefined
    defaultOpen?: boolean | undefined
    picker?: DatePickerPicker | undefined
    status?: 'error' | 'warning' | undefined
    needConfirm?: boolean | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    allowClear?: boolean | undefined
    allowEmpty?: boolean | { start?: boolean; end?: boolean } | undefined
    order?: boolean | undefined
    format?: string | undefined
    weekStartsOn?: CalendarWeekday | undefined
    minDate?: CalendarDate | undefined
    maxDate?: CalendarDate | undefined
    disabledDate?: ((date: CalendarDate, activePart: 'start' | 'end') => boolean) | undefined
  }>(),
  {
    defaultOpen: false,
    picker: 'date',
    disabled: false,
    readOnly: false,
    allowClear: true,
    order: true,
    weekStartsOn: 0,
  },
)
const emit = defineEmits<{
  change: [value: CalendarRange<CalendarValue>]
  openChange: [open: boolean]
}>()
const instance = getCurrentInstance()
function hasProp(name: string) {
  const vnodeProps = instance?.vnode.props
  return Boolean(vnodeProps && Object.prototype.hasOwnProperty.call(vnodeProps, name))
}
function isExplicitFalseProp(name: string) {
  const vnodeProps = instance?.vnode.props as Record<string, unknown> | null | undefined
  return Boolean(
    vnodeProps &&
    Object.prototype.hasOwnProperty.call(vnodeProps, name) &&
    vnodeProps[name] === false,
  )
}
const rangePicker = useRangePicker<CalendarValue>({
  get value() {
    return props.value
  },
  get defaultValue() {
    return props.defaultValue
  },
  get open() {
    return hasProp('open') ? props.open : undefined
  },
  get defaultOpen() {
    return props.defaultOpen
  },
  get picker() {
    return props.picker
  },
  get status() {
    return props.status
  },
  get needConfirm() {
    return props.needConfirm
  },
  get disabled() {
    return props.disabled
  },
  get readOnly() {
    return props.readOnly
  },
  get allowClear() {
    return !isExplicitFalseProp('allowClear')
  },
  get allowEmpty() {
    return props.allowEmpty
  },
  get order() {
    return props.order
  },
  get format() {
    return props.format
  },
  get weekStartsOn() {
    return props.weekStartsOn
  },
  get minDate() {
    return props.minDate
  },
  get maxDate() {
    return props.maxDate
  },
  get disabledDate() {
    return props.disabledDate
  },
  onChange: (value) => emit('change', value),
  onOpenChange: (open) => emit('openChange', open),
})
provide(rangePickerContextKey, rangePicker)
</script>

<template>
  <PopoverRoot
    :open="rangePicker.open.value"
    :trigger="rangePicker.disabled ? [] : ['focus', 'click']"
    placement="bottom"
    :side-offset="6"
    @open-change="rangePicker.setOpen"
  >
    <slot />
  </PopoverRoot>
</template>
