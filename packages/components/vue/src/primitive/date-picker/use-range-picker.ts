import { getCalendarToday, getCalendarValueDate, type CalendarDate, type CalendarPanel, type CalendarRange, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue, getNextRangeActivePart, getRangeFromValue } from '@fex/components-core/date-picker/range'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { computed, ref, type Ref } from 'vue'
import type { RangePickerContextValue } from './context'

export interface UseRangePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker
  status?: 'error' | 'warning'
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

export function useRangePicker<TValue extends CalendarValue = CalendarValue>(options: UseRangePickerOptions<TValue>): RangePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const needConfirm = options.needConfirm ?? false
  const localValue = ref<CalendarRange<TValue>>(options.defaultValue ?? {}) as Ref<CalendarRange<TValue>>
  const localOpen = ref(options.defaultOpen ?? false)
  const pendingValue = ref<CalendarRange<TValue>>(localValue.value) as Ref<CalendarRange<TValue>>
  const activePart = ref<'start' | 'end'>('start')
  const hoverValue = ref<TValue | null>(null)
  const panel = ref<CalendarPanel>(getDefaultPanelByPicker(picker))
  const viewDate = ref(getCalendarToday())
  const value = computed(() => options.value === undefined ? localValue.value : options.value)
  const open = computed(() => options.open ?? localOpen.value)
  const rangeValue = computed(() => needConfirm ? pendingValue.value : value.value)

  function resetPanel(part?: 'start' | 'end') {
    const current = value.value
    const selected = current.start ?? current.end
    pendingValue.value = current
    panel.value = getDefaultPanelByPicker(picker)
    viewDate.value = selected ? getCalendarValueDate(selected) : getCalendarToday()
    activePart.value = part ?? (current.start ? 'end' : 'start')
    hoverValue.value = null
  }
  function setOpen(next: boolean, part?: 'start' | 'end') {
    const wasOpen = open.value
    if (next && !wasOpen) resetPanel(part)
    else if (next && part) activePart.value = part
    if (options.open === undefined) localOpen.value = next
    if (wasOpen !== next) options.onOpenChange?.(next)
  }
  function close() { setOpen(false) }
  function commit(next: CalendarRange<TValue>) {
    if (options.value === undefined) localValue.value = next
    pendingValue.value = next
    options.onChange?.(next)
  }
  function select(nextValue: TValue) {
    const part = activePart.value
    const nextRange = createNextRangeValue(rangeValue.value, nextValue, part, options.order ?? true)
    hoverValue.value = null
    if (needConfirm) pendingValue.value = nextRange
    else commit(nextRange)
    const nextActivePart = getNextRangeActivePart(nextRange)
    if (nextActivePart) { activePart.value = nextActivePart; return }
    if (!needConfirm) close()
  }
  function clear() { const next: CalendarRange<TValue> = {}; pendingValue.value = next; hoverValue.value = null; commit(next) }
  function confirm() { commit(pendingValue.value); close() }
  function cancel() { pendingValue.value = value.value; close() }
  function disabledDate(date: CalendarDate, part: 'start' | 'end') {
    return createDatePickerDisabledDate({ picker, panel: panel.value, minDate: options.minDate, maxDate: options.maxDate, disabledDate: options.disabledDate ? (current, info) => Boolean(options.disabledDate?.(current, info.activePart ?? part)) : undefined })(date, { activePart: part, from: getRangeFromValue(rangeValue.value, part), rangeValue: rangeValue.value })
  }

  return {
    picker,
    get status() { return options.status },
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
    rangeValue,
    activePart,
    hoverValue,
    minDate: options.minDate,
    maxDate: options.maxDate,
    disabledDate,
    setPanel: (next) => { panel.value = next },
    setViewDate: (next) => { viewDate.value = next },
    setOpen: (next) => setOpen(next),
    setActivePart: (next) => { activePart.value = next },
    setHoverValue: (next) => { hoverValue.value = next },
    openPanel: (part) => setOpen(true, part),
    close,
    clear,
    confirm,
    cancel,
    select,
  }
}
