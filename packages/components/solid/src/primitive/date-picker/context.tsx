import type { CalendarDate, CalendarPanel, CalendarRange, CalendarValue, CalendarWeekday } from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export type DatePickerSelectionValue<TValue extends CalendarValue = CalendarValue> = TValue | readonly TValue[] | null

export interface DatePickerContextValue<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  multiple: boolean
  needConfirm: boolean
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  format: string
  weekStartsOn: CalendarWeekday
  open: Accessor<boolean>
  panel: Accessor<CalendarPanel>
  viewDate: Accessor<CalendarDate>
  value: Accessor<DatePickerSelectionValue<TValue>>
  calendarValue: Accessor<TValue | null>
  calendarValues: Accessor<readonly TValue[]>
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate) => boolean
  setPanel: (panel: CalendarPanel) => void
  setViewDate: (viewDate: CalendarDate) => void
  setOpen: (open: boolean) => void
  openPanel: () => void
  close: () => void
  clear: () => void
  confirm: () => void
  cancel: () => void
  select: (value: TValue) => void
}

export interface RangePickerContextValue<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  needConfirm: boolean
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  allowEmpty: { start: boolean; end: boolean }
  format: string
  weekStartsOn: CalendarWeekday
  open: Accessor<boolean>
  panel: Accessor<CalendarPanel>
  viewDate: Accessor<CalendarDate>
  rangeValue: Accessor<CalendarRange<TValue>>
  activePart: Accessor<'start' | 'end'>
  hoverValue: Accessor<TValue | null>
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate, activePart: 'start' | 'end') => boolean
  setPanel: (panel: CalendarPanel) => void
  setViewDate: (viewDate: CalendarDate) => void
  setOpen: (open: boolean) => void
  setActivePart: (part: 'start' | 'end') => void
  setHoverValue: (value: TValue | null) => void
  openPanel: (part?: 'start' | 'end') => void
  close: () => void
  clear: () => void
  confirm: () => void
  cancel: () => void
  select: (value: TValue) => void
}

export const DatePickerContext = createContext<DatePickerContextValue>()
export const RangePickerContext = createContext<RangePickerContextValue>()

export function useDatePickerContext(component: string): DatePickerContextValue {
  const context = useContext(DatePickerContext)
  if (!context) throw new Error(`${component} must be used within DatePickerRoot`)
  return context
}

export function useRangePickerContext(component: string): RangePickerContextValue {
  const context = useContext(RangePickerContext)
  if (!context) throw new Error(`${component} must be used within RangePickerRoot`)
  return context
}
