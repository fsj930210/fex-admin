import {
  getCalendarToday,
  getCalendarValueDate,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { isSameCalendarValue } from '@fex/components-core/calendar/value'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { computed, ref, type Ref } from 'vue'
import type { DatePickerContextValue, DatePickerSelectionValue } from './context'

export interface UseDatePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker | undefined
  status?: 'error' | 'warning' | undefined
  value?: DatePickerSelectionValue<TValue> | undefined
  defaultValue?: DatePickerSelectionValue<TValue> | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  multiple?: boolean | undefined
  needConfirm?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  allowClear?: boolean | undefined
  format?: string | undefined
  weekStartsOn?: CalendarWeekday | undefined
  minDate?: CalendarDate | undefined
  maxDate?: CalendarDate | undefined
  disabledDate?: ((date: CalendarDate) => boolean) | undefined
  onChange?: (value: DatePickerSelectionValue<TValue>) => void
  onOpenChange?: (open: boolean) => void
}

function isValueArray<TValue extends CalendarValue>(
  value: DatePickerSelectionValue<TValue>,
): value is readonly TValue[] {
  return Array.isArray(value)
}

export function useDatePicker<TValue extends CalendarValue = CalendarValue>(
  options: UseDatePickerOptions<TValue>,
): DatePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const multiple = options.multiple ?? false
  const needConfirm = options.needConfirm ?? multiple
  const localValue = ref<DatePickerSelectionValue<TValue>>(
    options.defaultValue ?? (multiple ? [] : null),
  ) as Ref<DatePickerSelectionValue<TValue>>
  const localOpen = ref(options.defaultOpen ?? false)
  const pendingValue = ref<DatePickerSelectionValue<TValue>>(localValue.value) as Ref<
    DatePickerSelectionValue<TValue>
  >
  const panel = ref<CalendarPanel>(getDefaultPanelByPicker(picker))
  const viewDate = ref(getCalendarToday())
  const value = computed(() => (options.value === undefined ? localValue.value : options.value))
  const open = computed(() => options.open ?? localOpen.value)
  const activeValue = computed(() => (needConfirm ? pendingValue.value : value.value))
  const calendarValue = computed(() => (isValueArray(activeValue.value) ? null : activeValue.value))
  const calendarValues = computed(() => (isValueArray(activeValue.value) ? activeValue.value : []))

  function resetPanel() {
    const current = value.value
    const selected = isValueArray(current) ? current[0] : current
    pendingValue.value = current
    panel.value = getDefaultPanelByPicker(picker)
    viewDate.value = selected ? getCalendarValueDate(selected) : getCalendarToday()
  }
  function setOpen(next: boolean) {
    const wasOpen = open.value
    if (options.open === undefined) localOpen.value = next
    if (next && !wasOpen) resetPanel()
    if (!next) panel.value = getDefaultPanelByPicker(picker)
    if (wasOpen !== next) options.onOpenChange?.(next)
  }
  function commit(next: DatePickerSelectionValue<TValue>) {
    if (options.value === undefined) localValue.value = next
    options.onChange?.(next)
  }
  function close() {
    setOpen(false)
  }
  function clear() {
    const next = multiple ? [] : null
    pendingValue.value = next
    commit(next)
  }
  function confirm() {
    commit(pendingValue.value)
    close()
  }
  function cancel() {
    pendingValue.value = value.value
    close()
  }
  function select(next: TValue) {
    if (multiple) {
      const current = activeValue.value
      const values = isValueArray(current) ? current : []
      const exists = values.some((item) => isSameCalendarValue(item, next))
      const result = exists
        ? values.filter((item) => !isSameCalendarValue(item, next))
        : [...values, next]
      if (needConfirm) pendingValue.value = result
      else commit(result)
      return
    }
    if (needConfirm) pendingValue.value = next
    else {
      commit(next)
      close()
    }
  }

  return {
    picker,
    get status() {
      return options.status
    },
    multiple,
    needConfirm,
    disabled: options.disabled ?? false,
    readOnly: options.readOnly ?? false,
    allowClear: options.allowClear ?? true,
    format: options.format ?? getDefaultDatePickerFormat(picker),
    weekStartsOn: options.weekStartsOn ?? 0,
    open,
    panel,
    viewDate,
    value: activeValue,
    calendarValue,
    calendarValues,
    minDate: options.minDate,
    maxDate: options.maxDate,
    disabledDate: options.disabledDate
      ? (date) =>
          createDatePickerDisabledDate({
            picker,
            panel: panel.value,
            ...(options.minDate ? { minDate: options.minDate } : {}),
            ...(options.maxDate ? { maxDate: options.maxDate } : {}),
            ...(options.disabledDate ? { disabledDate: options.disabledDate } : {}),
          })(date)
      : undefined,
    setPanel: (next) => {
      panel.value = next
    },
    setViewDate: (next) => {
      viewDate.value = next
    },
    setOpen,
    openPanel: () => setOpen(true),
    close,
    clear,
    confirm,
    cancel,
    select,
  }
}
