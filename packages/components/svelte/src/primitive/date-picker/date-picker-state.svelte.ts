import {
  getCalendarToday,
  getCalendarValueDate,
  type CalendarDate,
  type CalendarPanel,
  type CalendarRange,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { isSameCalendarValue } from '@fex/components-core/calendar/value'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import {
  createNextRangeValue,
  getNextRangeActivePart,
  getRangeFromValue,
} from '@fex/components-core/date-picker/range'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import type {
  DatePickerContextValue,
  DatePickerSelectionValue,
  RangePickerContextValue,
} from './context'

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
  onChange?: ((value: DatePickerSelectionValue<TValue>) => void) | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
}

export interface UseRangePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker | undefined
  status?: 'error' | 'warning' | undefined
  value?: CalendarRange<TValue> | undefined
  defaultValue?: CalendarRange<TValue> | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
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
  onChange?: ((value: CalendarRange<TValue>) => void) | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
}

function isValueArray<TValue extends CalendarValue>(
  value: DatePickerSelectionValue<TValue>,
): value is readonly TValue[] {
  return Array.isArray(value)
}

function normalizeAllowEmpty(value: UseRangePickerOptions['allowEmpty']) {
  if (value === true) return { start: true, end: true }
  if (value && typeof value === 'object')
    return { start: Boolean(value.start), end: Boolean(value.end) }
  return { start: false, end: false }
}

