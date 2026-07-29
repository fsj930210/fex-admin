import {
  getCalendarToday,
  type CalendarDate,
  type CalendarPanel,
  type CalendarRange,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue, getNextRangeActivePart, getRangeFromValue } from '@fex/components-core/date-picker/range'
import { getCalendarValueDate } from '@fex/components-core/calendar/value'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { useState } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import type { RangePickerContextValue } from './context'

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
  const [rangeValue, setRangeValue] = useControllableState<CalendarRange<TValue>>(
    {
      ...(options.value !== undefined ? { value: options.value } : {}),
      ...(options.defaultValue !== undefined ? { defaultValue: options.defaultValue } : {}),
      ...(options.onChange ? { onChange: options.onChange } : {}),
    },
    { defaultValue: {} },
  )
  const [open, setOpenState] = useControllableState<boolean>(
    {
      ...(options.open !== undefined ? { value: options.open } : {}),
      ...(options.defaultOpen !== undefined ? { defaultValue: options.defaultOpen } : {}),
      ...(options.onOpenChange ? { onChange: options.onOpenChange } : {}),
    },
    { defaultValue: false },
  )
  const [pendingValue, setPendingValue] = useState<CalendarRange<TValue>>(rangeValue)
  const [activePart, setActivePart] = useState<'start' | 'end'>('start')
  const [hoverValue, setHoverValue] = useState<TValue | null>(null)
  const [panel, setPanelState] = useState<CalendarPanel>(getDefaultPanelByPicker(picker))
  const [viewDate, setViewDate] = useState<CalendarDate>(getCalendarToday())
  const activeRangeValue = needConfirm ? pendingValue : rangeValue
  const allowEmpty = normalizeAllowEmpty(options.allowEmpty)
  const resetPanel = useMemoizedFn((part?: 'start' | 'end') => {
    setPanelState(getDefaultPanelByPicker(picker))
    const selected = rangeValue.start ?? rangeValue.end
    setViewDate(selected ? getCalendarValueDate(selected) : getCalendarToday())
    setPendingValue(rangeValue)
    setActivePart(part ?? (rangeValue.start ? 'end' : 'start'))
    setHoverValue(null)
  })
  const setOpen = useMemoizedFn((nextOpen: boolean, part?: 'start' | 'end') => {
    if (nextOpen && !open) resetPanel(part)
    else if (nextOpen && part) setActivePart(part)
    setOpenState(nextOpen)
  })
  const close = useMemoizedFn(() => setOpen(false))
  const setPanel = useMemoizedFn((nextPanel: CalendarPanel) => {
    setPanelState(nextPanel)
  })
  const select = useMemoizedFn((nextValue: TValue) => {
    const nextRange = createNextRangeValue(activeRangeValue, nextValue, activePart, options.order ?? true)
    setHoverValue(null)
    if (needConfirm) setPendingValue(nextRange)
    else setRangeValue(nextRange)
    const nextActivePart = getNextRangeActivePart(nextRange)
    if (nextActivePart) {
      setActivePart(nextActivePart)
      return
    }
    if (!needConfirm) close()
  })
  const confirm = useMemoizedFn(() => {
    setRangeValue(pendingValue)
    close()
  })
  const cancel = useMemoizedFn(() => {
    setPendingValue(rangeValue)
    close()
  })
  const clear = useMemoizedFn(() => {
    const next: CalendarRange<TValue> = {}
    setPendingValue(next)
    setRangeValue(next)
    setHoverValue(null)
  })
  const disabledDate = useMemoizedFn((date: CalendarDate, part: 'start' | 'end') => createDatePickerDisabledDate({
    picker,
    panel,
    ...(options.minDate ? { minDate: options.minDate } : {}),
    ...(options.maxDate ? { maxDate: options.maxDate } : {}),
    ...(options.disabledDate ? { disabledDate: (currentDate, info) => Boolean(options.disabledDate?.(currentDate, info.activePart ?? part)) } : {}),
  })(date, { activePart: part, from: getRangeFromValue(activeRangeValue, part), rangeValue: activeRangeValue }))

  return {
    picker,
    status: options.status,
    needConfirm,
    disabled: options.disabled ?? false,
    readOnly: options.readOnly ?? false,
    allowClear: options.allowClear ?? true,
    allowEmpty,
    format: options.format ?? getDefaultDatePickerFormat(picker),
    weekStartsOn: options.weekStartsOn ?? 0,
    ...(options.minDate ? { minDate: options.minDate } : {}),
    ...(options.maxDate ? { maxDate: options.maxDate } : {}),
    disabledDate,
    open,
    panel,
    viewDate,
    rangeValue: activeRangeValue,
    activePart,
    hoverValue,
    setPanel,
    setViewDate,
    setOpen,
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
