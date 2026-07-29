import { getCalendarToday, getCalendarValueDate, type CalendarDate, type CalendarPanel, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { isSameCalendarValue } from '@fex/components-core/calendar/value'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { createMemo, createSignal } from 'solid-js'
import type { DatePickerContextValue, DatePickerSelectionValue } from './context'

export interface UseDatePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker
  status?: 'error' | 'warning'
  value?: DatePickerSelectionValue<TValue>
  defaultValue?: DatePickerSelectionValue<TValue>
  open?: boolean
  defaultOpen?: boolean
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
  onChange?: (value: DatePickerSelectionValue<TValue>) => void
  onOpenChange?: (open: boolean) => void
}

function isValueArray<TValue extends CalendarValue>(value: DatePickerSelectionValue<TValue>): value is readonly TValue[] {
  return Array.isArray(value)
}

export function useDatePicker<TValue extends CalendarValue = CalendarValue>(
  options: UseDatePickerOptions<TValue>,
): DatePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const multiple = options.multiple ?? false
  const needConfirm = options.needConfirm ?? multiple
  const [localValue, setLocalValue] = createSignal<DatePickerSelectionValue<TValue>>(
    options.defaultValue ?? (multiple ? [] : null),
  )
  const [localOpen, setLocalOpen] = createSignal(options.defaultOpen ?? false)
  const [pendingValue, setPendingValue] = createSignal<DatePickerSelectionValue<TValue>>(localValue())
  const [panel, setPanel] = createSignal<CalendarPanel>(getDefaultPanelByPicker(picker))
  const [viewDate, setViewDate] = createSignal<CalendarDate>(getCalendarToday())
  const value = () => options.value === undefined ? localValue() : options.value
  const open = () => options.open ?? localOpen()
  const activeValue = () => needConfirm ? pendingValue() : value()
  const calendarValue = createMemo(() => isValueArray(activeValue()) ? null : activeValue() as TValue | null)
  const calendarValues = createMemo(() => isValueArray(activeValue()) ? activeValue() as readonly TValue[] : [])

  function resetPanel() {
    const current = value()
    const selected = isValueArray(current) ? current[0] : current
    setPendingValue(current)
    setPanel(getDefaultPanelByPicker(picker))
    setViewDate(selected ? getCalendarValueDate(selected) : getCalendarToday())
  }
  function setOpen(next: boolean) {
    const wasOpen = open()
    if (options.open === undefined) setLocalOpen(next)
    if (next && !wasOpen) resetPanel()
    if (!next) setPanel(getDefaultPanelByPicker(picker))
    if (wasOpen !== next) options.onOpenChange?.(next)
  }
  function commit(next: DatePickerSelectionValue<TValue>) {
    if (options.value === undefined) setLocalValue(() => next)
    options.onChange?.(next)
  }
  function close() { setOpen(false) }
  function clear() {
    const next = multiple ? [] : null
    setPendingValue(next)
    commit(next)
  }
  function confirm() {
    commit(pendingValue())
    close()
  }
  function cancel() {
    setPendingValue(value())
    close()
  }
  function select(next: TValue) {
    if (multiple) {
      const current = activeValue()
      const values = isValueArray(current) ? current : []
      const exists = values.some((item) => isSameCalendarValue(item, next))
      const result = exists ? values.filter((item) => !isSameCalendarValue(item, next)) : [...values, next]
      if (needConfirm) setPendingValue(result)
      else commit(result)
      return
    }
    if (needConfirm) setPendingValue(next)
    else {
      commit(next)
      close()
    }
  }

  return {
    picker,
    get status() { return options.status },
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
    ...(options.minDate ? { minDate: options.minDate } : {}),
    ...(options.maxDate ? { maxDate: options.maxDate } : {}),
    disabledDate: options.disabledDate ? (date) => createDatePickerDisabledDate({
      picker,
      panel: panel(),
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      disabledDate: options.disabledDate,
    })(date) : undefined,
    setPanel,
    setViewDate,
    setOpen,
    openPanel: () => setOpen(true),
    close,
    clear,
    confirm,
    cancel,
    select,
  }
}