export function useDatePicker<TValue extends CalendarValue = CalendarValue>(
  options: UseDatePickerOptions<TValue>,
): DatePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const multiple = options.multiple ?? false
  const needConfirm = options.needConfirm ?? multiple
  let localValue = $state<DatePickerSelectionValue<TValue>>(
    options.defaultValue ?? (multiple ? [] : null),
  )
  let localOpen = $state(options.defaultOpen ?? false)
  let pendingValue = $state<DatePickerSelectionValue<TValue>>(localValue)
  let panel = $state<CalendarPanel>(getDefaultPanelByPicker(picker))
  let viewDate = $state(getCalendarToday())
  const value = () => (options.value === undefined ? localValue : options.value)
  const open = () => options.open ?? localOpen
  const activeValue = () => (needConfirm ? pendingValue : value())
  function resetPanel() {
    const current = value()
    const selected = isValueArray(current) ? current[0] : current
    pendingValue = current
    panel = getDefaultPanelByPicker(picker)
    viewDate = selected ? getCalendarValueDate(selected) : getCalendarToday()
  }
  function setOpen(next: boolean) {
    const wasOpen = open()
    if (options.open === undefined) localOpen = next
    if (next && !wasOpen) resetPanel()
    if (!next) panel = getDefaultPanelByPicker(picker)
    if (wasOpen !== next) options.onOpenChange?.(next)
  }
  function commit(next: DatePickerSelectionValue<TValue>) {
    if (options.value === undefined) localValue = next
    options.onChange?.(next)
  }
  function close() {
    setOpen(false)
  }
  function clear() {
    const next = multiple ? [] : null
    pendingValue = next
    commit(next)
  }
  function confirm() {
    commit(pendingValue)
    close()
  }
  function cancel() {
    pendingValue = value()
    close()
  }
  function select(next: TValue) {
    if (multiple) {
      const values = isValueArray(activeValue()) ? (activeValue() as readonly TValue[]) : []
      const exists = values.some((item) => isSameCalendarValue(item, next))
      const result = exists
        ? values.filter((item) => !isSameCalendarValue(item, next))
        : [...values, next]
      if (needConfirm) pendingValue = result
      else commit(result)
      return
    }
    if (needConfirm) pendingValue = next
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
    getOpen: open,
    getPanel: () => panel,
    getViewDate: () => viewDate,
    getValue: activeValue,
    getCalendarValue: () => (isValueArray(activeValue()) ? null : (activeValue() as TValue | null)),
    getCalendarValues: () =>
      isValueArray(activeValue()) ? (activeValue() as readonly TValue[]) : [],
    minDate: options.minDate,
    maxDate: options.maxDate,
    disabledDate: options.disabledDate
      ? (date) =>
          createDatePickerDisabledDate({
            picker,
            panel,
            minDate: options.minDate,
            maxDate: options.maxDate,
            disabledDate: options.disabledDate,
          })(date)
      : undefined,
    setPanel: (next) => {
      panel = next
    },
    setViewDate: (next) => {
      viewDate = next
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

export function useRangePicker<TValue extends CalendarValue = CalendarValue>(
  options: UseRangePickerOptions<TValue>,
): RangePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const needConfirm = options.needConfirm ?? false
  let localValue = $state<CalendarRange<TValue>>(options.defaultValue ?? {})
  let localOpen = $state(options.defaultOpen ?? false)
  let pendingValue = $state<CalendarRange<TValue>>(localValue)
  let activePart = $state<'start' | 'end'>('start')
  let hoverValue = $state<TValue | null>(null)
  let panel = $state<CalendarPanel>(getDefaultPanelByPicker(picker))
  let viewDate = $state(getCalendarToday())
  const value = () => (options.value === undefined ? localValue : options.value)
  const open = () => options.open ?? localOpen
  const rangeValue = () => (needConfirm ? pendingValue : value())
  function resetPanel(part?: 'start' | 'end') {
    const current = value()
    const selected = current.start ?? current.end
    pendingValue = current
    panel = getDefaultPanelByPicker(picker)
    viewDate = selected ? getCalendarValueDate(selected) : getCalendarToday()
    activePart = part ?? (current.start ? 'end' : 'start')
    hoverValue = null
  }
  function setOpen(next: boolean, part?: 'start' | 'end') {
    const wasOpen = open()
    if (next && !wasOpen) resetPanel(part)
    else if (next && part) activePart = part
    if (options.open === undefined) localOpen = next
    if (wasOpen !== next) options.onOpenChange?.(next)
  }
  function close() {
    setOpen(false)
  }
  function commit(next: CalendarRange<TValue>) {
    if (options.value === undefined) localValue = next
    pendingValue = next
    options.onChange?.(next)
  }
  function select(nextValue: TValue) {
    const part = activePart
    const nextRange = createNextRangeValue(rangeValue(), nextValue, part, options.order ?? true)
    hoverValue = null
    if (needConfirm) pendingValue = nextRange
    else commit(nextRange)
    const nextActivePart = getNextRangeActivePart(nextRange)
    if (nextActivePart) {
      activePart = nextActivePart
      return
    }
    if (!needConfirm) close()
  }
  function clear() {
    const next: CalendarRange<TValue> = {}
    pendingValue = next
    hoverValue = null
    commit(next)
  }
  function confirm() {
    commit(pendingValue)
    close()
  }
  function cancel() {
    pendingValue = value()
    close()
  }
  function disabledDate(date: CalendarDate, part: 'start' | 'end') {
    return createDatePickerDisabledDate({
      picker,
      panel,
      minDate: options.minDate,
      maxDate: options.maxDate,
      disabledDate: options.disabledDate
        ? (current, info) => Boolean(options.disabledDate?.(current, info.activePart ?? part))
        : undefined,
    })(date, {
      activePart: part,
      from: getRangeFromValue(rangeValue(), part),
      rangeValue: rangeValue(),
    })
  }
  return {
    picker,
    get status() {
      return options.status
    },
    needConfirm,
    disabled: options.disabled ?? false,
    readOnly: options.readOnly ?? false,
    allowClear: options.allowClear ?? true,
    allowEmpty: normalizeAllowEmpty(options.allowEmpty),
    format: options.format ?? getDefaultDatePickerFormat(picker),
    weekStartsOn: options.weekStartsOn ?? 0,
    getOpen: open,
    getPanel: () => panel,
    getViewDate: () => viewDate,
    getRangeValue: rangeValue,
    getActivePart: () => activePart,
    getHoverValue: () => hoverValue,
    minDate: options.minDate,
    maxDate: options.maxDate,
    disabledDate,
    setPanel: (next) => {
      panel = next
    },
    setViewDate: (next) => {
      viewDate = next
    },
    setOpen: (next) => setOpen(next),
    setActivePart: (next) => {
      activePart = next
    },
    setHoverValue: (next) => {
      hoverValue = next
    },
    openPanel: (part) => setOpen(true, part),
    close,
    clear,
    confirm,
    cancel,
    select,
  }
}
