import {
  getCalendarToday,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex-design/core/calendar'
import {
  getCalendarValueDate,
  getCalendarValueKey,
  isSameCalendarValue,
} from '@fex-design/core/calendar/value'
import { createDatePickerDisabledDate } from '@fex-design/core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex-design/core/date-picker/panel'
import { getDefaultDatePickerFormat } from '@fex-design/core/date-picker/value'
import type { DatePickerPicker } from '@fex-design/core/date-picker/types'
import { useState } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
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

function valuesEqual(left: DatePickerSelectionValue, right: DatePickerSelectionValue) {
  const leftValues = isSelectionArray(left) ? left : null
  const rightValues = isSelectionArray(right) ? right : null
  if (leftValues || rightValues) {
    const leftKeys = new Set((leftValues ?? []).map(getCalendarValueKey))
    const rightKeys = new Set((rightValues ?? []).map(getCalendarValueKey))
    return leftKeys.size === rightKeys.size && [...leftKeys].every((key) => rightKeys.has(key))
  }
  const leftValue = isSelectionArray(left) ? null : left
  const rightValue = isSelectionArray(right) ? null : right
  return isSameCalendarValue(leftValue ?? null, rightValue ?? null)
}

function isSelectionArray(value: DatePickerSelectionValue): value is readonly CalendarValue[] {
  return Array.isArray(value)
}

export function useDatePicker<TValue extends CalendarValue = CalendarValue>(
  options: UseDatePickerOptions<TValue>,
): DatePickerContextValue<TValue> {
  const picker = options.picker ?? 'date'
  const multiple = options.multiple ?? false
  const needConfirm = options.needConfirm ?? multiple
  const [value, setValue] = useControllableState<DatePickerSelectionValue<TValue>>(
    {
      value: options.value,
      defaultValue: options.defaultValue,
      onChange: options.onChange,
      isEqual: valuesEqual,
    },
    { defaultValue: multiple ? [] : null },
  )
  const [open, setOpenState] = useControllableState<boolean>(
    { value: options.open, defaultValue: options.defaultOpen, onChange: options.onOpenChange },
    { defaultValue: false },
  )
  const [panel, setPanelState] = useState<CalendarPanel>(getDefaultPanelByPicker(picker))
  const [viewDate, setViewDate] = useState<CalendarDate>(getCalendarToday())
  const [pendingValue, setPendingValue] = useState<DatePickerSelectionValue<TValue>>(value)
  const activeValue = needConfirm ? pendingValue : value
  const calendarValues = isSelectionArray(activeValue) ? activeValue : []
  const calendarValue = isSelectionArray(activeValue) ? null : activeValue

  const setPanel = useMemoizedFn((nextPanel: CalendarPanel) => {
    setPanelState(nextPanel)
  })
  const resetPanel = useMemoizedFn(() => {
    setPanelState(getDefaultPanelByPicker(picker))
    const selected = Array.isArray(value) ? value[0] : value
    setViewDate(selected ? getCalendarValueDate(selected) : getCalendarToday())
    setPendingValue(value)
  })
  const setOpen = useMemoizedFn((nextOpen: boolean) => {
    if (nextOpen && !open) resetPanel()
    setOpenState(nextOpen)
  })
  const close = useMemoizedFn(() => setOpen(false))
  const clear = useMemoizedFn(() => {
    const emptyValue = multiple ? [] : null
    setPendingValue(emptyValue)
    setValue(emptyValue)
  })
  const confirm = useMemoizedFn(() => {
    setValue(pendingValue)
    close()
  })
  const cancel = useMemoizedFn(() => {
    setPendingValue(value)
    close()
  })
  const select = useMemoizedFn((nextValue: TValue) => {
    if (multiple) {
      const current = Array.isArray(activeValue) ? activeValue : []
      const selected = current.some((item) => isSameCalendarValue(item, nextValue))
      const next = selected
        ? current.filter((item) => !isSameCalendarValue(item, nextValue))
        : [...current, nextValue]
      if (needConfirm) setPendingValue(next)
      else setValue(next)
      return
    }
    if (needConfirm) {
      setPendingValue(nextValue)
      return
    }
    setValue(nextValue)
    close()
  })

  return {
    picker,
    status: options.status,
    multiple,
    needConfirm,
    disabled: options.disabled ?? false,
    readOnly: options.readOnly ?? false,
    allowClear: options.allowClear ?? true,
    format: options.format ?? getDefaultDatePickerFormat(picker),
    weekStartsOn: options.weekStartsOn ?? 0,
    ...(options.minDate ? { minDate: options.minDate } : {}),
    ...(options.maxDate ? { maxDate: options.maxDate } : {}),
    disabledDate: createDatePickerDisabledDate({
      picker,
      panel,
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      ...(options.disabledDate ? { disabledDate: options.disabledDate } : {}),
    }),
    open,
    panel,
    viewDate,
    value: activeValue,
    calendarValue,
    calendarValues,
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
