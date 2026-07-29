import { getCalendarToday, getCalendarValueDate, type CalendarDate, type CalendarPanel, type CalendarRange, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue, getNextRangeActivePart, getRangeFromValue } from '@fex/components-core/date-picker/range'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { createSignal } from 'solid-js'
import type { RangePickerContextValue } from './context'

export interface UseRangePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker
  value?: CalendarRange<TValue>
  defaultValue?: CalendarRange<TValue>
  open?: boolean
  defaultOpen?: boolean
  needConfirm?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  allowEmpty?: boolean | { start?: boolean; end?: boolean }
  order?: boolean
  format?: string
  weekStartsOn?: CalendarWeekday
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate, activePart: 'start' | 'end') => boolean
  onChange?: (value: CalendarRange<TValue>) => void
  onOpenChange?: (open: boolean) => void
}

function normalizeAllowEmpty(value: UseRangePickerOptions['allowEmpty']) {
  if (value === true) return { start: true, end: true }
  if (value && typeof value === 'object') return { start: Boolean(value.start), end: Boolean(value.end) }
  return { start: false, end: false }
}

export function useRangePicker<TValue extends CalendarValue = CalendarValue>(
  options: UseRangePickerOptions<TValue>,
): RangePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const needConfirm = options.needConfirm ?? false
  const [rangeValue, setRangeValue] = createSignal<CalendarRange<TValue>>(options.defaultValue ?? {}, { equals: false })
  const [openValue, setOpenValue] = createSignal(options.defaultOpen ?? false)
  const [pendingValue, setPendingValue] = createSignal<CalendarRange<TValue>>(rangeValue(), { equals: false })
  const [activePart, setActivePart] = createSignal<'start' | 'end'>('start')
  const [hoverValue, setHoverValue] = createSignal<TValue | null>(null)
  const [panel, setPanel] = createSignal<CalendarPanel>(getDefaultPanelByPicker(picker))
  const [viewDate, setViewDate] = createSignal(getCalendarToday())
  const value = () => options.value === undefined ? rangeValue() : options.value
  const open = () => options.open ?? openValue()
  const activeRangeValue = () => needConfirm ? pendingValue() : value()

  function resetPanel(part?: 'start' | 'end') {
    const current = value()
    const selected = current.start ?? current.end
    setPanel(getDefaultPanelByPicker(picker))
    setViewDate(selected ? getCalendarValueDate(selected) : getCalendarToday())
    setPendingValue(current)
    setActivePart(part ?? (current.start ? 'end' : 'start'))
    setHoverValue(null)
  }
  function setOpen(next: boolean, part?: 'start' | 'end') {
    const wasOpen = open()
    if (next && !wasOpen) resetPanel(part)
    else if (next && part) setActivePart(part)
    if (options.open === undefined) setOpenValue(next)
    if (wasOpen !== next) options.onOpenChange?.(next)
  }
  function close() { setOpen(false) }
  function commit(next: CalendarRange<TValue>) {
    if (options.value === undefined) setRangeValue(next)
    setPendingValue(next)
    options.onChange?.(next)
  }
  function select(nextValue: TValue) {
    const part = activePart()
    const nextRange = createNextRangeValue(activeRangeValue(), nextValue, part, options.order ?? true)
    setHoverValue(null)
    if (needConfirm) setPendingValue(nextRange)
    else commit(nextRange)
    const nextActivePart = getNextRangeActivePart(nextRange)
    if (nextActivePart) {
      setActivePart(nextActivePart)
      return
    }
    if (!needConfirm) close()
  }
  function clear() {
    const next: CalendarRange<TValue> = {}
    setPendingValue(next)
    setHoverValue(null)
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
  function disabledDate(date: CalendarDate, part: 'start' | 'end') {
    return createDatePickerDisabledDate({
      picker,
      panel: panel(),
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      ...(options.disabledDate ? { disabledDate: (current, info) => Boolean(options.disabledDate?.(current, info.activePart ?? part)) } : {}),
    })(date, { activePart: part, from: getRangeFromValue(activeRangeValue(), part), rangeValue: activeRangeValue() })
  }

  return {
    picker,
    needConfirm,
    disabled: options.disabled ?? false,
    readOnly: options.readOnly ?? false,
    allowClear: options.allowClear ?? true,
    allowEmpty: normalizeAllowEmpty(options.allowEmpty),
    format: options.format ?? getDefaultDatePickerFormat(picker),
    weekStartsOn: options.weekStartsOn ?? 0,
    open,
    panel,
    viewDate,
    rangeValue: activeRangeValue,
    activePart,
    hoverValue,
    ...(options.minDate ? { minDate: options.minDate } : {}),
    ...(options.maxDate ? { maxDate: options.maxDate } : {}),
    disabledDate,
    setPanel,
    setViewDate,
    setOpen: (next) => setOpen(next),
    setActivePart,
    setHoverValue,
    openPanel: (part) => setOpen(true, part),
    close,
    clear,
    confirm,
    cancel,
    select,
  }
}
